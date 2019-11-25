export default function({ $axios, store, app }) {
  $axios.onRequest((config) => {
    config.method = 'POST'
    if (config.method.toLowerCase() === 'get') {
      config.method = 'GET'
    }
    config.headers['Content-Type'] = 'application/json; charset=utf-8;'
    config.headers['no-cookie'] = '1'
    // if (app.$cookies.get('token')) {
    // config.headers['x-token'] = app.$cookies.get('token')
    // }
    if (process.client) {
      // window.localStorage['xToken'] = xToken
      config.headers['x-token'] = window.localStorage['xToken']
    }
    config.withCredentials = true
    config.responseType = 'text'
    return config
  })

  $axios.onResponse((response) => {
    const xToken = response.headers['x-token']
    if (process.client) {
      window.localStorage['xToken'] = xToken
    }
    // if (xToken) {
    //   store.commit('login/setXtoken', xToken)
    // }
    return response
  })
}
