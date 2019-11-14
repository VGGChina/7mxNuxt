<template>
  <div v-scroll="fetchData">
    <table-nav
      :options="options"
      :is-loading="isLoading"
      @updateTableIndex="tableChanged"
    />

    <div
      v-show="!isRefreshing"
      class="user-follow-contanier"
    >
      <image-detail
        v-for="(item, index) in imgList"
        :key="item.id"
        :img-list="imgList"
        :img-detail="item"
        :table-index="tableIndex"
        :index="index"
        @refreshClicked="refreshClicked"
      />
    </div>

    <loading :is-loading="isLoading" :loading-color="'#000'" />
    <div v-if="imgList.length > 0 && line == 'end'" class="no-more">—— & ——</div>
    <no-content style="margin-top: 160px;" :is-no-content-show="isNoContent" />
  </div>
</template>

<script>
import TableNav from '~/components/table/TableNav'
import NoContent from '~/components/no-content/NoContent'
import ImageDetail from '~/components/follow_children/ImageDetail'
import loading from '~/components/loading/Loading'

export default {
  name: '',
  components: {
    NoContent,
    ImageDetail,
    TableNav,
    loading
  },
  data: () => ({
    line: '',
    imgList: [],
    isLoading: false,
    options: [{
      name: '动态推荐',
      url: ''
    }, {
      name: '好友原创',
      url: ''
    }, {
      name: '好友动态',
      url: ''
    }],
    tableIndex: 0,
    isRefreshing: false
  }),
  computed: {
    isNoContent: function() {
      if (this.imgList.length < 1 && this.line === 'end') {
        return true
      }

      return false
    }
  },
  head() {
    return {
      title: '动态 - 7MX 中国领先的视觉创作社区'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    refreshClicked() {
      this.fetchData(true)
    },
    tableChanged(index) {
      this.tableIndex = index

      this.reload()
    },
    reload() {
      if (this.isLoading) {
        return
      }

      this.imgList = []
      this.line = ''
      this.fetchData()
    },
    fetchData(isRefresh) {
      if (this.isLoading || this.line === 'end') {
        return
      }

      if (isRefresh) {
        window.scrollTo(0, 0)

        this.isRefreshing = true
      }

      this.isLoading = true

      switch (this.tableIndex) {
        case 0:
          this.getDynamicList(isRefresh)
          break
        case 1:
        case 2:
          this.getFollowList()
          break
        default:
          break
      }
    },
    async getDynamicList(isRefresh) {
      const params = { line: this.line, limit: 10 }

      const res = await this.$axios.mediaService.dynamicList({}, params)

      if (res.data.out === '1') {
        if (isRefresh) {
          this.imgList.splice(0, 0, ...res.data.data)

          this.isRefreshing = false
        } else {
          this.imgList.push(...res.data.data)
        }
      }

      this.line = res.data.line

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    async getFollowList() {
      const params = { line: this.line, limit: 10 }

      const res = await this.$axios.mediaService.followList({}, params)

      if (res.data.out === '1') {
        this.imgList.push(...res.data.data)
      }

      this.line = res.data.line

      setTimeout(() => {
        this.isLoading = false
      }, 500)
    }
  }
}
</script>

<style scoped>
.user-follow-contanier {
  width: 100%;
  min-width: 1200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 20px;
}

.no-more {
  height: 150px;
  text-align: center;
  line-height: 80px;
  font-size: 1.2rem;
  opacity: .2;
  user-select: none;
}
</style>
