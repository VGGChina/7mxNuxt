<template>
  <div class="choose-works" @click.stop="noUse">
    <div class="left">
      <div class="title">选择作品</div>
      <work-pre :media-list="mediaList" @selected="handle"/>
      <no-content
        :is-no-content-show="!isFetching && mediaIdList.length < 1"
        :content="'Sorry，暂无可以参加活动的历史作品'"
      />
      <div
        v-if="mediaIdList.length > 0"
        class="more-comments"
        @click="loadMore"
      >{{ mediaList.length >= mediaIdList.length ? '没有更多' : '加载更多' }}</div>
    </div>
    <div class="right">从左侧个人主页图片中选择图片参加比赛
      <div class="next-button" @click="commit">确定</div>
    </div>
  </div>
</template>

<script>
import NoContent from '~/components/no-content/NoContent'
import WorkPre from './work-pre/WorkPre'

export default {
  components: {
    WorkPre,
    NoContent
  },
  props: ['tagId', 'activityId'],
  data() {
    return {
      mediaIdList: [],
      mediaList: [],
      isFetching: false
    }
  },
  computed: {
    loginUser() {
      return this.$store.state.login.loginUser
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.isFetching = true

      const reBody = {
        type: '6',
        tag_id: this.tagId
      }

      const res = await this.$axios.mediaService.notInTagList(reBody)

      if (res.data.out === '1') {
        this.mediaIdList.push(...res.data.data)

        this.loadMore()
      }

      setTimeout(() => {
        this.isFetching = false
      }, 500)
    },
    async loadMore() {
      if (this.mediaList >= this.mediaIdList.length) {
        return
      }

      let id = ''

      for (let i = this.mediaList.length; i < this.mediaList.length + 20; i++) {
        if (this.mediaIdList[i]) {
          id = id + this.mediaIdList[i] + ','
        }
      }

      const rqBody = {
        mode: 'media_id',
        search: id.substring(0, id.length - 1)
      }

      const res = await this.$axios.mediaService.commonList(rqBody)

      if (res.data.out === '1') {
        this.mediaList.push(...res.data.data)

        this.mediaList.forEach(e => {
          e.isSelected = false
        })
      }
    },
    handle(list) {
      this.mediaList = list
    },
    getMediaId() {
      let mediaId = ''

      this.mediaList.forEach(e => {
        if (e.isSelected) {
          mediaId = mediaId + e.id + ','
        }
      })

      return mediaId.substring(0, mediaId.length - 1)
    },
    async commit() {
      // this.$emit('cancleActivityChooseWorksDialog', false)
      const rqBody = {
        tag_id: this.activityId,
        media_id: this.getMediaId()
      }

      const res = await this.$axios.mediaService.addTag(rqBody)

      if (res.data.out === '1') {
        this.$toast.notice('参加活动成功')

        this.$emit('cancleActivityChooseWorksDialog', false)
      }
    },
    noUse() {
      //
    }
  }
}
</script>

<style scoped>
.choose-works {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  display: flex;
  display: -webkit-flex;
  position: fixed;
  z-index: 30;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
}

.left {
  flex: 1;
  -webkit-flex: 1;
  height: 100%;
  overflow: auto !important;
  padding: 30px 0 0 0;
  box-sizing: border-box;
  background: #fff;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  position: relative;
}

.title {
  font-size: 20px;
  text-align: center;
}

.right {
  flex: none;
  -webkit-flex: none;
  box-sizing: border-box;
  width: 420px;
  height: 100%;
  background: #f5f5f5;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 40px 20px;
  font-size: 14px;
  line-height: 2.5;
}

.next-button {
  width: 100%;
  height: 45px;
  border-radius: 6px;
  background-color: #56cb8f;
  color: #fff;
  text-align: center;
  line-height: 45px;
  margin-top: 30px;
  cursor: pointer;
}

.more-comments {
  width: 140px;
  height: 34px;
  margin-bottom: 30px;
  margin-left: calc(50% - 79px);
  margin-left: -moz-calc(50% - 70px);
  margin-left: -webkit-calc(50% - 70px);
  text-align: center;
  line-height: 34px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  background-color: #f7f7f7;
}
</style>

