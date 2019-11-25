<template>
  <div class="income">
    <div class="clear" />
    <div class="main_menu">
      <div class="menu_container">
        <div class="user_info">
          <div class="clear" />
          <div
            class="avartar"
            :style="{
              'backgroundImage': 'url(' + ($utilHelper.getCompressionUrl(loginUser.avatar, 300, 300) ||
                require('~/assets/img/avatar-default.svg')) + ')'
            }"
          />
          <div class="name">{{ loginUser.nick || loginUser.name }}</div>
          <div class="num_info">
            <div class="intro all_pics">
              <div class="num">{{ sellDataLeft.media_num || 0 }}张</div>
              <div class="type">全部作品</div>
            </div>
            <div class="intro on_sell">
              <div class="num">{{ sellDataLeft.product_num || 0 }}张</div>
              <div class="type">上架作品</div>
            </div>
            <div class="intro income_num">
              <div class="num">{{ sellDataLeft.total_gain / 100 || 0 }}元</div>
              <div class="type">累计收益</div>
            </div>
            <div class="clear" />
          </div>
        </div>
        <div class="channel_entry">
          <div
            v-for="(item, i) in menuList"
            :key="item.id"
            class="button"
            :class="[ currentIndex == i ? 'selected' : '' ]"
            @click="choose(item, i)"
          >{{ item.name }}</div>
          <div class="button-green sell-image" @click="wantToSell">我要售图</div>
          <div class="contact">
            <a href="//q.url.cn/CDzAE8?_type=wpa&qidian=true" target="_blank">
              <div class="button">联系客服</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 订单详情 -->
    <div v-show="currentIndex != 1" class="detail">
      <div class="top_bar">
        <div
          class="button onSell"
          :style="{
            background: currentList == 0 ? 'rgba(0,0,0,0.06' : 'rgba(0,0,0,0)'
          }"
          @click="onClickSell(0)"
        >已上架</div>
        <div
          class="button order"
          :style="{
            background: currentList == 1 ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0)'
          }"
          @click="onClickSell(1)"
        >订单</div>
      </div>
      <div v-scroll="fetchData" class="item_wrap">
        <list :detail-list="detailList" :end="line" />
        <div v-if="detailList.length < 1">
          <no-content
            :is-no-content-show="detailList.length < 1 && !loading && line == 'end'"
            :content="noContentText"
          />
        </div>
      </div>
    </div>
    <!-- 提现 -->
    <withdraw v-show="currentIndex == 1" :user="loginUser" />
  </div>
</template>

<script>
import NoContent from '~/components/no-content/NoContent'
import list from './list/index'
import withdraw from './withdraw/index'

export default {
  name: 'Income',
  head() {
    return {
      title: '收益中心 - 7MX 中国领先的视觉创作社区'
    }
  },
  components: {
    'no-content': NoContent,
    list: list,
    withdraw: withdraw
  },
  data: () => ({
    menuList: [
      { name: '我的订单', id: 'orders' },
      { name: '我要提现', id: 'withdraw' },
      { name: '如何卖图', id: 'how_to_sell' }
    ],
    // 订单列表
    detailList: [],
    line: '',
    sellDataLeft: {},
    // 左侧那个menuList
    currentIndex: 0,
    currentList: 0,
    loading: false
  }),
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    },
    isLogin() {
      return this.$store.state.login.isLogin
    },
    noContentText() {
      return this.currentList == 0 ? 'Sorry, 没有上架作品' : 'Sorry, 暂无订单'
    }
  },
  watch: {
    currentList(val) {
      this.reload()
    }
  },
  created() {
    if (!this.$utilHelper.isEmptyObj(this.loginUser)) {
      this.getSellNum()
      this.fetchData()
    }
    if (this.isLogin) {
      this.getSellNum()
      this.fetchData()
    }
    // this.$bus.on('loginSuccessful', loginUser => {
    //   this.getSellNum()
    //   this.fetchData()
    // })
  },
  methods: {
    /**
     * 我要售图
     */
    wantToSell() {
      this.$router.push({ name: 'contributor' })
    },
    giveMeMoney() {
      // this.$toast.notice('目前提现请联系客服');
    },
    /**
     * 切换左侧标签
     */
    choose(item, i) {
      if (item.name === '如何卖图') {
        this.showHowToSell()
        return
      } else if (item.name === '我要提现') {
        this.giveMeMoney()
      }
      this.currentIndex = i
    },
    onClickSell(index) {
      if (this.loading) {
        return
      }

      this.currentList = index
    },
    fetchData() {
      if (this.line === 'end') return

      if (this.loading) return

      this.loading = true

      if (this.currentList == 0) {
        this.getOnSellList()
      } else if (this.currentList == 1) {
        this.getOrderList()
      }
    },
    reload() {
      if (this.loading) {
        return
      }

      this.detailList = []

      this.line = ''

      this.fetchData()
    },
    /**
     * 如何卖图
     */
    showHowToSell() {
      this.$store.commit('help/help_show', { current: { index: 1, subIndex: -1 }})
    },
    /**
     * 图数 售卖数 利润
     */
    async getSellNum() {
      const res = await this.$axios.userService.getSellNum()
      this.sellDataLeft = res.data.data
    },
    /**
     * 正在卖的列表
     */
    async getOnSellList() {
      const params = { line: this.line, limit: 24 }
      const data = {
        product: '1',
        user_id: this.loginUser.gaga_id
      }

      const res = await this.$axios.mediaService.originList(data, params)

      this.afterListPull(res)
    },
    /**
     * 订单列表
     */
    async getOrderList() {
      const params = { line: this.line }

      const res = await this.$apiFactory.userService.getOrderList({}, params)

      this.afterListPull(res)
    },
    /**
     * 获取数据后续处理
     */
    afterListPull(res) {
      if (res.data.out === '1') {
        this.detailList.push(...res.data.data)
      }

      this.loading = false

      this.line = res.data.line
    }
  }
}
</script>

<style lang='scss' scoped>
.income {
  .main_menu {
    width: 340px;
    background: #f5f5f5;
    height: calc(100vh - 59px);
    position: fixed;
    // border-right: 1px solid rgba(0, 0, 0, .04);
    .menu_container {
      height: 100%;
      width: 100%;
      overflow-y: auto;
    }
    .user_info {
      width: 100%;
      .avartar {
        width: 90px;
        height: 90px;
        margin: 20px auto;
        border: 4px solid rgba(255, 255, 255, 0.8);
        border-radius: 100px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .name {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        line-height: 2;
        padding-bottom: 10px;
      }
      .num_info {
        width: 90%;
        margin: 0 auto;
        .intro {
          float: left;
          width: 33.33%;
          height: 70px;
          text-align: center;
          .num {
            font-size: 20px;
            font-weight: 600;
            line-height: 32px;
            padding-bottom: 4px;
          }
          .type {
            color: rgba(0, 0, 0, 0.5);
            font-size: 12px;
          }
        }
      }
    }
    .channel_entry {
      width: 100%;
      margin-top: 20px;
      margin-bottom: 80px;
      .button {
        cursor: pointer;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 300px;
        margin: 0 auto;
        border-radius: 10px;
        margin-bottom: 6px;
        &:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
      }
    }
  }
  .detail {
    position: absolute;
    left: 340px;
    top: 0;
    width: calc(100% - 340px);
    min-height: 98vh;
    .top_bar {
      height: 60px;
      margin-top: 60px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      position: fixed;
      width: calc(100% - 340px);
      background: #fff;
      z-index: 1;
      .button {
        width: 100px;
        height: 30px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        line-height: 30px;
        font-size: 0.9rem;
        letter-spacing: 1px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.8);
        text-align: center;
        transform: translateY(15px);
        float: left;
        border-radius: 0;
      }
      .button.onSell {
        margin-left: 20px;
      }
      .button.order {
        border-left: none;
      }
    }
    .item_wrap {
      margin-top: 121px;
      position: relative;
    }
  }
}

.selected {
  background-color: rgba(0, 0, 0, 0.04);
}

.sell-image {
  width: 300px;
  height: 52px;
  line-height: 52px;
  position: fixed;
  bottom: 82px;
  left: 20px;
  border-radius: 8px;
}

.contact {
  position: fixed;
  width: 340px;
  opacity: 0.9;
  left: 0;
  bottom: 0;
  text-align: center;
  height: 80px;
  // background: rgba(255,255,255,.9);
  transition: all 0.3s;
  &:hover {
    opacity: 1;
  }
  .button {
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.5);
    margin-top: 13px !important;
    a {
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
