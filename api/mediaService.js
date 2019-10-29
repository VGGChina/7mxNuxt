import { axios7mx } from './factory/axiosFactory'

export default class mediaService {
  mediaDetail(data) {
    let url = '/media/detail'
    return axios7mx(url, data, {})
  }

  mediaDetailOld(data) {
    let url = '/media/detail_old'
    return axios7mx(url, data, {})
  }

  like(data) {
    let url = '/media/like'
    return axios7mx(url, data, {})
  }

  comment(data) {
    let url = '/media/comment'
    return axios7mx(url, data, {})
  }

  commentList(data, params) {
    let url = '/media/comment_list'
    return axios7mx(url, data, params)
  }

  dislike(data) {
    let url = '/media/drop_like'
    return axios7mx(url, data, {})
  }

  commonList(data, params) {
    let url = '/media/common_list'
    return axios7mx(url, data, params)
  }

  // 上传作品
  put(data) {
    let url = '/media/put'
    return axios7mx(url, data, {})
  }

  // 删除作品
  remove(data) {
    let url = '/media/drop'
    return axios7mx(url, data, {})
  }

  randomRecommend(data, params) {
    let url = '/media/random_recommend_list'
    return axios7mx(url, data, params)
  }

  randomCategory(data, params) {
    let url = '/media/random_in_category_list'
    return axios7mx(url, data, params)
  }

  recommendMedia(data, params) {
    let url = '/media/recommend_list'
    return axios7mx(url, data, params)
  }

  recommendCategory(data, params) {
    let url = '/media/category_recommend_list'
    return axios7mx(url, data, params)
  }

  originList(data, params) {
    let url = '/media/origin_list'
    return axios7mx(url, data, params)
  }

  storeList(data, params) {
    let url = '/media/origin_list'
    return axios7mx(url, data, params)
  }

  examineList(data, params) {
    let url = '/media/origin_list'
    return axios7mx(url, data, params)
  }

  likeList(data, params) {
    let url = '/media/like_list'
    return axios7mx(url, data, params)
  }

  followList(data, params) {
    let url = '/media/follow_list'
    return axios7mx(url, data, params)
  }

  exif(data) {
    let url = '/media/exif'
    return axios7mx(url, data, {})
  }

  exifUrl(data) {
    let url = '/media/exif_url'
    return axios7mx(url, data, {})
  }

  addIntoCart(data) {
    let url = '/media/buy_add'
    return axios7mx(url, data, {})
  }

  cartList(data, params) {
    let url = '/media/buy_list'
    return axios7mx(url, data, params)
  }

  shoppingCartDrop(data) {
    let url = '/media/buy_drop'
    return axios7mx(url, data, {})
  }

  orderAdd(data) {
    let url = '/media/order_add'
    return axios7mx(url, data, {})
  }

  orderDetail(data) {
    let url = '/media/order_detail'
    return axios7mx(url, data, {})
  }

  imageStore(data, params) {
    let url = 'media/order_media_finish_list'
    return axios7mx(url, data, params)
  }

  walletDetail(cookie) {
    let url = '/media/wallet_detail'
    return axios7mx(url, {}, {})
  }

  enchashment(data) {
    let url = '/media/enchashment'
    return axios7mx(url, data, {})
  }

  intoOther(data) {
    let url = '/media/into_other'
    return axios7mx(url, data, {})
  }

  needed(data) {
    let url = 'media/needed'
    return axios7mx(url, data, {})
  }

  mediaDrop(data) {
    let url = 'media/drop'
    return axios7mx(url, data, {})
  }

  // 某个tag全部作品列表
  inTagList(data, params) {
    let url = 'media/in_tag_list'
    return axios7mx(url, data, params)
  }

  // 某个tag全部作品列表
  randomInTagList(data, params) {
    let url = 'media/random_in_tag_list'
    return axios7mx(url, data, params)
  }

  // 某个tag推荐作品列表
  recommendInTagList(data, params) {
    let url = 'media/recommend_in_tag_list'
    return axios7mx(url, data, params)
  }

  inCategoryList(data, params) {
    let url = 'media/in_category_list'
    return axios7mx(url, data, params)
  }

  modify(data) {
    let url = 'media/mod'
    return axios7mx(url, data, {})
  }

  // 灵感集内所有图片
  getAlbumPics(data) {
    // {album_id: ''}
    let url = 'media/in_album_list'
    return axios7mx(url, data, {})
  }

  // 添加media到灵感集（只能创建者可用）
  addToAlbum(data) {
    // album_id(id required),media_id(media_id required)
    let url = 'media/add_to_album'
    return axios7mx(url, data, {})
  }

  notInTagList(data) {
    let url = 'media/not_in_tag_list'
    return axios7mx(url, data, {})
  }

  addTag(data) {
    let url = 'media/add_tag'
    return axios7mx(url, data, {})
  }

  dynamicList(data, params) {
    let url = 'media/dynamic_list'
    return axios7mx(url, data, params)
  }

  dynamicDrop(data) {
    let url = 'media/dynamic_drop'
    return axios7mx(url, data, {})
  }

  // 从灵感集中删除图片
  dropFromAlbum(data) {
    let url = 'media/drop_from_album'
    return axios7mx(url, data, {})
  }

  getPollList(data, params) {
    let url = 'media/in_tag_list'
    return axios7mx(url, data, params)
  }

  poll(data) {
    let url = 'media/vote'
    return axios7mx(url, data, {})
  }

  // 获奖作品名单
  getAwardWinningList(data, params) {
    let url = 'media/in_tag_awards_list'
    return axios7mx(url, data, params)
  }
}
