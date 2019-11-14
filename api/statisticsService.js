export default ({ $axios }) => {
  const statisticsService = {
    // 统计
    postBannerClickNum(data) {
      const httpData = {
        url: '/api/tag/click',
        data
      }
      return $axios(httpData)
    }
  }
  $axios.statisticsService = statisticsService
}

