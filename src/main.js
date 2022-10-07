// 根实例
import Vue from 'vue'
import router from './router'
import App from "./App";
import general_script from './js/general_script_v1.1'
import store from './store'
//允许生产环境输入错误信息
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el:'#app',
  data(){return{
    general_script
  }},
  router,
  store,
  components:{App},
  template:'<app></app>',
  methods:{},
  created(){

  },
  watch:{

  }
})
