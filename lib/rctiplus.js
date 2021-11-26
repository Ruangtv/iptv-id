const { exit } = require("yargs")
const fetcher = require("./fetcher")
const Playlist = require("./playlist")
const { setStore, getStore } = require("./store")

class RctiPlus {
  id = null
  constructor(id) {
    this.id = id
    this.redisKey = "rctiplus-hls:" + id
    this.expiredTime = 14350
  }

  async getURL() {
    const url = `https://www.rctiplus.com/tv/${this.id}`
    const jwtRegex = /['"]Authorization['"]:['"]([0-9A-Z\-_.]+)['"]/i
    const livestreamIdRegex = /https:\/\/api\.rctiplus\.com\/api\/v1\/live-event\/(\d+)\/url/i
    
    let r = await fetcher(url).then((r) => r.text())
    console.log("Generate Token!")
    const token = jwtRegex.exec(r)[1]
    const id = livestreamIdRegex.exec(r)[1]
    return this.getByAPI({ token: token, id: id }).then((url) => {
      return url
    }).catch ((e) => {
      console.log(e)
      return ""
    })
  }

  async getByAPI(r) {
    const url = `https://api.rctiplus.com/api/v1/live-event/${r.id}/url`
    const ops = {
      headers: {
        authorization: r.token
      }
    }
    const data = await fetcher(url, ops).then((r) => r.json())
    const hlsUrl = data.data.url
    return hlsUrl
  }

  async getHLS() {
    const ops = {
      headers: {
        Origin: "https://www.rctiplus.com",
        Referer: "https://www.rctiplus.com/"
      }
    }
    try {
      const token = getStore(this.redisKey)
      if (token) {
        console.log("Cache :", this.redisKey)
        return token
      }
      const url = await this.getURL()
      if (url) {
        const hls = await fetcher(url, ops).then((r) => r.text())
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

module.exports = RctiPlus
