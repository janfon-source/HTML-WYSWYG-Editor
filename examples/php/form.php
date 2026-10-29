<?php
// PHP 後端過濾範例
// 執行：php -S localhost:8091 -t examples/php   然後開啟 http://localhost:8091/form.php
// 這個 PHP 內建伺服器的根目錄是 examples/php，所以 dist/ 用 ?asset= 轉送（只允許下面兩個檔案）
$assets = [
    'erp-editor.min.js' => 'text/javascript',
    'erp-editor.min.css' => 'text/css',
];
if (isset($_GET['asset'])) {
    $name = basename($_GET['asset']);
    if (!isset($assets[$name])) { http_response_code(404); exit; }
    header('Content-Type: ' . $assets[$name]);
    readfile(__DIR__ . '/../../dist/' . $name);
    exit;
}

require_once __DIR__ . '/../../php/erp_sanitize_html.php';

$raw = $_POST['content'] ?? '';
$clean = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 重點：前端的 getHTML() 已經過濾過，但任何人都能繞過前端直接 POST，所以存檔前一定要在後端再過濾一次
    $clean = erp_sanitize_html($raw);
    // 接著用 prepared statement 存入資料庫，例如：
    // $stmt = $pdo->prepare('INSERT INTO posts (content) VALUES (:content)');
    // $stmt->execute([':content' => $clean]);
}
function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="zh-Hant-TW">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PHP 後端過濾 - ERPEditor</title>
    <link rel="stylesheet" href="?asset=erp-editor.min.css">
    <style>
        body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 24px 16px; }
        pre { background: rgba(127,127,127,.1); padding: 12px; border-radius: 6px; white-space: pre-wrap; word-break: break-all; }
        .box { border: 1px dashed #aaa; padding: 12px; border-radius: 6px; }
    </style>
</head>
<body>
    <h1>PHP 後端過濾</h1>

    <form method="post">
        <textarea id="content" name="content"><?= h($clean ?? '<p>試著切到 <b>HTML 原始碼</b> 模式貼上 &lt;script&gt;，或用下面的按鈕直接 POST 惡意內容。</p>') ?></textarea>
        <p><button type="submit">送出（經過前端過濾）</button></p>
    </form>

    <form method="post">
        <input type="hidden" name="content" value="<?= h('<p onclick="alert(1)">繞過前端</p><script>alert(2)</script><img src=x onerror=alert(3)><a href="javascript:alert(4)">link</a>') ?>">
        <p><button type="submit">直接 POST 惡意 HTML（模擬繞過前端）</button></p>
    </form>

    <?php if ($clean !== null): ?>
        <h3>收到的原始內容</h3>
        <pre><?= h($raw) ?></pre>
        <h3>erp_sanitize_html() 之後</h3>
        <pre><?= h($clean) ?></pre>
        <h3>顯示結果</h3>
        <div class="box erp-editor-content"><?= $clean ?></div>
    <?php endif; ?>

    <script src="?asset=erp-editor.min.js"></script>
    <script>ERPEditor.create('#content', { height: 160 });</script>
</body>
</html>
