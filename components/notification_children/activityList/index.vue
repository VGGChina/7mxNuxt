<template>
  <div class="activityList">
    <div class="list">
      <div v-for="(item, i) in list" :key="i" class="list_item">
        <div class="avatar" :style="{ 'backgroundImage' : `url(${item.avatar })` }" @click="toUser(item.id)" />
        <div class="text">
          <div class="operation">
            <span class="name" @click="toUser(item.id)">{{ item.nickname }}</span>
            <span class="action">&nbsp;{{ actionTip(item.msg_type) }}</span>
            <span v-if="item.media.title" style="cursor: pointer" @click="toPhoto(item.mediaId)">&nbsp;&nbsp;《 {{ item.media.title }} 》</span>
          </div>
          <div v-if="item.mediaId" class="photo" :style="{ 'backgroundImage' : `url(${item.image})` }" @click="toPhoto(item.mediaId)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityList',
  components: {

  },
  props: [
    'list'
  ],
  data: () => ({
  }),
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    toUser(id) {
      window.open(`/user/id/${id}`, '_blank')
    },
    toPhoto(photoId) {
      if (!photoId) return this.$toast.warn('作品地址已失效')
      window.open(`/photo/${photoId}`)
    },
    actionTip(type) {
      if (type == '1') {
        return '关注了您'
      } else if (type == '2') {
        return '赞了'
      } else if (type == '3') {
        return '评论了'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
* {
  color: #000;
}
.list_item {
  display: flex;
  height: 62px;
  margin: 12px 12px;
  border-radius: 10px;
  position: relative;
  align-items: center;
  transition: all .2s;
  &:hover {
    background: rgba(0,0,0,0.05);
  }
  .avatar {
    width: 50px;
    height: 50px;
    margin-left: 4px;
    margin-right: 10px;
    border-radius: 100px;
    background-size: cover;
    cursor: pointer;
  }
  .text {
    font-size: .95rem;
    .operation {
        width: 500px;
        height: 20px;
        float: left;
      .name {
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        float: left;
        cursor: pointer;
      }
      .action {
        display: block;
        float: left;
        color: rgba(0,0,0,0.6);
      }
    }
    .title {
      float: right;
      text-align: right;
      width: 340px;
      span {
        cursor: pointer;
      }
    }
  }
  .photo {
    width: 50px;
    height: 50px;
    background-size: cover;
    position: absolute;
    right: 8px;
    top: 6px;
    cursor: pointer;
  }
}
</style>
