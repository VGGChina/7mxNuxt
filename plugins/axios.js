export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    config.method = 'POST'
    // config.headers = { 'Content-Type': 'application/json; charset=utf-8' }
    config.headers['Content-Type'] = 'application/json; charset=utf-8;'
    // config['access-control-request-headers'] = 'x-requested-with,content-type,if-modified-since,no-cookie,x-token'
    config.withCredentials = true
    config.responseType = 'text'
    return config
  })
}
