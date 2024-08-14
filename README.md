# Slim native AES encryption/decryption on client side with Javascript and on server side with PHP

A tool to AES encrypt/decrypt data in javascript and/or PHP. You can use it for PHP only, for Javascript only or mix it together.

It uses `aes-256-cbc` implementation with random salts and random initialization vector. This library does not support other ciphers or modes.

This library is the successor to my previous [CryptoJs-Aea-Php](https://github.com/brainfoolong/cryptojs-aes-php) encryption library that required CryptoJS. This library does not require any third party dependency as modern browsers and Node now have proper crypto tools built in. Attention: This library does output different encryption values to my previous library, it cannot be a drop-in replacement.

### Features
* Encrypt any value in Javascript (objects/array/etc...) - Everything that can be passed to JSON.stringify
* Encrypt any value in PHP (object/array/etc...) - Everything that can be passed to json_encode
* Decrypt in PHP/Javascript, doesn't matter where you have encrypted the values
* It is safe to store and transfer the encrypted values, as the encrypted output only contains hex characters (0-9 A-F)
* Small footprint: 5kb unzipped Javascript file

### Requirements
* For Javascript: Any [recent Browser](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#browser_compatibility) or Node environment (15+)
* For Typescript: Use `src/ts/js-aes-php.ts`
* For PHP: 8.0 or above with OpenSSL extension enabled


### PHP - How to use
```php
$value = ['foobar' => 'l`î', 'emojiiii' => '😊'];
$password = '😊Blub';
$encrypted = JsAesPhp::encrypt($value, $password);
$decrypted = JsAesPhp::decrypt($encrypted, $password);
```

### Javascript/Typescript - How to use
```javascript
const value = { 'foobar': 'l`î', 'emojiiii': '😊' }
const password = '😊Blub'
const encrypted = await JsAesPhp.encrypt(value, password)
const decrypted = await JsAesPhp.decrypt(encrypted, password)
```

### Security Notes

This library use AES-256-CBC encryption, which is still good and safe but there are (maybe) better alternatives for your use case. If you require really high security, you should invest more time for what is suitable for you.

Also, there's a good article about PHP issues/info related to this
library: https://stackoverflow.com/questions/16600708/how-do-you-encrypt-and-decrypt-a-php-string/30159120#30159120

### Alternatives - ASCON

You may wonder if there are alternatives to AES encryption that you can use in PHP/JS. ASCON is a newer, lightweight cipher that have been selected in 2023 by the [NIST](https://csrc.nist.gov/projects/lightweight-cryptography) as the new standard for lightweight cryptography, which may suite your needs. I have created libraries for both PHP and JS which you can find at https://github.com/brainfoolong/php-ascon and https://github.com/brainfoolong/js-ascon
