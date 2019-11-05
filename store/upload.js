const state = () => ({
  isShowUploadDialog: false,
  uploadActivity: {}
})

const getters = {
  isShowUploadDialog: state => state.isShowUploadDialog,
  uploadActivity: state => state.uploadActivity
}

const actions = {
  isShowUploadDialog({ commit, state }, isShow) {
    commit('isShowUploadDialog', isShow)
  },
  uploadActivity({ commit, state }, activity) {
    commit('uploadActivity', activity)
  }
}

const mutations = {
  isShowUploadDialog(state, isShow) {
    state.isShowUploadDialog = isShow
  },
  uploadActivity(state, activity) {
    state.uploadActivity = activity
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
