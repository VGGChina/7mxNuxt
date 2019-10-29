import { axiosPaixin } from './factory/axiosFactory'

export default class paixinService {
  recommendList(data, params) {
    let url = '/media/recommend_list'
    return axiosPaixin(url, data, params)
  }

  smcode(data) {
    let url = '/common/smcode'
    return axiosPaixin(url, data, {})
  }

  /**
   * 前端错误信息收集接口
   * @param {*} data
   * data: {
   *   platform: (int 选填)
   *   type: (int 选填) 错误类型定义在了utils/utils.js的debugTypes对象中
   *   client: (str 选填) 用户的浏览器
   *   content: (str 必填) 错误内容（对象json序列化后的字符串）
   * }
   */

  debug(data) {
    let url = '/common/debug'
    return axiosPaixin(url, data, {})
  }

  userDetail(data) {
    let url = '/user/detail'
    return axiosPaixin(url, data, {})
  }

  cashNeed(data) {
    let url = '/user/cash_need'
    return axiosPaixin(url, data, {})
  }
}
