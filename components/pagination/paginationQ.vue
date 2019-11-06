<template>
  <div v-if="pageList.length > 0" class="pagination-container">
    <div>
      <div
        v-for="(page, index) in pageList"
        :key="index"
        class="pagination-page"
        :class="{
          'pagination-current': page == currentPage
        }"
      >
        <router-link
          v-if="baseUrl && page != '...'"
          class="pagination-page-router"
          :to="baseUrl + page"
        >
          {{ page }}
        </router-link>

        <span
          v-if="!baseUrl || page == '...'"
          class="pagination-page-router"
          @click="jumpTo(page)"
        >
          {{ page }}
        </span>
      </div>

      <div
        v-if="!baseUrl && currentPage != line.split(',')[1]"
        class="pagination-next"
        @click="jumpTo(currentPage + 1)"
      >
        下一页
      </div>

      <router-link
        v-if="baseUrl && currentPage != line.split(',')[1]"
        class="pagination-next"
        :to="baseUrl + (currentPage + 1)"
      >
        下一页
      </router-link>

      <div class="pagination-jump">
        到第
        <input v-model="jumpPage" type="text" @keyup.enter="jumpTo(jumpPage)">
        页
        <div @click="jumpTo(jumpPage)">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'line',
    'baseUrl'
  ],
  data() {
    return {
      jumpPage: ''
    }
  },
  computed: {
    currentPage() {
      if (!this.line) {
        return 0
      }

      const lineArray = this.line.split(',')

      return lineArray[0] == 'end' ? parseInt(lineArray[2]) : parseInt(lineArray[0]) - 1
    },
    pageList() {
      if (!this.line) {
        return []
      }

      const list = []
      const lineArray = this.line.split(',')

      if (lineArray.length !== 3) {
        return list
      }

      if (lineArray[1] <= 10) {
        for (let i = 0; i < lineArray[1]; i++) {
          list.push(i + 1)
        }

        return list
      }

      const currentPage = lineArray[0] == 'end' ? parseInt(lineArray[2]) : parseInt(lineArray[0]) - 1

      if (currentPage <= 4) {
        for (let i = 0; i < 10; i++) {
          if (i < 8) {
            list.push(i + 1)
          }

          if (i == 8) {
            list.push('...')
          }

          if (i == 9) {
            list.push(parseInt(lineArray[1]))
          }
        }

        return list
      }

      if (parseInt(lineArray[1]) - currentPage <= 6) {
        for (let i = 0; i < 10; i++) {
          if (i == 0) {
            list.push(1)
          }

          if (i == 1) {
            list.push('...')
          }

          if (i > 1) {
            list.push(parseInt(lineArray[1]) - (9 - i))
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
          list.push(lineArray[1])

          continue
        }

        list.push(i)
      }

      return list
    }
  },
  methods: {
    jumpTo(page) {
      if (page == this.currentPage || page == '...') {
        return
      }

      const lineArray = this.line.split(',')

      if (page == '' || page < 0 || page > parseInt(lineArray[1])) {
        this.$toast.warn('页码错误！')

        return
      }

      lineArray[0] = page + ''

      this.$emit('paginationJumpToPage', lineArray.join(','))

      this.jumpPage = ''
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
