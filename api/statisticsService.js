import { axios7mx } from './factory/axiosFactory'

const statisticsService = {
  // 统计
  postBannerClickNum(data) {
    const url = 'tag/click'
    return axios7mx(url, data, {})
  }
}

export default statisticsService
