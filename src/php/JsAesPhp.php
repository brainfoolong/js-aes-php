<?php

namespace Nullix\JsAesPhp;

use Error;

use function bin2hex;
use function hash_pbkdf2;
use function hex2bin;
use function json_decode;
use function openssl_decrypt;
use function openssl_random_pseudo_bytes;
use function preg_match;
use function str_pad;
use function strlen;
use function substr;

use const OPENSSL_RAW_DATA;
use const STR_PAD_LEFT;

class JsAesPhp
{

    public static function encrypt(mixed $value, string $password, int $hashIterations = 100000): string
    {
        if ($hashIterations >= 10000000000) {
            throw new Error("Hash iterations limit exceeded");
        }
        $iv = openssl_random_pseudo_bytes(16);
        $salt = openssl_random_pseudo_bytes(16);
        $key = hash_pbkdf2("sha256", $password, $salt, $hashIterations, 64, true);
        $cipher = openssl_encrypt(json_encode($value), 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        return str_pad($hashIterations, 10, "0", STR_PAD_LEFT) . bin2hex($iv) . bin2hex($salt) . bin2hex($cipher);
    }

    public static function decrypt(string $encryptedValue, string $password): mixed
    {
        if (strlen($encryptedValue) <= 74 || preg_match("~[^0-9a-f]~", $encryptedValue)) {
            throw new Error('Invalid encryptedValue');
        }
        return json_decode(
            openssl_decrypt(
                hex2bin(substr($encryptedValue, 74)),
                'aes-256-cbc',
                hash_pbkdf2("sha256", $password, hex2bin(substr($encryptedValue, 42, 32)), (int)substr($encryptedValue, 0, 10), 64, true),
                OPENSSL_RAW_DATA,
                hex2bin(substr($encryptedValue, 10, 32))
            ),
            true
        );
    }

}