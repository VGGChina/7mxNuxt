<template>
  <div class="upload-paixin">
    <transition name="cover-fade">
      <div
        v-if="isShowUploadPaixinDialog"
        class="upload-cover"
        @click="cancleDialog"
      >
        <div class="cancle-button" />
      </div>
    </transition>

    <transition name="upload-fade">
      <div v-if="isShowUploadPaixinDialog" class="upload-container">
        <choose-works v-if="!isChoosed" @nextStep="handle" />
        <edit-works v-if="isChoosed" :choosed-list="choosedList" @nextStep="handle" />
      </div>
    </transition>
  </div>
</template>

<script>
import ChooseWorks from './ChooseWorks'
import EditWorks from './EditWorks'

export default {
  components: {
    ChooseWorks,
    EditWorks
  },
  data() {
    return {
      isChoosed: false,
      choosedList: []
    }
  },
  computed: {
    isShowUploadPaixinDialog() {
      return this.$store.state.uploadPaixin.isShowUploadPaixinDialog
    }
  },
  methods: {
    handle(data) {
      this.isChoosed = data.isChoosed
      this.choosedList = data.choosedList
    },
    cancleDialog() {
      this.$store.commit('uploadPaixin/isShowUploadPaixinDialog', false)
      this.isChoosed = false
    }
  }
}
</script>

<style scoped>
.upload-paixin {
  width: 100%;
  height: 100%;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all .6s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.upload-cover {
  position: fixed;
  z-index: 20;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.cancle-button {
  width: 15px;
  height: 15px;
  object-fit: contain;
  background-image: url('./img/cancle.svg');
  position: absolute;
  right: 4px;
  top: 4px;
  cursor: pointer;
}

.upload-fade-enter-active,
.upload-fade-leave-active {
  transition: all .6s;
}

.upload-fade-enter,
.upload-fade-leave-active {
  transform: translateY(-40px);
  opacity: 0;
}

.upload-container {
  background: #fff;
  width: calc(100% - 36px);
  width: -moz-calc(100% - 36px);
  width: -webkit-calc(100% - 36px);
  height: calc(100% - 40px);
  height: -moz-calc(100% - 40px);
  height: -webkit-calc(100% - 40px);
  margin: 20px 18px;
  border-radius: 3px;
  position: fixed;
  z-index: 30;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
}
</style>

