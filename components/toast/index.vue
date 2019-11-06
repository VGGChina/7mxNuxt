<template>
  <transition name="toast-fade">
    <div
      v-if="isShow"
      class="toast-content"
      :class="{'toast-notice': type === 'notice', 'toast-warn': type === 'warn'}"
    >
      <img class="toast-icon" :src="icon" width="36px" height="36px" alt="">
      <span>{{ tips }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      type: '',
      tips: ''
    }
  },
  computed: {
    icon() {
      return this.type === 'warn' ? require('./img/warn.svg') : require('./img/notice.svg')
    }
  }
}
</script>

<style lang='scss' scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all .5s;
}

.toast-fade-enter,
.toast-fade-leave-active {
  transform: translateX(50px);
  opacity: 0;
}

.toast-content {
  position: fixed;
  z-index: 999;
  top: 100px;
  right: 30px;
  width: 355px;
  height: 75px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #fff;
  border-radius: 5px;
  span {
    letter-spacing: 1px;
  }
}

.toast-content.toast-notice {
  background: #56cb8f;
}

.toast-content.toast-warn {
  background: #8d91ff;
}

.toast-icon {
  margin: 0 23px;
}
</style>
