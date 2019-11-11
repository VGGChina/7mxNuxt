export default ({ $axios }) => {
  const tagService = {
    // 所有活动(不是tag)
    getActivityList(data) {
      const url = '/api/tag/activity_list'
      return $axios(url, data, {})
    },

    // 某活动详情(不是tag)
    getTagDetail(data) {
      const url = 'tag/detail'
      return $axios(url, data, {})
    },

    // 获取所有推荐tag
    getRecommentTags(data, params) {
      const url = 'tag/recommend_media_list'
      return $axios(url, data, params)
    },

    /*
    * 关注标签
    * param id
    */
    followTag(data) {
      const url = 'tag/follow'
      return $axios(url, data)
    },

    // 取消关注标签
    unfollowTag(data) {
      const url = 'tag/drop_follow'
      return $axios(url, data)
    },

    // 热门tag
    getHotList(data, params) {
      const url = 'tag/hot_list'
      return $axios(url, data, params)
    },

    // 参加活动的人
    getJoinUser(data, param) {
      const url = 'tag/joiner_list'
      return $axios(url, data, param)
    },

    followList(data, params) {
      const url = 'tag/follow_list'
      return $axios(url, data, params)
    }
  }
  $axios.tagService = tagService
}
