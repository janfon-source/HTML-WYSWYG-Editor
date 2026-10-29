# ERPEditor API 參考

版本 1.0.0

- [全域物件](#全域物件)
- [選項 options](#選項-options)
- [工具列項目](#工具列項目)
- [instance 方法](#instance-方法)
- [instance 屬性](#instance-屬性)
- [事件](#事件)
- [HTML 過濾規則](#html-過濾規則)
- [PHP：erp_sanitize_html()](#phperp_sanitize_html)
- [CSS 變數與 class](#css-變數與-class)
- [鍵盤快捷鍵](#鍵盤快捷鍵)

## 全域物件

用 `<script>` 載入時會建立以下全域變數；用 `import` / `require` 時取得的是 `ERPEditor` 物件本身。

| 名稱 | 說明 |
|---|---|
| `ERPEditor.create(target, options)` | 建立編輯器並回傳 instance。`target` 可以是 CSS selector、DOM 元素或 jQuery 物件。同一個元素重複呼叫會回傳**同一個** instance（第二次傳的 options 會被忽略）。找不到元素時回傳 `null`。 |
| `ERPEditor.get(target)` | 取得元素上已建立的 instance，沒有時回傳 `null`。 |
| `ERPEditor.sanitize(html)` | 用白名單過濾 HTML 字串，回傳安全的 HTML。可單獨使用，例如顯示資料前再過濾一次。 |
| `ERPEditor.safeUrl(url, allowDataImage)` | 檢查網址是否安全：允許 `http(s):`、`mailto:`、`tel:`、相對路徑；`allowDataImage` 為 true 時也允許 `data:image/*`。不安全時回傳 `''`。 |
| `ERPEditor.rules` | 過濾規則物件，可修改（見 [HTML 過濾規則](#html-過濾規則)）。 |
| `ERPEditor.languages` | 內建語系（`'zh-TW'`、`'en'`），可新增語系。 |
| `ERPEditor.defaults` | 預設選項，修改後影響之後建立的編輯器。 |
| `ERPEditor.defaultToolbar` | 預設工具列設定。 |
| `ERPEditor.Editor` | Editor 建構子，可用來擴充 prototype。 |
| `ERPEditor.version` | 版本字串。 |
| `ERP_editor(target, options)` | `ERPEditor.create` 的別名，相容 Ahead ERP 既有程式（只在 `<script>` 載入時建立）。 |
| `erp_editor_sanitize(html)` | `ERPEditor.sanitize` 的別名（只在 `<script>` 載入時建立）。 |

## 選項 options

| 選項 | 型別 | 預設 | 說明 |
|---|---|---|---|
| `placeholder` | string | `''` | 內容為空時顯示的提示文字。 |
| `height` | number | `300` | 編輯區最小高度（px）。 |
| `maxHeight` | number \| null | `null` | 編輯區最大高度（px），超過時出現捲軸。 |
| `lang` | string \| object | `'zh-TW'` | `'zh-TW'`、`'en'`，或物件（只覆寫部分文字，其餘沿用繁體中文）。可用的 key 見 `ERPEditor.languages['zh-TW']`。 |
| `toolbar` | array | 見下方 | 工具列，二維陣列：外層是群組（以分隔線隔開），內層是項目名稱。傳 `[]` 隱藏工具列。 |
| `colors` | string[] | 18 色 | 文字顏色、背景顏色的調色盤。 |
| `readOnly` | boolean | `false` | 建立時就是唯讀。 |
| `stickyToolbar` | boolean | `true` | 捲動時工具列固定在容器頂端（`position: sticky`）。 |
| `sanitizePaste` | boolean | `true` | 貼上 HTML 時過濾；設為 `false` 則一律以純文字貼上。 |
| `imageUpload` | `function(file) → Promise<string>` | `null` | 有設定時，貼上或拖放圖片檔會呼叫它，resolve 的網址會插入成 `<img>`；reject 時觸發 `error` 事件。沒設定時不接受貼上或拖放檔案。 |
| `promptLink` | `function(defaultUrl) → string \| Promise` | `null` | 取代「插入連結」的 `window.prompt()`。回傳 `null` 或空字串表示取消。 |
| `promptImage` | `function(defaultUrl) → string \| Promise` | `null` | 取代「插入圖片」的 `window.prompt()`。 |
| `promptTable` | `function() → {rows, cols} \| "3x4" \| Promise` | `null` | 取代「插入表格」的 `window.prompt()`。最多 50 列、20 欄。 |
| `onChange` | `function(html, editor)` | `null` | 等同 `editor.on('change', fn)`。 |
| `onFocus` | `function(editor)` | `null` | 等同 `editor.on('focus', fn)`。 |
| `onBlur` | `function(editor)` | `null` | 等同 `editor.on('blur', fn)`。 |
| `onReady` | `function(editor)` | `null` | 建立完成後呼叫一次。 |

## 工具列項目

預設值：

```js
[
  ['formatBlock', 'fontSize'],
  ['bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'hiliteColor'],
  ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
  ['insertUnorderedList', 'insertOrderedList', 'outdent', 'indent'],
  ['createLink', 'unlink', 'insertImage', 'insertTable', 'insertHorizontalRule'],
  ['removeFormat', 'undo', 'redo', 'source', 'fullscreen']
]
```

| 名稱 | 功能 |
|---|---|
| `formatBlock` | 下拉選單：內文、標題 1–4、引言、程式碼 |
| `fontSize` | 下拉選單：小、標準、中、大、特大（輸出 `<font size>`） |
| `bold` `italic` `underline` `strikeThrough` | 粗體、斜體、底線、刪除線 |
| `foreColor` `hiliteColor` | 文字顏色、背景顏色（調色盤） |
| `justifyLeft` `justifyCenter` `justifyRight` `justifyFull` | 對齊 |
| `insertUnorderedList` `insertOrderedList` | 項目符號、編號清單 |
| `outdent` `indent` | 減少、增加縮排 |
| `createLink` `unlink` | 插入連結（自動加 `target="_blank" rel="noopener noreferrer"`）、移除連結 |
| `insertImage` | 以網址插入圖片 |
| `insertTable` | 插入表格（`class="table table-bordered"`） |
| `insertHorizontalRule` | 分隔線 |
| `removeFormat` | 清除格式 |
| `undo` `redo` | 復原、重做 |
| `source` | 切換 HTML 原始碼模式 |
| `fullscreen` | 切換全螢幕（Esc 離開） |

不認得的名稱會被忽略。

## instance 方法

| 方法 | 回傳 | 說明 |
|---|---|---|
| `getHTML()` | string | 取得**已過濾**的 HTML，沒有內容時回傳 `''`。原始碼模式下取原始碼框的內容（同樣會過濾）。 |
| `setHTML(html, silent?)` | this | 設定內容（先過濾）。`silent` 為 true 時不觸發 `change`。 |
| `insertHTML(html)` | this | 在游標（或最後的選取）位置插入 HTML（先過濾）。 |
| `getText()` | string | 純文字內容，可用於字數統計。 |
| `clear()` | this | 清空內容，等同 `setHTML('')`。 |
| `isEmpty()` | boolean | 沒有文字、圖片、表格、分隔線時為 true。表單必填檢查請用這個。 |
| `focus()` | this | 讓編輯區取得焦點。 |
| `exec(command, value?)` | — | 執行工具列指令，例如 `exec('bold')`、`exec('foreColor', '#e03131')`、`exec('createLink', 'https://…')`、`exec('insertTable', {rows: 2, cols: 3})`。`createLink`、`insertImage`、`insertTable` 沒給 value 時會詢問使用者。 |
| `setReadOnly(flag)` | this | 切換唯讀。唯讀時工具列只剩全螢幕可用。 |
| `toggleSource(flag?)` | this | 切換原始碼模式；不給參數就是切換。離開時內容會重新過濾。 |
| `toggleFullscreen(flag?)` | this | 切換全螢幕。 |
| `on(event, fn)` | this | 註冊事件。 |
| `off(event, fn?)` | this | 移除事件；不給 `fn` 時移除該事件全部的 handler。 |
| `destroy()` | string | 移除編輯器並回傳最後的 HTML。綁在 div 上時，div 內容會換成這份 HTML；綁在 textarea 上時，textarea 重新顯示並帶著最新內容。之後可以再 `create()`。 |

## instance 屬性

唯讀參考用，請勿直接修改。

| 屬性 | 說明 |
|---|---|
| `root` | 編輯器外框元素（`.erp-editor`）。綁在 div 上時就是那個 div；綁在 textarea 上時是新建、緊接在 textarea 後面的 div。 |
| `toolbar` | 工具列元素。 |
| `area` | `contenteditable` 編輯區元素。 |
| `source` | 原始碼模式的 textarea。 |
| `textarea` | 綁定的原始 textarea，沒有時為 `null`。 |
| `options` | 合併後的選項。 |
| `readOnly` / `sourceMode` | 目前狀態。 |

## 事件

| 事件 | handler 參數 | 觸發時機 |
|---|---|---|
| `change` | `(html, editor)` | 內容實際改變時：輸入、工具列操作、貼上、`setHTML()`（非 silent）、離開原始碼模式。內容沒變不會觸發。 |
| `focus` | `(editor)` | 編輯區取得焦點。 |
| `blur` | `(editor)` | 編輯區失去焦點。 |
| `error` | `(error)` | `imageUpload` 回傳的 Promise reject。 |

handler 裡的 `this` 是 editor instance。

## HTML 過濾規則

`ERPEditor.sanitize()`、`getHTML()`、`setHTML()`、`insertHTML()`、貼上都使用同一套規則（`ERPEditor.rules`）：

1. **整個移除（含內容）**：`script style iframe object embed link meta title head form input button select textarea svg math`，以及 HTML 註解。
2. **允許的 tag**：`p div br span h1–h6 b strong i em u s strike del sub sup ul ol li blockquote pre code hr a img table thead tbody tr th td font`。
3. **其他 tag**（例如 Word 的 `<o:p>`、自訂元素）：拆掉 tag，保留裡面的文字。
4. **允許的 attribute**：`a[href target rel]`、`img[src alt width height]`、`th/td[colspan rowspan]`、`font[color size]`、`table[class]`，以及所有允許 tag 的 `style`。其他一律移除，包含所有 `on*` 事件、`id`、`class`、`data-*`。
5. **style** 只保留 `color background-color font-size font-weight font-style text-decoration text-align margin-left padding-left`，值裡有 `url(`、`expression(`、`javascript:`、`<`、`>` 的整條移除。
6. **class** 只保留 `table`、`table-*`（Bootstrap 表格樣式）。
7. **網址**（`href`、`src`）只允許 `http:`、`https:`、`mailto:`、`tel:`、相對路徑；`img src` 另外允許 `data:image/png|jpeg|gif|webp`。`javascript:`、`vbscript:`、`data:text/html` 等一律移除（會先去掉空白與控制字元再判斷）。
8. `target="_blank"` 的連結自動加上 `rel="noopener noreferrer"`。

修改規則（全域生效）：

```js
ERPEditor.rules.allowedTags.IFRAME = ['src', 'width', 'height'];      // 允許 iframe（不建議）
ERPEditor.rules.dropTags = ERPEditor.rules.dropTags.filter(t => t !== 'IFRAME');
ERPEditor.rules.allowedStyles.push('line-height');
ERPEditor.rules.allowDataImage = false;                              // 不允許 base64 圖片
```

**修改規則時，`php/erp_sanitize_html.php` 開頭的常數要一起改**，並在 `test/cases.json` 加測試案例。

## PHP：erp_sanitize_html()

```php
require_once __DIR__ . '/php/erp_sanitize_html.php';

$clean = erp_sanitize_html($html);   // null 或空字串原樣回傳
```

- PHP 7.1 以上。
- 有 DOM extension（`php-xml` 套件，大部分主機預設就有）時，用 `DOMDocument` 解析，規則與前端完全相同。
- 沒有 DOM extension 時，退回 `strip_tags` 加 regex 的保守過濾：只留白名單 tag，並移除所有事件、`style`、`class`、`id` 屬性與危險網址（文字顏色等樣式會遺失）。可用 `php -r 'var_dump(class_exists("DOMDocument"));'` 確認。
- 規則定義在檔案開頭的 `ERP_HTML_ALLOWED_TAGS`、`ERP_HTML_DROP_TAGS`、`ERP_HTML_ALLOWED_STYLES` 常數。

## CSS 變數與 class

在 `.erp-editor`（單一編輯器）或 `:root`（全站）覆寫：

| 變數 | 預設（淺色） | 說明 |
|---|---|---|
| `--erp-editor-bg` | `var(--bs-body-bg, #fff)` | 背景 |
| `--erp-editor-color` | `var(--bs-body-color, #212529)` | 文字 |
| `--erp-editor-border` | `var(--bs-border-color, #dee2e6)` | 框線 |
| `--erp-editor-toolbar-bg` | `var(--bs-tertiary-bg, #f8f9fa)` | 工具列背景 |
| `--erp-editor-hover-bg` | `var(--bs-secondary-bg, #e9ecef)` | 按鈕 hover |
| `--erp-editor-active-bg` | `var(--bs-primary-bg-subtle, #cfe2ff)` | 按鈕啟用中背景 |
| `--erp-editor-active-color` | `var(--bs-primary, #0d6efd)` | 按鈕啟用中顏色、連結顏色 |
| `--erp-editor-muted` | `var(--bs-secondary-color, #6c757d)` | placeholder、引言 |
| `--erp-editor-focus` | `var(--bs-focus-ring-color, …)` | 取得焦點時的外光暈 |
| `--erp-editor-radius` / `--erp-editor-radius-sm` | `6px` / `4px` | 圓角 |
| `--erp-editor-font` / `--erp-editor-mono` | `inherit` / 等寬字 | 字型 |
| `--erp-editor-z-fullscreen` | `1080` | 全螢幕時的 z-index |

主題：

- 預設跟隨系統深色模式（`prefers-color-scheme`）。
- 有 Bootstrap 5.3 時沿用 `--bs-*`，切換 `data-bs-theme` 即可。
- 在容器加 `data-theme="dark"` 強制深色、`data-theme="light"` 強制淺色。

狀態 class（加在 `.erp-editor` 上）：`is-focused`、`is-readonly`、`is-source`、`is-fullscreen`；編輯區為空時 `.erp-editor-area` 有 `is-empty`。

顯示端：在顯示內容的容器加 `class="erp-editor-content"`，圖片、表格、引言、程式碼區塊的樣式就和編輯時一致。

## 鍵盤快捷鍵

| 按鍵 | 功能 |
|---|---|
| Ctrl/⌘ + B / I / U | 粗體、斜體、底線（瀏覽器內建） |
| Ctrl/⌘ + Z / Y（或 ⇧⌘Z） | 復原、重做（瀏覽器內建） |
| Ctrl/⌘ + K | 插入連結 |
| Ctrl/⌘ + 點連結 | 在新分頁開啟連結 |
| Esc | 關閉調色盤、離開全螢幕 |
