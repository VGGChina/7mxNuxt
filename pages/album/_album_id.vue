<template>
  <div class="album">
    <div class="detail">
      <div class="name">
        灵感集 - <span style="font-weight: 800;">{{ detail.name }}</span>
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
        :album-id="detail.id"
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
    detail: {
      user_data: {
        id: '-1'
      }
    }
  }),
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    isAlbumAuthor() {
      if (!this.isLogin || this.loginUser.id !== this.detail.user_data.id) {
        return false
      }

      if (this.loginUser.id === this.detail.user_data.id) {
        return true
      }
      return false
    }
  },

  created() {
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
      const detail = await this.$axios.albumService.getAlbumDetail({ album_id: this.$route.params.album_id || 0 })
      if (detail.data.out > 0) {
        this.detail = detail.data.data
      }
      const res = await this.$axios.mediaService.getAlbumPics({ album_id: this.$route.params.album_id || 0 })
      if (res.data.out > 0) {
        this.imgList = res.data.data
      }
      this.line = res.data.line
    }
  }
}
</script>

<style lang='scss' scoped>

.detail {
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-left: 20px;
  font-size: 1.1rem;
}

</style>
