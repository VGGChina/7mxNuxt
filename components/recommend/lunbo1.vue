/* 
苏宁创意之旅
拍信创意商店
 */
<template>
    <div class='banner-container'>
        <div v-if='isShowBanner == 2 || isShowBanner == 3 || isShowBanner == 1' class='banner-template-box' :style='{width: largerBannerWidthBox + "px",left: left + "px",transition: transition}' ref='bannerBox'>
            <!-- <a href='javascript:void(0)' :style='{width: largerBannerWidth + "px"}' >
                <div class='imgItem' :style='{"backgroundImage": "url(" + lastUrl + ")"}'></div>
            </a> -->
            <a href='javascript:void(0)' v-for='item in largerBannerList' :key='item.url' ref='lagerBanner' :style='{width: largerBannerWidth + "px"}'>
                <!-- <div class='imgItem' :style='{"backgroundImage": "url(" + item.url + ")"}'></div> -->
                <!-- <div v-if="isShowBanner == 1" class='imgItem' :style='{"backgroundImage": "url(/components/images/banner1.jpg)"}'></div> -->
                <img class='imgItem' src="./images/banner1.jpg" v-if="isShowBanner == 1" alt="" @click="go(1)">
                <img class='imgItem' src="./images/banner2.jpg" v-if="isShowBanner == 2" alt="" @click="go(2)">
                <img class='imgItem' src="./images/banner3.jpg" v-if="isShowBanner == 3" alt="" @click="go(3)">
                <!-- <div class='imgItem' :style='{"backgroundImage": "url(" + item.url + ")"}'></div> -->
                <!-- <div class='imgItem' :style='{"backgroundImage": "url(" + item.url + ")"}'></div> -->
            </a>
            <!-- <a href='javascript:void(0)' :style='{width: largerBannerWidth + "px"}' >
                <div class='imgItem' :style='{"backgroundImage": "url(" + firstUrl + ")"}'></div>
            </a> -->
        </div>
    </div>
</template>

<script>
import { setTimeout, clearTimeout } from 'timers';
export default {
  name: '',
  props: ['isShowBanner', 'screenWidthBanner', 'pic'],
  data: () => ({
    largerBannerList: [],
    length: 2,
    left: 0,
    timer: null,
    firstUrl: '',
    lastUrl: '',
    transition: ''
  }),
  methods: {
    largebanner(direction) {
      clearTimeout(this.timer)
      this.transition = 'all 1s ease'
      let syWidth
      if (direction < 0) {
        syWidth = this.largerBannerWidthBox - (-this.left) - this.largerBannerWidth * 3
        if (syWidth >= 0) {
          this.left -= this.largerBannerWidth
        } else {
          this.transition = 'none'
          this.left = 0;
          this.timer = setTimeout(() => {
            this.transition = 'all 1s ease'
            this.left = -this.largerBannerWidth;
          }, 30)
        }
      } else {
        if ((this.left + this.largerBannerWidth) < 0) {
          this.left += this.largerBannerWidth
        } else {
          this.transition = 'none'
          this.left = -this.largerBannerWidthBox + this.largerBannerWidth;
          this.timer = setTimeout(() => {
            this.transition = 'all 1s ease'
            this.left += this.largerBannerWidth
          }, 30)
        }
      }
    },
    go(index) {
      if (index == 1) {
        this.$router.push({path: '/activity/286052/3/1'})
      } else if (index == 2) {
        this.$router.push({path: '/activity/285880/3/1'})
      } else if (index == 3) {
        window.location.href = 'https://v.paixin.com/'
      }
    }
  },
  created() {
    this.largerBannerList = this.pic
  },
  mounted () {},
  watch: {
    'isShowBanner': function(val) {
    },
    'pic': function (val, old) {
      this.largerBannerList = val
      this.firstUrl = this.largerBannerList[0].url
      this.lastUrl = this.largerBannerList[(this.largerBannerList.length - 1)].url
    }
  },
  computed: {
    largerBannerWidth: function() {
      // this.left = -this.screenWidthBanner
      return this.screenWidthBanner
    },
    largerBannerWidthBox: function() {
      return this.largerBannerWidth * (this.largerBannerList.length + 2)
    }
  },
  components: {
  }
}
</script>

<style lang='css' scoped>
.banner-container{
    position: relative;
    width: 100%;
}
.banner-container .banner-template-box{
	height: 390px;
	display: flex;
    position:absolute;
    top: 0;
}
.banner-container .banner-template-box a{
	display: block;
	height: 100%;
	background: #222222;
}
.banner-container .banner-template-box a img{
	width: 100%;
	display: inline-block;
  object-fit: cover;
}
.imgItem {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
      }
</style>
