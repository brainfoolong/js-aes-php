// JsAesPhp v1.0.1 @ https://github.com/brainfoolong/js-aes-php
class JsAesPhp {
    /**
     * Encrypt a given value which can be of any kind that can be JSON.stringify'd
     * @param {any} value
     * @param {string} password The raw password
     * @param {number} hashIterations The number of iterations to use for the password hash
     *    This can be subject to change in the future. The number of iterations will be contained
     *    in the output, so changing the number doesn't break the decrypt function
     * @return {Promise<string>}
     */
    static async encrypt(value, password, hashIterations = 100000) {
        const crypto = this.getCrypto();
        const iv = this.getCrypto().getRandomValues(new Uint8Array(16));
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await this.generateKey(password, salt, hashIterations);
        const encoded = new TextEncoder().encode(JSON.stringify(value));
        const encrypted = new Uint8Array(await crypto.subtle.encrypt({
            name: 'AES-CBC',
            iv: iv,
        }, key, encoded));
        return hashIterations.toString().padStart(10, '0') + this.byteArrayToHex(iv) + this.byteArrayToHex(salt) + this.byteArrayToHex(encrypted);
    }
    /**
     * Decrypt any previously JsAesPhp.encrypt() value
     * @param {string} encryptedValue
     * @param {string} password The raw password
     * @return {Promise<any>}
     */
    static async decrypt(encryptedValue, password) {
        if (typeof encryptedValue !== 'string' || encryptedValue.length <= 74 || encryptedValue.match(/[^0-9a-f]/)) {
            throw new Error('Invalid encryptedValue');
        }
        const crypto = this.getCrypto();
        const key = await this.generateKey(password, this.hexToByteArray(encryptedValue.substring(42, 74)), parseInt(encryptedValue.substring(0, 10)));
        return JSON.parse(new TextDecoder().decode(new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv: this.hexToByteArray(encryptedValue.substring(10, 42)) }, key, this.hexToByteArray(encryptedValue.substring(74))))));
    }
    /**
     * Generate crypto key
     * @param  {string} password The raw password
     * @param {Uint8Array} salt
     * @param {number} hashIterations
     * @return {Promise<CryptoKey>}
     * @private
     */
    static async generateKey(password, salt, hashIterations = 100000) {
        if (hashIterations >= 10000000000) {
            throw new Error('Hash iterations limit exceeded');
        }
        const crypto = this.getCrypto();
        const passwordBytes = new TextEncoder().encode(password);
        const initialKey = await crypto.subtle.importKey('raw', passwordBytes, { name: 'PBKDF2', hash: 'SHA-256' }, false, ['deriveKey']);
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: hashIterations, hash: 'SHA-256' }, initialKey, { name: 'AES-CBC', length: 256 }, true, ['encrypt', 'decrypt']);
    }
    /**
     * Get crypto instance depending on the environment
     * @return {Crypto}
     * @private
     */
    static getCrypto() {
        if (typeof this.crypto !== 'undefined') {
            return this.crypto;
        }
        if (typeof Uint8Array === 'undefined') {
            throw new Error('Unsupported environment, Uint8Array missing');
        }
        if (typeof TextEncoder === 'undefined') {
            throw new Error('Unsupported environment, TextEncoder missing');
        }
        if (typeof window === 'undefined') {
            // @ts-ignore
            if (typeof module !== 'undefined' && module.exports) {
                // @ts-ignore
                this.crypto = require('crypto').webcrypto;
                return this.crypto;
            }
        }
        if (!window.crypto) {
            throw new Error('Unsupported environment, window.crypto missing');
        }
        this.crypto = window.crypto;
        return this.crypto;
    }
    /**
     * Convert given byte array to visual hex representation with leading 0x
     * @param {Uint8Array} byteArray
     * @return {string}
     */
    static byteArrayToHex(byteArray) {
        return Array.from(byteArray).map(x => x.toString(16).padStart(2, '0')).join('');
    }
    /**
     * Convert a hex string into given byte array to visual hex representation
     * @param {str} str
     * @return {string}
     */
    static hexToByteArray(str) {
        return Uint8Array.from((str.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16)));
    }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = JsAesPhp
}
