# 移轉指南

## 從 Froala Editor 移轉

| Froala | ERPEditor |
|---|---|
| `new FroalaEditor('#el', {}, function () { editor = this; })` | `var editor = ERPEditor.create('#el')`（同步回傳，不需要 callback） |
| `editor.html.get()` | `editor.getHTML()`（已過濾） |
| `editor.html.set(html)` | `editor.setHTML(html)` |
| `editor.html.insert(html)` | `editor.insertHTML(html)` |
| `editor.core.isEmpty()` | `editor.isEmpty()` |
| `editor.edit.off()` / `editor.edit.on()` | `editor.setReadOnly(true)` / `setReadOnly(false)` |
| `editor.codeView.toggle()` | `editor.toggleSource()` |
| `editor.destroy()` | `editor.destroy()` |
| `events: { contentChanged: fn }` | `onChange: fn` 或 `editor.on('change', fn)` |
| `placeholderText` | `placeholder` |
| `heightMin` / `heightMax` | `height` / `maxHeight` |
| `toolbarButtons` | `toolbar`（群組陣列，名稱見 [API](API.md#工具列項目)） |
| `imageUploadURL` | `imageUpload: function (file) { … return Promise<url> }` |
| `language: 'zh_tw'` | `lang: 'zh-TW'`（預設） |

注意事項：

- Froala 每次 `new` 都會產生新的編輯器；ERPEditor 對同一元素重複 `create()` 回傳同一個，**不需要**在每次開 modal 時重建。
- Froala 的 CSS（`froala_editor.min.css` 等）與套件可以整個移除。
- 舊資料裡 Froala 產生的 `class="fr-..."`、`data-*` 屬性在載入時會被過濾掉，內容與基本格式不受影響。

## Ahead ERP 內建版（core/ERP_editor.js）換成本套件

Ahead ERP 的 `src/assets/js/core/ERP_editor.js` 是本套件的前身（依賴 jQuery 與 Bootstrap dropdown、bootstrap-icons）。本套件保留相同的呼叫方式：

| 內建版 | 本套件 |
|---|---|
| `ERP_editor('#el', { placeholder, height })` | 相同（全域別名），或 `ERPEditor.create(…)` |
| `getHTML()` `setHTML()` `clear()` `isEmpty()` `focus()` `toggleSource()` | 相同 |
| `erp_editor_sanitize(html)` | 相同（全域別名），或 `ERPEditor.sanitize(html)` |
| 後端 `dist/ajax/lib_html.php` 的 `erp_sanitize_html()` | `php/erp_sanitize_html.php`，函式名稱與規則相同 |
| 工具列 icon 用 bootstrap-icons 字型 | icon 內嵌 SVG，不需要 icon 字型 |
| 顏色選單用 Bootstrap dropdown | 自帶調色盤，不需要 Bootstrap JS |

替換步驟（webpack 專案，2026-10-29 已在 Ahead ERP 完成）：

1. 把本套件的 `dist/erp-editor.js`、`dist/erp-editor.css` 複製到專案的 `src/assets/vendor/erp-editor/`。
   不用 `npm install /Users/jeff/game/WYSWYG_Editor`：那只會在 package.json 記下本機路徑，伺服器上 build 時沒有這個路徑。
2. `src/assets/js/app.js`：把 `import './core/ERP_editor.js'` 換成
   ```js
   import ERPEditor from '../vendor/erp-editor/erp-editor.js';
   window.ERPEditor = ERPEditor;
   window.ERP_editor = ERPEditor.create;
   window.erp_editor_sanitize = ERPEditor.sanitize;
   ```
3. `src/assets/scss/style.scss`：把 `@import "_ERP-editor.scss";` 換成 `@import '../vendor/erp-editor/erp-editor.css';`
4. 刪除 `core/ERP_editor.js` 與 `_ERP-editor.scss`。
5. modal 的程式不用改。
6. `dist/ajax/lib_html.php` 與本套件的 `php/erp_sanitize_html.php` 規則相同，可保留。

之後套件更新時：在套件目錄 `npm run build && npm test`，再把 `dist/` 的兩個檔案複製過去、重新 build。

新增的功能：`change` / `focus` / `blur` 事件、唯讀、全螢幕、綁定 textarea、`imageUpload`（貼上／拖放圖片）、自訂對話框、英文介面、CSS 變數與深色模式。
