/*!
 * ERPEditor v2026.a29 — lightweight, dependency-free WYSIWYG editor
 * Icons: Bootstrap Icons (MIT, https://icons.getbootstrap.com)
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        var lib = factory();
        root.ERPEditor = lib;
        root.ERP_editor = lib.create;          // 相容 aheadx ERP 舊寫法
        root.erp_editor_sanitize = lib.sanitize;
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var VERSION = '2026.a29';

    /* ------------------------------------------------------------------
       Icons (Bootstrap Icons, viewBox 0 0 16 16)
       ------------------------------------------------------------------ */
    var ICONS = {
        bold: '<path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>',
        italic: '<path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>',
        underline: '<path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"/>',
        strikeThrough: '<path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967"/>',
        foreColor: '<path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479z"/>',
        hiliteColor: '<path fill-rule="evenodd" d="M11.096.644a2 2 0 0 1 2.791.036l1.433 1.433a2 2 0 0 1 .035 2.791l-.413.435-8.07 8.995a.5.5 0 0 1-.372.166h-3a.5.5 0 0 1-.234-.058l-.412.412A.5.5 0 0 1 2.5 15h-2a.5.5 0 0 1-.354-.854l1.412-1.412A.5.5 0 0 1 1.5 12.5v-3a.5.5 0 0 1 .166-.372l8.995-8.07zm-.115 1.47L2.727 9.52l3.753 3.753 7.406-8.254zm3.585 2.17.064-.068a1 1 0 0 0-.017-1.396L13.18 1.387a1 1 0 0 0-1.396-.018l-.068.065zM5.293 13.5 2.5 10.707v1.586L3.707 13.5z"/>',
        justifyLeft: '<path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>',
        justifyCenter: '<path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>',
        justifyRight: '<path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>',
        justifyFull: '<path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>',
        insertUnorderedList: '<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>',
        insertOrderedList: '<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/><path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>',
        outdent: '<path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m10.646 2.146a.5.5 0 0 1 .708.708L11.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zM2 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>',
        indent: '<path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708M7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>',
        createLink: '<path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>',
        unlink: '<path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/><path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>',
        insertImage: '<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>',
        insertTable: '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>',
        insertHorizontalRule: '<path d="M12 3H4a1 1 0 0 0-1 1v2.5H2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5h-1V4a1 1 0 0 0-1-1M2 9.5h1V12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5h1V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm-1.5-2a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1z"/>',
        removeFormat: '<path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>',
        undo: '<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>',
        redo: '<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>',
        source: '<path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>',
        fullscreen: '<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"/>',
        none: '<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>'
    };

    /* ------------------------------------------------------------------
       Languages
       ------------------------------------------------------------------ */
    var LANGS = {
        'zh-TW': {
            formatBlock: '段落格式', P: '內文', H1: '標題 1', H2: '標題 2', H3: '標題 3', H4: '標題 4', BLOCKQUOTE: '引言', PRE: '程式碼',
            fontSize: '字級', fs2: '小', fs3: '標準', fs4: '中', fs5: '大', fs6: '特大',
            bold: '粗體', italic: '斜體', underline: '底線', strikeThrough: '刪除線',
            foreColor: '文字顏色', hiliteColor: '背景顏色', noColor: '無背景色',
            justifyLeft: '靠左', justifyCenter: '置中', justifyRight: '靠右', justifyFull: '左右對齊',
            insertUnorderedList: '項目符號', insertOrderedList: '編號', outdent: '減少縮排', indent: '增加縮排',
            createLink: '插入連結', unlink: '移除連結', insertImage: '插入圖片', insertTable: '插入表格', insertHorizontalRule: '分隔線',
            removeFormat: '清除格式', undo: '復原', redo: '重做', source: 'HTML 原始碼', fullscreen: '全螢幕',
            promptLink: '連結網址', promptImage: '圖片網址', promptTable: '表格大小（列 x 欄）'
        },
        'en': {
            formatBlock: 'Paragraph format', P: 'Normal', H1: 'Heading 1', H2: 'Heading 2', H3: 'Heading 3', H4: 'Heading 4', BLOCKQUOTE: 'Quote', PRE: 'Code',
            fontSize: 'Font size', fs2: 'Small', fs3: 'Normal', fs4: 'Medium', fs5: 'Large', fs6: 'Huge',
            bold: 'Bold', italic: 'Italic', underline: 'Underline', strikeThrough: 'Strikethrough',
            foreColor: 'Text color', hiliteColor: 'Highlight', noColor: 'No highlight',
            justifyLeft: 'Align left', justifyCenter: 'Center', justifyRight: 'Align right', justifyFull: 'Justify',
            insertUnorderedList: 'Bulleted list', insertOrderedList: 'Numbered list', outdent: 'Decrease indent', indent: 'Increase indent',
            createLink: 'Insert link', unlink: 'Remove link', insertImage: 'Insert image', insertTable: 'Insert table', insertHorizontalRule: 'Horizontal line',
            removeFormat: 'Clear formatting', undo: 'Undo', redo: 'Redo', source: 'HTML source', fullscreen: 'Fullscreen',
            promptLink: 'Link URL', promptImage: 'Image URL', promptTable: 'Table size (rows x columns)'
        }
    };

    var SHORTCUTS = { bold: 'Ctrl+B', italic: 'Ctrl+I', underline: 'Ctrl+U', createLink: 'Ctrl+K', undo: 'Ctrl+Z', redo: 'Ctrl+Y' };

    var DEFAULT_TOOLBAR = [
        ['formatBlock', 'fontSize'],
        ['bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'hiliteColor'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['insertUnorderedList', 'insertOrderedList', 'outdent', 'indent'],
        ['createLink', 'unlink', 'insertImage', 'insertTable', 'insertHorizontalRule'],
        ['removeFormat', 'undo', 'redo', 'source', 'fullscreen']
    ];

    var DEFAULT_COLORS = [
        '#000000', '#434343', '#666666', '#999999', '#cccccc', '#ffffff',
        '#e03131', '#f08c00', '#f2c94c', '#2f9e44', '#1971c2', '#7048e8',
        '#ffc9c9', '#ffe8cc', '#fff3bf', '#d3f9d8', '#d0ebff', '#e5dbff'
    ];

    var BLOCK_FORMATS = ['P', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'PRE'];
    var FONT_SIZES = ['2', '3', '4', '5', '6'];
    var STATE_COMMANDS = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];

    /* ------------------------------------------------------------------
       Sanitizer（與 php/erp_sanitize_html.php 規則相同，修改時兩邊一起改）
       ------------------------------------------------------------------ */
    var RULES = {
        // tag => 可保留的 attribute；未列出的 tag 只保留內容
        allowedTags: {
            P: [], DIV: [], BR: [], SPAN: [], H1: [], H2: [], H3: [], H4: [], H5: [], H6: [],
            B: [], STRONG: [], I: [], EM: [], U: [], S: [], STRIKE: [], DEL: [], SUB: [], SUP: [],
            UL: [], OL: [], LI: [], BLOCKQUOTE: [], PRE: [], CODE: [], HR: [],
            A: ['href', 'target', 'rel'],
            IMG: ['src', 'alt', 'width', 'height'],
            TABLE: ['class'], THEAD: [], TBODY: [], TR: [], TH: ['colspan', 'rowspan'], TD: ['colspan', 'rowspan'],
            FONT: ['color', 'size']
        },
        // 連同內容整個移除
        dropTags: ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'TITLE', 'HEAD', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'SVG', 'MATH'],
        allowedStyles: ['color', 'background-color', 'font-size', 'font-weight', 'font-style', 'text-decoration', 'text-align', 'margin-left', 'padding-left'],
        // class 只保留符合這個 pattern 的值
        allowedClass: /^table(-[a-z]+)?$/,
        // <img src> 是否允許 data:image/*（貼上的 base64 圖片）
        allowDataImage: true
    };

    function safeUrl(url, allowDataImage) {
        var u = String(url == null ? '' : url).trim();
        if (u === '') return '';
        var lower = u.replace(/[\s\u0000-\u001f]/g, '').toLowerCase();
        if (/^(https?:|mailto:|tel:|\/|#|\.)/.test(lower)) return u;
        if (allowDataImage && /^data:image\/(png|jpe?g|gif|webp);/.test(lower)) return u;
        if (!/^[a-z][a-z0-9+.-]*:/.test(lower)) return u;   // 相對路徑
        return '';
    }

    function cleanStyle(style) {
        var out = [];
        String(style || '').split(';').forEach(function (decl) {
            var idx = decl.indexOf(':');
            if (idx < 0) return;
            var prop = decl.slice(0, idx).trim().toLowerCase();
            var val = decl.slice(idx + 1).trim();
            if (RULES.allowedStyles.indexOf(prop) < 0) return;
            if (/url\s*\(|expression\s*\(|javascript:|[<>]/i.test(val)) return;
            out.push(prop + ': ' + val);
        });
        return out.join('; ');
    }

    function sanitizeNode(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
            if (child.nodeType === 3) return;
            if (child.nodeType !== 1) { node.removeChild(child); return; }

            var tag = child.tagName.toUpperCase();
            if (RULES.dropTags.indexOf(tag) >= 0) { node.removeChild(child); return; }
            if (!Object.prototype.hasOwnProperty.call(RULES.allowedTags, tag)) {
                // 不認得的 tag（例如 Word 的 o:p）：拆掉 tag、保留內容
                sanitizeNode(child);
                while (child.firstChild) node.insertBefore(child.firstChild, child);
                node.removeChild(child);
                return;
            }

            var allowed = RULES.allowedTags[tag];
            Array.prototype.slice.call(child.attributes).forEach(function (attr) {
                var name = attr.name.toLowerCase();
                if (name === 'style') {
                    var st = cleanStyle(attr.value);
                    if (st) child.setAttribute('style', st); else child.removeAttribute(attr.name);
                } else if (allowed.indexOf(name) < 0) {
                    child.removeAttribute(attr.name);
                } else if (name === 'class') {
                    var cls = attr.value.split(/\s+/).filter(function (c) { return RULES.allowedClass.test(c); }).join(' ');
                    if (cls) child.setAttribute('class', cls); else child.removeAttribute(attr.name);
                } else if (name === 'href' || name === 'src') {
                    var safe = safeUrl(attr.value, name === 'src' && RULES.allowDataImage);
                    if (safe) child.setAttribute(name, safe); else child.removeAttribute(attr.name);
                }
            });
            if (tag === 'A' && child.getAttribute('target') === '_blank') {
                child.setAttribute('rel', 'noopener noreferrer');
            }
            sanitizeNode(child);
        });
    }

    function sanitize(html) {
        // 在 inert document 解析，<img onerror> 不會在解析時執行
        var doc = document.implementation.createHTMLDocument('');
        var box = doc.createElement('div');
        box.innerHTML = String(html == null ? '' : html).replace(/<!--[\s\S]*?-->/g, '');
        sanitizeNode(box);
        return box.innerHTML;
    }

    /* ------------------------------------------------------------------
       Helpers
       ------------------------------------------------------------------ */
    function extend(target) {
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            if (!src) continue;
            for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) target[k] = src[k];
        }
        return target;
    }

    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) {
            for (var k in attrs) {
                if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null) continue;
                if (k === 'text') node.textContent = attrs[k];
                else if (k === 'html') node.innerHTML = attrs[k];
                else node.setAttribute(k, attrs[k]);
            }
        }
        (children || []).forEach(function (c) { if (c) node.appendChild(c); });
        return node;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function icon(name) {
        return '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
    }

    function resolve(target) {
        if (typeof target === 'string') return document.querySelector(target);
        if (target && target.jquery) return target[0] || null;   // jQuery 物件
        return target || null;
    }

    function exec(cmd, value) {
        try { return document.execCommand(cmd, false, value); } catch (e) { return false; }
    }

    /* ------------------------------------------------------------------
       Editor
       ------------------------------------------------------------------ */
    var DEFAULTS = {
        placeholder: '',
        height: 300,             // 編輯區最小高度 (px)
        maxHeight: null,         // 編輯區最大高度 (px)，超過出現捲軸
        lang: 'zh-TW',           // 'zh-TW' | 'en' | 自訂物件
        toolbar: DEFAULT_TOOLBAR,
        colors: DEFAULT_COLORS,
        readOnly: false,
        stickyToolbar: true,
        sanitizePaste: true,
        imageUpload: null,       // function (file) -> Promise<url>；有設定才接受貼上／拖放圖片檔
        promptLink: null,        // function (defaultUrl) -> url | Promise<url>，預設用 window.prompt
        promptImage: null,
        promptTable: null,       // function () -> {rows, cols} | Promise
        onChange: null,          // function (html, editor)
        onFocus: null,
        onBlur: null,
        onReady: null
    };

    function Editor(target, options) {
        this.options = extend({}, DEFAULTS, options || {});
        this.lang = typeof this.options.lang === 'object'
            ? extend({}, LANGS['zh-TW'], this.options.lang)
            : extend({}, LANGS['zh-TW'], LANGS[this.options.lang] || {});
        this.listeners = {};
        this.savedRange = null;
        this.sourceMode = false;
        this.readOnly = false;
        this._docHandlers = [];
        this._lastHTML = null;

        // 綁在 <textarea> 上時：隱藏 textarea、內容雙向同步，表單照常送出
        if (target.tagName === 'TEXTAREA') {
            this.textarea = target;
            this.root = el('div');
            target.parentNode.insertBefore(this.root, target.nextSibling);
            target.style.display = 'none';
        } else {
            this.textarea = null;
            this.root = target;
            this._originalHTML = target.innerHTML;
        }
        this.target = target;

        this._build();

        var initial = this.textarea ? this.textarea.value : this._originalHTML;
        this.setHTML(initial || '', true);
        if (this.options.readOnly) this.setReadOnly(true);

        if (typeof this.options.onChange === 'function') this.on('change', this.options.onChange);
        if (typeof this.options.onFocus === 'function') this.on('focus', this.options.onFocus);
        if (typeof this.options.onBlur === 'function') this.on('blur', this.options.onBlur);
        if (typeof this.options.onReady === 'function') this.options.onReady.call(this, this);
    }

    Editor.prototype._build = function () {
        var self = this, o = this.options;

        this.root.innerHTML = '';
        this.root.classList.add('erp-editor');

        var toolbar = el('div', { 'class': 'erp-editor-toolbar' + (o.stickyToolbar ? ' is-sticky' : ''), role: 'toolbar' });
        (o.toolbar || []).forEach(function (group) {
            if (!group || !group.length) return;
            var g = el('div', { 'class': 'erp-editor-group' });
            group.forEach(function (name) { var c = self._control(name); if (c) g.appendChild(c); });
            toolbar.appendChild(g);
        });

        this.toolbar = toolbar;
        this.area = el('div', {
            'class': 'erp-editor-area',
            contenteditable: 'true',
            spellcheck: 'false',
            role: 'textbox',
            'aria-multiline': 'true',
            'data-placeholder': o.placeholder
        });
        this.area.style.minHeight = o.height + 'px';
        if (o.maxHeight) { this.area.style.maxHeight = o.maxHeight + 'px'; this.area.style.overflowY = 'auto'; }

        this.source = el('textarea', { 'class': 'erp-editor-source', spellcheck: 'false' });
        this.source.style.minHeight = o.height + 'px';
        this.source.style.display = 'none';

        if (toolbar.childNodes.length) this.root.appendChild(toolbar);
        this.root.appendChild(this.area);
        this.root.appendChild(this.source);

        // toolbar 按鈕：mousedown 不搶焦點，保留選取範圍
        toolbar.addEventListener('mousedown', function (e) {
            if (e.target.closest('button')) e.preventDefault();
            if (e.target.closest('select')) self._saveRange();
        });
        toolbar.addEventListener('click', function (e) {
            var btn = e.target.closest('button');
            if (!btn || btn.disabled) return;
            if (btn.hasAttribute('data-palette')) { self._togglePalette(btn); return; }
            var cmd = btn.getAttribute('data-cmd');
            if (cmd) { self._closePalettes(); self.exec(cmd, btn.getAttribute('data-value')); }
        });
        toolbar.addEventListener('change', function (e) {
            var s = e.target;
            if (s.tagName !== 'SELECT' || s.value === '') return;
            var cmd = s.getAttribute('data-cmd');
            self.exec(cmd, cmd === 'formatBlock' ? '<' + s.value + '>' : s.value);
            if (cmd === 'fontSize') s.value = '';
        });

        var area = this.area;
        ['keyup', 'mouseup'].forEach(function (ev) {
            area.addEventListener(ev, function () { self._saveRange(); self._refreshState(); });
        });
        area.addEventListener('input', function () { self._afterChange(); });
        area.addEventListener('focus', function () { self.root.classList.add('is-focused'); self._emit('focus'); });
        area.addEventListener('blur', function () { self._saveRange(); self.root.classList.remove('is-focused'); self._emit('blur'); });
        area.addEventListener('paste', function (e) { self._onPaste(e); });
        area.addEventListener('drop', function (e) { self._onDrop(e); });
        area.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                self.exec('createLink');
            }
        });
        area.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a');
            if (a && (e.ctrlKey || e.metaKey) && a.getAttribute('href')) window.open(a.href, '_blank', 'noopener');
        });
        this.source.addEventListener('input', function () { self._afterChange(); });

        // 點 palette 以外的地方就關閉
        this._onDoc('mousedown', function (e) { if (!e.target.closest || !e.target.closest('.erp-editor-color')) self._closePalettes(); });
        this._onDoc('keydown', function (e) {
            if (e.key === 'Escape') {
                self._closePalettes();
                if (self.root.classList.contains('is-fullscreen')) self.toggleFullscreen(false);
            }
        });
    };

    Editor.prototype._onDoc = function (ev, fn) {
        document.addEventListener(ev, fn);
        this._docHandlers.push([ev, fn]);
    };

    Editor.prototype._control = function (name) {
        var L = this.lang, o = this.options;
        if (name === 'formatBlock') {
            var fb = el('select', { 'class': 'erp-editor-select', 'data-cmd': 'formatBlock', title: L.formatBlock, 'aria-label': L.formatBlock });
            BLOCK_FORMATS.forEach(function (t) { fb.appendChild(el('option', { value: t, text: L[t] })); });
            return fb;
        }
        if (name === 'fontSize') {
            var fs = el('select', { 'class': 'erp-editor-select', 'data-cmd': 'fontSize', title: L.fontSize, 'aria-label': L.fontSize });
            fs.appendChild(el('option', { value: '', text: L.fontSize }));
            FONT_SIZES.forEach(function (s) { fs.appendChild(el('option', { value: s, text: L['fs' + s] })); });
            return fs;
        }
        if (name === 'foreColor' || name === 'hiliteColor') {
            var wrap = el('div', { 'class': 'erp-editor-color' });
            var btn = el('button', { type: 'button', 'class': 'erp-editor-btn', 'data-palette': name, title: L[name], 'aria-label': L[name], 'aria-haspopup': 'true', 'aria-expanded': 'false', html: icon(name) });
            var pal = el('div', { 'class': 'erp-editor-palette', role: 'menu' });
            (o.colors || DEFAULT_COLORS).forEach(function (c) {
                var sw = el('button', { type: 'button', 'class': 'erp-editor-swatch', 'data-cmd': name, 'data-value': c, title: c, 'aria-label': c });
                sw.style.backgroundColor = c;
                pal.appendChild(sw);
            });
            if (name === 'hiliteColor') {
                pal.appendChild(el('button', { type: 'button', 'class': 'erp-editor-swatch erp-editor-swatch-none', 'data-cmd': name, 'data-value': 'transparent', title: L.noColor, 'aria-label': L.noColor, html: icon('none') }));
            }
            wrap.appendChild(btn);
            wrap.appendChild(pal);
            return wrap;
        }
        if (!ICONS[name]) return null;
        var title = L[name] + (SHORTCUTS[name] ? ' (' + SHORTCUTS[name] + ')' : '');
        return el('button', { type: 'button', 'class': 'erp-editor-btn', 'data-cmd': name, title: title, 'aria-label': L[name], html: icon(name) });
    };

    Editor.prototype._togglePalette = function (btn) {
        var wrap = btn.parentNode, open = !wrap.classList.contains('is-open');
        this._closePalettes();
        if (open) { this._saveRange(); wrap.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    };

    Editor.prototype._closePalettes = function () {
        Array.prototype.forEach.call(this.toolbar.querySelectorAll('.erp-editor-color.is-open'), function (w) {
            w.classList.remove('is-open');
            w.firstChild.setAttribute('aria-expanded', 'false');
        });
    };

    Editor.prototype._saveRange = function () {
        var sel = window.getSelection();
        if (sel.rangeCount && this.area.contains(sel.getRangeAt(0).commonAncestorContainer)) {
            this.savedRange = sel.getRangeAt(0).cloneRange();
        }
    };

    Editor.prototype._restoreRange = function () {
        this.area.focus();
        if (this.savedRange) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.savedRange);
        }
    };

    Editor.prototype._ask = function (fn, label, def) {
        var r = typeof fn === 'function' ? fn.call(this, def) : window.prompt(label, def);
        return Promise.resolve(r);
    };

    Editor.prototype._insertLink = function (url) {
        url = safeUrl(url, false);
        if (!url || url === 'https://') return;
        this._restoreRange();
        var sel = window.getSelection();
        if (sel.isCollapsed) {
            exec('insertHTML', '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(url) + '</a>');
        } else {
            exec('createLink', url);
            Array.prototype.forEach.call(this.area.querySelectorAll('a'), function (a) {
                if (a.getAttribute('href') === url) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener noreferrer'); }
            });
        }
        this._afterChange();
    };

    Editor.prototype._insertImage = function (src) {
        src = safeUrl(src, RULES.allowDataImage);
        if (!src || src === 'https://') return;
        this._restoreRange();
        exec('insertHTML', '<img src="' + escapeHtml(src) + '" alt="">');
        this._afterChange();
    };

    Editor.prototype._insertTable = function (size) {
        var rows, cols;
        if (size && typeof size === 'object') { rows = size.rows; cols = size.cols; }
        else {
            var m = String(size || '').match(/^\s*(\d+)\s*[xX*×]\s*(\d+)\s*$/);
            if (!m) return;
            rows = m[1]; cols = m[2];
        }
        rows = Math.max(1, Math.min(parseInt(rows, 10) || 0, 50));
        cols = Math.max(1, Math.min(parseInt(cols, 10) || 0, 20));
        var html = '<table class="table table-bordered"><tbody>';
        for (var r = 0; r < rows; r++) {
            html += '<tr>';
            for (var c = 0; c < cols; c++) html += '<td><br></td>';
            html += '</tr>';
        }
        html += '</tbody></table><p><br></p>';
        this._restoreRange();
        exec('insertHTML', html);
        this._afterChange();
    };

    /** 執行工具列指令，也可從程式呼叫，例如 editor.exec('bold') */
    Editor.prototype.exec = function (cmd, value) {
        var self = this, o = this.options, L = this.lang;
        if (cmd === 'source') { this.toggleSource(); return; }
        if (cmd === 'fullscreen') { this.toggleFullscreen(); return; }
        if (this.sourceMode || this.readOnly) return;

        this._saveRange();
        if (cmd === 'createLink') {
            if (value) { this._insertLink(value); return; }
            this._ask(o.promptLink, L.promptLink, 'https://').then(function (u) { self._insertLink(u); });
            return;
        }
        if (cmd === 'insertImage') {
            if (value) { this._insertImage(value); return; }
            this._ask(o.promptImage, L.promptImage, 'https://').then(function (u) { self._insertImage(u); });
            return;
        }
        if (cmd === 'insertTable') {
            if (value) { this._insertTable(value); return; }
            this._ask(o.promptTable, L.promptTable, '3x3').then(function (s) { self._insertTable(s); });
            return;
        }

        this._restoreRange();
        exec('styleWithCSS', cmd === 'foreColor' || cmd === 'hiliteColor');
        exec(cmd, value == null ? null : value);
        this._saveRange();
        this._afterChange();
    };

    Editor.prototype._insertFiles = function (files) {
        var self = this, upload = this.options.imageUpload;
        Array.prototype.forEach.call(files, function (file) {
            if (!/^image\//.test(file.type)) return;
            Promise.resolve(upload.call(self, file)).then(function (url) {
                if (url) self._insertImage(url);
            }, function (err) {
                self._emit('error', err);
            });
        });
    };

    Editor.prototype._onPaste = function (e) {
        if (this.sourceMode) return;
        var cd = e.clipboardData;
        if (!cd) return;
        if (cd.files && cd.files.length && this.options.imageUpload) {
            e.preventDefault();
            this._saveRange();
            this._insertFiles(cd.files);
            return;
        }
        e.preventDefault();
        var html = cd.getData('text/html');
        if (html && this.options.sanitizePaste) {
            exec('insertHTML', sanitize(html));
        } else {
            exec('insertText', cd.getData('text/plain'));
        }
        this._afterChange();
    };

    Editor.prototype._onDrop = function (e) {
        var dt = e.dataTransfer;
        e.preventDefault();   // 不接受直接拖放外部 HTML／檔案
        if (this.readOnly || this.sourceMode || !dt || !dt.files || !dt.files.length || !this.options.imageUpload) return;
        // 移動游標到放下的位置
        var range = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
        if (!range && document.caretPositionFromPoint) {
            var pos = document.caretPositionFromPoint(e.clientX, e.clientY);
            if (pos) { range = document.createRange(); range.setStart(pos.offsetNode, pos.offset); }
        }
        if (range) this.savedRange = range;
        this._insertFiles(dt.files);
    };

    Editor.prototype._refreshState = function () {
        if (this.sourceMode) return;
        Array.prototype.forEach.call(this.toolbar.querySelectorAll('.erp-editor-btn[data-cmd]'), function (b) {
            var cmd = b.getAttribute('data-cmd'), on = false;
            if (STATE_COMMANDS.indexOf(cmd) >= 0) { try { on = document.queryCommandState(cmd); } catch (err) { on = false; } }
            b.classList.toggle('is-active', !!on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        var fb = this.toolbar.querySelector('select[data-cmd="formatBlock"]');
        if (fb) {
            var block = '';
            try { block = String(document.queryCommandValue('formatBlock') || '').toUpperCase(); } catch (err) { block = ''; }
            fb.value = BLOCK_FORMATS.indexOf(block) >= 0 ? block : 'P';
        }
    };

    Editor.prototype._afterChange = function () {
        this._updateEmpty();
        var html = this.getHTML();
        if (this.textarea) this.textarea.value = html;
        if (html !== this._lastHTML) {
            this._lastHTML = html;
            this._emit('change', html);
        }
    };

    Editor.prototype._updateEmpty = function () {
        this.area.classList.toggle('is-empty', this.isEmpty());
    };

    Editor.prototype._emit = function (ev, arg) {
        var self = this;
        (this.listeners[ev] || []).slice().forEach(function (fn) {
            if (ev === 'change') fn.call(self, arg, self); else fn.call(self, arg === undefined ? self : arg, self);
        });
    };

    /* ---------------------------- Public API ---------------------------- */

    /** 取得過濾後的 HTML；沒有內容時回傳空字串 */
    Editor.prototype.getHTML = function () {
        var html = sanitize(this.sourceMode ? this.source.value : this.area.innerHTML).trim();
        return (html === '<br>' || html === '<p><br></p>' || html === '<div><br></div>') ? '' : html;
    };

    /** 設定內容（會先過濾）；silent = true 時不觸發 change */
    Editor.prototype.setHTML = function (html, silent) {
        var clean = sanitize(html);
        this.area.innerHTML = clean;
        this.source.value = clean;
        this.savedRange = null;
        this._updateEmpty();
        if (silent) {
            this._lastHTML = this.getHTML();
            if (this.textarea) this.textarea.value = this._lastHTML;
        } else {
            this._afterChange();
        }
        return this;
    };

    /** 在游標位置插入 HTML（會先過濾） */
    Editor.prototype.insertHTML = function (html) {
        if (this.sourceMode || this.readOnly) return this;
        this._restoreRange();
        exec('insertHTML', sanitize(html));
        this._afterChange();
        return this;
    };

    /** 純文字內容 */
    Editor.prototype.getText = function () {
        return (this.sourceMode ? (function (h) { var d = document.createElement('div'); d.innerHTML = sanitize(h); return d.textContent; })(this.source.value) : this.area.textContent).trim();
    };

    Editor.prototype.clear = function () { return this.setHTML(''); };

    Editor.prototype.isEmpty = function () {
        if (this.sourceMode) return this.getHTML() === '';
        return this.area.textContent.trim() === '' && !this.area.querySelector('img, table, hr');
    };

    Editor.prototype.focus = function () {
        (this.sourceMode ? this.source : this.area).focus();
        return this;
    };

    Editor.prototype.setReadOnly = function (flag) {
        this.readOnly = !!flag;
        this.area.setAttribute('contenteditable', this.readOnly ? 'false' : 'true');
        this.source.readOnly = this.readOnly;
        this.root.classList.toggle('is-readonly', this.readOnly);
        this._syncToolbar();
        return this;
    };

    // 唯讀：只留全螢幕；原始碼模式：只留原始碼與全螢幕
    Editor.prototype._syncToolbar = function () {
        var ro = this.readOnly, src = this.sourceMode;
        Array.prototype.forEach.call(this.toolbar.querySelectorAll('button, select'), function (c) {
            var cmd = c.getAttribute('data-cmd') || c.getAttribute('data-palette');
            if (cmd === 'fullscreen') { c.disabled = false; return; }
            c.disabled = ro || (src && cmd !== 'source');
        });
    };

    Editor.prototype.toggleSource = function (flag) {
        var on = flag === undefined ? !this.sourceMode : !!flag;
        if (on === this.sourceMode) return this;
        if (on) {
            this.source.value = this.getHTML();
            this.sourceMode = true;
            this.area.style.display = 'none';
            this.source.style.display = '';
        } else {
            this.area.innerHTML = sanitize(this.source.value);
            this.sourceMode = false;
            this.source.style.display = 'none';
            this.area.style.display = '';
            this._afterChange();
        }
        this.root.classList.toggle('is-source', on);
        var b = this.toolbar.querySelector('[data-cmd="source"]');
        if (b) b.classList.toggle('is-active', on);
        this._syncToolbar();
        this.focus();
        return this;
    };

    Editor.prototype.toggleFullscreen = function (flag) {
        var on = flag === undefined ? !this.root.classList.contains('is-fullscreen') : !!flag;
        this.root.classList.toggle('is-fullscreen', on);
        document.documentElement.classList.toggle('erp-editor-noscroll', on);
        var b = this.toolbar.querySelector('[data-cmd="fullscreen"]');
        if (b) b.classList.toggle('is-active', on);
        return this;
    };

    Editor.prototype.on = function (ev, fn) {
        (this.listeners[ev] = this.listeners[ev] || []).push(fn);
        return this;
    };

    Editor.prototype.off = function (ev, fn) {
        if (!fn) delete this.listeners[ev];
        else this.listeners[ev] = (this.listeners[ev] || []).filter(function (f) { return f !== fn; });
        return this;
    };

    /** 移除編輯器，還原原本的元素（textarea 會保留最新內容） */
    Editor.prototype.destroy = function () {
        var html = this.getHTML();
        this._docHandlers.forEach(function (h) { document.removeEventListener(h[0], h[1]); });
        this.toggleFullscreen(false);
        if (this.textarea) {
            this.textarea.value = html;
            this.textarea.style.display = '';
            this.root.parentNode && this.root.parentNode.removeChild(this.root);
        } else {
            this.root.classList.remove('erp-editor', 'is-focused', 'is-readonly', 'is-source');
            this.root.innerHTML = html;
        }
        delete this.target._erpEditor;
        this.listeners = {};
        return html;
    };

    /* ---------------------------- Factory ---------------------------- */

    /** 建立（或取得既有的）編輯器；同一元素重複呼叫回傳同一個 instance */
    function create(target, options) {
        var node = resolve(target);
        if (!node) return null;
        if (!node._erpEditor) node._erpEditor = new Editor(node, options);
        return node._erpEditor;
    }

    /** 取得元素上已建立的編輯器 */
    function get(target) {
        var node = resolve(target);
        return node && node._erpEditor ? node._erpEditor : null;
    }

    return {
        version: VERSION,
        create: create,
        get: get,
        sanitize: sanitize,
        safeUrl: safeUrl,
        rules: RULES,
        languages: LANGS,
        defaults: DEFAULTS,
        defaultToolbar: DEFAULT_TOOLBAR,
        Editor: Editor
    };
}));
