<template>
  <div id="detial-center">
    <div class="array left-array" @click="front" />
    <div class="array right-array" @click="next" />
    <div id="image-container" :style="'background: ' + 'url(' + mediaDetail.image + ') no-repeat'" />
  </div>
</template>

<script>

export default {
  props: ['mediaDetail'],
  data: () => ({
    isShowIcons: false,
    isShowLikeIcon: true,
    naturalWidth: 0,
    naturalHeight: 0,
    line: '',
    isFetching: false,
    currentIndex: 0,
    isFirst: false,
    isImgOnLoading: false
  }),
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
    imageAlt() {
      try {
        let alt = ''

        alt += this.mediaDetail.title + ' '

        this.mediaDetail.category_list.forEach(item => {
          alt += item.name + ' '
        })

        this.mediaDetail.tag_list.forEach(item => {
          alt += item.name + ' '
        })

        return alt.substring(0, alt.length - 1)
      } catch (e) {
        return ''
      }
    }
  },
  watch: {
    mediaDetail: function(val) {
      const img = new Image()
      const vm = this
      img.onload = function() {
        vm.isImgOnLoading = false
      }

      this.isImgOnLoading = true
      img.src = val.image

      if (this.isFirst) {
        this.firstMedia = val
        this.isFirst = false

        this.fetchOriginData()
      } else {
        document.getElementById('image-container').style.background =
          'url(' + this.mediaDetail.image + ') no-repeat'
      }
    }
  },
  methods: {
    async fetchOriginData() {
      if (this.isFetching || this.line === 'end') {
        return
      }
      const rqBody = {
        user_id: this.mediaDetail.user_data.id
      }
      const query = {
        line: this.line
      }

      this.isFetching = true
      const res = await this.$axios.mediaService.originList(rqBody, query)

      if (res.data.out === '1') {
        const array = res.data.data.filter(e => {
          return e.id != this.firstMedia.id
        })
        this.originList.push(...array)
        this.originList.splice(0, 0, this.firstMedia)
      }

      this.line = res.data.line
      setTimeout(() => {
        this.isFetching = false
      }, 500)
    },
    // setCenterImgWidth() {},
    likeImg: function(img) {
      if (!this.isLogin) {
        // 弹出登录弹窗
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      var media = {}
      media.mediaId = img.id
      if (img.likeOrNot) {
        this.$axios.mediaService.dislike(media).then(res => {
          if (res.status == 200) {
            img.like--
            img.likeOrNot = false
          }
        })
      } else {
        this.$axios.mediaService.like(media).then(res => {
          if (res.status == 200) {
            img.like++
            img.likeOrNot = true
          }
        })
      }
    },
    async front() {
      const rqBody = {
        user_id: this.mediaDetail.user_data.id,
        order: 'asc'
      }
      const query = {
        line: this.mediaDetail.line
      }
      const res = await this.$axios.mediaService.nextPage(rqBody, query)
      if (res.data.out != '0') {
        this.$router.push({
          name: 'photo-id',
          params: {
            id: res.data.out
          }
        })
      } else {
        this.$toast.warn('已经是第一张了')
        return
      }
    },
    async next() {
      const rqBody = {
        user_id: this.mediaDetail.user_data.id
      }
      const query = {
        line: this.mediaDetail.line
      }
      const res = await this.$axios.mediaService.nextPage(rqBody, query)
      if (res.data.out != '0') {
        this.$router.push({
          name: 'photo-id',
          params: {
            id: res.data.out
          }
        })
      } else {
        this.$toast.warn('已经是最后一张了')
        return
      }
    }
  }
}
</script>

<style scoped>
#detial-center {
  box-sizing: border-box;
  width: calc(100% - 300px);
  width: -moz-calc(100% - 300px);
  width: -webkit-calc(100% - 300px);
  position: relative;
  align-items: center;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: flex-start;
  margin-left: 20px;
}

#image-container {
  width: calc(100vw - 100px);
  height: calc(100vh - 120px);
  display: inline-block;
  position: relative;
  /* margin: 0 35px 0 50px; */
  position: relative;
  background-size: contain !important;
  background-position: center !important;
}

.array {
  width: 20px;
  height: 40px;
  position: absolute;
  top: calc(50% - 20px);
  top: -moz-calc(50% - 20px);
  top: -webkit-calc(50% - 20px);
  cursor: pointer;
  -webkit-background-size: contain !important;
  -moz-background-size: contain !important;
  -o-background-size: contain !important;
  background-size: contain !important;
  opacity: 0.8;
  z-index: 1000;
}

.array:hover {
  opacity: 1;
}

.left-array {
  background: url('./img/left-array.svg') no-repeat;
  left: 0px;
  cursor: pointer;
}

.right-array {
  background: url('./img/right-array.svg') no-repeat;
  right: 0px;
  top: calc(50% - 15px);
  top: -moz-calc(50% - 15px);
  top: -webkit-calc(50% - 15px);
   cursor: pointer;
}
</style>
