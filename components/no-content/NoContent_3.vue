<template>
  <transition name="no-content-fade">
    <div v-if="isNoContentShow" class="no-content">
      <img src="./img/bear.png" width="260" alt="">
      <br>
      {{ tips }}
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
    tips() {
      return this.content || 'Sorry，暂无内容'
    }
  }
}
</script>

<style scoped>
.no-content-fade-enter-active,
.no-content-fade-leave-active {
  transition: all .3s;
}

.no-content-fade-enter,
.no-content-fade-leave-active {
  opacity: 0;
}

.no-content {
  /* display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center; */
  letter-spacing: 1px;
  opacity: .9;
  /* top: 140px; */
  /* transform: translateX(-50%); */
  color: #a0b1c1;
  padding: 60px 0;
  text-align: center;
}

</style>
