const { default: fetch } = require("node-fetch")
const redisClient = require("./redis")

class Vidio {
  id = null
  constructor(id) {
    this.id = id
    this.isRedis = process.env.REDIS
    this.redisKey = "vidio-hls:" + id
    this.expiredTime = 12000
  }

  async getURL() {
    const url = `https://www.vidio.com/live/${this.id}/tokens?type=jwt`
    const hlsUrl = await this.getByScript()

    return fetch(url, { method: "POST" })
      .then((r) => r.text())
      .then((r) => {
        console.log(r)
        return r
      })
      .then((r) => {
        return JSON.parse(r)
      })
      .then(({ token }) => {
        try {
          const url = hlsUrl + "?" + token
          return url
        } catch (e) {
          console.log(e)
          return ""
        }
      })
      .catch(console.log)
  }

  _parserToken(token) {
    try {
      const t = token.split(".")[1]
      const r = Buffer.from(t, "base64").toString()
      const { data, exp } = JSON.parse(r)
      const base = data.playlist_url
      return [exp, base + "?" + token]
    } catch (e) {
      console.log(e, { token })
      return [0, ""]
    }
  }

  async getByScript() {
    const url = `https://www.vidio.com/live/${this.id}/embed`
    const data = await fetch(url).then((r) => r.text())
    const out = [...data.matchAll(/"([^"]+m3u8)"/gm)]
    const hlsUrl = out.map((x) => x[1])[0]
    return hlsUrl
  }

  async getHLS() {
    try {
      if (this.isRedis) {
        const token = await redisClient.get(this.redisKey)
        if (token) {
          console.log("Code from redis!")
          return token
        }
      }

      const url = await this.getURL()
      if (url) {
        const hls = await fetch(url).then((r) => r.text())
        if (this.isRedis) {
          redisClient.set(this.redisKey, hls).then(() => {
            redisClient.expire(this.redisKey, this.expiredTime)
          })
        }
        return hls
      }
      return ""
    } catch (e) {
      return ""
    }
  }
}

module.exports = Vidio
