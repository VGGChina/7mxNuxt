<template>
  <div v-scroll="fetchData" class="user-like-contanier">
    <table-nav :options="options" :defaultIndex="defaultIndex"></table-nav>
    <img-waterfall :imgList="imgList" :line="line" :isLoading="isLoading" :isShowLoading="true"></img-waterfall>
  </div>
</template>

<script>
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'
import NoContent from '~/components/no-content/NoContent'
import TableNav from '~/components/table/TableNav'

export default {
  data: () => ({
    line: '',
    imgList: [],
    isLoading: false,
    options: [],
    defaultIndex: 0,
    page: 1,
    maxPage: 1
  }),
  created() {
    this.fetchData()

    this.getTagDetail()
  },
  methods: {
    async getTagDetail() {
      let res = await this.$axios.tagService.getTagDetail({
        tag_id: this.$route.params.id
      })

      if (res.status == 200) {
        this.options.push({
          name: '#' + res.data.name + '#',
          url: ''
        })

        document.title = res.data.name + ' - 7MX 中国领先的视觉创作社区'
      } else {
        document.title = '7MX - 中国领先的视觉创作社区'
      }
    },
    async fetchData() {
      if (this.isLoading || this.line === 'end') {
        return
      }

      if (this.page > this.maxPage) {
        return
      }

      this.isLoading = true

      let response = await this.$axios.mediaService.randomInTagList(
        {
          tag_id: this.$route.params.id
        },
        { page: this.page - 1 }
      )
      if (response.status == 200) {
        this.imgList = this.imgList.concat(response.data.content)
        this.maxPage = response.data.totalPages
      }

      this.page += 1

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    reload: function() {
      this.line = ''
      this.imgList = []
      this.fetchData()
    }
  },
  components: {
    ImgWaterfall,
    NoContent,
    TableNav
  }
}
</script>

<style scoped>
.user-like-contanier {
  width: 100%;
  min-width: 1200px;
}
</style>
