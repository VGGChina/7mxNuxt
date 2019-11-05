<template>
  <div class="login">
    <carousel />

    <div class="login-form">
      <input
        v-model="user"
        type="text"
        name="text"
        class="mt120"
        placeholder="手机号/邮箱"
        :class="{
          'border-red': user === '' && commitCheck
        }"
      >

      <input
        v-model="password"
        class="mt14"
        placeholder="密码"
        type="password"
        name="password"
        :class="{
          'border-red': password === '' && commitCheck
        }"
        @keyup.enter="commit"
      >

      <div class="remember">
        <div class="check-box" @click="remember">
          <div v-if="isRemember" />
        </div>
        <span>记住我</span>
        <a @click="toForgetPassword">忘记密码</a>
      </div>

      <!-- <div class="agree">
        <div
          class="check-box-min"
          @click="agree">
          <div v-if="isAgree"></div>
        </div>
        <span>同意</span>
        <a>《平台服务条款》</a>
      </div> -->

      <button class="login-button" @click="commit">登录</button>

      <button class="paixin-account" @click="toPxLogin">拍信登录</button>

      <div class="to-register" @click="toRegister">没有账号？立即注册</div>
    </div>
  </div>
</template>

<script>
import Carousel from '~/components/carousel/Carousel'
import apiFactory from '~/api/factory/apiFactory.js'

export default {
  components: {
    Carousel
  },
  data: () => ({
    isRemember: false,
    isAgree: true,
    commitCheck: false,
    user: '',
    password: ''
  }),
  methods: {
    remember() {
      this.isRemember = !this.isRemember
    },
    agree() {
      this.isAgree = !this.isAgree
    },
    async commit() {
      this.commitCheck = true
      if (this.user === '' || this.password === '') {
        return
      }

      if (!this.isAgree) {
        if (!this.isAgree) {
          this.$toast.warn('您还没有同意《平台服务条款》')
        }
        return
      }

      // 获取服务器时间
      const timeRes = await apiFactory.getCommonApi().getServerTime()

      let time = null

      if (timeRes.data.out == '1') {
        time = timeRes.data.data.time
      } else {
        time = (new Date().getTime() / 1000).toFixed(0)
      }

      const rqBody = {
        user: /^[0-9]{11}$/.test(this.user) ? '0086' + this.user : this.user,
        pass: 'test:' + this.$utilHelper.rsa_encrypt(this.password + '@' + time),
        reme: this.isRemember ? '1' : '0'
      }

      const loginRes = await apiFactory.getUserApi().login(rqBody)
      if (loginRes.data.out == '1') {
        const data = loginRes.data.data

        this.$store.commit('loginUser', data)

        this.$store.commit('login/isShowLoginDialog', false)

        if (data.name == '' || data.nick == '' || data.avatar == '') {
          this.$store.commit('isShowImproveInfo', true)
        }

        // 如果关联过拍信账号，那么校验一遍，后端要求这样做
        if (data.gaga_id) {
          const otherRes = await apiFactory.getUserApi().intoOther()
          if (otherRes.data.out == '1') {
            data.gaga_id = otherRes.data.data.gaga_id
            this.$store.commit('loginUser', data)
          }
        }
      } else {
        this.$toast.warn(loginRes.data.msg)
      }
    },
    toPxLogin() {
      this.$router.push({
        name: 'paixin-login'
      })
      this.$store.commit('login/isShowLoginDialog', false)
    },
    toRegister() {
      this.$store.commit('login/isShowLoginDialog', false)
      this.$store.commit('register/isShowRegisterDialog', true)
    },
    toForgetPassword() {
      this.$router.push({
        name: 'forget-pass'
      })
      this.$store.commit('login/isShowLoginDialog', false)
    }
  }
}
</script>

<style scoped>
.login {
  position: fixed;
  z-index: 30;
  width: 1000px;
  height: 572px;
  border-radius: 10px;
  box-shadow: 0 2px 50px 0 rgba(0, 0, 0, 0.2);
  top: calc(50% - 286px);
  right: calc(50% - 500px);
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all .6s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.login-form {
  width: 50%;
  height: 100%;
  border: none;
  outline: none;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  text-align: center;
  background: #fff;
}

.login-form input {
  box-sizing: border-box;
  width: 400px;
  height: 48px;
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #e4e4e4;
  outline: none;
  font-size: 16px;
  padding: 0 16px;
}

.login-form input:hover {
  border: solid 1px #888;
  transition: border .5s;
}

::placeholder {
  /* Chrome/Opera/Safari */
  color: rgba(0, 0, 0, 0.5);
}

.mt14 {
  margin-top: 24px;
}

.mt120 {
  margin-top: 60px;
}

.remember {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  transform: translateX(50px);
  margin-top: 40px;
}

.check-box {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  cursor: pointer;
}

.check-box div {
  box-sizing: border-box;
  width: 14px;
  height: 8px;
  border-bottom: 3px solid #666666;
  border-left: 3px solid #666666;
  margin-left: 5px;
  margin-top: 7px;
  transform: rotate(-45deg);
}

.remember span {
  font-size: 16px;
  color: #000000;
  margin-left: 6px;
}

.remember a {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin-left: 258px;
  cursor: pointer;
}

.agree {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  transform: translateX(50px);
  margin-top: 70px;
}

.check-box-min {
  width: 18px;
  height: 18px;
  border-radius: 1px;
  background-color: #ffffff;
  border: solid 1px #c8c8c8;
  cursor: pointer;
}

.check-box-min div {
  box-sizing: border-box;
  width: 12px;
  height: 7px;
  border-bottom: 2px solid #666666;
  border-left: 2px solid #666666;
  margin-left: 3px;
  margin-top: 4px;
  transform: ∂rotate(-45deg);
}

.agree span {
  font-size: 16px;
  color: #000;
  margin-left: 12px;
}

.agree a {
  font-size: 16px;
  color: #57cb8f;
  cursor: pointer;
}

button {
  width: 400px;
  height: 48px;
  border-radius: 8px;
  background-color: #56cb8f;
  outline: none;
  border: none;
  font-size: 16px;
  color: #ffffff;
  margin-top: 24px;
  cursor: pointer;
}

.login-button {
  margin-top: 40px;
  transition: all .2s;
}

.login-button:hover {
  background-color: #53C48A;
  transition: all .2s;
  box-shadow: 0px 4px 8px  rgba(83, 186, 138, .3);
}

.paixin-account {
  background-color: rgba(0, 0, 0, 0.1);
  /* border: 1px solid rgba(0, 0, 0, 0.2); */
  color: rgba(0, 0, 0, 0.7);
  transition: all .2s;
}

.paixin-account:hover {
  background-color: rgba(0, 0, 0, 0.15);
  transition: all .2s;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, .06);
}

.to-register {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 40px;
  cursor: pointer;
  display: inline-block;
}

.border-red {
  border: solid 1px red !important;
}
</style>
