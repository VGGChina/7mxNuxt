<template>
  <div class="px-container">
    <div class="px-login">
      <div class="title">使用拍信账号登录</div>

      <!-- 验证码或者密码 -->
      <div class="category-options">
        <div class="slide" :style="slideStyle" />
        <div
          v-for="(option, index) in categoryOptions"
          :key="index"
          class="category-option"
          @click="slide(index)"
        >
          {{ option }}
        </div>
      </div>

      <div
        class="input-area"
        :class="{
          'border-red': commitCheak && phone == '',
          'border-normal': !(commitCheak && phone == '')
        }"
      >
        <input
          v-model="phone"
          class="phone"
          type="text"
          name="phone"
          placeholder="手机号"
        >
        <span v-if="whichOption == 0" class="code" @click="getCode">{{ timeLeft }}</span>
      </div>

      <input
        v-if="whichOption == 0"
        v-model="pass"
        type="text"
        name="smcode"
        :class="{
          'border-red': commitCheak && pass == '',
          'border-normal': !(commitCheak && pass == '')
        }"
        placeholder="验证码"
        @keyup.enter="login"
      >

      <input
        v-if="whichOption == 1"
        v-model="pass"
        type="password"
        name="password"
        :class="{
          'border-red': commitCheak && pass == '',
          'border-normal': !(commitCheak && pass == '')
        }"
        placeholder="密码"
        @keyup.enter="login"
      >

      <div class="login-button" @click="login">登录</div>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      categoryOptions: ['验证码登录', '密码登录'],
      whichOption: 0, // 0为个人，1为企业
      slideStyle: { transform: 'translateX(0px)' },
      phone: '',
      pass: '',
      commitCheak: false,
      time: 0,
      isTimer: false
    }
  },
  computed: {
    timeLeft() {
      return this.time > 0 ? this.time + 's后重新获取' : '发送验证码'
    }
  },
  head() {
    return {
      title: '拍信登录 - 7MX 中国领先的视觉创作社区'
    }
  },
  methods: {
    /**
    * 顶部选项卡选中时的动画控制
    * @param index 这个参数是指当前选中的选项卡的索引
    */
    slide(index) {
      this.whichOption = index
      // 每个选项卡的宽度为190px，滑块宽度为188， 所以需要滑动188
      this.slideStyle = {
        transform: 'translateX(' + index * 188 + 'px)'
      }
    },
    timer: function() {
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
      const timeRes = await this.$axios.commonService.getServerTime()

      let time = null

      if (timeRes.data.out === '1') {
        time = timeRes.data.data.time
      } else {
        time = (new Date().getTime() / 1000).toFixed(0)
      }

      const rqBody = {
        phone: 'test:' + this.$utilHelper.rsa_encrypt('0086' + this.phone + '@' + time)
      }
      const httpData = {
        url: 'https://api.paixin.com/common/smcode',
        data: rqBody
      }

      //   const res = await axiosPost('//api.paixin.com/common/smcode', rqBody)
      const res = await this.$axios(httpData)

      if (res.data.out === '1') {
        this.isTimer = true
        this.time = 60
        this.timer()
      } else {
        this.$toast.warn(res.data.msg)
      }
    },
    async login() {
      this.commitCheak = true
      if (this.phone == '' || this.pass == '') {
        return
      }

      if (this.whichOption == 0) {
        // 获取服务器时间
        const timeRes = await this.$axios.commonService.getServerTime()

        let time = null

        if (timeRes.data.out === '1') {
          time = timeRes.data.data.time
        } else {
          time = (new Date().getTime() / 1000).toFixed(0)
        }

        const rqBody = {
          phone: '0086' + this.phone,
          smcode: 'test:' + this.$utilHelper.rsa_encrypt(this.pass + '@' + time)
        }

        const res = await this.$axios.userService.paixinLoginSmcode(rqBody)

        const data = res.data.data

        if (res.data.out === '1') {
          this.$store.commit('login/loginUser', res.data.data)
          window.history.back()
          if (data.name == '' || data.nick == '' || data.avatar == '') {
            this.$store.commit('improveInfo/isShowImproveInfo', true)
          }
        } else {
          this.$toast.warn(res.data.msg)
        }
      } else {
        // 获取服务器时间
        const timeRes = await this.$axios.commonService().getServerTime()

        let time = null

        if (timeRes.data.out === '1') {
          time = timeRes.data.data.time
        } else {
          time = (new Date().getTime() / 1000).toFixed(0)
        }

        const rqBody = {
          phone: '0086' + this.phone,
          pass: 'test:' + this.$utilHelper.rsa_encrypt(this.pass + '@' + time)
        }

        const res = await this.$axios.userService.paixinLogin(rqBody)

        if (res.data.out === '1') {
          this.$store.commit('login/loginUser', res.data.data)
          window.history.back()
          if (res.data.data.name == '') {
            this.$store.commit('improveInfo/isShowImproveInfo', true)
          }
        } else {
          this.$toast.warn(res.data.msg)
        }
      }
    }
  }
}
</script>

<style scoped>
.px-container {
  position: absolute;
  top: 0px;
  width: 100%;
  min-width: 1200px;
  height: 100%;
  background-image: url('../../assets/img/bg.jpg');
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  -webkit-background-position: center;
  -moz-background-position: center;
  -o-background-position: center;
  background-position: center;
}

.px-login {
  box-sizing: border-box;
  position: absolute;
  width: 460px;
  height: 478px;
  padding: 40px 0;
  margin-left: calc(50% - 230px);
  margin-left: -moz-calc(50% - 230px);
  margin-left: -webkit-calc(50% - 230px);
  background: #fff;
  border-radius: 8px;
  top: 50%;
  margin-top: -239px;
}

.title {
  font-size: 20px;
  font-weight: bolder;
  text-align: center;
  color: #000;
}

.category-options {
  box-sizing: border-box;
  width: 380px;
  height: 38px;
  padding: 0 2px;
  border-radius: 4px;
  background-color: #f4f4f4;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  margin: 40px 0 0 calc(50% - 190px);
  margin: 40px 0 0 -moz-calc(50% - 190px);
  margin: 40px 0 0 -webkit-calc(50% - 190px);
}

.slide {
  width: 188px;
  height: 34px;
  border-radius: 4px;
  background-color: #fff;
  position: absolute;
  transition: transform .3s;
  margin-top: 2px;
}

.category-option {
  flex: 1;
  line-height: 38px;
  cursor: pointer;
  z-index: 10;
  text-align: center;
  transition: color .3s;
}

.border-red {
  border-color: red !important;
}

.border-normal {
  border-color: #e4e4e4 !important;
}

input {
  box-sizing: border-box;
  width: 360px;
  height: 48px;
  margin-left: calc(50% - 180px);
  margin-left: -moz-calc(50% - 180px);
  margin-left: -webkit-calc(50% - 180px);
  background-color: transparent;
  border: none;
  border-bottom: solid 1px #c1c1c1;
  outline: none;
  font-size: 16px;
  padding: 0 8px;
  transition: border .3s;
  color: #000;
}

input:hover {
  border-color: #555;
  transition: border .3s;
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

.input-area {
  box-sizing: border-box;
  width: 360px;
  height: 48px;
  align-items: center;
  /* border-radius: 6px; */
  border: none;
  border-bottom: solid 1px #c1c1c1;
  background-color: transparent;
  margin: 48px 0 36px calc(50% - 180px);
  margin: 48px 0 36px -moz-calc(50% - 180px);
  margin: 48px 0 36px -webkit-calc(50% - 180px);
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  transition: border .3s;
}

.input-area:hover {
  transition: border .3s;
  border-color: #555;
}

.phone {
  -webkit-flex: 1;
  flex: 1;
  box-sizing: border-box;
  height: 42px;
  border: none;
  outline: none;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 16px;
  margin-bottom: 0px;
}

.phone:hover {
  border: none;
}

.code {
  -webkit-flex: initial;
  flex: initial;
  min-width: 70px;
  height: 34px;
  padding: 0px 6px;
  text-align: center;
  line-height: 34px;
  font-size: 12px;
  margin-right: 6px;
  cursor: pointer;
  border-radius: 4px;
  background-color: #f4f4f4;
  border: none;
  color: #000;
}

.login-button {
  width: 400px;
  height: 48px;
  border-radius: 6px;
  background-color: #56cb8f;
  color: #fff;
  text-align: center;
  line-height: 48px;
  font-size: 18px;
  cursor: pointer;
  margin-left: calc(50% - 200px);
  margin-left: -moz-calc(50% - 200px);
  margin-left: -webkit-calc(50% - 200px);
  margin-top: 56px;
}
</style>

