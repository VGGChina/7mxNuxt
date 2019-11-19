<template>
  <div class="forget-password">
    <div
      v-if="step == 0 || step == 2"
      class="phone-input-container"
      :class="{
        'border-red': user === '' && commitCheck,
        'border-normal': !(user === '' && commitCheck)
      }"
    >
      <input
        v-model="user"
        placeholder="手机号/邮箱"
        type="text"
      >

      <span
        v-if="step == 2"
        @click="getCode"
      >
        {{ timeLeft }}
      </span>
    </div>

    <input
      v-if="step == 2"
      v-model="smcode"
      style="margin-top: 30px;"
      placeholder="验证码"
      :class="{
        'border-red': smcode === '' && commitCheck,
        'border-normal': !(smcode === '' && commitCheck)
      }"
    >

    <input
      v-if="step == 2"
      v-model="password"
      style="margin-top: 30px;"
      placeholder="新密码"
      type="password"
      :class="{
        'border-red': smcode === '' && commitCheck,
        'border-normal': !(smcode === '' && commitCheck)
      }"
    >

    <input
      v-if="step == 2"
      v-model="passwordRepeat"
      style="margin-top: 30px;"
      placeholder="重复新密码"
      type="password"
      :class="{
        'border-red': smcode === '' && commitCheck,
        'border-normal': !(smcode === '' && commitCheck)
      }"
    >

    <button v-if="step == 0 || step == 2" @click="nextStep(step)">{{ step == 0 ? '下一步' : '确定' }}</button>

    <a
      v-if="step == 0"
      href="//q.url.cn/CDzAE8?_type=wpa&qidian=true"
      target="_blank"
      class="find-account"
    >
      Eput用户找回账号
    </a>

    <div
      v-if="step == 1"
      class="tips"
    >
      修改密码的邮件已经发送到您指定的邮箱 <span>{{ this.user }}</span>，邮件有效期为3天，请及时前往查收！
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: '',
    smcode: '',
    password: '',
    passwordRepeat: '',
    commitCheck: false,
    time: 0,
    isTimer: false,
    step: 0 // 0是还未点击下一步，1是输入邮箱点击下一步，2是输入手机然后点击下一步
  }),
  computed: {
    timeLeft() {
      return this.time > 0 ? this.time + 's后重新获取' : '发送验证码'
    }
  },
  head() {
    return {
      title: '忘记密码 - 7MX 中国领先的视觉创作社区'
    }
  },
  methods: {
    nextStep(step) {
      if (step == 0) {
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (regEmail.test(this.user)) {
          this.byEmail()

          this.step = 1

          return
        }

        const regPhone = /^[0-9]{11}$/

        if (regPhone.test(this.user)) {
          this.step = 2

          return
        }

        this.$toast.warn('请输入正确的手机号或者邮箱')
      }

      if (step == 2) {
        this.byPhone()
      }
    },
    byEmail() {
      this.commitCheck = true

      if (this.user === '') {
        return
      }

      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.user)) {
        this.$toast.warn('邮箱格式有误，请重新输入')
        return
      }

      this.$axios.userService.forgetPasswordByEmail({ email: this.user })
        .then(res => {
          if (res.data.out === '1') {
            this.step = true
          } else {
            this.$toast.warn(res.data.msg)
          }
        })
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

      // 获取服务器时间
      const timeRes = await this.$axios.commonService.getServerTime()

      let time = null

      if (timeRes.data.out === '1') {
        time = timeRes.data.data.time
      } else {
        time = (new Date().getTime() / 1000).toFixed(0)
      }

      const rqBody = {
        scene: 'verify',
        phone: 'test:' + this.$utilHelper.rsa_encrypt('0086' +
          this.user + '@' + time)
      }

      const res = await this.$axios.commonService.smcode(rqBody)
      if (res.data.out === '1') {
        this.isTimer = true
        this.time = 60
        this.timer()
      } else {
        this.$toast.warn(res.data.msg)
      }
    },
    async byPhone() {
      this.commitCheck = true

      if (!this.smcode) return

      if (!this.password) return

      if (!this.passwordRepeat) return

      if (this.password !== this.passwordRepeat) {
        this.$toast.warn('两次输入的密码不一致')

        return
      }

      // 获取服务器时间
      const timeRes = await this.$axios.commonService.getServerTime()

      let time = null

      if (timeRes.data.out === '1') {
        time = timeRes.data.data.time
      } else {
        time = (new Date().getTime() / 1000).toFixed(0)
      }

      const rqBody = {
        phone: '0086' + this.user,
        smcode: this.smcode,
        newpwd: 'test:' + this.$utilHelper.rsa_encrypt(this.password + '@' + time)
      }

      const res = await this.$axios.userService.modifyPasswordByPhone(rqBody)

      if (res.data.out === '1') {
        this.$toast.notice('修改密码成功')

        this.$router.push({
          name: 'index'
        })
      } else {
        this.$toast.warn(res.data.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.forget-password {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 1200px;
}

.phone-input-container {
  box-sizing: border-box;
  border: solid 1px #e4e4e4;
  width: 400px;
  height: 48px;
  border-radius: 8px;
  border: solid 1px #e4e4e4;
  margin-top: 30px;
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
    color: #000;
  }
}

input {
  box-sizing: border-box;
  width: 400px;
  height: 48px;
  border-radius: 8px;
  background-color: #fff;
  border: solid 1px #e4e4e4;
  font-size: 16px;
  padding: 0 16px;
  outline: none;
}

input:hover {
  border: solid 1px #888;
  transition: border .5s;
}

.border-red {
  border: 1px solid red;
}

button {
  width: 400px;
  height: 48px;
  margin-top: 30px;
  border-radius: 8px;
  background-color: #56cb8f;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 0 16px;
  color: #fff;
  cursor: pointer;
}

.tips {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 50px 40px;
  margin-top: 80px;
  font-size: 16px;
  color: #1a1a1a;
}

span {
  color: #56cb8f;
}

.find-account {
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
  transition: all .2s;
  width: 400px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  margin-top: 30px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 0 16px;
  cursor: pointer;
}
</style>
