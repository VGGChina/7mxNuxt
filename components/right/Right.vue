<template>
  <div class="left-side">
    <div class="works-info">
      <div class="author">
        <a :href="userRef">
          <div
            class="avatar"
            :style="{
              'background-image': 'url(' + (!avatar ? require('~/assets/img/avatar-default.svg') :
              $utilHelper.getCompressionUrl(avatar, 200, 200)) + ')'
            }"
          ></div>
        </a>
        <div class="name-follow">
          <div>
            <a :href="userRef">{{ nick || name }}</a>
          </div>
          <div class="follow-num">{{ fanNum }}名追随者</div>
        </div>
        <div
          v-if="loginUser.id != userId"
          class="follow-button"
          @click="follow"
        >{{ isFollowed ? '已关注' : '关注' }}</div>
      </div>
    </div>
    <div class="popular">
      <div>
        <span class="socre">{{ score }}</span>
        <div class="pulse">
          <img src="./img/pulse.svg" width="20px" height="auto" alt="">&nbsp;&nbsp;最高脉冲指数
        </div>
      </div>
      <div class="likes">
        <div>
          {{ mediaDetail.visit || '0' }}
          <span>浏览</span>
        </div>
        <div>
          {{ mediaDetail.like }}
          <span>喜欢</span>
        </div>
        <div>
          {{ mediaDetail.comment }}
          <span>评论</span>
        </div>
      </div>
    </div>
    <div v-if="mediaDetail.title" class="works-title">《{{ mediaDetail.title }}》</div>
    <div
      class="description"
      @click="isMore = !isMore"
      :class="{ 'no-more-text': !isMore }"
    >{{ mediaDetail.text }}</div>
    <!-- <div class="more-text" @click="isMore = !isMore">{{ isMore ? '收起' : '更多' }}</div> -->
    <div class="category">
      <div>类别</div>
      <div>{{ categoryName }}</div>
    </div>
    <div style="min-height: 235px; width: 250px">
      <div class="iamge-info" v-for="item in mediaExifList" :key="item.key">
        {{ item.label}}：
        <span v-if="!isFetchingExif">{{ item.value.toUpperCase() }}</span>
      </div>
    </div>
    <button
      v-if="!$utilHelper.isEmptyObj(mediaDetail)"
      class="buy-button"
      @click="buyImg"
      :style="{
        color: mediaDetail.check == '1' && mediaDetail.is_channel == '0' ? '#000' : '#fff',
        background: mediaDetail.check == '1' && mediaDetail.is_channel == '0' ? '#fff' : '#56cb8f'
      }"
    >{{ mediaDetail.check == '1' && mediaDetail.is_channel == "0" ? '立即购买' : '我想购买' }}</button>
    <div class="like-collect">
      <div class="like-img" @click="likeImg">{{ isLiked ? '已喜欢' : '喜欢' }}</div>
      <div class="like-img" @click="toCollect">采集</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { axiosGet } from '~/service/factory/axiosFactory';

function isInArray(mediaExifList, key) {
  for (let i = 0; i < mediaExifList.length; i++) {
    if (key === mediaExifList[i].key) {
      return true
    }
  }
  return false
}

function getMediaExifList(mediaExifList, exifData) {
  for (let key in exifData) {
    if (isInArray(mediaExifList, key)) {
      for (let i = 0; i < mediaExifList.length; i++) {
        if (mediaExifList[i].key == key) {
          mediaExifList[i].value = exifData[key].val
        }
      }
    }
  }
  return mediaExifList
}

export default {
  data() {
    return {
      isMore: false,
      isFetchingExif: false
    }
  },
  props: ['mediaDetail', 'mediaExifList'],
  methods: {
    follow() {
      if (!this.isLogin) {
        // 如果没有登录，弹出登录弹窗
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      let user = {
        user_id: this.mediaDetail.user_data.id
      }
      if (this.mediaDetail.user_data.is_follow === '1') {
        this.$axios.userService.unfollow(user).then(res => {
          this.mediaDetail.user_data.is_follow = '0'
          this.mediaDetail.user_data.fan_num--
        })
      } else {
        this.$axios.userService.follow(user).then(res => {
          this.mediaDetail.user_data.is_follow = '1'
          this.mediaDetail.user_data.fan_num++
        })
      }
    },
    likeImg() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      let rqBody = {
        media_id: this.mediaDetail.id
      }
      if (this.mediaDetail.is_like === '1') {
        this.$axios.mediaService.dislike(rqBody).then(res => {
          if (res.data.out === '1') {
            this.mediaDetail.like_num = res.data.data.like_num
            this.mediaDetail.is_like = res.data.data.is_like
          }
        })
      } else {
        this.$axios.mediaService.like(rqBody).then(res => {
          if (res.data.out === '1') {
            this.mediaDetail.like_num = res.data.data.like_num
            this.mediaDetail.is_like = res.data.data.is_like
          }
        })
      }
    },
    toCollect() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      this.$bus.emit('popup-album', {
        show: true,
        media_id: this.mediaDetail.id
      })
    },
    async buyImg() {
      if (this.mediaDetail.check == '1' && this.mediaDetail.is_channel == '0') {
        window.open(
          'https://v.paixin.com/photoplus/' + this.mediaDetail.gaga_id
        )
        return
      }

      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      let neededUserList = []
      let storage = localStorage.getItem('neededUserList')
      if (storage != null) {
        neededUserList = JSON.parse(storage)
      }
      let flag = false,
        index = 0
      neededUserList.forEach((element, i) => {
        if (element.userId == this.loginUser.id) {
          flag = true
          index = i
        }
      })

      if (!flag) {
        this.$store.commit('needed/neededData', {
          isShow: true,
          mediaId: this.mediaDetail.id
        })
      } else {
        let obj = neededUserList[index]
        let rqBody = {
          media_id: this.mediaDetail.id,
          name: obj.name,
          phone: obj.phone,
          qq: obj.qq
        }

        let res = await this.$axios.mediaService.needed(rqBody)

        if (res.data.out == '1') {
          this.$toast.notice('已经收到您的购买意向，我们将尽快联系作者')
        } else {
          this.$toast.warn(res.data.msg)
        }
      }
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    userId() {
      try {
        return this.mediaDetail.user_data.id
      } catch (e) {
        return ''
      }
    },
    avatar() {
      try {
        return this.mediaDetail.user_data.avatar
      } catch (e) {
        return ''
      }
    },
    nick() {
      try {
        return this.mediaDetail.user_data.nick
      } catch (e) {
        return ''
      }
    },
    name() {
      try {
        return this.mediaDetail.user_data.name
      } catch (e) {
        return ''
      }
    },
    fanNum() {
      try {
        return this.mediaDetail.user_data.userStat.followedNum
      } catch (e) {
        return '0'
      }
    },
    categoryName() {
      try {
        return this.mediaDetail.category
      } catch (e) {
        return ''
      }
    },
    isFollowed() {
      try {
        return this.mediaDetail.user_data.is_follow == '1'
      } catch (e) {
        return false
      }
    },
    isLiked() {
      try {
        return this.mediaDetail.is_like == '1'
      } catch (e) {
        return false
      }
    },
    isProduct() {
      try {
        return this.mediaDetail.product == '1'
      } catch (e) {
        return false
      }
    },
    score() {
      return this.mediaDetail.score
    },
    userRef() {
      return this.$utilHelper.toUserPage(this.mediaDetail.user_data)
    }
  },
  watch: {}
}
</script>

<style scoped>
.left-side {
  box-sizing: border-box;
  padding: 0 20px;
  width: 300px;
  min-height: 600px;
}

.works-info {
  color: #fff;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
}

.author {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  width: 100%;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #fff;
  cursor: pointer;
  background-size: cover;
  background-position: center;
}

.name-follow {
  font-size: 16px;
  margin-left: 16px;
  flex: 1;
}

.name-follow :nth-child(1) {
  overflow: hidden;
  max-width: 130px;
  max-height: 19px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
}

.name-follow a {
  cursor: pointer;
  text-decoration: none;
  color: #fff;
}

.follow-num {
  font-size: 14px;
  margin-top: 4px;
  color: rgba(225, 225, 225, 0.5);
}

.follow-button {
  width: 44px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  color: rgba(225, 225, 225, 0.5);
  border: 1px solid rgba(225, 225, 225, 0.5);
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.follow-button:hover {
  color: #fff;
  border: 1px solid #fff;
  transition: all 0.2s;
}

.popular {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-between;
  color: #fff;
  margin-top: 30px;
}

.socre {
  font-size: 45px;
  line-height: 80%;
}

.pulse {
  margin-top: 12px;
  color: rgba(225, 225, 225, 0.5);
  font-size: 14px;
}

.likes {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 4px;
  text-align: right;
  font-size: 14px;
}

.likes span {
  margin-left: 14px;
  color: rgba(225, 225, 225, 0.5);
  font-size: 14px;
  padding-right: 8px;
}

.works-title {
  margin-top: 32px;
  font-size: 20px;
  color: #fff;
  margin-left: -8px;
  word-wrap: break-word;
  word-break: break-all;
}

.description {
  margin-top: 8px;
  color: rgba(225, 225, 225, 0.5);
  font-size: 14px;
  word-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
}

.no-more-text {
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.more-text {
  margin-top: 4px;
  color: rgba(225, 225, 225, 0.5);
  font-size: 14px;
  text-align: right;
  cursor: pointer;
}

.category {
  display: flex;
  display: -webkit-flex;
  background: #313131;
  border-radius: 4px;
  color: #fff;
  height: 40px;
  font-size: 16px;
  align-items: center;
  margin: 24px 0;
}

.category :nth-child(1) {
  flex: 1;
  text-align: left;
  padding-left: 8px;
}

.category :nth-child(2) {
  flex: 1;
  text-align: right;
  padding-right: 8px;
}

.iamge-info {
  width: 257px;
  margin-bottom: 10px;
  color: rgba(225, 225, 225, 0.5);
  font-size: 14px;
  word-wrap: break-word;
  word-break: break-all;
}

.buy-button {
  outline: none;
  border: none;
  width: 100%;
  height: 44px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin: 30px 0 0 0;
  color: #fff;
}

.like-collect {
  display: flex;
  box-sizing: border-box;
  margin-top: 16px;
  justify-content: space-between;
}

.like-img {
  text-align: center;
  color: #fff;
  font-size: 16px;
  color: rgba(225, 225, 225, 0.7);
  transition: color 0.2s;
  border: 1px solid rgba(225, 225, 225, 0.7);
  width: 47%;
  height: 40px;
  border-radius: 6px;
  font-size: 16px;
  line-height: 40px;
  transition: all 0.2s;
}

.like-img:hover {
  color: rgba(225, 225, 225, 0.9);
  border: 1px solid rgba(225, 225, 225, 0.8);
  cursor: pointer;
  transition: all 0.2s;
}
</style>
