const state = () => ({
  isShowLoginDialog: false,
  loginUser: {
    id: ''
  }
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
  isShowLoginDialog({ commit, state }, isShow) {
    commit('isShowLoginDialog', isShow)
  },
  loginUser({ commit, state }, user) {
    commit('loginUser', user)
  }
}

const mutations = {
  isShowLoginDialog(state, isShow) {
    state.isShowLoginDialog = isShow
  },
  loginUser(state, user) {
    state.loginUser = user
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
