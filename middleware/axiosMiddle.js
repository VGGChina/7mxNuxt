import axios from 'axios'

export default function({ req, res }) {
  if (req.headers !== undefined) {
    const cookieArr = req.headers.cookie

    // 获取cookie然后拆成键值对
    const getToken = getCookie('token', cookieArr)

    // 设置axios的全局变量.

    axios.defaults.timeout = 60000 // 响应时间

    // @requestParams

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

    // axios.defaults.headers.username = getUserName

    axios.defaults.headers.token = getToken

    axios.defaults.withCredentials = true
  }
}

// 解析浏览器中的cookies

function getCookie(name, strCookie) {
  // console.log('strCookie', strCookie)

  var arrCookie = strCookie.split(';')

  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split('=')

    if (arr[0].trim() === name) {
      return arr[1]
    }
  }

  return {}
}
