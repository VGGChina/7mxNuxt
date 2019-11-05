<template>
  <div
    class="back-top_container"
    :class="{opacityShow: ifshow}"
    @click="backToTop()"
  >
    <div class="arrow arrow-left" />
    <div class="arrow arrow-right" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      ifshow: false
    }
  },
  computed: {
    winPageYOffset() {
      return this.$store.state.window.winPageYOffset
    }
  },
  watch: {
    winPageYOffset(n, o) {
      if (n > 2000) {
        this.ifshow = true
      } else {
        this.ifshow = false
      }
    }
  },
  methods: {
    backToTop() {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.back-top_container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  position: fixed;
  right: 30px;
  bottom: 30px;
  transition: all 0.6s 0.1s;
  z-index: 10;
  box-shadow: 0 0 20px rgba(0, 0, 100, 0.1);
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.arrow {
  width: 18px;
  height: 4px;
  background: #000;
  border-radius: 20px;
  position: absolute;
  top: 32%;
  left: 50%;
  transition: all 0.3s;
}

.arrow-left {
  transform: translate(-18px, 0) rotate(-45deg);
  transform-origin: right top;
}

.arrow-right {
  transform: translate(1px, 0) rotate(45deg);
  transform-origin: left top;
}

.back-top_container:hover {
  .arrow-left {
    transform: translate(-18px, 0) rotate(-58deg);
    transform-origin: right top;
  }

  .arrow-right {
    transform: translate(1.5px, 0) rotate(58deg);
    transform-origin: left top;
  }
}

.opacityShow {
  opacity: 1;
}
</style>
