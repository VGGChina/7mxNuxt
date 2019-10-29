// initial state
const state = {
  isShowUploadPaixinDialog: false
}

// getters
const getters = {
  isShowUploadPaixinDialog: state => state.isShowUploadPaixinDialog
}

// actions
const actions = {
  isShowUploadPaixinDialog({ commit, state }, isShow) {
    commit('isShowUploadPaixinDialog', isShow)
  }
}

// mutations
const mutations = {
  isShowUploadPaixinDialog(state, isShow) {
    state.isShowUploadPaixinDialog = isShow;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
