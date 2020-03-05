<template>
  <div class="notification">
    <div class="table-nav" :options="titles" @updateTableIndex="tableChanged">
      <div class="content">
        <div class="sideOptionList">
          <div
            v-for="(c, i) in chooses"
            :key="i"
            class="choose"
            :style="{ 'background': i == chooseIndex ? 'rgba(0,0,0,0.05)' : '',
                      'color': i == chooseIndex ? '#000' : '' }"
            @click="choose(i)"
          >
            <span>{{ c }}</span>
            <div class="redDot" />
          </div>
        </div>
        <div v-if="isNoContent">
          <no-content :is-no-content-show="true" />
        </div>
        <div class="list_wrap">
          <activityList v-if="chooseIndex >= 0 && chooseIndex <= 2" :list="list" />
          <noticeList v-if="chooseIndex == 3" :list="list" />
          <div v-if="line!='end'&&list.length > 0" class="more" @click="more">查看更多</div>
          <!-- 已加载全部 -->
          <div v-if="line=='end'&&list.length > 0" class="end">- 7mx -</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoContent from '~/components/no-content/NoContent'
import activityList from '~/components/notification_children/activityList/index'
import noticeList from '~/components/notification_children/noticeList/index'

export default {
  name: 'Notification',
  components: {
    'no-content': NoContent,
    activityList,
    noticeList
  },
  data: () => ({
    isNoContent: false,
    titles: ['评论通知'],
    chooses: ['评论', '喜欢', '关注', '通知', '心愿单'],
    tableIndex: 0,
    chooseIndex: 0,
    // 通知列表
    list: [],
    line: '',
    currentPage: 0,
    totalPages: 1
  }),
  head() {
    return {
      title: '通知 - 7MX 中国领先的视觉创作社区'
    }
  },
  mounted() {
    this.getCommentList()
  },
  methods: {
    tableChanged(i) {
      this.tableIndex = i
    },
    choose(i) {
      this.chooseIndex = i == undefined ? this.chooseIndex : i
      this.titles[0] = this.chooses[this.chooseIndex] + '通知'
      this.titles.splice(this.titles.length)
      this.resetData(i)
      if (this.chooseIndex == 0) {
        this.getCommentList()
      } else if (this.chooseIndex == 1) {
        this.getLikeList()
      } else if (this.chooseIndex == 2) {
        this.getFollowList()
      } else if (this.chooseIndex == 3) {
        this.getNoticeList()
      } else if (this.chooseIndex == 4) {
        this.wantToShopList()
      }
    },
    more() {
      this.choose()
    },
    // 评论列表
    async getCommentList() {
      const res = await this.$axios.userService.getactivityList({ type: 1 }, { page: this.currentPage })
      this.afterPull(res)
      this.nothing()
    },
    // 喜欢列表
    async getLikeList() {
      const res = await this.$axios.userService.getactivityList({ type: 2 }, { page: this.currentPage })
      this.afterPull(res)
      this.nothing()
    },
    // 关注列表
    async getFollowList() {
      const res = await this.$axios.userService.getactivityList({ type: 3 }, { page: this.currentPage })
      this.afterPull(res)
      this.nothing()
    },
    // 愿望单列表
    async wantToShopList() {
      const res = await this.$axios.userService.getactivityList({ type: 4 }, { page: this.currentPage })
      this.$axios.commonService.markNeededAsRead()
      this.afterPull(res)
      this.nothing()
    },
    // 通知列表
    async getNoticeList() {
      const res = await this.$axios.commonService.getNoticeList({}, { line: this.line })
      // 标识为已读
      this.$axios.commonService.markNoticeAsRead()
      this.afterPull(res)
      this.nothing()
    },
    resetData(i) {
      // 切换标签 重置, 不切换标签则是获取更多
      if (i != undefined) {
        this.list = []
        this.line = ''
      }
      this.isNoContent = false
    },
    afterPull(res) {
      if(res.status == 200) {
        this.list.push(...res.data.content)
        this.totalPages = res.data.totalPages
        this.currentPage++
        // this.line = res.data.line
      }
    },
    // 当没有返回结果时
    nothing() {
      if (!this.list || this.list.length == 0) {
        this.isNoContent = true
        this.list = []
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.notification {
  .content {
    width: 1200px;
    margin: 40px auto;
    .sideOptionList {
      width: 200px;
      text-align: center;
      float: left;
      .choose {
        margin-bottom: 10px;
        line-height: 40px;
        height: 40px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
        transition: all 0.2s;
        &:hover {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
        }
      }
    }
  }
  .list_wrap {
    margin-left: 260px;
    width: 700px;
  }
  .no-content {
    margin-top: 180px;
  }
  .more {
    text-align: center;
    line-height: 2;
    width: 100px;
    background: rgba(0, 0, 0, 0.06);
    cursor: pointer;
    border-radius: 100px;
    margin: 0 auto;
    font-size: 0.9rem;
    margin-bottom: 30px;
    color: rgba(0, 0, 0, 0.5);
    transition: all 0.2s;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.7);
    }
  }
  .end {
    text-align: center;
    line-height: 2;
    color: rgba(0, 0, 0, 0.2);
    padding-bottom: 30px;
  }
}
</style>
