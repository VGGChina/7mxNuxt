// initial state
const state = {
  categoryList: []
}

// getters
const getters = {
  categoryList: state => state.categoryList,
  categoryListAll: state => {
    let list = JSON.parse(JSON.stringify(state.categoryList));
    list.splice(0, 0, {
      id: '0',
      language: 'zh_cn',
      name: '全部'
    });
    return list;
  }
}

// actions
const actions = {
  categoryList({ commit, state }, list) {
    commit('categoryList', list)
  }
}

// mutations
const mutations = {
  categoryList(state, list) {
    state.categoryList = list;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
