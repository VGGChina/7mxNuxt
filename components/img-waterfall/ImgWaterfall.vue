<template>
<div>
  <transition name='mask-fade'>
    <div class='dialog-mask' v-if='isShowEditDialog' @click='cancelDialog'></div>
  </transition>

  <transition name='dialog-fade'>
    <edit-dialog v-if='isShowEditDialog'
      :imgDetail='currnetEditImg'
      @modifyMediaSuccess='onModifySuc'>
    </edit-dialog>
  </transition>

  <div class='img-waterfall'>
    <waterfall
      v-if='imgList.length > 0'
      line='v'
      :line-gap='columnWidth'
      :watch='imgList'
      align='center'
      auto-resize='true'>
      <waterfall-slot
        v-for='(img, index) in imgList' 
        :width='img.image_width || "600"' 
        :height='img.image_height || "600"'
        :order='index'
        :key='img.id'
        move-class='item-move'>
        <img-item :imgList='imgList'
          :img='img'
          :index='index'
          :isToPaixin='isToPaixin'
          :isShowRemark='isShowRemark'
          :isAlbumAuthor='isAlbumAuthor'
          :albumId='albumId'
          :isShowExclusive='isShowExclusive'
          @imgWarterfallImgItemEditImg='editImg(img)'>
        </img-item>

      </waterfall-slot>
    </waterfall>

    <loading :isLoading='isLoading' :loadingColor='"#000"' v-if='isShowLoading'></loading>

    <div class='no-more' v-if='isShowNoMore && isNoMore'>—  <span>7MX</span>  —</div>

    <no-content :content='content'
      :isNoContentShow='!isLoading && isShowNoContent'>
    </no-content>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditDialog from './edit-dialog/EditDialog'
import ImgItem from './img-item/ImgItem'
import NoContent from '~/components/no-content/NoContent';
import Waterfall from './vue-waterfall/waterfall'
import WaterfallSlot from './vue-waterfall/waterfall-slot'

export default {
  name: '',
  data: () => ({
    columnWidth: 0,
    bodyWidth: 0,
    timer: false,
    singleTimer: null,
    isShowEditDialog: false,
    currnetEditImg: null
  }),
  props: {
    imgList: {
      type: Array,
      default: []
    },
    isLarge: {
      type: Boolean,
      default: false
    },
    line: {
      type: String,
      default: ''
    },
    isToPaixin: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isShowLoading: {
      type: Boolean,
      default: true
    },
    isShowNoMore: {
      type: Boolean,
      default: true
    },
    isShowRemark: {
      type: Boolean,
      default: false
    },
    isAlbumAuthor: {
      type: Boolean,
      default: false
    },
    albumId: {
      type: String,
      default: ''
    },
    isShowExclusive: {
      type: Boolean,
      default: false
    },
    ifIndex: {
      type: String,
      default: '0'
    }
  },
  methods: {
    cancelDialog() {
      this.isShowEditDialog = false
    },
    editImg(img) {
      this.isShowEditDialog = true

      this.currnetEditImg = img
    },
    onModifySuc(data) {
      this.isShowEditDialog = false

      this.currnetEditImg = null
    },
    setColumnWidth() {
      if (this.isLarge) {
        this.columnWidth = this.bodyWidth * 0.7;
        if (this.columnWidth > 1600) {
          this.columnWidth = 1600;
        }
      } else {
        if (this.bodyWidth <= 1200) {
          this.columnWidth = Math.floor((1200 - 20) / 3);
        } else if (this.bodyWidth > 1200 && this.bodyWidth <= 1500) {
          this.columnWidth = Math.floor((this.bodyWidth - 20) / 3);
        } else if (this.bodyWidth > 1500) {
          this.columnWidth = Math.floor((this.bodyWidth - 20) / 4)
        }
      }
      if (this.ifIndex == '1') {
        this.columnWidth = 328
      }
    },
    noUser() {
      // no use
    }
  },
  mounted() {
    this.bodyWidth = document.body.clientWidth

    this.setColumnWidth()
  },
  watch: {
    'onresizeFlag': function (val) {
      this.bodyWidth = document.body.clientWidth;
      if (!this.timer) {
        this.timer = true;
        setTimeout(() => {
          this.setColumnWidth();
          this.timer = false;
        }, 300);
      }
    },
    'isLarge': function() {
      this.setColumnWidth();
    },
    'isShowEditDialog': function (val) {
      if (val) {
        document.querySelector('html').style.overflow = 'hidden'
      } else {
        document.querySelector('html').style.overflow = 'auto'
      }
    }
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'loginUser',
      'onresizeFlag'
    ]),
    isNoMore() {
      if (this.isLoading) {
        return false
      }
      if (this.imgList.length > 0 && this.line == 'end') {
        return true
      }
      if (this.imgList.length == 0 && this.line == 'end') {
        return false
      }
      return false
    },
    isShowNoContent() {
      if (this.imgList.length < 1 && this.line == 'end') {
        return true;
      } else {
        return false;
      }
    },
    content() {
      if (this.$route.name == 'user-id' || this.$route.name == 'user-home') {
        return '这个人很懒，什么也没留下 ~'
      }

      return 'Sorry，暂无内容，您可以尝试刷新页面'
    }
  },
  components: {
    Waterfall,
    WaterfallSlot,
    NoContent,
    ImgItem,
    EditDialog
  }
};
</script>

<style lang='scss' scoped>
.item-move {
  transition: all .5s cubic-bezier(.55,0,.1,1);
}

.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all .4s;
}

.dialog-fade-enter,
.dialog-fade-leave-active {
  transform: translateY(-40px);
  opacity: 0;
}

.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: all .4s;
}

.mask-fade-enter,
.mask-fade-leave-active {
  opacity: 0;
}

.img-waterfall {
  box-sizing: border-box;
  width: 100% !important;
  background: #fff;
  transform: rotate(0);
  padding-top: 20px;
}

.no-more {
  height: 223px;
  text-align: center;
  line-height: 223px;
  font-size: 1.2rem;
  letter-spacing: 2px;
  opacity: .15;
  user-select: none;
  span {
    font-weight: 800;
  }
}
</style>
