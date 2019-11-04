<template>
  <div>
    <!-- <login-register /> -->
    <!-- <upload /> -->
    <upload-paixin />
    <user-setting />
    <improve-info />
    <needed />
    <topbar />
    <!-- <help /> -->
    <!-- <popup-album /> -->
    <back-top />
    <contact />
    <confirmation-dialog />
    <nuxt />
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import Topbar from '~/components/topbar/Topbar'
import LoginRegister from '~/components/login-register/LoginRegister'
import Upload from '~/components/upload/Upload'
import UploadPaixin from '~/components/upload-paixin/UploadPaixin'
import UserSetting from '~/components/user-setting/UserSetting'
import ImproveInfo from '~/components/improve-info/ImproveInfo'
// import PopupAlbum from '~/components/popup-album/index'
// import Help from '~/components/help/index'
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
    // PopupAlbum,
    // Help,
    Needed,
    BackTop,
    Contact,
    ConfirmationDialog
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
