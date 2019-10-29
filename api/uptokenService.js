export default function getUptoken(data, callback) {
  const url = '//api.7mx.com/thirdpart/qiniu'
  const xToken = localStorage.getItem('x-token')

  let request = new XMLHttpRequest()

  request.open('POST', url, false)

  request.withCredentials = true

  if (xToken) {
    request.setRequestHeader('x-token', xToken)
  }

  request.setRequestHeader('no-cookie', '1')

  request.send(JSON.stringify(data))

  callback(request)
}
