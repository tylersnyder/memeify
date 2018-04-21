const { read } = require('jimp')

module.exports = async function getImage(path) {
  return new Promise((resolve, reject) => {
    read(path, (err, image) => {
      if (err) {
        return reject(err.message)
      }

      resolve(image)
    })
  })
}
