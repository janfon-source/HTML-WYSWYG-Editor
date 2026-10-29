# ERPEditor 教學

這份教學從零開始，一步步把 ERPEditor 加進一個後台系統：建立編輯器、存進資料庫、顯示出來，再處理圖片上傳、modal、外觀。每一節都對應 `examples/` 裡可以直接打開的範例。

完整的選項與方法清單請看 [API 參考](API.md)。

**目錄**

1. [準備檔案](#1-準備檔案)
2. [第一個編輯器](#2-第一個編輯器)
3. [讀取與設定內容](#3-讀取與設定內容)
4. [放進表單送出](#4-放進表單送出)
5. [必填檢查與 change 事件](#5-必填檢查與-change-事件)
6. [後端：過濾後存進資料庫](#6-後端過濾後存進資料庫)
7. [顯示內容](#7-顯示內容)
8. [自訂工具列與語系](#8-自訂工具列與語系)
9. [圖片上傳](#9-圖片上傳)
10. [用自己的對話框取代 prompt()](#10-用自己的對話框取代-prompt)
11. [在 Bootstrap modal 裡使用](#11-在-bootstrap-modal-裡使用)
12. [調整外觀](#12-調整外觀)
13. [常見問題](#13-常見問題)

---

## 1. 準備檔案

只需要兩個檔案：

```
dist/erp-editor.min.js
dist/erp-editor.min.css
```

複製到網站的靜態檔案目錄，例如 `assets/vendor/erp-editor/`。如果後端要過濾（**一定要**，見第 6 節），再把 `php/erp_sanitize_html.php` 複製到後端程式能 `require` 的位置。

> 要看範例：在套件根目錄執行 `npm run serve`，開啟 <http://localhost:8090/examples/>。

使用 webpack 等 bundler 的專案：

```sh
npm install /path/to/WYSWYG_Editor
```

```js
import ERPEditor from 'erp-editor';
import 'erp-editor/dist/erp-editor.css';
window.ERPEditor = ERPEditor;   // 頁面 inline script 要用的話
```

## 2. 第一個編輯器

> 範例：[01-basic.html](../examples/01-basic.html)

```html
<link rel="stylesheet" href="assets/vendor/erp-editor/erp-editor.min.css">

<div id="editor"><p>試著選取文字，再按工具列的按鈕。</p></div>

<script src="assets/vendor/erp-editor/erp-editor.min.js"></script>
<script>
    var editor = ERPEditor.create('#editor', {
        placeholder: '請輸入內容…',
        height: 240
    });
</script>
```

重點：

- 容器裡原本的 HTML 會變成初始內容（也會先經過過濾）。
- `create()` 回傳的 `editor` 之後都用得到，存在變數裡。
- 同一個元素再呼叫一次 `create()`，拿到的是**同一個**編輯器，不會重複建立工具列。因此「每次打開表單都呼叫 create」也是安全的寫法。

## 3. 讀取與設定內容

```js
var html = editor.getHTML();      // '<p>試著選取文字…</p>'，沒有內容時是 ''
var text = editor.getText();      // 純文字，可用來算字數

editor.setHTML('<h2>會議紀錄</h2><p>…</p>');   // 換掉全部內容
editor.insertHTML('<b>插入</b>');             // 插在游標位置
editor.clear();                                // 清空
editor.isEmpty();                              // true / false
```

`getHTML()` 回傳的一定是**過濾過的** HTML。就算使用者切到原始碼模式貼了 `<script>`，也拿不到它。

## 4. 放進表單送出

> 範例：[02-form-textarea.html](../examples/02-form-textarea.html)、[07-jquery.html](../examples/07-jquery.html)

### 做法 A：直接綁在 textarea 上（最簡單）

```html
<form method="post" action="save.php">
    <input name="title">
    <textarea name="content"></textarea>
    <button>送出</button>
</form>

<script>
    ERPEditor.create('textarea[name=content]');
</script>
```

textarea 會被隱藏，編輯器放在它後面；每次內容改變都會寫回 textarea。所以傳統表單送出、`new FormData(form)`、`$form.serialize()` 都會帶到最新內容，**不用另外寫同步程式**。

### 做法 B：div + 隱藏欄位（既有 jQuery / AJAX 程式）

如果頁面原本就是 `<input type="hidden" name="content">` 搭配 `$.ajax`，送出前放進去即可：

```js
var editor = ERPEditor.create('#content_editor');

$('#btn-save').on('click', function () {
    $form.find("[name='content']").val(editor.getHTML());   // ← 別忘了這行
    $.ajax({ url: '/ajax/save.php', type: 'POST', data: $form.serialize() });
});
```

> 常見錯誤：只寫了 `var content = editor.getHTML();` 卻沒放進表單欄位，結果送出的內容是空的。

## 5. 必填檢查與 change 事件

> 範例：[03-api-events.html](../examples/03-api-events.html)

必填檢查用 `isEmpty()`。不要拿 `getHTML()` 跟 `'<p><br></p>'` 這類字串比，因為瀏覽器產生的空白內容寫法不一定相同：

```js
if (editor.isEmpty()) {
    alert('請輸入內容');
    editor.focus();
    return;
}
```

內容改變時要做事（即時預覽、字數、標記「尚未儲存」），用 `change` 事件：

```js
var dirty = false;

editor.on('change', function (html) {
    document.getElementById('preview').innerHTML = html;
    document.getElementById('count').textContent = editor.getText().length + ' 字';
    dirty = true;
});

window.addEventListener('beforeunload', function (e) {
    if (dirty) e.preventDefault();
});
```

`change` 只在內容**真的改變**時觸發；`setHTML(html, true)`（silent）不會觸發，適合「載入既有資料」的情況，載入後不會被誤判為已修改。

## 6. 後端：過濾後存進資料庫

> 範例：[php/form.php](../examples/php/form.php)（執行 `php -S localhost:8091 -t examples/php`）

前端的過濾只是方便，**不是安全措施**：任何人都可以繞過網頁，直接用 curl 對 API 送出 `<script>`。所以後端存檔前一定要再過濾一次：

```php
<?php
require_once __DIR__ . '/lib/erp_sanitize_html.php';

$title   = trim($_POST['title'] ?? '');
$content = erp_sanitize_html($_POST['content'] ?? '');

$stmt = $pdo->prepare('INSERT INTO posts (title, content) VALUES (:title, :content)');
$stmt->bindParam(':title', $title);
$stmt->bindParam(':content', $content);
$stmt->execute();

echo json_encode(['ok' => true]);
```

重點：

- `erp_sanitize_html()` 處理的是 **XSS**；SQL injection 要靠 prepared statement，兩者缺一不可。
- 資料庫欄位用 `TEXT` 或 `MEDIUMTEXT`，編碼 `utf8mb4`。允許 base64 貼圖時，內容可能很大，建議用 `MEDIUMTEXT`，或改用第 9 節的上傳方式。
- 前後端規則相同，正常操作下存進去的內容與 `getHTML()` 一致。

## 7. 顯示內容

存在資料庫裡的已經是過濾過的 HTML，可以直接輸出到頁面。在容器加上 `erp-editor-content`，圖片、表格、引言的樣式就和編輯時一樣：

```php
<div class="erp-editor-content"><?= $row['content'] ?></div>
```

```js
// AJAX 取回後顯示
$('#post_body').addClass('erp-editor-content').html(data.content);
```

資料如果可能來自其他地方（舊資料、匯入、其他系統寫入），顯示前在前端再過濾一次最保險：

```js
$('#post_body').html(ERPEditor.sanitize(data.content));
```

## 8. 自訂工具列與語系

> 範例：[04-toolbar-i18n.html](../examples/04-toolbar-i18n.html)

`toolbar` 是「群組的陣列」，群組之間會顯示分隔線。例如留言欄只需要幾個按鈕：

```js
ERPEditor.create('#comment', {
    height: 100,
    toolbar: [
        ['bold', 'italic', 'underline'],
        ['insertUnorderedList', 'createLink'],
        ['undo', 'redo']
    ]
});
```

所有可用的項目見 [API 參考：工具列項目](API.md#工具列項目)。傳 `toolbar: []` 會隱藏整個工具列。

語系：

```js
ERPEditor.create('#en', { lang: 'en' });

// 只改部分文字，其餘沿用繁體中文
ERPEditor.create('#x', { lang: { bold: '加粗', promptLink: '請貼上網址：' } });

// 新增整個語系
ERPEditor.languages['ja'] = Object.assign({}, ERPEditor.languages['en'], { bold: '太字', italic: '斜体' });
ERPEditor.create('#jp', { lang: 'ja' });
```

全站統一改預設值：

```js
ERPEditor.defaults.height = 200;
ERPEditor.defaults.colors = ['#000000', '#d9480f', '#1971c2'];
```

## 9. 圖片上傳

> 範例：[05-image-upload.html](../examples/05-image-upload.html)

不設定時，工具列的「插入圖片」只能輸入網址，貼上或拖放圖片檔會被忽略。設定 `imageUpload` 後，使用者可以**直接貼上截圖或拖放圖片檔**：

```js
var editor = ERPEditor.create('#editor', {
    imageUpload: function (file) {
        if (file.size > 5 * 1024 * 1024) return Promise.reject(new Error('圖片不可超過 5MB'));

        var fd = new FormData();
        fd.append('file', file);
        return fetch('/ajax/upload_image.php', { method: 'POST', body: fd })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (!data.url) throw new Error(data.error || '上傳失敗');
                return data.url;       // ← 回傳網址，編輯器會插入 <img src="網址">
            });
    }
});

editor.on('error', function (err) { alert(err.message); });
```

後端上傳端的參考寫法（重點是**檢查檔案真的是圖片**、用隨機檔名、存到不能執行 PHP 的目錄）：

```php
<?php
// upload_image.php
$f = $_FILES['file'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK) { echo json_encode(['error' => '上傳失敗']); exit; }
if ($f['size'] > 5 * 1024 * 1024)        { echo json_encode(['error' => '檔案太大']); exit; }

$types = [IMAGETYPE_PNG => 'png', IMAGETYPE_JPEG => 'jpg', IMAGETYPE_GIF => 'gif', IMAGETYPE_WEBP => 'webp'];
$type = @exif_imagetype($f['tmp_name']);   // 看檔案內容，不信任副檔名與 MIME
if (!isset($types[$type]))                { echo json_encode(['error' => '只接受 PNG、JPG、GIF、WebP']); exit; }

$name = bin2hex(random_bytes(16)) . '.' . $types[$type];
$dir  = __DIR__ . '/../uploads/editor/' . date('Ym');
if (!is_dir($dir)) mkdir($dir, 0755, true);
move_uploaded_file($f['tmp_name'], "$dir/$name");

echo json_encode(['url' => '/uploads/editor/' . date('Ym') . '/' . $name]);
```

> 沒有後端時，也可以像範例 05 一樣用 `FileReader` 轉成 `data:image/...` 直接存在內容裡。缺點是內容會很大，只適合少量小圖。不想允許 base64 圖片時，設定 `ERPEditor.rules.allowDataImage = false`。

## 10. 用自己的對話框取代 prompt()

插入連結、圖片、表格預設用瀏覽器的 `prompt()`。想換成系統自己的對話框時，提供一個回傳網址（或 Promise）的函式：

```js
ERPEditor.create('#editor', {
    promptLink: function (defaultUrl) {
        return new Promise(function (resolve) {
            // 開啟自己的 modal，按確定時 resolve(網址)，取消時 resolve(null)
            myDialog.open({ value: defaultUrl, onOk: resolve, onCancel: function () { resolve(null); } });
        });
    },
    promptTable: function () {
        return { rows: 3, cols: 4 };   // 不詢問，固定大小
    }
});
```

範例 05 用原生 `<dialog>` 實作了一個完整的版本。

## 11. 在 Bootstrap modal 裡使用

> 範例：[06-bootstrap-modal.html](../examples/06-bootstrap-modal.html)

後台常見的「新增／編輯」modal，有三個重點：

```js
// ① 編輯器只建立一次（頁面載入時），不要每次開 modal 都重建
var editor = ERPEditor.create('#post_content', { height: 260, maxHeight: 500 });

function openNew() {
    form.reset();
    editor.clear();                          // ② 新增：清空
    modal.show();
}

function openEdit(post) {
    form.reset();
    editor.setHTML(post.content, true);      // ② 編輯：載入既有內容（silent，不觸發 change）
    modal.show();
}

// ③ 要自動 focus 的話，等 modal 動畫結束
modalEl.addEventListener('shown.bs.modal', function () { editor.focus(); });
```

- 同一頁有「新增」和「編輯」兩個 modal 時，兩個編輯器要用**不同的變數名稱**與**不同的元素 id**，不要共用一個全域 `editor`。
- `form.reset()` 不會清空編輯器（編輯器不是表單欄位），要自己呼叫 `clear()` 或 `setHTML()`。
- 有 Bootstrap 5.3 時，編輯器自動使用 `--bs-*` 顏色，`data-bs-theme="dark"` 也會一起變深色。

## 12. 調整外觀

所有顏色與圓角都是 CSS 變數，可以針對單一編輯器或全站覆寫：

```css
/* 全站 */
:root .erp-editor {
    --erp-editor-radius: 10px;
    --erp-editor-active-color: #d9480f;
}

/* 單一編輯器：先 editor.root.classList.add('brand') */
.erp-editor.brand {
    --erp-editor-border: #f08c00;
    --erp-editor-toolbar-bg: #fff4e6;
}
```

- 跟隨系統深色模式是預設行為；`data-theme="light"` / `"dark"` 可以強制指定。
- 編輯區高度：`height`（最小）與 `maxHeight`（超過就捲動）兩個選項。
- 全部變數見 [API 參考：CSS 變數](API.md#css-變數與-class)。

## 13. 常見問題

**Q：送出後資料庫裡的內容是空的？**
用 div 建立編輯器時，送出前要把 `getHTML()` 放進表單欄位（第 4 節做法 B），或改成直接綁在 textarea 上（做法 A）。

**Q：從 Word 貼上後格式亂掉？**
貼上時會移除 Word 的私有標記與不安全的屬性，只保留結構（段落、清單、表格）與文字顏色、粗體等基本樣式。想完全不要格式，設定 `sanitizePaste: false`，一律以純文字貼上。

**Q：為什麼我放的 `<iframe>`（例如 YouTube）不見了？**
`iframe` 在預設的移除清單裡。確定要開放時，前端 `ERPEditor.rules` 與後端 `erp_sanitize_html.php` 都要改，而且建議只允許特定網域。

**Q：可以同一頁放好幾個編輯器嗎？**
可以，每個元素各自 `create()` 即可，彼此獨立。

**Q：表格可以合併儲存格嗎？**
目前不行。只能插入表格；儲存格合併可以切到原始碼模式手動加 `colspan` / `rowspan`。

**Q：`document.execCommand` 不是已經 deprecated 了？**
它仍被所有主流瀏覽器完整支援，而且是 `contenteditable` 編輯器取得原生「復原／重做」的唯一方法；許多輕量編輯器也採用相同做法。若未來瀏覽器真的移除，需改為自行操作 DOM 的實作。
