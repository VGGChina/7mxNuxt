<template>
    <div class='hot-babel-container'>
      <!-- {{categoryList}} -->
        <sharetitle :title='title' :categoryList='categoryList' :identity='2'></sharetitle>
        <loading :isLoading='isLoading' :loadingColor='"#000"' v-if='true' class="loading"></loading>
        <ul class='content'>
            <li v-for='item in babelList' :key='item.id'>
                <a :href='goDetai(item.id)'>
                    <img :src="item.image" alt="" class="imgItem">
                </a>       
            </li>
        </ul>
        <caregeorymore :moreInfo='moreInfo' :moreText='moreText' :istype='"ishotimg"'></caregeorymore>
    </div>
</template>

<script>
import apiFactory from '~/api/factory/apiFactory.js'
import sharetitle from '../common/share-title';
import caregeorymore from '../common/category_more';
import { setTimeout } from 'timers';
export default {
  name: '',
  data: () => ({
    title: '热门标签',
    moreText: '更多图片',
    categoryList: [],
    moreInfo: 'ranking',
    isLoading: false,
    babelList: [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
      {id: 7},
      {id: 8}
    ]
  }),
  methods: {
    async getHotTags(index) {
      this.babelList = []
      this.isLoading = true
      if (this.categoryList.length > 0) {
        window.localStorage.setItem('crrentType', JSON.stringify(this.categoryList[index]))
        let res = await apiFactory.getMediaApi().recommendCategory({category_id: this.categoryList[index].id, type: 6}, {line: '1,0,0'})
        res = res.data.data
        res.forEach(item => {
          item.image += '?imageView2/2/w/632/h/389'
        })
        setTimeout(() => {
          this.babelList = res.splice(0, 8)
          this.isLoading = false
        }, 200)
      }
    },
    // 获取图片分类
    async fetchpictureCategory() {
      let res = await apiFactory
        .getCommonApi()
        .categoryList({type: '6', category_id: '1'})
      let ArrTemp = ['纪实', '人像', '食品', '动物', '风光', '街头', '建筑', '黑白', '插画'],
        obj = res.data.data,
        picList = []
      ArrTemp.filter(item => {
        obj.forEach(element => {
          if (element['name'] == item) {
            picList.push(element)
          }
        })
        return true
      })
      this.categoryList = picList
    },
    // 点击跳转
    goDetai(id) {
      return `/photo/${id}`
    }
  },
  created() {
    this.fetchpictureCategory();
    this.$bus.on('choosebabel', index => {
      this.getHotTags(index);
    });
  },
  watch: {
    'categoryList': function(val) {
      this.getHotTags(0)
    }
  },
  computed: {},
  components: {
    sharetitle,
    caregeorymore
  }
};
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