// create all required dist files
const fs = require('fs')

const packageJson = require('../package.json')
const srcFile = __dirname + '/../dist/js-aes-php.js'
const srcFileModule = __dirname + '/../dist/js-aes-php.module.js'
let contents = fs.readFileSync(srcFile).toString().replace('export default class JsAesPhp', 'class JsAesPhp')
contents = '// JsAesPhp v' + packageJson.version + ' @ ' + packageJson.homepage + '\n' + contents
contents += `
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JsAesPhp
}
`
let contentsCommonJs = contents
fs.writeFileSync(srcFile, contentsCommonJs)
let contentsModule = contents.replace(/^class JsAesPhp/m, 'export default class JsAesPhp')
fs.writeFileSync(srcFileModule, contentsModule)