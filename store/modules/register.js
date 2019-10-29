// initial state
const state = {
  isShowRegisterDialog: false
}

// getters
const getters = {
  isShowRegisterDialog: state => state.isShowRegisterDialog
}

// actions
const actions = {
  isShowRegisterDialog({ commit, state }, isShow) {
    commit('isShowRegisterDialog', isShow)
  }
}

// mutations
const mutations = {
  isShowRegisterDialog(state, isShow) {
    state.isShowRegisterDialog = isShow;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
