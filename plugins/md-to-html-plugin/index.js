const { readFileSync } = require('fs')
const { resolve } = require('path')
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
    })
  }
}
module.exports = MdToHtmlPlugin
