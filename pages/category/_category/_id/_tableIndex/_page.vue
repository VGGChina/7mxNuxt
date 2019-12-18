<template>
  <div class="ranking">
    <table-nav
      :options="options"
      :is-loading="isLoading"
      :default-index="tableIndex"
    />

    <img-waterfall
      :img-list="imgList"
      :line="line"
      :is-to-paixin="isToPaixin"
      :is-loading="isLoading"
      :is-show-loading="true"
    />

    <pagination
      style="margin: 64px 0 160px 0;"
      :line="line"
      :base-url="'/category/' + $route.params.category + '/' + $route.params.id + '/' + $route.params.tableIndex + '/'"
      @paginationJumpToPage="jumpToPage"
    />

  </div>
</template>

<script>
import TableNav from '~/components/table/TableNav'
import Pagination from '~/components/pagination/paginationQ'
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'

export default {
  name: 'Photographer',
  components: {
    TableNav,
    Pagination,
    ImgWaterfall
  },
  data: () => ({
    isLoading: false

  }),
  computed: {
    isToPaixin() {
      if (this.tableIndex === 1) {
        return true
      } else {
        return false
      }
    },
    options() {
      const options = [{
        name: '热门推荐',
        url: ''
      }, {
        name: '商店热门',
        url: ''
      }, {
        name: '最新作品',
        url: ''
      }]

      options.forEach((e, index) => {
        e.url = '/category/' + this.$route.params.category + '/' + this.$route.params.id + '/' + index + '/1'
      })

      return options
    },
    isShowPagination() {
      if (this.line === '1,0,0') {
        return false
      }

      const lineArray = this.line.split(',')

      if (lineArray[0] === 'end' && lineArray[2] === '1') {
        return false
      }

      return true
    }

  },

  async asyncData({ params, $axios, store }) {
    let imgList = []
    let line = ''
    const tableIndex = 0

    const data = {
      categoryId: 6,
      type: parseInt(params.tableIndex) + 1,
      params: {
        page: params.page - 1,
        size: 40
      }
    }
    const res = await $axios.mediaService.exploreAPI(data)
    if (params.tableIndex === '0') {
      imgList = res.data
    } else {
      imgList = res.data.content

      const pageNow = params.page
      const pageTotal = res.data.totalPages
      const nextPage = pageNow === pageTotal ? 'end' : parseInt(params.page) + 1
      line = nextPage + ',' + pageTotal + ',' + pageNow
    }

    return {
      imgList: imgList,
      tableIndex: tableIndex,
      line: line
    }
  },

  head() {
    return {
      title: '榜单 - 7MX 中国领先的视觉创作社区'
    }
  },

  methods: {
    jumpToPage(line) {
      this.$router.push({ path: `/category/${this.$route.params.category}/${this.$route.params.id}/${this.$route.params.tableIndex}/${line.split(',')[0]}` })
    }

  }
}
</script>

<style lang='scss' scoped>
