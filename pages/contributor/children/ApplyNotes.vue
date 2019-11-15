<template>
  <div class="apply-notes">
    <div class="title">申请须知</div>
    <div class="rule">· 作品中不可以出现LOGO、商标</div>
    <div class="rule long">· 作品中不可以出现未取得可用于转售用途授权的商业字体</div>
    <div class="rule long">· 作品中可辨认面孔的人物必须拥有正确的人物肖像权协议</div>
    <div class="rule long">· 作品中如涉及物产的图片，必须拥有正确的物产权协议</div>
    <a class="authDocument" href="/static/pdf/portrait.pdf" target="view_window">《肖像授权书下载》</a>
    <a class="authDocument" href="/static/pdf/realRight.pdf" target="view_window">《物产权协议下载》</a>

    <div class="agree">
      <div class="tip">· 您是否愿意成为拍信<strong> 定制拍摄接单 </strong>摄影师？</div>

      <div class="agree-custom">
        <div class="check-box" @click="isAgreeCustom = true">
          <div v-if="isAgreeCustom" class="hook" />
        </div>
        <span>是</span>
        <div class="check-box" style="margin-left: 23px" @click="isAgreeCustom = false">
          <div v-if="!isAgreeCustom" class="hook" />
        </div>
        <span>否</span>
        <a @click="isShowDialog = !isShowDialog">了解定制拍摄</a>
        <transition name="dialog-fade">
          <div v-if="isShowDialog" class="dialog">
            <div>
              · 拍信为企业客户提供定制拍摄服务，以满足高级企业用户的特定图片需求<br>
              · 主要拍摄内容：产品图，会议活动拍摄，产品宣传片，公司宣传片等<br>
              · 成为拍信定制拍摄接单摄影师，企业需要拍摄时会与您进行联系<br>
              · 了解更多定制拍摄详情可 <a href="//q.url.cn/CDzAE8?_type=wpa&qidian=true" target="_blank">咨询客服</a>
            </div>
          </div>
        </transition>
      </div>

      <div class="agree-protocol">
        <div style="transform: translateY(3px)" class="check-box" @click="isAgreeProtocol = !isAgreeProtocol">
          <div v-if="isAgreeProtocol" class="hook" />
        </div>
        <span>我已阅读并同意</span>
        <a href="/static/pdf/cpxy.pdf" target="_blank">《版权素材授权委托代理协议》</a>
      </div>
    </div>

    <div class="sure-button" @click="nextProgress">下一步</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isAgreeCustom: false,
      isAgreeProtocol: false,
      isShowDialog: false
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    cardStatus: function() {
      try {
        return this.loginUser.user_data.card_status
      } catch (e) {
        return '0'
      }
    },
    companyStatus: function() {
      try {
        return this.loginUser.user_data.company_status
      } catch (e) {
        return '0'
      }
    },
    status: function() {
      if (this.cardStatus == '0') {
        if (this.companyStatus == '0') {
          return '0'
        } else {
          return this.companyStatus
        }
      } else {
        return this.cardStatus
      }
    }
  },
  methods: {
    cancelDialog() {
      this.isShowDialog = false
    },
    async nextProgress() {
      if (!this.isLogin) {
        this.$store.commit('isShowLoginDialog', true)
        return
      }

      if (this.status == '3') {
        this.$toast.notice('您已经签约，无需再次签约')
        return
      }

      const data = { type: '6' }

      if (this.$route.name == 'user-id') {
        data.user_id = this.$route.params.id
      } else {
        data.name = this.$route.params.name
      }

      const res = await this.$apiFactory.getMediaApi().originList(data, {})

      if (res.data.out === '1') {
        if (res.data.data.length >= 10) {
          if (!this.isAgreeProtocol) {
            this.$toast.warn('您还没有同意供稿人协议')
            return
          }

          this.$emit('updateProgress', {
            nextIndex: 1,
            form: {
              type: this.isAgreeCustom ? '1' : '0'
            }
          })
        } else {
          this.$toast.warn('请先上传至少10张作品，才能签约')
        }
      } else {
        this.$toast.warn('请先上传至少10张作品，才能签约')
      }
    }
  }
}
</script>
<style scoped>
.title {
  font-size: 1.4rem;
  text-align: center;
  padding-bottom: 30px;
}
.apply-notes {
  box-sizing: border-box;
  width: 500px;
  margin-top: 60px;
  padding: 30px 25px;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  margin-left: calc(50% - 250px);
  margin-left: -moz-calc(50% - 250px);
  margin-left: -webkit-calc(50% - 250px);
}

.rule {
  margin-bottom: 16px;
  font-size: 16px;
  padding-left: 15px;
  color: rgba(0, 0, 0, .7);
  line-height: 1.5;
}

.authDocument {
  padding-left: 15px;
  margin-bottom: 15px;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
  color: #57cb8f;
  line-height: 1.5;
}

.agree {
  display: inline-block;
  margin: 35px 0 0 0px;
  font-size: 16px;
  padding-left: 15px;
}

.agree-custom {
  margin: 16px 0;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  width: 320px;
  position: relative;
}

.agree-custom a {
  right: -85px;
  position: absolute;
  color: #57cb8f;
  cursor: pointer;
}

.agree-protocol {
  width: 410px;
  margin: 16px 0;
  position: relative;
}

.agree-protocol a {
  color: #57cb8f;
  position: absolute;
  right: -2px;
}

.check-box {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 1px;
  background-color: #ffffff;
  border: solid 1px #c8c8c8;
  margin-right: 14px;
  cursor: pointer;
}

.hook {
  width: 9px;
  height: 4px;
  margin: 3px 0 0 3px;
  border-bottom: 2px solid #666;
  border-left: 2px solid #666;
  transform:  rotate(-45deg);
  -ms-transform:  rotate(-45deg); 	/* IE 9 */
  -moz-transform: rotate(-45deg); 	/* Firefox */
  -webkit-transform:  rotate(-45deg); /* Safari 和 Chrome */
  -o-transform: rotate(-45deg); 	/* Opera */
  margin-bottom: 3px;
}

.sure-button {
  width: 450px;
  height: 45px;
  border-radius: 6px;
  background-color: #56cb8f;
  text-align: center;
  line-height: 45px;
  margin: 100px 0 0 calc(50% - 225px);
  cursor: pointer;
  color: #fff;
  font-weight: 100;
  transition: background .3s;
}
.sure-button:hover {
  background-color: #49bb80;
}
.long {
  text-align: justify;
  text-align-last: justify;
  width: 410px;
  word-break: keep-all;
  white-space: nowrap;
}
.agree .tip {
  width: 320px;
  text-align: justify;
  text-align-last: justify;
  word-break: keep-all;
  white-space: nowrap;
}

.dialog {
  height: 220px;
  background: url('./img/bg.png') no-repeat;
  position: absolute;
  background-size: contain;
  z-index: 10;
  padding: 30px 40px;
  top: -274px;
  left: 212px;
}

.dialog div {
  margin-top: 16px;
  width: 400px;
  line-height: 1.6;
}

.dialog a {
  color: #57cb8f;
  position: relative;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all .4s;
}

.dialog-fade-enter,
.dialog-fade-leave-active {
  transform: translateY(-20px);
  opacity: 0;
}
</style>

