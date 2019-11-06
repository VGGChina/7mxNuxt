<template>
  <div class="withdraw-container">
    <transition name="cover-fade">
      <div v-if="isShowWithdrawDialog" class="setting-cover" @click="cancel" />
    </transition>

    <transition name="withdraw-fade">
      <div v-if="isShowWithdrawDialog" class="withdraw">
        <div class="title">申请提现</div>
        <div class="detail">
          留下联系方式申请，我们会在3个工作日内和你取得联系，并进行转账，（提现金额必须大于100）
        </div>
        <input
          disabled
          class="border-normal"
          :placeholder="name"
        >
        <input
          disabled
          class="border-normal"
          :placeholder="phone"
        >
        <button @click="commit">发送提现申请</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import apiFactory from '~/api/factory/apiFactory.js'

export default {
  computed: {
    isShowWithdrawDialog() {
      return this.$store.state.withdraw.isShowWithdrawDialog
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    name() {
      if (this.isLogin) {
        return this.loginUser.user_data.company
      } else {
        return ''
      }
    },
    phone() {
      if (this.isLogin) {
        return this.loginUser.user_data.phone
      } else {
        return ''
      }
    }
  },
  methods: {
    cancel() {
      this.$store.commit('isShowWithdrawDialog', false)
    },
    commit() {
      apiFactory.getMediaApi().enchashment()
        .then(res => {
          if (res.data.out === '1') {
            this.$toast.notice(res.data.msg)
            this.$store.commit('isShowWithdrawDialog', false)
          } else {
            this.$toast.warn(res.data.msg)
          }
        })
    }
  }
}
</script>

<style scoped>
.withdraw-container {
  position: fixed;
  z-index: 20;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all .6s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.setting-cover {
  position: fixed;
  z-index: 30;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.withdraw-fade-enter-active,
.withdraw-fade-leave-active {
  transition: all .6s;
}

.withdraw-fade-enter,
.withdraw-fade-leave-active {
  opacity: 0;
  transform: translateY(-40px);
}

.withdraw {
  box-sizing: border-box;
  position: fixed;
  z-index: 1000;
  width: 530px;
  height: 500px;
  right: 50%;
  margin-right: -265px;
  top: 50%;
  margin-top: -250px;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  flex-direction: column;
  padding: 80px 40px 40px 40px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #000000;
}

.detail {
  width: 410px;
  margin: 40px 0;
  font-size: 16px;
  line-height: 1.61;
  text-align: center;
  color: #000000;
}

input {
  box-sizing: border-box;
  width: 449px;
  height: 50px;
  font-size: 16px;
  margin-bottom: 30px;
  outline: none;
  border-radius: 8px;
  background-color: #f6f6f6;
  padding: 0 18px;
  cursor: not-allowed;
}

::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: rgba(0, 0, 0, 0.5);
}

::-moz-placeholder {
  /* Firefox 19+ */
  color: rgba(0, 0, 0, 0.5);
}

:-moz-placeholder {
  /* Firefox 18- */
  color: rgba(0, 0, 0, 0.5);
}

button {
  width: 450px;
  height: 45px;
  outline: none;
  border: none;
  border-radius: 6px;
  margin-top: 20px;
  background-color: #56cb8f;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.border-red {
  border: 1px solid red;
}

.border-normal {
  border: solid 1px #e3e3e3;
}
</style>
