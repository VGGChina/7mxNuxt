import { axios7mx } from './factory/axiosFactory';

export default class userService {
  registerByEmail(data) {
    let url = '/user/regist';
    return axios7mx(url, data, {});
  }

  registerByPhone(data) {
    let url = '/user/quick_regist_by_phone';
    return axios7mx(url, data, {});
  }

  login(data) {
    let url = '/user/login';
    return axios7mx(url, data, {});
  }

  currentUser(cookie) {
    let url = '/user/current';
    return axios7mx(url, {}, {});
  }

  logout() {
    let url = '/user/logout';
    return axios7mx(url, {}, {});
  }

  codeLogin(data) {
    let url = '/user/login_by_smcode';
    return axios7mx(url, data, {});
  }

  userDetail(data) {
    let url = '/user/detail';
    return axios7mx(url, data, {});
  }

  companyDetail(data) {
    let url = '/company/detail';
    return axios7mx(url, data, {});
  }

  follow(data) {
    let url = '/user/follow';
    return axios7mx(url, data, {});
  }

  unfollow(data) {
    let url = '/user/drop_follow';
    return axios7mx(url, data, {});
  }

  bindPhone(data) {
    let url = '/user/bind_phone';
    return axios7mx(url, data, {});
  }

  getFollow(data, params) {
    let url = '/user/follow_list';
    return axios7mx(url, data, params);
  }

  getFan(data, params) {
    let url = '/user/fan_list';
    return axios7mx(url, data, params);
  }

  setUserInfo(data) {
    let url = '/user/set_info';
    return axios7mx(url, data, {});
  }

  setPassword(data) {
    let url = '/user/chpwd';
    return axios7mx(url, data, {});
  }

  setAvatar(data) {
    let url = '/user/set_avatar';
    return axios7mx(url, data, {});
  }

  setNick(data) {
    let url = '/user/set_nick';
    return axios7mx(url, data, {});
  }

  setName(data) {
    let url = '/user/set_name';
    return axios7mx(url, data, {});
  }

  setAuthCard(data) {
    let url = 'user/auth_card';
    return axios7mx(url, data, {});
  }

  setAuthCardCom(data) {
    let url = 'user/auth_card_com';
    return axios7mx(url, data, {});
  }

  forgetPasswordByEmail(data) {
    let url = 'user/for_fdpwd_by_email';
    return axios7mx(url, data, {});
  }

  modifyPasswordByEmail(data) {
    let url = 'user/fdpwd_by_email';
    return axios7mx(url, data, {});
  }

  modifyPasswordByPhone(data) {
    let url = 'user/fdpwd_by_phone';
    return axios7mx(url, data, {});
  }

  intoOther(data) {
    let url = 'user/into_other';
    return axios7mx(url, data, {});
  }

  paixinLoginSmcode(data) {
    let url = 'user/gaga_login_smcode';
    return axios7mx(url, data, {});
  }

  paixinLogin(data) {
    let url = 'user/gaga_login';
    return axios7mx(url, data, {});
  }

  recommendUser(data, params) {
    let url = 'user/recommend_list'
    return axios7mx(url, data, params)
  }

  risingList(data, params) {
    let url = 'user/rising_list'
    return axios7mx(url, data, params)
  }

  rankingList(data, params) {
    let url = 'user/ranking_list'
    return axios7mx(url, data, params)
  }

  descList(params) {
    let url = 'user/desc_list'
    return axios7mx(url, {}, params)
  }

  detailCard() {
    let url = 'user/detail_card'
    return axios7mx(url, {}, {})
  }

  // 动态列表
  getActivityList(data) {
    // 参数（type，1关注，2点赞，3 评论，不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
    let url = '/user/msg_list'
    return axios7mx(url, data)
  }

  /**
   * 销售额, 上架商品数
   * @param {Object} data
   */
  getSellNum(data) {
    // (gain收益，product_num作品数，media_num图片数)必须登陆
    let url = 'user/get_stat'
    return axios7mx(url, data)
  }

  /**
   * 订单列表, 必须登陆
   * @param {Object} data
   */
  getOrderList(data, params) {
    let url = 'user/order_list'
    return axios7mx(url, data, params)
  }

  // 评论、点赞、关注消息列表
  getactivityList(data, params) {
    // 参数（type，1关注，2点赞，3 评论，4 心愿单 不传 读取所有;unread 0未读消息，1已读消息，不传 读取该类所有）
    let url = '/user/msg_list'
    return axios7mx(url, data, params)
  }

  // 搜索摄影师
  getPhotographerByName(data, params) {
    let url = '/user/common_list'
    return axios7mx(url, data, params)
  }
}
