const express = require("express")
const Dm = require("./dm")
const loggerMiddleware = require("./logger")
const Playlist = require("./playlist")
const twitchHLS = require("./twitch")
const Usee = require("./usee")
const Vidio = require("./vidio")
let server = express()

server.use(loggerMiddleware)

server.domain = (domain) => {
  this._domain = domain
}

server.get("/channels", (req, res) => {
  const playlist = new Playlist()
  res.json(playlist.getList())
})

server.get("/playlist.m3u", (req, res) => {
  const playlist = new Playlist()
  res.end(playlist.getHLS(this._domain))
})

server.get("/vidio", async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).end()
  const vidio = new Vidio(id)
  return res.end(await vidio.getHLS())
})

server.get("/dm", async (req, res) => {
  const { id } = req.query
  if (!id) return res.status(400).end()
  const dm = new Dm(id)
  return res.end(await dm.getHLS())
})

server.get("/twitch", async (req, res) => {
  const { id } = req.query
  return res.end(await twitchHLS(id))
})

server.get("/usee/:id", async (req, res) => {
  const id = req.params.id
  const usee = new Usee(id)
  try {
    const out = await usee.getHLS()
    return res.end(out)
  } catch (e) {
    console.log(e, usee.getUrl())
    return res.end("")
  }
})

module.exports = server
