<template>
  <div class="img-detail">
    <div class="detail-container">
      <center :media-detail="mediaDetail" />
      <right :media-detail="mediaDetail" :media-exif-list="mediaExifList" />
    </div>
    <keywords :media-detail="mediaDetail" />
    <comments :media-detail="mediaDetail" :comment-list="commentList" :commentPage="commentPage"/>
  </div>
</template>

<script>

import axios from 'axios'

import Right from '~/components/right/Right'
import Center from '~/components/photo_children/Center'
import Keywords from '~/components/keywords/Keywords'
import Comments from '~/components/comments/Comments'

export default {
  components: {
    Right,
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
  created() {
    this.fetchData()
  },
  async asyncData({ $axios, params }) {
    console.log(222)
    const rqBody = {
      media_id: params.id
    }
    const res = await $axios.mediaService.mediaDetail(rqBody)
    let tempMediaDetail = {}
    if (res.status == 200) {
      console.log(22,res.data)
      tempMediaDetail = res.data
      const res_user = await $axios.userService.userDetail({ userId: tempMediaDetail.userId })
      if (res_user.status == 200) {
        tempMediaDetail.user_data = res_user.data
      }
    }

    const res_commentList = await $axios.mediaService.commentList(
      { media_id: params.id }
    )
    console.log(22,res_commentList.data)
    const tempCommentList = []
    let commentPage = 0
    if (res_commentList.status == 200) {
      tempCommentList.push(...res_commentList.data.content)
      commentPage = res_commentList.data.totalPages
    }

    for (const i of tempCommentList) {
      const res_temp = await $axios.userService.userDetail({ userId: i.userId })
      if (res_temp.status == 200) {
        i.user_data = res_temp.data
      }
    }

    const res_exifUrl = await $axios.mediaService.exifUrl({
      media_id: params.id
    })

    let tempMediaExifList = [
      {
        key: 'Make',
        label: '品牌',
        value: 'no make'
      },
      {
        key: 'Model',
        label: '型号',
        value: 'no model'
      },
      {
        key: 'FocalLength',
        label: '焦距',
        value: 'no focal length'
      },
      {
        key: 'ApertureValue',
        label: '光圈',
        value: 'no aperture'
      },
      {
        key: 'ShutterSpeedValue',
        label: '快门速度',
        value: 'no shutter speed'
      },
      {
        key: 'ISOSpeedRatings',
        label: 'ISO',
        value: 'no iso speed ratings'
      },
      {
        key: 'ExposureBiasValue',
        label: '曝光补偿',
        value: 'no exposure bias'
      },
      {
        key: 'BrightnessValue',
        label: '亮度',
        value: 'no exposure bias'
      }
    ]
    function isInArray(mediaExifList, key) {
      for (let i = 0; i < mediaExifList.length; i++) {
        if (key === mediaExifList[i].key) {
          return true
        }
      }
      return false
    }

    function getMediaExifList(mediaExifList, exifData) {
      for (const key in exifData) {
        if (isInArray(mediaExifList, key)) {
          for (let i = 0; i < mediaExifList.length; i++) {
            if (mediaExifList[i].key == key) {
              mediaExifList[i].value = exifData[key].val
            }
          }
        }
      }
      return mediaExifList
    }

    if (res_exifUrl.data.out == '1') {
      const exifUrl = res_exifUrl.data.data.exif_url
      let res1
      let temp
      if (exifUrl.indexOf('https') > -1) {
        temp = { url: exifUrl, method: 'GET' }
      } else {
        temp = { url: exifUrl.replace('http', 'https'), method: 'GET' }
      }
      await axios(temp).then(
        res1 => {
          if (res1.status === 200) {
            tempMediaExifList = getMediaExifList(tempMediaExifList, res1.data)
          }
        }
      ).catch(
        err => {
          console.log(err)
        }
      )
    }

    return {
      mediaDetail: tempMediaDetail,
      commentList: tempCommentList,
      mediaExifList: tempMediaExifList,
      commentPage: commentPage
    }
  },
  methods: {
    async fetchData() {
      const rqBody = {
        media_id: this.$route.params.id
      }
      const res = await this.$axios.mediaService.mediaDetail(rqBody)
      if (res.status == 200) {
        let temp = this.mediaDetail
        this.mediaDetail.likeOrNot = res.data.likeOrNot
        this.mediaDetail.followOrNot = res.data.followOrNot
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
