<template>
  <div class="container">
    <div class="logo">
      <span @click="toIndex">
        <img :src="require('~/assets/img/m.svg')" alt="">
        <img :src="require('~/assets/img/7MX.svg')" alt="">
      </span>
    </div>
    <div
      v-if="ifshow"
      id="topbar-search-container"
      class="search is_index"
      @mouseleave="isTypeShow=false"
    >
      <div @mouseenter="isTypeShow=true">
        <div class="searchTT">
          <span class="searchType">{{ searchValue }}</span>
          <i class="search__dropDown_icon" />
          <div class="vertical_line" />
        </div>
        <div v-show="isTypeShow" class="searchTypeChoose">
          <div class="blankB" />
          <div class="triangle" />
          <div class="chooses">
            <div class="onshow" @click="searchValue = '图  片'; isTypeShow=false; tableIn=0">图 片</div>
            <div @click="searchValue = '商  店';isTypeShow=false; tableIn=1">商 店</div>
            <div @click="searchValue = '摄影师';isTypeShow=false; tableIn=2">摄影师</div>
          </div>
        </div>
      </div>
      <input v-model="searchInput" type="text" placeholder="搜索" @keyup.enter="search">
      <img class="searchIcon" src="./img/searchIcon.svg" alt="" @click="search">
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: ['ifshow'],
  data: () => ({
    searchInput: '',
    searchValue: '图 片',
    isTypeShow: false,
    tableIn: 0
  }),
  watch: {
    '$route.params.tag': function(val) {
      this.searchInput = val
    },
    '$route.params.tableIndex': function(val) {
      if (val == 0) {
        this.searchValue = '图  片'
      }
      if (val == 1) {
        this.searchValue = '商  店'
      }
      if (val == 2) {
        this.searchValue = '摄影师'
      }
    },
    '$route.params.page': function(val) {}
  },
  methods: {
    search: function() {
      this.$router.push({
        name: 'search-tag-table-page',
        params: {
          tag: this.searchInput,
          table: this.tableIn,
          page: 1
        }
      })
    },
    toIndex() {
      window.location.replace('/')
    }
  }
}
</script>

<style scoped lang='scss'>
.blankB {
  width: 86px;
  height: 10px;
  background-color: transparent;
  position: absolute;
  top: -10px;
}

.chooses{
  padding-bottom: 12px;
}

.chooses > div {
  cursor: pointer;
  height: 24px;
  line-height: 24px;
  padding: 4px 12px;
}

.chooses > div:hover {
  color: gray;
}

.triangle {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #fff;
  transform: rotate(45deg);
  left: 50%;
  margin-left: -10px;
  top: -2px;
  z-index: -1;
}

.onshow {
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  color: rgb(0, 0, 0);
  line-height: 22px;
}

.searchTypeChoose {
  text-align: center;
  position: absolute;
  background: rgb(255, 255, 255);
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.14);
  border: 1px solid rgba(247, 247, 247, 1);
  width: 86px;
  border-radius: 6px;
  top: 43px;
  left: 0px;
  z-index: 9999;
}

.searchTT {
  width: 70px;
  cursor: pointer;
}

.vertical_line {
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  margin-top: -10px;
  left: 92px;
  opacity: 0.4;
}

.search__dropDown_icon {
  display: inline-block;
  background: url(../../assets/img/dropDown-black.svg) no-repeat;
  background-size: 100%;
  background-position: center;
  width: 13px;
  height: 13px;
  margin-left: 2px;
}

.searchType {
  color: #fff;
  line-height: 38px;
  height: 38px;
  display: inline-block;
  width: 50px;
  text-align: center;
  margin-left: -3px;
}

.container {
  flex: 1;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  position: relative;
  /* padding-bottom: 10px; */
}

.logo {
  height: 50px;
  width: 368px;
  margin: 6px 0 0 15px;
  padding: 13px 0 0 14px;
  box-sizing: border-box;
  -webkit-background-size: cover !important;
  -moz-background-size: cover !important;
  -o-background-size: cover !important;
  background-size: cover !important;
  -webkit-background-position: center !important;
  -moz-background-position: center !important;
  -o-background-position: center !important;
  background-position: center !important;
  span {
    cursor: pointer;
  }
}
.logo.index {
  height: 263;
}

.logo img:nth-child(1) {
  width: 30px;
  height: 22px;
}
.logo img:nth-child(2) {
  width: 78px;
  height: 21px;
}

.search {
  height: 40px;
  border-radius: 5px;
  border: none;
  padding: 0 12px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  position: absolute;
  left: 154px;
  // top: 11px;
  background: rgba(255, 255, 255, 0.2);
}

input {
  height: 38px;
  border-radius: 5px;
  background-color: hsla(0, 0%, 100%, 0);
  border: none;
  padding: 0px 12px;
  color: #fff;
  font-size: 16px;
  display: inline-block;
  margin-left: 10px;
}

input:focus {
  outline: none;
  border: none;
}

.searchIcon {
  width: 24px;
  cursor: pointer;
}

::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: rgba(255, 255, 255, 0.8);
}

::-moz-placeholder {
  /* Firefox 19+ */
  color: rgba(255, 255, 255, 0.8);
}

:-moz-placeholder {
  /* Firefox 18- */
  color: rgba(255, 255, 255, 0.8);
}
</style>
