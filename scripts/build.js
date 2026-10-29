// 產生 dist/：未壓縮版（直接複製）＋ .min 版
// 用法：npm run build
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const root = path.join(__dirname, '..');
const src = (f) => path.join(root, 'src', f);
const dist = (f) => path.join(root, 'dist', f);

function minifyCss(css) {
    const banner = (css.match(/^\/\*![\s\S]*?\*\//) || [''])[0];
    const body = css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,>])\s*/g, '$1')
        .replace(/;}/g, '}')
        .trim();
    return (banner ? banner + '\n' : '') + body + '\n';
}

(async () => {
    fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

    const js = fs.readFileSync(src('erp-editor.js'), 'utf8');
    fs.writeFileSync(dist('erp-editor.js'), js);
    const out = await minify(js, {
        compress: true,
        mangle: true,
        format: { comments: /^!/ }
    });
    fs.writeFileSync(dist('erp-editor.min.js'), out.code + '\n');

    const css = fs.readFileSync(src('erp-editor.css'), 'utf8');
    fs.writeFileSync(dist('erp-editor.css'), css);
    fs.writeFileSync(dist('erp-editor.min.css'), minifyCss(css));

    for (const f of ['erp-editor.js', 'erp-editor.min.js', 'erp-editor.css', 'erp-editor.min.css']) {
        const size = fs.statSync(dist(f)).size;
        console.log(`dist/${f.padEnd(20)} ${(size / 1024).toFixed(1)} KB`);
    }
})().catch((err) => { console.error(err); process.exit(1); });
