const fetcher = require("./fetcher")
const Playlist = require("./playlist")
const { setStore, getStore } = require("./store")

class Vidio {
  id = null
  constructor(id) {
    const playlist = new Playlist().getList()
    const channel = playlist.find(({ vidio_id }) => vidio_id == id)
    this.id = id
    this.redisKey = "vidio-hls:" + id
    if (channel) this.redisKey = this.redisKey + ":" + channel.name
    this.expiredTime = 14350
  }

  async getURL() {
    const url = `https://www.vidio.com/live/${this.id}/tokens?type=jwt`
    const hlsUrl = await this.getByScript()

    return fetcher(url, { method: "POST" })
      .then((r) => r.text())
      .then((r) => {
        console.log("Generate Token!")
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

  /**
   *
   * @deprecated
   */
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
    const data = await fetcher(url).then((r) => r.text())
    const out = [...data.matchAll(/"([^"]+m3u8)"/gm)]
    const hlsUrl = out.map((x) => x[1])[0]
    return hlsUrl
  }

  async getHLS() {
    try {
      const token = getStore(this.redisKey)
      if (token) {
        console.log("Cache :", this.redisKey)
        return token
      }
      const url = await this.getURL()
      if (url) {
        const hls = await fetcher(url).then((r) => r.text())
        setStore(this.redisKey, hls, this.expiredTime)
        console.log("Store :", this.redisKey)
        return hls
      }
      return ""
    } catch (e) {
      console.log(e)
      return ""
    }
  }
}

module.exports = Vidio
