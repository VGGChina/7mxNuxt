import { axios7mx } from './factory/axiosFactory'

// 灵感集
const albumService = {
  // 灵感集搜索列表
  albumList(data) {
    // 参数:user_id(某个人的), 缺省是自己的
    const url = 'album/list_by_user'
    return axios7mx(url, data, {})
  },

  // 灵感集搜索列表
  albumSearchList(data) {
    // 参数:user_id(某个人的),name(关键字搜索)
    const url = 'album/common_list'
    return axios7mx(url, data, {})
  },

  // 某灵感集详情
  getAlbumDetail(data) {
    const url = 'album/detail'
    return axios7mx(url, data, {})
  },

  // 创建灵感集
  createAlbum(data) {
    const url = 'album/add'
    return axios7mx(url, data, {})
  },

  // 删除灵感集（只能创建者可用）
  deleteAlbum(data) {
    const url = 'album/drop'
    return axios7mx(url, data, {})
  },

  // 修改灵感集（只能创建者可用）
  modAlbum(data) {
    const url = 'album/mod'
    return axios7mx(url, data, {})
  }
}

export default albumService
