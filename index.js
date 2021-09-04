#!/usr/bin/env node
const app = require("yargs")
const server = require("./lib/app")

app
  .scriptName("iptv-id")
  .command(
    "start [port] [domain]",
    "Start service",
    (yargs) => {
      return yargs.positional("port", {
        type: "number",
        default: 3000,
      })
    },
    ({ port, domain }) => {
      if (domain) server.domain(domain)
      server.listen(port, () => {
        console.log(`Server Start at port ${port}`)
        console.log(
          "URL Playlist:",
          `${domain || `http://localhost:${port}`}/playlist.m3u`
        )
      })
    }
  )
  .help().argv

module.exports = server
