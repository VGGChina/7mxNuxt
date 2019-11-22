export default ({ $axios }) => {
  const uptokenService = {
    uptoken(data) {
      const httpData = {
        url: '/api/thirdpart/qiniu',
        data
      }
      return $axios(httpData)
    }
  }
  $axios.uptokenService = uptokenService
}
