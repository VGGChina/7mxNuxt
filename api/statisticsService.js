import { $axios } from './factory/axiosFactory'

const statisticsService = {
  // 统计
  postBannerClickNum(data) {
    const url = 'tag/click'
    return $axios(url, data, {})
  }
}

export default statisticsService
