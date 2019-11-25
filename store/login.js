const state = () => ({
  isShowLoginDialog: false,
  loginUser: { },
  xToken: '',
  isLogin: false
})

const getters = {
  isShowLoginDialog: state => state.isShowLoginDialog,
  loginUser: state => state.loginUser,
  isLogin: state => {
    if (Object.keys(state.loginUser).length < 1) {
      return false
    }
    return true
  }
}

const actions = {
  isShowLoginDialog({ commit }, isShow) {
    commit('login/isShowLoginDialog', isShow)
  },
  loginUser({ commit }, user) {
    commit('login/loginUser', user)
  },
  setXtoken({ commit }, xtotken) {
    commit('login/setXtoken', xtotken)
  }

}

const mutations = {
  isShowLoginDialog(state, isShow) {
    state.isShowLoginDialog = isShow
  },
  loginUser(state, user) {
    state.loginUser = user
  },
  setXtoken(state, xtoken) {
    // console.log('新commit的token', xtoken)
    state.xToken = xtoken
    this.$cookies.set('token', xtoken, { maxAge: 1000000 })
  },
  isLogin(state, isLogin) {
    state.isLogin = isLogin
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
