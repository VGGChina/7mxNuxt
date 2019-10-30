// initial state
const state = {
  isShowSettingDialog: false
}

// getters
const getters = {
  isShowSettingDialog: state => state.isShowSettingDialog
}

// actions
const actions = {
  isShowSettingDialog({ commit, state }, isShow) {
    commit('isShowSettingDialog', isShow)
  }
}

// mutations
const mutations = {
  isShowSettingDialog(state, isShow) {
    state.isShowSettingDialog = isShow
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
