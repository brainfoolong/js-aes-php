import JsAesPhp from '../src/ts/js-aes-php'


function assert (expected, actual) {
  expected = JSON.stringify(expected)
  actual = JSON.stringify(actual)
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error('Expected ' + expected + ' but got ' + actual)
  }
}

;(async function () {
  const value = { 'foobar': 'l`î', 'emojiiii': '😊' }
  const password = '😊Blub'
  const encrypted = await JsAesPhp.encrypt(value, password)
  const decrypted = await JsAesPhp.decrypt(encrypted, password)

  console.log('Original Value: ' + JSON.stringify(value))
  console.log('Encrypted: ' + encrypted)
  console.log('Decrypted: ' + JSON.stringify(decrypted))
  assert(value, decrypted)
  console.log('TEST SUCCESSFUL')
})()
