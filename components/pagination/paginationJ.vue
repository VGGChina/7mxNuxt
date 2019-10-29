<template>
  <div class="pagination-container" v-if="pageList.length > 0">
    <div>
      <div class="pagination-page"
        v-for="(page, index) in pageList"
        :key="index"
        :class="{
          'pagination-current': page == currentPage
        }">
        <router-link class="pagination-page-router"
          v-if="baseUrl && page != '...'"
          :to="baseUrl + page">
          {{ page }}
        </router-link>

        <span class="pagination-page-router"
          v-if="!baseUrl || page == '...'"
          @click="jumpToPage(page)">
          {{page}}
        </span>
      </div>

      <div class="pagination-next"
        v-if="!baseUrl && currentPage != pageNum"
        @click="jumpToPage(currentPage + 1)">
        下一页
      </div>

      <router-link class="pagination-next"
        v-if="baseUrl && currentPage != pageNum"
        :to="baseUrl + (parseInt(currentPage) + 1)">
        下一页
      </router-link>

      <div class="pagination-jump">
        到第
        <input v-model="jumpPage" @keyup.enter="jumpToPage(jumpPage)" type="text">
        页
        <div @click="jumpToPage(jumpPage)">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'limit',
    'count',
    'currentPage',
    'baseUrl'
  ],
  data() {
    return {
      jumpPage: ''
    }
  },
  methods: {
    jumpToPage(page) {
      if (page == parseInt(this.currentPage) || page == '...') {
        return
      }

      if (page == '' || page <= 0 || page > this.pageNum) {
        this.$toast.warn('页码错误！')

        return
      }

      let line = this.limit * (page - 1)

      this.$emit('paginationJumpToPage', page, line)

      this.jumpPage = ''
    }
  },
  computed: {
    pageNum() {
      return Math.floor(this.count / this.limit) +
        (this.count % this.limit == 0 ? 0 : 1)
    },
    pageList() {
      if (!this.count) {
        return []
      }

      let list = []
      let currentPage = parseInt(this.currentPage)
      let pageNum = Math.floor(this.count / this.limit) +
        (this.count % this.limit == 0 ? 0 : 1)

      if (pageNum <= 10) {
        for (let i = 0; i < pageNum; i++) {
          list.push(i + 1)
        }

        return list
      }

      if (currentPage <= 4) {
        for (let i = 0; i < 10; i++) {
          if (i < 8) {
            list.push(i + 1)
          }

          if (i == 8) {
            list.push('...')
          }

          if (i == 9) {
            list.push(pageNum)
          }
        }

        return list
      }

      if (pageNum - currentPage <= 6) {
        for (let i = 0; i < 10; i++) {
          if (i == 0) {
            list.push(1)
          }

          if (i == 1) {
            list.push('...')
          }

          if (i > 1) {
            list.push(pageNum - (9 - i))
          }
        }

        return list
      }

      for (let i = currentPage - 4; i < currentPage + 6; i++) {
        if (i == currentPage - 4) {
          list.push(1)

          continue
        }

        if (i == currentPage - 3 || i == currentPage + 4) {
          list.push('...')

          continue
        }

        if (i == currentPage + 5) {
          list.push(pageNum)

          continue
        }

        list.push(i)
      }

      return list
    }
  }
}
</script>


<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: center;
}

.pagination-page {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 4px;
  margin-right: 6px;
  text-align: center;
  cursor: pointer;
  transition: all .1s;
  font-size: 0.9em;

  .pagination-page-router {
    display: block;
    color: inherit;
    padding: 8px 12px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
}

.pagination-next {
  @extend .pagination-page;
  padding: 8px 12px;
  color: #000;
}

.pagination-jump {
  display: inline-block;
  margin: 0 0 0 12px;

  input {
    box-sizing: border-box;
    width: 50px;
    height: 34px;
    margin-left: 6px;
    margin-right: 6px;
    text-align: center;
    padding-left: 0;
    font-size: 0.9em;
  }

  div {
    @extend .pagination-page;
    margin: 0 0 0 12px;
    padding: 8px 12px;
  }
}

.pagination-current {
  color: #fff !important;
  border: 1px solid #64c896 !important;
  background: #64c896 !important;
}
</style>
