import { axios7mx } from './factory/axiosFactory';

export default class CommonService {
  smcode(data) {
    let url = '/common/smcode';
    return axios7mx(url, data, {});
  }

  categoryList(data) {
    let url = '/common/category_list';
    return axios7mx(url, data, {});
  }

  getServerTime() {
    let url = '/common/time';
    return axios7mx(url, {}, {});
  }

  protocolList(data) {
    let url = '/common/protocol_list';
    return axios7mx(url, data, {});
  }

  getLargeImageList(data) {
    let url = '/common/get_banners';
    return axios7mx(url, data, {});
  }

  // 获取帮助列表
  getManualList(data) {
    let url = '/common/manual_list'
    return axios7mx(url, data)
  }

  // 获取某问题详情
  getQuestionDetail(data) {
    let url = '/common/manual_detail'
    return axios7mx(url, data)
  }

  // 通知 =======================================

  // 将通知标记为已读
  markNoticeAsRead(data, params) {
    let url = '/common/notice_check'
    return axios7mx(url, data, params)
  }

  // 通知列表
  getNoticeList(data, params) {
    // 参数（unread，0 未读，1 已读，不传 读取所有）
    let url = '/common/notice_list'
    return axios7mx(url, data, params)
  }

  // 读动态将通知标记为已读
  markActivityAsRead(data, params) {
    let url = '/common/msg_check'
    return axios7mx(url, data, params)
  }

  // 将心愿单标识为已读
  markNeededAsRead(data, params) {
    let url = '/common/needed_check'
    return axios7mx(url, data, params)
  }
}
