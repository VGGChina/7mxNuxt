export default function ({ $axios, app }) {
  $axios.onRequest((config) => {
    if (config.method.toLowerCase() === 'get') {
      config.method = 'GET'
    } else {
      config.method = 'POST'
    }
    config.headers['Content-Type'] = 'application/json; charset=utf-8;'
    config.headers['no-cookie'] = '1'

    if (process.client) {
      config.headers['authorization'] = window.localStorage['authorization']
    }
    config.withCredentials = true
    config.responseType = 'text'
    return config
  })

  $axios.interceptors.response.use(
    response => {
      const authorization = response.headers['authorization']
      if (process.client && (authorization)) {
        window.localStorage['authorization'] = authorization
      }
      return response
    },
    error => {
      return Promise.reject(error.response.data.message)
    }
  )
}
