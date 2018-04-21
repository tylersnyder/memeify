const fetch = require('node-fetch')
const getImage = require('./get-image')
const endpoint = 'https://api.flickr.com/services/feeds/photos_public.gne?nojsoncallback=1&format=json'
const fallback = 'https://s-media-cache-ak0.pinimg.com/736x/91/c2/f8/91c2f8931b4954ab41f665e88b1e1acf--paula-deen-happy-thanksgiving.jpg'

module.exports = async function getRandomImageUrl(tags) {
  const url = tags
            ? `${endpoint}&tags=${tags}`
            : endpoint

  try {
    const response = await fetch(url)
    const sanitized = response.body.replace(/\\'/g, "'")
    const data = JSON.parse(sanitized)
    const url = data.items[Math.floor(Math.random() * data.items.length)]['media']['m'].replace('_m', '_b')
    const image = await getImage(url)
    return image
  } catch(error) {
    const image = await getImage(fallback)
    return image
  }
}
