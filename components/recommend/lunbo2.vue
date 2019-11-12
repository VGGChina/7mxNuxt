/* 正在进行 ,即将进行 */
<template>
  <div class="box">
    <div v-show="isImage" class="slider-box">
      <ul>
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
      <ul class="second">
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>
    <div v-show="(isShowBanner == 0 ) && !isImage" ref="sliderBox" class="slider-box" :style="{width: width + 'px',top: 0, left: left + 'px',transition: transtion}">
      <ul>
        <router-link
          v-for="(item) in smallBannerList"
          :key="item.id + 'first'"
          :to="{ name: 'activityDetail', params: { id : item.id, tableIndex: '3', page: '1' }}"
          tag="li"
        >
          <img :src="item.image + '?imageView2/2/w/1920/h/1000'">
        </router-link>
        <router-link
          v-for="(item, index) in smallBannerList"
          :key="index"
          :to="{ name: 'activityDetail', params: { id : item.id, tableIndex: '3', page: '1' }}"
          tag="li"
        >
          <img :src="item.image + '?imageView2/2/w/1920/h/1000'">
        </router-link>
        <router-link
          v-for="(item) in smallBannerList"
          :key="item.id + 'last'"
          :to="{ name: 'activityDetail', params: { id : item.id, tableIndex: '3', page: '1' }}"
          tag="li"
        >
          <img :src="item.image + '?imageView2/2/w/1920/h/1000'">
        </router-link>
      </ul>
      <ul class="second">
        <router-link
          v-for="(item) in smallBannerList"
          :key="item.id+ 'first' "
          :to="{ name: 'activityDetail', params: { id : item.id, tableIndex: '3', page: '1' }}"
          tag="li"
        >
          <img :src="item.image + '?imageView2/2/w/1920/h/1000'">
        </router-link>
        <router-link
          v-for="(item, index) in smallBannerList"
          :key="index"
          :to="{ name: 'activityDetail', params: { id : item.id, tableIndex: '3', page: '1' }}"
          tag="li"
        >
          <img :src="item.image + '?imageView2/2/w/1920/h/1000'">
        </router-link>

        <router-link
          v-for="(item) in smallBannerList"
          :key="item.id + 'last'"
          :to="{ name: 'activityDetail', params: { id : item.id, tableIndex: '3', page: '1' }}"
          tag="li"
        >
          <img :src="item.image + '?imageView2/2/w/1920/h/1000'">
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
import { setTimeout, clearTimeout } from 'timers'
// import { setTimeout, clearTimeout, clearInterval } from 'timers';
export default {
  name: '',
  components: {
  },
  props: ['isShowBanner', 'screenWidthBanner', 'smallBannerList'],
  // props: {
  //   smallBannerList: {
  //     type: Array,
  //     required: true
  //   }
  // },
  data: () => ({
    imageList: [],
    imageListTop: [], // 小banner 列表
    imageListBottom: [],
    arrTopLength: 0,
    arrBottomLength: 0,
    left: 0,
    width: 0,
    transtion: null,
    imageWidth: 330,
    timer: null,
    setIntTImer: true,
    isImage: false // 图片加载
  }),
  watch: {
    smallBannerList(val, old) {
      this.isImage = false
      this.imageList = val
      this.getSliderWidth() // 重新定义 轮播图的宽度
      this.filterImageList()
    }
  },
  created() {
    this.imageList = this.smallBannerList
    this.isImage = true
  },
  mounted() {
    this.setInter() // 开启定时器
    this.getSliderWidth()
  },
  methods: {
    slider(direction) {
      // console.log('方向是否改变', direction)
      this.setIntTImer = false
      if (window.a) {
        clearTimeout(window.a)
      }
      window.a = setTimeout(() => {
        this.setIntTImer = true
      }, 6000)
      let syWidth // 剩余宽度
      if (this.screenWidthBanner > this.imageWidth * this.imageListTop.length) {
        return false
      }
      if (direction >= 0) {
        this.transtion = 'all 0.6s ease'
        syWidth = this.left
        if (syWidth < -this.width / 3) {
          this.left += this.imageWidth
        } else {
          const sy = this.width / 3 + this.left
          this.transtion = ''
          this.left = -this.width / 3 * 2 + sy
          this.timer = setTimeout(() => {
            this.transtion = 'all 0.6s ease'
            this.left += this.imageWidth
            this.timer = null
          }, 20)
        }
      } else {
        this.moveLeft()
      }
    },
    moveLeft() {
      this.transtion = 'all 0.6s ease'
      const syWidth2 = this.width / 3 * 2 + (this.left - this.screenWidthBanner)
      if (syWidth2 > this.imageWidth) {
        this.left -= this.imageWidth
      } else {
        this.transtion = ''
        this.left = -this.width / 3 + this.screenWidthBanner + syWidth2
        this.timer = setTimeout(() => {
          this.transtion = 'all 0.6s ease'
          this.left -= this.imageWidth
          this.timer = null
        }, 20)
      }
    },
    filterImageList() {
      if (this.imageList === 0) return
      const T = []
      const B = []
      this.imageList.forEach((item, index) => {
        if (index % 2 !== 1) {
          T.push(item)
        } else {
          B.push(item)
        }
      })
      this.imageListTop = T
      this.imageListBottom = B
      this.getSliderWidth()
    },
    getSliderWidth() { // 获取轮播图盒子的宽度
      this.width = (this.imageListTop.length * this.imageWidth) * 3
      this.left = -this.imageListTop.length * this.imageWidth // 初始画一次 轮播图的位置
    },
    setInter() {
      setInterval(() => {
        if (this.setIntTImer) {
          this.moveLeft()
        }
      }, 4000)
    }
  }
}
</script>

<style lang='css' scoped>
.box{
    position: relative;
    left: -20px;
}
.slider-box{
	height: 390px;
	position: absolute;
  background: rgba(26,26,26,1);
}
.slider-box ul{
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	width: 100%;
}
.slider-box ul li{
	width: 316px;
	height: 189px;
	background: #444;
	margin-left: 14px;
  overflow: hidden;
  cursor:pointer;
}
.slider-box ul li img{
  object-fit: cover;
	height: 100%;
  width: 100%;
	display: inline-block;
  transform: translateX(-50%);
  margin-left: 158px;
}
.slider-box .second {
	margin-top: 12px;
}
</style>
