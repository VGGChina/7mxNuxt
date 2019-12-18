export default ({ $axios }) => {
  const billboradService = {
    // 统计
    getTopAPI(data) {
      const httpData = {
        url: `/api3/billboard/${data.type}`,
        params: data.params,
        method: 'get'
      }
      return $axios(httpData)
    }
  }
  $axios.billboradService = billboradService
}

