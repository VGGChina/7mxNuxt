<template>
  <div class="recommend_container">
    <div class="content">
      <div ref="screen" class="banner" style="width: 100%">
        <!-- 正在进行 -->
        <Lunbo2
          ref="samllbanner"
          :is-show-banner="isShowBanner"
          :screen-width-banner="screenWidthBanner"
          :small-banner-list="smallBannerList"
        />
        <!-- 苏宁寻色之旅 拍信创意推荐-->
        <Lunbo1
          ref="largebanner"
          :is-show-banner="isShowBanner"
          :screen-width-banner="screenWidthBanner"
          :pic="pic"
        />
      </div>
      <!-- 控制箭头 -->
      <div
        v-if="isshowArrow"
        class="left_arrow"
        @click="isShowBanner === 0 ? slider(1) : templateBox(1)"
      >
        <span class="arrow_samll" />
      </div>
      <div
        v-if="isshowArrow"
        class="right_arrow"
        @click="isShowBanner == 0 ? slider(-1) : templateBox(-1)"
      >
        <span class="arrow_samll" />
      </div>
      <!-- 左侧导航-->
      <div class="nav_right">
        <h3 class="title">7MX官方推荐</h3>
        <a
          v-for="(item,index) in navList"
          :key="index"
          href="javascript:void(0)"
          :class="['nav-item',index == isShowBanner ? 'active': null]"
          @click="curentClick(index)"
        >{{ item.text }}</a>
        <router-link tag="a" class="action" to="/activity/2">申请活动</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiFactory from '~/api/factory/apiFactory.js'

import Lunbo1 from './lunbo1'
import Lunbo2 from './lunbo2'
import { setTimeout } from 'timers'

export default {
  name: '',
  components: {
    Lunbo1,
    Lunbo2
  },
  props: {
    smallBannerList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data: () => ({
    navList: [
      {
        id: 1,
        text: '正在进行'
      },
      {
        id: 2,
        text: '你好，夏天'
      },
      {
        id: 3,
        text: '江南烟雨醉荷风'
      },
      {
        id: 4,
        text: '拍信创意商店'
      }
    ],
    // smallBannerList: [],
    isShowBanner: 0,
    screenWidthBanner: 0,
    windowinnerWidth: '',
    pic: [],
    flagClick: true,
    isshowArrow: true
  }),
  methods: {
    slider(direction) {
      if (this.flagClick) {
        this.flagClick = false
        this.getScreen()
        this.$refs.samllbanner.slider(direction)
        this.stopClick()
      }
    },
    templateBox(direction) {
      if (this.flagClick) {
        this.flagClick = false
        this.getScreen()
        this.$refs.largebanner.largebanner(direction)
        this.stopClick()
      }
    },
    // 阻止连续点击
    stopClick() {
      setTimeout(() => {
        this.flagClick = true
      }, 300)
    },
    getScreen() {
      // 获取轮播图显示去的宽度
      // if (process.server) return 1200
      // this.screenWidthBanner = parseInt(this.$refs.screen.style.width)

      this.screenWidthBanner = 1200
    },
    async curentClick(index) {
      // 点击显示当前轮播图
      this.isShowBanner = index
      if (this.isShowBanner === 0) {
        this.getImgList()
      }
      if (index === 2) {
        this.getLargeImageList(1)
      } else if (index === 3) {
        this.getLargeImageList(2)
      } else if (index === 1) {
        this.getLargeImageList(1)
      }
    },
    async getImgList() {
      const result = await apiFactory.getTagApi().getActivityList()
      let res = result.data.data.filter(item => {
        return item.id !== '285671'
      })
      const temp = []
      res.forEach(item => {
        if (item.close_time - new Date().getTime() / 1000 > 0) {
          temp.push(item)
        }
      })
      res = temp.length >= 20 ? temp : res
      if (res.length % 2 === 1) {
        res.push(res.slice(0, 1)[0])
      }
      // this.smallBannerList = res
      this.isshowArrow = true
    },

    async getLargeImageList(typeId) {
      const res = await apiFactory
        .getCommonApi()
        .getLargeImageList({ type: typeId })
      if (res.data.data.length <= 1) {
        this.isshowArrow = false
      }
      const tempArr = []
      if (res.data.data.length > 0) {
        for (const item of res.data.data) {
          const temp = {}
          temp.url = item.image
          tempArr.push(temp)
        }
        this.pic = tempArr
      }
    }
  }
}
</script>

<style lang='css' scoped>
.recommend_container {
  width: 100%;
  height: 412px;
  background: rgba(26, 26, 26, 1);
  padding-top: 17px;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}
.content {
  width: 100%;
  max-width: 1920px;
  height: 412px;
  margin: 0 auto;
  padding: 0 251px 0 45px;
  box-sizing: border-box;
  background: rgba(26,26,26,1);
  position: relative;
}
/*banner*/
.content .banner {
  width: calc(100%);
  height: 390px;
  background:rgba(26, 26, 26, 1);
  position: relative;
  overflow: hidden;
}
/*箭头部分*/
.content .left_arrow {
  width: 70px;
  height: 100%;
  background: linear-gradient(
    -90deg,
    rgba(26, 26, 26, 0) 0%,
    rgba(26, 26, 26, 1) 66%,
    rgba(26, 26, 26, 1) 100%
  );
  position: absolute;
  left: 8px;
  bottom: 0;
}
.content .right_arrow {
  width: 70px;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(26, 26, 26, 0) 0%,
    rgba(26, 26, 26, 1) 66%,
    rgba(26, 26, 26, 1) 100%
  );
  position: absolute;
  right: 238px;
  bottom: 0;
}
.content span {
  display: block;
  position: absolute;
  background-size: 100% 100%;
}
.arrow_samll {
  width: 19px;
  height: 34px;
  top: 172px;
}
.right_arrow .arrow_samll {
  left: 22px;
  background: url('./images/arrow_right.png') no-repeat center;
  opacity: 0.1;
  transition: all 0.6s ease;
}
 .right_arrow:hover .arrow_samll {
  opacity: 0.8;
}
.right_arrow:active .arrow_samll {
  opacity: 1;
}
.left_arrow .arrow_samll {
  left: 30px;
  background: url('./images/arrow_left.png') no-repeat center;
  opacity: 0.1;
  transition: all 0.6s ease;
}
.left_arrow:hover .arrow_samll {
  opacity: 0.8;
}
.left_arrow:active .arrow_samll {
  opacity: 1;
}
/*右侧导航*/
.nav_right {
  width: 265px;
  height: 412px;
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 62px;
  box-sizing: border-box;
  z-index: 100;
  background: rgba(26, 26, 26, 1);
}
.nav_right .title {
  margin: 0 0 7px 0;
  padding: 0;
  height: 28px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 22px;
}
.nav_right .nav-item {
  margin-top: 22px;
  height: 22px;
  font-size: 16px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 22px;
}
.nav_right .nav-item.active {
  color: rgba(44, 197, 150, 1);
}
.nav_right .action {
  margin-top: 38px;
  width: 149px;
  height: 43px;
  background: rgba(44, 197, 150, 1);
  border-radius: 8px;
  font-size: 14px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 43px;
  text-align: center;
}
</style>
