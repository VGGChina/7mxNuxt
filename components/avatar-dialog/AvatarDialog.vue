<template>
  <transition name="avatar-dialog-fade">
    <div
      class="avatar-dialog-container"
      @click.stop
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >

      <div class="author">
        <a :href="userRef" target="_blank">
          <div
            class="avatar"
            :style="{
              background: 'url(' + ($utilHelper.getCompressionUrl(myUserData.avatar, 200, 200) || require('~/assets/img/avatar-default.svg')) + ') no-repeat'
            }"
          />
        </a>

        <div class="name">
          <a :href="userRef" target="_blank" @click.stop>
            {{ myUserData.name }}
          </a>
          <div>{{ myUserData.userStat.followNum }}名追随者</div>
        </div>

        <div
          class="follow"
          :class="myUserData.followOrNot ? 'followed' : 'not-follow'"
          @click.stop.prevent="follow()"
        >
          {{ myUserData.followOrNot ? '已关注' : '关注' }}
        </div>
      </div>

      <div class="images">
        <loading
          v-if="isFetching"
          style="padding: 0px; margin-top: 30px"
          :is-loading="isFetching"
          :loading-color="'#000'"
        />

        <div
          v-if="!isFetching && mediaList.length < 1"
          class="no-works"
        >
          这个人很懒，还没上传过作品 ~
        </div>

        <a v-for="(img, index) in mediaList" :key="index" :href="'/photo/' + img.id" target="_blank" @click.stop>
          <div
            :style="{
              background: 'url(' + img.image + ') no-repeat'
            }"
          />
        </a>
      </div>
    </div>
  </transition>
</template>

<script>
import loading from '~/components/loading/Loading'

export default {
  components: {
    loading
  },
  props: {
    userData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isFetching: false,
      isFollow: false,
      mediaList: [],
      myUserData: {}
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
    userRef() {
      return this.$utilHelper.toUserPage(this.myUserData)
    }
  },

  created() {
    this.myUserData = JSON.parse(JSON.stringify(this.userData))
  },

  mounted() {
    this.getMediaList()
  },

  methods: {

    async getMediaList() {
      const data = {
        userId: this.myUserData.id
      }
      this.isFetching = true
      const res = await this.$axios.userService.userDetail(data)
      this.mediaList = res.data.mediaList
      this.isFetching = false
    },

    async follow(user) {
      if (this.userId === 0) return
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      // 关注
      const data = {
        to: this.myUserData.id
      }
      // 关注
      if (!this.myUserData.followOrNot) {
        this.$axios.userService.follow(data).then(res => {
          this.myUserData.followOrNot = !this.myUserData.followOrNot
        }).catch(e => {
          this.$toast.warn(e)
        })
      } else { // 取消关注
        this.$axios.userService.unfollow(data).then(res => {
          this.myUserData.followOrNot = !this.myUserData.followOrNot
        }).catch(e => {
          this.$toast.warn(e)
        })
      }
    },

    onMouseEnter() {
      if (this.enter) {
        this.enter()
      }
    },

    onMouseLeave() {
      if (this.leave) {
        this.leave()
      }
    }
  }
}
</script>

<style scoped>
.avatar-dialog-fade-enter-active,
.avatar-dialog-fade-leave-active {
  transition: all .5s;
}

.avatar-dialog-fade-enter,
.avatar-dialog-fade-leave-active {
  opacity: 0 !important;
  transform: translate3d(0px, 20px, 0) !important;
}

.avatar-dialog-container {
  z-index: 3;
  width: 380px;
  height: 240px;
  background-color: #fff;
  border-radius: 8px;
  background: url('./img/bg1.png') no-repeat;
  background-size: contain;
  transition: all .3s;
}

.array {
  width: 40px;
  height: 50px;
  background: transparent;
  position: absolute;
  transform: translate3d(24px, -26px, 0);
}

.author {
  display: flex;
  align-items: center;
  position: relative;
  margin: 40px 0 0 30px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-size: cover !important;
  background-position: center !important;
  display: inline-block;
  cursor: pointer;
}

.name {
  margin-left: 14px;
  color: rgba(0, 0, 0, .5);
}

.name a {
  color: #000;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
}

.name div {
  opacity: 0.5;
  font-size: 14px;
  color: #000;
  margin-top: 4px;
  text-align: left;
}

.follow {
  display: inline-block;
  position: absolute;
  right: 30px;
  top: 10px;
  width: 80px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all .2s;
}

.follow_loading{
  display: inline-block;
  position: absolute;
  right: 30px;
  top: 10px;
  width: 80px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 15px;
  color: rgba(0, 0, 0, .5);
  cursor: pointer;
}

.follow:hover {
  transition: all .2s;
}

.not-follow {
  color: #fff;
  background: #56cb8f;
}

.not-follow:hover {
  background: #4ab87f;
}

.followed {
  color: rgba(0, 0, 0, .5);
  background: #e6e6e6;
}

.images {
  display: flex;
  width: 316px;
  margin-left: 32px;
  margin-top: 10px;
  justify-content: space-between;
}

.images a {
  background: #f5f5f5;
}

.images div {
  width: 100px;
  height: 82px;
  background-size: cover !important;
  background-position: center !important;
  cursor: pointer;
  overflow: hidden;
}

.no-works {
  position: absolute;
  top: calc(50% + 20px);
  left: calc(50% - 105px);
  color: #000;
  font-size: 14px;
  width: 210px !important;
}
</style>

