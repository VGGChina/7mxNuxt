<template>
  <div>
    <a
      v-if="imgDetail.comment_num > 2"
      :href="'/photo/' + imgDetail.id"
      target="_blank"
      class="all-comment"
    >
      查看全部{{ imgDetail.comment_num }}条评论
    </a>

    <div
      v-for="(item, index) in commentList"
      :key="index"
      class="comment-item"
    >
      <span>{{ item.user_data.nick || item.user_data.name }}
        <span v-if="item.to_comment == '1'" class="reply">回复</span>
        <span v-if="item.to_comment == '1'">
          {{ item.to_comment_data.user_data.nick || item.to_comment_data.user_data.name }}
        </span>
      </span>：
      <p>{{ item.content }}</p>
    </div>

    <div
      class="comment-editer"
      :class="{ 'comment-editer-focus': isFocus }"
    >
      <input
        :id="'userFollowConmmentInput' + index"
        v-model="content"
        placeholder="随便写点啥"
        type="text"
        @keyup.enter="comment"
      >
      <div @click="comment">发送</div>
    </div>
  </div>
</template>

<script>

export default {
  props: [
    'imgDetail',
    'commentList',
    'index'
  ],
  data() {
    return {
      isFocus: false,
      content: ''
    }
  },
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    },
    isLogin() {
      return this.$store.state.login.isLogin
    }
  },
  mounted() {
    const input = document.getElementById('userFollowConmmentInput' + this.index)
    input.onfocus = () => {
      this.isFocus = true
    }

    input.onblur = () => {
      this.isFocus = false
    }
  },
  methods: {
    async comment() {
      if (!this.isLogin) {
        // 如果没有登录，弹出登录弹窗
        this.$store.commit('isShowLoginDialog', true)
        return
      }

      if (this.content == '') {
        this.$toast.warn('评论不能为空')
        return
      }
      const reqBody = {
        media_id: this.imgDetail.id,
        content: this.content
      }

      this.$apiFactory.getMediaApi().comment(reqBody)
        .then(res => {
          if (res.data.out == '1') {
            const commentData = {
              content: this.content,
              to_comment: '0',
              to_comment_data: {},
              user_data: this.loginUser
            }
            this.commentList.push(commentData)
            this.$toast.notice('评论成功')
            this.content = ''
            this.isFocus = false
            this.imgDetail.comment_num++
          }
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.all-comment {
  font-size: 14px;
  color: #000000;
  cursor: pointer;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;

  span {
    font-size: 14px;
    .reply {
      color: rgba(26,26,26, .7);
    }
  }

  p {
    flex: 1;
    font-size: 14px;
    color: rgba(26,26,26, .7);
    margin: 0;
    padding: 0;
    word-wrap: break-word;
    word-break: break-all;
  }
}

.comment-editer {
  display: flex;
  align-items: center;
  height: 48px;
  border-radius: 6px;
  background-color: #f5f5f5;
  margin-top: 16px;
  border: 1px solid transparent;
  transition: all .3s;
  &:hover {
    background-color: rgb(240, 240, 240);
    border: 1px solid  rgba(26, 26, 26, .1);
    transition: all .3s;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    margin-left: 16px;
    background: transparent;
    font-size: 14px;
    padding: 0;
    &::placeholder {
      color: rgba(26, 26, 26, .4);
      border: rgba(26, 26, 26, .4);
    }
  }

  div {
    font-size: 14px;
    color: rgba(26, 26, 26, .4);
    margin: 0 16px;
    cursor: pointer;
  }
}

.comment-editer-focus {
  background-color: #fff !important;
  border: 1px solid  rgba(26, 26, 26, .1);
  transition: all .3s
}
</style>
