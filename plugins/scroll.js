import Vue from 'vue'

Vue.directive('scroll', function(el, binding) {
  window.addEventListener('scroll', () => {
    let scrollTop = 0
    let bodyScrollTop = 0
    let documentScrollTop = 0

    bodyScrollTop = document.body.scrollTop
    documentScrollTop = document.documentElement.scrollTop
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop

    let scrollHeight = 0
    let bodyScrollHeight = 0
    let documentScrollHeight = 0
    bodyScrollHeight = document.body.scrollHeight
    documentScrollHeight = document.documentElement.scrollHeight
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight

    let windowHeight = 0
    if (document.compatMode === 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight
    } else {
      windowHeight = document.body.clientHeight
    }

    if (scrollTop + windowHeight >= scrollHeight - windowHeight) {
      const fn = binding.value
      fn()
    }
  })
})
