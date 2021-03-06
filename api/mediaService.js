
export default ({ $axios }) => {
  const mediaService = {
    mediaDetail(data) {
      const httpData = {
        url: `/api3/medias/detail/${data.media_id}`,
        method: 'GET'
      }
      return $axios(httpData)
    },

    // 首页热门图片
    getHomeHotPicsAPI(params) {
      const httpData = {
        url: `/api3/medias/hot/index`,
        params: params,
        method: 'get'
      }
      return $axios(httpData)
    },

    // 动态
    getDynamicAPI(data) {
      const httpData = {
        url: `/api3/dynamics/${data.type}`,
        method: 'GET'
      }
      return $axios(httpData)
    },

    like(data) {
      const httpData = {
        url: '/api3/medias/like',
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    comment(data) {
      const httpData = {
        url: '/api3/medias/comment',
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    commentList(params) {
      const httpData = {
        url: `/api3/medias/comment`,
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },

    dislike(data) {
      const httpData = {
        url: '/api3/medias/cancel-like',
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    commonList(data, params) {
      const httpData = {
        url: '/api/media/common_list',
        data,
        params
      }
      return $axios(httpData)
    },

    // 上传作品
    put(data) {
      const httpData = {
        url: '/api3/medias/upload',
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    // 删除作品
    remove(data) {
      const httpData = {
        url: '/api/media/drop',
        data
      }
      return $axios(httpData)
    },

    // 探索
    exploreAPI(data) {
      const httpData = {
        url: `/api3/medias/hot/${data.type}/${data.categoryId}`,
        params: data.params
      }
      return $axios(httpData)
    },

    originList(data, params) {
      const httpData = {
        url: '/api/media/origin_list',
        data,
        params,
        method: 'POST'
      }
      return $axios(httpData)
    },

    nextPage(data, params) {
      const httpData = {
        url: '/api/media/page_next',
        data,
        params
      }
      return $axios(httpData)
    },

    likeList(params) {
      const httpData = {
        url: '/api3/medias/like-medias',
        params
      }
      return $axios(httpData)
    },

    followList(data, params) {
      const httpData = {
        url: '/api/media/follow_list',
        data,
        params
      }
      return $axios(httpData)
    },

    exif(data) {
      const httpData = {
        url: '/api/media/exif',
        data
      }
      return $axios(httpData)
    },

    exifUrl(data) {
      const httpData = {
        url: '/api/media/exif_url',
        data
      }
      return $axios(httpData)
    },

    enchashment(data) {
      const httpData = {
        url: '/api/media/enchashment',
        data
      }
      return $axios(httpData)
    },

    intoOther(data) {
      const httpData = {
        url: '/api/media/into_other',
        data
      }
      return $axios(httpData)
    },

    needed(data) {
      const httpData = {
        url: '/api3/medias/require',
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    mediaDrop(data) {
      const httpData = {
        url: '/api/media/drop',
        data
      }
      return $axios(httpData)
    },

    // 某个tag全部作品列表
    inTagList(data, params) {
      const httpData = {
        url: `/api3/activities/medias/${data.tag_id}`,
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },
    // 某个tag全部作品列表
    randomInTagList(data, params) {
      const httpData = {
        url: `/api3/tags/medias/${data.tag_id}`,
        data,
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },

    // 某个tag推荐作品列表
    recommendInTagList(data, params) {
      const httpData = {
        url: `/api3/activities/medias/${data.tag_id}`,
        params,
        method: 'GET'
      }
      return $axios(httpData)
    },

    // 搜索
    search(data) {
      const httpData = {
        url: `/api3/search/${data.type}`,
        method: 'GET',
        params: data.params
      }
      return $axios(httpData)
    },

    modify(data) {
      const httpData = {
        url: '/api/media/mod',
        data
      }
      return $axios(httpData)
    },

    // 灵感集内所有图片
    getAlbumPics(data) {
      const httpData = {
        url: `/api3/favorites/medias/${data.favoriteId}`,
        data,
        method: 'GET'
      }
      return $axios(httpData)
    },

    // 添加media到灵感集（只能创建者可用）
    addToAlbum(data) {
      // album_id(id required),media_id(media_id required)
      const httpData = {
        url: '/api3/favorites/media',
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    notInTagList(data) {
      const httpData = {
        url: '/api/media/not_in_tag_list',
        data
      }
      return $axios(httpData)
    },

    addTag(data) {
      const httpData = {
        url: '/api/media/add_tag',
        data
      }
      return $axios(httpData)
    },

    dynamicDrop(data) {
      const httpData = {
        url: '/api3/dynamic/black/mediais',
        data,
        method: 'POST'
      }
      return $axios(httpData)
    },

    // 从灵感集中删除图片
    dropFromAlbum(data) {
      const httpData = {
        url: `/api3/favorites/media/${data.favoriteId}/${data.mediaId}`,
        data,
        method: 'DELETE'
      }
      return $axios(httpData)
    },

    getPollList(data, params) {
      const httpData = {
        url: '/api/media/in_tag_list',
        data,
        params,
        method: 'POST'
      }
      return $axios(httpData)
    },

    poll(data) {
      const httpData = {
        url: '/api/media/vote',
        data
      }
      return $axios(httpData)
    },

    // 获奖作品名单
    getAwardWinningList(data, params) {
      const httpData = {
        url: '/api/media/in_tag_awards_list',
        data,
        params,
        method: 'POST'
      }
      return $axios(httpData)
    }
  }

  $axios.mediaService = mediaService
}

