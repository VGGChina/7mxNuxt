<template>
  <div
    v-scroll="getMore"
    style="position: relative"
  >
    <table-nav
      :options="options"
      :default-index="tableIndex"
      :is-loading="isLoading"
    />

    <user-preview :user-list="userList" />

    <loading
      :is-loading="isLoading"
      :loading-color="'#000'"
      class="loading"
    />

    <no-content :is-no-content-show="userList.length < 1 && line == 'end' && !isLoading" />

    <div
      v-if="userList.length > 0 && line == 'end' && !isLoading"
      class="no-more"
    >
      —— & ——
    </div>
  </div>
</template>

<script>
import TableNav from '~/components/table/TableNav'
import NoContent from '~/components/no-content/NoContent'
import UserPreview from '~/components/user-preview/UserPreview'
import loading from '~/components/loading/Loading'

export default {
  components: {
    'no-content': NoContent,
    TableNav,
    UserPreview,
    loading
  },
  data() {
    return {
      userDetail: {},
      userList: [],
      line: '',
      isLoading: false,
      options: [{
        name: '0 关注',
        url: ''
      }, {
        name: '0 追随者',
        url: ''
      }]
    }
  },
  computed: {
    tableIndex() {
      return this.$route.params.tableIndex
    }
  },
  watch: {
    '$route.params.userId': function(val) {
      this.reload()
    },
    '$route.params.tableIndex': function(val) {
      this.reload()
    }
  },
  created() {
    this.getUserDetail()

    if (this.tableIndex == '0') {
      this.getFollowList()
    } else if (this.tableIndex == '1') {
      this.getFansList()
    }
  },
  methods: {
    reload() {
      if (this.isLoading) {
        return
      }

      this.userList = []

      this.line = ''

      if (this.tableIndex == 0) {
        this.$router.push({
          name: 'friends',
          params: {
            tableIndex: '0'
          }
        })
        this.getFollowList()
      } else if (this.tableIndex == 1) {
        this.$router.push({
          name: 'friends',
          params: {
            tableIndex: '1'
          }
        })
        this.getFansList()
      }
    },
    async getUserDetail() {
      if (!this.$route.params.userId) {
        return
      }

      const rqBody = {
        user_id: this.$route.params.userId
      }
      const res = await this.$axios.userService.userDetail(rqBody)

      if (res.data.out === '1') {
        this.userDetail = res.data.data
        document.title = (this.userDetail.nick || this.userDetail.name) + '的人脉 - 7MX 中国领先的视觉创作社区'
        this.options = [{
          name: this.userDetail.follow_num + ' 关注',
          url: '/friends/' + rqBody.user_id + '/0'
        }, {
          name: this.userDetail.fan_num + ' 追随者',
          url: '/friends/' + rqBody.user_id + '/1'
        }]
      }
    },
    async getFollowList() {
      if (this.isLoading || this.line === 'end') {
        return
      }

      this.isLoading = true
      const data = { user_id: this.$route.params.userId }
      const params = { line: this.line }

      const res = await this.$axios.userService.getFollow(data, params)

      if (res.data.out === '1') {
        this.userList.push(...res.data.data)
      }
      this.line = res.data.line
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    async getFansList() {
      if (this.isLoading || this.line === 'end') {
        return
      }

      this.isLoading = true
      const data = { user_id: this.$route.params.userId }
      const params = { line: this.line }

      const res = await this.$axios.userService.getFan(data, params)

      if (res.data.out === '1') {
        this.userList.push(...res.data.data)
      }
      this.line = res.data.line
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    getMore() {
      if (this.tableIndex == 0) {
        this.getFollowList()
      } else if (this.tableIndex == 1) {
        this.getFansList()
      }
    },
    showFan() {
      this.isFollow = !this.isFollow
      if (!this.isFollow && this.fansList.length < 1) {
        this.getFansList()
      }
    },
    bgStyle: function(url) {
      if (url !== '') {
        return { backgroundImage: 'url("' + url + '")' }
      } else {
        return { background: '#ddd' }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.friends-wrapper {
  width: 99%;
  margin: 0 auto;
  padding-top: 16px;
}

.fansInfo {
  box-sizing: border-box;
  display: inline-block;
  width: 25%;
  @media screen and (max-width: 1400px) {
    width: 33.33%;
  }
  height: 300px;
  padding: 10px;
}

.fansInfo .outter {
  width: 100%;
  height: 100%;
  background-size: cover;
  -moz-background-size: cover;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transform: translate3d(0,0,0);
  background: #000;
  transition: all .3s ease;
  &:hover {
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
      // transform: translateY(-2px);
      .avatarBg {
          transform: translate3d(0,0,0) scale(1.1);
      }
  }
}

.avatarBg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    opacity: .6;
    transform: translate3d(0,0,0);
    transition: all 4s cubic-bezier(0.11, 0.38, 0.25, 1);
}

.fansInfo .fansAvatars {
  border: 5px solid rgba(255,255,255,.95);
  border-radius: 50%;
  width: 90px;
  height: 90px;
  margin: 50px auto 10px;
  background: rgba(255,255,255,.95);
  position: relative;
  z-index: 1;
}

.fansInfo .fansAvatar {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  border-radius: 200px;
}

.fansInfo .fansName {
  color: white;
  width: 100%;
  margin-top: 26px;
  font-size: 22px;
  text-align: center;
  letter-spacing: 2px;
  position: relative;
  z-index: 1;
}

.fans:hover {
  cursor: pointer;
}

.follows:hover {
  cursor: pointer;
}

.active {
  color: white !important;
}

.loading {
  margin-top: 100px;
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
