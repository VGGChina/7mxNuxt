<template>
  <div class="container_content">
    <div class="content">
      <img :src="require('~/assets/img/m.svg')" class="logo">
      <h3 class="title">7MX——Home Business Advertising Ideas</h3>
      <div class="search is_index">

        <div @mouseleave="mleave()">

          <div class="searchTT" @mouseenter="menter()">
            <span class="searchType">{{ searchValue }}</span>
            <i class="search__dropDown_icon" />
            <div class="vertical_line" />
          </div>

          <div v-show="isTypeShow" class="searchTypeChoose" @mouseleave="mleave()">
            <div class="blankB" />
            <div class="triangle" />
            <div class="chooses">
              <div class="onshow" @click="searchValue = '图  片'; isTypeShow=false; searchType=0">图 片</div>
              <div class="onshow" @click="searchValue = '商  店';isTypeShow=false; searchType=1">商 店</div>
              <div class="onshow" @click="searchValue = '摄影师';isTypeShow=false; searchType=2">摄影师</div>
            </div>
          </div>
        </div>

        <input v-model="searchInput" type="text" placeholder="搜索" @keyup.enter="search">
        <img class="searchIcon" src="./img/searchIcon.svg" alt @click="search">
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: '',
  data: () => ({
    searchInput: '',
    searchValue: '图 片',
    isTypeShow: false,
    searchType: 0
  }),
  methods: {
    ...mapActions(['isShowSearch']),
    search() {
      this.isShowSearch(false)
      this.$router.push({
        name: 'search-tag-table-page',
        params: {
          tag: this.searchInput,
          table: this.searchType,
          page: 1
        }
      })
    },
    menter() {
      this.isTypeShow = true
    },
    mleave() {
      this.isTypeShow = false
    }
  }
}
</script>

<style scoped lang='css' >
.container_content{
  height:268px;
  background: rgba(26,26,26,1)

}
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
  background-color: #FFF;
  transform: rotate(45deg);
  left: 50%;
  margin-left: -10px;
  top: -2px;
  z-index: -1;
}

.onshow {
  height:22px;
  font-size:16px;
  font-weight:400;
  color:rgb(0,0,0);
  line-height:22px;
}

.searchTypeChoose {
  text-align: center;
  position: absolute;
  background: rgb(255,255,255);
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.14);
  border: 1px solid rgba(247,247,247,1);
  width: 86px;
  border-radius: 6px;
  top: 48px;
  left: 0px;
  z-index: 9999;
}

.searchTT {
  width: 70px;
  cursor: pointer;
  padding-bottom: 14px;
}

.vertical_line {
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: #fff;
  position: absolute;
  margin-top: 12px;
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
  position: absolute;
  top: 50%;
  left: 68px;
  margin-top: -5px;
}

.searchType {
  color: #fff;
  margin-left: 12px;
  margin-top: 11px;
  display: inline-block !important;
}

/*  */

.constiner_content {
  position: relative;
}
.content {
  width: 813px;
  height: 160px;
  position: absolute;
  top: 84px;
  left: 50%;
  margin-left: -407px;
  z-index: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media screen and (max-width: 1334px) {
  .content {
    position: absolute;
    top: 84px;
    left: 250px;
    margin-left: 0px;
  }
}
.content .logo {
  width: 68px;
  height: 50px;
  font-size: 26px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 37px;
}
.content .title {
  margin-top: 10px;
  font-size: 26px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 37px;
}
.content .search {
  width: 813px;
  height: 44px;
  box-sizing: border-box;
  padding-right: 42px;
  position: absolute;
  bottom: 0;
  border-radius: 3px;
  background: rgba(50, 50, 50, 1);
}
.content .search img {
  width: 32px;
  height: 32px;
  position: absolute;
  right: 10px;
  top: 6px;
}
.content .search input {
    box-sizing: border-box;
    border: none;
    width: 76%;
    height: 44px;
    border-radius: 3px;
    background: rgba(50, 50, 50, 1);
    padding: 10px 0 10px 8px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    margin-left: 98px;
    position: absolute;
    top: 0px;
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
.content {
  color: #fff;
}
</style>
