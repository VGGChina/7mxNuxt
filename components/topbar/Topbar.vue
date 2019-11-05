<template>
  <div :class="['topbar-contanier',!isIndex ? 'is_index' : null]">
    <div id="topbar" class="topbar" :style="topbarStyle">
      <div style="width: calc(100% / 3); min-width: 500px;">
        <search :ifshow="isIndex || isShowSearch" />
      </div>
      <div class="center" style="width: calc(100% / 3)">
        <a href="/" style="margin-left: 0px" :class="{'cl-white': $route.name == 'index'}">首页</a>
        <a :class="{'cl-white': $route.name == 'user-follow'}" @click="toFollow()">动态</a>
        <div @mouseenter="showCategory = true" @mouseleave="showCategory = false">
          <router-link to="/category/全部/0/0/1" :class="{'cl-white': $route.name == 'category'}">探索</router-link>
          <!-- <transition name='category-fade'> -->
          <category v-if="showCategory" :is-topbar="true" class="category" />
          <!-- </transition> -->
        </div>
        <router-link to="/activity/0" :class="{'cl-white': $route.name == 'activity'}">活动</router-link>
        <router-link to="/ranking/0/1" :class="{'cl-white': $route.name == 'ranking'}">榜单</router-link>
        <a href="https://v.paixin.com/" target="_blank">商店</a>
        <router-link to="/about" :class="{'cl-white': $route.name == 'about'}">关于</router-link>
      </div>
      <user-action />
    </div>
    <Content v-if="$route && '/' == $route.path" />
  </div>
</template>

<script>
import Search from './Search.vue'
import Content from './Content.vue'
import UserAction from './UserAction.vue'
import Category from '~/components/category/Category'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    showCategory: false,
    pageY: 0,
    isShowTopbar: true,
    isIndex: false,
    isShowSearch: false
  }),
  methods: {
    noUse() {
      this.$toast.warn('暂功能暂未上线，敬请期待')
    },
    toFollow() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
      } else {
        this.$router.push({
          name: 'follow'
        })
      }
    },
    getRoute() {
      const { path } = this.$route
      if (path === '/') {
        this.currentIndex = true
        const flag = this.pageY < 300
        flag ? this.isIndex = false : this.isIndex = true
      } else {
        this.isIndex = true
      }
    }
  },
  computed: {
    ...mapGetters(['getShowSearch', 'winPageYOffset']),
    topbarStyle() {
      const name = this.$route.name
      if (name == null) {
        return {
          background: 'transparent',
          position: 'absolute'
        }
      } else {
        if (process.browser && document.getElementById('topbar-search-container')) {
          document.getElementById('topbar-search-container').style.backgroundColor = 'rgba(190, 190, 190, .15)'
        }
      }

      if (
        name === 'contributor' ||
        name === 'user-home' ||
        name === 'paixin-login' ||
        name === 'about' ||
        name === 'user-id'
      ) {
        return {
          background: 'transparent',
          position: 'absolute'
        }
      }
      return {
        opacity: '1',
        background: '#1a1a1a'
      }
    },
    ...mapGetters(['isLogin', 'loginUser'])
  },
  components: {
    Search,
    UserAction,
    Category,
    Content
  },
  watch: {
    '$route.path': function(newval, oldval) {
      this.getRoute()
    },
    getShowSearch(val) {
      this.isIndex = val
    },
    winPageYOffset(newval, oldval) {
      this.pageY = newval
      if (this.winPageYOffset < 400 && this.$route.path === '/') {
        this.isIndex = false
      }
      if (newval >= 500) {
        this.isShowSearch = true
      } else {
        this.isShowSearch = false
      }
    }
  },
  created() {
    this.getRoute()
  }
}
</script>

<style lang='scss' scoped>
.category-fade-enter-active {
  transition: opacity 0.5s, transform 0.5s;
}

.category-fade-enter,
.category-fade-leave-active {
  opacity: 0 !important;
  transform: translate3d(-228px, 40px, 0) !important;
}

.category {
  position: absolute;
  z-index: 10;
  transform: translate3d(-280px, 40px, 0);
}

.topbar-contanier {
  width: 100%;
  height: 60px;
  min-width: 1200px;
  background: rgba(26, 26, 26, 1);
}

.topbar-contanier.is_index {
  height: 263px;
  min-width: 1334px;
}

.topbar {
  box-sizing: border-box;
  width: 100%;
  min-width: 1200px;
  height: 60px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  position: fixed;
  z-index: 10;
  transform: translate3d(0, 0, 0);
  top: 0px;
  > .center {
    > a {
      text-shadow: 0 0 50px black;
    }
  }
}

.center {
  text-align: center !important;
}

.center a {
  color: rgba(255, 255, 255, 0.7);
  margin-left: 16px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
}

.center a:hover {
  color: rgba(255, 255, 255, 1);
}

.center div {
  display: inline;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.center div:hover {
  color: rgba(255, 255, 255, 1);
}

.cl-white {
  color: #fff !important;
}
</style>
