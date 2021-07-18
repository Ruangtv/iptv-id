#!/usr/bin/env node
const app = require("yargs")
const server = require("./lib/app")

app
  .scriptName("iptv-id")
  .command(
    "start [port]",
    "Start service",
    (yargs) => {
      return yargs.positional("port", {
        type: "number",
        default: 3000,
      })
    },
    ({ port }) => {
      server.listen(port, () => {
        console.log(`Server Start at port ${port}`)
        console.log("URL Playlist:", `http://localhost:${port}/playlist.m3u`)
      })
    }
  )
  .help().argv
