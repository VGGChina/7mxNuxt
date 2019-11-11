<template>
  <div class="activityDetail">
    <!-- 顶部菜单 -->
    <top-nav
      @toPublish="toPublish"
      :activeDetailImg="activeDetail.image0 || activeDetail.image"
      :activeDetail="activeDetail"
    ></top-nav>
    <div class="activeBar" v-if="!$utilHelper.isEmptyObj(activeDetail)">
      <div class="category-list">
        <div class="type_wrap">
          <div class="type intro">
            <router-link
              :class="{ selected : currentIndex == 0 }"
              :to="{
                name: 'activity-id-table-page',
                params: { id : activeDetail.id, tableIndex: '0', page: '1' }
              }"
            >活动介绍</router-link>
          </div>
          <div class="type works" v-if="activeDetail.vote == '1' || activeDetail.vote == '2'">
            <img
              v-if="activeDetail.vote == '1'"
              :src="require('../../img/poll.png')"
              alt="点我投票"
              class="poll-remind"
            >
            <router-link
              :class="{ selected : currentIndex == 1 }"
              :to="{
                name: 'activityDetail',
                params: { id : activeDetail.id, tableIndex: '1', page: '1' }
              }"
            >{{getEventStage}}</router-link>
          </div>
          <div class="type works">
            <router-link
              :class="{ selected : currentIndex == 2 }"
              :to="{
                name: 'activityDetail',
                params: { id : activeDetail.id, tableIndex: '2', page: '1' }
              }"
            >推荐作品</router-link>
          </div>
          <div class="type works">
            <router-link
              :class="{ selected : currentIndex == 3 }"
              :to="{
                name: 'activityDetail',
                params: { id : activeDetail.id, tableIndex: '3', page: '1' }
              }"
            >{{ activeDetail.media_num }} 全部作品</router-link>
          </div>
          <div class="type authors">
            <router-link
              :class="{ selected : currentIndex == 4 }"
              :to="{
                name: 'activityDetail',
                params: { id : activeDetail.id, tableIndex: '4', page: '1' }
              }"
            >{{ activeDetail.user_num }} 人</router-link>
          </div>
        </div>
      </div>
    </div>
    <transition name="drop-choose-fade">
      <div class="drop-choose" v-if="isShowChoose">
        <div class="array">
          <div></div>
        </div>
        <div class="option" @click="publishNew">发布新作品</div>
        <div class="option" @click="publishOld">从历史作品中选择</div>
      </div>
    </transition>
    <transition name="choose-works-mask-fade">
      <div class="choose-works-mask" v-if="isShowChooseWorks" @click="isShowChooseWorks = false">
        <div class="cancle-button"></div>
      </div>
    </transition>
    <transition name="choose-works-fade">
      <choose-works
        v-if="isShowChooseWorks"
        :activityId="activeDetail.id"
        :tagId="activeDetail.id"
        v-on:cancleActivityChooseWorksDialog="isShowChooseWorks = false"
      ></choose-works>
    </transition>
    <div v-if="!$utilHelper.isEmptyObj(activeDetail) && currentIndex == 0" class="article">
      <div v-if="activeDetail.caution" class="title">介绍</div>
      <div v-if="activeDetail.caution" class="content">
        <span v-html="activeDetail.caution"></span>
      </div>
      <div v-if="activeDetail.start_time" class="title">征稿时间</div>
      <div
        v-if="activeDetail.start_time"
        class="content"
      >{{ activeDetail.start_time | timeParse }} ~ {{ activeDetail.close_time | timeParse }}</div>
      <div v-if="!activeDetail.awards" class="title">奖项设置</div>
      <div v-if="!activeDetail.awards" class="content">
        <div v-for="(item, index) in stageList" :key="index" class="oneAward">
          <strong>{{item.name}}</strong>&nbsp;&nbsp;
          <strong>数量:</strong>
          {{item.num}}&nbsp;&nbsp;
          <strong>奖品:</strong>
          {{item.award}}&nbsp;&nbsp;
        </div>
      </div>
      <div class="contentNew">
        <span v-html="activeDetail.content"></span>
      </div>
    </div>
    <div class="auth_wrap">
      <poll
        v-if="currentIndex == 1"
        :stageList="stageList"
        :stage="stage"
        :isLoading="isLoading"
        :activeDetail="activeDetail"
      ></poll>
    </div>
    <!-- 作品列表 -->
    <div
      v-if="currentIndex == 2 || currentIndex == 3"
      class="work_wrap"
      :style="{ 'min-height': waterfallMinHeight + 'px' }"
    >
      <div class="waterfallContainer">
        <img-waterfall :imgList="imgList" :line="line" :isToPaixin="false" :isShowLoading="false"></img-waterfall>
      </div>
    </div>
    <!-- 作者列表 -->
    <div class="auth_wrap">
      <user-preview v-if="currentIndex == 4" :userList="userList"></user-preview>
    </div>
    <loading :isLoading="isLoading" :loadingColor="'#000'"></loading>
    <pagination
      style="margin: 64px 0 160px 0;"
      v-show="!isLoading && isShowPagination"
      :baseUrl="'/activity/' + activeDetail.id + '/' + currentIndex + '/'"
      :line="line"
      @paginationJumpToPage="jumpToPage"
    ></pagination>
  </div>
</template>

<script>
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'
import UserPreview from '~/components/user-preview/UserPreview'
import ChooseWorks from './publishOld/ChooseWorks'
import Pagination from '~/components/pagination/paginationQ'
import TopNav from '~/pages/activity/top-nav'
import Poll from './poll'
import { mapGetters } from 'vuex'

export default {
  name: 'activityDetail',
  data: () => ({
    activeDetail: {},
    imgList: [],
    userList: [],
    stageList: [],
    AwardWinningList: [],
    line: '1,0,0',
    isLoading: false,
    now: false, // 此比赛是否正在进行
    isShowChoose: false,
    isShowChooseWorks: false,
    stage: 0,
    activities: [],
    waterfallMinHeight: 0,
    imgList1: [],
    line1: '',
    currentItem: 1
  }),
  methods: {
    toPublish() {
      if (!this.isLogin) {
        this.$store.commit('isShowLoginDialog', true)
        return
      }
      this.isShowChoose = !this.isShowChoose
    },
    publishNew() {
      this.$store.commit('isShowUploadDialog', true)
      this.$store.commit('uploadActivity', this.activeDetail)
      this.isShowChoose = false
    },
    publishOld() {
      this.isShowChoose = false

      this.isShowChooseWorks = true
    },
    jumpToPage(line) {
      this.$router.push({
        name: 'activityDetail',
        params: {
          id: this.$route.params.id,
          tableIndex: this.currentIndex + '',
          page: line.split(',')[0]
        }
      })
    },
    reload(line = '1,0,0') {
      if (this.isLoading) {
        return
      }

      this.imgList = []

      this.userList = []

      if (this.stage != '3') {
        this.stageList = []
      }

      this.line = line

      this.fetchData()
    },
    fetchData() {
      if (this.isLoading || this.line.split(',')[0] == 'end') {
        return
      }

      if (this.currentIndex == 1) {
        this.pullStageWorks()

        return
      }

      if (this.currentIndex == 2) {
        this.pullRecommendWorks()

        return
      }

      if (this.currentIndex == 3) {
        this.pullAllWorks()

        return
      }

      if (this.currentIndex == 4) {
        this.pullAuthors()
      }
    },
    afterResponse(res) {
      if (res.data.out == '1') {
        if (this.currentIndex == 1) {
          this.stageList.push(...res.data.data)
        } else if (this.currentIndex == 4) {
          this.userList.push(...res.data.data)
        } else {
          this.imgList.push(...res.data.data)
        }
      }

      this.line =
        res.data.line !== 'end'
          ? res.data.line
          : this.$route.params.page + ',0,0'

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    async pullActivityDetail() {
      let { $router, $route, $apiFactory } = this

      let res = await $apiFactory
        .getTagApi()
        .getTagDetail({ tag_id: $route.params.id })

      let { data, out } = res.data

      if (out != '1' || data.is_activity != '1') {
        // 跳转至根目录
        $router.push('/')
        return false
      }

      this.activeDetail = data
      document.title = data.name + ' - 7MX 中国领先的视觉创作社区'
      // 已截止, 不显示上传按钮, 没有截止则显示, 但现在没这个功能
      this.now = !(new Date().getTime() - data.close_time * 1000 > 0)
      this.stage = data.vote

      this.pullAwardWinningList()
    },
    async pullAwardWinningList() {
      let api = this.$apiFactory.getMediaApi()
      let res = null
      res = await api.getAwardWinningList(
        { tag_id: this.$route.params.id },
        { line: this.line }
      )
      // 判断是否有获奖名单
      if (res.data.out == '1' && res.data.data.length > 0) {
        this.stage = '3'
        this.stageList = res.data.data
      }

      this.fetchData()
    },
    async pullStageWorks() {
      if (this.isLoading || this.line == 'end') return

      this.isLoading = true

      let api = this.$apiFactory.getMediaApi()
      let res = null

      // 判断是否有获奖名单
      if (this.stage != '3') {
        res = await api.getPollList(
          { tag_id: this.$route.params.id, vote: '1' },
          { line: this.line, limit: '40' }
        )
        if (res.data.out == '1') {
          this.afterResponse(res)
        }
      } else {
        this.isLoading = false
        console.log('isLoading: ' + this.isLoading)
      }
    },
    async pullAuthors() {
      if (this.isLoading || this.line == 'end') return

      this.isLoading = true

      let res = await this.$apiFactory
        .getTagApi()
        .getJoinUser(
          { tag_id: this.$route.params.id },
          { line: this.line, limit: '40' }
        )

      this.afterResponse(res)
    },
    async pullAllWorks() {
      if (this.isLoading || this.line == 'end') return

      this.isLoading = true

      let res = await this.$apiFactory
        .getMediaApi()
        .inTagList(
          { tag_id: this.$route.params.id },
          { line: this.line, limit: '40' }
        )

      this.afterResponse(res)
    },
    async pullRecommendWorks() {
      if (this.isLoading || this.line == 'end') return

      this.isLoading = true

      let res = await this.$apiFactory
        .getMediaApi()
        .recommendInTagList(
          { tag_id: this.$route.params.id },
          { line: this.line, limit: '40' }
        )

      this.afterResponse(res)
    }
  },
  async created() {
    if (this.$route.params.id == '285671') {
      try {
        await this.$apiFactory
          .getStatisticsApi()
          .postBannerClickNum({ id: '285671' })
      } catch (error) {
        console.log(error)
      }
      window.location.href = 'http://www.hotspringphoto.com'
      return
    }
    this.line = this.$route.params.page + ',0,0'
    this.pullActivityDetail()
    this.$bus.on('cancel', e => {
      this.isShowChoose = false
    })
  },
  watch: {
    isShowChooseWorks: function(val) {
      if (val) {
        document.querySelector('html').style.overflow = 'hidden'
      } else {
        document.querySelector('html').style.overflow = 'auto'
      }
    },
    '$route.params.tableIndex': function(val) {
      this.reload()
    },
    '$route.params.page': function(val) {
      let lineArray = this.line.split(',')

      lineArray[0] = val

      this.reload(lineArray.join(','))
    }
  },
  filters: {
    timeParse(v) {
      var t = new Date(v * 1000)
      return `${t.getFullYear()}年 ${t.getMonth() + 1}月 ${t.getDate()}日`
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
    isToPaixin() {
      if (this.currentItem == 2) {
        return true
      } else {
        return false
      }
    },
    isShowPagination() {
      if (this.line == '1,0,0') {
        return false
      }

      let lineArray = this.line.split(',')

      if (lineArray[0] == 'end' && lineArray[2] == '1') {
        return false
      }

      return true
    },
    // 获取比赛活动的阶段
    // 投票 | 投票结果 | 获奖名单
    getEventStage() {
      let str = null

      if (this.stage == '1') {
        str = '投票'
      } else if (this.stage == '2') {
        str = '投票结果'
      } else if (this.stage == '3') {
        str = '获奖名单'
      }

      return str
    },
    currentIndex() {
      return parseInt(this.$route.params.tableIndex)
    }
  },
  components: {
    ImgWaterfall,
    UserPreview,
    ChooseWorks,
    Pagination,
    Poll,
    TopNav
  }
}
</script>

<style lang='scss' scoped>
.activityDetail {
  min-height: 1000px;

  .banner_wrap {
    height: 440px;
    background: rgba(0, 0, 0, 0.06);
    .banner {
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .activeBar {
    height: 80px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    position: relative;
  }
}

.category-list {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  background: #fff;
  font-size: 1.3rem;
}

.type_wrap {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  margin: 0% 10%;
}

.type_wrap .works {
  position: relative;
}

.type_wrap .poll-remind {
  position: absolute;
  top: -35px;
  left: -7px;
}

.type_wrap .type {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
  /*height: 100%;*/
  height: 80px;
  line-height: 80px;
  white-space: nowrap;
  margin: 0 30px;
}

.type_wrap .type a {
  letter-spacing: 1px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 400;
  color: inherit;
}

.type_wrap .type a:hover {
  color: inherit;
}

.type_wrap div {
  color: rgba(0, 0, 0, 0.5);
}

.type_wrap div:hover {
  color: rgba(0, 0, 0, 0.7);
}

.selected {
  color: rgba(0, 0, 0, 1) !important;
}

.right-button {
  position: absolute;
  right: 26px;
  line-height: 30px;
  text-align: center;
  width: 182px;
  height: 58px;
  line-height: 58px;
  cursor: pointer;
  letter-spacing: 1px;
  border: 1px solid;
  border-radius: 4px;
  background-color: #56cb8f;
  color: #fff;
  top: 50%;
  transform: translateY(-50%);
}
.article {
  width: 800px;
  margin: 60px auto;
  margin-bottom: 140px;
  .title {
    font-size: 1.4rem;
    line-height: 2;
    margin-top: 60px;
    margin-bottom: 20px;
  }
  .content {
    line-height: 1.6;
    font-size: 0.95rem;
    text-align: justify;
    color: rgba(0, 0, 0, 0.7);
  }
  .contentNew {
    margin-top: 60px;
  }
}
.nextPage {
  width: 60%;
  margin: 20px auto 60px;
}

.drop-choose-fade-enter-active,
.drop-choose-fade-leave-active {
  transition: all 0.4s;
}

.drop-choose-fade-enter,
.drop-choose-fade-leave-active {
  transform: translateY(20px);
  opacity: 0;
}

.drop-choose {
  padding: 16px;
  position: absolute;
  z-index: 1;
  top: 590px;
  top: 360px;
  left: 460px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 0px 32px 0 rgba(0, 0, 0, 0.15);

  .array {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 0;
    left: calc(50% - 15px);
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
      border-radius: 4px;
      box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.09);
    }
  }

  .option {
    text-align: center;
    height: 48px;
    line-height: 48px;
    margin: 8px 0;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #f6f6f6;
      transition: background 0.3s;
    }
  }
}

.choose-works-fade-enter-active,
.choose-works-fade-leave-active {
  transition: all 0.4s;
}

.choose-works-fade-enter,
.choose-works-fade-leave-active {
  transform: translateY(-40px);
  opacity: 0;
}

.choose-works-mask-fade-enter-active,
.choose-works-mask-fade-leave-active {
  transition: all 0.4s;
}

.choose-works-mask-fade-enter,
.choose-works-mask-fade-leave-active {
  opacity: 0;
}

.choose-works-mask {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.cancle-button {
  width: 15px;
  height: 15px;
  object-fit: contain;
  background-image: url('../../img/cancle.svg');
  position: absolute;
  right: 4px;
  top: 4px;
  cursor: pointer;
}
.waterfallContainer {
  width: 100%;
  margin: 0 auto;
}
</style>
