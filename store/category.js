const state = () => ({
  categoryList: [],
  crrentType: {}
})

const getters = {
  categoryList: state => state.categoryList,
  categoryListAll: state => {
    const list = JSON.parse(JSON.stringify(state.categoryList))
    list.splice(0, 0, {
      id: '0',
      language: 'zh_cn',
      name: '全部'
    })
    return list
  }
}

const actions = {
  categoryList({ commit, state }, list) {
    commit('categoryList', list)
  }
}

const mutations = {
  categoryList(state, list) {
    state.categoryList = list
  },
  setCrrentType(state, crrentType) {
    state.crrentType = crrentType
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
