import { axios7mx } from './factory/axiosFactory'

export default class mediaService {
  mediaDetail(data) {
    const url = '/media/detail'
    return axios7mx(url, data, {})
  }

  mediaDetailOld(data) {
    const url = '/media/detail_old'
    return axios7mx(url, data, {})
  }

  like(data) {
    const url = '/media/like'
    return axios7mx(url, data, {})
  }

  comment(data) {
    const url = '/media/comment'
    return axios7mx(url, data, {})
  }

  commentList(data, params) {
    const url = '/media/comment_list'
    return axios7mx(url, data, params)
  }

  dislike(data) {
    const url = '/media/drop_like'
    return axios7mx(url, data, {})
  }

  commonList(data, params) {
    const url = '/media/common_list'
    return axios7mx(url, data, params)
  }

  // 上传作品
  put(data) {
    const url = '/media/put'
    return axios7mx(url, data, {})
  }

  // 删除作品
  remove(data) {
    const url = '/media/drop'
    return axios7mx(url, data, {})
  }

  randomRecommend(data, params) {
    const url = '/media/random_recommend_list'
    return axios7mx(url, data, params)
  }

  randomCategory(data, params) {
    const url = '/media/random_in_category_list'
    return axios7mx(url, data, params)
  }

  recommendMedia(data, params) {
    const url = '/media/recommend_list'
    return axios7mx(url, data, params)
  }

  recommendCategory(data, params) {
    const url = '/media/category_recommend_list'
    return axios7mx(url, data, params)
  }

  originList(data, params) {
    const url = '/media/origin_list'
    return axios7mx(url, data, params)
  }

  storeList(data, params) {
    const url = '/media/origin_list'
    return axios7mx(url, data, params)
  }

  examineList(data, params) {
    const url = '/media/origin_list'
    return axios7mx(url, data, params)
  }

  likeList(data, params) {
    const url = '/media/like_list'
    return axios7mx(url, data, params)
  }

  followList(data, params) {
    const url = '/media/follow_list'
    return axios7mx(url, data, params)
  }

  exif(data) {
    const url = '/media/exif'
    return axios7mx(url, data, {})
  }

  exifUrl(data) {
    const url = '/media/exif_url'
    return axios7mx(url, data, {})
  }

  addIntoCart(data) {
    const url = '/media/buy_add'
    return axios7mx(url, data, {})
  }

  cartList(data, params) {
    const url = '/media/buy_list'
    return axios7mx(url, data, params)
  }

  shoppingCartDrop(data) {
    const url = '/media/buy_drop'
    return axios7mx(url, data, {})
  }

  orderAdd(data) {
    const url = '/media/order_add'
    return axios7mx(url, data, {})
  }

  orderDetail(data) {
    const url = '/media/order_detail'
    return axios7mx(url, data, {})
  }

  imageStore(data, params) {
    const url = 'media/order_media_finish_list'
    return axios7mx(url, data, params)
  }

  walletDetail(cookie) {
    const url = '/media/wallet_detail'
    return axios7mx(url, {}, {})
  }

  enchashment(data) {
    const url = '/media/enchashment'
    return axios7mx(url, data, {})
  }

  intoOther(data) {
    const url = '/media/into_other'
    return axios7mx(url, data, {})
  }

  needed(data) {
    const url = 'media/needed'
    return axios7mx(url, data, {})
  }

  mediaDrop(data) {
    const url = 'media/drop'
    return axios7mx(url, data, {})
  }

  // 某个tag全部作品列表
  inTagList(data, params) {
    const url = 'media/in_tag_list'
    return axios7mx(url, data, params)
  }

  // 某个tag全部作品列表
  randomInTagList(data, params) {
    const url = 'media/random_in_tag_list'
    return axios7mx(url, data, params)
  }

  // 某个tag推荐作品列表
  recommendInTagList(data, params) {
    const url = 'media/recommend_in_tag_list'
    return axios7mx(url, data, params)
  }

  inCategoryList(data, params) {
    const url = 'media/in_category_list'
    return axios7mx(url, data, params)
  }

  modify(data) {
    const url = 'media/mod'
    return axios7mx(url, data, {})
  }

  // 灵感集内所有图片
  getAlbumPics(data) {
    // {album_id: ''}
    const url = 'media/in_album_list'
    return axios7mx(url, data, {})
  }

  // 添加media到灵感集（只能创建者可用）
  addToAlbum(data) {
    // album_id(id required),media_id(media_id required)
    const url = 'media/add_to_album'
    return axios7mx(url, data, {})
  }

  notInTagList(data) {
    const url = 'media/not_in_tag_list'
    return axios7mx(url, data, {})
  }

  addTag(data) {
    const url = 'media/add_tag'
    return axios7mx(url, data, {})
  }

  dynamicList(data, params) {
    const url = 'media/dynamic_list'
    return axios7mx(url, data, params)
  }

  dynamicDrop(data) {
    const url = 'media/dynamic_drop'
    return axios7mx(url, data, {})
  }

  // 从灵感集中删除图片
  dropFromAlbum(data) {
    const url = 'media/drop_from_album'
    return axios7mx(url, data, {})
  }

  getPollList(data, params) {
    const url = 'media/in_tag_list'
    return axios7mx(url, data, params)
  }

  poll(data) {
    const url = 'media/vote'
    return axios7mx(url, data, {})
  }

  // 获奖作品名单
  getAwardWinningList(data, params) {
    const url = 'media/in_tag_awards_list'
    return axios7mx(url, data, params)
  }
}
