const store = require("store")

const getStore = (key) => {
  const data = store.get(key)
  const now = new Date().getTime()
  if (!data) return null
  if (data.exp < now) return null
  return data.value
}

const setStore = (key, value, exp) => {
  store.set(key, {
    exp: new Date().getTime() + exp * 1000,
    value,
  })
}

module.exports = { getStore, setStore }
