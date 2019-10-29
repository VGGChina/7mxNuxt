// initial state
const state = {
  winPageYOffset: 0,
  topBarOpacity: 0,
  onresizeFlag: 0
}

// getters
const getters = {
  winPageYOffset: state => state.winPageYOffset,
  topBarOpacity: state => state.topBarOpacity,
  onresizeFlag: state => state.onresizeFlag
}

// actions
const actions = {
  winPageYOffset({ commit, state }, y) {
    commit('winPageYOffset', y)
  },
  topBarOpacity({ commit, state }, opacity) {
    commit('topBarOpacity', opacity)
  },
  onresizeFlag({ commit, state }, date) {
    commit('onresizeFlag', date)
  }
}

// mutations
const mutations = {
  winPageYOffset(state, y) {
    state.winPageYOffset = y;
  },
  topBarOpacity(state, opacity) {
    state.topBarOpacity = opacity;
  },
  onresizeFlag(state, date) {
    state.onresizeFlag = date;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
