export default ({ $axios }) => {
  const commonService = {
    smcode(data) {
      const httpData = {
        url: '/api/common/smcode',
        data
      }
      return $axios(httpData)
    },

    categoryList(data) {
      const httpData = {
        url: '/api/common/category_list',
        data: data
      }
      return $axios(httpData)
    },

    getServerTime() {
      const httpData = {
        utl: '/api/common/time'
      }
      return $axios(httpData)
    },

    protocolList(data) {
      const url = '/api/common/protocol_list'
      return $axios(url, data, {})
    },

    getLargeImageList(data) {
      const url = '/api/common/get_banners'
      return $axios(url, data, {})
    },

    // 获取帮助列表
    getManualList(data) {
      const url = '/api/common/manual_list'
      return $axios(url, data)
    },

    // 获取某问题详情
    getQuestionDetail(data) {
      const url = '/api/common/manual_detail'
      return $axios(url, data)
    },

    // 将通知标记为已读
    markNoticeAsRead(data, params) {
      const url = '/api/common/notice_check'
      return $axios(url, data, params)
    },
    // 通知列表
    getNoticeList(data, params) {
      // 参数（unread，0 未读，1 已读，不传 读取所有）
      const url = '/api/common/notice_list'
      return $axios(url, data, params)
    },

    // 读动态将通知标记为已读
    markActivityAsRead(data, params) {
      const url = '/api/common/msg_check'
      return $axios(url, data, params)
    },

    // 将心愿单标识为已读
    markNeededAsRead(data, params) {
      const url = '/api/common/needed_check'
      return $axios(url, data, params)
    }
  }
  $axios.commonService = commonService
}
