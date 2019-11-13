const state = () => ({
  line: '1,0,0'
})

const mutations = {
  setLine(state, line) {
    state.line = line
  }
}

export default {
  state,
  mutations
}

