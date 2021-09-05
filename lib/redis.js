const Redis = require("ioredis")
let redisClient = new Redis(process.env.REDIS)
module.exports = redisClient
