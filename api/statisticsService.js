import { axios7mx } from './factory/axiosFactory'

export default class StatisticsService {
  // 统计
  postBannerClickNum(data) {
    let url = 'tag/click'
    return axios7mx(url, data, {})
  }
}
