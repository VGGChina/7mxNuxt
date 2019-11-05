const state = () => ({
  isShowImproveInfo: false
})

const getters = {
  isShowImproveInfo: state => state.isShowImproveInfo
}

const actions = {
  isShowImproveInfo({ commit, state }, isShow) {
    commit('isShowImproveInfo', isShow)
  }
}

const mutations = {
  isShowImproveInfo(state, isShow) {
    state.isShowImproveInfo = isShow
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
