<template>
  <div class='cooperation_container'>
      <div class='content'>
          <img :src="require(`${item.url}`)" class='imgItem' v-for='(item,index) in imgList' :key='item.id' v-show="currentIndex == index" @click="gokehu(index)">
          <div class='dotted'>
              <span :class='index == currentIndex ? "active" : null' v-for='(item,index) in countDotted' :key='item' @click='select(index)'></span>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: '',

  data: () => ({
    countDotted: [
      '1', '2'
    ],
    imgList: [
      {id: 0, url: './images/cooperation-footer.png'},
      {id: 1, url: './images/banner.png'}
    ],
    currentIndex: 0
  }),
  methods: {
    select(index) {
      this.currentIndex = index
    },
    gokehu(index) {
      if (index == 0) {
        window.location.href = 'http://q.url.cn/CDzAE8?_type=wpa&qidian=true'
      } else if (index == 1) {
        window.location.href = 'https://v.paixin.com/'
      }
    }
  },
  created() {
  },
  mounted () {

  },
  watch: {

  },
  computed: {

  },
  components: {

  }
}
</script>

<style lang='scss' scoped>
.cooperation_container{
    width: 100%;
    height: 116px;
    margin-top: 87px;
    cursor: pointer;
    .content{
        width: 1295px;
        height: 100%;
        background: url('./images/cooperation-footer.png') no-repeat center;
        margin: 0 auto;
        position: relative;
        img{
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        .dotted{
            width: 55px;
            height: 11px;
            position: absolute;
            bottom: -20px;
            left: 609px;
            display: flex;
            text-align: center;
            span{
                display: block;
                width:11px;
                height:11px;
                margin-left: 10px;
                background:rgba(155,155,155,.5);
                border-radius: 50%;
                &.active{
                 background:rgba(155,155,155,1);
                }
            }
        }
    }
}
</style>