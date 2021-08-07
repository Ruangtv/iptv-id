const { default: fetch } = require("node-fetch")

class Vidio {
  id = null
  constructor(id) {
    this.id = id
  }

  async getURL() {
    const url = `https://www.vidio.com/live/${this.id}/tokens?type=jwt`
    const hlsUrl = await this.getByScript()
    return fetch(url, { method: "POST" })
      .then((r) => r.json())
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
    const url = await this.getURL()
    if (url)
      return fetch(url)
        .then((r) => r.text())
        .catch(console.log)
    const data = await this.getByScript()
    return data
  }
}

module.exports = Vidio
