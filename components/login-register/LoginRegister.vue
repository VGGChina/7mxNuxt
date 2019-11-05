<template>
  <div>
    <transition name="cover-fade">
      <div
        class="login-cover"
        @click="cancelDialog"
        v-if="isShowLoginDialog || isShowRegisterDialog">
      </div>
    </transition>

    <transition name="login-fade">
      <login v-if="isShowLoginDialog"></login>
    </transition>

    <transition name="login-fade">
      <register v-if="isShowRegisterDialog"></register>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Login from './Login'
import Register from './Register'

export default {
  data: () => ({
  }),
  methods: {
    cancelDialog() {
      this.$store.commit('login/isShowLoginDialog', false)
      this.$store.commit('isShowRegisterDialog', false)
    }
  },
  computed: {
    ...mapGetters([
      'isShowLoginDialog',
      'isShowRegister',
      'isShowRegisterDialog'
    ])
  },
  components: {
    Login,
    Register
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
