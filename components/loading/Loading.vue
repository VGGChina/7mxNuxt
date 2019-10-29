<template>
  <transition name="fade">
    <div class="loading-mask">
      <div v-if="isLoading">
        <div class="loading-bounce1" :style="{'background-color': loadingColor}"></div>
        <div class="loading-bounce2" :style="{'background-color': loadingColor}"></div>
        <div class="loading-bounce3" :style="{'background-color': loadingColor}"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: [
    'isLoading',
    'loadingColor'
  ]
}
</script>


<style>
.fade-enter-active {
  transition: opacity .3s
}

.fade-leave-active {
  transition: opacity 0s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.loading-mask {
  position: absolute;
  left: calc(50% - 35px);
  left: -webkit-calc(50% - 35px);
  left: -moz-calc(50% - 35px);
  padding: 46px 0;
  background: transparent;
}

.loading-mask>div {
  width: 70px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}

.loading-mask>div>div {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: bounceDelay 1.4s infinite ease-in-out;
  animation: bounceDelay 1.4s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.loading-mask .loading-bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.loading-mask .loading-bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes bounceDelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0.0)
  }
  40% {
    -webkit-transform: scale(1.0)
  }
}

@keyframes bounceDelay {
  0%,
  80%,
  100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  }
  40% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>
