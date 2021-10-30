const Redis = require("ioredis")
let redisClient = process.env.REDIS ? new Redis(process.env.REDIS) : undefined
module.exports = redisClient
