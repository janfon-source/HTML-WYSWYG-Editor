# HTML WYSWYG Editor

Version 2026.a29. The library is called `ERPEditor` in code (global `ERPEditor`, npm name `erp-editor`).

A lightweight, dependency-free WYSIWYG editor for admin panels and business systems, with a built-in HTML sanitizer that has a matching PHP version.

- **No dependencies**: plain JavaScript (UMD). Works with a `<script>` tag, webpack/Vite `import`, or `require()`. jQuery and Bootstrap are optional.
- **Small**: 28 KB JS + 7 KB CSS minified, with the icons built in.
- **Safe by default**: pasted content, `setHTML()` and `getHTML()` all go through a whitelist sanitizer. `php/erp_sanitize_html.php` applies the same rules on the server.
- **Form-friendly**: attach it to a `<textarea>` and it stays in sync, so forms submit as usual.
- **Theming**: CSS variables, automatic dark mode, and it follows Bootstrap 5.3 `--bs-*` colors when they are present.
- **UI languages**: Traditional Chinese (default) and English, or your own strings.

## Install

```sh
# copy the files
cp dist/erp-editor.min.js dist/erp-editor.min.css  your-site/assets/

# or as a local npm dependency
npm install github:janfon-source/HTML-WYSWYG-Editor
```

```html
<link rel="stylesheet" href="erp-editor.min.css">
<script src="erp-editor.min.js"></script>
```

```js
// bundlers
import ERPEditor from 'erp-editor';
import 'erp-editor/dist/erp-editor.css';
```

## Quick start

```html
<div id="editor"><p>Initial content</p></div>
<script>
  const editor = ERPEditor.create('#editor', { placeholder: 'Type here…', height: 300 });
  const html = editor.getHTML();   // sanitized HTML, '' when empty
</script>
```

Attaching to a textarea (form submit needs no extra code):

```html
<form method="post" action="save.php">
  <textarea name="content"></textarea>
</form>
<script>ERPEditor.create('textarea[name=content]');</script>
```

On the server, always sanitize again before saving:

```php
require_once 'php/erp_sanitize_html.php';
$content = erp_sanitize_html($_POST['content'] ?? '');
```

## Documentation

- [Tutorial](docs/TUTORIAL.md): step by step, from the first editor to uploads, Bootstrap modals and the PHP back end
- [API reference](docs/API.md): options, methods, events, CSS variables
- [Migrating from Froala / the Ahead ERP version](docs/MIGRATION.md)
- [Examples](examples/): run `npm run serve`, then open <http://localhost:8090/examples/>

## Browser support

Current Chrome, Edge, Firefox and Safari. The editor uses `contenteditable` and `document.execCommand`. `execCommand` is marked deprecated, but every browser still supports it, and it remains the only way to get native undo/redo in a `contenteditable` editor.

## Development

```sh
npm install      # installs terser (only needed for building)
npm run build    # src/ -> dist/ (plain + .min)
npm test         # headless Chrome tests; PHP sanitizer tests too when php is available
npm run serve    # http://localhost:8090/examples/
```

`test/cases.json` is shared by the JS and PHP tests, so the two sanitizers stay in step.

## License

MIT. Icons are from [Bootstrap Icons](https://icons.getbootstrap.com) (MIT); see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

---

# 中文說明

版本 2026.a29。程式裡的名稱是 `ERPEditor`（全域變數 `ERPEditor`，npm 套件名 `erp-editor`）。

輕量、零相依的所見即所得（WYSIWYG）編輯器，適合後台管理系統、ERP 的公告、備註、內容編輯，並內建前後端一致的 HTML 安全過濾。

- **零相依**：純 JavaScript（UMD），`<script>`、webpack／Vite `import`、`require()` 都能用；jQuery、Bootstrap 都不是必要。
- **輕量**：壓縮後 JS 28 KB、CSS 7 KB，icon 已內嵌。
- **預設安全**：貼上的內容、`setHTML()`、`getHTML()` 都經過白名單過濾；`php/erp_sanitize_html.php` 在後端套用相同規則。
- **表單友善**：直接綁在 `<textarea>` 上，內容自動同步，表單照常送出。
- **外觀可調**：CSS 變數、自動深色模式；有 Bootstrap 5.3 時沿用 `--bs-*` 顏色。
- **介面語系**：預設繁體中文，內建英文，也可自訂文字。

## 安裝

```sh
# 直接複製檔案
cp dist/erp-editor.min.js dist/erp-editor.min.css  你的網站/assets/

# 或用 npm 安裝本機套件
npm install github:janfon-source/HTML-WYSWYG-Editor
```

```html
<link rel="stylesheet" href="erp-editor.min.css">
<script src="erp-editor.min.js"></script>
```

```js
// 使用 bundler 時
import ERPEditor from 'erp-editor';
import 'erp-editor/dist/erp-editor.css';
```

## 快速開始

```html
<div id="editor"><p>初始內容</p></div>
<script>
  const editor = ERPEditor.create('#editor', { placeholder: '請輸入內容…', height: 300 });
  const html = editor.getHTML();   // 已過濾的 HTML；沒有內容時回傳 ''
</script>
```

綁定 textarea（表單送出不用另外寫程式）：

```html
<form method="post" action="save.php">
  <textarea name="content"></textarea>
</form>
<script>ERPEditor.create('textarea[name=content]');</script>
```

後端存檔前一定要再過濾一次：

```php
require_once 'php/erp_sanitize_html.php';
$content = erp_sanitize_html($_POST['content'] ?? '');
```

## 文件

- [教學](docs/TUTORIAL.md)：從第一個編輯器一路到圖片上傳、Bootstrap modal、PHP 後端
- [API 參考](docs/API.md)：選項、方法、事件、CSS 變數
- [從 Froala 或 Ahead ERP 內建版移轉](docs/MIGRATION.md)
- [範例](examples/)：執行 `npm run serve`，開啟 <http://localhost:8090/examples/>

## 瀏覽器支援

支援目前版本的 Chrome、Edge、Firefox、Safari。編輯器以 `contenteditable` 加 `document.execCommand` 實作。`execCommand` 雖然被標為 deprecated，但所有瀏覽器仍完整支援，而且是 `contenteditable` 編輯器取得原生復原／重做的唯一方式。

## 開發

```sh
npm install      # 安裝 terser（只有 build 需要）
npm run build    # src/ → dist/（未壓縮版與 .min 版）
npm test         # headless Chrome 測試；有 php 時一併測試 PHP 過濾器
npm run serve    # http://localhost:8090/examples/
```

`test/cases.json` 由 JS 與 PHP 兩邊的測試共用，確保前後端過濾規則一致。

## 授權

MIT。Icon 取自 [Bootstrap Icons](https://icons.getbootstrap.com)（MIT），見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
