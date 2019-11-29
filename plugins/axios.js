export default function({ $axios, store, app }) {
  $axios.onRequest((config) => {
    // if (config.method.toLowerCase() === 'get') {
    //   config.method = 'GET'
    // } else {
    config.method = 'POST'
    // }
    config.headers['Content-Type'] = 'application/json; charset=utf-8;'
    config.headers['no-cookie'] = '1'

    if (process.client) {
      config.headers['x-token'] = window.localStorage['xToken']
    }
    config.withCredentials = true
    config.responseType = 'text'
    return config
  })

  $axios.onResponse((response) => {
    const xToken = response.headers['x-token']
    if (process.client && xToken) {
      window.localStorage['xToken'] = xToken
    }

    return response
  })
}
