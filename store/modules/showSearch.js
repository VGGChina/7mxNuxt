const store = {
  state: {
    isShowSearch: false
  },
  mutations: {
    isShowSearch(state, n) {
      state.isShowSearch = n
    }
  },
  actions: {
    isShowSearch ({commit}, n) {
      commit('isShowSearch', n)
    }
  },
  getters: {
    getShowSearch(state) {
      return state.isShowSearch
    }
  }
}
export default store
