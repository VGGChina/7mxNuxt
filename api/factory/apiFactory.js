import userService from '~/api/userService'
import mediaService from '~/api/mediaService'
import commonService from '~/api/commonService'
import albumService from '~/api/albumService'
import tagService from '~/api/tagService'
import paixinService from '~/api/paixinService'
import statisticsService from '~/api/statisticsService'

const apiFactory = {
  userService,
  mediaService,
  commonService,
  albumService,
  tagService,
  paixinService,
  statisticsService
}

export default apiFactory
