<template>
  <div class="activityDetail">
    <!-- 顶部菜单 -->
    <top-nav
      :active-detail-img="activeDetail.image0 || activeDetail.image"
      :active-detail="activeDetail"
      @toPublish="toPublish"
    />
    <div v-if="!$utilHelper.isEmptyObj(activeDetail)" class="activeBar">
      <div class="category-list">
        <div class="type_wrap">
          <div class="type intro">
            <nuxt-link
              :class="{ selected : currentIndex == 0 }"
              :to="{
                name: 'activity-id-table-page',
                params: { id : activeDetail.id, table: '0', page: '1' }
              }"
            >活动介绍</nuxt-link>
          </div>
          <div v-if="activeDetail.vote == '1' || activeDetail.vote == '2'" class="type works">
            <img
              v-if="activeDetail.vote == '1'"
              :src="require('../../img/poll.png')"
              alt="点我投票"
              class="poll-remind"
            >
            <nuxt-link
              :class="{ selected : currentIndex == 1 }"
              :to="{
                name: 'activity-id-table-page',
                params: { id : activeDetail.id, table: '1', page: '1' }
              }"
            >{{ getEventStage }}</nuxt-link>
          </div>
          <div class="type works">
            <nuxt-link
              :class="{ selected : currentIndex == 2 }"
              :to="{
                name: 'activity-id-table-page',
                params: { id : activeDetail.id, table: '2', page: '1' }
              }"
            >推荐作品</nuxt-link>
          </div>
          <div class="type works">
            <nuxt-link
              :class="{ selected : currentIndex == 3 }"
              :to="{
                name: 'activity-id-table-page',
                params: { id : activeDetail.id, table: '3', page: '1' }
              }"
            >{{ activeDetail.mediaNum }} 全部作品</nuxt-link>
          </div>
          <div class="type authors">
            <nuxt-link
              :class="{ selected : currentIndex == 4 }"
              :to="{
                name: 'activity-id-table-page',
                params: { id : activeDetail.id, table: '4', page: '1' }
              }"
            >{{ activeDetail.followedNum }} 人</nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <transition name="drop-choose-fade">
      <div v-if="isShowChoose" class="drop-choose">
        <div class="array">
          <div />
        </div>
        <div class="option" @click="publishNew">发布新作品</div>
        <div class="option" @click="publishOld">从历史作品中选择</div>
      </div>
    </transition>
    <transition name="choose-works-mask-fade">
      <div v-if="isShowChooseWorks" class="choose-works-mask" @click="isShowChooseWorks = false">
        <div class="cancle-button" />
      </div>
    </transition>
    <transition name="choose-works-fade">
      <choose-works
        v-if="isShowChooseWorks"
        :activity-id="activeDetail.id"
        :tag-id="activeDetail.id"
        @cancleActivityChooseWorksDialog="isShowChooseWorks = false"
      />
    </transition>
    <div v-if="!$utilHelper.isEmptyObj(activeDetail) && currentIndex == 0" class="article">
      <div v-if="activeDetail.caution" class="title">介绍</div>
      <div v-if="activeDetail.caution" class="content">
        <span v-html="activeDetail.caution" />
      </div>
      <div v-if="activeDetail.activityEnabledAt" class="title">征稿时间</div>
      <div
        v-if="activeDetail.activityEnabledAt"
        class="content"
      >{{ activeDetail.activityEnabledAt | timeParse }} ~ {{ activeDetail.activityExpiredAt | timeParse }}</div>
      <div v-if="!activeDetail.awards" class="title">奖项设置</div>
      <div v-if="!activeDetail.awards" class="content">
        <div v-for="(item, index) in stageList" :key="index" class="oneAward">
          <strong>{{ item.name }}</strong>&nbsp;&nbsp;
          <strong>数量:</strong>
          {{ item.num }}&nbsp;&nbsp;
          <strong>奖品:</strong>
          {{ item.award }}&nbsp;&nbsp;
        </div>
      </div>
      <div class="contentNew">
        <span v-html="activeDetail.content" />
      </div>
    </div>
    <div class="auth_wrap">
      <poll
        v-if="currentIndex == 1"
        :stage-list="stageList"
        :stage="stage"
        :is-loading="isLoading"
        :active-detail="activeDetail"
      />
    </div>
    <!-- 作品列表 -->
    <div
      v-if="currentIndex == 2 || currentIndex == 3"
      class="work_wrap"
      :style="{ 'min-height': waterfallMinHeight + 'px' }"
    >
      <div class="waterfallContainer">
        <img-waterfall :img-list="imgList" :line="line" :is-to-paixin="false" :is-show-loading="false" />
      </div>
    </div>
    <!-- 作者列表 -->
    <div class="auth_wrap">
      <user-preview v-if="currentIndex == 4" :user-list="userList" />
    </div>
    <!-- <loading :is-loading="isLoading" :loading-color="'#000'" /> -->
    <pagination
      v-show="!isLoading && isShowPagination"
      style="margin: 64px 0 160px 0;"
      :base-url="'/activity/' + activeDetail.id + '/' + currentIndex + '/'"
      :line="line"
      @paginationJumpToPage="jumpToPage"
    />
  </div>
</template>

<script>
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'
import UserPreview from '~/components/user-preview/UserPreview'
import ChooseWorks from './publishOld/ChooseWorks'
import Pagination from '~/components/pagination/paginationQ'
import TopNav from '~/pages/activity/top-nav'
import Poll from './poll'

export default {
  name: 'ActivityDetail',
  filters: {
    timeParse(v) {
      var t = new Date(v)
      return `${t.getFullYear()}年 ${t.getMonth() + 1}月 ${t.getDate()}日`
    }
  },
  components: {
    ImgWaterfall,
    UserPreview,
    ChooseWorks,
    Pagination,
    Poll,
    TopNav
  },
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
    currentItem: 1,
    out: -1,
    is_activity: -1
  }),
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
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

      const lineArray = this.line.split(',')

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
    }
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
      const lineArray = this.line.split(',')

      lineArray[0] = val

      this.reload(lineArray.join(','))
    }
  },
  async asyncData({ $axios, params }) {
    const res_detail = await $axios.tagService.getTagDetail({
      tag_id: params.id
    })

    console.log(res_detail)

    let tempLine = params.page + ',0,0'

    const res_win = await $axios.mediaService.getAwardWinningList(
      { tag_id: params.id },
      { line: tempLine }
    )

    let tempStage = 0
    let tempStageList = []
    const tempUserList = []
    const tempImgList = []

    // 判断是否有获奖名单
    if (res_win.data.out == '1' && res_win.data.data.length > 0) {
      tempStage = '3'
      tempStageList = res_win.data.data
    }

    const tempIndex = parseInt(params.table)
    if (tempLine.split(',')[0] != 'end') {
      if (tempIndex == 1) {
        if (tempStage != '3') {
          const res_stageWorks = await $axios.mediaService.getPollList(
            { tag_id: params.id, vote: '1' },
            { line: tempLine, limit: '40' }
          )
          if (res_stageWorks.data.out == '1') {
            tempStageList.push(...res_stageWorks.data.data)
            tempLine =
              res_stageWorks.data.line !== 'end'
                ? res_stageWorks.data.line
                : params.page + ',0,0'
          }
        }
      }
      if (tempIndex == 2) {
        const res_recommendWorks = await $axios.mediaService.recommendInTagList(
          { tag_id: params.id },
          { type: 1 }
        )
        if (res_recommendWorks.status == 200) {
          tempImgList.push(...res_recommendWorks.data.content)
          tempImgList.forEach(
            v => {
              v.image_width = v.mediaWidth
              v.image_height = v.mediaHeight
              v.user_id = v.userId
            }
          )
        }
      }
      if (tempIndex == 3) {
        const res_allWorks = await $axios.mediaService.inTagList(
          { tag_id: params.id },
          { line: tempLine, limit: '40' }
        )
        if (res_allWorks.data.out == '1') {
          tempImgList.push(...res_allWorks.data.data)
          tempLine =
            res_allWorks.data.line !== 'end'
              ? res_allWorks.data.line
              : params.page + ',0,0'
        }
      }
      if (tempIndex == 4) {
        const res_authors = await $axios.tagService.getJoinUser(
          { tag_id: params.id },
          { line: tempLine, limit: '40' }
        )
        if (res_authors.data.out == '1') {
          tempUserList.push(...res_authors.data.data)
          tempLine =
            res_authors.data.line !== 'end'
              ? res_authors.data.line
              : params.page + ',0,0'
        }
      }
    }

    return {
      activeDetail: res_detail.data,
      out: res_detail.data.id ? '1' : '0',
      is_activity: res_detail.data.activity ? '1' : '0',
      now: !(new Date().getTime() - new Date(res_detail.data.activityExpiredAt).getTime() > 0),
      line: tempLine,
      stage: tempStage,
      stageList: tempStageList,
      currentIndex: tempIndex,
      userList: tempUserList,
      imgList: tempImgList
    }
  },
  created() {
    if (this.out != '1' || this.is_activity != '1') {
      // 跳转至根目录

      this.$router.push('/')
      return false
    }
    this.$bus.on('cancel', e => {
      this.isShowChoose = false
    })
  },
  methods: {
    toPublish() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }
      this.isShowChoose = !this.isShowChoose
    },
    publishNew() {
      this.$store.commit('upload/isShowUploadDialog', true)
      this.$store.commit('upload/uploadActivity', this.activeDetail)
      this.isShowChoose = false
    },
    publishOld() {
      this.isShowChoose = false

      this.isShowChooseWorks = true
    },
    jumpToPage(line) {
      this.$router.push({
        name: 'activity-id-table-page',
        params: {
          id: this.$route.params.id,
          table: this.currentIndex + '',
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
    }
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
