import Vue from 'vue'

Vue.directive('ecroll', function(el, binding) {
  el.addEventListener('scroll', () => {
    // 可以滚动的高度
    const height = el.scrollHeight

    // 已经滚过的高度
    const scrollHeight = el.scrollTop + el.offsetHeight

    if (scrollHeight >= height / 2) {
      const fn = binding.value
      fn()
    }
  })
})
