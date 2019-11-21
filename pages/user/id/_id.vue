<template>
  <div class="user-home">
    <user-info
      :first-img="firstImg"
      :user-info="userInfo"
      :origin-list="imgList"
      :is-loading="isLoading"
    />
    <div class="water-container">
      <!-- :style="{ 'min-height': waterfallMinHeight + 'px'}" -->
      <img-waterfall
        v-if="userHomeNavIndex != 4 && userHomeNavIndex != 5"
        id="user-home-water"
        :img-list="imgList"
        :line="line"
        :is-loading="isLoading"
        :is-show-loading="false"
        :is-large="isLarge"
        :is-show-remark="userHomeNavIndex == 2"
        :is-show-exclusive="userHomeNavIndex == 1"
      />
      <album-list v-if="userHomeNavIndex == 4" :album-list="albumList"/>
      <tag-list v-if="userHomeNavIndex == 5" key="0" :end="line" :tags="tags"/>
      <loading v-if="isLoading && imgList.length == 0" :is-loading="true" :loading-color="'#000'"/>
      <div v-if="!isLoading && albumList.length < 1 && userHomeNavIndex == 4" class="no_wrap">
        <no-content :is-no-content-show="true"/>
      </div>
      <div style="padding-bottom: 580px;">
        <div
          v-if="imgList.length > 0 && line != 'end'"
          class="load-more"
          @click="fetchData"
        >{{ isLoading ? '正在加载...' : '加载更多' }}</div>
      </div>
      <index-footer/>
    </div>
  </div>
</template>

<script>
import UserInfo from '~/components/userinfo/UserInfo'
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'
import AlbumList from '~/components/album-list/index'
import IndexFooter from '~/components/footer/IndexFooter'
import NoContent from '~/components/no-content/NoContent'
import TagList from '~/components/tag-list/TagList'
import loading from '~/components/loading/Loading'

export default {
  components: {
    UserInfo,
    ImgWaterfall,
    AlbumList,
    NoContent,
    IndexFooter,
    TagList,
    loading
  },
  data: () => ({
    // userInfo: {},
    isLoading: false,
    line: '',
    imgList: [],
    albumList: '',
    tags: [],
    isLarge: false,
    userHomeNavIndex: 0 // 0为作品，1为商店，2为审核，3为喜欢，4为灵感集，5为标签
    // waterfallMinHeight: 0
  }),
  computed: {
    firstImg() {
      if (this.imgList.length > 0) {
        return this.imgList[0].image
      }
      return ''
    }
  },

  watch: {
    $route(to, from) {
      location.reload()
    }
  },

  async asyncData({ $axios, params }) {
    let userInfo = {}
    const imgList = []
    let line = ''

    const rqBody = {
      user_id: params.id
    }
    const userinfo = await $axios.userService.userDetail(rqBody)
    if (userinfo.data.out === '1') {
      userInfo = userinfo.data.data
    } else {
      this.$router.push({
        name: 'redirectToIndex'
      })
    }

    // 作品
    const data = { user_id: userInfo.id }
    const params2 = { line: '' }

    // if (this.userHomeNavIndex == 1) {
    //   data.check = '1'
    //   data.user_id = this.userInfo.id
    // }

    // if (this.userHomeNavIndex == 2) {
    //   data.check = '2,3'
    // }

    const works = await $axios.mediaService.originList(data, params2)

    if (works.data.out === '1') {
      imgList.push(...works.data.data)
      line = works.data.line
    }

    return {
      userInfo: userInfo,
      imgList: imgList,
      line: line
    }
  },
  async created() {
    this.getIsLarge()

    this.getUserHomeNavIndex()
  },
  mounted() {
    // this.waterfallMinHeight = 2 * this.$utilHelper.getWindowHeight()
  },
  methods: {
    getTitle(userInfo) {
      let title = ''
      try {
        let userName = ''
        if (userInfo.nick) {
          userName = userInfo.nick
        } else if (userInfo.name) {
          userName = userInfo.name
        }
        title = userName + ' - 7MX.COM'
        return title
      } catch (e) {
        return '7MX - 中国领先的视觉创作社区'
      }
    },
    fetchData() {
      switch (this.userHomeNavIndex) {
        case 0:
        case 1:
        case 2:
          this.fetchOrigin()
          break
        case 3:
          this.fetchLike()
          break
        case 4:
          this.fetchAlbum()
          break
        case 5:
          this.fetchTag()
          break
        default:
          break
      }
    },
    async fetchOrigin() {
      if (this.isLoading || this.line === 'end') {
        return
      }
      this.isLoading = true

      const data = { user_id: this.userInfo.id }
      const params = { line: this.line }

      if (this.userHomeNavIndex === 1) {
        data.check = '1'
        data.user_id = this.userInfo.id
      }

      if (this.userHomeNavIndex === 2) {
        data.check = '2,3'
      }

      const res = await this.$axios.mediaService.originList(data, params)

      if (res.data.out === '1') {
        this.imgList.push(...res.data.data)
      }

      this.line = res.data.line

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    async fetchLike() {
      if (this.isLoading || this.line === 'end') {
        return
      }

      this.isLoading = true

      const data = { user_id: this.userInfo.id }
      const params = { line: this.line }

      const res = await this.$axios.mediaService.likeList(data, params)

      if (res.data.out == '1') {
        this.imgList.push(...res.data.data)
      }

      this.line = res.data.line
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    reload() {
      if (this.isLoading) {
        return
      }

      this.line = ''

      this.imgList = []

      this.tags = []

      this.albumList = []

      this.fetchData()
    },
    getIsLarge() {
      this.$bus.on('user-home-display-mode-is-large', e => {
        this.isLarge = e
      })
    },
    getUserHomeNavIndex() {
      this.$bus.on('user-home-nav-index', index => {
        this.userHomeNavIndex = index

        this.reload()
      })
    },
    async fetchAlbum() {
      this.isLoading = true

      const res = await this.$axios.albumService.albumList({
        user_id: this.userInfo.id || ''
      })

      if (res.data.out === '1') {
        this.albumList = res.data.data
      }

      setTimeout(() => {
        this.isLoading = false
      }, 500)

      this.line = res.data.line
    },
    async fetchTag() {
      const res = await this.$axios.tagService.followList({
        user_id: this.userInfo.id
      })

      if (res.data.out === '1') {
        this.tags = res.data.data
      }

      setTimeout(() => {
        this.isLoading = false
      }, 500)

      this.line = res.data.line
    }
  }
}
</script>

<style lang='scss' scoped>
.user-home {
  position: absolute;
  top: 0px;
  width: 100%;
  min-width: 1200px;
}

.no-content-mt {
  margin-top: 10%;
}

.water-container {
  position: relative;
  background: #fff;
}

.load-more {
  margin: 0px 18px;
  width: calc(100% - 36px);
  width: -moz-calc(100% - 36px);
  width: -webkit-calc(100% - 36px);
  height: 48px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.02);
  text-align: center;
  line-height: 48px;
  font-size: 18px;
  margin-top: 60px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(0, 0, 0, 0.05);
  letter-spacing: 1px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.8);
  }
}
</style>
