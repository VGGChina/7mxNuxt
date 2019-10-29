<template>
  <div
    class="img-pre-container"
    @click.stop="selected"
    @mouseenter="isShowMask = true"
    @mouseleave="isShowMask = false"
  >
    <transition name="cover-fade">
      <div class="img-pre-cover" v-show="file.status != 5 || isShowMask">
        <!-- 
          file.status的含义：
          源码地址（第124至142行）：https://github.com/moxiecode/plupload/blob/master/src/plupload.js
        -->
        <div
          class="error-info"
          v-if="file.status == 4 || file.putStatus == -1"
        >{{ file.status == 4 ? '上传失败' : file.putStatus == -1 ? '发布失败' : '' }}</div>
      </div>
    </transition>

    <div
      class="img-pre"
      :style="{
        backgroundImage: 'url(' + file.src + ')',
        borderColor: file.isSelected ? '#56cb8f' : '#fff'
      }"
    >
      <div class="delete" v-if="file.status == 4 || isShowMask" @click.stop="remove"></div>
    </div>

    <!-- <div class="progress" v-if="file.status == 2 || file.imagePutStatus == 2"> -->
    <div class="progress" v-if="file.status == 2">
      <div class="progress-all">
        <div class="progress-current" :style="progressStyle"></div>
      </div>
      <div class="cancel-upload" @click.stop="remove"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isShowMask: false
  }),
  props: [
    'index',
    'file',
    'uploader'
  ],
  methods: {
    selected() {
      this.uploader.files.forEach(e => {
        if (e.id != this.file.id && e.isSelected) {
          e.isSelected = false
        }
      })

      this.file.isSelected = true

      this.$emit('uploadImgPreSelected', '')
    },
    remove() {
      this.uploader.removeFile(this.file)

      if (this.uploader.files.length <= 0) {
        this.$emit('uploadImgPreEmpty', '')
      }
    }
  },
  computed: {
    progressStyle() {
      return {
        // width: (this.file.loaded + this.file.imageLoaded) / (this.file.size + this.file.imageSize) * 120 + 'px'
        width: this.file.percent / 100 * 120 + 'px'
      }
    },
    imgProStyle() {
      return {
        'background-image': 'url(' + this.file.src + ')'
      }
    }
  }
}
</script>

<style scoped>
.img-pre-container {
  height: 186px;
  margin: 10px 6px 0px 10px;
  cursor: pointer;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all 0.3s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.img-pre-cover {
  width: 150px;
  height: 150px;
  position: absolute;
  margin: 6px 6px 0px 6px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.error-info {
  position: absolute;
  top: 50%;
  margin-top: -11px;
  left: 50%;
  margin-left: -32px;
  color: #fff;
}

.img-pre {
  width: 150px;
  height: 150px;
  border: solid 6px #fff;
  background-size: cover;
  background-position: center;
  position: relative;
}

.delete {
  width: 12px;
  height: 12px;
  background-image: url("./img/delete-white.svg");
  background-size: contain;
  -moz-background-size: contain;
  cursor: pointer;
  margin-left: 14px;
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 10;
}

.progress {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
  margin-top: 8px;
}

.progress-all {
  width: 120px;
  height: 9px;
  border-radius: 3px;
  background-color: #d8d8d8;
  overflow: hidden;
}

.progress-current {
  height: 9px;
  border-radius: 3px;
  background-color: #f7f7f7;
}

.cancel-upload {
  width: 12px;
  height: 12px;
  background-image: url("./img/delete.svg");
  background-size: contain;
  -moz-background-size: contain;
  cursor: pointer;
  margin-left: 14px;
}
</style>

