const path = require("path")
const Papa = require("papaparse")
const { readFileSync } = require("fs")

class Playlist {
  db = ""
  base = "https://kelaswafa.github.io/pengumuman-iptv/movie/playlist.m3u8"
  constructor(db = path.join(__dirname, "..", "db.csv")) {
    this.db = db
  }

  getList() {
    return Papa.parse(readFileSync(this.db, "utf-8"), {
      header: true,
    }).data
  }

  getHLS(domain = "", auth = true) {
    let text = []
    text.push("#EXTM3U")
    this.getList().forEach((ch, idx) => {
      if (ch.name) {
        text.push(
          [
            "#EXTINF:-1",
            `tvg-logo=\"${ch.image}\"`,
            `group-title=\"${ch.group}\",`,
            ch.name.toUpperCase(),
          ].join(" ")
        )
        if (!auth) text.push(this.base)
        else if (ch.url) text.push(ch.url)
        else if (ch.rcti_plus)
          text.push(`${domain}/rcti/${auth}/${ch.rcti_plus}`)
        else if (ch.dm)
          text.push(`${domain}/dm/${ch.dm}/index.m3u8?token=${auth}`)
        else if (ch.twitch)
          text.push(`${domain}/twitch?id=${ch.twitch}&token=${auth}`)
        else
          text.push(`${domain}/vidio/${ch.vidio_id}/index.m3u8?token=${auth}`)
        text.push("")
      }
    })
    return text.join("\n")
  }
}

module.exports = Playlist
