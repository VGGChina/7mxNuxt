<template>
  <div @click="cancel">
    <login-register />
    <upload />
    <upload-paixin />
    <user-setting />
    <improve-info />
    <Needed />
    <topbar />
    <help />
    <popup-album />
    <back-top />
    <contact />
    <confirmation-dialog />
    <nuxt />
  </div>
</template>
<script>
import Topbar from '~/components/topbar/Topbar'
import LoginRegister from '~/components/login-register/LoginRegister'
import Upload from '~/components/upload/Upload'
import UploadPaixin from '~/components/upload-paixin/UploadPaixin'
import UserSetting from '~/components/user-setting/UserSetting'
import ImproveInfo from '~/components/improve-info/ImproveInfo'
import PopupAlbum from '~/components/popup-album/index'
import Help from '~/components/help/index'
import Needed from '~/components/needed/Needed'
import BackTop from '~/components/back-top/BackTop'
import Contact from '~/components/contact/Contact'
import ConfirmationDialog from '~/components/confirmation-dialog/index'

export default {
  components: {
    Topbar,
    LoginRegister,
    Upload,
    UploadPaixin,
    UserSetting,
    ImproveInfo,
    PopupAlbum,
    Help,
    Needed,
    BackTop,
    Contact,
    ConfirmationDialog
  },
  computed: {
    isShowLoginDialog() {
      return this.$store.state.login.isShowLoginDialog
    },
    isShowRegisterDialog() {
      return this.$store.state.register.isShowRegisterDialog
    },
    isShowWithdrawDialog() {
      return this.$store.state.withdraw.isShowWithdrawDialog
    },
    isShowUploadDialog() {
      return this.$store.state.upload.isShowUploadDialog
    },
    isShowUploadPaixinDialog() {
      return this.$store.state.uploadPaixin.isShowUploadPaixinDialog
    },
    isShowSettingDialog() {
      return this.$store.state.setting.isShowSettingDialog
    },
    neededIsShow() {
      return this.$store.state.needed.isShow
    },
    isShowConfirmationDialog() {
      return this.$store.state.confirmationDialog.confirmationDialogData
        .isShowConfirmationDialog
    },
    xToken() {
      return window.localStorage.xToken
    },
    notScroll() {
      return (
        this.isShowLoginDialog ||
        this.isShowRegisterDialog ||
        this.isShowWithdrawDialog ||
        this.isShowUploadDialog ||
        this.isShowUploadPaixinDialog ||
        this.isShowSettingDialog ||
        this.neededIsShow ||
        this.isShowConfirmationDialog
      )
    }
  },

  // watch: {
  //   xToken() {
  //     this.$setCookie(this.xToken)
  //   }
  // },
  created() {
    // this.fetchPublic()
  },
  mounted() {
    window.onresize = () => {
      this.$store.commit('window/onresizeFlag', new Date().getTime())
    }

    window.onscroll = e => {
      const pageYOffset = window.pageYOffset
      this.$store.commit('window/winPageYOffset', pageYOffset)
    }

    this.getLoginUser()
  },
  methods: {
    cancel() {
      // 关闭通知推送窗口
      this.$bus.emit('cancel', '')
    },
    async fetchPublic() {
      // 登录状态
      const currentUser = this.$axios.userService.currentUser()
      // 种类列表
      const categoryList = this.$axios.commonService.categoryList({ type: '6' })

      const promises = [currentUser, categoryList]

      const results = await Promise.all(promises)
      if (results[0].data.out === '1') {
        // 登录状态
        this.$store.commit('login/loginUser', results[0].data.data)
        // this.$
        this.$store.commit('login/isLogin', true)

        if (results[0].data.data.name === '') {
          this.$store.commit('improveInfo/isShowImproveInfo', true)
        }
      }

      if (results[1].data.out === '1') {
        // 种类列表
        this.$store.commit('category/categoryList', results[1].data.data)
      }
    },

    // 获取是否已经登录的信息
    getLoginUser() {
      if (window.localStorage.loginUser !== undefined) {
        this.$store.commit('login/loginUser', JSON.parse(window.localStorage.loginUser))
        this.$store.commit('login/isLogin', true)
      }
    }
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
