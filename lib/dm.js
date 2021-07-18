const { default: fetch } = require("node-fetch")

class Dm {
  id = ""
  constructor(id) {
    this.id = id
  }

  async getHLS() {
    try {
      const url = "https://www.dailymotion.com/player/metadata/video/" + this.id
      const hlsUrl = await fetch(url)
        .then((r) => r.json())
        .then((r) => r.qualities.auto[0].url)
      return await fetch(hlsUrl).then((r) => r.text())
    } catch (e) {
      console.log(e)
      return ""
    }
  }
}

module.exports = Dm
