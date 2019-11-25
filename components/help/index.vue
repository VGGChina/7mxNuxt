<template>
  <transition name='opacity'>
    <div class="help" v-show='show'>
      <div class="bg" @click='cancel'>
        <transition name='fade_help'>
          <div class="content" v-if='show'>
            <div class="choose">
              <div class="itemSideBar" v-if='item.data&&item.data.length>0' @click ='chooseIndex(i)' v-for='(item, i) in indexList' :class="[current.index == i ? 'currentIndex' : '' ]" :key="i">
                <img class="icon" :src = 'item.icon' />
                <span class="text"> {{ item.category }}</span>
                <div class="right-green"></div>
              </div>
              <div class="contact">
                <a href='//q.url.cn/CDzAE8?_type=wpa&qidian=true' target='_blank' />
                <img src='./img/qq2.svg' />
              </div>
            </div>
            <div class="context">
              <div class="questionList" v-if='current.subIndex == -1'>
                <div class="clear" style='height:1px'></div>
                <div class="title" v-if='indexList[current.index]'>{{ indexList[current.index].category }}相关问题</div>
                <div class="questions" v-if='indexList[current.index]'>
                  <div class="question" @click='toQuestion(i)' v-for='(item, i) in indexList[current.index].data' :key='i'>
                    <span>{{ item.category }}</span>
                    <div class="openPoint">·</div>
                  </div>
                </div>
                <div class="contactTip">
                  您的问题不在此列? &nbsp;
                  <a class="toQQ" href='//q.url.cn/CDzAE8?_type=wpa&qidian=true' target='_blank'></a>
                </div>
                <img class="cute0" src='./img/paixin_cute_0.png'>
                <img class="cute" src='./img/paixin_cute_1.png'>
              </div>
              <div class="questionDetail" v-if='current.subIndex != -1'>
                <div class="subIndex">{{ this.articleTitle }}</div>
                <div class="content_wrap" v-html='questionDetail'></div>
                <div class="nomore">—— & ——</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>


<script>
import { mapState } from 'vuex'

export default {
  name: 'HelpCenter',
  data: () => ({
    indexList: [],
    questionDetail: ''
  }),
  watch: {
    show(n, o) {
      if (n) this.init()
    }
  },
  created() {
    console.log(11111)
    // 兼容页面一打开就通过路由直接打开帮助中心的情况
    if (this.show) this.init()
  },
  mounted() {},
  methods: {
    chooseIndex(i) {
      this.$store.dispatch('helpShow', { current: { index: i, subIndex: -1 } })
    },
    toQuestion(i) {
      this.$store.dispatch('helpShow', {
        current: { index: this.current.index, subIndex: i }
      })
      this.pullQuestionDetail()
    },
    cancel() {
      this.$store.dispatch('helpShow', { show: false })
    },
    async pullHelpList() {
      if (this.indexList.length > 1) return
      const res = await this.$axios.commonService.getManualList()
      res.data.data.map((ele, i) => {
        if (ele.category === '用户') {
          ele.icon = require('./img/user.svg')
        } else if (ele.category === '售图') {
          ele.icon = require('./img/pic.svg')
        } else if (ele.category === '分成') {
          ele.icon = require('./img/rmb.svg')
        } else if (ele.category === '定制') {
          ele.icon = require('./img/cust.svg')
        } else if (ele.category === '活动') {
          ele.icon = require('./img/award.svg')
        } else if (ele.category === '上传' || ele.category === '关键词') {
          ele.icon = require('./img/upload.svg')
        } else {
          ele.icon =
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        }
        this.indexList.push(ele)
      })
      this.indexList.splice(this.indexList.length)
    },
    async pullQuestionDetail() {
      if (this.noQusetion()) return
      const id = this.indexList[this.current.index].data[this.current.subIndex]
        .id
      if (!id) return
      const res = await this.$axios.commonService.getQuestionDetail({ id: id })
      this.questionDetail = res.data.data.content
    },
    noQusetion() {
      if (
        !this.show ||
        this.current.subIndex == -1 ||
        !this.indexList[this.current.index] ||
        !this.indexList[this.current.index].data ||
        !this.indexList[this.current.index].data[this.current.subIndex]
      )
        return true
      return false
    },
    async init() {
      await this.pullHelpList()
      this.pullQuestionDetail()
    }
  },
  computed: {
    show() {
      return this.$store.state.help.show
    },
    current() {
      return this.$store.state.help.current
    },
    articleTitle() {
      if (this.noQusetion()) return
      return this.indexList[this.current.index].data[this.current.subIndex]
        .category
    }
  }
}
</script>

<style lang='scss' scoped>
.fade_help-enter-active,
.fade_help-leave-active {
  transition: all 0.5s;
}

.fade_help-enter,
.fade_help-leave-active {
  opacity: 0;
  transform: translate3d(0, -70px, 0);
}

.help {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.2);
}

.content {
  width: calc(100% - 300px);
  min-width: 1200px;
  height: 80%;
  min-height: 660px;
  // background: #ffffff;
  border-radius: 10px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.top {
  height: 60px;
  background: #fff;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  .logo {
    position: absolute;
    left: 0;
    top: 0;
    width: 126px;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    .logo_icon {
      width: 28px;
      margin-top: -4px;
      margin-left: 26px;
    }
    .logo_text {
      font-size: 1.2rem;
      font-weight: 800;
      padding-left: 4px;
      line-height: 60px;
    }
  }
  .currentTitle {
    position: absolute;
    left: 150px;
    line-height: 60px;
    color: rgba(0, 0, 0, 0.6);
    > span {
      display: block;
      float: left;
    }
    .openPoint {
      line-height: 56px;
      font-size: 2rem;
      color: rgba(107, 228, 130, 1);
    }
    .index {
      line-height: 60px;
      padding-left: 10px;
    }
  }
}

.choose {
  width: 160px;
  height: 100%;
  background: rgba(242, 242, 242, 0.98);
  padding-top: 40px;
  box-sizing: border-box;
  position: relative;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  .contact {
    position: absolute;
    width: 56px;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    img {
      transition: all 0.3s;
      opacity: 0.7;
    }
    &:hover {
      img {
        transform: scale(1.06);
        opacity: 0.9;
      }
    }
  }
  .currentIndex {
    position: relative;
    img.icon {
      opacity: 1 !important;
    }
    span.text {
      color: rgba(0, 0, 0, 1) !important;
    }
    .right-green {
      width: 4px;
      height: 24px;
      background: rgba(107, 228, 130, 1);
      position: absolute;
      right: 0;
      top: 12px;
    }
  }
  .itemSideBar {
    width: 100%;
    padding-left: 46px;
    line-height: 3;
    font-size: 1rem;
    box-sizing: border-box;
    img.icon {
      width: 22px;
      opacity: 0.4;
      transition: all 0.3s;
      margin-top: 13px;
      float: left;
    }
    span.text {
      padding-left: 8px;
      color: rgba(0, 0, 0, 0.4);
      transition: all 0.3s;
    }

    &:hover {
      cursor: pointer;
      img.icon {
        opacity: 0.6;
      }
      span.text {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}

.context {
  width: calc(100% - 160px);
  height: 100%;
  position: absolute;
  left: 160px;
  top: 0px;
  overflow-y: auto;
  // padding-right: 20px;
  background: #fefefe;
  .questionList {
    .title {
      margin-top: 60px;
      font-size: 1.4rem;
      text-align: center;
      color: rgba(0, 0, 0, 0.7);
    }
    .cute0 {
      margin: 0 auto;
      display: block;
      width: 80px;
      opacity: 1;
    }
    .cute {
      margin: 0 auto;
      display: block;
      width: 100px;
      margin-bottom: 100px;
      opacity: 0.8;
    }
  }
  .questions {
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-left: 2px solid rgb(83, 228, 135);
    width: 500px;
    margin: 0 auto;
    margin-top: 50px;
    background: #fff;
    transform: rotate(0);
    box-shadow: 0 2px 30px rgba(0, 0, 0, 0.05);
    .question {
      color: rgba(0, 0, 0, 1);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      font-size: 14px;
      line-height: 60px;
      padding-left: 20px;
      position: relative;
      // transition: all .05s;
      &:hover {
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
      }
      .openPoint {
        display: none;
        position: absolute;
        right: 16px;
        top: 0;
        font-size: 2rem;
        color: rgba(107, 228, 130, 1);
        line-height: 58px;
      }
      &:hover {
        cursor: pointer;
        color: #000;
        .openPoint {
          display: block;
        }
      }
    }
  }
  .contactTip {
    width: 300px;
    background: rgba(0, 0, 0, 0.06);
    line-height: 30px;
    border-radius: 100px;
    height: 30px;
    padding: 10px;
    margin: 0 auto;
    margin-top: 40px;
    text-align: center;
    // box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
    color: rgba(0, 0, 0, 0.5);
    a {
      color: #6daaf3;
    }
  }
}
.nomore {
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: 1.2rem;
  opacity: 0.2;
  user-select: none;
}
</style>

<style lang='scss'>
.questionDetail {
  padding: 60px 30px;
  padding-top: 44px;
  a {
    color: #50a3f3;
    text-decoration: none;
  }
  .subIndex {
    font-size: 20px;
    line-height: 40px;
    font-weight: 800;
    margin-bottom: 30px;
  }
  .content_wrap {
    line-height: 2;
    img {
      max-width: 100%;
      margin: 20px 0;
      margin-bottom: 40px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
      display: block;
    }
  }
}
</style>
