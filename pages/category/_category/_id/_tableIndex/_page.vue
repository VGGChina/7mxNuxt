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
    const imgList = []
    let tableIndex = 0

    let line = params.page + ',0,0'

    const rqBody = { type: '6' }
    const query = {
      line: line,
      limit: '40'
    }
    if (params.id !== '0') {
      rqBody.category_id = params.id
    }

    let res = {}

    if (params.tableIndex === '0') {
      res = await $axios.mediaService.recommendCategory(rqBody, query)
    }

    if (params.tableIndex === '1') {
      tableIndex = 0
      rqBody.product = '1'
      if (params.id === '0') {
        res = await $axios.paixinService.recommendList(rqBody, query)
      } else {
        res = await $axios.mediaService.inCategoryList(rqBody, query)
      }
    }

    if (params.tableIndex === '2') {
      if (params.id === '0') {
        rqBody.mode = 'desc'
        res = await $axios.mediaService.commonList(rqBody, query)
      } else {
        res = await $axios.mediaService.inCategoryList(rqBody, query)
      }
    }

    if (res.data.out === '1') {
      imgList.push(...res.data.data)
    }
    line = res.data.line

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
      console.log('params', {
        id: this.$route.params.id,
        tableIndex: this.tableIndex + '',
        page: line.split(',')[0],
        category: this.$route.params.category
      })

      this.$router.push({ path: `/category/${this.$route.params.category}/${this.$route.params.id}/${this.$route.params.tableIndex}/${line.split(',')[0]}` })

      // this.$router.push({
      //   name: 'category',
      //   params: {
      //     id: this.$route.params.id,
      //     tableIndex: this.tableIndex + '',
      //     page: line.split(',')[0],
      //     category: this.$route.params.category
      //   }
      // })
    }

  }
}
</script>

<style lang='scss' scoped>
