const state = () => ({
  isShowWithdrawDialog: false,
  gains: '', // 总收益
  enchashment: '' // 可提现金额
})

const getters = {
  isShowWithdrawDialog: state => state.isShowWithdrawDialog,
  gains: state => state.gains,
  enchashment: state => state.enchashment
}

const actions = {
  isShowWithdrawDialog({ commit, state }, isShow) {
    commit('isShowWithdrawDialog', isShow)
  },
  gains({ commit, state }, g) {
    commit('gains', g)
  },
  enchashment({ commit, state }, e) {
    commit('enchashment', e)
  }
}

const mutations = {
  isShowWithdrawDialog(state, isShow) {
    state.isShowWithdrawDialog = isShow
  },
  gains(state, g) {
    state.gains = g
  },
  enchashment(state, e) {
    state.enchashment = e
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
