const path = require("path")
const Papa = require("papaparse")
const { readFileSync } = require("fs")

class Playlist {
  db = ""
  constructor(db = path.join(__dirname, "..", "db.csv")) {
    this.db = db
  }

  getList() {
    return Papa.parse(readFileSync(this.db, "utf-8"), {
      header: true,
    }).data
  }

  getHLS(domain = "") {
    let text = []
    text.push("#EXTM3U")
    this.getList().forEach((ch) => {
      if (ch.name) {
        text.push(
          [
            "#EXTINF:-1",
            `tvg-logo=\"${ch.image}\"`,
            `group-title=\"${ch.group}\",`,
            ch.name.toUpperCase(),
          ].join(" ")
        )
        if (ch.url) text.push(ch.url)
        else if (ch.dm) text.push(domain + "/dm?id=" + ch.dm)
        else text.push(domain + "/vidio?id=" + ch.vidio_id)
        text.push("")
      }
    })
    return text.join("\n")
  }
}

module.exports = Playlist
