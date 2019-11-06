<template>
  <div class="push-notifi" @click.stop="noUse">
    <div class="array_wrap">
      <div class="array" />
    </div>
    <div class="tabs">
      <div :style="{ 'color' : selectedIndex==0 ? '#000' : '' }" class="normal" @click="select(0)">
        动态
        <div v-if="loginUser.un_comment_num * 1 + loginUser.un_fan_num * 1 + loginUser.un_like_num * 1" class="tip" />
      </div>
      <div :style="{ 'color' : selectedIndex==1 ? '#000' : '' }" class="normal" @click="select(1)">
        心愿单
        <!-- <div v-if='loginUser.un_needed_num * 1' class="tip"></div> -->
      </div>
      <div :style="{ 'color' : selectedIndex==2 ? '#000' : '' }" class="normal" @click="select(2)">
        通知
        <div v-if="loginUser.un_notice_num * 1" class="tip" />
      </div>
    </div>
    <div class="content_wrap">

      <!--         没内容          -->
      <div v-if="isNoContent" class="no_content_wrap">
        <noContent :is-no-content-show="true" :content="nothingTip" />
      </div>

      <!--          内容            -->
      <!-- 动态 -->
      <activityList v-if="selectedIndex==0" :list="list" />
      <!-- 心愿单 -->
      <needed-list v-if="selectedIndex==1" :list="list" />
      <!-- 通知 -->
      <notice-list v-if="selectedIndex==2" :list="list" />

      <div v-if="line!=&quot;end&quot;&&list.length > 0" class="more" @click="more">查看更多</div>
      <!-- 已加载全部 -->
      <div v-if="line==&quot;end&quot;&&list.length > 0" class="end">- 7mx -</div>
    </div>
    <div class="to_all">
      <span @click="toAll">查看全部</span>
    </div>
  </div>
</template>

<script>
import noContent from '~/components/no-content/NoContent_2'
import activityList from './activityList/index'
import neededList from './neededList/index'
import noticeList from './noticeList'
import apiFactory from '~/api/factory/apiFactory.js'

export default {
  name: 'PushNotifi',
  components: {
    noContent,
    activityList,
    neededList,
    noticeList
  },
  data: () => ({
    selectedIndex: 0,
    isNoContent: false,
    line: '',
    list: []
  }),
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    },
    nothingTip() {
      const i = this.selectedIndex
      if (i == 0) {
        return '没有新的动态'
      } else if (i == 1) {
        return '没有新的购买意向信息'
      } else if (i == 2) {
        return '暂未收到通知'
      }
      return '暂无消息'
    }
  },
  watch: {},
  created() {
    this.select(0)
  },
  mounted() {

  },
  methods: {
    noUse() {
    },
    select(i) {
      this.selectedIndex = i == undefined ? this.selectedIndex : i
      this.resetData(i)
      this.clearRedDot(i)
      if (this.selectedIndex == 0) {
        this.activityList()
      } else if (this.selectedIndex == 1) {
        this.wantToShopList()
      } else if (this.selectedIndex == 2) {
        this.noticeList()
      }
    },
    toAll() {
      this.$router.push({ name: 'notification' })
      this.$bus.emit('cancel', '')
    },
    resetData(i) {
      // 切换标签 重置, 不切换标签则是获取更多
      if (i != undefined) {
        this.list = []
        this.line = ''
      }
      this.isNoContent = false
    },
    // 清除红点
    clearRedDot(i) {
      if (i == undefined) return
      if (i == 0) {
        this.loginUser.un_comment_num = 0
        this.loginUser.un_fan_num = 0
        this.loginUser.un_like_num = 0
      } else if (i == 1) {
        this.loginUser.un_needed_num = 0
      } else if (i == 2) {
        this.loginUser.un_notice_num = 0
      }
    },
    more() {
      this.select()
    },
    // 动态列表
    async activityList() {
      const res = await apiFactory.getUserApi().getactivityList({}, { line: this.line })
      // 标识为已读
      apiFactory.getCommonApi().markActivityAsRead()
      apiFactory.getCommonApi().markNeededAsRead()
      this.afterPull(res)
      this.nothing()
    },
    // 心愿单列表
    async wantToShopList() {
      const res = await apiFactory.getUserApi().getactivityList({ type: 4, unread: 0 }, { line: this.line })
      apiFactory.getCommonApi().markNeededAsRead()
      this.afterPull(res)
      this.nothing()
    },
    // 通知列表
    async noticeList() {
      const res = await apiFactory.getCommonApi().getNoticeList({}, { line: this.line })
      // 标识为已读
      apiFactory.getCommonApi().markNoticeAsRead()
      this.afterPull(res)
      this.nothing()
    },
    afterPull(res) {
      this.list.push(...res.data.data)
      this.line = res.data.line
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
.push-notifi {
  width: 360px;
  min-height: 460px;
  background: #fff;
  position: absolute;
  right: 67px;
  top: 59px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  transform: translate3d(0, 0, 0);
}
.array_wrap {
  width: 40px;
  height: 20px;
  overflow: hidden;
  position: absolute;
  right: 20px;
  top: -20px;
  .array {
    background: #fff;
    width: 20px;
    height: 20px;
    transform: rotate(45deg) translate(10px, 10px);
    border-radius: 4px;
    position: absolute;
    left: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  }
}
.tabs {
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .normal {
    position: relative;
    .tip {
      width: 6px;
      height: 6px;
      border-radius: 100px;
      background: #ff365d;
      position: absolute;
      top: 16px;
      right: 16px;
    }
  }
  > * {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    width: 27%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
    transition: all 0.3s;
    color: rgba(0, 0, 0, 0.5);
    user-select: none;
    &:hover {
      color: #000;
    }
  }
}
.no_content_wrap {
  width: 100%;
  height: 200px;
  margin-top: 80px;
}
.content_wrap {
  min-height: 350px;
  max-height: 560px;
  overflow-y: auto;
  width: 100%;
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
.to_all {
  text-align: center;
  line-height: 50px;
  font-size: 0.95rem;
  letter-spacing: 1px;
  span {
    color: rgba(0, 0, 0, 0.5);
    &:hover {
      cursor: pointer;
      text-decoration: underline !important;
    }
  }
}
</style>
