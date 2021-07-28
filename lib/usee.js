const { default: fetch } = require("node-fetch")

class Usee {
  constructor(id) {
    this.id = id
  }

  async getUrl() {
    const regex = /"([a-zA-Z0-9=\/\+]{80,})"/gm
    const url = `https://useetv.com/livetv/${this.id}`
    const data = await fetch(url).then((r) => r.text())
    const out = [...data.matchAll(regex)]
      .map((x) => x[1])
      .reduce((a, b) => (a.length > b.length ? a : b))
    const hlsUrl = Buffer.from(out, "base64").toString()
    return hlsUrl
  }

  async getHLS() {
    const url = await this.getUrl()
    const out = await fetch(url).then((r) => r.text())
    return out
  }
}

module.exports = Usee
