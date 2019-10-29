import { axios7mx } from './factory/axiosFactory'

// 灵感集
export default class albumService {
  // 灵感集搜索列表
  albumList(data) {
    // 参数:user_id(某个人的), 缺省是自己的
    let url = 'album/list_by_user'
    return axios7mx(url, data, {})
  }

  // 灵感集搜索列表
  albumSearchList(data) {
    // 参数:user_id(某个人的),name(关键字搜索)
    let url = 'album/common_list'
    return axios7mx(url, data, {})
  }

  // 某灵感集详情
  getAlbumDetail(data) {
    // {album_id: ''}
    let url = 'album/detail'
    return axios7mx(url, data, {})
  }
  // 创建灵感集
  createAlbum(data) {
    // category_id(分类id required),name(名字 required),about(描述)
    let url = 'album/add'
    return axios7mx(url, data, {})
  }

  // 删除灵感集（只能创建者可用）
  deleteAlbum(data) {
    // album_id(id required)
    let url = 'album/drop'
    return axios7mx(url, data, {})
  }

  // 修改灵感集（只能创建者可用）
  modAlbum(data) {
    // album_id(id required)
    let url = 'album/mod'
    return axios7mx(url, data, {})
  }
}
