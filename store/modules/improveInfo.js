// initial state
const state = {
  isShowImproveInfo: false
}

// getters
const getters = {
  isShowImproveInfo: state => state.isShowImproveInfo
}

// actions
const actions = {
  isShowImproveInfo({ commit, state }, isShow) {
    commit('isShowImproveInfo', isShow)
  }
}

// mutations
const mutations = {
  isShowImproveInfo(state, isShow) {
    state.isShowImproveInfo = isShow;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
