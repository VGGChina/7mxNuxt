<template>
  <div class="activity">
    <table-nav :options="options" :default-index="tableIndex" @updateTableIndex="tableChanged" />
    <div v-show="tableIndex != 2" class="activity-list">
      <div v-for="(item, index) in currentListShow" :key="index" class="card">
        <nuxt-link
          :to="{ name: 'activity-id-table-page', params: { id : item.id, table: '3', page: '1' } }"
        >
          <div class="bg" :title="item.name">
            <div :style="{ 'backgroundImage': `url(${item.image})` }" />
          </div>
          <div class="content">
            <div class="title">{{ item.name }}</div>
            <div v-if="item.about" class="subtitle" :title="item.about">
              <img src="./img/trophy.jpg" alt="">
              <div>{{ item.about }}</div>
            </div>
            <div v-if="item.time" class="time">
              <img src="./img/time.jpg" alt="">
              <div>
                <span class="time_text">{{ item.time }}</span>
              </div>
            </div>
            <div v-if="item.id" class="button">立即查看</div>
          </div>
        </nuxt-link>
      </div>
      <div class="clear" />
    </div>
    <div v-show="tableIndex == 2" class="apply-act">
      <p>如果您是摄影比赛主办方，需要在7MX举办活动并征稿，请点击下方”咨询客服”按钮将您的活动需求告诉我们。</p>
      <a href="http://q.url.cn/CDzAE8?_type=wpa&qidian=true" target="_blank">咨询客服</a>
    </div>
    <div v-if="currentListShow.length < 1 && !isLoading" style="position: relative">
      <no-content :is-no-content-show="true" />
    </div>
  </div>
</template>
<script>
import TableNav from '~/components/table/TableNav'
import NoContent from '~/components/no-content/NoContent'

export default {
  name: 'Activity',
  components: {
    TableNav,
    'no-content': NoContent
  },
  data: () => ({
    navList: [
      {
        id: 1,
        title: '活动介绍'
      },
      {
        id: 2,
        title: '推荐作品'
      },
      {
        id: 3,
        title: '302全部作品'
      },
      {
        id: 4,
        title: '84人'
      }
    ],
    options: [
      {
        name: '全部活动',
        url: ''
      },
      {
        name: '正在进行',
        url: ''
      },
      {
        name: '申请活动',
        url: ''
      }
    ],
    tableIndex: 0,
    activities: [],
    isLoading: false,
    currentItem: 1
  }),
  computed: {
    isToPaixin() {
      if (this.currentItem == 2) {
        return true
      } else {
        return false
      }
    },
    currentListShow() {
      if (this.tableIndex == 0) {
        return this.activities
      } else if (this.tableIndex == 1) {
        return this.activities.filter(e => e.time != '此活动已结束')
      } else if (this.tableIndex == 2) {
        return this.activities.filter(e => e.time == '此活动已结束')
      }
    }
  },
  watch: {},
  async asyncData({ $axios }) {
    const res = await $axios.tagService.getActivityList()
    res.data.data.map(e => {
      if (new Date().getTime() - e.close_time * 1000 > 0) {
        e.time = '此活动已结束'
      } else {
        e.time = `距活动截止还剩 ${-Math.floor(
          (new Date().getTime() - e.close_time * 1000) / 24 / 60 / 60 / 1000
        )} 天`
      }
    })
    return {
      activities: res.data.data
    }
  },

  methods: {
    tableChanged(index) {
      this.tableIndex = index
    },

    judgePage() {
      this.tableIndex = this.$route.params.page
    }
  }
}
</script>

<style lang='scss' scoped>
.activity {
  position: relative;
  .pic-nav {
    text-align: center;
    height: 80px;
    border-bottom: 1px solid #eee;
    a {
      display: inline-block;
      height: 80px;
      line-height: 80px;
      cursor: pointer;
      font-size: 20px;
      font-weight: 400;
      color: #888;
      margin: 0 30px;
    }
  }
}
.waterfallContainer {
  width: 1320px;
  margin: 0 auto;
}
.activity-list {
  margin: 0 auto;
  margin-top: 40px;
  width: 1200px;
  .card {
    cursor: pointer;
    float: left;
    width: 376px;
    height: 380px;
    margin: 0 12px;
    box-sizing: border-box;
    margin-bottom: 30px;
    &:hover {
      .bg div {
        transform: scale(1.08);
      }
    }
    .bg {
      height: 230px;
      overflow: hidden;
      div {
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transition: all 4s;
      }
    }
    .content {
      .title {
        opacity: 0.8;
        line-height: 2;
        font-size: 18px;
        font-weight: 400;
        color: #1a1a1a;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .subtitle {
        opacity: 0.5;
        font-size: 14px;
        margin-top: 4px;
        line-height: 1.6;
        color: #1a1a1a;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        img {
          position: absolute;
          left: 0;
          top: 4px;
          width: 18px;
        }
        div {
          padding-left: 24px;
        }
      }
      .time {
        opacity: 0.5;
        font-size: 14px;
        margin-top: 6px;
        color: #1a1a1a;
        position: relative;
        img {
          position: absolute;
          left: 0;
          top: -1px;
          width: 18px;
        }
        div {
          padding-left: 24px;
        }
        .time_text {
          padding: 0 6px;
          background: #ffd1d1;
          color: #ce3a3a;
        }
      }
      .button {
        margin-top: 16px;
        font-size: 16px;
        color: #4dbd83;
        text-align: left;
        &:hover {
          color: #40aa73;
        }
      }
    }
  }
}

.apply-act {
  width: 600px;
  height: 400px;
  margin: 200px auto 0 auto;

  p {
    font-size: 1.2rem;
    line-height: 2;
  }

  a {
    display: block;
    width: 200px;
    height: 40px;
    outline: none;
    border-radius: 8px;
    border: none;
    background: #4dbd83;
    color: #fff;
    font-size: 0.9rem;
    margin: 40px auto 0 auto;
    text-align: center;
    line-height: 40px;
  }
}
</style>
