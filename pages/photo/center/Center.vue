<template>
  <div id="detial-center">
    <div class="array left-array" @click="front" />
    <div class="array right-array" @click="next" />
    <div id="image-container">
      <img :src="mediaDetail.image" width="0" height="0" :alt="imageAlt">
    </div>
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
    originList: [],
    line: '',
    isFetching: false,
    currentIndex: 0,
    isFirst: true,
    firstMedia: {},
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
        this.$nextTick(() => {
          this.setCenterImgWidth()
        })
        this.fetchOriginData()
      } else {
        document.getElementById('image-container').style.background =
          'url(' + this.mediaDetail.image + ') no-repeat'
      }
    },
    onresizeFlag: function() {
      if (this.$utilHelper.viewportSize().height <= 680) {
        return
      }
      this.setCenterImgWidth()
    }
  },
  methods: {
    async fetchOriginData() {
      if (this.isFetching || this.line == 'end') {
        return
      }

      const rqBody = {
        user_id: this.mediaDetail.user_data.id
      }
      const query = {
        line: this.line
      }

      this.isFetching = true
      const res = await this.$apiFactory.getMediaApi().originList(rqBody, query)

      if (res.data.out == '1') {
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
    setCenterImgWidth() {
      const maxWidth = document.getElementById('detial-center').clientWidth - 100
      const maxHeight = this.$utilHelper.viewportSize().height - 120
      const imageContainer = document.getElementById('image-container')
      document.getElementById('detial-center').style.height = maxHeight + 'px'
      imageContainer.style.width = maxWidth + 'px'
      imageContainer.style.height = maxHeight + 'px'
      imageContainer.style.background =
        'url(' + this.mediaDetail.image + ') no-repeat'
    },
    likeImg: function(img) {
      if (!this.isLogin) {
        // 弹出登录弹窗
        this.$store.commit('isShowLoginDialog', true)
        return
      }

      var media = {}
      media.media_id = img.id
      if (img.is_like === '1') {
        this.$apiFactory
          .getMediaApi()
          .dislike(media)
          .then(res => {
            if (res.data.out === '1') {
              img.like_num = res.data.data.like_num
              img.is_like = res.data.data.is_like
            }
          })
      } else {
        this.$apiFactory
          .getMediaApi()
          .like(media)
          .then(res => {
            if (res.data.out === '1') {
              img.like_num = res.data.data.like_num
              img.is_like = res.data.data.is_like
            }
          })
      }
    },
    front() {
      if (this.isImgOnLoading) {
        return
      }

      if (this.currentIndex == 0) {
        this.$toast.warn('已经是第一张了')
        return
      }

      this.currentIndex--
      if (this.firstId == this.originList[this.currentIndex].id) {
        if (this.currentIndex > 0) {
          this.currentIndex--
        }
      }

      this.$emit('updateMedia', this.originList[this.currentIndex])
      this.$router.push({
        name: 'photo',
        params: {
          id: this.originList[this.currentIndex].id
        }
      })
    },
    async next() {
      if (this.isImgOnLoading) {
        return
      }

      if (this.currentIndex == this.originList.length - 1) {
        if (this.line == 'end') {
          this.$toast.warn('已经是最后一张了')
          return
        }
        if (this.isFetching) {
          return
        }
        const rqBody = {
          user_id: this.mediaDetail.user_data.id
        }
        const query = {
          line: this.line
        }

        this.isFetching = true
        const res = await this.$apiFactory.getMediaApi().originList(rqBody, query)

        if (res.data.out == '1') {
          const array = res.data.data.filter(e => {
            return e.id != this.firstMedia.id
          })
          this.originList.push(...array)
        }

        this.line = res.data.line
        this.currentIndex++
        if (this.mediaDetail.id == this.originList[this.currentIndex].id) {
          this.currentIndex++
        }
        setTimeout(() => {
          this.isFetching = false
        }, 500)
      } else {
        this.currentIndex++
        if (this.firstId == this.originList[this.currentIndex].id) {
          this.currentIndex++
        }
      }

      this.$emit('updateMedia', this.originList[this.currentIndex])
      this.$router.push({
        name: 'photo',
        params: {
          id: this.originList[this.currentIndex].id
        }
      })
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
}
</style>
