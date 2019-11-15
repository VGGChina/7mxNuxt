<template>
  <div class="examin-container">
    <div v-if="status == '0' || status == '1'" class="examining">
      提交完成，审核周期为3个工作日，添加微信咨询进度<br>
      <a href="http://static.7mx.com/basePaixinRequire.pdf" target="_blank" class="reapply-tip">拍信商业图库图片基本要求</a>
    </div>
    <div v-if="status == '3'" class="examine-success">
      您的审核已经通过，可以上架作品到拍信<br>
      如有疑问，请添加微信咨询<br>
      <a href="/static/pdf/shelf-info-1.0.pdf" target="_blank" class="reapply-tip">上架须知</a>
      <a href="http://static.7mx.com/basePaixinRequire.pdf" target="_blank" class="reapply-tip">拍信商业图库图片基本要求</a>
      <div class="reapply" @click="uploadToPaixin">立即上架</div>
    </div>
    <div v-if="status == '2'" class="examine-failed">
      非常抱歉，您的审核没有通过<br>
      <div v-show="cardDetail.remark">原因：{{ cardDetail.remark }}<br></div>
      如有疑问，请添加微信咨询<br><br>
      <a href="http://static.7mx.com/basePaixinRequire.pdf" target="_blank" class="reapply-tip">拍信商业图库图片基本要求</a>
      <div class="reapply" @click="reapply">再次申请</div>
    </div>
    <div>
      <img src="./img/weixin.jpg" width="160px" alt="">
    </div>

  </div>
</template>

<script>

export default {
  props: [
    'formToal'
  ],
  data() {
    return {
      cardDetail: {}
    }
  },
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    },
    phone: function() {
      try {
        return this.formToal.phone
      } catch (e) {
        console.log(e)
      }

      try {
        return this.loginUser.user_data.phone
      } catch (e) {
        console.log(e)
      }

      return ''
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
  mounted() {
    this.getCardDetail()
  },
  methods: {
    reapply() {
      this.$emit('updateProgress', {
        nextIndex: 0,
        form: {}
      })
    },
    async uploadToPaixin() {
      const res = await this.$axios.userService.currentUser()

      if (res.data.out != '1') {
        this.$store.commit('isShowLoginDialog', true)

        return
      }

      this.$store.commit('loginUser', res.data.data)

      setTimeout(() => {
        if (this.status == '3') {
          this.intoOther()
        } else {
          this.$router.push({ name: 'contributor' })
        }
      }, 30)
    },
    async intoOther() {
      const otherRes = await this.$axios.userService.intoOther()

      if (otherRes.data.out == '1') {
        this.loginUser.gaga_id = otherRes.data.data.gaga_id

        this.$store.commit('loginUser', this.loginUser)

        this.$store.commit('isShowUploadPaixinDialog', true)
      } else {
        this.$toast.warn('您的账号信息有问题，请联系客服')
      }
    },
    async getCardDetail() {
      const res = await this.$axios.userService.detailCard()
      if (res.data.out == '1') {
        this.cardDetail = res.data.data
      }
    }
  }
}
</script>

<style scoped>
.examin-container {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.examining {
  display: inline-block;
  font-size: 16px;
  line-height: 1.8;
  text-align: left;
  color: #ffffff;
  margin: 60px 0 0 0;
  margin: 60px 0 0 0;
  margin: 60px 0 0 0;
}

.examine-failed {
  display: inline-block;
  font-size: 16px;
  line-height: 1.8;
  text-align: center;
  color: #ffffff;
  margin: 60px 0 0 0;
  margin: 60px 0 0 0;
  margin: 60px 0 0 0;
}

.examine-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  line-height: 1.8;
  text-align: center;
  color: #ffffff;
  margin: 60px 0 0 0;
  margin: 60px 0 0 0;
  margin: 60px 0 0 0;
}

.reapply {
  width: 60%;
  height: 40px;
  outline: none;
  border: none;
  margin: 0 auto;
  margin-top: 40px;
  border-radius: 6px;
  background-color: #56cb8f;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}

.reapply-tip {
  text-align: center;
  margin-top: 16px;
  font-size: 16px;
}

img {
  margin-left: calc(50% - 80px);
  margin-top: 60px;
}
</style>

