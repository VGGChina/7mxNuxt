export default ({ $axios }) => {
  const tagService = {
    // 所有活动(不是tag)
    getActivityList(data) {
      const httpData = {
        url: `/api3/activities/list/${data.type}`,
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

    // 获取所有推荐tag
    getRecommentTags(params) {
      const httpData = {
        url: '/api3/tags/recommend',
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },

    /*
    * 关注标签
    * param id
    */
    followTag(data) {
      const httpData = {
        url: `/api3/tags/follow/${data.tagId}`,
        method: 'POST'
      }
      return $axios(httpData)
    },

    // 取消关注标签
    unfollowTag(data) {
      const httpData = {
        url: `/api3/tags/follow/${data.tagId}`,
        data,
        method: 'DELETE'
      }
      return $axios(httpData)
    },

    // 热门tag
    getHotList(params) {
      const httpData = {
        url: '/api3/tags/hot',
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },

    //获取用户tag
    getUserTag(data) {
      const httpData = {
        url: `/api3/tags/${data.id}`,
        method: 'GET'
      }
      return $axios(httpData)
    },

    // 参加活动的人
    getJoinUser(data, params) {
      const httpData = {
        // url: `/api/tag/joiner_list`,
        url: `/api3/activities/users/${data.tag_id}`,
        params,
        method: 'GET'
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
    },

    // 首页热门标签
    getIndexHotTagsAPI(params) {
      const httpData = {
        url: '/api3/tags/index',
        params
      }
      return $axios(httpData)
    },

    // 标签图片
    getTagPicsAPI(data) {
      const httpData = {
        url: `/api3/tags/medias/${data.tagId}`,
        params: data.params
      }
      return $axios(httpData)
    },

    // 推荐摄影师数据
    getRecommendPhotographersAPI(data) {
      const httpData = {
        url: `/api3/users/recommend/${data.categoryId}`,
        params: data.params,
        method: 'get'
      }
      return $axios(httpData)
    },

    // 获取tags  16-摄影师tag
    getTagsAPI(type) {
      const httpData = {
        url: `/api3/categories/${type}`,
        method: 'get'
      }
      return $axios(httpData)
    }
  }
  $axios.tagService = tagService
}
