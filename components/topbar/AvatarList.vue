
<template>
  <transition name="show-list">
    <div v-show="isShowList && isLogin" id="perslist">
      <div class="array_wrap">
        <div class="array" />
      </div>

      <ul>
        <li>
          <router-link :to="userRef" class="link">我的主页</router-link>
        </li>
        <li>
          <router-link to="/income" class="link">收益中心</router-link>
        </li>
        <li @click="uploadToPaixin">上架商品</li>
        <li>
          <router-link to="/ulike" class="link">喜欢</router-link>
        </li>
        <li @click="toFirends">
          <router-link :to="'/friends/' + (loginUser&&loginUser.id || '') + '/0'" class="link">好友</router-link>
        </li>
        <li @click="$store.commit('isShowSettingDialog', true)">设置</li>
        <div class="loginout" @click="logout">退出</div>
      </ul>
    </div>
  </transition>
</template>

<script>
import apiFactory from '~/api/factory/apiFactory.js'
import utilHelper from '~/utils/utils.js'

export default {
  props: ['isShowList'],
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
    },
    userRef() {
      return utilHelper.toUserPage(this.loginUser)
    }
  },
  methods: {
    toUser() {
      this.$router.push({
        name: 'user-home',
        params: {
          name: this.loginUser.name
        }
      })
    },
    toFirends() {
      this.$router.push({
        name: 'friends',
        params: {
          id: this.loginUser && this.loginUser.id
        }
      })
    },
    toUserLike() {
      this.$router.push({
        name: 'ulike'
      })
    },
    toContributor() {
      this.$router.push({
        name: 'contributor'
      })
    },
    logout() {
      apiFactory.getUserApi().logout().then(res => {
        if (res.data.out === '1') {
          this.$store.commit('loginUser', {})
          this.$router.push({
            name: 'index'
          })
        } else {
          // this.$toast.warn(res.data.msg)
        }
      })
    },
    async uploadToPaixin() {
      const res = await apiFactory.getUserApi().currentUser()

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
      const otherRes = await apiFactory.getUserApi().intoOther()

      if (otherRes.data.out == '1') {
        this.loginUser.gaga_id = otherRes.data.data.gaga_id

        this.$store.commit('loginUser', this.loginUser)

        this.$store.commit('isShowUploadPaixinDialog', true)
      } else {
        this.$toast.warn('您的账号信息有问题，请联系客服')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.show-list-enter-active,
.show-list-leave-active {
  transition: all 0.3s;
}

.show-list-enter,
.show-list-leave-active {
  opacity: 0 !important;
  transform: translate3d(-72px, 40px, 0) !important;
}

#perslist {
  position: absolute;
  z-index: 10;
  transform: translate3d(-72px, 20px, 0);
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
}

.array_wrap {
  width: 70px;
  height: 30px;
  top: -26px;
  right: 0px;
  position: absolute;
  overflow: hidden;
  .array {
    background: #fff;
    width: 20px;
    height: 20px;
    transform: translate(-50%, 10px) rotate(45deg);
    border-radius: 4px;
    position: absolute;
    left: 40px;
    top: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  }
}

#perslist ul {
  font-size: 0.9rem;
  line-height: 1.8;
  padding: 0;
}

#perslist ul li {
  cursor: pointer;
  color: #000;
  width: 80px;
  list-style-type: none;
  margin-top: 10px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

#perslist ul li:hover {
  opacity: 1;
  transition: opacity 0.2s;
}

.link {
  color: #000;
}

.loginout {
  border-top: solid 24px transparent;
  opacity: 0.7;
  cursor: pointer;
  color: #000;
}

.loginout:hover {
  opacity: 1;
}
</style>
