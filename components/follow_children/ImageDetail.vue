<template>
  <div>
    <div
      v-if="tableIndex == 0 && index == (imgList.length > 10 ? 10 : 5)"
      class="refresh"
      @click="$emit('refreshClicked')"
    >
      {{ imgList.length > 20 ? '上次看到这里，点击刷新' : '点击刷新' }}
    </div>

    <div :id="'userFollowItem' + imgDetail.id" class="img-detail">
      <div class="author">
        <a
          :href="userRef"
          target="_blank"
        >
          <div
            class="avatar"
            :style="{
              background: 'url(' +
                ($utilHelper.getCompressionUrl(imgDetail.avatar, 200, 200) ||
                  require('~/assets/img/avatar-default.svg')) + ') no-repeat'
            }"
            @mouseenter="isShowAvatarDialog = true"
            @mouseleave="isShowAvatarDialog = false"
          >

            <avatar-dialog
              v-if="isShowAvatarDialog"
              class="avatar-dialog"
              :user-data="imgDetail"
            />
          </div>
        </a>

        <div class="name">
          <a
            :href="userRef"
            target="_blank"
            @mouseenter="isShowAvatarDialog = true"
            @mouseleave="isShowAvatarDialog = false"
          >
            {{ imgDetail.nickname || '7mx摄影师' }}
          </a>

          <!-- <div class="time">发布于{{ $utilHelper.getOldTime(imgDetail.dateline) }}</div> -->
        </div>
      </div>

      <div class="buttons-container">
        <div
          class="buttons like"
          :style="{
            background: imgDetail.is_like == '0' ? '#fff' : '#F24C4C'
          }"
          @click="likeImg"
        >
          <img
            :src="imgDetail.is_like == '0' ?
              require('./img/likeRed.svg') :
              require('./img/like.svg')"
            width="24px"
            alt=""
          >
          <span :style="{ color: imgDetail.is_like == '0' ? 'rgba(26,26,26, .6)' : '#fff' }">{{ imgDetail.like_num }}</span>
        </div>

        <div class="buttons buy" @click="buyImg">
          <img src="./img/shoppingCart.svg" width="20px" alt="">
        </div>

        <div class="buttons caiji" @click="toCollect">采集</div>

        <div
          v-if="tableIndex == 0"
          class="buttons caiji"
          @click.stop="isShowMore = !isShowMore"
        >
          更多
        </div>

        <transition name="dynamic-filter-fade">
          <div
            v-if="isShowMore"
            class="dynamic-filter"
            @click.stop="stopCilck"
          >
            <div class="array">
              <div />
            </div>

            <div>选择以下理由减少推荐</div>

            <div
              v-for="(item, index2) in filterOptions"
              v-if="item.content"
              :key="index2"
              class="option"
              :style="{
                color: selectedOptionId == item.id ? '#4cbc82' : '',
                borderColor: selectedOptionId == item.id ? '#4cbc82' : ''
              }"
              @click="selectedOptionId = item.id"
            >
              {{ item.content }}
            </div>

            <button @click="dynamicFilter()">确定</button>
          </div>
        </transition>
      </div>

      <div
        class="img-container"
      >
        <a :href="'/photo/' + imgDetail.id" target="_blank">
          <div
            class="image-mask"
            @mouseenter="isEnter = true"
            @mouseleave="isEnter = false"
          />
        </a>
        <img :src="imgDetail.image" :width="imageWidth" alt="">
        <transition name="score-fade">
          <div v-if="isEnter" class="score">{{ $utilHelper.score(imgDetail) }}</div>
        </transition>
      </div>

      <div class="img-text-content">
        <h3>{{ imgDetail.title == '' ? '' : '《' }}{{ imgDetail.title }}{{ imgDetail.title == '' ? '' : '》' }}</h3>
        <div>
          <p
            ref="userFollowImgText"
            :class="{
              'over-hidden': !isMore
            }"
            :style="{
              'max-width': !isMore ? imageWidth - 80 + 'px' : imageWidth + 'px'
            }"
          >
            {{ imgDetail.text }}
            <span v-if="isOver && isMore" @click.stop="isMore = false">隐藏</span>
          </p>

          <div v-if="isOver && !isMore" @click.stop="isMore = true">阅读更多</div>
        </div>
      </div>

      <comments
        :img-detail="imgDetail"
        :comment-list="commentList"
        :index="index"
        :style="{
          'max-width': this.imageWidth + 'px',
          'margin-top': '8px'
        }"
      />
    </div>
  </div>
</template>

<script>
import AvatarDialog from '~/components/avatar-dialog/AvatarDialog'
import Comments from './Comments'

export default {
  components: {
    AvatarDialog,
    Comments
  },
  props: [
    'imgDetail',
    'imgList',
    'tableIndex',
    'index'
  ],
  data() {
    return {
      isEnter: false,
      reply: '',
      isShowAvatarDialog: false,
      maxWidth: 1500,
      imageWidth: 800,
      isMore: false,
      isOver: false,
      commentList: [],
      isFetching: false,
      isFetchCommentData: false,
      isShowMore: false,
      filterOptions: [],
      selectedOptionId: -1
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    onresizeFlag() {
      return this.$store.state.window.onresizeFlag
    },
    winPageYOffset() {
      return this.$store.state.window.winPageYOffset
    },
    userRef() {
      return this.$utilHelper.toUserPage(this.imgDetail.user_data)
    }
  },
  watch: {
    'onresizeFlag': function(val) {
      this.init()
    },
    'winPageYOffset': function(val) {
      const h = this.$utilHelper.viewportSize().height
      const dom = document.getElementById('userFollowItem' + this.imgDetail.id).getBoundingClientRect()
      if (!this.isFetchCommentData && !this.isFetching && dom.top < h && dom.top > -dom.height) {
        this.fetchCommentData()

        this.$emit('lookedImage', this.imgDetail)
      }
    }
  },
  created() {
    if (this.index < 2) {
      this.fetchCommentData()
    }

    this.$bus.on('cancel', e => {
      this.isShowMore = false

      this.selectedOptionId = -1
    })

    this.filterOptions.push(...[{
      id: 0,
      content: '#' + this.getFollowTagName() + '#的推荐',
      tag: this.getFollowTag()
    }, {
      id: 1,
      content: '屏蔽作者：' + (this.imgDetail.nickname || '7mx摄影师')
    }, {
      id: 2,
      content: '内容太水/重复'
    }])
    this.init()
  },
  methods: {
    stopCilck() {
      // no use
    },
    init() {
      const bodyWidth = document.body.clientWidth
      if (bodyWidth <= this.maxWidth) {
        this.imageWidth = 800
      } else {
        this.imageWidth = 1200
      }
      this.$nextTick(() => {
        if (this.$refs.userFollowImgText.clientWidth >= this.imageWidth - 80) {
          this.isOver = true
        } else {
          this.isOver = false
        }
      })
    },
    async fetchCommentData() {
      if (this.isFetchCommentData || this.isFetching) {
        return
      }
      const rqBody = {
        media_id: this.imgDetail.id
      }
      const params = {
        limit: '2'
      }
      this.isFetching = true
      const res = await this.$axios.mediaService.commentList(rqBody, params)

      if (res.data.out === '1') {
        this.commentList = res.data.data
        this.isFetchCommentData = true
      } else if (res.data.line === 'end') {
        this.isFetchCommentData = true
      }

      setTimeout(() => {
        this.isFetching = false
      }, 500)
    },
    async buyImg() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      if (this.imgDetail.check == '1') {
        window.open('https://v.paixin.com/photoplus/' + this.imgDetail.gaga_id)
        return
      }

      let neededUserList = []
      const storage = localStorage.getItem('neededUserList')
      if (storage != null) {
        neededUserList = JSON.parse(storage)
      }
      let flag = false
      let index = 0
      neededUserList.forEach((element, i) => {
        if (element.userId == this.loginUser.id) {
          flag = true
          index = i
        }
      })

      if (!flag) {
        this.$store.commit('needed/neededData', {
          isShow: true,
          mediaId: this.imgDetail.id
        })
      } else {
        const obj = neededUserList[index]
        const rqBody = {
          media_id: this.imgDetail.id,
          name: obj.name,
          phone: obj.phone,
          qq: obj.qq
        }

        const res = await this.$axios.mediaService.needed(rqBody)

        if (res.data.out === '1') {
          this.$toast.notice('已经收到您的购买意向，我们将尽快联系作者')
        } else {
          this.$toast.warn(res.data.msg)
        }
      }
    },
    async likeImg() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      const reBody = { media_id: this.imgDetail.id }
      if (this.imgDetail.is_like === '1') {
        const res = await this.$axios.mediaService.dislike(reBody)
        if (res.data.out === '1') {
          this.imgDetail.like_num = res.data.data.like_num
          this.imgDetail.is_like = res.data.data.is_like
        }
      } else {
        const res = await this.$axios.mediaService.like(reBody)
        if (res.data.out === '1') {
          this.imgDetail.like_num = res.data.data.like_num
          this.imgDetail.is_like = res.data.data.is_like
        }
      }
    },
    toCollect() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      this.$bus.emit('popup-album', { show: true, media_id: this.imgDetail.id })
    },
    getFollowTagName() {
      try {
        const len = this.imgDetail.tag_list.length

        for (let i = 0; i < len; i++) {
          const tag = this.imgDetail.tag_list[i]

          if (tag.is_follow == '1') {
            if (tag.name.length >= 10) {
              const name = tag.name.substring(0, 6) + '...' +
                tag.name.substring(tag.name.length - 3, tag.name.length)

              return name
            }
            return tag.name
          }
        }

        return this.imgDetail.tag_list[0].name
      } catch (e) {
        return ''
      }
    },
    getFollowTag() {
      try {
        const len = this.imgDetail.tag_list.length

        for (let i = 0; i < len; i++) {
          const tag = this.imgDetail.tag_list[i]

          if (tag.is_follow == '1') {
            return tag
          }
        }

        return this.imgDetail.tag_list[0]
      } catch (e) {
        return {}
      }
    },
    async unfollowTag() {
      const tag = this.filterOptions[this.selectedOptionId].tag

      if (this.$utilHelper.isEmptyObj(tag)) {
        this.$toast.warn('出错了，请稍后再试')

        return
      }

      const res = await this.$axios.tagService.unfollowTag({ 'tag_id': tag.id })
      if (res.data.out > 0) {
        location.reload()
      }
    },
    async unfollowUser() {
      const res = await this.$axios.userService.unfollow({ user_id: this.imgDetail.user_data.id })

      if (res.data.out > 0) {
        location.reload()
      }
    },
    async dynamicDropMedia() {
      const res = await this.$axios.mediaService.dynamicDrop({ media_id: this.imgDetail.id })

      if (res.data.out > 0) {
        this.isShowMore = false

        this.selectedOptionId = -1

        this.imgList.splice(this.index, 1)
      }
    },
    dynamicFilter() {
      switch (this.selectedOptionId) {
        case 0:
          this.unfollowTag()
          break
        case 1:
          this.unfollowUser()
          break
        case 2:
          this.dynamicDropMedia()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.img-detail {
  position: relative;
  margin-bottom: 46px;
}

.refresh {
  width: 100%;
  color: rgba(26, 26, 26, 0.6);
  height: 40px;
  border: solid 1px #cecece;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 48px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background .2s;

  img {
    margin-left: 8px;
  }

  &:hover {
    background: rgba(26, 26, 26, 0.05);
    transition: background .2s;
  }
}

.author {
  display: flex;
  align-items: center;
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover !important;
  background-position: center !important;
  display: inline-block;
  cursor: pointer;
}

.avatar-dialog {
  position: absolute;
  top: 34px;
  left: -24px;
  z-index: 3;
}

.name {
  margin-left: 10px;
  margin-bottom: 6px;
  a {
    color: #000;
  }

  .time {
    font-size: 12px;
    color: rgba(26,26,26, .6);
  }
}

.buttons-container {
  display: flex;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 0;
}

.buttons {
  width: 56px;
  height: 32px;
  text-align: center;
  border-radius: 4px;
  border: solid 1px #ddd;
  cursor: pointer;
  font-size: 14px;
  margin-left: 16px;
  color: rgba(26, 26, 26, .6);
  transition: all .2s;

  img {
    opacity: .5;
    transition: all .2s;
  }

  &:hover {
    color: rgba(26, 26, 26, 1);
    border: 1px solid rgba(0, 0, 0, .3);
    img {
      opacity: 1;
    }
  }
}

.buy img {
  margin-top: 7px;
}

.caiji {
  line-height: 34px;
  font-size: 14px;
}

.like {
  width: auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;

  span {
    margin-left: 8px;
  }

  img {
    opacity: 1;
  }
}

.dynamic-filter-fade-enter-active,
.dynamic-filter-fade-leave-active {
  transition: all .4s;
}

.dynamic-filter-fade-enter,
.dynamic-filter-fade-leave-active {
  transform: translateY(16px);
  opacity: 0;
}

.dynamic-filter {
  max-width: 220px;
  padding: 16px;
  position: absolute;
  z-index: 3;
  top: 54px;
  right: -10px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0px 32px 0 rgba(0, 0, 0, 0.15);
  text-align: center;
  font-size: 14px;

  .array {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 0;
    right: 22px;
    margin-top: -30px;
    background: transparent;
    overflow: hidden;

    div {
      width: 20px;
      height: 20px;
      background: #fff;
      transform: rotate(-45deg);
      margin-top: 26px;
      margin-left: 4px;
      box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.09);
    }
  }

  .option {
    padding: 0 8px;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    text-align: center;
    line-height: 48px;
    margin: 14px 0 0 0;
    border-radius: 8px;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: solid 1px #ddd;
    color: #979797;
    transition: all .2s;
    font-size: 14px;

    &:hover {
      border: solid 1px rgba(76, 188, 130, 0.8);
      color: rgba(76, 188, 130, 0.8);
      transition: all .2s;
    }
  }

  button {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    background-color: #57cb8f;
    margin: 14px 0 0 0;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    border: none;
    transition: all .2s;

    &:hover {
      background-color: #4cbc82;
      transition: all .2s;
      box-shadow: 0 0 8px  rgba(76, 188, 130, 0.6);
    }
  }
}

.img-container {
  position: relative;
  margin-top: 14px;
  background-color: #f5f5f5;

  img {
    display: block;
  }
}

.image-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: transparent;
  cursor: pointer;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

img[lazy=loaded] {
  -webkit-animation-duration: .6s;
  animation-duration: .6s;
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

.score-fade-enter-active,
.score-fade-leave-active {
  transition: all .4s;
}

.score-fade-enter,
.score-fade-leave-active {
  transform: translateY(15px);
  opacity: 0;
}

.score {
  position: absolute;
  right: 16px;
  bottom: 12px;
  color: #fff;
  font-size: 44px;
  z-index: 1;
  font-weight: 200;
  letter-spacing: 1px;
}

.img-text-content {
  h3 {
    font-size: 18px;
    color: #000000;
    font-weight: 400;
    line-height: 1;
    padding: 0;
    margin: 16px 0 0 -8px;
  }

  div {
    display: flex;
    align-items: center;
    margin-top: 8px;
    p {
      display: inline;
      line-height: 1.5;
      padding: 0;
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, .7);

      span {
        font-size: 14px;
        color: rgba(0, 0, 0, .5);
        text-decoration: underline;
        cursor: pointer;
        margin-left: 4px;
      }
    }

    div {
      display: inline-block;
      font-size: 14px;
      line-height: 1;
      color: rgba(0, 0, 0, .5);
      text-decoration: underline;
      cursor: pointer;
      margin: 0 0 0 4px;
    }
  }
}

.over-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

