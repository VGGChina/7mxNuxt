import Index from './index.vue'

var Toast = {}
Toast.install = function(Vue, options) {
  var opt = {
    defaultTips: '',
    defaultType: 'notice',
    defaultDelay: 4000
  }
  for (var property in options) {
    opt[property] = options[property]
  }
  Vue.prototype.$toast = function(type, tips, delay) {
    if (Vue.prototype.toastTpl) {
      // 如果toast对象已经存在，则直接修改信息，使其显示
      Vue.prototype.toastTpl._data.type = type || opt.defaultType
      Vue.prototype.toastTpl._data.tips = tips || opt.defaultTips

      clearTimeout(Vue.prototype.toastTpl._data.toastTimer)
      Vue.prototype.toastTpl._data.isShow = true
      Vue.prototype.toastTpl._data.toastTimer = setTimeout(() => {
        Vue.prototype.toastTpl._data.isShow = false
      }, delay || opt.defaultDelay)
      return
    }

    var ToastTpl = Vue.extend(Index)
    Vue.prototype.toastTpl = new ToastTpl()
    Vue.prototype.toastTpl._data.type = type || opt.defaultType
    Vue.prototype.toastTpl._data.tips = tips || opt.defaultTips

    document.body.appendChild(Vue.prototype.toastTpl.$mount().$el)

    Vue.prototype.toastTpl._data.isShow = true
    Vue.prototype.toastTpl._data.toastTimer = setTimeout(() => {
      Vue.prototype.toastTpl._data.isShow = false
    }, delay || opt.defaultDelay)
  };
  ['notice', 'warn'].forEach(function(type) {
    Vue.prototype.$toast[type] = function(tips, delay) {
      return Vue.prototype.$toast(type, tips, delay)
    }
  })
}
export default Toast
