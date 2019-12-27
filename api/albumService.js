export default ({ $axios }) => {
  const albumService = {
    // 灵感集搜索列表
    albumList(data) {
      // 参数:user_id(某个人的), 缺省是自己的
      const httpData = {
        url: '/api/album/list_by_user',
        data
      }
      return $axios(httpData)
    },

    // 某灵感集详情
    getAlbumDetail(data) {
      const httpData = {
        url: '/api/album/detail',
        data
      }
      return $axios(httpData)
    },

    // 创建灵感集
    createAlbum(data) {
      const httpData = {
        url: '/api/album/add',
        data
      }
      return $axios(httpData)
    },

    // 删除灵感集（只能创建者可用）
    deleteAlbum(data) {
      const httpData = {
        url: '/api/album/drop',
        data
      }
      return $axios(httpData)
    }

  }

  $axios.albumService = albumService
}

