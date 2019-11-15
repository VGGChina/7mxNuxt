<template>
  <div>
    <transition name="mask-fade">
      <div v-if="isShowImproveInfo" class="mask" @click="cancel" />
    </transition>

    <transition name="dialog-fade">
      <div v-if="isShowImproveInfo" class="dialog">
        <h2>完善您的信息</h2>

        <div
          id="improve-info-avatar-container"
          class="avatar"
          :style="{
            'background-image': loginUser.avatar == ''
              ? 'url(' + require('~/assets/img/avatar-default.svg') + ')'
              : 'url(' + $utilHelper.getCompressionUrl(loginUser.avatar, 300, 300) + ')'
          }"
        >
          <div
            id="improve-info-avatar"
            class="avatar-cover"
          >
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
          :placeholder="!loginUser.nick ? '昵称' : loginUser.nick"
        >

        <div class="improveInfo-domainName">
          <span>7mx.com/</span>

          <input
            v-model="name"
            :disabled="loginUser.name != ''"
            :style="{
              cursor: loginUser.name == '' ? 'text' : 'not-allowed'
            }"
            type="text"
            :placeholder="!loginUser.name ? '个性域名(四位以上的字母或数字组合)' : loginUser.name"
          >
        </div>

        <button @click="commit">确定</button>
      </div>
    </transition>
  </div>
</template>

<script>
import uploadUtil from '~/utils/uploadUtil'
import getUptoken from '~/api/uptokenService'

export default {
  data() {
    return {
      name: '',
      nick: '',
      commitCheak: false
    }
  },
  computed: {
    isShowImproveInfo() {
      return this.$store.state.improveInfo.isShowImproveInfo
    },
    loginUser() {
      return this.$store.state.login.loginUser
    }
  },
  watch: {
    isShowImproveInfo(val, oldVal) {
      if (val) {
        this.initQiNiu()
      }
    }
  },
  methods: {
    cancel() {
      this.$store.commit('improveInfo/isShowImproveInfo', false)
    },
    initQiNiu() {
      this.$nextTick(() => {
        const qiniu = new QiniuJsSDK()
        this.uploader = qiniu.uploader({
          runtimes: 'html5,flash,html4',
          multi_selection: false,
          browse_button: 'improve-info-avatar',
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
          container: 'improve-info-avatar-container',
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
              this.$axios.userService.setAvatar({ 'avatar': url })
                .then(res => {
                  if (res.data.out === '1') {
                    this.$store.commit('login/loginUser', res.data.data)
                    this.$toast.notice('头像修改成功')
                  }
                })
            },
            'Error': (up, err, errTip) => {
              if (err.code == -600) {
                this.$toast.warn('头像的图片大小不能超过 5 M')
              }
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
    },
    setNick() {
      if (this.nick == '') {
        return
      }

      const reg1 = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_]{2,23}$/
      if (!reg1.test(this.nick)) {
        this.$toast.warn('昵称应为3~24位汉字字母数字组合,且不能以数字开头!')
        return
      }

      const data = {
        nick: this.nick
      }
      this.$axios.userService.setNick(data)
        .then(res => {
          if (res.data.out === '1') {
            this.$toast.notice(res.data.msg)
            this.$store.commit('login/loginUser', res.data.data)
            this.cancel()
          }
        })
    },
    async setName() {
      if (this.name == '') {
        return
      }

      const reg1 = /^[a-zA-Z]\w{3,23}$/
      if (!reg1.test(this.name)) {
        this.$toast.warn('个性域名应为4~24位字母数字组合,且不能以数字开头!')
        return
      }

      // 检验个性域名是否和路由冲突
      let isRepeat = false
      this.$router.options.routes.forEach(element => {
        const array = element.path.split('/')
        if (array[1] == this.name) {
          isRepeat = true
        }
      })

      if (isRepeat) {
        this.$toast.warn('该个性域名已被占用')
        return
      }

      const data = {
        name: this.name
      }
      const res = await this.$axios.userService.userDetail({ name: this.name })
      if (res.data.out === '1') {
        this.$toast.warn('该个性域名已被占用')
      } else {
        this.$axios.userService.setName(data)
          .then(res1 => {
            if (res1.data.out === '1') {
              this.$toast.notice(res1.data.msg)
              this.$store.commit('login/loginUser', res1.data.data)
              this.cancel()
            }
          })
      }
    },
    async commit() {
      if (this.name == '' && this.nick == '') {
        this.$toast.warn('您还没有填写任何信息')
        return
      }

      if (this.nick != '') {
        this.setNick()
      }

      if (this.name != '') {
        this.setName()
      }
    }
  }
}
</script>

<style scoped>
.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: all .6s;
}

.mask-fade-enter,
.mask-fade-leave-active {
  opacity: 0;
}

.mask {
  position: fixed;
  z-index: 20;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all .6s;
}

.dialog-fade-enter,
.dialog-fade-leave-active {
  opacity: 0;
  transform: translateY(-40px);
}

.dialog {
  box-sizing: border-box;
  position: fixed;
  z-index: 30;
  width: 460px;
  height: 496px;
  padding: 0 30px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
  margin-top: -248px;
  left: 50%;
  margin-left: -230px;
}

h2 {
  font-size: 22px;
  margin: 30px 0 20px 0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-top: 20px;
  margin-bottom: 30px;
}

.avatar-cover {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.camera {
  width: 30px;
  height: 26px;
  background-size: cover;
  background-position: center;
 }

.border-red {
  border: 1px solid red;
}

.border-normal {
  border: 1px solid #e4e4e4;
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
  transition: border .5s;
  margin-bottom: 24px;
}

input:hover {
  border: solid 1px #555;
  transition: border .5s;
}

::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.improveInfo-domainName {
  box-sizing: border-box;
  width: 400px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: solid 1px #e4e4e4;
  padding: 0 0 0 8px;
  border-radius: 8px;
}

.improveInfo-domainName span {
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  background: #f1f1f1;
  padding: 8px 8px;
  border-radius: 6px;
  font-size: 16px;
}

.improveInfo-domainName input {
  flex: 1;
  margin-bottom: 0;
  border: none;
  padding: 0 16px 0 0;
  margin-left: 8px;
}

button {
  width: 400px;
  height: 45px;
  margin-top: 56px;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 6px;
  background-color: #56cb8f;
  cursor: pointer;
  position: absolute;
  bottom: 40px;
  outline: none;
}
</style>

