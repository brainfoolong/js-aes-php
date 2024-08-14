// testing JS<->PHP encrypt/decrypt and vice-versa

const JsAesPhp = require('../dist/js-aes-php')
const spawnSync = require('child_process').spawnSync

function assert (expected, actual) {
  expected = JSON.stringify(expected)
  actual = JSON.stringify(actual)
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('Expected ' + expected + ' but got ' + actual)
  }
}

function executePhp (method, value) {
  return spawnSync('php', [
    __dirname + '/test-js-php.php',
    method,
    value,
  ]).stdout.toString()
}

const value = { 'foobar': 'l`î', 'emojiiii': '😊' }
const password = '😊Blub'
const testMethod = process.argv[2] ? process.argv[2] : null

if (testMethod === 'encrypt') {
  ;(async function () {
    process.stdout.write(await JsAesPhp.encrypt(value, password))
    process.exit(0)
  })()
} else if (testMethod === 'decrypt') {
  ;(async function () {
    process.stdout.write(JSON.stringify(await JsAesPhp.decrypt(process.argv[3], password)))
    process.exit(0)
  })()
} else {

  ;(async function () {
    await (async function () {
      const encrypted = await JsAesPhp.encrypt(value, password)
      const decrypted = JSON.parse(executePhp('decrypt', encrypted))

      console.log('===Encryption in JS and Decryption in PHP success===')
      console.log('Encrypted: ' + encrypted)
      console.log('Decrypted: ' + JSON.stringify(decrypted))
      assert(value, decrypted)
      console.log('===Encryption in JS and Decryption in PHP success===\n\n')
    })()

    await (await async function () {
      const encrypted = executePhp('encrypt', '')
      const decrypted = await JsAesPhp.decrypt(encrypted, password)

      console.log('===Encryption in PHP and Decryption in JS===')
      console.log('Encrypted: ' + encrypted)
      console.log('Decrypted: ' + JSON.stringify(decrypted))
      assert(value, decrypted)
      console.log('===Encryption in PHP and Decryption in JS success===\n\n')
    })()
  })()
}

