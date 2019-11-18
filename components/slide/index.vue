<template>
  <div class="banner_wrap">
    <div
      :style="{
        'transform' : `translate3d(${-100 / banners.length * bannerSlide.index}%, 0, 0)`,
        'width' : `${100 * banners.length}%`,
        'height' : bannerSlide.height,
        'transition' : `transform ${bannerSlide.transition}ms ease`
      }"
      class="banner_slide"
      :class="[bannerSlide.transition ? 'bannerTransition' : '']"
    >

      <div
        v-for="(item, index) in banners"
        :key="index"
        class="banner"
        :style="{
          'backgroundImage' : `url('${item.img}')`,
          'width' : `${100 / banners.length}%`,
          'cursor' : !!item.url&&!item.button ? 'pointer' : ''
        }"
        @click="jump(item, 'banner')"
      >
        <div class="mask" :style="{ 'opacity': (1 - item.bgOpacity) }" />
        <div>
          <div class="banner-title">
            <img
              :src="item.titleImg"
              :height="item.titleImgHeight ? item.titleImgHeight + 'px' : '70px'"
              alt=""
            >
            <div class="banner-subtitle title-first">
              {{ item.title }}
            </div>
            <div class="banner-subtitle">
              {{ item.content }}
            </div>
            <div
              v-if="!!item.url&&!!item.button"
              class="jump_button"
              @click="jump(item, 'button')"
            >
              {{ item.button }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="switch">
      <div class="switch_left" @click="switchLR(0)">
        <div />
      </div>
      <div class="switch_right" @click="switchLR(1)">
        <div />
      </div>
    </div>

    <div class="point_wrap">
      <div
        v-for="(item, i) in banners"
        :key="i"
        :style="{ 'opacity' : i == bannerSlide.index ? '1' : '.4' }"
        class="point"
        @click="switchBanner(i)"
      >
        {{ item ? '' : '' }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Slide',
  components: {

  },
  props: [

    /**
     * {
     *   index: 0,
     *   transition: 800,
     *   speed: 8000, // 间隔时间
     *   anime: '',
     *   animating: false // 正在进行切换
     * }
     */
    'bannerSlide',
    // [
    //   {
    //     name: '0',
    //     img: require('~/assets/img/8.jpg'),
    //     url: '',
    //     title: 'Eput品牌升级为7MX，震撼上线',
    //     titleImg: require('~/assets/img/7MX.svg'),
    //     content: '编辑、分享、发现令人惊喜的照片并出售',
    //     bgOpacity: 1
    //   }
    // ]
    'banners'
  ],
  data: () => ({

  }),
  created() {
    this.bannerAnime()
  },
  methods: {
    // 自动切换 & 重置自动切换动画
    bannerAnime() {
      // 重置
      clearInterval(this.bannerSlide.anime)
      this.bannerSlide.anime = setInterval(() => {
        this.bannerSlide.ransition = true
        this.bannerSlide.index++
        if (this.bannerSlide.index >= this.banners.length) {
          this.bannerSlide.index = 0
        }
        this.bannerSlide.animating = true
        setTimeout(() => {
          this.bannerSlide.animating = false
        }, this.bannerSlide.transition)
      }, this.bannerSlide.speed)
    },
    // 按下面的点切换
    switchBanner(i) {
      this.bannerSlide.index = i
      this.bannerAnime()
    },
    // 用左右箭头切换
    switchLR(LR) {
      // 正在进行动画的话不处理
      if (this.bannerSlide.animating) return
      if (LR == 0) {
        this.bannerSlide.index--
        if (this.bannerSlide.index < 0) this.bannerSlide.index = this.banners.length - 1
      } else if (LR == 1) {
        this.bannerSlide.index++
        if (this.bannerSlide.index >= this.banners.length) this.bannerSlide.index = 0
      }
      this.bannerAnime()
    },
    async jump(item, from) {
      if (!item.url) return
      if (item.url === 'http://www.hotspringphoto.com') {
        try {
          await this.$axios.statisticsService.postBannerClickNum({ id: '285671' })
        } catch (error) {
          console.log(error)
        }
      }
      if (!!item.button && from == 'banner') return
      window.open(item.url, '_blank')
    }
  }
}
</script>

<style lang='scss' scoped>
.banner_wrap {
  padding-top: 60px;
  overflow: hidden;
  background: #000;
  position: relative;
  transform: translate3d(0, 0, 0);
}
.banner_slide {
  will-change: transform;
  height: 100%;
  * {
    transform: translate3d(0, 0, 0);
  }
}

.banner {
  width: 100%;
  height: 100%;
  vertical-align: top;
  filter: saturate(110%) contrast(110%);
  background-size: cover !important;
  background-position: center !important;
  -moz-background-size: cover !important;
  position: relative;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  transform: translateZ(0);
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    transform: translateZ(0);
  }
}

.title-first {
  margin-top: 20px;
  font-size: 2.4rem !important;
}

.banner-title {
  color: #fff;
  font-size: 16px;
  text-align: center;
  position: relative;
  z-index: 2;
  img {
    filter: drop-shadow(0 0 80px rgba(48, 54, 71, 0.8));
  }
}

.banner-subtitle {
  line-height: 1.7;
  text-shadow: 0 0 80px rgba(48, 54, 71, 0.8);
  letter-spacing: 3px;
  font-size: 1rem;
  font-weight: 100;
  position: relative;
  z-index: 1;
}
.point_wrap {
  height: 0;
  margin: 0 auto;
  width: 240px;
  transform: translateY(-30px);
  display: flex;
  justify-content: center;
  .point {
    width: 6px;
    height: 6px;
    border-radius: 10px;
    background: #fff;
    margin: 0 6px;
    opacity: .4;
    cursor: pointer;
  }
}
.banner_wrap {
  &:hover {
    .switch {
      opacity: 1;
    }
  }
}
.switch {
  transition: all .3s;
  opacity: 0;
  > div {
    width: 36px;
    height: 36px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 100px;
    cursor: pointer;
    transition: all .3s;
    background: rgba(150, 150, 150, 0.3);
    &:hover {
      background: rgba(150, 150, 150, 0.6);
    }
  }
  .switch_left {
    left: 20px;
    div {
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #fff;
      border-left: 2px solid #fff;
      transform: rotate(45deg);
      margin: 12px 15px;
    }
  }
  .switch_right {
    right: 20px;
    div {
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #fff;
      border-left: 2px solid #fff;
      transform: rotate(-135deg);
      margin: 12px 10px;
    }
  }
}
.jump_button {
  border: 2px solid rgba(255, 255, 255, 1);
  border-radius: 100px;
  cursor: pointer;
  height: 42px;
  margin: 0 auto;
  margin-top: 20px;
  line-height: 42px;
  width: 180px;
  letter-spacing: 1px;
  transition: all .3s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    width: 190px;
  }
}
</style>
