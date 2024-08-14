<?php
// testing JS<->PHP encrypt/decrypt and vice-versa

namespace Nullix\JsAesPhp;

use Error;

use function escapeshellarg;
use function implode;
use function json_decode;
use function json_encode;
use function var_dump;

require __DIR__ . '/../src/php/JsAesPhp.php';

function assertValue(mixed $expected, mixed $actual): void
{
    $expected = json_encode($expected);
    $actual = json_encode($actual);
    if ($expected !== $actual) {
        throw new Error("Expected $expected but got $actual");
    }
}

function executeNode(string $method, string $value): string
{
    $out = null;
    $return = null;
    exec("node " . escapeshellarg(__DIR__ . "/test-js-php.js") . " " . escapeshellarg($method) . " " . escapeshellarg($value), $out, $return);
    return implode("\n", $out);
}

$value = ['foobar' => 'l`î', 'emojiiii' => '😊'];
$password = '😊Blub';
$testMethod = $_SERVER['argv'][1] ?? null;

if ($testMethod === 'encrypt') {
    echo JsAesPhp::encrypt($value, $password);
} elseif ($testMethod === 'decrypt') {
    echo json_encode(JsAesPhp::decrypt($_SERVER['argv'][2], $password));
} else {
    $encrypted = JsAesPhp::encrypt($value, $password);
    $decrypted = json_decode(executeNode('decrypt', $encrypted), true);

    var_dump("===Encryption in PHP and Decryption in JS success===");
    var_dump("Encrypted: " . $encrypted);
    var_dump("Decrypted: " . json_encode($decrypted));
    assertValue($value, $decrypted);
    var_dump("===Encryption in PHP and Decryption in JS success===");
    echo "\n\n";

    $encrypted = executeNode('encrypt', '');
    $decrypted = JsAesPhp::decrypt($encrypted, $password);

    var_dump("===Encryption in JS and Decryption in PHP===");
    var_dump("Encrypted: " . $encrypted);
    var_dump("Decrypted: " . json_encode($decrypted));
    assertValue($value, $decrypted);
    var_dump("Encryption in JS and Decryption in PHP success");
}
