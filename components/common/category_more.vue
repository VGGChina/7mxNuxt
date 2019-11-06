<template>
  <div class="more_container">
    <a href="javascript:void(0)" class="btn" @click="gode()">{{ moreText }}</a>
    <!-- <router-link :to="{name: moreInfo,params: {tableIndex: 0,page: 1}}" tag="a" class="btn">{{moreText}}</router-link> -->
  </div>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: ['moreInfo', 'moreText', 'istype'],
  data: () => ({
  }),
  methods: {
    gode() {
      if (this.istype === 'ishotimg') {
        const cur = JSON.parse(window.localStorage.getItem('crrentType'))
        this.$router.push({ path: `category/${cur.name}/${cur.id}/0/1` })
      } else {
        this.$router.push({ path: 'ranking/0/1' })
      }
    }
  }
}
</script>

<style lang='css' scoped>
.more_container{
  width: 100%;
  padding-top: 21px;
  margin-bottom: 21px;
}
.more_container .btn{
  margin: 0 auto;
  display: block;
  width:155px;
  height:48px;
  background:rgba(255,255,255,1);
  border-radius:24px;
  border:1px solid rgba(232,232,232,1);
  text-align: center;
  font-size:16px;
  font-family:PingFangHK-Regular;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:48px;
}
.more_container .btn:hover{
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.8);
}
</style>
