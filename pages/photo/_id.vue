<template>
  <div class="img-detail">
    <div class="detail-container">
      <center :media-detail="mediaDetail" @updateMedia="updateMedia" />
      <!-- <right :mediaDetail="mediaDetail"></right> -->
    </div>
    <keywords :media-detail="mediaDetail" />
    <comments :media-detail="mediaDetail" :comment-list="commentList" />
  </div>
</template>

<script>
// import Right from './right/Right'
import Center from './center/Center'
import Keywords from './keywords/Keywords'
import Comments from '~/components/comments/Comments'

export default {
  components: {
    // Right,
    Center,
    Keywords,
    Comments
  },
  data() {
    return {
      mediaDetail: {},
      commentList: []
    }
  },
  async asyncData({ $axios, params }) {
    const rqBody = {
      media_id: params.id
    }
    const res = await $axios.mediaService.mediaDetail(rqBody)
    let tempMediaDetail = {}
    if (res.data.out === '1') {
      tempMediaDetail = res.data.data
    }

    const res_commentList = await $axios.mediaService.commentList(
      { media_id: tempMediaDetail.id },
      { line: '' }
    )
    const tempCommentList = []
    if (res_commentList.data.out === '1') {
      tempCommentList.push(...res_commentList.data.data)
    }

    return {
      mediaDetail: tempMediaDetail,
      commentList: tempCommentList
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    async fetchData() {
      const rqBody = {
        media_id: this.$route.params.id
      }

      const res = await this.$axios.mediaService.mediaDetail(rqBody)
      if (res.data.out === '1') {
        this.mediaDetail = res.data.data

        document.title = this.getTitle(this.mediaDetail)
      } else {
        this.$router.push({
          name: 'redirectToIndex'
        })
      }
    },
    updateMedia(mediaDetail) {
      this.mediaDetail = mediaDetail
    },
    getTitle(mediaDetail) {
      let title = ''
      try {
        title += mediaDetail.title + ' '
        mediaDetail.tag_list.map(e => {
          title += e.name + ' '
        })
        mediaDetail.category_list.map(e => {
          title += e.name + ' '
        })
        title += ' - 7MX.COM'
        return title
      } catch (e) {
        return '7MX - 中国领先的视觉创作社区'
      }
    }
  }
}
</script>

<style scoped>
.img-detail {
  width: 100%;
  height: 100%;
  min-width: 1200px;
}

.detail-container {
  display: flex;
  display: -webkit-flex;
  background-color: rgb(26, 26, 26);
  padding: 20px 0 40px 0;
}
</style>
