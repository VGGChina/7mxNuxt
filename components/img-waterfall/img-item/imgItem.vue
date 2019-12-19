<template>
  <div
    class="imgWarterfall-imgItem"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <!-- 图片 -->
    <img
      :src="$utilHelper.getCompressionUrl(img.image, 600, 1000)"
      :alt="imageAlt"
    >

    <!-- 图片遮罩 -->
    <div class="imgWarterfall-imgItem-mask">
      <a :href="getImageDetailPage()" target="_blank" />
    </div>

    <!-- 按钮 -->
    <transition name="buttons-fade">
      <div
        v-if="isHover"
        class="imgWarterfall-imgItem-buttons"
      >

        <!-- 喜欢按钮 -->
        <div
          v-if="true || !isImgAuthor"
          class="imgWarterfall-imgItem-like"
          @click.stop="likeImg()"
        >
          <div
            :style="{
              backgroundImage: 'url(' + (img.is_like == '1' ?
                require('./img/likeRed.svg') :
                require('./img/like.svg')) + ')'
            }"
          />

          <div>{{ img.like }}</div>
        </div>

        <!-- 购买按钮 -->
        <div v-if="!isImgAuthor" class="imgWarterfall-imgItem-buy" @click.stop="buyImg()">
          <div
            :style="{
              backgroundImage: 'url(' + require('./img/shoppingCart.svg') + ')'
            }"
          />
        </div>

        <!-- 编辑按钮 -->
        <div
          v-if="isImgAuthor"
          class="imgWarterfall-imgItem-buy"
          @click.stop="editImg()"
        >
          <div
            :style="{
              backgroundImage: 'url(' + require('./img/edit.svg') + ')'
            }"
          />
        </div>

        <!-- 删除按钮 -->
        <div
          v-if="!isShowRemark && (isImgAuthor || isAlbumAuthor)"
          class="imgWarterfall-imgItem-buy"
          @click.stop.prevent="showDeleteImgDialog(img)"
        >
          <div
            :style="{
              backgroundImage: 'url(' + require('./img/delete.svg') + ')'
            }"
          />
        </div>
      </div>
    </transition>

    <!-- 分数 -->
    <transition name="score-fade">
      <div
        v-if="isHover"
        class="imgWarterfall-imgItem-score"
      >
        {{ img.score }}
      </div>
    </transition>

    <!-- 作者信息 -->
    <transition name="score-fade">
      <div
        v-if="$route.name != 'user-home' && isHover"
        class="imgWarterfall-imgItem-userInfo"
        @mouseenter="contentMouseenter"
        @mouseleave="contentMouseLeave"
      >
        <div
          class="imgWarterfall-imgItem-avatar"
          :style="{
            backgroundImage: 'url(' + (!img.avatar ?
              require('~/assets/img/avatar-default.svg') :
              $utilHelper.getCompressionUrl(img.avatar, 200, 200)) + ')'
          }"
          @click.stop="toUserHomePage()"
        />

        <a
          :href="userRef"
          target="_blank"
          @click.stop="noUse"
        >
          {{ img.nickname || '7mx摄影师' }}
        </a>

        <avatar-dialog
          v-if="isHoverUser"
          class="imgWarterfall-imgItem-avatarDialog"
          :user-avator="img.avatar"
          :username="img.nickname"
          :followed-num="img.follow"
          :is-follow="0"
          :user-id="img.userId"
        />
      </div>
    </transition>

    <!-- 审核状态 -->
    <div
      v-if="isShowRemark"
      class="imgWarterfall-imgItem-remark"
      :style="{
        backgroundColor: img.check == '2' ? '#FF5722' : '#FFC107'
      }"
    >
      {{ getRemark(img) }}
    </div>

    <!-- 独家和类别 -->
    <div
      v-if="isShowExclusive && img.check =='1'"
      class="imgWarterfall-imgItem-exclusive"
    >
      {{ (img.is_editorial == '1' ? '商业' : '传媒') + '·' + (img.is_exclusive == '1' ? '独家' : '非独家') }}
    </div>
  </div>
</template>

<script>
import AvatarDialog from '~/components/avatar-dialog/AvatarDialog'

export default {
  components: {
    AvatarDialog
  },
  props: [
    'imgList',
    'index',
    'img',
    'isToPaixin',
    'isShowRemark',
    'isAlbumAuthor',
    'albumId',
    'isShowExclusive'
  ],
  data() {
    return {
      isHover: false,
      isHoverUser: false,
      mouseEnterTime: 0,
      mouseLeaveTime: 0,
      intervalTime: null
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.login.isLogin
    },
    loginUser() {
      return this.$store.state.login.loginUser
    },
    isImgAuthor() {
      try {
        if (!this.isLogin || this.loginUser.id != this.img.user_data.id) {
          return false
        }

        if (this.loginUser.id == this.img.user_data.id) {
          return true
        }
      } catch (e) {
        console.log(e)
        return false
      }
      return false
    },
    imageAlt() {
      try {
        let alt = ''

        alt += this.img.title + ' '

        this.img.category_list.forEach(item => {
          alt += item.name + ' '
        })

        this.img.tag_list.forEach(item => {
          alt += item.name + ' '
        })

        return alt.substring(0, alt.length - 1)
      } catch (e) {
        return ''
      }
    },
    gagaId() {
      let gagaId = ''

      if (typeof this.img.eput_id === 'undefined' || this.img.eput_id == null || this.img.eput_id.length < 1) {
        gagaId = this.img.id
      }

      if (typeof this.img.gaga_id !== 'undefined' && this.img.gaga_id != null && this.img.gaga_id.length > 0) {
        gagaId = this.img.gaga_id
      } else {
        gagaId = this.img.id
      }

      return gagaId
    },
    eputId() {
      let eputId = ''

      if (typeof this.img.gaga_id === 'undefined' || this.img.gaga_id == null || this.img.gaga_id.length < 1) {
        eputId = this.img.id
      }

      if (typeof this.img.eput_id !== 'undefined' && this.img.eput_id != null && this.img.eput_id.length > 0) {
        eputId = this.img.eput_id
      } else {
        eputId = this.img.id
      }

      return eputId
    },
    userRef() {
      return this.$utilHelper.toUserPage(this.img.user_data)
    }
  },

  methods: {
    // 鼠标进入这个item
    contentMouseenter(index) {
      // this.currentHoverUser = index
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
      // this.currentHoverUser = 1000000
    },

    noUse() {
    },

    getImageDetailPage() {
      if (this.isToPaixin) {
        return 'https://v.paixin.com/photoplus/' + this.gagaId
      }

      return '/photo/' + this.eputId
    },
    toUserHomePage() {
      window.open(this.userRef, '_blank')
    },
    async likeImg() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)

        return
      }

      if (this.img.is_like == '1') {
        const res = await this.$axios
          .mediaService
          .dislike({ media_id: this.eputId })

        if (res.data.out == '1') {
          this.img.like_num = res.data.data.like_num

          this.img.is_like = res.data.data.is_like
        }
      } else {
        const res = await this.$axios
          .mediaService
          .like({ media_id: this.eputId })

        if (res.data.out == '1') {
          this.img.like_num = res.data.data.like_num

          this.img.is_like = res.data.data.is_like
        }
      }
    },
    async buyImg() {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)

        return
      }

      if (this.img.product == '1' || this.img.product == 'plus') {
        window.open('https://v.paixin.com/photoplus/' + this.gagaId)

        return
      }

      let neededUserList = []
      const storage = localStorage.getItem('neededUserList')

      if (storage != null) {
        neededUserList = JSON.parse(storage)
      }

      let flag = false
      let index = 0

      neededUserList.forEach((element, i) => {
        if (element.userId == this.loginUser.id) {
          flag = true

          index = i
        }
      })

      if (!flag) {
        this.$store.commit('needed/neededData', {
          isShow: true,
          mediaId: this.eputId
        })
      } else {
        const obj = neededUserList[index]
        const rqBody = {
          media_id: this.eputId,
          name: obj.name,
          phone: obj.phone,
          qq: obj.qq
        }
        const res = await this.$axios.mediaService.needed(rqBody)

        if (res.data.out == '1') {
          this.$toast.notice('已经收到您的购买意向，我们将尽快联系作者')
        } else {
          this.$toast.warn(res.data.msg)
        }
      }
    },
    editImg(img, index) {
      this.$emit('imgWarterfallImgItemEditImg')
    },
    showDeleteImgDialog(img) {
      if (!this.isLogin) {
        this.$store.commit('login/isShowLoginDialog', true)
        return
      }

      // 灵感集的创建者把某张图片从灵感集中删除，必须放在图片的上传者把图片删除之前
      // 因为图片的上传者有可能把自己的图片加入到自己创建的灵感集
      // 所以，一旦判断到是在灵感集中做删除操作，就直接从灵感集中删除，并且不做其他操作
      // 防止误删上传者的图片

      if (this.isAlbumAuthor) {
        // 灵感集的创建者把某张图片从灵感集中删除
        this.$store.commit('confirmationDialog/confirmationDialogData', {
          isShowConfirmationDialog: true,
          confirmationDialogTitle: '是否从灵感集中删除此图？',
          confirmFunction: this.deleteImgFromAlbum,
          confirmFunctionParams: img
        })

        return
      }

      if (this.isImgAuthor) {
        // 图片的上传者把图片删除
        this.$store.commit('confirmationDialog/confirmationDialogData', {
          isShowConfirmationDialog: true,
          confirmationDialogTitle: '是否删除此作品？',
          confirmFunction: this.deleteImg,
          confirmFunctionParams: img
        })
      }
    },
    // 作者删除自己的图片
    async deleteImg(img) {
      if (img.product == '1' || img.check == '1') {
        this.$toast.warn('此图片已经上架，不能删除，如有疑问，请联系客服')

        this.$store.commit('confirmationDialog/confirmationDialogData', {
          isShowConfirmationDialog: false,
          confirmationDialogTitle: '是否确定删除？',
          confirmFunction: null,
          confirmFunctionParams: null
        })

        return
      }

      if (img.check == '3') {
        this.$store.commit('confirmationDialog/confirmationDialogData', {
          isShowConfirmationDialog: false,
          confirmationDialogTitle: '是否确定删除？',
          confirmFunction: null,
          confirmFunctionParams: null
        })

        this.$toast.warn('此图片正在上架审核中，不能删除，如有疑问，请联系客服')

        return
      }

      // 删除图片
      const res = await this.$axios
        .mediaService
        .mediaDrop({ media_id: this.eputId })

      if (res.data.out == '1') {
        this.$store.commit('confirmationDialog/confirmationDialogData', {
          isShowConfirmationDialog: false,
          confirmationDialogTitle: '是否确定删除？',
          confirmFunction: null,
          confirmFunctionParams: null
        })

        this.$toast.notice('删除成功')

        this.imgList.splice(this.index, 1)
      } else {
        this.$toast.warn(res.data.msg)
      }
    },
    // 从灵感集中删除采集的图片
    async deleteImgFromAlbum(img) {
      // 删除图片
      const res = await this.$axios.mediaService.dropFromAlbum({ media_id: this.eputId, album_id: this.albumId })

      if (res.data.out === '1') {
        this.$store.commit('confirmationDialog/confirmationDialogData', {
          isShowConfirmationDialog: false,
          confirmationDialogTitle: '是否确定删除？',
          confirmFunction: null,
          confirmFunctionParams: null
        })

        this.$toast.notice('删除成功')

        this.imgList.splice(this.index, 1)
      } else {
        this.$toast.warn(res.data.msg)
      }
    },
    getRemark(img) {
      if (img.check == '3') {
        return '正在审核'
      }

      if (img.check == '2') {
        try {
          let array = null

          array = JSON.parse(img.remark)

          if (array != null) {
            if (array.length > 0) {
              return '审核未通过，原因：' + array[array.length - 1].remark
            }

            return '审核未通过'
          }

          return '审核未通过'
        } catch (e) {
          return '审核未通过'
        }
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.imgWarterfall-imgItem {
  width: 100%;
  height: 100%;
  background: #ddd;
  background: #f5f5f5;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }

  &:hover .imgWarterfall-imgItem-mask {
    background: rgba(0, 0, 0, .4);
    transition: background .3s;
  }
}

.imgWarterfall-imgItem-mask {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background .3s;

  a {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.buttons-fade-enter-active,
.buttons-fade-leave-active {
  transition: all .4s;
}

.buttons-fade-enter,
.buttons-fade-leave-active {
  transform: translateY(-15px);
  opacity: 0;
}

.imgWarterfall-imgItem-buttons {
  position: absolute;
  z-index: 2;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;

  >div {
    width: 50px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .imgWarterfall-imgItem-like {
    div {
      transform: translateY(10px);
      transition: all .25s cubic-bezier(0, 0, 0, 1.3);
    }

    &:hover div {
      transform: translateY(-14px);
      transition: all .25s cubic-bezier(0, 0, 0, 1.3);
    }

    :nth-child(1) {
      width: 28px;
      height: 28px;
      background-position: center;
      background-size: cover;
      opacity: 1;
    }

    &:hover :nth-child(1) {
      opacity: 0;
    }

    :nth-child(2) {
      margin: 0;
      color: #fff;
      opacity: 0;
    }

    &:hover :nth-child(2) {
      opacity: 1;
    }
  }

  .imgWarterfall-imgItem-buy {
    margin-left: 16px;

    :nth-child(1) {
      width: 26px;
      height: 26px;
      background-position: center;
      background-size: cover;
      transition: all .15s linear;
    }

    :nth-child(1):hover {
      transform: scale(1.1);
      transition: all .15s linear;
    }
  }
}

.score-fade-enter-active,
.score-fade-leave-active {
  transition: all .4s;
}

.score-fade-enter,
.score-fade-leave-active {
  transform: translateY(15px);
  opacity: 0;
}

.imgWarterfall-imgItem-score {
  position: absolute;
  z-index: 2;
  bottom: 8px;
  right: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 28px;
  font-weight: 100;
  letter-spacing: 1px;
}

.imgWarterfall-imgItem-userInfo {
  position: absolute;
  z-index: 2;
  bottom: 16px;
  left: 16px;
  text-shadow: 0 0 36px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;

  .imgWarterfall-imgItem-avatar {
    width: 36px;
    height: 36px;
    background-position: center;
    background-size: cover;
    border-radius: 50%;
  }

  a {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    font-weight: 100;
    margin-left: 16px;
  }

  .imgWarterfall-imgItem-avatarDialog {
    position: absolute;
    top: 34px;
    left: -26px;
    text-shadow: none;
  }
}

.imgWarterfall-imgItem-remark {
  position: absolute;
  bottom: 16px;
  z-index: 2;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, .9);
  padding: 4px 8px;
  opacity: 1;
  word-wrap: break-word;
  word-break: break-all;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.imgWarterfall-imgItem-exclusive {
  position: absolute;
  top: 16px;
  z-index: 2;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, .9);
  padding: 4px 8px;
  opacity: 1;
  word-wrap: break-word;
  word-break: break-all;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #56cb8f;
}
</style>

