<?php
/**
 * ERPEditor v2026.a29 — 後端 HTML 白名單過濾
 *
 * 規則與前端 src/erp-editor.js 的 ERPEditor.sanitize() 相同；修改允許的 tag / attribute 時兩邊要一起改。
 * 需求：PHP 7.1+，建議安裝 DOM extension（php-xml），沒有時會改用較保守的 regex 備援。
 *
 * 用法：
 *   require_once __DIR__ . '/erp_sanitize_html.php';
 *   $content = erp_sanitize_html($_POST['content'] ?? '');
 */

const ERP_HTML_ALLOWED_TAGS = [
    'p' => [], 'div' => [], 'br' => [], 'span' => [], 'h1' => [], 'h2' => [], 'h3' => [], 'h4' => [], 'h5' => [], 'h6' => [],
    'b' => [], 'strong' => [], 'i' => [], 'em' => [], 'u' => [], 's' => [], 'strike' => [], 'del' => [], 'sub' => [], 'sup' => [],
    'ul' => [], 'ol' => [], 'li' => [], 'blockquote' => [], 'pre' => [], 'code' => [], 'hr' => [],
    'a' => ['href', 'target', 'rel'],
    'img' => ['src', 'alt', 'width', 'height'],
    'table' => ['class'], 'thead' => [], 'tbody' => [], 'tr' => [], 'th' => ['colspan', 'rowspan'], 'td' => ['colspan', 'rowspan'],
    'font' => ['color', 'size'],
];
const ERP_HTML_DROP_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'title', 'head', 'form', 'input', 'button', 'select', 'textarea', 'svg', 'math'];
const ERP_HTML_ALLOWED_STYLES = ['color', 'background-color', 'font-size', 'font-weight', 'font-style', 'text-decoration', 'text-align', 'margin-left', 'padding-left'];

function erp_html_safe_url($url, $allow_data_image = false) {
    $u = trim((string)$url);
    if ($u === '') return '';
    $lower = strtolower(preg_replace('/[\s\x00-\x1f]/', '', $u));
    if (preg_match('#^(https?:|mailto:|tel:|/|\#|\.)#', $lower)) return $u;
    if ($allow_data_image && preg_match('#^data:image/(png|jpe?g|gif|webp);#', $lower)) return $u;
    if (!preg_match('#^[a-z][a-z0-9+.-]*:#', $lower)) return $u;   // 相對路徑
    return '';
}

function erp_html_clean_style($style) {
    $out = [];
    foreach (explode(';', (string)$style) as $decl) {
        $idx = strpos($decl, ':');
        if ($idx === false) continue;
        $prop = strtolower(trim(substr($decl, 0, $idx)));
        $val = trim(substr($decl, $idx + 1));
        if (!in_array($prop, ERP_HTML_ALLOWED_STYLES, true)) continue;
        if (preg_match('/url\s*\(|expression\s*\(|javascript:|[<>]/i', $val)) continue;
        $out[] = $prop . ': ' . $val;
    }
    return implode('; ', $out);
}

function erp_html_sanitize_node(DOMNode $node) {
    $children = [];
    foreach ($node->childNodes as $c) $children[] = $c;

    foreach ($children as $child) {
        if ($child->nodeType === XML_TEXT_NODE) continue;
        if ($child->nodeType !== XML_ELEMENT_NODE) {
            $node->removeChild($child);
            continue;
        }
        $tag = strtolower($child->nodeName);
        if (in_array($tag, ERP_HTML_DROP_TAGS, true)) {
            $node->removeChild($child);
            continue;
        }
        if (!array_key_exists($tag, ERP_HTML_ALLOWED_TAGS)) {
            // 不認得的 tag：拆掉 tag、保留內容
            erp_html_sanitize_node($child);
            while ($child->firstChild) $node->insertBefore($child->firstChild, $child);
            $node->removeChild($child);
            continue;
        }
        $allowed = ERP_HTML_ALLOWED_TAGS[$tag];
        $attrs = [];
        foreach ($child->attributes as $a) $attrs[] = $a->nodeName;
        foreach ($attrs as $name) {
            $lname = strtolower($name);
            $value = $child->getAttribute($name);
            if ($lname === 'style') {
                $st = erp_html_clean_style($value);
                if ($st !== '') $child->setAttribute('style', $st); else $child->removeAttribute($name);
            } elseif (!in_array($lname, $allowed, true)) {
                $child->removeAttribute($name);
            } elseif ($lname === 'class') {
                // 只保留 Bootstrap 表格樣式
                $cls = implode(' ', array_filter(preg_split('/\s+/', $value), function ($c) { return preg_match('/^table(-[a-z]+)?$/', $c); }));
                if ($cls !== '') $child->setAttribute('class', $cls); else $child->removeAttribute($name);
            } elseif ($lname === 'href' || $lname === 'src') {
                $safe = erp_html_safe_url($value, $lname === 'src');
                if ($safe !== '') $child->setAttribute($lname, $safe); else $child->removeAttribute($name);
            }
        }
        if ($tag === 'a' && $child->getAttribute('target') === '_blank') {
            $child->setAttribute('rel', 'noopener noreferrer');
        }
        erp_html_sanitize_node($child);
    }
}

function erp_sanitize_html($html) {
    if ($html === null || trim((string)$html) === '') return $html;

    if (!class_exists('DOMDocument')) {
        // 沒有 php-xml（DOM extension）時的保守備援：只留白名單 tag，移除事件、style、class、id 屬性與 javascript: 連結
        $allowed = '<' . implode('><', array_keys(ERP_HTML_ALLOWED_TAGS)) . '>';
        $out = strip_tags(preg_replace('#<(script|style|iframe|object|embed|svg|math)\b.*?</\1\s*>#is', '', $html), $allowed);
        $out = preg_replace('/\s+(on[a-z]+|style|class|id)\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $out);
        $out = preg_replace('/(href|src)\s*=\s*("|\')?\s*(javascript|vbscript|data):[^"\'>\s]*("|\')?/i', '$1="#"', $out);
        return $out;
    }

    $doc = new DOMDocument();
    $prev = libxml_use_internal_errors(true);
    // 包一層 div 並宣告 UTF-8，避免中文變亂碼
    $doc->loadHTML('<?xml encoding="UTF-8"><div id="erp_html_root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET);
    libxml_clear_errors();
    libxml_use_internal_errors($prev);

    $root = null;
    foreach ($doc->getElementsByTagName('div') as $div) {
        if ($div->getAttribute('id') === 'erp_html_root') { $root = $div; break; }
    }
    if ($root === null) return htmlspecialchars($html, ENT_QUOTES, 'UTF-8');

    erp_html_sanitize_node($root);

    $out = '';
    foreach ($root->childNodes as $c) $out .= $doc->saveHTML($c);
    return $out;
}
