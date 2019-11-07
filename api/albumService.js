export default ({ $axios }) => {
  const albumService = {
    // 灵感集搜索列表
    albumList(data) {
      // 参数:user_id(某个人的), 缺省是自己的
      const url = 'album/list_by_user'
      return $axios(url, data, {})
    },

    // 灵感集搜索列表
    albumSearchList(data) {
      // 参数:user_id(某个人的),name(关键字搜索)
      const url = 'album/common_list'
      return $axios(url, data, {})
    },

    // 某灵感集详情
    getAlbumDetail(data) {
      const url = 'album/detail'
      return $axios(url, data, {})
    },

    // 创建灵感集
    createAlbum(data) {
      const url = 'album/add'
      return $axios(url, data, {})
    },

    // 删除灵感集（只能创建者可用）
    deleteAlbum(data) {
      const url = 'album/drop'
      return $axios(url, data, {})
    },

    // 修改灵感集（只能创建者可用）
    modAlbum(data) {
      const url = 'album/mod'
      return $axios(url, data, {})
    }
  }

  return albumService
}

