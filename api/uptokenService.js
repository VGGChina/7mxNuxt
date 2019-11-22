export default function getUptoken(data, callback, xToken) {
  const url = '//api.7mx.com/thirdpart/qiniu'

  const request = new XMLHttpRequest()

  request.open('POST', url, false)

  request.withCredentials = true

  if (xToken) {
    request.setRequestHeader('x-token', xToken)
  }

  request.setRequestHeader('no-cookie', '1')

  request.send(JSON.stringify(data))

  callback(request)
}
