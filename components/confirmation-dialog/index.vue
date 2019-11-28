<template>
  <div class="confirmation-container">
    <transition name="cover-fade">
      <div v-if="isShowConfirmationDialog" class="confirmation-cover" @click="cancel" />
    </transition>

    <transition name="confirmation-fade">
      <div v-if="isShowConfirmationDialog" class="confirmation">
        <div class="confirmation-title">{{ confirmationDialogTitle }}</div>

        <div>
          <button
            class="button-green"
            @click="commit()"
          >
            确定
          </button>

          <button
            class="button-grey cancel"
            @click="cancel()"
          >
            取消
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  computed: {
    isShowConfirmationDialog() {
      return this.$store.state.confirmationDialog.confirmationDialogData.isShowConfirmationDialog
    },
    confirmationDialogTitle() {
      return this.$store.state.confirmationDialog.confirmationDialogData.confirmationDialogTitle
    },
    confirmFunction() {
      return this.$store.state.confirmationDialog.confirmationDialogData.confirmFunction
    },
    confirmFunctionParams() {
      return this.$store.state.confirmationDialog.confirmationDialogData.confirmFunctionParams
    }
  },
  methods: {
    cancel() {
      this.$store.commit('confirmationDialog/confirmationDialogData', {
        isShowConfirmationDialog: false,
        confirmationDialogTitle: '是否确定删除？',
        confirmFunction: null,
        confirmFunctionParams: null
      })
    },
    commit() {
      if (typeof this.confirmFunction === 'function') {
        this.confirmFunction(this.confirmFunctionParams)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.confirmation-container {
  position: fixed;
  z-index: 20;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all .3s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.confirmation-cover {
  position: fixed;
  z-index: 30;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.confirmation-fade-enter-active,
.confirmation-fade-leave-active {
  transition: all .3s;
}

.confirmation-fade-enter,
.confirmation-fade-leave-active {
  opacity: 0;
  transform: translateY(-20px);
}

.confirmation {
  box-sizing: border-box;
  position: fixed;
  z-index: 40;
  left: 50%;
  margin-left: -178px;
  top: 50%;
  margin-top: -88px;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px;

  .confirmation-title {
    font-size: 1.2rem;
  }

  button {
    cursor: pointer;
    font-size: 0.9rem;
    width: 120px;
    height: 40px;
    line-height: 40px;
    margin: 30px 8px 0 8px;
    outline: none;
    border: none;
  }

  .cancel {
    &:hover {
      background-color: rgba(0,0,0,0.25);
    }
  }
}
</style>
