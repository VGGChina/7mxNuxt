<template>
  <div v-scroll="fetchData" class="user-like-contanier">
    <img-waterfall
      :img-list="imgList"
      :line="line"
      :is-loading="isLoading"
      :is-show-loading="true"
    />
  </div>
</template>

<script>
import ImgWaterfall from '~/components/img-waterfall/ImgWaterfall'
import NoContent from '~/components/no-content/NoContent'

export default {
  name: '',
  components: {
    'img-waterfall': ImgWaterfall,
    'no-content': NoContent
  },
  data: () => ({
    line: '',
    imgList: [],
    isLoading: false
  }),
  head() {
    return {
      title: '喜欢 - 7MX 中国领先的视觉创作社区'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData: function() {
      if (this.isLoading || this.line === 'end') {
        return
      }

      this.isLoading = true

      const params = { line: this.line }
      this.$axios.mediaService.likeList({}, params)
        .then((response) => {
          if (response.data.out === '1') {
            this.imgList = this.imgList.concat(response.data.data)
          }
          this.line = response.data.line
          setTimeout(() => {
            this.isLoading = false
          }, 500)
        })
    },
    reload: function() {
      this.line = ''
      this.imgList = []
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.user-like-contanier {
  width: 100%;
  min-width: 1200px;
}
</style>
