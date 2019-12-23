<template>
  <div style="height: 55px;">
    <div
      id="user-home-nav"
      :class="{
        'user-home-nav-fixed': isFixed,
        'user-home-nav-relative': !isFixed
      }"
    >
      <div class="navs">
        <span
          v-for="(item, index) in options"
          v-if="index !== 2 || loginUser.id === userInfo.id"
          :key="index"
          :class="{ 'option-selected': index == currentIndex }"
          @click="onOptionClicked(index)"
        >
          {{ item.name + ' ' + item.num }}
        </span>
      </div>

      <transition name="user-follow-fade">
        <div
          v-if="isFixed"
          class="user-follow"
        >
          <div
            class="avatar"
            :style="{
              background: 'url(' + (userInfo.avatar || require('~/assets/img/avatar-default.svg')) + ') no-repeat'
            }"
          />

          <div class="name">{{ userInfo.nick || userInfo.name }}</div>

          <div
            v-if="loginUser.id != userInfo.id"
            class="follow"
            :class="{
              'followed': userInfo.is_follow == '1',
              'not-follow': userInfo.is_follow == '0'
            }"
            @click.stop.prevent="follow(userInfo)"
          >
            {{ userInfo.is_follow == '0' ? '关注' : '已关注' }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'userInfoHeight',
    'userInfo',
    'isLoading'
  ],
  data() {
    return {
      options: [{
        name: '作品',
        num: '',
        id: 0
      }, {
        name: '商店',
        num: '',
        id: 1
      }, {
        name: '上架审核',
        num: '',
        id: 2
      }, {
        name: '喜欢',
        num: '',
        id: 3
      }, {
        name: '灵感集',
        num: '',
        id: 4
      }, {
        name: '标签',
        num: '',
        id: 5
      }],
      currentIndex: 0
    }
  },
  computed: {
    winPageYOffset() {
      return this.$store.state.window.winPageYOffset
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    isFixed() {
      if (this.winPageYOffset >= this.userInfoHeight - 60) {
        return true
      }
      return false
    }
  },
  watch: {
    userInfo(val) {
      if (this.$utilHelper.isEmptyObj(val)) {
        return
      }
      this.options[0].num = val.userStat.mediaNum !== 0 ? val.userStat.mediaNum : ''
      this.options[1].num = val.userStat.mediaNum - val.userStat.freeMediaNum !== 0 ? val.userStat.mediaNum - val.userStat.freeMediaNum : ''
      this.options[2].num = val.userStat.checkingNum === 0 ? '' : val.userStat.checkingNum
      this.options[3].num = val.userStat.likeNum !== 0 ? val.userStat.likeNum : ''
    }
  },
  created() {
    if (this.$utilHelper.isEmptyObj(this.userInfo)) {
      return
    }
  },
  methods: {
    onOptionClicked(index) {
      if (this.currentIndex === index || this.isLoading) {
        return
      }

      this.currentIndex = index
      this.$bus.$emit('user-home-nav-index', index)
    },
    follow(user) {
      if (!this.isLogin) {
        // 如果没有登录，弹出登录弹窗
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      var rqBody = {
        user_id: user.id
      }
      if (user.is_follow === '1') {
        this.$axios.userService.unfollow(rqBody).then(res => {
          if (res.data.out == '1') {
            user.is_follow = '0'
          }
        })
      } else {
        this.$axios.userService.follow(rqBody).then(res => {
          if (res.data.out == '1') {
            user.is_follow = '1'
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#user-home-nav {
  display: flex;
  justify-content: center;
  border-bottom: solid 1px #e5e5e5;
  padding: 16px 0;
  background: #fff;
  width: 100%;
  background: rgba(255, 255, 255, .97);
  z-index: 1;
}

.user-home-nav-fixed {
  top: 60px;
  left: 0;
  position: fixed;
  z-index: 10;
}

.user-home-nav-relative {
  position: relative;
}

.navs {
  span {
    color: rgba(0, 0, 0, .6);
    transition: color .2s;
    margin: 0 16px;

    &:hover {
      color: rgba(0, 0, 0, 1);
      transition: color .2s;
      cursor: pointer;
    }
  }
}

.option-selected {
  color: #000 !important;
}

.user-follow {
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-size: cover !important;
    background-position: center !important;
    display: inline-block;
    cursor: pointer;
    margin-left: 20px;
  }

  .name {
    margin-left: 14px;
    color: rgba(0, 0, 0, .5);
  }

  .follow {
    width: 76px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    margin-left: 16px;
    border-radius: 4px;
    font-size: 14px;
    color: #1a1a1a;
    cursor: pointer;
    transition: all .2s;
  }

  .not-follow {
    color: #fff;
    background: #56cb8f;
    &:hover {
      background: #4fc085;
    }
  }

  .followed {
    color: rgba(0, 0, 0, .5);
    background: #e6e6e6;
  }
}

.user-follow-fade-enter-active,
.user-follow-fade-leave-active {
  transition: all .3s;
}

.user-follow-fade-enter,
.user-follow-fade-leave-active {
  opacity: 0;
}
</style>
