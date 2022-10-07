// 根实例
import Vue from 'vue'
import router from './router'
import App from "./App";
import general_script from './js/general_script_v1.1'
import store from './store'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data(){
    return{
      //常用函数
      general_script,
      //测试用数据
      test:0
    }
  },
  router,
  store,
  components: { App },
  template: '<app></app>',
  methods:{

  },
  created() {

  },
  watch:{

  }
})
