<template>
  <div @click.stop='noUse'
    class="qq_contact"
    :class='{up: ifmove}'>
    <div class="face" @click="contact_menu()" @mouseenter="anime_smile(true)" @mouseleave="anime_smile(false)">
      <!-- 绿色背景 -->
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 353.7 353.9"
        style="enable-background:new 0 0 353.7 353.9;" xml:space="preserve">
        <path class="st10" d="M176.9,0C79.2,0,0.1,79.1,0,176.8s79,177,176.6,177.1c97.9,0.1,177.1-79.1,177.1-177C353.7,79.2,274.5,0,176.9,0z"/>
      </svg>
      <!-- 笑脸 -->
      <div class="face_wrap" v-bind:class="{face_wrap_left:showTextTip,st11_show:!show_contact_menu,st11_hide:show_contact_menu}" ref="st11">
        <svg version="1.1" id="st11" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 353.7 355.3" xml:space="preserve">
          <path class="st11" d="M89.1,244.8c4.1,11.3,13.7,18,25.9,18c36.7,0,73.3,0,110.1,0c2.5,0,4.5,0.6,6.3,2.4c6.3,6.1,12.8,12.1,19.3,18.1
            c1.5,1.4,3.1,2.7,5.3,3c6.1,0.8,10.4-3,10.4-9.6c0-28.2,0-56.1,0-84.1c0-27.1,0-54.1,0-81.1c0-16.5-11.1-27.6-27.5-27.6
            c-41.1,0-82.2,0-123.5,0c-16.4,0-27.6,11.2-27.6,27.6c-0.1,41.1,0,82.2,0,123.5C87.7,238.3,88,241.6,89.1,244.8z M123.6,194.6
            c0.8-2.7,2.6-4.6,5.4-5.2c3.1-0.7,5.6,0.4,7.5,2.9c6.8,8.4,15.3,14.5,25.8,17.3c21.3,5.6,39.3,0,53.9-16.5c1.5-1.7,2.9-3.6,5.3-4
            c3.2-0.5,6,0.2,7.7,3.2c1.8,3,1.6,6-0.6,8.7c-6.8,8.7-15.3,15.4-25.4,19.9c-8.3,3.7-17.1,5.7-26.5,5.5c-20.6-0.3-37.4-8.2-50.7-23.9
            C124.1,200.2,122.7,197.8,123.6,194.6z" />
          <path v-show="!blink" class="eye" d="M198.9,141.4c0.2-6,4.8-10.6,10.7-10.7c6-0.1,10.9,4.5,11.3,10.6c0.1,2.6,0,5.2,0,8.6c-0.3,2.8,0.6,6.4-0.7,9.9
            c-1.9,5.2-6.6,8.2-12,7.4c-5.1-0.7-9.1-5-9.3-10.3C198.7,151.8,198.7,146.5,198.9,141.4z M133,140.9c0.3-6,5.4-10.3,11.4-10
            c5.8,0.3,10.2,4.7,10.4,10.7c0.1,2.5,0,5.1,0,7.8c0,2.4,0.1,4.8,0,7.3c-0.2,6-4.7,10.5-10.3,10.8c-6,0.3-11.1-4-11.4-10
            C132.7,151.8,132.7,146.4,133,140.9z" />
          <path v-show="blink" class="eye" d="M217.5,146c6,0.2,10.6,3.9,10.7,8.8c0.1,4.9-4.5,9-10.6,9.3c-2.6,0.1-5.2,0-8.6,0c-2.8-0.2-6.4,0.5-9.9-0.6
            c-5.2-1.6-8.2-5.4-7.4-9.9c0.7-4.2,5-7.5,10.3-7.6C207.1,145.8,212.4,145.8,217.5,146z M152.1,146.3c6,0.2,10.3,4.4,10,9.4
            c-0.3,4.8-4.7,8.4-10.7,8.5c-2.5,0.1-5.1,0-7.8,0c-2.4,0-4.8,0.1-7.3,0c-6-0.2-10.5-3.9-10.8-8.5c-0.3-4.9,4-9.1,10-9.4
            C141.2,146,146.6,146,152.1,146.3z" />
        </svg>
      </div>
      <div class="mawenxue"
        :class="[showTextTip? 'mawenxue_left':'']">
        <span>咨询</span>
        <span>客服</span>
      </div>

      <div class='fork_wrap' v-bind:class="{st12_show:show_contact_menu,st12_hide:!show_contact_menu}">
        <img src='./img/fork_white.png' width="34px" height="34px"/>
      </div>
    </div>

    <transition name="fade_contact">
      <div id="contact_menu" v-show="show_contact_menu">
        <div @click='toQQ' class="qq">
          <img src="./img/qq2.svg" alt="">
          <div class="contact_type">点此QQ交谈</div>
          <div class="contact_time">通过QQ咨询客服</div>
        </div>
        <div id="other_contact">
          <img src="./img/tel2.svg" alt="">
          <div class="contact_type">400-9613-900</div>
          <div class="contact_time">AM8:00 - PM10:00</div>
        </div>
        <div @click='popupHelpCenter' class='help_center'>
          <img src="./img/helpCenter2.svg" alt="">
          <div class="contact_type">帮助 & 支持</div>
          <div class="contact_time">哪里不懂点这里~</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
/* global anime */

export default {
  name: 'contact',
  data() {
    return {
      show_contact_menu: false, // 显示列表
      ifmove: false, // 由于返回顶部按钮的显示隐藏而上下位移
      blink: false, // 眨眼，切换两个状态的svg
      showTextTip: false, // 是否显示‘咨询客服’并隐藏笑脸
      faceHover: false, // 是否正用鼠标指在笑脸上
      value: false // hoverface之后设置一个时间阀,以避免有可能hover完之后立即切换成‘咨询客服’提示
    }
  },
  methods: {
    noUse() {
    },
    contact_menu() {
      if (this.show_contact_menu) {
        this.cancel()
      } else {
        this.show()
      }
    },
    toFeedback() {
      window.open('http://paixin.com/feedback', '_blank')
    },
    // 笑
    anime_smile(smile) {
      let timeLine = anime.timeline({ autoplay: true, direction: 'alternate', loop: false })
      // 笑的关键帧数据
      let value = [
        `M89.1,244.8c4.1,11.3,13.7,18,25.9,18c36.7,0,73.3,0,110.1,0c2.5,0,4.5,0.6,6.3,2.4c6.3,6.1,12.8,12.1,19.3,18.1
        c1.5,1.4,3.1,2.7,5.3,3c6.1,0.8,10.4-3,10.4-9.6c0-28.2,0-56.1,0-84.1c0-27.1,0-54.1,0-81.1c0-16.5-11.1-27.6-27.5-27.6
        c-41.1,0-82.2,0-123.5,0c-16.4,0-27.6,11.2-27.6,27.6c-0.1,41.1,0,82.2,0,123.5C87.7,238.3,88,241.6,89.1,244.8z M123.6,194.6
        c0.8-2.7,2.6-4.6,5.4-5.2c3.1-0.7,5.6,0.4,7.5,2.9c6.8,8.4,15.3,14.5,25.8,17.3c21.3,5.6,39.3,0,53.9-16.5c1.5-1.7,2.9-3.6,5.3-4
        c3.2-0.5,6,0.2,7.7,3.2c1.8,3,1.6,6-0.6,8.7c-6.8,8.7-15.3,15.4-25.4,19.9c-8.3,3.7-17.1,5.7-26.5,5.5c-20.6-0.3-37.4-8.2-50.7-23.9
        C124.1,200.2,122.7,197.8,123.6,194.6z`,
        `M89.1,244.8c4.1,11.3,13.7,18,25.9,18c36.7,0,73.3,0,110.1,0c2.5,0,4.5,0.6,6.3,2.4c6.3,6.1,12.8,12.1,19.3,18.1
        c1.5,1.4,3.1,2.7,5.3,3c6.1,0.8,10.4-3,10.4-9.6c0-28.2,0-56.1,0-84.1c0-27.1,0-54.1,0-81.1c0-16.5-11.1-27.6-27.5-27.6
        c-41.1,0-82.2,0-123.5,0c-16.4,0-27.6,11.2-27.6,27.6c-0.1,41.1,0,82.2,0,123.5C87.7,238.3,88,241.6,89.1,244.8z M123.6,194.6
        c0.8-2.7,2.6-4.9,5.4-5.5c4.3,0,4.2,0,7.5,0c10,0,12.5,0,25.8,0c21.9,0,37.4,0,53.9,0c3-0.2,1.3,0,5.3,0c3.4,0,6,0.2,7.7,3.2
        c1.8,3,1.6,6-0.6,8.7c-6.8,8.7-15.3,17-25.4,21.5c-8.3,3.7-17.1,6.8-26.5,6.6c-20.6-0.3-38.8-10.3-50.7-26.6
        C124.1,200.2,122.7,197.8,123.6,194.6z`
      ]
      // 取消笑的话，动画反着来
      if (!smile) value.reverse()
      timeLine.add({
        targets: '.st11',
        d: {
          value: value,
          duration: 5, // 这个参数好像参考意义不大，没仔细看
          delay: 0,
          easing: 'easeInOutQuart'
        }
      })

      if (smile) this.faceHover = true
      else this.faceHover = false

      if (smile) this.showTextTip = false
      else this.value = true // 设置时间阀
    },
    ifShowText() {
      setInterval(() => {
        if (!this.faceHover && !this.show_contact_menu && !this.value) {
          this.showTextTip = !this.showTextTip
        }
        if (this.value) this.value = false
      }, 10000)
    },
    anime_blink() {
      // 眨眼
      let blink = () => {
        this.blink = true
        setTimeout(() => {
          this.blink = false
        }, 40)
      }
      setInterval(() => {
        // 眨眼一次
        blink()
        // 一定几率眨眼两次
        if (Math.random() > 0.3) {
          setTimeout(() => {
            blink()
          }, 150)
        }
      }, 4000)
    },
    popupHelpCenter() {
      this.contact_menu()
      this.$store.dispatch('helpShow')
    },
    toQQ() {
      this.contact_menu()
      window.open('http://q.url.cn/CDzAE8?_type=wpa&qidian=true', '_blank')
    },
    show() {
      this.show_contact_menu = true
      /*     this.$refs.st11.style = "opacity:0;transform:rotate(30deg) scale(.8)"
          this.$refs.st12.style = "opacity:1;transform:rotate(0deg) scale(.8)" */
    },
    cancel() {
      this.show_contact_menu = false
      /* this.$refs.st11.style = "opacity:1;transform:rotate(0deg) scale(1)"
      this.$refs.st12.style = "opacity:0;transform:rotate(-60deg) scale(.8)" */
    }
  },
  watch: {
    winPageYOffset(val, oldVal) {
      if (val > 2000) {
        this.ifmove = true
      } else {
        this.ifmove = false
      }
    }
  },
  mounted() {
    this.anime_blink()

    this.ifShowText()

    this.$bus.on('cancel', () => {
      this.cancel()
    })
  },
  computed: {
    ...mapGetters([
      'winPageYOffset'
    ])
  }
}
</script>

<style lang="scss" scoped>
.fade_contact-enter-active,
.fade_contact-leave-active {
  transition: all 0.4s;
}

.fade_contact-enter,
.fade_contact-leave-active {
  opacity: 0;
  transform: translate3d(20px, 0, 0);
}

.qq_contact {
  width: 50px;
  height: 50px;
  border-radius: 100px;
  box-shadow: 0 0 14px rgba(10, 117, 33, 0.35);
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10;
  transition: all 0.6s;
}

.qq_contact svg {
  position: absolute;
  top: 0;
  left: 0;
}

.face {
  width: 100%;
  height: 100%;
  border-radius: 100px;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  cursor: pointer;
  &:hover {
    .st11,
    .eye {
      transform: scale(1.1);
      transform-origin: center center;
    }
    #st11 {
      animation: float_fast 1.2s infinite ease !important;
    }
  }
}

#contact_menu {
  position: relative;
  z-index: 1002;
  bottom: 150px;
  right: 430px;
  width: 410px;
  height: 150px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 17px rgba(70, 130, 176, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;

  .help_center,
  .qq,
  #other_contact {
    width: 160px;
    img {
      width: 50px;
      margin: 0 auto;
      display: block;
      opacity: 0.6;
      transition: all 0.2s;
      user-select: none;
    }
  }
  .help_center {
    cursor: pointer;
    &:hover {
      img {
        transform: scale(1.05);
        opacity: 0.7;
      }
    }
  }
  .qq {
    cursor: pointer;
    &:hover {
      img {
        transform: scale(1.05);
        opacity: 0.7;
      }
    }
  }
}

.contact_type {
  width: 100%;
  padding-top: 10px;
  color: #000;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.4;
  opacity: 0.7;
  text-align: center;
}

#phone {
  position: absolute;
  bottom: 0;
  border-top: 1px solid rgba(83, 133, 165, 0.25);
  line-height: 3;
  background: rgba(83, 133, 165, 0.05);
  opacity: 0.4;
  left: 50%;
  color: rgba(61, 81, 94, 0.9);
  font-size: 0.9rem;
  transform: translateX(-50%);
  width: 100%;
  margin: 0 auto;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.3s;
}

.contact_time {
  width: 100%;
  color: #3c5e6c;
  opacity: 0.6;
  padding-top: 6px;
  text-align: center;
  font-size: 0.8rem;
}

.st10 {
  fill: rgba(100, 200, 150, 1);
  position: absolute;
  top: 0;
  left: 0;
}

.st11 {
  fill: #ffffff;
  top: 0;
  left: 0;
  position: absolute;
  transition: all 0.3s;
}
.st11_show {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
.st11_hide {
  opacity: 0;
  transform: rotate(30deg) scale(0.8);
}
.st12 {
  fill: #ffffff;
}
#st11 {
  animation: float 3s infinite ease;
  opacity: 1;
  transition: all 0.3s;
}

@keyframes float {
  0% {
    transform: translate(0, 1.5px);
  }
  50% {
    transform: translate(0, -1.5px);
  }
  100% {
    transform: translate(0, 1.5px);
  }
}

@keyframes float_fast {
  0% {
    transform: translate(0, 1px);
  }
  50% {
    transform: translate(0, -1px);
  }
  100% {
    transform: translate(0, 1px);
  }
}

.eye {
  fill: #64c896;
  transition: all 0.3s;
}

#st12 {
  opacity: 0;
  transform: rotate(-60deg) scale(0.8);
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.21, 1.4);
}

.face_wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  transition: all 0.3s;
  transform-origin: center center;
}

.up {
  bottom: 100px;
}
.mawenxue {
  color: #fff;
  position: absolute;
  left: 100%;
  top: 7px;
  transition: all 0.3s;
  span {
    width: 50px;
    text-align: center;
    display: block;
    font-size: 0.8rem;
  }
}
.face_wrap_left {
  left: -100%;
}
.mawenxue_left {
  left: 0;
}
.st12_show {
  opacity: 1 !important;
  transform: translate(-50%, -50%) rotate(0deg) scale(0.8) !important;
}
.st12_hide {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(-60deg) scale(0.8) !important;
}
.fork_wrap {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  transform: translate(-50%, -50%) rotate(-60deg) scale(0.8);
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.21, 1.4);
  cursor: pointer;
}
</style>