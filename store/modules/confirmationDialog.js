// initial state
const state = {
  confirmationDialogData: {
    isShowConfirmationDialog: false,
    confirmationDialogTitle: '是否确定删除？',
    confirmFunction: null,
    confirmFunctionParams: null
  }
}

// getters
const getters = {
  isShowConfirmationDialog: state => state.confirmationDialogData.isShowConfirmationDialog,
  confirmationDialogTitle: state => state.confirmationDialogData.confirmationDialogTitle,
  confirmFunction: state => state.confirmationDialogData.confirmFunction,
  confirmFunctionParams: state => state.confirmationDialogData.confirmFunctionParams
}

// actions
const actions = {
  confirmationDialogData({ commit, state }, data) {
    commit('confirmationDialogData', data)
  }
}

// mutations
const mutations = {
  confirmationDialogData(state, data) {
    state.confirmationDialogData = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
