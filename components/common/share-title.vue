<template>
  <div class="share-title_cantainer">
    <div class="content">
      <h1 class="title">{{ title }}</h1>
      <ul>
        <li v-for="(item,index) in categoryList1" :key="index">
          <span v-if="index != 0">/</span>
          <span v-if="index == 0" style="opacity: 0">/</span>
          <span :class="index == activeIndex ? 'first' : 'second'" @click="chooseType(index)">{{ item.name }}</span>
        </li>
      </ul>
      <div v-if="false" class="btn">
        <span>
          <img :src="require('~/components/common/images/arrpw_l .png')" height="10" width="6" alt="">
        </span>
        <span>
          <img :src="require('~/components/common/images/arrpw_r.png')" height="10" width="6" alt="">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: ['title', 'categoryList', 'identity'],
  data: () => ({
    activeIndex: 0
  }),
  computed: {
    categoryList1: function() {
      return this.categoryList
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
  },
  methods: {
    chooseType(index) {
      this.activeIndex = index
      if (this.identity === 1) {
        this.$bus.emit('choosephotography', index)
      } else if (this.identity === 3) {
        this.$bus.emit('choosepicture', index)
      } else if (this.identity === 2) {
        this.$bus.emit('choosebabel', index)
      }
    }
  }
}
</script>

<style lang='css' scoped>
.share-title_cantainer{
  width: 100%;
}
.content{
  width: 1294px;
  height: 160px;
  padding-top: 66px;
  padding-bottom: 120px;
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.content .title{
  margin: 0;
  font-size:26px;
  font-family:PingFangHK-Regular;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:37px;
  height: 37px;
}
.content ul{
  padding: 0;
  margin-top: 24px;
  margin-bottom: 0;
  height:22px;
  list-style: none;
    display: flex;
}
.content ul li{
  width: 86px;
}
.content ul li a{
  color: rgba(0,0,0,.5);
  font-size: 16px;
  font-family:PingFangHK-Regular;
}
.content ul li span{
  color: rgba(0,0,0,.5);
  font-size: 16px;
  font-family:PingFangHK-Regular;
  margin-right: 20px;
}
.content ul li span.second{
  cursor: pointer;
}
.content ul li span.first{
  color: rgba(0,0,0,1);
   width: 66px;
   cursor: pointer;
}
.content .btn{
  width: 100px;
  height: 28px;
  position: absolute;
  right: 0;
  top: 124px;
  display: flex;
}
.content .btn span{
  display: block;
  width:28px;
  height:28px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  border:1px solid rgba(218,218,218,1);
  text-align: center;
  line-height: 28px;
  margin-left: 10px;
}
</style>
