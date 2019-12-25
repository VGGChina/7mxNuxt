<template>
  <div class="index-container">
    <!-- banner展示 -->
    <!-- <recommend :small-banner-list="smallBannerList" /> -->
    <!-- 热门标签 -->
    <hotBabel title="热门标签" />
    <!-- 推荐摄影师 -->
    <photography />
    <!-- 热门图片 -->
    <div>
      <h3 class="hot-img-title">热门图片</h3>
      <loading v-if="true" :is-loading="isLoading" :loading-color="'#000'" class="loading" />

      <div class="waterfallContainer">
        <img-waterfall
          :img-list="imgList"
          :line="line"
          :is-loading="false"
          :is-show-loading="false"
          :is-to-paixin="isToPaixin"
          :if-index="'1'"
        />
      </div>
    </div>
    <!-- <loading v-if="true" :is-loading="isLoading" :loading-color="'#000'" class="loading" /> -->

    <div
      v-if="imgList.length > 0 && line != 'end'"
      class="load-more"
      @click="getMoreData"
    >{{ isLoading ? '正在加载...' : '更多图片' }}</div>
    <!--更多合作 -->
    <cooperation-footer />
    <!-- 页脚 -->
    <index-footer />
  </div>
</template>

<script>
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'
// import slide from '~/components/slide/index'
import IndexFooter from '~/components/footer/IndexFooter'
// import Category from '~/components/category/Category'
// import recommend from '~/components/recommend/recommend.vue'
import photography from '~/components/photography/photography.vue'
import hotBabel from '~/components/hot-babel/hot-babel'
import cooperationFooter from '~/components/cooperation/footer-cooperation'

import loading from '~/components/loading/Loading'

// import { setTimeout } from 'timers'

export default {
  name: 'Index',
  serverCacheKey() {
    // Will change every 10 secondes
    return Math.floor(Date.now() / 10000)
  },
  components: {
    ImgWaterfall,
    // slide,
    // Category,
    IndexFooter,
    // recommend,
    photography,
    hotBabel,
    cooperationFooter,
    loading
  },
  data() {
    return {
      date: Date.now(),
      show_picList: false,
      bannerSlide: {
        index: 0,
        transition: 800,
        speed: 8000, // 间隔时间
        anime: '',
        height: '390px',
        animating: false // 正在进行切换
      },
      banners: [
        {
          img: require('~/assets/img/2.jpg'),
          url: '/activity/285266/3/1',
          bgOpacity: 1
        },
        {
          img: require('~/assets/img/index-bg.jpg'),
          url: 'https://v.paixin.com',
          title: '拍信-中国领先的正版图片交易平台',
          titleImg: require('~/assets/img/7MX.svg'),
          titleImgHeight: 50,
          content: '版权素材免费素材应有尽有',
          button: '点此访问',
          bgOpacity: 1
        },
        {
          img: require('~/assets/img/8.jpg'),
          url: '',
          title: 'Eput品牌升级为7MX，震撼上线',
          titleImg: require('~/assets/img/7MX.svg'),
          titleImgHeight: 50,
          content: '编辑、分享、发现令人惊喜的照片并出售',
          bgOpacity: 1
        },
        {
          img: require('~/assets/img/12.jpg'),
          url: '',
          title: '最好的照片，由你选择',
          titleImg: require('~/assets/img/7MX.svg'),
          titleImgHeight: 50,
          content: '获得灵感，分享你最好的照片，一起探寻创造难以置信的摄影艺术',
          bgOpacity: 1
        },
        {
          img: require('~/assets/img/13.jpg'),
          url: '',
          title: '成为签约供稿人',
          titleImg: require('~/assets/img/7MX.svg'),
          titleImgHeight: 50,
          content: '自由创作，让您的创意迅速变现',
          bgOpacity: 1
        },
        {
          img: require('~/assets/img/14.jpg'),
          url: '',
          title: '立即注册，开启摄影之旅',
          titleImg: require('~/assets/img/7MX.svg'),
          titleImgHeight: 50,
          content: 'Edit, Share, And Discover Inspiring Photos',
          bgOpacity: 1
        }
      ],
      currentItem: 1,
      imgList: [],
      line: '1,0,0',
      isLoading: false,
      column1: ['摄影社区', '关于7MX', '加入我们', '意见反馈'],
      column2: ['商业', '售卖图片', '市场合作', '&nbsp;'],
      column3: ['社群', '微博', '公众号', '&nbsp;'],
      showSearch: true,

      page: 0,
      size: 40
    }
  },
  head() {
    return {
      title: '7MX - 中国领先的视觉创作社区'
    }
  },
  computed: {
    winPageYOffset() {
      return this.$store.state.window.winPageYOffset
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    isToPaixin() {
      if (this.currentItem == 2) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    winPageYOffset(val) {
      // 当页面的滚动条滚动时,会执行这里的代码
      this.setStyle(400, val)
    }
  },

  created() {
    this.fetchData()
  },
  methods: {
    getMoreData() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      this.fetchData()
    },
    setStyle(height, pageYOffset) {
      const taopBar = document.getElementById('topbar')
      if (pageYOffset < 400) {
        this.showSearch = false
        taopBar.style.position = 'absolute'
        taopBar.style.background = '#1a1a1a'

        taopBar.style.opacity = '1'
      } else if (pageYOffset > 400 && pageYOffset < height) {
        taopBar.style.position = 'absolute'
        this.showSearch = true
        taopBar.style.opacity = '0'
      } else {
        this.showSearch = true
        taopBar.style.position = 'fixed'
        let transparent = (pageYOffset - height) / 200
        if (transparent > 1) {
          transparent = 1
        }

        taopBar.style.opacity = transparent

        taopBar.style.background = 'rgba(26, 26, 26, ' + transparent + ')'
      }
    },
    async fetchData() {
      const data = {
        page: this.page,
        size: this.size
      }

      this.isLoading = true
      const res = await this.$axios.mediaService.getHomeHotPicsAPI(data)
      for (const i in res.data.content) {
        res.data.content[i].userStat = {
          followedNum: res.data.content[i].followedNum,
          popularity: res.data.content[i].popularity,
          userId: res.data.content[i].userId
        }
        res.data.content[i].name = res.data.content[i].nickname
      }
      this.imgList.push(...res.data.content)
      const pageNow = this.page
      const pageTotal = res.data.totalPages
      const nextPage = pageNow === pageTotal ? 'end' : this.page + 1
      this.line = nextPage + ',' + pageTotal + ',' + pageNow
      this.page++
      this.isLoading = false
    }
  }
}
</script>

<style lang='scss' scoped>
.loading {
  z-index: 1000;
}
.hot-img-title {
  width: 300px;
  margin: 0 auto;
  text-align: center;
  height: 70px;
  line-height: 100px;
  font-size: 26px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
}
.index-container {
  position: absolute;
  z-index: 5;
  width: 100%;
  min-width: 1200px;
  min-height: 100%;
  overflow: hidden;
  top: 263px;
  padding-bottom: 600px;
}

.publicity {
  width: 800px;
  margin-top: 60px;
  margin-left: calc(50% - 400px);
  margin-left: -moz-calc(50% - 400px);
  margin-left: -webkit-calc(50% - 400px);
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: row;
}

.fw100 {
  font-weight: 100;
  font-size: 64px;
  text-align: center;
}

.fs16 {
  text-align: center;
  font-size: 16px !important;
}

.category-list {
  margin-top: 50px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
}

.type_wrap {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  margin: 0% 10%;
}

.type_wrap .type {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
  /*height: 100%;*/
  height: 20px;
  white-space: nowrap;
  margin: 20px 36px;
}

.type_wrap .type span {
  letter-spacing: 1px;
  cursor: pointer;
  font-size: 22px;
}

.type_wrap div {
  color: rgba(0, 0, 0, 0.5);
}

.type_wrap div:hover {
  color: rgba(0, 0, 0, 1);
}

.icon {
  opacity: 0.5;
}

.iconSelected {
  opacity: 1;
}

.selected {
  color: rgba(0, 0, 0, 1);
}

.load-more {
  margin: 0 auto;
  display: block;
  width: 155px;
  height: 48px;
  background: rgba(255, 255, 255, 1);
  border-radius: 24px;
  border: 1px solid rgba(232, 232, 232, 1);
  text-align: center;
  font-size: 16px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 48px;
  margin-top: 28px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.8);
  }
}
.waterfallContainer {
  width: 1320px;
  margin: 0 auto 0;
}
</style>
