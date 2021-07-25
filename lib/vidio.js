const { default: fetch } = require("node-fetch")
const storage = require("./storage")

class Vidio {
  id = null
  constructor(id) {
    this.id = id
    this.storage = storage
  }

  async getURL() {
    const key = "vidio:" + this.id
    const oldToken = this.storage.getItem(key)
    if (oldToken) {
      const [exp, playlistUrl] = this._parserToken(oldToken)
      const isExp = exp * 1000 - new Date().getTime() < 1000
      if (!isExp) return playlistUrl
    }

    const url = `https://www.vidio.com/live/${this.id}/tokens?type=jwt`
    return fetch(url, { method: "POST" })
      .then((r) => r.json())
      .then(({ token }) => {
        try {
          const [exp, url] = this._parserToken(token)
          if (exp) this.storage.setItem(key, token)
          return url
        } catch (e) {
          console.log(e)
          return ""
        }
      })
  }

  _parserToken(token) {
    try {
      const t = token.split(".")[1]
      const r = Buffer.from(t, "base64").toString()
      const { data, exp } = JSON.parse(r)
      const base = data.playlist_url
      return [exp, base + "?" + token]
    } catch (e) {
      console.log(e)
      return [0, ""]
    }
  }

  async getHLS() {
    const url = await this.getURL()
    if (url) return fetch(url).then((r) => r.text())
    return ""
  }
}

module.exports = Vidio
