import Vue from 'vue'
// import JSEncrypt from '~/static/js/jsencrypt.min.js'

var utilHelper = {
  debugTypes: {
    UPLOAD_ERROR: 0,
    UPLOAD_API_ERROR: 1,
    MEDIA_EDIT_DIALOG_ERROR: 2,
    UPLOAD_TO_PAIXIN_ERROR: 3
  },
  rsa_encrypt(string) {
    if (string === '') {
      return ''
    } else {
      const publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCs6vwV3PlvgLqkJ9bjYfbuhvloXKdEtJKHQ0vNLlJZkdKutEVNqsiGy/+iB3CkG9TzSoSVZHU0HVM0vDoYG+ODPi1qzvPhzeFThFUbMW9KhDQlQOL+O/L6DqLQdHGDmwpk6eJcfjlqhM8EKFFQAmlLaYx0WAfNKJAAWjwFJMBjvwIDAQAB-----END PUBLIC KEY-----'
      // eslint-disable-next-line no-undef
      const rsa = new JSEncrypt()
      rsa.setKey(publicKey)
      return rsa.encrypt(string)
    }
  },
  getWindowHeight() {
    var windowHeight = 0
    if (document.compatMode === 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight
    } else {
      windowHeight = document.body.clientHeight
    }
    return windowHeight
  },
  getWindowWidth() {
    var windowWidth = 0
    if (document.compatMode === 'CSS1Compat') {
      windowWidth = document.documentElement.clientWidth
    } else {
      windowWidth = document.body.clientWidth
    }
    return windowWidth
  },
  viewportSize() {
    let e = window
    let a = 'inner'

    if (!('innerWidth' in window)) {
      a = 'client'
      e = document.documentElement || document.body
    }

    return { width: e[a + 'Width'], height: e[a + 'Height'] }
  },
  getBrowser() {
    var userAgent = navigator.userAgent
    var isOpera = userAgent.indexOf('Opera') > -1
    var isMaxthon = userAgent.indexOf('Maxthon') > -1
    var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera
    var isFF = userAgent.indexOf('Firefox') > -1
    var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1
    var isChrome = userAgent.indexOf('Chrome') > -1

    if (isFF) { return 'Firefox' }
    if (isMaxthon) { return 'Opera-webkit' }
    if (isOpera) { return 'Opera' }
    if (isSafari) { return 'Safari' }
    if (isChrome) { return 'Chrome' }
    if (isIE) {
      var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      var fIEVersion = parseFloat(RegExp['$1'])
      if (userAgent.indexOf('MSIE 6.0') !== -1) {
        return 'IE6'
      } else if (fIEVersion === 7) {
        return 'IE7'
      } else if (fIEVersion === 8) {
        return 'IE8'
      } else if (fIEVersion === 9) {
        return 'IE9'
      } else if (fIEVersion === 10) {
        return 'IE10'
      } else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
        return 'IE11'
      } else {
        return '0' // IE版本过低
      }
    }
    return 'unknow'
  },
  time(x = 0) {
    return ((Date.parse(new Date()) + x) / 1000)
  },
  score(media) {
    if (this.isEmptyObj(media)) {
      return '70'
    }

    try {
      const likeNum = media.like_num ? parseInt(media.like_num) : 0
      const lookNum = media.look_num ? parseInt(media.look_num) : 0
      const commentNum = media.comment_num ? parseInt(media.comment_num) : 0
      const recommend = media.recommend ? parseInt(media.recommend) : 0
      let product = 0

      if (media.product == '1' || media.product === 'plus') {
        product = 1
      }

      const x = 0.9 + lookNum / 10 + likeNum * 2 + commentNum * 2 + product * 50 + recommend * 50

      const score = 70 + Math.log(600 * (1 - 1 / (x / 500 + 1))) / Math.log(10) * 10

      return score.toFixed(2)
    } catch (e) {
      return '70'
    }
  },
  getOldTime(createtime) {
    var now = Date.parse(new Date()) / 1000
    var limit = now - createtime
    var content = ''
    if (limit < 60) {
      content = '刚刚'
    } else if (limit >= 60 && limit < 3600) {
      content = Math.floor(limit / 60) + '分钟前'
    } else if (limit >= 3600 && limit < 86400) {
      content = Math.floor(limit / 3600) + '小时前'
    } else if (limit >= 86400 && limit < 2592000) {
      content = Math.floor(limit / 86400) + '天前'
    } else if (limit >= 2592000 && limit < 31536000) {
      content = Math.floor(limit / 2592000) + '个月前'
    } else if (limit >= 31536000) {
      content = Math.floor(limit / 31536000) + '年前'
    }
    return content
  },
  getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] == variable) {
        return pair[1]
      }
    }
    return false
  },
  toUserPage(userData) {
    if (typeof userData === 'undefined' || userData == null || typeof userData !== 'object' || Object.keys(userData).length < 1) return ''

    try {
      if (typeof userData.name !== 'undefined' && userData.name != null && userData.name.length > 0) {
        return '/' + userData.name
      } else {
        let eputUserId = ''

        if (typeof userData.gaga_id !== 'undefined' && userData.gaga_id != null && userData.gaga_id.length > 0) {
          eputUserId = userData.id
        }

        if (typeof userData.eput_id !== 'undefined' && userData.eput_id != null && userData.eput_id.length > 0) {
          eputUserId = userData.eput_id
        } else {
          eputUserId = userData.id
        }

        return '/user/' + eputUserId
      }
    } catch (e) {
      console.log(e)
      return ''
    }
  },
  isEmptyObj(object) {
    if (!object) {
      return false
    }

    for (var name in object) {
      return false
    }
    return true
  },
  getCompressionUrl(imgUrl, width = 400, height = 400) {
    if (!imgUrl) {
      return ''
    }

    if (imgUrl.indexOf('private.gaga.me') >= 0 || imgUrl.indexOf('imageView2') >= 0) {
      return imgUrl
    }

    if (imgUrl.indexOf('?') >= 0) {
      return imgUrl + '|imageView2/2/w/' + width + '/h/' + height + '|imageslim'
    }

    return imgUrl + '?imageView2/2/w/' + width + '/h/' + height + '|imageslim'
  }
}

Vue.prototype.$utilHelper = utilHelper
