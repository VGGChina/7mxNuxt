export default ({ $axios }) => {
  const tagService = {
    // 所有活动(不是tag)
    getActivityList() {
      const httpData = {
        url: `/api3/activities/list/1`,
        method: 'GET'
      }
      return $axios(httpData)
    },

    // 某活动详情(不是tag)
    getTagDetail(data, params) {
      const httpData = {
        url: `/api3/activities/detail/${data.tag_id}`,
        data,
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },

    // 某活动参赛作品
    // media/in_tag_list
    // 在mediaService.js里

    // 获取所有推荐tag
    getRecommentTags(data, params) {
      const httpData = {
        url: '/api/tag/recommend_media_list',
        data,
        params
      }
      return $axios(httpData)
    },

    /*
    * 关注标签
    * param id
    */
    followTag(data) {
      const httpData = {
        url: '/api/tag/follow',
        data
      }
      return $axios(httpData)
    },

    // 取消关注标签
    unfollowTag(data) {
      const httpData = {
        url: '/api/tag/drop_follow',
        data
      }
      return $axios(httpData)
    },

    // 热门tag
    getHotList(data, params) {
      const httpData = {
        url: '/api/tag/hot_list',
        data,
        params
      }
      return $axios(httpData)
    },

    // 参加活动的人
    getJoinUser(data, params) {
      const httpData = {
        url: `/api/tag/joiner_list`,
        data,
        params,
        method: 'POST'
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
