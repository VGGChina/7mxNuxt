<template>
  <div class="register">
    <div class="title">
      <span>加入</span><span class="logo">7MX</span>
    </div>

    <div class="detail">
      Best Art Photography Community
    </div>

    <div
      class="phone-input-container"
      :class="{
        'border-red': phone === '' && commitCheck,
        'border-normal': !(phone === '' && commitCheck)
      }"
    >
      <input
        v-model="phone"
        placeholder="手机号"
        type="text"
      >

      <span @click="getCode">{{ timeLeft }}</span>
    </div>

    <input
      v-model="smcode"
      class="mt14"
      placeholder="验证码"
      :class="{
        'border-red': smcode === '' && commitCheck,
        'border-normal': !(smcode === '' && commitCheck)
      }"
    >

    <input
      v-model="password"
      class="mt14"
      placeholder="密码"
      type="password"
      :class="{
        'border-red': password === '' && commitCheck
      }"
      @keyup.enter="commit"
    >

    <div class="agree">
      <div
        class="check-box-min"
        @click="agree"
      >
        <div v-if="isAgree" />
      </div>
      <span>同意</span>
      <a href="/static/pdf/7mx.pdf" target="_blank">《平台服务条款》</a>
      <a href="/static/pdf/xy.pdf" target="_blank">《用户协议》</a>
    </div>
    <div class="tip">注册即代表你已经认真阅读并同意接受</div>

    <button class="button-green" @click="commit">注册</button>

    <div class="to-login" @click="toLogin">已有账号？立即登录</div>
  </div>
</template>

<script>
import apiFactory from '~/api/factory/apiFactory.js'

export default {
  data: () => ({
    phone: '',
    smcode: '',
    password: '',
    isAgree: true,
    commitCheck: false,
    time: 0,
    isTimer: false,
    isRegisting: false
  }),
  computed: {
    timeLeft() {
      return this.time > 0 ? this.time + 's后重新获取' : '发送验证码'
    }
  },
  methods: {
    agree() {
      this.isAgree = !this.isAgree
    },
    toLogin() {
      this.$store.commit('login/isShowLoginDialog', true)
      this.$store.commit('isShowRegisterDialog', false)
    },
    timer() {
      if (this.time > 0) {
        this.time--
        setTimeout(this.timer, 1000)
      } else {
        this.isTimer = false
      }
    },
    async getCode() {
      if (this.isTimer) {
        return
      }

      if (!(/^[0-9]{11}$/.test(this.phone))) {
        this.$toast.warn('请输入正确的手机号码')
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
        scene: 'regist',
        phone: 'test:' + this.$utilHelper.rsa_encrypt('0086' +
          this.phone + '@' + time)
      }

      const res = await apiFactory.getCommonApi().smcode(rqBody)
      if (res.data.out === '1') {
        this.isTimer = true
        this.time = 60
        this.timer()
      } else {
        this.$toast.warn(res.data.msg)
      }
    },
    async commit() {
      this.commitCheck = true
      if (this.phone == '' || this.password == '' || this.smcode == '') {
        return
      }

      if (!(/^[0-9]{11}$/.test(this.phone))) {
        this.$toast.warn('请输入正确的手机号码')
        return
      }

      if (!this.isAgree) {
        if (!this.isAgree) {
          this.$toast.warn('您还没有同意《平台服务条款》')
        }
        return
      }

      if (this.isRegisting) {
        return
      }

      this.isRegisting = true

      // 获取服务器时间
      const timeRes = await apiFactory.getCommonApi().getServerTime()

      let time = null

      if (timeRes.data.out == '1') {
        time = timeRes.data.data.time
      } else {
        time = (new Date().getTime() / 1000).toFixed(0)
      }

      const data = {
        phone: '0086' + this.phone,
        smcode: this.smcode,
        password: 'test:' + this.$utilHelper.rsa_encrypt(this.password + '@' + time),
        info: '1'
      }

      const registerRes = await apiFactory.getUserApi().registerByPhone(data)

      if (registerRes.data.out === '1') {
        this.$toast.notice('注册成功')

        const resData = registerRes.data.data

        // 改变登录状态
        this.$store.commit('loginUser', resData)

        this.$store.commit('isShowRegisterDialog', false)

        if (resData.name == '' || resData.nick == '' || resData.avatar == '') {
          this.$store.commit('improveInfo/isShowImproveInfo', true)
        }

        // 打开推荐页面
        this.$router.push({ name: 'recomment' })
      } else {
        if (registerRes.data.msg === 'phone必须是唯一的') {
          this.$toast.warn('该手机号已注册，请直接登录')
        } else {
          this.$toast.warn(registerRes.data.msg)
        }
      }

      this.isRegisting = false
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  box-sizing: border-box;
  position: fixed;
  z-index: 30;
  width: 472px;
  height: 572px;
  box-shadow: 0 2px 50px 0 rgba(0, 0, 0, 0.3);
  top: calc(50% - 286px);
  top: -moz-calc(50% - 286px);
  top: -webkit-calc(50% - 286px);
  right: calc(50% - 236px);
  right: -moz-calc(50% - 236px);
  right: -webkit-calc(50% - 236px);
  border-radius: 10px;
  background-color: #ffffff;
  text-align: center;
}

.title {
  margin-top: 30px;
  font-size: 20px;
}

.title .logo {
  font-size: 40px;
  font-weight: 600;
  display: inline-block;
  transform: translateY(2px);
}

.detail {
  margin-top: 20px;
  font-size: 20px;
}

.phone-input-container {
  box-sizing: border-box;
  border: solid 1px #e4e4e4;
  width: 400px;
  height: 48px;
  border-radius: 8px;
  border: solid 1px #e4e4e4;
  margin-top: 16px;
  margin-left: calc(50% - 200px);
  display: flex;
  align-items: center;
  padding-right: 4px;
  transition: all .3s;

  &:hover {
    border: solid 1px #888;
    transition: border .3s;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;

    &:hover {
      border: none;
      transition: none;
    }
  }

  span {
    background: #f1f1f1;
    padding: 8px 8px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }
}

input {
  box-sizing: border-box;
  width: 400px;
  height: 48px;
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #e4e4e4;
  outline: none;
  font-size: 16px;
  padding: 0 16px;
  transition: all .3s;
}

input:hover {
  border: solid 1px #888;
  transition: border .3s;
}

::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.mt40 {
  margin-top: 40px;
}

.mt14 {
  margin-top: 20px;
}

.border-red {
  border: solid 1px red !important;
}

.agree {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  transform: translateX(47px);
  margin-top: 40px;
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
  transform: rotate(-45deg);
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
  line-height: 48px;
  border-radius: 8px;
  outline: none;
  border: none;
  font-size: 16px;
  margin-top: 27px;
}

.to-login {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 34px;
  cursor: pointer;
  display: inline-block;
}

.tip {
  text-align: left;
  font-size: .9rem;
  margin-top: 10px;
  margin-left: 46px;
  color: rgba(0, 0, 0, 0.5);
}

</style>
