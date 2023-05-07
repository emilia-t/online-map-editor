// 根实例
import Vue from 'vue';
import router from './router';
import App from "./App";
import general_script from './js/general_script_v1.1';
import CONFIG from './js/config';
import store from './store';
import '@/icons';
import {JSEncrypt} from "jsencrypt";
//允许生产环境输入错误信息
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el:'#app',
  data(){return{
    CONFIG,
    general_script,
    commitsConfig:{
      disabledList:['createTestLine'],
      anonymousInstruct:{pass:0,intercept:0},
      createTestLine:{pass:0,intercept:0},
      openF4DebugBord:{pass:0,intercept:0},
      openDetailsPanel:{pass:0,intercept:0},
      reloadAccounts:{pass:0,intercept:0},
      reloadServers:{pass:0,intercept:0},
      addNewPointEnd:{pass:0,intercept:0},
      previewLine:{pass:0,intercept:0},
      addNewLineEnd:{pass:0,intercept:0},
      disableZoomAndMove:{pass:0,intercept:0},
    }
  }},
  router,
  store,
  components:{App},
  template:'<app></app>',
  methods:{
    filter(name){
      let list=this.commitsConfig.disabledList;
      let lock=true;
      for (let i=0;i<list.length;i++){
        if (name.match(list[i])!==null){
          lock=false
        }
      }
      return lock
    },
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
          if(this.filter(name)){
            this.$store.state.anonymousInstruct.name=name;
            this.$store.state.anonymousInstruct.data=price;
            this.commitsConfig.anonymousInstruct.pass++;
          }else {
            this.commitsConfig.anonymousInstruct.intercept++;
          }
          break;
        }
      }
    },
    //发送一个带有单一状态的命令
    sendSwitchInstruct(name,status){
      switch (name) {
        //用于显示或关闭预览线段
        case 'previewLine':{
          if(this.filter(name)){
            this.$store.state.commits.previewLine=status;
            this.commitsConfig.addNewPointEnd.pass++;
          }else {
            this.commitsConfig.addNewPointEnd.intercept++;
          }
          break;
        }
        case 'disableZoomAndMove':{
          if(this.filter(name)){
            this.$store.state.commits.disableZoomAndMove=status;
            this.commitsConfig.disableZoomAndMove.pass++;
          }else {
            this.commitsConfig.disableZoomAndMove.intercept++;
          }
          break;
        }
      }
    },
    //命令状态更新
    sendInstruct(name){
      switch (name){
        case 'addNewLineEnd':{
          if(this.filter(name)){
            this.$store.state.commits.addNewLineEnd=!this.$store.state.commits.addNewLineEnd;
            this.commitsConfig.addNewLineEnd.pass++;
          }else {
            this.commitsConfig.addNewLineEnd.intercept++;
          }
          break;
        }
        case 'addNewPointEnd':{
          if(this.filter(name)){
            this.$store.state.commits.addNewPointEnd=!this.$store.state.commits.addNewPointEnd;
            this.commitsConfig.addNewPointEnd.pass++;
          }else {
            this.commitsConfig.addNewPointEnd.intercept++;
          }
          break;
        }
        case 'reloadServers':{
          if(this.filter(name)){
            this.$store.state.commits.reloadServers=!this.$store.state.commits.reloadServers;
            this.commitsConfig.reloadServers.pass++;
          }else {
            this.commitsConfig.reloadServers.intercept++;
          }
          break;
        }
        case 'reloadAccounts':{
          if(this.filter(name)){
            this.$store.state.commits.reloadAccounts=!this.$store.state.commits.reloadAccounts;
            this.commitsConfig.reloadAccounts.pass++;
          }else {
            this.commitsConfig.reloadAccounts.intercept++;
          }
          break;
        }
        case 'createTestLine':{
          if(this.filter(name)){
            this.$store.state.commits.createTestLine=!this.$store.state.commits.createTestLine;
            this.commitsConfig.createTestLine.pass++;
          }else {
            this.commitsConfig.createTestLine.intercept++;
          }
          break;
        }
        case 'openF4DebugBord':{
          if(this.filter(name)){
            this.$store.state.commits.openF4DebugBord=!this.$store.state.commits.openF4DebugBord;
            this.commitsConfig.openF4DebugBord.pass++;
          }else {
            this.commitsConfig.openF4DebugBord.intercept++;
          }
          break;
        }
        case 'openDetailsPanel':{
          if(this.filter(name)){
            this.$store.state.commits.openDetailsPanel=!this.$store.state.commits.openDetailsPanel;
            this.commitsConfig.openDetailsPanel.pass++;
          }else {
            this.commitsConfig.openDetailsPanel.intercept++;
          }
          break;
        }
        default:{
          break;
        }
      }
    },
  },
  created(){

  }
})
