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
      <!--  喜欢 -->
      <album-list v-if="userHomeNavIndex == 4" :album-list="imgList"/>
      <div v-if="!isLoading && imgList.length < 1 && userHomeNavIndex == 4" class="no_wrap">
        <no-content :is-no-content-show="true"/>
      </div>
      <tag-list v-if="userHomeNavIndex == 5" key="0" :end="line" :tags="tags"/>
      <loading v-if="isLoading && imgList.length == 0" :is-loading="true" :loading-color="'#000'"/>
      <div style="padding-bottom: 580px;">
        <div
          v-if="imgList.length > 0 && currentPage < totalPages && userHomeNavIndex != 4 && userHomeNavIndex != 5"
          class="load-more"
          @click="getMore"
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
    isLoading: false,
    line: '',
    imgList: [],
    tags: [],
    isLarge: false,
    userHomeNavIndex: 0, // 0为作品，1为商店，2为审核，3为喜欢，4为灵感集，5为标签
    // waterfallMinHeight: 0,

    userInfo: {
      userStat: {
        mediaNum: 0,
        freeMediaNum: 0,
        checkingNum: 0,
        likeNum: 0
      }
    },

    currentPage: 0,
    totalPages: 1
  }),
  computed: {
    firstImg() {
      if (this.imgList.length > 0) {
        return this.imgList[0].image
      }
      return ''
    }
  },

  created() {
    //获取用户信息
    this.getUserInfo()
    //获取用户作品
    this.getUserDatas()

    this.getIsLarge()
    this.getUserHomeNavIndex()
  },
  computed: {
    line() {
      if (this.currentPage >= this.totalPages) {
        return 'end'
      } else {
        return (
          this.currentPage +
          ',' +
          this.totalPages +
          ',' +
          (this.currentPage - 1)
        )
      }
    }
  },
  methods: {
    reload() {
      if (this.isLoading) {
        return
      }

      this.currentPage = 0
      this.totalPages = 1

      this.imgList = []

      this.tags = []

      this.getUserDatas()
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

    async getUserInfo() {
      const data = {
        userId: this.$route.params.id
      }
      const res = await this.$axios.userService.userDetail(data)
      this.userInfo = res.data
      let user = {
        userId: this.$route.params.id
      }
      sessionStorage.setItem('homePage', JSON.stringify(user))
    },

    // 作品
    async getUserDatas() {
      if (this.userHomeNavIndex == 4) {
        let res = await this.$axios.albumService.albumList({
          userId: this.$route.params.id
        })
        this.imgList.push(...res.data.content)
        return
      }
      if (this.userHomeNavIndex == 5) {
        let res = await this.$axios.tagService.getUserTag({
          id: this.$route.params.id
        })
        this.tags.push(...res.data.content)
        return
      }
      try {
        if (this.currentPage >= this.totalPages) return
        const data = {
          type: this.userHomeNavIndex + 1,
          userId: this.$route.params.id,
          params: {
            page: this.currentPage
          }
        }
        this.isLoading = true
        const res = await this.$axios.userService.getUserDatas(data)
        console.log('getUserDatas', res)

        if (this.userHomeNavIndex === 3) {
          this.imgList.push(...res.data.content)
          this.totalPages = res.data.totalPages
          this.currentPage++
        } else {
          for (let i in res.data.content) {
            res.data.content[i].userStat = {
              followedNum: res.data.content[i].followedNum,
              popularity: res.data.content[i].popularity,
              userId: res.data.content[i].userId
            }
            res.data.content[i].name = res.data.content[i].nickname
          }
          this.imgList.push(...res.data.content)
          // const pageNow = this.currentPage + 1
          // const pageTotal = res.data.totalPages
          // const nextPage = pageNow === pageTotal ? 'end' : pageNow + 1
          // this.line = nextPage + ',' + pageTotal + ',' + pageNow
          this.totalPages = res.data.totalPages
          this.currentPage++
        }
        this.isLoading = false
      } catch (e) {
        this.$toast.warn(e)
      }
    },

    // 查看等多
    getMore() {
      this.getUserDatas()
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
