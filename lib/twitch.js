const { default: fetch } = require("node-fetch")
const twitch = require("twitch-m3u8")

async function twitchHLS(id) {
  try {
    if (id) {
      const { url } = await twitch
        .getStream(id)
        .then((data) =>
          data.find(({ quality }) => quality.includes("(source)"))
        )
      if (url) return await fetch(url).then((r) => r.text())
    }
    return ""
  } catch (e) {
    console.log(e)
    return ""
  }
}

module.exports = twitchHLS
