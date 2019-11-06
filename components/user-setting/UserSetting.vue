<template>
  <div class="user-setting">
    <transition name="cover-fade">
      <div v-if="isShowSettingDialog" class="setting-cover" @click="cancel" />
    </transition>

    <transition name="container-fade">
      <div v-if="isShowSettingDialog" class="setting-container">
        <div class="options">
          <span
            v-for="(item, index) in options"
            :key="item"
            :class="{ 'option-selected': selectedOptionIndex === index }"
            @click="selected(index)"
          >{{ item }}</span>
        </div>

        <div v-show="selectedOptionIndex === 0" class="option">
          <div
            id="pick-avatar-container"
            class="avatar"
            :style="{
              'background-image': loginUser.avatar
                ? 'url(' + $utilHelper.getCompressionUrl(loginUser.avatar, 300, 300) + ')'
                : 'url(' + require('~/assets/img/avatar-default.svg') + ')'
            }"
          >
            <div id="pick-avatar" class="avatar-cover">
              <div
                class="camera"
                :style="{
                  'background-image': 'url(' + require('./img/camera.svg') + ')'
                }"
              />
            </div>
          </div>

          <input
            v-model="nick"
            type="text"
            autocomplete="off"
            :placeholder="loginUser.nick == '' ? '昵称' : loginUser.nick"
          >

          <textarea
            v-model="about"
            type="text"
            autocomplete="off"
            :placeholder="loginUser.user_data.about == '' ? '简介' : loginUser.user_data.about"
          />
        </div>

        <div v-show="selectedOptionIndex === 1" class="option">
          <div class="domain-name">7mx.com/{{ loginUser.name }}</div>

          <div class="phone-input-container">
            <input
              v-model="phone"
              :placeholder="loginUser.phone ? loginUser.phone : '绑定手机号'"
              type="text"
            >

            <span v-if="!loginUser.phone || phone" @click="getCode">{{ timeLeft }}</span>
          </div>

          <input v-if="!loginUser.phone || phone" v-model="smcode" class="mt14" placeholder="验证码">
        </div>

        <div v-show="selectedOptionIndex === 2" class="option">
          <input
            v-model="oldPassword"
            type="password"
            :class="{ 'border-red': oldPassword ==='' && commitCheak} "
            placeholder="原密码"
          >

          <input
            v-model="newPassword"
            type="password"
            :class="{ 'border-red': newPassword ==='' && commitCheak} "
            placeholder="新密码"
          >

          <input
            v-model="passwordRepeat"
            type="password"
            :class="{ 'border-red': passwordRepeat ==='' && commitCheak} "
            placeholder="重复新密码"
          >
        </div>

        <button @click="sureClicked">确定</button>
      </div>
    </transition>
  </div>
</template>

<script>
/* global QiniuJsSDK */
import getUptoken from '~/api/uptokenService'
import uploadUtil from '~/utils/uploadUtil'
import apiFactory from '~/api/factory/apiFactory.js'

export default {
  name: '',
  data() {
    return {
      options: [
        '资料',
        '绑定',
        '密码'
      ],
      selectedOptionIndex: 0,
      nick: '',
      about: '',
      phone: '',
      smcode: '',
      oldPassword: '',
      newPassword: '',
      passwordRepeat: '',
      uploader: {},
      uploadData: {},
      isUploading: false,
      commitCheak: false,
      borderColor: {
        'border-color': 'red'
      },
      time: 0,
      isTimer: false
    }
  },
  computed: {
    isShowSettingDialog() {
      return this.$store.state.setting.isShowSettingDialog
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    timeLeft() {
      return this.time > 0 ? this.time + 's后重新获取' : '发送验证码'
    }
  },
  watch: {
    isShowSettingDialog(val, oldVal) {
      if (val) {
        this.initQiNiu()
      }
    }
  },
  mounted() {
    this.nick = this.loginUser.nick
    // this.about = this.loginUser.user_data.about
  },
  methods: {
    cancel() {
      this.$store.commit('setting/isShowSettingDialog', false)
      this.selectedOptionIndex = 0
      this.reSet()
    },
    selected(index) {
      this.selectedOptionIndex = index
      this.commitCheak = false
    },
    setInfo() {
      if (this.about === '') {
        return
      }
      const data = {
        about: this.about
      }
      apiFactory.getUserApi().setUserInfo(data)
        .then(res => {
          if (res.data.out === '1') {
            this.$toast.notice('个人简介设置成功')
            this.$store.commit('loginUser', res.data.data)
          }
        })
    },
    async setNick() {
      if (this.nick) {
        const reg1 = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_]{2,23}$/
        if (!reg1.test(this.nick)) {
          this.$toast.warn('昵称应为3~24位汉字字母数字组合,且不能以数字开头!')
          return
        }

        const data = {
          nick: this.nick || this.loginUser.nick
        }

        const res = await apiFactory.getUserApi().setNick(data)
        if (res.data.out === '1') {
          this.$toast.notice('昵称设置成功')
          this.$store.commit('loginUser', res.data.data)
          this.cancel()
        }
      }
      if (this.about) {
        if (!this.nick) {
          this.setInfo()
          return
        }
        setTimeout(() => {
          this.setInfo()
        }, 1000)
      }
    },
    // 重新绑定手机号
    async setPhone() {
      if (this.phone == '') {
        return
      }

      if (!(/^[0-9]{11}$/.test(this.phone))) {
        this.$toast.warn('请输入正确的验证码')

        return
      }

      if (!this.smcode) {
        this.$toast.warn('您还没有填写验证码')

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
        phone: '0086' + this.phone,
        smcode: 'test:' + this.$utilHelper.rsa_encrypt(this.smcode + '@' + time)
      }

      const res = await apiFactory.getUserApi().bindPhone(rqBody)

      if (res.data.out == '1') {
        this.loginUser.phone = this.phone

        this.$store.commit('loginUser', this.loginUser)
      } else {
        this.$toast.warn(res.data.msg)
      }
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
        phone: 'test:' + this.$utilHelper.rsa_encrypt('0086' + this.phone + '@' + time)
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
    setPassword() {
      if (this.oldPassword === '') {
        return
      }
      if (this.newPassword === '') {
        return
      }
      if (this.passwordRepeat === '') {
        return
      }
      if (this.newPassword !== this.passwordRepeat) {
        this.$toast.warn('两次输入的密码不同')
        return
      }

      const data = {
        oldpwd: 'test:' + this.$utilHelper.rsa_encrypt(this.oldPassword),
        newpwd: 'test:' + this.$utilHelper.rsa_encrypt(this.newPassword)
      }
      apiFactory.getUserApi().setPassword(data)
        .then(res => {
          if (res.data.out === '1') {
            this.$toast.notice(res.data.msg)
            this.cancel()
          } else {
            this.$toast.warn(res.data.msg)
          }
        })
    },
    sureClicked() {
      this.commitCheak = true

      if (this.selectedOptionIndex === 0) {
        this.setNick()
      } else if (this.selectedOptionIndex === 1) {
        this.setPhone()
      } else if (this.selectedOptionIndex === 2) {
        this.setPassword()
      }
    },
    reSet() {
      // this.company = '';
      this.phone = ''
      this.oldPassword = ''
      this.newPassword = ''
      this.passwordRepeat = ''
      this.commitCheak = false
    },
    initQiNiu() {
      this.$nextTick(() => {
        const qiniu = new QiniuJsSDK()
        this.uploader = qiniu.uploader({
          runtimes: 'html5,flash,html4',
          multi_selection: false,
          browse_button: 'pick-avatar',
          uptoken_func: file => {
            const extension = file.type.split('/')[1] || 'jpeg'
            const data = uploadUtil.getUploadData('images', 'photos/', extension)

            getUptoken(data, request => {
              if (request.status === 200) {
                const res = JSON.parse(request.responseText)
                if (res.out === '1') {
                  this.uploadData = res.data
                } else {
                  this.$toast.warn(res.msg)
                  this.uploadData = {}
                }
              } else {
                this.$toast.warn('上传失败，请刷新页面后重试')
                return {}
              }
            })
            return this.uploadData.uptoken
          },
          get_new_uptoken: true,
          domain: 'images.gaga.com',
          container: 'pick-avatar-container',
          flash_swf_url: 'path/of/plupload/Moxie.swf',
          max_retries: 3,
          auto_start: true,
          unique_names: false,
          save_key: false,
          max_file_size: '5mb',
          filters: {
            prevent_duplicates: true,
            mime_types: [{
              title: 'Image files',
              extensions: 'jpg,jpeg,gif,png'
            }],
            max_file_size: '5mb'
          },
          init: {
            // 上传过程中
            'UploadProgress': () => {
              this.isUploading = true
            },
            // 上传完成以后
            'FileUploaded': (up, file, info) => {
              const infoJson = JSON.parse(info)
              const key = infoJson.key
              const url = 'http://images.gaga.me/' + key
              // 发送修改头像的请求
              apiFactory.getUserApi().setAvatar({ 'avatar': url })
                .then(res => {
                  if (res.data.out === '1') {
                    this.$store.commit('loginUser', res.data.data)
                    this.$toast.notice('头像修改成功')
                  }
                })
            },
            'Error': (up, err, errTip) => {
              if (err.code == -600) {
                this.$toast.warn('头像的图片大小不能超过 5 M')
              }
              console.log(err)
            },
            'UploadComplete': () => {
              this.isUploading = false
            },
            'Key': (up, file) => {
              // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
              // 该配置必须要在unique_names: false，save_key: false时才生效
              return this.uploadData.key
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-setting {
  position: fixed;
  z-index: 20;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all 0.6s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.setting-cover {
  position: fixed;
  z-index: 20;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.container-fade-enter-active,
.container-fade-leave-active {
  transition: all 0.6s;
}

.container-fade-enter,
.container-fade-leave-active {
  opacity: 0;
  transform: translateY(-40px);
}

.setting-container {
  position: fixed;
  z-index: 30;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  top: calc(50% - 270px);
  left: calc(50% - 200px);
}

.options span {
  color: rgba(0, 0, 0, 0.5);
  font-size: 20px;
  cursor: pointer;
  margin: 0 16px;
}

.option-selected {
  color: #000 !important;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 368px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-top: 20px;
}

.avatar-cover {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  inline-size: 1;
  cursor: pointer;
}

.camera {
  width: 30px;
  height: 26px;
  background-size: cover;
  margin-top: 40px;
  margin-left: 40px;
}

.phone-input-container {
  box-sizing: border-box;
  border: solid 1px #e4e4e4;
  width: 360px;
  height: 48px;
  border-radius: 8px;
  margin-top: 20px;
  border: solid 1px #e4e4e4;
  display: flex;
  align-items: center;
  padding-right: 4px;
  transition: all 0.3s;

  &:hover {
    border: solid 1px #888;
    transition: border 0.3s;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    margin-top: 0px;

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
  width: 360px;
  height: 48px;
  border-radius: 8px;
  margin-top: 20px;
  outline: none;
  padding: 0px 16px;
  border: 1px solid #e4e4e4;
  font-size: 16px;
  display: block;
}

input:hover {
  border: 1px solid #555;
  transition: border 0.6s;
}

textarea {
  box-sizing: border-box;
  width: 360px;
  height: 140px;
  border-radius: 8px;
  outline: none;
  padding: 16px 16px;
  border: 1px solid #e4e4e4;
  font-size: 16px;
  resize: none;
  display: block;
  margin-top: 20px;
}

textarea:hover {
  border: 1px solid #555;
  transition: border 0.6s;
}

::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.domain-name {
  box-sizing: border-box;
  width: 360px;
  height: 48px;
  line-height: 48px;
  border-radius: 8px;
  padding: 0px 20px;
  border: 1px solid #e4e4e4;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
  margin-top: 20px;
}

button {
  outline: none;
  border: none;
  background: #56cb8f;
  width: 360px;
  height: 45px;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.not-allowed {
  cursor: not-allowed;
}
</style>
