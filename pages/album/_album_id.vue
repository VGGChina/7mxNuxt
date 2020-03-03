<template>
  <div class="album">
    <div class="detail">
      <div class="name">
        灵感集 -
        <span style="font-weight: 800;">{{ favorName }}</span>
      </div>
    </div>
    <div v-ecroll="getList" :style="{ 'min-height': waterfallMinHeight + 'px' }">
      <img-waterfall
        :img-list="imgList"
        :line="line"
        :is-loading="isLoading"
        :is-show-loading="false"
        :is-to-paixin="false"
        :is-album-author="isAlbumAuthor"
        :album-id="albumID"
      />
    </div>
  </div>
</template>

<script>
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'

export default {
  name: 'Album',
  components: {
    ImgWaterfall
  },
  data: () => ({
    waterfallMinHeight: 0,
    imgList: [],
    line: '',
    isLoading: false,
    // detail: {
    //   user_data: {
    //     id: '-1'
    //   }
    // },
    favorUserID: 0,
    favorName: ''
  }),
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    isAlbumAuthor() {
      if (!this.isLogin || this.loginUser.id != this.favorUserID) {
        return false
      }

      if (this.loginUser.id == this.favorUserID) {
        return true
      }
      return false
    },
    albumID() {
      return this.$route.params.album_id.toString()
    }
  },

  created() {
    try {
      let user = JSON.parse(sessionStorage.getItem('homePage'))
      this.favorUserID = user.userId
    } catch (e) {
      console.log(e)
    }
    this.getList()
  },
  mounted() {
    this.waterfallMinHeight = this.$utilHelper.getWindowHeight()
  },
  head() {
    return {
      title: '灵感集 - 7MX 中国领先的视觉创作社区'
    }
  },
  methods: {
    async getList() {
      if (this.isLoading || this.line === 'end') {
        return
      }

      //获取灵感集名称
      if (this.favorUserID != 0) {
        let res = await this.$axios.albumService.albumList({
          userId: this.favorUserID
        })
        if (res.status == 200) {
          for (let i of res.data.content) {
            if (i.id == this.$route.params.album_id) {
              this.favorName = i.name
            }
          }
        }
      }
      // const detail = await this.$axios.albumService.getAlbumDetail({
      //   favoriteId: this.$route.params.album_id || 0
      // })
      // console.log(detail)
      // if (detail.status == 200) {
      //   this.detail = detail.data.data
      // }
      let res = await this.$axios.mediaService.getAlbumPics({
        favoriteId: this.$route.params.album_id || 0
      })
      if (res.status == 200) {
        this.imgList = res.data.content
      }
      this.line = 'end'
    }
  }
}
</script>

<style lang='scss' scoped>
.detail {
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 20px;
  font-size: 1.1rem;
}
</style>
