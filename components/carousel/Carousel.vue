<template>
  <div class="carousel-container" :style="safariMaskImage">
    <div class="content">
      <div class="name">7MX</div>
      <div class="detail">Best Art Photography<br>Community</div>
    </div>
  
    <div class="btn">
      <div
        class="circle"
        v-for="(img, index) in imgList"
        v-if="index <= 2"
        @click="toSelected(index)"
        :class="{
          'circle-selected': index === currentIndex % 3,
          'circle-not-selected': index !== currentIndex % 3,
          }"
        :key="index"
        @mouseenter="stop"
        @mouseleave="start">
      </div>
    </div>

    <div class="img-cover"></div>

    <div class="img-list" :style="animation">
      <div
        v-for="(img, index) in imgList"
        :key="index"
        :style="{
          'background': 'url(' + img + ') no-repeat'
        }">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'carousel',
  data() {
    return {
      imgQueue: {},
      imgList: [
        require('./img/img1.jpg'),
        require('./img/img2.jpg'),
        require('./img/img3.jpg'),
        require('./img/img1.jpg')
      ],
      currentIndex: 0,
      timers: [],
      isStart: false,
      isStop: false,
      animation: {},
      safariMaskImage: {}
    };
  },
  methods: {
    scroll(scrollX, delay) {
      this.animation = {
        transform: 'translate3d(' + scrollX + 'px, 0px, 0px)',
        transition: 'transform ' + delay + 's cubic-bezier(0.63, 0.02, 0.38, 0.99)'
      }
    },
    startScroll() {
      if (!this.isStart) {
        return;
      }

      // 滚动过一张图片
      this.scroll(-500 * (this.currentIndex + 1), 0.8);
      this.currentIndex++;
      // 如果到了最后一张，在动画结束后重置位置
      if (this.currentIndex === 3) {
        let timer = setTimeout(() => {
          this.scroll(0, 0);
          this.currentIndex = 0;
        }, 700);
        this.timers.push(timer);
      }
      let timer = setTimeout(() => {
        this.startScroll();
      }, 3000);
      this.timers.push(timer);
    },
    toSelected(index) {
      if (index === this.currentIndex % 3) {
        return;
      }

      this.scroll(-500 * index, 0.8);
      this.currentIndex = index;
    },
    start() {
      this.isStart = true;
      let timer = setTimeout(() => {
        this.startScroll();
      }, 3000);
      this.timers.push(timer);
    },
    stop() {
      // 停止并清除所有计时器
      this.isStart = false;
      this.clearTimers();
    },
    clearTimers() {
      let length = this.timers.length;
      for (let i = 0; i < length; i++) {
        clearTimeout(this.timers[i]);
      }
      this.timers = [];
    }
  },
  mounted() {
    this.start();
    if (this.$utilHelper.getBrowser() === 'Safari') {
      this.safariMaskImage = {
        '-webkit-mask-image': '-webkit-radial-gradient(white, black)'
      }
    }
  },
  destroyed() {
    this.stop();
  }
};
</script>

<style scoped>
.carousel-container {
  overflow: hidden !important;
  width: 50%;
  height: 100%;
  /* display: flex;
  display: -webkit-flex; */
  border-bottom-left-radius: 8px !important;
  border-top-left-radius: 8px !important;
  position: relative;
}

.img-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 40;
  background: rgba(0, 0, 0, 0.3);
  border-bottom-left-radius: 8px !important;
  border-top-left-radius: 8px !important;
}

.content {
  position: absolute;
  z-index: 50;
  color: #fff;
  text-align: center;
  top: 170px;
  width: 100%;
}

.name {
  font-size: 80px;
  font-weight: bolder;
}

.detail {
  font-size: 24px;
  letter-spacing: 3px;
}

.btn {
  position: absolute;
  z-index: 50;
  display: flex;
  display: -webkit-flex;
  width: 46px;
  flex-direction: row;
  justify-content: space-between;
  left: 227px;
  bottom: 30px;
}

.circle {
  box-sizing: border-box;
  width: 6px;
  height: 6px;
  background-color: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity .3s;
}

.circle-not-selected {
  opacity: 0.3;
}

.circle-selected {
  opacity: none;
}

.img-list {
  width: 2000px !important;
}

.img-list div {
  display: inline-block;
  width: 500px !important;
  height: 572px !important;
  background-size: cover !important;
}
</style>
