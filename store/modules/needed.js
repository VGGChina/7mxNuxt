// initial state
const state = {
  isShow: false,
  mediaId: ''
}

// getters
const getters = {
  neededIsShow: state => state.isShow,
  neededMediaId: state => state.mediaId
}

// actions
const actions = {
  neededData({ commit, state }, data) {
    commit('neededIsShow', data)
  }
}

// mutations
const mutations = {
  neededData(state, data) {
    state.isShow = data.isShow;
    state.mediaId = data.mediaId
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
