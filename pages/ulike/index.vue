<template>
  <div v-scroll="fetchData" class="user-like-contanier">
    <img-waterfall
      :img-list="imgList"
      :line="line"
      :is-loading="isLoading"
      :is-show-loading="ifShowLoading"
    />
  </div>
</template>

<script>
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'

export default {
  name: '',
  components: {
    'img-waterfall': ImgWaterfall
  },
  data: () => ({
    line: '',
    imgList: [],
    isLoading: false,
    currentPage: 0,
    totalPages: 1
  }),
  head() {
    return {
      title: '喜欢 - 7MX 中国领先的视觉创作社区'
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ifShowLoading() {
      return this.currentPage < this.totalPages
    }
  },
  methods: {
    fetchData: function() {
      if (this.isLoading) {
        return
      }

      if (this.currentPage >= this.totalPages) {
        return
      }

      this.isLoading = true

      const params = { page: this.currentPage }
      this.$axios.mediaService.likeList({}, params).then(response => {
        if (response.status == 200) {
          this.imgList = this.imgList.concat(response.data.content)
          this.imgList.map(i => {
            i.likeOrNot = true
            i.like++
          })
          this.totalPages = response.data.totalPages
          this.currentPage++
        }
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      })
    }
    // reload: function() {
    //   this.line = ''
    //   this.imgList = []
    //   this.fetchData()
    // }
  }
}
</script>

<style scoped>
.user-like-contanier {
  width: 100%;
  min-width: 1200px;
}
</style>
