export default ({ $axios }) => {
  const commonService = {
    smcode(params) {
      const httpData = {
        url: '/api3/users/code',
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },

    categoryList(data) {
      const httpData = {
        url: '/api/common/category_list',
        data
      }
      return $axios(httpData)
    },

    categoryList2(type) {
      const httpData = {
        url: `/api3/categories/${type}`,
        method: 'get'
      }
      return $axios(httpData)
    },

    getServerTime() {
      const httpData = {
        url: '/api3/common/time',
        method: 'get'
      }
      return $axios(httpData)
    },

    getServerTime2() {
      const httpData = {
        url: '/api3/common/time',
        method: 'get'
      }
      return $axios(httpData)
    },

    getLargeImageList(data) {
      const httpData = {
        url: '/api/common/get_banners',
        data
      }
      return $axios(httpData)
    },

    // 获取帮助列表
    getManualList(data) {
      const httpData = {
        url: '/api/common/manual_list',
        data
      }
      return $axios(httpData)
    },

    // 获取某问题详情
    getQuestionDetail(data) {
      const httpData = {
        url: '/api/common/manual_detail',
        data
      }
      return $axios(httpData)
    },

    // 将通知标记为已读
    markNoticeAsRead(data, params) {
      const httpData = {
        url: '/api/common/notice_check',
        data,
        params
      }
      return $axios(httpData)
    },
    // 通知列表
    getNoticeList(data, params) {
      // 参数（unread，0 未读，1 已读，不传 读取所有）
      const httpData = {
        url: '/api/common/notice_list',
        data,
        params
      }
      return $axios(httpData)
    },

    // 读动态将通知标记为已读
    markActivityAsRead(data, params) {
      const httpData = {
        url: '/api/common/msg_check',
        data,
        params
      }
      return $axios(httpData)
    },

    // 将心愿单标识为已读
    markNeededAsRead(data, params) {
      const httpData = {
        url: '/api/common/needed_check',
        data,
        params
      }
      return $axios(httpData)
    }
  }
  $axios.commonService = commonService
}
