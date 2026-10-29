<?php
// PHP 版 sanitizer 測試，與瀏覽器測試共用 test/cases.json
// 用法：php test/sanitize_test.php
require_once __DIR__ . '/../php/erp_sanitize_html.php';

$cases = json_decode(file_get_contents(__DIR__ . '/cases.json'), true);
$pass = 0;
$fails = [];
foreach ($cases as $c) {
    $out = erp_sanitize_html($c['input']);
    $miss = array_filter($c['contains'], function ($s) use ($out) { return strpos($out, $s) === false; });
    $bad = array_filter($c['notContains'], function ($s) use ($out) { return stripos($out, $s) !== false; });
    if (!$miss && !$bad) $pass++; else $fails[] = 'FAIL ' . $c['name'] . ' :: ' . $out;
}
echo 'RESULT ' . $pass . ' passed, ' . count($fails) . " failed\n" . implode("\n", $fails) . "\n";
exit($fails ? 1 : 0);
