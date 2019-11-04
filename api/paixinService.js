import { axiosPaixin } from './factory/axiosFactory'

const paixinService = {
  recommendList(data, params) {
    const url = '/media/recommend_list'
    return axiosPaixin(url, data, params)
  },

  smcode(data) {
    const url = '/common/smcode'
    return axiosPaixin(url, data, {})
  },

  debug(data) {
    const url = '/common/debug'
    return axiosPaixin(url, data, {})
  },

  userDetail(data) {
    const url = '/user/detail'
    return axiosPaixin(url, data, {})
  },

  cashNeed(data) {
    const url = '/user/cash_need'
    return axiosPaixin(url, data, {})
  }
}

export default paixinService
