<template>
  <div class="hot-babel-container">
    <sharetitle :title="title" :category-list="categoryList" :identity="2" />
    <loading :is-loading="isLoading" loading-color="#000" class="loading" />
    <ul class="content">
      <li v-for="(item, index) in picblocks" :key="index">
        <a :href="goDetai(item.id)">
          <img :src="item.image" alt="" class="imgItem">
        </a>
      </li>
    </ul>

    <caregeorymore more-info="ranking" more-text="更多图片" istype="ishotimg" />
  </div>
</template>

<script>
import sharetitle from '../common/share-title'
import caregeorymore from '../common/category_more'
import loading from '~/components/loading/Loading'

export default {
  name: '',
  components: {
    sharetitle,
    caregeorymore,
    loading
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    picblocks: [],
    isLoading: false,
    categoryList: []
  }),

  async created() {
    await this.getHotTags()
    this.getHotPics()

    this.$bus.on('choosebabel', async index => {
      this.getHotPics(index)
    })
  },
  methods: {
    // 点击跳转
    goDetai(id) {
      return `/photo/${id}`
    },

    async getHotPics(index = 0) {
      const data = {
        tagId: this.categoryList[index].id,
        params: {
          page: 0,
          size: 8
        }
      }
      this.picblocks = []
      this.isLoading = true
      const res = await this.$axios.tagService.getTagPicsAPI(data)
      res.data.content.forEach(item => {
        item.image += '?imageView2/2/w/632/h/389'
      })
      this.picblocks = res.data.content
      this.isLoading = false
    },

    async getHotTags() {
      const data = {
        page: 0,
        size: 9
      }
      const res = await this.$axios.tagService.getIndexHotTagsAPI(data)
      this.categoryList = res.data
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
