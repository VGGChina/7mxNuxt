import { axios7mx } from './factory/axiosFactory'

const tagService = {
  // 所有活动(不是tag)
  getActivityList(data) {
    const url = 'https://api.7mx.com/tag/activity_list'
    return axios7mx(url, data, {})
  },

  // 某活动详情(不是tag)
  getTagDetail(data) {
    const url = 'tag/detail'
    return axios7mx(url, data, {})
  },

  // 某活动参赛作品
  // media/in_tag_list
  // 在mediaService.js里

  // 获取所有推荐tag
  getRecommentTags(data, params) {
    const url = 'tag/recommend_media_list'
    return axios7mx(url, data, params)
  },

  /*
  * 关注标签
  * param id
  */
  followTag(data) {
    const url = 'tag/follow'
    return axios7mx(url, data)
  },

  // 取消关注标签
  unfollowTag(data) {
    const url = 'tag/drop_follow'
    return axios7mx(url, data)
  },

  // 热门tag
  getHotList(data, params) {
    const url = 'tag/hot_list'
    return axios7mx(url, data, params)
  },

  // 参加活动的人
  getJoinUser(data, param) {
    const url = 'tag/joiner_list'
    return axios7mx(url, data, param)
  },

  followList(data, params) {
    const url = 'tag/follow_list'
    return axios7mx(url, data, params)
  }
}

export default tagService
