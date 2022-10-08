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
  methods:{
    /**
    请在下方三个函数内注册您的命令
     基本格式为：
     case '口令名':{
        //应该执行什么事情
        //或者应该修改某一state的状态
     }
    **/
    //发送一条带有数据的命令
    sendDataInstruct(name,price){
      switch (name) {
        case 'anonymousInstruct':{
          this.$store.state.anonymousInstruct.name=name;
          this.$store.state.anonymousInstruct.data=price;
          break;
        }
      }
    },
    //发送一个带有切换true和false状态的命令
    sendSwitchInstruct(name){
      switch (name) {
        case '':{
          break;
        }
      }
    },
    //发送一条立刻执行函数的命令
    sendInstruct(name){
      switch (name){
        case 'createTestLine':{
          let ran=Math.floor(Math.random()*100000000);
          this.$store.state.commits.createTestLine=ran;
          break;
        }
        default:{
          break;
        }
      }
    }
  },
  created(){

  }
})
