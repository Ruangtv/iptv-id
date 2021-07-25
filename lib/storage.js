const { LocalStorage } = require("node-localstorage")
const storage = new LocalStorage("./.cache")

module.exports = storage
