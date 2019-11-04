import { axios7mx } from './factory/axiosFactory'

const commonService = {
  smcode(data) {
    const url = '/common/smcode'
    return axios7mx(url, data, {})
  },

  categoryList(data) {
    const url = 'https://api.7mx.com/common/category_list'
    // const url = '/common/category_list'
    return axios7mx(url, data, {})
  },

  getServerTime() {
    const url = '/common/time'
    return axios7mx(url, {}, {})
  },

  protocolList(data) {
    const url = '/common/protocol_list'
    return axios7mx(url, data, {})
  },

  getLargeImageList(data) {
    const url = '/common/get_banners'
    return axios7mx(url, data, {})
  },

  // 获取帮助列表
  getManualList(data) {
    const url = '/common/manual_list'
    return axios7mx(url, data)
  },

  // 获取某问题详情
  getQuestionDetail(data) {
    const url = '/common/manual_detail'
    return axios7mx(url, data)
  },

  // 通知 =======================================

  // 将通知标记为已读
  markNoticeAsRead(data, params) {
    const url = '/common/notice_check'
    return axios7mx(url, data, params)
  },
  // 通知列表
  getNoticeList(data, params) {
    // 参数（unread，0 未读，1 已读，不传 读取所有）
    const url = '/common/notice_list'
    return axios7mx(url, data, params)
  },

  // 读动态将通知标记为已读
  markActivityAsRead(data, params) {
    const url = '/common/msg_check'
    return axios7mx(url, data, params)
  },

  // 将心愿单标识为已读
  markNeededAsRead(data, params) {
    const url = '/common/needed_check'
    return axios7mx(url, data, params)
  }
}

export default commonService
