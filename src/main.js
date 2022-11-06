// 根实例
import Vue from 'vue'
import router from './router'
import App from "./App";
import general_script from './js/general_script_v1.1'
import store from './store'
import '@/icons'//icon
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
    },
    /**
     根据经纬度计算距离，参数分别为第一点的经度，纬度；第二点的经度，纬度
     返回值的单位是km
    **/
    getDistances(x1, y1, x2, y2) {
      const R=6371;//地球平均半径(km)
      const {sin,cos,asin,PI,hypot} = Math;
      let getPt=(x,y)=>{
        x*=PI/180;
        y*=PI/180;
        return {x:cos(x)*cos(y),y:sin(x)*cos(y),z:sin(y)}
      }
      let p1=getPt(x1,y1);
      let p2=getPt(x2,y2);
      let a=hypot(p1.x-p2.x,p1.y-p2.y,p1.z-p2.z);
      return asin(a/2)*2*R;
    }
  },
  created(){

  }
})
