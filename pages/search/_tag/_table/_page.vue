<template>
    <div class="category-container">
        <table-nav
            :options="options"
            :isLoading="isLoading"
            :defaultIndex="parseInt($route.params.tableIndex)"
        ></table-nav>
        <user-preview v-show="tableIndex==2" :userList="userList"></user-preview>
        <img-waterfall
            :imgList="imgList"
            :line="line == 'end' ? line: ''"
            :isToPaixin="isToPaixin"
            :isLoading="isLoading"
            :isShowLoading="true"
            :isShowNoMore="!isShowPagination"
        ></img-waterfall>
        <pagination
            style="margin: 64px 0 160px 0;"
            v-show="!isLoading && isShowPagination"
            :limit="limit"
            :count="count"
            :currentPage="$route.params.page"
            :baseUrl="'/search/' + $route.params.tag + '/' + $route.params.table + '/'"
            @paginationJumpToPage="jumpToPage"
        ></pagination>
    </div>
</template>

<script>
import TableNav from '~/components/table/TableNav'
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'
// import { axiosPost } from '~/service/factory/axiosFactory'
import Pagination from '~/components/pagination/paginationJ'
import UserPreview from '~/components/user-preview/UserPreview'

export default {
  data() {
    return {
      userList: [],
      isLoading: false,
      limit: 20,
      count: 0,
      line: 0,
      imgList: []
    }
  },
  async asyncData({ $axios, params }) {
    let table = params.table
    let page = params.page
    let tempLine
    if (table != 2) {
      tempLine = (parseInt(page) - 1) * 20
    }

    let url = 'http://free.es.dispatch.paixin.com/7mx/_search/'
    let rqBody = {
      keyword: params.tag,
      type: '6'
    }

    let query = {
      line: tempLine,
      limit: 20
    }

    if (table == 1) rqBody.product = 'plus'

    let temp = { url: url, data: rqBody, params: query }
    console.log(temp)
    let res = await $axios(temp)
    console.log(res)
    let tempList = []
    if (res.data.out == '1') {
      tempList.push(...res.data.data)
    }
    if (res.data.end === 'end') {
      tempLine = 'end'
    } else {
      tempLine = res.data.line
    }
    return {
      imgList: tempList,
      line: tempLine,
      count: res.data.count
    }
  },
  created() {
    // document.title = this.$route.params.tag + ' - 7MX 中国领先的视觉创作社区'
    // if (this.$route.params.tableIndex != 2) {
    //   this.line = this.getLine()
    // }
    // this.fetchData()
  },
  methods: {
    initOptions() {
      this.options.forEach((e, index) => {
        e.url = '/search/' + this.$route.params.tag + '/' + index + '/1'
      })
    },
    getLine() {
      if (isNaN(this.$route.params.page)) {
        this.$router.push({
          name: 'search',
          params: {
            tag: this.$route.params.tag,
            tableIndex: this.tableIndex + '',
            page: '1'
          }
        })

        return
      }

      if (parseInt(this.$route.params.page) < 1) {
        this.$router.push({
          name: 'search',
          params: {
            tag: this.$route.params.tag,
            tableIndex: this.tableIndex + '',
            page: '1'
          }
        })

        return
      }

      return (parseInt(this.$route.params.page) - 1) * this.limit
    },
    jumpToPage(page, line) {
      this.$router.push({
        name: 'search',
        params: {
          tag: this.$route.params.tag,
          tableIndex: this.tableIndex,
          page: page
        }
      })
    },
    reload() {
      if (this.isLoading) {
        return
      }

      this.imgList.splice(0, this.imgList.length)
      if (this.$route.params.tableIndex != 2) {
        this.line = this.getLine()
      }
      this.count = 0
      this.fetchData()
    },
    afterResponse(res) {
      if (res.data.out == '1') {
        this.imgList.push(...res.data.data)
      }

      if (res.data.end === 'end') {
        this.line = 'end'
      } else {
        this.line = res.data.line
      }

      setTimeout(() => {
        this.isLoading = false

        setTimeout(() => {
          this.count = res.data.count
        }, 500)
      }, 500)
    },
    async fetchData() {
      if ((this.isLoading || this.line == 'end') && this.tableIndex != 2) {
        return
      }

      this.isLoading = true

      let url = '//free.es.dispatch.paixin.com/7mx/_search/'

      let rqBody = {
        keyword: this.$route.params.tag,
        type: '6'
      }

      let query = {
        line: this.line,
        limit: this.limit
      }

      if (this.tableIndex == 0) {
        try {
          let res = await axiosPost(url, rqBody, query)
          this.afterResponse(res)
          return
        } catch (e) {
          this.afterResponse({
            data: {
              out: '0',
              end: 'end'
            }
          })

          return
        }
      }

      if (this.tableIndex == 1) {
        rqBody.product = 'plus'
        try {
          let res = await axiosPost(url, rqBody, query)
          this.afterResponse(res)
          return
        } catch (e) {
          this.afterResponse({
            data: {
              out: '0',
              end: 'end'
            }
          })
        }
      }

      if (this.tableIndex == 2) {
        this.userList = []
        try {
          this.isLoading = true
          // if (this.$route.params.page == 1) {
          this.line = this.$route.params.page + ',0,0'
          // }
          // if (!isNaN(this.line)) {
          //   this.line = this.$route.page + ',' + (window.localStorage.line7mx).split(',')[1] + ',' + this.$route.page - 1
          // } else {
          //   this.line = this.$route.params.page + ',0,0'
          // }
          console.log('this.line', this.line)
          let query = {
            line: this.line
          }
          let res = await this.$apiFactory
            .getUserApi()
            .getPhotographerByName(
              { search: rqBody.keyword, withmedias: '1' },
              query
            )
          if (res.data.out == '1') {
            this.userList = []
            this.userList.push(...res.data.data)
          }

          if (res.data.end === 'end') {
            this.line = 'end'
          } else {
            this.line = res.data.line
            // window.localStorage.line7mx = this.line
          }

          setTimeout(() => {
            this.isLoading = false
            setTimeout(() => {
              this.count = parseInt(res.data.line.split(',')[1]) * this.limit
            }, 500)
          }, 500)

          return
        } catch (e) {
          this.afterResponse({
            data: {
              out: '0',
              end: 'end'
            }
          })
        }
      }
    }
  },
  computed: {
    isToPaixin() {
      if (this.tableIndex == 0) {
        return false
      }

      if (this.tableIndex == 1) {
        return true
      }
    },
    isShowPagination() {
      if (this.count == 0 || this.count < this.limit) {
        return false
      }

      return true
    },
    tableIndex() {
      return parseInt(this.$route.params.tableIndex)
    },
    options() {
      let options = [
        {
          name: '图片搜索',
          url: ''
        },
        {
          name: '商店内容',
          url: ''
        },
        {
          name: '摄影师',
          url: ''
        }
      ]

      options.forEach((e, index) => {
        if (index == 22) {
          e.url = '/ranking/0/1'
        } else {
          e.url = '/search/' + this.$route.params.tag + '/' + index + '/1'
        }
      })
      return options
    }
  },
  watch: {
    '$route.params.tag': function(val) {
      document.title = this.$route.params.tag + ' - 7MX 中国领先的视觉创作社区'
      this.reload()
    },
    '$route.params.tableIndex': function(val) {
      this.reload()
    },
    '$route.params.page': function(val) {
      this.reload()
    }
  },
  components: {
    ImgWaterfall,
    TableNav,
    Pagination,
    UserPreview
  }
}
</script>

<style scoped>
.category-container {
  width: 100%;
  min-width: 1200px;
  height: 500px;
  background: 555;
}
</style>


