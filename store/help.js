import queryString from 'query-string'

const state = () => ({
  show: false,
  current: { index: 0, subIndex: -1 }
})

const actions = {
  helpShow({ commit, state }, info) {
    commit('help/help_show', info)
  }
}

const mutations = {
  help_show(state, info = {}) {
    const query = queryString.parse(location.search)
    let pushData = ''
    for (const i in query) {
      if (i === 'help') continue
      pushData += `&${i}=${query[i]}`
    }
    if (info.show === false) {
      state.show = false
      history.pushState({}, '', `?help=back${pushData}`)
      return
    }
    if (!info.current) {
      state.show = true
      state.current = { index: 0, subIndex: -1 }
      history.pushState({}, '', `?help=0~-1${pushData}`)
      return
    }
    state.show = true
    state.current.index = info.current.index || 0
    state.current.subIndex = info.current.subIndex === 0 ? 0 : info.current.subIndex || -1
    history.pushState({}, '', `?help=${state.current.index}~${state.current.subIndex}${pushData}`)
  }
}

export default {
  state,
  actions,
  mutations
}
