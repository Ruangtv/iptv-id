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
          const t = token.split(".")[1]
          const r = Buffer.from(t, "base64").toString()
          const base = JSON.parse(r).data.playlist_url
          return base + "?" + token
        } catch (e) {
          console.log(e)
          return ""
        }
      })
  }

  async getHLS() {
    const url = await this.getURL()
    return fetch(url).then((r) => r.text())
  }
}

module.exports = Vidio
