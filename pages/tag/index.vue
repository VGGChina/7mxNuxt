<template>
    <div class="tag-wall" v-scroll="fetchData">
        <table-nav :options="options" v-on:updateTableIndex="tableChanged"></table-nav>
        <transition name="fade_tags_recommend" mode="out-in">
            <TagList v-if="tableIndex == 0" :end="line" :tags="tags" key="0"></TagList>
            <TagList v-if="tableIndex == 1" :end="line" :tags="tags" key="1"></TagList>
            <TagList v-if="tableIndex == 2" :end="line" :tags="tags" key="2"></TagList>
        </transition>
        <div style="height: 200px;"></div>
    </div>
</template>

<script>
import TableNav from '~/components/table/TableNav'
import TagList from '~/components/tag-list/TagList'
export default {
  name: 'tag-wall',
  head() {
    return {
      title: '热门标签 - 7MX 中国领先的视觉创作社区'
    }
  },
  data: () => ({
    options: [
      {
        name: '热门标签',
        url: ''
      },
      {
        name: '推荐标签',
        url: ''
      }
    ],
    tableIndex: 0,
    tags: [],
    line: '',
    loading: true
  }),
  methods: {
    tableChanged(i) {
      this.tableIndex = i != undefined ? i : this.tableIndex
      if (i != undefined) {
        this.tags = []
        this.line = ''
      }
      if (this.tableIndex == 0) {
        this.getHotTags()
      } else if (this.tableIndex == 1) {
        this.getRecommentTags()
      }
    },
    fetchData() {
      if (this.line == 'end' || !this.line) return
      if (this.loading) return
      this.loading = true
      this.tableChanged()
    },
    async getHotTags() {
      let res = await this.$axios.tagService.getHotList({}, { line: this.line })
      this.afterRes(res)
    },
    async getRecommentTags() {
      let res = await this.$axios.tagService.getRecommentTags(
        {},
        { line: this.line }
      )
      this.afterRes(res)
    },
    // async getAllTags() {
    //   let res = await this.$apiFactory.getTagApi().getRecommentTags()
    //   this.afterRes(res)
    // },
    afterRes(res) {
      if (res.data.out > 0) {
        this.tags.push(...res.data.data)
        this.line = res.data.line
        if (res.data.data.length < 1) {
          this.line = 'end'
        }
      } else {
        this.line = 'end'
      }
      this.loading = false
    }
  },
  created() {
    this.tableChanged()
  },
  mounted() {},
  watch: {},
  computed: {},
  components: {
    TableNav,
    TagList
  }
}
</script>

<style lang='scss' scoped>
.fade_tags_recommend-enter-active,
.fade_tags_recommend-leave-active {
  transition: all 0.4s ease;
}
.fade_tags_recommend-enter,
.fade_tags_recommend-leave-to {
  opacity: 0;
}
</style>