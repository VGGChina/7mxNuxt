<template>
  <div class="userAction">
    <span
      class="mr"
      v-if="true||isLogin"
      @click="toContributor">
      签约
    </span>
    <span
      class="mr"
      v-if="!isLogin"
      @click="$store.commit('isShowRegisterDialog', true)">
      注册
    </span>
    <span
      class="mr"
      v-if="!isLogin"
      @click="$store.commit('isShowLoginDialog', true)">
      登录
    </span>
    <span
      class="mr"
      @click="goUpload"
      v-if="isLogin">
      上传
    </span>
    <div class="ring" v-if="isLogin">
      <img
        @click.stop='showNoti'
        class="actionIcon"
        src="./img/message.svg"
        width="18" alt="通知">
      <div v-if='isLogin&&newMessages' @click.stop='showNoti' class="newMessage">1</div>
    </div>
    <div class='avatar_wrap' @mouseenter="isShowList = true" @mouseleave="isShowList = false">
      <router-link :to="userRef">
        <div 
          v-if="isLogin" class="avatar"
          :style=" {
            'backgroundImage': 'url(' +
            ($utilHelper.getCompressionUrl(loginUser.avatar, 200, 200) ||
            require('~/assets/img/avatar-default.svg')) + ')'
          }">
        </div>
      </router-link>
      <avatar-list :isShowList="isShowList && isLogin"></avatar-list>
    </div>
    <transition name='opacity_transform_bottom'>
      <PushNotifi v-if='showPushNotifi'></PushNotifi>
    </transition>
  </div>
  
</template>

<script>
import PushNotifi from '~/components/push-notifi/index'
import { mapGetters } from 'vuex'
import AvatarList from './AvatarList'

export default {
  data: () => ({
    isShowList: false,
    imageNum: 0,
    showPushNotifi: false,
    // 点击后红点临时消除
    readedMessages: false
  }),
  methods: {
    goUpload() {
      this.$store.commit('isShowUploadDialog', true)
    },
    showNoti() {
      this.readedMessages = true
      this.showPushNotifi = !this.showPushNotifi
    },
    toContributor() {
      this.$router.push({ name: 'contributor' })
    },
    cancelPushNotifi() {
      this.$bus.on('cancel', e => {
        this.showPushNotifi = false
      })
    }
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'loginUser'
    ]),
    newMessages() {
      try {
        return ((this.loginUser.un_comment_num * 1 +
          this.loginUser.un_fan_num * 1 +
          this.loginUser.un_like_num * 1 +
          //  this.loginUser.un_needed_num * 1 +
          this.loginUser.un_notice_num * 1
        ) > 0) && !this.readedMessages
      } catch (e) {
        return false
      }
    },
    cardStatus: function () {
      try {
        return this.loginUser.user_data.card_status
      } catch (e) {
        return '0'
      }
    },
    companyStatus: function () {
      try {
        return this.loginUser.user_data.company_status
      } catch (e) {
        return '0'
      }
    },
    status: function () {
      if (this.cardStatus == '0') {
        if (this.companyStatus == '0') {
          return '0';
        } else {
          return this.companyStatus;
        }
      } else {
        return this.cardStatus;
      }
    },
    userRef() {
      return this.$utilHelper.toUserPage(this.loginUser)
    }
  },
  created() {
    this.cancelPushNotifi()
  },
  components: {
    AvatarList,
    PushNotifi
  }
};
</script>

<style lang='scss' scoped>
.userAction {
  flex: 1;
  display: -webkit-flex;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;
  color: #fff;
  font-size: 17px;
  > span {
    text-shadow: 0 0 50px black;
  }
}

.userAction span {
  cursor: pointer;
  opacity: 0.8;
  font-size: 16px;
}

.userAction span:hover {
  opacity: 1;
}

.actionIcon {
  cursor: pointer;
  opacity: 0.8;
}
.actionIcon:hover {
  opacity: 1;
  animation: rotate 0.2s 2 ease-in-out;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.mr {
  margin-right: 36px;
}

.mr25 {
  margin-right: 20px;
}

.cart {
  box-sizing: border-box;
  width: 20px;
  height: 20px;
}

.avatar {
  width: 34px;
  height: 34px;
  border: 2px solid #fff;
  border-radius: 100px;
  margin-right: 24px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.img-num {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: #ff365d;
  position: absolute;
  transform: translate3d(13px, -3px, 0);
}
.ring {
  position: relative;
  margin-right: 36px;
  margin-top: 5px;
}
.newMessage {
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: 40px;
  background: #ff365d;
  position: absolute;
  text-align: center;
  cursor: pointer;
  top: -4px;
  right: -8px;
}
</style>
