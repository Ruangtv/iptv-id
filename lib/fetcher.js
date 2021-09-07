const fetch = require("node-fetch")

const fetcher = async (url, ops) => {
  const fetchUrl = process.env.FETCHER
  if (fetchUrl) {
    console.log("use proxy!")
    const customUrl = fetchUrl + encodeURIComponent(url)
    return fetch(customUrl, ops)
  }
  return fetch(url, ops)
}

module.exports = fetcher
