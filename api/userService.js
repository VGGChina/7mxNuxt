export default ({ $axios }) => {
  const userService = {

    // 注册获取的验证码
    getRegisterCode(params) {
      const httpData = {
        url: '/api3/users/code',
        params
      }
      return $axios(httpData)
    },

    register(data) {
      const httpData = {
        url: '/api3/users/register',
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

    userDetail(data) {
      const httpdata = {
        url: `/api3/users/desc/${data.userId}`,
        method: 'GET'
      }
      return $axios(httpdata)
    },

    // 用户界面数据
    getUserDatas(data) {
      const httpdata = {
        url: `/api3/users/media/${data.userId}/${data.type}`,
        params: data.params,
        method: 'GET'
      }
      return $axios(httpdata)
    },

    // 关注与跟随
    getFollowOrFan(data) {
      const httpdata = {
        url: `/api3/users/follow-list/${data.userID}/${data.type}`,
        params: data.params,
        method: 'GET'
      }
      return $axios(httpdata)
    },

    // 评论
    setComment(data) {
      const httpdata = {
        url: `/api3/medias/comment`,
        data: data,
        method: 'post'
      }
      return $axios(httpdata)
    },

    follow(data) {
      const httpData = {
        url: '/api3/users/follow',
        data,
        method: 'post'
      }
      return $axios(httpData)
    },

    unfollow(data) {
      const httpData = {
        url: '/api3/users/cancel-follow',
        data,
        method: 'post'
      }
      return $axios(httpData)
    },

    // 是否已关注
    isFollowAPI(params) {
      const httpData = {
        url: '/api3/users/is-follow',
        params
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

    updateUser(data) {
      const httpData = {
        url: '/api3/users/update',
        data,
        method: 'PUT'
      }
      return $axios(httpData)
    },


    setAuthCard(data) {
      const httpData = {
        url: '/api3/users/auth',
        data,
        method: 'POST'
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
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    modifyPasswordByPhone(data) {
      const httpData = {
        url: '/api3/users/password',
        data,
        method: 'POST'
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

    getUserAuth(data) {
      const httpData = {
        url: '/api3/users/auth',
        data,
        method: 'GET'
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
        // url: '/api/user/get_stat',
        url: '/api3/users/income-stat',
        data,
        method: 'GET'
      }
      return $axios(httpData)
    },

    //获取用户数据
    getUserDetail() {
      const httpdata = {
        url: `/api3/users/stat`,
        method: 'GET'
      }
      return $axios(httpdata)
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

