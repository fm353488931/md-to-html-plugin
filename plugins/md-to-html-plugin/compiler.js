const { randomNum } = require('./utils')
const reg_mark = /^(.+?)\s/
const reg_sharp = /^\#/
const reg_crossbar = /^\-/
const reg_number = /^\d/

function createTree(mdArr) {
  let _htmlPool = {}
  let _lastMark = ''
  let _key = 0
  mdArr.forEach((mdFragment) => {
    const matched = mdFragment.match(reg_mark)
    console.log(matched)
    if (matched) {
      const mark = matched[1]
      const input = matched['input']
      if (reg_sharp.test(mark)) {
        const tag = `h${mark.length}`
        const tagContent = input.replace(reg_mark, '')
        if (_lastMark === mark) {
          _htmlPool[tag].tags.push(`<${tag}>${tagContent}</${tag}>`)
        } else {
          _lastMark = mark
          _key = randomNum()
          _htmlPool[`${tag}-${_key}`] = {
            type: 'single',
            tags: [`<${tag}>${tagContent}</${tag}>`],
          }
        }
      }

      if (reg_crossbar.test(mark)) {
        const tagContent = input.replace(reg_mark, '')
        const tag = 'li'
        if (reg_crossbar.test(_lastMark)) {
          _htmlPool[`ul-${_key}`].tags.push(`<${tag}>${tagContent}</${tag}>`)
        } else {
          _lastMark = mark
          _key = randomNum()
          _htmlPool[`ul-${_key}`] = {
            type: 'wrap',
            tags: [`<${tag}>${tagContent}</${tag}>`],
          }
        }
      }

      if (reg_number.test(mark)) {
        const tagContent = input.replace(reg_mark, '')
        const tag = `li`
        if (reg_number.test(_lastMark)) {
          _htmlPool[`ol-${_key}`].tags.push(`<${tag}>${tagContent}</${tag}>`)
        } else {
          _lastMark = mark
          _key = randomNum()
          _htmlPool[`ol-${_key}`] = {
            type: 'wrap',
            tags: [`<${tag}>${tagContent}</${tag}>`],
          }
        }
      }
    }
  })
  console.log(_htmlPool)
  return _htmlPool
}

function compileHTML(_mdArr) {
  const _htmlPool = createTree(_mdArr)
  let _htmlStr = ''
  let item
  for (let k in _htmlPool) {
    item = _htmlPool[k]
    if (item.type === 'single') {
      item.tags.forEach((tag) => {
        _htmlStr += tag
      })
    } else if (item.type === 'wrap') {
      let _list = `<${k.split('-')[0]}>`
      item.tags.forEach((tag) => {
        _list += tag
      })
      _list += `</${k.split('-')[0]}>`
      _htmlStr += _list
    }
  }
  return _htmlStr
}

module.exports = { compileHTML }

/**
 * _htmlPool = {
  'h1-1676205419690': { type: 'single', tags: [ '<h1>???????????? h1 ?????????</h1>' ] },
  'ul-1676205413152': {
    type: 'wrap',
    tags: [
      '<li>?????? UL ????????? 1 ???</li>',
      '<li>?????? UL ????????? 2 ???</li>',
      '<li>?????? UL ????????? 3 ???</li>',
      '<li>?????? UL ????????? 4 ???</li>'
    ]
  },
  'h2-1676205415766': { type: 'single', tags: [ '<h2>???????????? h2 ?????????</h2>' ] },
  'ol-1676205421913': {
    type: 'wrap',
    tags: [
      '<li>?????? OL ????????? 1 ???</li>',
      '<li>?????? OL ????????? 2 ???</li>',
      '<li>?????? OL ????????? 3 ???</li>',
      '<li>?????? OL ????????? 4 ???</li>'
    ]
  }
}
 */
