export default ({ $axios }) => {
  const userService = {
    registerByEmail(data) {
      const httpData = {
        url: '/api/user/regist',
        data
      }
      return $axios(httpData)
    },

    registerByPhone(data) {
      const httpData = {
        url: '/api/user/quick_regist_by_phone',
        data
      }
      return $axios(httpData)
    },

    login(data) {
      const httpData = {
        url: '/api/user/login',
        data,
        method: 'post'
      }
      return $axios(httpData)
    },

    login2(data) {
      const httpData = {
        url: '/api3/users/login',
        data,
        method: 'post'
      }
      return $axios(httpData)
    },

    currentUser() {
      const httpData = {
        url: '/api/user/current'
      }
      return $axios(httpData)
    },

    logout() {
      const httpData = {
        url: '/api/user/logout'
      }
      return $axios(httpData)
    },

    codeLogin(data) {
      const httpData = {
        url: '/api/user/login_by_smcode',
        data
      }
      return $axios(httpData)
    },

    userDetail(data) {
      const httpdata = {
        url: '/api/user/detail',
        data
      }
      return $axios(httpdata)
    },

    companyDetail(data) {
      const httpData = {
        url: '/api/company/detail',
        data
      }
      return $axios(httpData)
    },

    follow(data) {
      const httpData = {
        url: '/api/user/follow',
        data
      }
      return $axios(httpData)
    },

    unfollow(data) {
      const httpData = {
        url: '/api/user/drop_follow',
        data
      }
      return $axios(httpData)
    },

    bindPhone(data) {
      const httpData = {
        url: '/api/user/bind_phone',
        data
      }
      return $axios(httpData)
    },

    getFollow(data, params) {
      const httpData = {
        url: '/api/user/follow_list',
        data,
        params
      }
      return $axios(httpData)
    },

    getFan(data, params) {
      const httpData = {
        url: '/api/user/fan_list',
        data,
        params
      }
      return $axios(httpData)
    },

    setUserInfo(data) {
      const httpData = {
        url: '/api/user/set_info',
        data
      }
      return $axios(httpData)
    },

    setPassword(data) {
      const httpData = {
        url: '/api/user/chpwd',
        data
      }
      return $axios(httpData)
    },

    setAvatar(data) {
      const httpData = {
        url: '/api/user/set_avatar',
        data
      }
      return $axios(httpData)
    },

    setNick(data) {
      const httpData = {
        url: '/api/user/set_nick',
        data
      }
      return $axios(httpData)
    },

    setName(data) {
      const httpData = {
        url: '/api/user/set_name',
        data
      }
      return $axios(httpData)
    },

    setAuthCard(data) {
      const httpData = {
        url: '/api/user/auth_card',
        data
      }
      return $axios(httpData)
    },

    setAuthCardCom(data) {
      const httpData = {
        url: '/api/user/auth_card_com',
        data
      }
      return $axios(httpData)
    },

    forgetPasswordByEmail(data) {
      const httpData = {
        url: '/api/user/for_fdpwd_by_email',
        data
      }
      return $axios(httpData)
    },

    modifyPasswordByEmail(data) {
      const httpData = {
        url: '/api/user/fdpwd_by_email',
        data
      }
      return $axios(httpData)
    },

    modifyPasswordByPhone(data) {
      const httpData = {
        url: '/api/user/fdpwd_by_phone',
        data
      }
      return $axios(httpData)
    },

    intoOther(data) {
      const httpData = {
        url: '/api/user/into_other',
        data
      }
      return $axios(httpData)
    },

    paixinLoginSmcode(data) {
      const httpData = {
        url: '/api/user/gaga_login_smcode',
        data
      }
      return $axios(httpData)
    },

    paixinLogin(data) {
      const httpData = {
        url: '/api/user/gaga_login',
        data
      }
      return $axios(httpData)
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
      const httpData = {
        url: '/api/user/rising_list',
        data,
        params
      }
      return $axios(httpData)
    },

    rankingList(data, params) {
      const httpData = {
        url: '/api/user/ranking_list',
        data,
        params
      }
      return $axios(httpData)
    },

    descList(params) {
      const httpData = {
        url: '/api/user/desc_list',
        params
      }
      return $axios(httpData)
    },

    detailCard() {
      const httpData = {
        url: '/api/user/detail_card'
      }
      return $axios(httpData)
    },

    getActivityList(data) {
      // 参数（type，1关注，2点赞，3 评论，不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
      const httpData = {
        url: '/api/user/msg_list',
        data
      }
      return $axios(httpData)
    },

    /**
     * 销售额, 上架商品数
     * @param {Object}, data
     */
    getSellNum(data) {
      // (gain收益，product_num作品数，media_num图片数)必须登陆
      const httpData = {
        url: '/api/user/get_stat',
        data
      }
      return $axios(httpData)
    },

    /**
     * 订单列表, 必须登陆
     * @param {Object}, data
     */
    getOrderList(data, params) {
      const httpData = {
        url: '/api/user/order_list',
        data,
        params
      }
      return $axios(httpData)
    },

    // 评论、点赞、关注消息列表
    getactivityList(data, params) {
      // 参数（type，1关注，2点赞，3 评论，4 心愿单 不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
      const httpData = {
        url: '/api/user/msg_list',
        data,
        params
      }
      return $axios(httpData)
    },

    // 搜索摄影师
    getPhotographerByName(data, params) {
      const httpData = {
        url: '/api/user/common_list',
        data,
        params
      }
      return $axios(httpData)
    }

  }
  $axios.userService = userService
}

