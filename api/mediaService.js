
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
      const httpData = {
        url: '/api/media/detail_old',
        data
      }
      return $axios(httpData)
    },

    like(data) {
      const httpData = {
        url: '/api/media/like',
        data
      }
      return $axios(httpData)
    },

    comment(data) {
      const httpData = {
        url: '/api/media/comment',
        data
      }
      return $axios(httpData)
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
      const httpData = {
        url: '/api/media/put',
        data
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
      const httpData = {
        url: '/api/media/recommend_list',
        data,
        params
      }
      return $axios(httpData)
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

    nextPage(data, params) {
      const httpData = {
        url: '/api/media/page_next',
        data,
        params
      }
      return $axios(httpData)
    },

    storeList(data, params) {
      const httpData = {
        url: '/api/media/origin_list',
        data,
        params
      }
      return $axios(httpData)
    },

    examineList(data, params) {
      const httpData = {
        url: '/api/media/origin_list',
        data,
        params
      }
      return $axios(httpData)
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

    addIntoCart(data) {
      const httpData = {
        url: '/api/media/buy_add',
        data
      }
      return $axios(httpData)
    },

    cartList(data, params) {
      const httpData = {
        url: '/api/media/buy_list',
        data,
        params
      }
      return $axios(httpData)
    },

    shoppingCartDrop(data) {
      const httpData = {
        url: '/api/media/buy_drop',
        data
      }
      return $axios(httpData)
    },

    orderAdd(data) {
      const httpData = {
        url: '/api/media/order_add',
        data
      }
      return $axios(httpData)
    },

    orderDetail(data) {
      const httpData = {
        url: '/api/media/order_detail',
        data
      }
      return $axios(httpData)
    },

    imageStore(data, params) {
      const httpData = {
        url: '/api/media/order_media_finish_list',
        data,
        params
      }
      return $axios(httpData)
    },

    walletDetail(cookie) {
      const httpData = {
        url: '/api/media/wallet_detail'
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
        url: '/api/media/needed',
        data
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
        url: '/api/media/in_tag_list',
        data,
        params
      }
      return $axios(httpData)
    },
    // 某个tag全部作品列表
    randomInTagList(data, params) {
      const httpData = {
        url: '/api/media/random_in_tag_list',
        data,
        params
      }
      return $axios(httpData)
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
      const httpData = {
        url: '/api/media/mod',
        data
      }
      return $axios(httpData)
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
      const httpData = {
        url: '/api/media/add_to_album',
        data
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

    dynamicList(data, params) {
      const httpData = {
        url: '/api/media/dynamic_list',
        data,
        params
      }
      return $axios(httpData)
    },

    dynamicDrop(data) {
      const httpData = {
        url: '/api/media/dynamic_drop',
        data
      }
      return $axios(httpData)
    },

    // 从灵感集中删除图片
    dropFromAlbum(data) {
      const httpData = {
        url: '/api/media/drop_from_album',
        data
      }
      return $axios(httpData)
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
        params
      }
      return $axios(httpData)
    }
  }

  $axios.mediaService = mediaService
}

