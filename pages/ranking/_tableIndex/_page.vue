<template>
  <div class="ranking">
    <table-nav :options="options" :is-loading="isLoading" :default-index="tableIndex" />
    <user-preview :user-list="userList" />
    <pagination
      style="margin: 64px 0 160px 0;"
      :line="line"
      :base-url="'/ranking/' + tableIndex + '/'"
      @paginationJumpToPage="jumpToPage"
    />
    <no-content :is-no-content-show="isNoContent" />
    <div v-if="userList.length > 0 && line == 'end'" class="no-more">—— & ——</div>
  </div>
</template>

<script>
import NoContent from '~/components/no-content/NoContent'
import TableNav from '~/components/table/TableNav'
import UserPreview from '~/components/user-preview/UserPreview'
import Pagination from '~/components/pagination/paginationQ'

export default {
  name: 'Photographer',
  components: {
    NoContent,
    TableNav,
    UserPreview,
    Pagination
  },
  data: () => ({
    isLoading: false,
    userList: [],
    options: [
      {
        name: '本周最热',
        url: '/ranking/0/1'
      },
      {
        name: '上升最快',
        url: '/ranking/1/1'
      },
      {
        name: '总体排行',
        url: '/ranking/2/1'
      }
    ]
  }),
  computed: {
    isNoContent() {
      if (this.userList.length < 1 && this.line.split(',')[0] === 'end') {
        return true
      }

      return false
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
    const tableIndex = parseInt(params.tableIndex)
    const data = {
      type: tableIndex + 1,
      params: {
        page: parseInt(params.page) - 1,
        size: 20
      }

    }
    const res = await $axios.billboradService.getTopAPI(data)

    const userList = res.data.content

    const pageNow = params.page
    const pageTotal = res.data.totalPages
    const nextPage = pageNow === pageTotal ? 'end' : parseInt(params.page) + 1

    const line = nextPage + ',' + pageTotal + ',' + pageNow

    return {
      userList: userList,
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
      this.$router.push({
        name: 'ranking-tableIndex-page',
        params: {
          tableIndex: this.tableIndex + '',
          page: line.split(',')[0]
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
