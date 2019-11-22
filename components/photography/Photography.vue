<template>
  <div class="photeography_container">
    <sharetitle :title="title" :category-list="categoryList" :identity="1" />
    <div class="content">
      <div
        v-for="(item, index) in firstAvatar"
        :key="index"
        class="content_left"
        @click.stop="goAvatarDetai(item.name)"
        @mouseenter="contentMouseenter(1000000)"
        @mouseleave="contentMouseLeave"
      >

        <img :src="item.avatar" alt>
        <h3>{{ item.nick }}</h3>
        <p>
          <span>{{ item.fan_num }}</span>粉丝
          <span>{{ 100 + item.fan_num * 100 + item.media_liked_num*10 }}</span>人气值
        </p>
        <avatar-dialog
          v-if="isHoverUser && currentHoverUser == 1000000"
          class="imgWarterfall-imgItem-avatarDialog"
          :user-data="item"
        />
      </div>
      <div class="content_right">
        <div
          v-for="(item,index) in avatarList"
          :key="index"
          class="photo_item"
          @click.stop="goAvatarDetai(item.name)"
          @mouseenter="contentMouseenter(index)"
          @mouseleave="contentMouseLeave(index)"
        >

          <img :src="item.avatar" alt class="avatar">
          <h3>{{ item.nick }}</h3>
          <p>
            <span>{{ item.fan_num }}</span>粉丝
            <span>{{ 100 + (item.fan_num * 100)*1 + item.media_liked_num*10 }}</span>人气值
          </p>
          <avatar-dialog
            v-if="isHoverUser && index == currentHoverUser"
            class="imgWarterfall-imgItem-avatarDialog"
            :user-data="item"
          />
        </div>
      </div>
    </div>
    <morecategory :more-info="moreInfo" :more-text="moreText" />
  </div>
</template>

<script>
import sharetitle from '~/components/common/share-title.vue'
import morecategory from '~/components/common/category_more.vue'
import AvatarDialog from '~/components/avatar-dialog/AvatarDialog'

export default {
  name: '',
  components: {
    sharetitle,
    morecategory,
    AvatarDialog
  },
  data: () => ({
    title: '推荐摄影师',
    moreText: '更多摄影师',
    moreInfo: 'ranking',
    line: '',
    isHoverUser: false,
    currentHoverUser: 1000000,
    mouseEnterTime: 0,
    mouseLeaveTime: 0,
    intervalTime: null,
    categoryList: [],
    currentAvatars: {},
    firstAvatar: [],
    avatarList: []
  }),
  async created() {
    const res = await this.$axios.commonService.categoryList({ type: '16' })
    if (res.data.data.length > 0) {
      for (const item of res.data.data) {
        const temp = {}
        temp.id = item.id
        temp.name = item.name
        this.categoryList.push(temp)
      }
    }

    this.getAvatars()

    this.$bus.on('choosephotography', index => {
      this.getAvatars(index)
    })
  },
  mounted() { },
  methods: {
    // 鼠标进入这个item
    contentMouseenter(index) {
      this.currentHoverUser = index
      this.mouseEnterTime = new Date().getTime()
      this.intervalTime = setTimeout(() => {
        this.isHoverUser = true
      }, 200)
    },
    // 鼠标离开这个item
    contentMouseLeave(index) {
      this.mouseLeaveTime = new Date().getTime()
      if (this.mouseLeaveTime - this.mouseEnterTime < 200) {
        clearTimeout(this.intervalTime)
      }
      this.isHoverUser = false
      this.currentHoverUser = 1000000
    },
    goAvatarDetai(path) {
      if (!path) {
        path = ''
      }
      this.$router.push({ path: `/${path}` })
    },

    async getAvatars(index = 0) {
      const rqBody = {
        category_id: this.categoryList[index].id
      }
      this.currentAvatars = {}
      const adv0 = await this.$axios.userService.recommendUser(rqBody, { line: '1,0,0' })
      const tmpData = adv0.data.data
      this.firstAvatar = tmpData.splice(0, 1)
      this.avatarList = tmpData.splice(0, 6)
    }
  }
}
</script>

<style lang='scss' scoped>
h3,
p {
  padding: 0;
  margin: 0;
}
.photeography_container {
  width: 100%;
}
.content {
  width: 1294px;
  height: 223px;
  margin: 0 auto;
  display: flex;
}
.content .content_left {
  cursor: pointer;
  width: 316px;
  height: 223px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(230, 230, 230, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 51px;
  box-sizing: border-box;
  position: relative;
  .imgWarterfall-imgItem-avatarDialog {
    position: absolute;
    top: 211px;
    left: -16px;
  }
}
.content .content_left img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.content .content_left h3 {
  padding-top: 15px;
  box-sizing: border;
  height: 28px;
  font-size: 20px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 28px;
}
.content .content_left p {
  // padding-top: 4px;
  padding-top: 16px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  line-height: 20px;
}
.content .content_left p span:nth-child(2) {
  margin-left: 6px;
}
.content .content_right {
  width: 968px;
  margin-left: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.content .content_right .photo_item {
  cursor: pointer;
  width: 316px;
  height: 106px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(230, 230, 230, 1);
  box-sizing: border-box;
  margin-bottom: 14px;
  position: relative;
  padding-left: 83px;
  padding-top: 30px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  .imgWarterfall-imgItem-avatarDialog {
    position: absolute;
    left: 0px;
    top: 105px;
    z-index: 1;
    //  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
  }
}
.content .content_right .avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: absolute;
  left: 13px;
  top: 24px;
}
.content .content_right h3 {
  height: 28px;
  font-size: 16px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 28px;
}
.content .content_right p {
  margin-top: 3px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangHK-Regular;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  line-height: 20px;
}
.content .content_right span:nth-child(2) {
  margin-left: 6px;
}
</style>
