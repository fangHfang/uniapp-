import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	modules,
	getters,
	mutations
})
