const { readFileSync } = require('fs')
const { resolve } = require('path')
const { compileHTML } = require('./compiler')
const INNER_MARK = '<!-- inner -->'

class MdToHtmlPlugin {
  constructor({ template, filename }) {
    if (!template) {
      throw new Error('no template')
    }
    this.template = template
    this.filename = filename || 'md.html'
  }
  apply(compiler) {
    compiler.hooks.emit.tap('md-to-html-plugin', (compilation) => {
      const _assets = compilation.assets
      const _mdContenet = readFileSync(this.template, 'utf8')
      const _templateHTML = readFileSync(resolve(__dirname, 'template.html'), 'utf8')
      const _mdContenetArr = _mdContenet.split('\n')
      const _htmlStr = compileHTML(_mdContenetArr)
      const _finalHTML = _templateHTML.replace(INNER_MARK, _htmlStr)

      _assets[this.filename] = {
        source() {
          return _finalHTML
        },
        size() {
          return _finalHTML.length
        },
      }
    })
  }
}
module.exports = MdToHtmlPlugin
