const fetch = require("node-fetch")

const fetcher = async (url, ops, withFetcher = true) => {
  const fetchUrl = process.env.FETCHER
  if (fetchUrl && withFetcher) {
    console.log("use proxy!")
    const customUrl = fetchUrl + encodeURIComponent(url)
    return fetch(customUrl, ops)
  }
  return fetch(url, ops)
}

module.exports = fetcher
