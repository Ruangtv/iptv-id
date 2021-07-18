function loggerMiddleware(req, _, next) {
  console.log(`${new Date().toISOString()} - ${req.method} - ${req.url}`)
  next()
}

module.exports = loggerMiddleware
