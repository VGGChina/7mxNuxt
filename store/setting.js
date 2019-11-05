const state = () => ({
  isShowSettingDialog: false
})

const getters = {
  isShowSettingDialog: state => state.isShowSettingDialog
}

const actions = {
  isShowSettingDialog({ commit, state }, isShow) {
    commit('isShowSettingDialog', isShow)
  }
}

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
