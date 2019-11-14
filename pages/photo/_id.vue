<template>
  <div class="img-detail">
    <div class="detail-container">
      <center :mediaDetail="mediaDetail" v-on:updateMedia="updateMedia"></center>
      <!-- <right :mediaDetail="mediaDetail"></right> -->
    </div>
    <keywords :mediaDetail="mediaDetail"></keywords>
    <comments :mediaDetail="mediaDetail" :commentList="commentList"></comments>
  </div>
</template>

<script>
import Right from '~/components/right/Right'
import Center from './center/Center'
import Keywords from '~/components/keywords/Keywords'
import Comments from '~/components/comments/Comments'

export default {
  data() {
    return {
      mediaDetail: {},
      commentList: []
    }
  },
  async asyncData({ $axios, params }) {
    let rqBody = {
      media_id: params.id
    }
    // console.log(111111)
    let res = await $axios.mediaService.mediaDetail(rqBody)
    // console.log(222222222)
    let tempMediaDetail = {}
    if (res.data.out == '1') {
      tempMediaDetail = res.data.data
    }

    let res_commentList = await $axios.mediaService.commentList(
      { media_id: tempMediaDetail.id },
      { line: '' }
    )
    let tempCommentList = []
    if (res_commentList.data.out == '1') {
      tempCommentList.push(...res_commentList.data.data)
    }

    let res_exifUrl = await $axios.mediaService.exifUrl({
      media_id: tempMediaDetail.id
    })
    console.log(res_exifUrl)

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
      let rqBody = {
        media_id: this.$route.params.id
      }

      let res = await this.$apiFactory.getMediaApi().mediaDetail(rqBody)
      if (res.data.out == '1') {
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
  },
  components: {
    Right,
    Center,
    Keywords,
    Comments
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