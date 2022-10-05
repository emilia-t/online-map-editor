// 根实例
// 第1层：10px = 1m 可得总共20,0000px  X  20,0000px
// 第2层：5px = 1m 可得总共10,0000px  X  10,0000px
// 第3层：2.5px = 1m 可得总共5,0000px  X  5,0000px
// 第4层：1px = 1m 可得总共2,0000px  X  2,0000px
// 第5层：0.5px = 1m 可得总共1,0000px  X 1,0000px
// 第6层：0.2px = 1m  可得总共4000px  X  4000px
// 第7层：0.1px = 1m 可得总共2000px  X  2000px
import Vue from 'vue'
import router from './router'
import App from "./App";
import general_script from './js/general_script_v1.1'

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
  components: { App },
  template: '<app></app>',
  methods:{

  },
  created() {

  },
  watch:{

  }
})
