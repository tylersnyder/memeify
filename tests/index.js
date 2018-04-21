const memeify = require('../index')
const http = require('http')

const server = http.createServer(async (req, res) => {
  const meme = await memeify()
  res.end(meme)
})

server.listen(8080)
