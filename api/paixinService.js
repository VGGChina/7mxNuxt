export default ({ $axios }) => {
  const paixinService = {
    recommendList(data, params) {
      const httpData = {
        url: '/api2/media/recommend_list',
        data,
        params
      }
      return $axios(httpData)
    },

    smcode(data) {
      const httpData = {
        url: '/api2/common/smcode',
        data
      }
      return $axios(httpData)
    },

    debug(data) {
      const httpData = {
        url: '/api2/common/debug',
        data
      }
      return $axios(httpData)
    },

    userDetail(data) {
      const httpData = {
        url: '/api2/user/detail',
        data
      }
      return $axios(httpData)
    },

    cashNeed(data) {
      const httpData = {
        url: '/api2/user/cash_need',
        data
      }
      return $axios(httpData)
    }
  }
  $axios.paixinService = paixinService
}

