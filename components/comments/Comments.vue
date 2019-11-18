<template>
  <div class="comments-container">
    <div class="comments-editor">
      <textarea v-model="comment" placeholder="回复楼主..." />
      <div class="comment-botton" @click="sendComment(false)">发送</div>
    </div>
    <div class="comments-list">
      <div v-for="(item, index) in commentList" :key="index" class="comment-item">
        <nuxt-link :to="$utilHelper.toUserPage(item.user_data)">
          <div
            class="avatar"
            :style="{
              'backgroundImage': 'url(' + (!item.user_data.avatar ?
                require('~/assets/img/avatar-default.svg') :
                $utilHelper.getCompressionUrl(item.user_data.avatar, 200, 200)) + ')'
            }"
            @mouseenter="avatarMouseenter(index)"
            @mouseleave="avatarMouseleave"
          >
            <avatar-dialog
              v-if="isShowAvatarDialog && currentIndex == index"
              class="avatar-dialog"
              :user-data="item.user_data"
            />
          </div>
        </nuxt-link>
        <div class="comment-detail">
          <div class="user-nick">{{ item.user_data.nick }}</div>
          <div class="comment-content">
            <span v-if="item.to_comment == '1'">
              回复
              <span class="comment-other">{{ item.to_comment_data.user_data.nick }}</span>:
            </span>
            {{ item.content }}
            <span class="reply" @click="onClickReply(index)">回复</span>
          </div>
        </div>
        <transition name="reply-fade">
          <div v-if="index == replyIndex" class="reply-editor">
            <textarea v-model="reply" :placeholder="'回复' + item.user_data.nick + '...'" />
            <div class="reply-botton" @click="sendComment(true, item.id, index)">回复</div>
          </div>
        </transition>
      </div>
    </div>
    <div
      v-if="commentList.length > 0"
      class="more-comments"
      @click="fetchData"
    >{{ line == 'end' ? '没有更多' : '加载更多' }}</div>
  </div>
</template>

<script>
import AvatarDialog from '~/components/avatar-dialog/AvatarDialog'

export default {
  components: {
    AvatarDialog
  },
  props: ['mediaDetail', 'commentList'],
  data: () => ({
    comment: '',
    reply: '',
    // commentList: [],
    replyIndex: -1,
    line: '',
    isFetching: false,
    isShowAvatarDialog: false,
    currentIndex: -1
  }),
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    }
  },
  watch: {
    // 'mediaDetail': function () {
    //   this.fetchData();
    // }
  },
  methods: {
    onClickReply(index) {
      if (this.replyIndex == index) {
        this.replyIndex = -1
      } else {
        this.replyIndex = index
      }
    },
    sendComment(isReply, id, index) {
      if (!this.isLogin) {
        // 如果没有登录，弹出登录弹窗
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      if (isReply && this.reply == '') {
        this.$toast.warn('回复不能为空')
        return
      }
      if (!isReply && this.comment == '') {
        this.$toast.warn('评论不能为空')
        return
      }
      const reqBody = {
        media_id: this.mediaDetail.id,
        content: isReply ? this.reply : this.comment
      }

      if (isReply) {
        reqBody.to_comment_id = id
      }

      this.$axios.mediaService.comment(reqBody).then(res => {
        if (res.data.out === '1') {
          const commentData = {
            content: isReply ? this.reply : this.comment,
            to_comment: isReply ? '1' : '0',
            to_comment_data: {},
            user_data: this.loginUser
          }
          if (isReply) {
            commentData.to_comment_data = this.commentList[index]
          }
          this.commentList.push(commentData)
          this.$toast.notice('评论成功')
          this.comment = ''
          this.reply = ''
          this.replyIndex = -1
        }
      })
    },
    async fetchData() {
      if (this.isFetching || this.line === 'end') {
        return
      }

      this.isFetching = true

      const rqBody = {
        media_id: this.mediaDetail.id
      }
      const params = {
        line: this.line
      }

      try {
        const res = await this.$axios.mediaService.commentList(rqBody, params)
        if (res.data.out == '1') {
          this.commentList.push(...res.data.data)
        }
        this.line = res.data.line
        setTimeout(() => {
          this.isFetching = false
        }, 500)
      } catch (e) {
        console.log(e)
      }
    },
    avatarMouseenter(index) {
      this.currentIndex = index
      this.isShowAvatarDialog = true
    },
    avatarMouseleave() {
      this.currentIndex = -1
      this.isShowAvatarDialog = false
    }
  }
}
</script>

<style scoped>
.comments-container {
  width: 900px;
  margin-left: calc((100% - 900px) / 2);
  margin-left: -moz-calc((100% - 900px) / 2);
  margin-left: -webkit-calc((100% - 900px) / 2);
  margin-top: 57px;
}

.comments-editor {
  position: relative;
  height: 190px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-left: 12px;
  position: absolute;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  background-size: cover;
  background-position: center;
}

.avatar-dialog {
  position: absolute;
  top: 58px;
  left: -16px;
  z-index: 3;
}

.comments-editor textarea {
  box-sizing: border-box;
  width: 900px;
  height: 124px;
  /* margin-left: 88px; */
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  resize: none;
  border-radius: 8px;
  outline: none;
  padding: 8px 8px;
  border: 1px solid #e4e4e4;
  font-size: 18px;
}

.comment-botton {
  width: 200px;
  height: 40px;
  border-radius: 4px;
  background-color: #56cb8f;
  color: #fff;
  text-align: center;
  line-height: 40px;
  margin-top: 14px;
  font-size: 16px;
  margin-left: calc(100% - 200px);
  margin-left: -moz-calc(100% - 200px);
  margin-left: -webkit-calc(100% - 200px);
  cursor: pointer;
}

.comments-list {
  margin-top: 64px;
}

.comment-item {
  position: relative;
  margin-top: 45px;
  min-height: 80px;
}

.comment-detail {
  margin-left: 88px;
  width: 1080px;
}

.user-nick {
  font-size: 18px;
  font-weight: 600;
}

.comment-content {
  width: 800px;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 16px;
  margin-top: 5px;
}

.comment-other {
  font-size: 18px;
  font-weight: 600;
}

.reply {
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
}

.reply:hover {
  color: rgba(0, 0, 0, 1);
}

.reply-fade-enter-active,
.reply-fade-leave-active {
  height: 190px;
  opacity: 1;
  transition: all 0.3s;
}

.reply-fade-enter,
.reply-fade-leave-to {
  height: 0px;
  opacity: 0;
}

.reply-editor {
  position: relative;
  overflow: hidden;
}

.reply-editor textarea {
  margin-top: 16px;
  box-sizing: border-box;
  width: 796px;
  height: 124px;
  margin-left: 88px;
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #dddddd;
  resize: none;
  border-radius: 8px;
  outline: none;
  padding: 8px 8px;
  border: 1px solid #e4e4e4;
  font-size: 18px;
}

.reply-botton {
  width: 180px;
  height: 40px;
  border-radius: 4px;
  background-color: #56cb8f;
  color: #fff;
  text-align: center;
  line-height: 40px;
  margin-top: 14px;
  font-size: 16px;
  cursor: pointer;
  margin-left: calc(100% - 198px);
  margin-left: -moz-calc(100% - 198px);
  margin-left: -webkit-calc(100% - 198px);
}

::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: rgba(0, 0, 0, 0.5);
}

::-moz-placeholder {
  /* Firefox 19+ */
  color: rgba(0, 0, 0, 0.5);
}

:-moz-placeholder {
  /* Firefox 18- */
  color: rgba(0, 0, 0, 0.5);
}

.more-comments {
  width: 158px;
  height: 34px;
  margin-top: 40px;
  margin-left: calc(50% - 79px);
  margin-left: -moz-calc(50% - 79px);
  margin-left: -webkit-calc(50% - 79px);
  text-align: center;
  line-height: 34px;
  border-radius: 20px;
  cursor: pointer;
  background-color: #f7f7f7;
}
</style>

