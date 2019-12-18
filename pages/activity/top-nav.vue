<template>
  <div class="top-nav-container">
    <div class="top-nav-content">
      <div class="left-pic">
        <img :src="avatar" alt="">
      </div>
      <div class="right-text">
        <span>活动名称</span>
        <h3>{{active_list.name}}</h3>
        <span>活动简介</span>
        <p>{{active_list.about}}</p>
        <i>{{active_list.activityEnabledAt | timeForamt }}-{{active_list.activityExpiredAt | timeForamt}}</i>
        <a href="javascript:void(0);" @click.stop="toPublish">{{match_actiove}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['activeDetailImg', 'activeDetail'],
  data() {
    return {}
  },
  filters: {
    timeForamt(timer) {
      let dt = new Date(timer),
        y = dt.getFullYear(),
        m = dt.getMonth() + 1,
        d = dt.getDate()
      return `${y}年${m}月${d}日`
    }
  },
  methods: {
    toPublish() {
      if (this.match_actiove === '我要参赛') {
        this.$emit('toPublish')
      }
    }
  },
  computed: {
    avatar: function() {
      return this.activeDetailImg
    },
    active_list: function() {
      return this.activeDetail
    },
    match_actiove: function() {
      if (this.active_list.activityExpiredAt) {
        let content =
          new Date().getTime() -
            new Date(this.active_list.activityExpiredAt).getTime() <=
          0
            ? '我要参赛'
            : '活动已结束'
        return content
      }
    }
  }
}
</script>

<style lang="scss" scoped>
p,
h3 {
  margin: 0;
  padding: 0;
}
.top-nav-container {
  width: 100%;
  background: rgba(26, 26, 26, 1);
}
.top-nav-content {
  margin: 0 auto;
  width: 100%;
  height: 340px;
  padding-top: 42px;
  padding-left: 463px;
  box-sizing: border-box;
  position: relative;
  .left-pic {
    box-sizing: border-box;
    padding: 10px;
    width: 417px;
    height: 252px;
    background: #fff;
    position: absolute;
    top: 34px;
    left: 25px;
    img {
      display: inline-block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .right-text {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    span {
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      opacity: 0.5;
    }
    h3 {
      font-size: 24px;
      color: rgba(255, 255, 255, 1);
      padding-bottom: 10px;
    }
    p {
      padding-top: 8px;
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
    }
    i {
      padding-top: 8px;
      font-style: normal;
      font-size: 16px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(44, 197, 150, 1);
    }
    a {
      margin-top: 49px;
      display: block;
      width: 149px;
      height: 43px;
      background: rgba(44, 197, 150, 1);
      border-radius: 8px;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      text-align: center;
      line-height: 43px;
    }
  }
}
</style>


