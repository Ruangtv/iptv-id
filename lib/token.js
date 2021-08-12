const twitchHLS = require("./twitch")

const tokenMiddleware = async (req, res, next) => {
  const isToken = process.env.APP_TOKEN
  if (!isToken) return next()
  const { token } = req.query
  if (isToken == token) return next()
  return res.end(await twitchHLS("eiwafa__"))
}

module.exports = tokenMiddleware
