import UserService from '~/api/userService'
import MediaService from '~/api/mediaService'
import CommonService from '~/api/commonService'
import AlbumService from '~/api/albumService'
import TagService from '~/api/tagService'
import PaixinService from '~/api/paixinService'
import StatisticsService from '~/api/statisticsService'

class ApiFactory {
  constructor() {
    this.userApi = null
    this.mediaApi = null
    this.commonApi = null
    this.albumApi = null
    this.tagApi = null
    this.paixinApi = null
    this.statisticsApi = null
    this.baseURL = 'https://api.7mx.com/'
  }

  getUserApi() {
    if (this.userApi === null) {
      this.userApi = new UserService()
    }

    return this.userApi
  }

  getMediaApi() {
    if (this.mediaApi === null) {
      this.mediaApi = new MediaService()
    }

    return this.mediaApi
  }

  getCommonApi() {
    if (this.commonApi === null) {
      this.commonApi = new CommonService()
    }

    return this.commonApi
  }

  getAlbumApi() {
    if (this.albumApi === null) {
      this.albumApi = new AlbumService()
    }

    return this.albumApi
  }

  getTagApi() {
    if (this.tagApi === null) {
      this.tagApi = new TagService()
    }

    return this.tagApi
  }

  getPaixinApi() {
    if (this.paixinApi === null) {
      this.paixinApi = new PaixinService()
    }

    return this.paixinApi
  }

  getStatisticsApi() {
    if (this.statisticsApi === null) {
      this.statisticsApi = new StatisticsService()
    }

    return this.statisticsApi
  }
}
const apiFactory = new ApiFactory()

export default apiFactory
