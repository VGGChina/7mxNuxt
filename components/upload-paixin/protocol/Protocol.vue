<template>
  <transition name="cover-fade">
    <div class="htchoose" v-if="isShow">
      <div class="bg" @click="cancel"></div>

      <div class="content_wrap">
        <div class="title">
          <div class="title1">适用范围</div>
          <div class="title2">标准协议</div>
          <div class="title3">扩展协议</div>
        </div>

        <div v-for="(item, index) in data" :key="index" class="line">
          <div class="desc">{{item.desc}}</div>
          <div v-if="item.c" class="stan">{{item.c}}</div>
          <div v-if="item.d" class="ext">{{item.d}}</div>
          <div v-if="item.a" class="stan"><img :src="item.a"></div>
          <div v-if="item.b" class="ext"><img :src="item.b"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data: () => ({
    yes: require('./img/yes.svg'),
    no: require('./img/no.svg'),
    data: [
      {
        desc: '微博，微信等社交媒体，在线广告，电邮，电子出版物等',
        a: require('./img/yes.svg'),
        b: require('./img/yes.svg')
      },
      {
        desc: '宣传页，画报，报纸杂志，易拉宝，书籍和教材出版',
        c: '限50万份',
        d: '无限制'
      },
      {
        desc: '报纸广告，杂志广告',
        c: '限50万份',
        d: '无限制'
      },
      {
        desc: '网站，APP配图，商城，网页游戏，幻灯片，flash，',
        a: require('./img/yes.svg'),
        b: require('./img/yes.svg')
      },
      {
        desc: '电影，电视，网路视频',
        a: require('./img/yes.svg'),
        b: require('./img/yes.svg')
      },
      {
        desc: '户外广告（楼宇、灯箱、车体、展板、橱窗、户外广告牌）',
        a: require('./img/no.svg'),
        b: require('./img/yes.svg')
      },
      {
        desc: '转售商品，印刷品。如:T恤，杯子，手机壳，鼠标垫，贴纸等',
        a: require('./img/no.svg'),
        b: require('./img/yes.svg')
      },
      {
        desc: '转售设计元素，如：（软件/程序）APP皮肤/主题，商品包装',
        a: require('./img/no.svg'),
        b: require('./img/yes.svg')
      },
      {
        desc: '商标、logo',
        a: require('./img/no.svg'),
        b: require('./img/no.svg')
      }
    ]
  }),
  props: [
    'isShow'
  ],
  methods: {
    cancel() {
      this.$emit('cancelProtocolDialog', false);
    }
  }
}
</script>

<style scoped>
.htchoose {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all .6s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
}
.content_wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1100px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  z-index: 1;
  transform: translate(-50%, -50%);
  padding: 26px 0;
}
.content_wrap .line {
  height: 60px;
  line-height: 60px;
  font-size: 0.8rem;
}
.content_wrap .line > * {
  display: inline-block;
  text-align: center;
  width: 20%;
  height: 100%;
  vertical-align: middle;
}
.title {
  width: 100%;
  height: 40px;
}
.title div {
  display: inline-block;
  font-size: 1rem;
  width: 20%;
  font-weight: 800;
  text-align: center;
}
.title div:first-child {
  width: 52%;
}
.line .desc {
  width: 46% !important;
  text-align: left;
  opacity: 0.8;
  padding-left: 70px;
}
.line:nth-child(2n) {
  background: rgba(0, 0, 0, 0.03);
}
.stan {
  color: #ff365d;
}
</style>
