
export default ({ $axios }) => {
  const mediaService = {
    mediaDetail(data, params) {
      const httpData = {
        url: '/api/media/detail',
        data,
        params
      }
      return $axios(httpData)
    },

    mediaDetailOld(data) {
      const url = '/media/detail_old'
      return $axios(url, data, {})
    },

    like(data) {
      const httpData = {
        url: '/api/media/like',
        data
      }
      return $axios(httpData)
    },

    comment(data) {
      const url = '/media/comment'
      return $axios(url, data, {})
    },

    commentList(data, params) {
      const httpData = {
        url: '/api/media/comment_list',
        data,
        params
      }
      return $axios(httpData)
    },

    dislike(data) {
      const httpData = {
        url: '/api/media/drop_like',
        data
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
      const url = '/media/put'
      return $axios(url, data, {})
    },

    // 删除作品
    remove(data) {
      const url = '/media/drop'
      return $axios(url, data, {})
    },

    randomRecommend(data, params) {
      const httpData = {
        url: '/api/media/random_recommend_list',
        data,
        params
      }
      return $axios(httpData)
    },

    randomCategory(data, params) {
      const httpData = {
        url: '/api/media/random_in_category_list',
        data,
        params
      }
      return $axios(httpData)
    },

    recommendMedia(data, params) {
      const url = '/api/media/recommend_list'
      return $axios(url, data, params)
    },

    recommendCategory(data, params) {
      const httpData = {
        url: '/api/media/category_recommend_list',
        data,
        params
      }
      return $axios(httpData)
    },

    originList(data, params) {
      const httpData = {
        url: '/api/media/origin_list',
        data,
        params
      }
      return $axios(httpData)
    },

    storeList(data, params) {
      const url = '/media/origin_list'
      return $axios(url, data, params)
    },

    examineList(data, params) {
      const url = '/media/origin_list'
      return $axios(url, data, params)
    },

    likeList(data, params) {
      const httpData = {
        url: '/api/media/like_list',
        data,
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
      const url = '/media/exif'
      return $axios(url, data, {})
    },

    exifUrl(data) {
      const url = '/media/exif_url'
      return $axios(url, data, {})
    },

    addIntoCart(data) {
      const url = '/media/buy_add'
      return $axios(url, data, {})
    },

    cartList(data, params) {
      const url = '/media/buy_list'
      return $axios(url, data, params)
    },

    shoppingCartDrop(data) {
      const url = '/media/buy_drop'
      return $axios(url, data, {})
    },

    orderAdd(data) {
      const url = '/media/order_add'
      return $axios(url, data, {})
    },

    orderDetail(data) {
      const url = '/media/order_detail'
      return $axios(url, data, {})
    },

    imageStore(data, params) {
      const url = 'media/order_media_finish_list'
      return $axios(url, data, params)
    },

    walletDetail(cookie) {
      const url = '/media/wallet_detail'
      return $axios(url, {}, {})
    },

    enchashment(data) {
      const url = '/media/enchashment'
      return $axios(url, data, {})
    },

    intoOther(data) {
      const url = '/media/into_other'
      return $axios(url, data, {})
    },

    needed(data) {
      const httpData = {
        url: '/api/media/needed',
        data
      }
      return $axios(httpData)
    },

    mediaDrop(data) {
      const url = 'media/drop'
      return $axios(url, data, {})
    },

    // 某个tag全部作品列表
    inTagList(data, params) {
      const httpData = {
        url: '/api/media/in_tag_list',
        data,
        params
      }
      return $axios(httpData)
    },
    // 某个tag全部作品列表
    randomInTagList(data, params) {
      const url = 'media/random_in_tag_list'
      return $axios(url, data, params)
    },

    // 某个tag推荐作品列表
    recommendInTagList(data, params) {
      const httpData = {
        url: '/api/media/recommend_in_tag_list',
        data,
        params
      }
      return $axios(httpData)
    },

    inCategoryList(data, params) {
      const httpData = {
        url: '/api/media/in_category_list',
        data,
        params
      }
      return $axios(httpData)
    },

    modify(data) {
      const url = 'media/mod'
      return $axios(url, data, {})
    },

    // 灵感集内所有图片
    getAlbumPics(data) {
      const httpData = {
        url: '/api/media/in_album_list',
        data
      }
      return $axios(httpData)
    },

    // 添加media到灵感集（只能创建者可用）
    addToAlbum(data) {
      // album_id(id required),media_id(media_id required)
      const url = 'media/add_to_album'
      return $axios(url, data, {})
    },

    notInTagList(data) {
      const url = 'media/not_in_tag_list'
      return $axios(url, data, {})
    },

    addTag(data) {
      const url = 'media/add_tag'
      return $axios(url, data, {})
    },

    dynamicList(data, params) {
      const httpData = {
        url: '/api/media/dynamic_list',
        data,
        params
      }
      return $axios(httpData)
    },

    dynamicDrop(data) {
      const url = 'media/dynamic_drop'
      return $axios(url, data, {})
    },

    // 从灵感集中删除图片
    dropFromAlbum(data) {
      const url = 'media/drop_from_album'
      return $axios(url, data, {})
    },

    getPollList(data, params) {
      const httpData = {
        url: '/api/media/in_tag_list',
        data,
        params
      }
      return $axios(httpData)
    },

    poll(data) {
      const url = 'media/vote'
      return $axios(url, data, {})
    },

    // 获奖作品名单
    getAwardWinningList(data, params) {
      const httpData = {
        url: '/api/media/in_tag_awards_list',
        data,
        params
      }
      return $axios(httpData)
    }
  }

  $axios.mediaService = mediaService
}

