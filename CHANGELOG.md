# Changelog

## 2026.a29 — 2026-10-29

第一個獨立版本，由 Ahead ERP 內建的 `core/ERP_editor.js` 改寫而來。

- 改為純 JavaScript（UMD），不再依賴 jQuery、Bootstrap、bootstrap-icons。
- 工具列：段落格式、字級、粗體／斜體／底線／刪除線、文字與背景顏色、對齊、清單、縮排、連結、圖片、表格、分隔線、清除格式、復原／重做、原始碼、全螢幕。
- 白名單 HTML 過濾（前端 `ERPEditor.sanitize`、後端 `php/erp_sanitize_html.php`，共用測試案例）。
- 綁定 textarea 自動同步；`change` / `focus` / `blur` / `error` 事件；唯讀；`destroy()`。
- `imageUpload`：貼上截圖、拖放圖片檔上傳。
- `promptLink` / `promptImage` / `promptTable`：可換成自訂對話框。
- 介面語系：繁體中文、英文，可自訂。
- CSS 變數、自動深色模式、沿用 Bootstrap 5.3 `--bs-*` 顏色。
