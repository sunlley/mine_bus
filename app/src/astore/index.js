import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import state from './state'

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
});
export default store;
