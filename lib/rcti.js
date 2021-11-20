const http = require("https")

function rctiHandler(req, res, hostname, path) {
  const options = {
    hostname,
    path,
    method: req.method,
    headers: {
      referer: "https://embed.rctiplus.com/",
    },
  }
  const proxy = http.request(options, function (r) {
    res.writeHead(r.statusCode, r.headers)
    r.pipe(res, {
      end: true,
    })
  })

  req.pipe(proxy, {
    end: true,
  })
}

module.exports = rctiHandler
