// 用 headless Chrome 跑 test/index.html；有 php 時也跑 test/sanitize_test.php
// 用法：npm test           （CHROME=/path/to/chrome 可指定瀏覽器）
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync, spawn } = require('child_process');

const root = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

function findChrome() {
    const list = [
        process.env.CHROME,
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
    ].filter(Boolean);
    return list.find((p) => fs.existsSync(p));
}

const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let file = path.normalize(path.join(root, url));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
    });
});

let failed = false;

function runBrowser(chrome, url) {
    // 非同步執行：同一個 process 的 http server 才能回應 Chrome 的請求
    return new Promise((resolve) => {
        const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'erp-editor-test-'));
        const child = spawn(chrome, [
            '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
            '--user-data-dir=' + profile, '--virtual-time-budget=5000', '--dump-dom', url
        ]);
        let stdout = '';
        const timer = setTimeout(() => child.kill(), 60000);
        child.stdout.on('data', (d) => { stdout += d; });
        child.on('close', () => {
            clearTimeout(timer);
            fs.rmSync(profile, { recursive: true, force: true });
            resolve(stdout);
        });
    });
}

server.listen(0, '127.0.0.1', async () => {
    const port = server.address().port;
    const chrome = findChrome();
    if (!chrome) {
        console.log('找不到 Chrome，略過瀏覽器測試（可設定 CHROME 環境變數）');
    } else {
        const stdout = await runBrowser(chrome, `http://127.0.0.1:${port}/test/index.html`);
        const m = stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/);
        const text = m ? m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : 'NO RESULT';
        console.log('[browser] ' + text.trim());
        if (!/^RESULT \d+ passed, 0 failed/.test(text)) failed = true;
    }
    server.close();

    const php = spawnSync('php', ['-v'], { encoding: 'utf8' });
    if (php.status === 0) {
        try {
            console.log('[php] ' + execFileSync('php', [path.join(root, 'test', 'sanitize_test.php')], { encoding: 'utf8' }).trim());
        } catch (e) {
            console.log('[php] ' + String(e.stdout || e.message).trim());
            failed = true;
        }
    } else {
        console.log('[php] 本機沒有可用的 php，略過（可在有 PHP 的主機執行 php test/sanitize_test.php）');
    }
    process.exit(failed ? 1 : 0);
});
