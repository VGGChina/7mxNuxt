<template>
  <div v-scroll="fetchData">
    <table-nav
      :options="options"
      :is-loading="isLoading"
      :default-index="tableIndex"
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
    isRefreshing: false,

    page: 1,
    size: 20,
    sort: 'createdAt,desc'
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

      this.getList()
    },

    async getList() {
      const data = {
        params: {
          page: this.page,
          size: this.size
        }
      }

      if (this.tableIndex === 0) {
        data.type = 1
      } else {
        data.type = 2
      }

      try {
        const res = await this.$axios.mediaService.getDynamicAPI(data)
        this.imgList = res.data.content

        for (const i in res.data.content) {
          res.data.content[i].userStat = {
            followedNum: res.data.content[i].followedNum,
            popularity: res.data.content[i].popularity,
            userId: res.data.content[i].userId
          }
          res.data.content[i].name = res.data.content[i].nickname
        }
        console.log(res)
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      } catch (e) {
        this.$toast.warn(e)
      }
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
