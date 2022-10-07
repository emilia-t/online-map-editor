import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //提供唯一的公共数据源，所有共享的数据统一放到store的state进行储存数据，相当于data
  state: {
    name:"lin_ran"
  },
  getters: {

  },
  //里面定义方法，操作state方发
  mutations: {

  },
  // 操作异步操作mutation
  actions: {

  },
  modules: {

  },
})
