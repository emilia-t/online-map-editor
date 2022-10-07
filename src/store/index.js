import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
//vuex3.0基本操作https://blog.csdn.net/qq_56989560/article/details/124706021
export default new Vuex.Store({
  //提供唯一的公共数据源，所有共享的数据统一放到store的state进行储存数据，相当于data
  state: {
    mapConfig:{
      browser:{
        width:null,
        height:null,
      }
    },
    mapData:{

    },
    userConfig:{

    }
  },
  //类似于vue中的computed，进行缓存，对于Store中的数据进行加工处理形成新的数据
  getters: {

  },
  //里面定义方法，操作state方发
  //Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。
  mutations: {

  },
  // 操作异步操作mutation
  actions: {

  }
})
