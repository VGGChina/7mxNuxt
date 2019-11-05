const state = () => ({
  isShowUploadPaixinDialog: false
})

const getters = {
  isShowUploadPaixinDialog: state => state.isShowUploadPaixinDialog
}

const actions = {
  isShowUploadPaixinDialog({ commit, state }, isShow) {
    commit('isShowUploadPaixinDialog', isShow)
  }
}

const mutations = {
  isShowUploadPaixinDialog(state, isShow) {
    state.isShowUploadPaixinDialog = isShow
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
