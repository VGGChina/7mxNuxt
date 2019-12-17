<template>
  <div class="photographers">
    <div v-for="(item, index) in userList" :key="index" class="photographer-item">
      <div class="user">
        <a :href="$utilHelper.toUserPage(item)" style="height: 148px;">
          <div
            class="avatar"
            :style="{
              background: 'url(' + ($utilHelper.getCompressionUrl(item.avatar, 300, 300) || require('~/assets/img/avatar-default.svg')) + ')'
            }"
          />
        </a>

        <div class="user-info">
          <div class="name">{{ item.nick || item.name }}</div>
          <div
            class="follow"
            :class="{
              'followed': item.is_follow == '1',
              'not-follow': item.is_follow == '0'
            }"
            @click="follow(item)"
          >
            {{ item.is_follow == '0' ? '关注' : '已关注' }}
          </div>
          <!-- <div class="instruction">{{ item.user_data.about || '这个人很懒，什么也没留下~~~' }}</div> -->
          <div class="instruction">{{ '这个人很懒，什么也没留下~~~' }}</div>
        </div>
      </div>

      <div class="images">
        <a
          v-for="(img, index) in (!item.mediaList ? [] : item.mediaList)"
          v-if="index < 3"
          :key="index"
          :href="'/photo/' + img.id"
          target="_blank"
        >
          <div
            :style="{
              background: 'url(' + $utilHelper.getCompressionUrl(img.image) + ') no-repeat'
            }"
            width="242px"
            height="148px"
            alt=""
          />
        </a>

        <div
          v-for="(i, index_1) in new Array(3 - getMediasLength(item.medias))"
          v-if="getMediasLength(item.medias) > 0"
          :key="'images' + index_1"
          class="placeHolder"
          width="242px"
          height="148px"
        >
          <div class="nothing">无</div>
        </div>

        <div
          v-if="getMediasLength(item.medias) < 1"
          class="no-images"
        >
          这个人很懒，还没发布过作品~~~
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'userList'
  ],
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    }
  },
  methods: {
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
        this.$axios.userService.unfollow(rqBody)
          .then(res => {
            if (res.data.out === '1') {
              user.is_follow = '0'
            }
          })
      } else {
        this.$axios.userService.follow(rqBody)
          .then(res => {
            if (res.data.out === '1') {
              user.is_follow = '1'
            }
          })
      }
    },
    getMediasLength(medias) {
      try {
        return medias.length
      } catch (e) {
        return 0
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.photographers {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.photographer-item {
  margin: 26px 0px;
  display: -webkit-flex;
  display: flex;
  max-width: 1200px;
  height: 140px;
}

.user {
  display: flex;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: inline-block;
  background-size: cover !important;
  background-position: center !important;
}

.user-info {
  width: 240px;
  height: 140px;
  display: inline-block;
  position: relative;
  margin-left: 28px;
}

.name {
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
}

.instruction {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 15px;
  max-height: 58px;
  color: rgba(0, 0, 0, .7);
  margin-top: 4px;
}

.follow {
  display: inline-block;
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 80px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all .2s;
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
  background: #51c388;
}

.followed {
  color: rgba(0, 0, 0, .5);
  background: #e6e6e6;
}

.followed:hover {
  box-shadow: 0px 0px 8px  rgba(230, 230, 230, .8);
}

.images {
  display: flex;
  display: -webkit-flex;
  margin-left: 32px;
  min-width: 738px;
  position: relative;
}

.images a {
  margin-left: 4px;
  background: #f5f5f5;
  height: 140px;
}

.images div {
  width: 242px;
  height: 140px;
  background-size: cover !important;
  background-position: center !important;
  cursor: pointer;
  overflow: hidden;
}

.images .no-images {
  box-sizing: border-box;
  padding: 0 16px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 15px;
  border: dotted 2px #e8e8e8;
  width: 100%;
  height: 100%;
  line-height: 140px;
  cursor: default;
}
.placeHolder {
  margin-left: 4px;
  opacity: .5;
  box-sizing: border-box;
  border: dotted 2px #e2e2e2;

  cursor: default !important;
  .nothing {
    height: 100%;
    opacity: .6;
    line-height: 140px;
    transition: all 1s;
    background: rgba(0, 0, 0, .08);
    cursor: default !important;
    text-align: center;
  }
}
</style>

