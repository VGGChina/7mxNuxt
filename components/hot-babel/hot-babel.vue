<template>
  <div class="hot-babel-container">
    <sharetitle :title="title" :category-list="categoryList" :identity="2" />
    <ul class="content">
      <li v-for="item in hotBabels[babelIndex]" :key="item.id">
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

export default {
  name: '',
  components: {
    sharetitle,
    caregeorymore
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    categoryList: {
      type: Array,
      default() {
        return []
      }
    },
    hotBabels: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data: () => ({
    babelIndex: 0
  }),

  created() {
    this.$bus.on('choosebabel', index => {
      this.babelIndex = index
    })
  },
  methods: {
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
