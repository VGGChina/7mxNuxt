import { axios7mx } from './factory/axiosFactory'

export default class userService {
  registerByEmail(data) {
    const url = '/user/regist'
    return axios7mx(url, data, {})
  }

  registerByPhone(data) {
    const url = '/user/quick_regist_by_phone'
    return axios7mx(url, data, {})
  }

  login(data) {
    const url = '/user/login'
    return axios7mx(url, data, {})
  }

  currentUser(cookie) {
    const url = '/user/current'
    return axios7mx(url, {}, {})
  }

  logout() {
    const url = '/user/logout'
    return axios7mx(url, {}, {})
  }

  codeLogin(data) {
    const url = '/user/login_by_smcode'
    return axios7mx(url, data, {})
  }

  userDetail(data) {
    const url = '/user/detail'
    return axios7mx(url, data, {})
  }

  companyDetail(data) {
    const url = '/company/detail'
    return axios7mx(url, data, {})
  }

  follow(data) {
    const url = '/user/follow'
    return axios7mx(url, data, {})
  }

  unfollow(data) {
    const url = '/user/drop_follow'
    return axios7mx(url, data, {})
  }

  bindPhone(data) {
    const url = '/user/bind_phone'
    return axios7mx(url, data, {})
  }

  getFollow(data, params) {
    const url = '/user/follow_list'
    return axios7mx(url, data, params)
  }

  getFan(data, params) {
    const url = '/user/fan_list'
    return axios7mx(url, data, params)
  }

  setUserInfo(data) {
    const url = '/user/set_info'
    return axios7mx(url, data, {})
  }

  setPassword(data) {
    const url = '/user/chpwd'
    return axios7mx(url, data, {})
  }

  setAvatar(data) {
    const url = '/user/set_avatar'
    return axios7mx(url, data, {})
  }

  setNick(data) {
    const url = '/user/set_nick'
    return axios7mx(url, data, {})
  }

  setName(data) {
    const url = '/user/set_name'
    return axios7mx(url, data, {})
  }

  setAuthCard(data) {
    const url = 'user/auth_card'
    return axios7mx(url, data, {})
  }

  setAuthCardCom(data) {
    const url = 'user/auth_card_com'
    return axios7mx(url, data, {})
  }

  forgetPasswordByEmail(data) {
    const url = 'user/for_fdpwd_by_email'
    return axios7mx(url, data, {})
  }

  modifyPasswordByEmail(data) {
    const url = 'user/fdpwd_by_email'
    return axios7mx(url, data, {})
  }

  modifyPasswordByPhone(data) {
    const url = 'user/fdpwd_by_phone'
    return axios7mx(url, data, {})
  }

  intoOther(data) {
    const url = 'user/into_other'
    return axios7mx(url, data, {})
  }

  paixinLoginSmcode(data) {
    const url = 'user/gaga_login_smcode'
    return axios7mx(url, data, {})
  }

  paixinLogin(data) {
    const url = 'user/gaga_login'
    return axios7mx(url, data, {})
  }

  recommendUser(data, params) {
    // const url = `${axios7mx.baseURL}user/recommend_list`
    const url = `https://api.7mx.com/user/recommend_list`
    return axios7mx(url, data, params)
  }

  risingList(data, params) {
    const url = 'user/rising_list'
    return axios7mx(url, data, params)
  }

  rankingList(data, params) {
    const url = 'user/ranking_list'
    return axios7mx(url, data, params)
  }

  descList(params) {
    const url = 'user/desc_list'
    return axios7mx(url, {}, params)
  }

  detailCard() {
    const url = 'user/detail_card'
    return axios7mx(url, {}, {})
  }

  // 动态列表
  getActivityList(data) {
    // 参数（type，1关注，2点赞，3 评论，不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
    const url = '/user/msg_list'
    return axios7mx(url, data)
  }

  /**
   * 销售额, 上架商品数
   * @param {Object} data
   */
  getSellNum(data) {
    // (gain收益，product_num作品数，media_num图片数)必须登陆
    const url = 'user/get_stat'
    return axios7mx(url, data)
  }

  /**
   * 订单列表, 必须登陆
   * @param {Object} data
   */
  getOrderList(data, params) {
    const url = 'user/order_list'
    return axios7mx(url, data, params)
  }

  // 评论、点赞、关注消息列表
  getactivityList(data, params) {
    // 参数（type，1关注，2点赞，3 评论，4 心愿单 不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
    const url = '/user/msg_list'
    return axios7mx(url, data, params)
  }

  // 搜索摄影师
  getPhotographerByName(data, params) {
    const url = '/user/common_list'
    return axios7mx(url, data, params)
  }
}
