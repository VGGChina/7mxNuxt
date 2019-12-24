<template>
  <div class>
    <div class="info-container">
      <transition name="show-bg" mode="out-in">
        <div
          v-show="showBgFlag"
          ref="bg"
          class="bg"
          :style="{
            'backgroundImage': 'url(' + userBg || require('~/assets/img/6.jpg') + ')',
            height: bgHeight
          }"
        />
      </transition>

      <div ref="userInfo" class="user-info">
        <div
          class="avatar"
          :style="{
            'backgroundImage': 'url(' + (userInfo.avatar ?
              userInfo.avatar :
              require('~/assets/img/avatar-default.svg')) + ')'}"
        />

        <div class="name">{{ userInfo.nickname || '' }}</div>

        <div class="user-popular">
          <a class="follow-fan-num" :href="'/friends/' + userInfo.id + '/0'">
            {{ userInfo.userStat.followNum }}
            <span>关注</span>
          </a>

          <div class="dividing" />

          <a class="follow-fan-num" :href="'/friends/' + userInfo.id + '/1'">
            {{ userInfo.userStat.followedNum }}
            <span>追随者</span>
          </a>

          <div class="dividing" />

          <a class="follow-fan-num">
            {{ userInfo.userStat.popularity }}
            <span>人气值</span>
          </a>
        </div>

        <div class="instruction">{{ userInfo.user_data ? userInfo.user_data.about : '' }}</div>

        <div v-if="userInfo.id != loginUser.id" class="follow" @click="follow">{{ followWords }}</div>

        <div v-if="userInfo.id == loginUser.id" class="follow" @click="uploadToPaixin">上架到拍信</div>
      </div>
    </div>

    <select-cards :user-info-height="userInfoHeight" :user-info="userInfo" :is-loading="isLoading" />
  </div>
</template>

<script>
import SelectCards from './selectcards/SelectCards'

export default {
  components: {
    SelectCards
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {
          userInfo: {
            userStat: {}
          }
        }
      }
    },
    originList: {
      type: Array,
      default() {
        return []
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    firstImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showBgFlag: true,
      userInfoHeight: 200
    }
  },
  computed: {
    winPageYOffset() {
      return this.$store.state.window.winPageYOffset
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    followWords() {
      return this.userInfo.is_follow == '1' ? '已关注' : '关注'
    },
    bgHeight() {
      if (!this.showBgFlag) {
        return '0px'
      }

      // this.userInfoHeight = document.querySelector('.info-container').offsetHeight
      // return this.userInfoHeight + 'px'
      return '361px'
    },
    userBg() {
      try {
        if (this.userInfo.backImage === 'http://eput.com/images/show/0d2bb68b98bd5246fe99a698c9a3aa3e.jpg') {
          this.userInfo.backImage = require('~/assets/img/13.jpg')
        }
        if (this.userInfo.backImage != '') {
          const defUrl = 'http://eput.com/images/default_personal_bg.jpg'
          if (this.userInfo.backImage === defUrl) {
            if (this.firstImg && !this.firstImg.includes('?imageMogr2/blur/10x6')) {
              return this.firstImg + '?imageMogr2/blur/10x6'
            }
            return this.firstImg
          }
          if (this.userInfo.backImage && !this.userInfo.backImage.includes('?imageMogr2/blur/10x6')) {
            this.userInfo.backImage += '?imageMogr2/blur/10x6'
          }
          return this.userInfo.backImage
        } else {
          if (this.firstImg && !this.firstImg.includes('?imageMogr2/blur/10x6')) {
            return this.firstImg + '?imageMogr2/blur/10x6'
          }
          return this.firstImg
        }
      } catch (e) {
        if (this.firstImg && !this.firstImg.includes('?imageMogr2/blur/10x6')) {
          return this.firstImg + '?imageMogr2/blur/10x6'
        }
        return this.firstImg
      }
    },
    cardStatus: function() {
      try {
        return this.loginUser.user_data.card_status
      } catch (e) {
        return '0'
      }
    },
    companyStatus: function() {
      try {
        return this.loginUser.user_data.company_status
      } catch (e) {
        return '0'
      }
    },
    status: function() {
      if (this.cardStatus == '0') {
        if (this.companyStatus == '0') {
          return '0'
        } else {
          return this.companyStatus
        }
      } else {
        return this.cardStatus
      }
    }
  },
  watch: {
    winPageYOffset(val) {
      this.setTopbarStyle(100, val)
    }
  },
  mounted() {
    document.getElementById('topbar').style.background = 'transparent'
  },
  methods: {
    follow() {
      if (!this.isLogin) {
        // 如果没有登录，弹出登录弹窗
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      var user = {
        user_id: this.userInfo.id
      }
      if (this.userInfo.is_follow === '1') {
        this.$axios.userService.unfollow(user).then(res => {
          this.userInfo.is_follow = '0'
        })
      } else {
        this.$axios.userService.follow(user).then(res => {
          this.userInfo.is_follow = '1'
        })
      }
    },

    async uploadToPaixin() {
      const res = await this.$axios.userService.currentUser()

      if (res.data.out !== '1') {
        this.$store.commit('login/isShowLoginDialog', true)

        return
      }

      this.$store.commit('login/loginUser', res.data.data)

      setTimeout(() => {
        if (this.status == '3') {
          this.intoOther()
        } else {
          this.$router.push({ name: 'contributor' })
        }
      }, 30)
    },

    async intoOther() {
      const otherRes = await this.$axios.userService.intoOther()

      if (otherRes.data.out === '1') {
        this.loginUser.gaga_id = otherRes.data.data.gaga_id

        this.$store.commit('login/loginUser', this.loginUser)

        this.$store.commit('uploadPaixin/isShowUploadPaixinDialog', true)
      } else {
        this.$toast.warn('您的账号信息有问题，请联系客服')
      }
    },
    /**
     * @param { integer } startHeight topbar开始改变透明度的高度
     * @param { float } pageYOffset 窗口滚动的距离
     */
    setTopbarStyle(startHeight, pageYOffset) {
      const taopBar = document.getElementById('topbar')

      if (pageYOffset < startHeight) {
        taopBar.style.position = 'absolute'

        taopBar.style.background = 'transparent'

        taopBar.style.opacity = '1'
      } else {
        taopBar.style.position = 'fixed'

        let transparent =
          (pageYOffset - startHeight) /
          (this.userInfoHeight - startHeight - 60)

        if (transparent > 1) {
          transparent = 1
        }

        taopBar.style.opacity = transparent

        taopBar.style.background = 'rgba(26, 26, 26, ' + transparent + ')'
      }
    }
  }
}
</script>

<style scoped>
.show-bg-enter-active,
.show-bg-leave-active {
  transition: opacity 0.5s;
}

.show-bg-enter,
.show-bg-leave-active {
  opacity: 0 !important;
}

.info-container {
  position: relative;
  background-size: cover !important;
  background-position: center !important;
  -moz-background-size: cover !important;
  background: #000;
}

.user-info {
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  -webkit-justify-content: center;
  justify-content: center;
  align-items: center;
  align-content: space-between;
  padding-top: 80px;
  position: relative;
  width: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);
}

.name {
  top: 100px;
  color: #fff;
  font-size: 17px;
  margin-top: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border: solid #fff 2px;
  background: #eee;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.user-popular {
  margin-top: 20px;
  color: #fff;
  display: flex;
}

.user-popular .follow-fan-num {
  padding: 0 16px;
  text-align: center;
  color: #fff;
}

.user-popular span {
  color: rgba(255, 255, 255, 0.7);
}

.user-popular .dividing {
  height: 24px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}

.instruction {
  width: 500px;
  margin: 20px 0 30px 0;
  text-align: center;
  color: #fff;
  font-size: 15px;
  opacity: 0.7;
  word-wrap: break-word;
  word-break: normal;
  line-height: 150%;
}

.follow {
  position: absolute;
  top: 110px;
  right: 25px;
  text-align: center;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  height: 30px;
  padding: 0 16px;
  line-height: 30px;
  cursor: pointer;
  opacity: 0.9;
}

.follow:hover {
  opacity: 1;
}

.bg {
  position: absolute;
  width: 100%;
  height: 200px;
  top: 0;
  left: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 0;
}
</style>
