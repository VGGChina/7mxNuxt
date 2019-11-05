const state = () => ({
  isShowRegisterDialog: false
})

const getters = {
  isShowRegisterDialog: state => state.isShowRegisterDialog
}

const actions = {
  isShowRegisterDialog({ commit, state }, isShow) {
    commit('isShowRegisterDialog', isShow)
  }
}

const mutations = {
  isShowRegisterDialog(state, isShow) {
    state.isShowRegisterDialog = isShow
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
