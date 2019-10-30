<template>
  <div class="hot-babel-container">
    <sharetitle :title="title" :category-list="categoryList" :identity="2" />
    <!-- <ul class="content">
      <li v-for="item in babelList" :key="item.id">
        <a :href="goDetai(item.id)">
          <img :src="item.image" alt="" class="imgItem">
        </a>
      </li>
    </ul> -->
    <!-- <caregeorymore :more-info="moreInfo" :more-text="moreText" :istype="&quot;ishotimg&quot;" /> -->
  </div>
</template>

<script>
// import apiFactory from '~/api/factory/apiFactory.js'
import sharetitle from '../common/share-title'
// import caregeorymore from '../common/category_more'
// import { setTimeout } from 'timers'
export default {
  name: '',
  components: {
    sharetitle
    // caregeorymore
  },
  props: ['title', 'categoryList'],
  data: () => ({
    moreText: '更多图片',
    moreInfo: 'ranking',
    isLoading: false,
    babelList: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 }
    ]
  }),
  computed: {},
  // watch: {
  //   'categoryList': function(val) {
  //     this.getHotTags(0)
  //   }
  // },

  async created() {
    // console.log('created')
    // const res = await axios.get('https://api.myjson.com/bins/ucsrc')
    // console.log(res)
    // this.fetchpictureCategory()
    // this.$bus.on('choosebabel', index => {
    //   this.getHotTags(index)
    // })
  },
  methods: {
    // async getHotTags(index) {
    //   this.babelList = []
    //   this.isLoading = true
    //   if (this.categoryList.length > 0) {
    //     window.localStorage.setItem('crrentType', JSON.stringify(this.categoryList[index]))
    //     let res = await apiFactory.getMediaApi().recommendCategory({ category_id: this.categoryList[index].id, type: 6 }, { line: '1,0,0' })
    //     res = res.data.data
    //     res.forEach(item => {
    //       item.image += '?imageView2/2/w/632/h/389'
    //     })
    //     setTimeout(() => {
    //       this.babelList = res.splice(0, 8)
    //       this.isLoading = false
    //     }, 200)
    //   }
    // },

    // 点击跳转
    goDetai(id) {
      return `/photo/${id}`
    }
  }
}
</script>

<style lang='scss' scoped>
ul,
li {
  margin: 0;
  padding: 0;
}
.hot-babel-container {
  width: 100%;
  .content {
    list-style: none;
    width: 1295px;
    height: 392px;
    margin: 0 auto;
    // background: pink;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      width: 316px;
      height: 189px;
      background: rgba(197, 197, 197, 1);
      border-radius: 4px;
      margin-bottom: 14px;
      a{
        display: block;
        width: 316px;
        height: 189px;
        overflow: hidden;
      .imgItem {
        display: inline-block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all .3s ease;
        &:hover{
          transform: scale(1.2,1.2)
        }
       }
      }
    }
  }
}
</style>
