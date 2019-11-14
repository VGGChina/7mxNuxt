<template>
  <div class="ranking">
    <table-nav
      :options="options"
      :is-loading="isLoading"
      :default-index="tableIndex"
    />

    <user-preview :user-list="userList" />

    <pagination
      style="margin: 64px 0 160px 0;"
      :line="line"
      :base-url="'/ranking/' + tableIndex + '/'"
      @paginationJumpToPage="jumpToPage"
    />

    <!-- <loading :is-loading="isLoading" :loading-color="'#000'" /> -->

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
    options: [{
      name: '本周最热',
      url: '/ranking/0/1'
    }, {
      name: '上升最快',
      url: '/ranking/1/1'
    }, {
      name: '总体排行',
      url: '/ranking/2/1'
    }]
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
    const userList = []
    let tableIndex = 0

    let line = params.page + ',0,0'

    const rqBody = {
      withmedias: '1'
    }

    let res = {}
    if (params.tableIndex === '0') {
      tableIndex = 0
      res = await $axios.userService.recommendUser(rqBody, { line: line })
    }
    if (params.tableIndex === '1') {
      tableIndex = 1
      res = await $axios.userService.risingList(rqBody, { line: line })
    }
    if (params.tableIndex === '2') {
      tableIndex = 2
      res = await $axios.userService.rankingList(rqBody, { line: line })
    }
    if (res.data.out === '1') {
      userList.push(...res.data.data)
    }
    line = res.data.line

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
        name: 'ranking',
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
