<template>
  <div class="img-detail">
    <div class="detail-container">
      <center :media-detail="mediaDetail" />
      <right :media-detail="mediaDetail" :media-exif-list="mediaExifList" />
    </div>
    <keywords :media-detail="mediaDetail" />
    <comments :media-detail="mediaDetail" :comment-list="commentList" />
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

    const res_exifUrl = await $axios.mediaService.exifUrl({
      media_id: tempMediaDetail.id
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
      axios(temp).then(
        res => {
          tempMediaExifList = getMediaExifList(tempMediaExifList, res1.data)
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
    }
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
