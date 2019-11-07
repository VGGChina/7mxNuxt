// import userService from '~/api/userService'

export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    config.method = 'POST'
    config.headers = { 'Content-Type': 'application/json; charset=utf-8' }
    config.withCredentials = true
    config.responseType = 'text'
    return config
  })
}
