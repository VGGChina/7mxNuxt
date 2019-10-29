import Vue from 'vue'
import Vuex from 'vuex'
import category from './modules/category'
import login from './modules/login'
import register from './modules/register'
import setting from './modules/setting'
import upload from './modules/upload'
import uploadPaixin from './modules/uploadPaixin'
import withdraw from './modules/withdraw'
import improveInfo from './modules/improveInfo'
import window from './modules/window'
import help from './modules/help'
import needed from './modules/needed'
import confirmationDialog from './modules/confirmationDialog'
import showSearch from './modules/showSearch'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    category,
    login,
    register,
    setting,
    upload,
    withdraw,
    uploadPaixin,
    improveInfo,
    window,
    help,
    needed,
    confirmationDialog,
    showSearch
  }
})

export default store
