<template>
  <div>
    <transition name="cover-fade">
      <div
        v-if="isShowLoginDialog || isShowRegisterDialog"
        class="login-cover"
        @click="cancelDialog"
      />
    </transition>

    <transition name="login-fade">
      <login v-if="isShowLoginDialog" />
    </transition>

    <transition name="login-fade">
      <register v-if="isShowRegisterDialog" />
    </transition>
  </div>
</template>

<script>
import Login from './Login'
import Register from './Register'

export default {
  components: {
    Login,
    Register
  },
  data: () => ({
  }),
  computed: {
    isShowLoginDialog() {
      return this.$store.state.login.isShowLoginDialog
    },
    isShowRegister() {
      return this.$store.state.login.isShowRegister
    },
    isShowRegisterDialog() {
      return this.$store.state.login.isShowRegisterDialog
    }
  },
  methods: {
    cancelDialog() {
      this.$store.commit('login/isShowLoginDialog', false)
      this.$store.commit('isShowRegisterDialog', false)
    }
  }
}
</script>

<style scoped>
.login-fade-enter-active,
.login-fade-leave-active {
  transition: all .4s;
}

.login-fade-enter,
.login-fade-leave-active {
  transform: translateY(-40px);
  opacity: 0;
}

.cover-fade-enter-active,
.cover-fade-leave-active {
  transition: all .4s;
}

.cover-fade-enter,
.cover-fade-leave-active {
  opacity: 0;
}

.login-cover {
  position: fixed;
  top: 0px;
  z-index: 20;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
</style>
