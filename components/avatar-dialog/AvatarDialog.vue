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
              background: 'url(' + (dataUtilHelper.getCompressionUrl(userData.avatar, 200, 200) || require('~/assets/img/avatar-default.svg')) + ') no-repeat'
            }"
          />
        </a>

        <div class="name">
          <a :href="userRef" target="_blank" @click.stop>
            {{ userData.nick || userData.name }}
          </a>
          <div>{{ userData.fan_num || '0' }}名追随者</div>
        </div>

        <div
          class="follow"
          :class="{
            'followed': userData.is_follow == '1',
            'not-follow': userData.is_follow == '0'
          }"
          @click.stop.prevent="follow(userData)"
        >
          {{ userData.is_follow == '0' ? '关注' : '已关注' }}
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
          v-if="!isFetching && imgList.length < 1"
          class="no-works"
        >
          这个人很懒，还没上传过作品 ~
        </div>

        <a v-for="(img, index) in imgList" :key="index" :href="'/photo/' + img.id" target="_blank" @click.stop>
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
import { mapGetters } from 'vuex'
import apiFactory from '~/api/factory/apiFactory.js'
import utilHelper from '~/utils/utils.js'
import loading from '~/components/loading/Loading'

export default {
  components: {
    loading
  },
  props: [
    'userData',
    'enter',
    'leave'
  ],
  data() {
    return {
      imgList: [],
      isFetching: false,
      dataUtilHelper: utilHelper
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const rqBody = { type: '6', user_id: this.eputUserId }
      const params = { line: '', limit: 3 }

      this.isFetching = true
      // const res = await apiFactory.getMediaApi().originList(rqBody, params)
      const data = {
        url: '/api/media/origin_list',
        data: rqBody,
        params: params
      }
      const res = await this.$axios(data)
      if (res.data.out == '1') {
        this.imgList.push(...res.data.data)
      }
      this.isFetching = false
    },
    follow(user) {
      if (!this.isLogin) {
        // 如果没有登录，弹出登录弹窗
        this.$store.commit('isShowLoginDialog', true)
        return
      }
      var rqBody = {
        user_id: this.eputUserId
      }
      if (user.is_follow === '1') {
        apiFactory.getUserApi().unfollow(rqBody).then(res => {
          if (res.data.out == '1') {
            user.is_follow = '0'
          }
        })
      } else {
        apiFactory.getUserApi().follow(rqBody).then(res => {
          if (res.data.out == '1') {
            user.is_follow = '1'
          }
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
  },
  computed: {
    ...mapGetters([
      'isLogin'
    ]),
    eputUserId() {
      let eputUserId = ''

      if (typeof this.userData.gaga_id !== 'undefined' && this.userData.gaga_id != null && this.userData.gaga_id.length > 0) {
        eputUserId = this.userData.id
      }

      if (typeof this.userData.eput_id !== 'undefined' && this.userData.eput_id != null && this.userData.eput_id.length > 0) {
        eputUserId = this.userData.eput_id
      } else {
        eputUserId = this.userData.id
      }

      return eputUserId
    },
    userRef() {
      return utilHelper.toUserPage(this.userData)
    }
  },
  watch: {
    'userData': function(val) {
      this.imgList = []
      this.fetchData()
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

