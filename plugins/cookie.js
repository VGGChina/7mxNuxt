export default ({ app }, inject) => {
  inject('setCookie', xToken => {
    app.$cookies.set('token', xToken, { maxAge: 1000000 })
  })
}
