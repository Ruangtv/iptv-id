const { default: fetch } = require("node-fetch")

class Vidio {
  id = null
  constructor(id) {
    this.id = id
  }

  async getURL() {
    const url = `https://www.vidio.com/live/${this.id}/tokens?type=jwt`
    return fetch(url, { method: "POST" })
      .then((r) => r.json())
      .then(({ token }) => {
        try {
          const [exp, url] = this._parserToken(token)
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
      console.log(e)
      return [0, ""]
    }
  }

  async getHLS() {
    const url = await this.getURL()
    if (url)
      return fetch(url)
        .then((r) => r.text())
        .catch(console.log)
    return ""
  }
}

module.exports = Vidio
