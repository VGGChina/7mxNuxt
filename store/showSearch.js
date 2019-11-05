export const state = () => ({
  isShowSearch: false
})
export const mutations = {
  isShowSearch(state, n) {
    state.isShowSearch = n
  }
}
export const actions = {
  isShowSearch({ commit }, n) {
    commit('isShowSearch', n)
  }
}
export const getters = {
  getShowSearch(state) {
    return state.isShowSearch
  }
}

