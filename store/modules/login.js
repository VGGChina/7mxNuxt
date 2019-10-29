// initial state
const state = {
  isShowLoginDialog: false,
  loginUser: {}
}

// getters
const getters = {
  isShowLoginDialog: state => state.isShowLoginDialog,
  loginUser: state => state.loginUser,
  isLogin: state => {
    if (Object.keys(state.loginUser).length < 1) {
      return false;
    }
    return true;
  }
}

// actions
const actions = {
  isShowLoginDialog({ commit, state }, isShow) {
    commit('isShowLoginDialog', isShow)
  },
  loginUser({ commit, state }, user) {
    commit('loginUser', user)
  }
}

// mutations
const mutations = {
  isShowLoginDialog(state, isShow) {
    state.isShowLoginDialog = isShow;
  },
  loginUser(state, user) {
    state.loginUser = user;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
