export default ({ $axios }) => {
  const tagService = {
    // 所有活动(不是tag)
    getActivityList(data, params) {
      const httpData = {
        url: `/api/tag/activity_list`,
        data,
        params
      }
      return $axios(httpData)
    },

    // 某活动详情(不是tag)
    getTagDetail(data, params) {
      const httpData = {
        url: `/api/tag/detail`,
        data,
        params
      }
      return $axios(httpData)
    },

    // 某活动参赛作品
    // media/in_tag_list
    // 在mediaService.js里

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
    getJoinUser(data, params) {
      const httpData = {
        url: `/api/tag/joiner_list`,
        data,
        params
      }
      return $axios(httpData)
    },

    followList(data, params) {
      const httpData = {
        url: '/api/tag/follow_list',
        data,
        params
      }
      return $axios(httpData)
    }
  }
  $axios.tagService = tagService
}
