<template>
  <transition name="no-content-fade">
    <div v-if="isNoContentShow" class="no-content">
      <div :style="{ 'height': `${textHeight * 40}px` }" class="content">{{ content || 'sorry，暂无内容，您可以尝试刷新页面' }}</div>
      <img src="./img/paixin_cute_0.png" width="50" alt="">
      <img src="./img/paixin_cute_1.png" width="80" alt="">
    </div>
  </transition>
</template>

<script>
export default {
  props: [
    'isNoContentShow',
    'content'
  ],
  computed: {
    textHeight() {
      if (this.content) {
        let a = Math.floor(this.content.length / 8)
        return a == 0 ? 1 : a
      }
      return 1
    }
  }
};
</script>

<style lang='scss' scoped>
.no-content-fade-enter-active,
.no-content-fade-leave-active {
  transition: all .3s;
}

.no-content-fade-enter,
.no-content-fade-leave-active {
  opacity: 0;
}

.no-content {
  * {
    display: block;
    margin: 0 auto;
  }
  .content {
    color: rgba(0,0,0,0.5);
    margin: 0 auto;
    height: 40px;
    width: 200px;
    line-height: 40px;
    font-size: 1rem;
    text-align: center;
    border-radius: 10px;
    padding: 10px 12px;
    background: rgba(0,0,0,0.06);
  }
}

</style>
