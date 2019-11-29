const state = () => ({
  confirmationDialogData: {
    isShowConfirmationDialog: false,
    confirmationDialogTitle: '是否确定删除？',
    confirmFunction: null,
    confirmFunctionParams: null
  }
})

const actions = {
  confirmationDialogData({ commit, state }, data) {
    commit('confirmationDialogData', data)
  }
}

const mutations = {
  confirmationDialogData(state, data) {
    state.confirmationDialogData = data
  }
}

export default {
  state,
  actions,
  mutations
}
