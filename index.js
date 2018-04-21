const jimp = require('jimp')
const getImage = require('./util/get-image')
const getRandomImage = require('./util/get-random-image')
const { tmpdir } = require('os')
const uuid = require('uuid/v1')

module.exports = async function memeify(options = {}) {
  const getCanvas = options.url
              ? () => getImage(options.url)
              : getRandomImage

  const getOverlay = options.overlay
                   ? () => getImage(options.overlay)
                   : () => getImage('./assets/joker-cropped.png')
  
  const [ canvas, overlay ] = await Promise.all([
    getCanvas(),
    getOverlay()
  ])

  const result = await render({
    canvas,
    overlay
  })
  
  if (result !== 'success') {
    throw result
  }

  return {
    filename,
    url: `${process.env.NOW_URL}/${filename}`
  }
}

function render({ canvas, overlay }) {
  return new Promise((resolve, reject) => {
    if (canvas.bitmap.width > 800) {
      canvas.resize(800, jimp.AUTO)
    }

    const { width } = canvas.bitmap
    const { height } = canvas.bitmap
    
    if (width < height) {
      overlay.resize(width * 0.5, jimp.AUTO)
    } else {
      overlay.resize(jimp.AUTO, height * 0.5)
    }

    const overlayWidth = width - overlay.bitmap.width
    const overlayHeight = height - overlay.bitmap.height
    const filename = `${uuid()}.png`
    
    canvas
      .composite(overlay, overlayWidth, overlayHeight)
      .write(`${tmpdir()}/${filename}`, (err) => {
        if (err) {
          return reject(err)
        }

        resolve('success')
      })
  })
}