export default ({ $axios }) => {
  const userService = {
    registerByEmail(data) {
      const url = '/api/user/regist'
      return $axios(url, data, {})
    },

    registerByPhone(data) {
      const url = '/api/user/quick_regist_by_phone'
      return $axios(url, data, {})
    },

    login(data) {
      const url = '/api/user/login'
      return $axios(url, data, {})
    },

    currentUser(cookie) {
      const url = '/api/user/current'
      return $axios(url, {}, {})
    },

    logout() {
      const url = '/api/user/logout'
      return $axios(url, {}, {})
    },

    codeLogin(data) {
      const url = '/api/user/login_by_smcode'
      return $axios(url, data, {})
    },

    userDetail(data) {
      const httpdata = {
        url: '/api/user/detail',
        data: data
      }
      return $axios(httpdata)
    },

    companyDetail(data) {
      const url = '/api/company/detail'
      return $axios(url, data, {})
    },

    follow(data) {
      const url = '/api/user/follow'
      return $axios(url, data, {})
    },

    unfollow(data) {
      const url = '/api/user/drop_follow'
      return $axios(url, data, {})
    },

    bindPhone(data) {
      const url = '/api/user/bind_phone'
      return $axios(url, data, {})
    },

    getFollow(data, params) {
      const url = '/api/user/follow_list'
      return $axios(url, data, params)
    },

    getFan(data, params) {
      const url = '/api/user/fan_list'
      return $axios(url, data, params)
    },

    setUserInfo(data) {
      const url = '/api/user/set_info'
      return $axios(url, data, {})
    },

    setPassword(data) {
      const url = '/api/user/chpwd'
      return $axios(url, data, {})
    },

    setAvatar(data) {
      const url = '/api/user/set_avatar'
      return $axios(url, data, {})
    },

    setNick(data) {
      const url = '/api/user/set_nick'
      return $axios(url, data, {})
    },

    setName(data) {
      const url = '/api/user/set_name'
      return $axios(url, data, {})
    },

    setAuthCard(data) {
      const url = '/api/user/auth_card'
      return $axios(url, data, {})
    },

    setAuthCardCom(data) {
      const url = '/api/user/auth_card_com'
      return $axios(url, data, {})
    },

    forgetPasswordByEmail(data) {
      const url = '/api/user/for_fdpwd_by_email'
      return $axios(url, data, {})
    },

    modifyPasswordByEmail(data) {
      const url = '/api/user/fdpwd_by_email'
      return $axios(url, data, {})
    },

    modifyPasswordByPhone(data) {
      const url = '/api/user/fdpwd_by_phone'
      return $axios(url, data, {})
    },

    intoOther(data) {
      const url = '/api/user/into_other'
      return $axios(url, data, {})
    },

    paixinLoginSmcode(data) {
      const url = '/api/user/gaga_login_smcode'
      return $axios(url, data, {})
    },

    paixinLogin(data) {
      const url = '/api/user/gaga_login'
      return $axios(url, data, {})
    },

    recommendUser(data, params) {
      const httpData = {
        url: `/api/user/recommend_list`,
        data,
        params
      }
      return $axios(httpData)
    },

    risingList(data, params) {
      const url = '/api/user/rising_list'
      return $axios(url, data, params)
    },

    rankingList(data, params) {
      const url = '/api/user/ranking_list'
      return $axios(url, data, params)
    },

    descList(params) {
      const url = '/api/user/desc_list'
      return $axios(url, {}, params)
    },

    detailCard() {
      const url = '/api/user/detail_card'
      return $axios(url, {}, {})
    },

    getActivityList(data) {
      // 参数（type，1关注，2点赞，3 评论，不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
      const url = '/api/user/msg_list'
      return $axios(url, data)
    },

    /**
     * 销售额, 上架商品数
     * @param {Object}, data
     */
    getSellNum(data) {
      // (gain收益，product_num作品数，media_num图片数)必须登陆
      const url = '/api/user/get_stat'
      return $axios(url, data)
    },

    /**
     * 订单列表, 必须登陆
     * @param {Object}, data
     */
    getOrderList(data, params) {
      const url = '/api/user/order_list'
      return $axios(url, data, params)
    },

    // 评论、点赞、关注消息列表
    getactivityList(data, params) {
      // 参数（type，1关注，2点赞，3 评论，4 心愿单 不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
      const url = '/api/user/msg_list'
      return $axios(url, data, params)
    },

    // 搜索摄影师
    getPhotographerByName(data, params) {
      const url = '/api/user/common_list'
      return $axios(url, data, params)
    }

  }
  $axios.userService = userService
}

