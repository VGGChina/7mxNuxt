import { axios7mx } from './factory/axiosFactory'

export default class tagService {
  // 所有活动(不是tag)
  getActivityList(data) {
    let url = 'tag/activity_list'
    return axios7mx(url, data, {})
  }

  // 某活动详情(不是tag)
  getTagDetail(data) {
    let url = 'tag/detail'
    return axios7mx(url, data, {})
  }

  // 某活动参赛作品
  // media/in_tag_list
  // 在mediaService.js里

  // 获取所有推荐tag
  getRecommentTags(data, params) {
    let url = 'tag/recommend_media_list'
    return axios7mx(url, data, params)
  }

  /*
  * 关注标签
  * param id
  */
  followTag(data) {
    let url = 'tag/follow'
    return axios7mx(url, data)
  }

  // 取消关注标签
  unfollowTag(data) {
    let url = 'tag/drop_follow'
    return axios7mx(url, data)
  }

  // 热门tag
  getHotList(data, params) {
    let url = 'tag/hot_list'
    return axios7mx(url, data, params)
  }

  /**
   * 参加活动的人
   */
  getJoinUser(data, param) {
    let url = 'tag/joiner_list'
    return axios7mx(url, data, param)
  }

  followList(data, params) {
    let url = 'tag/follow_list'
    return axios7mx(url, data, params)
  }
}
