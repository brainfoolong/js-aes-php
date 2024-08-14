<?php

namespace Nullix\JsAesPhp;

use Error;

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

$value = ['foobar' => 'l`î', 'emojiiii' => '😊'];
$password = '😊Blub';
$encrypted = JsAesPhp::encrypt($value, $password);
$decrypted = JsAesPhp::decrypt($encrypted, $password);

var_dump("Original Value: " . json_encode($value));
var_dump("Encrypted: " . $encrypted);
var_dump("Decrypted: " . json_encode($decrypted));
assertValue($value, $decrypted);