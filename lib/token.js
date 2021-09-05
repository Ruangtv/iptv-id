const twitchHLS = require("./twitch")

const tokenMiddleware = async (req, res, next) => {
  const isToken = process.env.APP_TOKEN
  if (!isToken) return next()
  const { token } = req.query
  if (isToken == token) return next()
  return res.redirect(
    "https://kelaswafa.github.io/pengumuman-iptv/movie/playlist.m3u8"
  )
}

module.exports = tokenMiddleware
