const state = () => ({
  isShow: false,
  mediaId: ''
})

const getters = {
  neededIsShow: state => state.isShow,
  neededMediaId: state => state.mediaId
}

const actions = {
  neededData({ commit, state }, data) {
    commit('neededIsShow', data)
  }
}

const mutations = {
  neededData(state, data) {
    state.isShow = data.isShow
    state.mediaId = data.mediaId
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
