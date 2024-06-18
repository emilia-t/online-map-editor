import Vue from 'vue';
import router from './router';
import App from "./App";
import general_script from './js/general_script_v1.1';//a
import store from './store';
Vue.config.productionTip = false;//不允许生产环境输入错误信息
Array.prototype.remove=function(val){//查找一维的数组内的成员并删除
  const ind=this.indexOf(val);
  if(ind>-1)return this.splice(ind,1);
  return this;
};
Array.prototype.removeByElementId = function (id) {//Array must [{id:123,type:'point'},{element}...]
  const index = this.findIndex(item => item.id === id);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
};
new Vue({
  el:'#app',
  data(){
    return{
      Copyright:'Minxi Wan',
      Version:'0.6.5',
      lastTime:0,
      fps:0,
      general_script,
      commitsConfig:{
        disabledList:['createTestLine'],
        createTestLine:{pass:0,intercept:0},
        openF4DebugBord:{pass:0,intercept:0},
        openDetailsPanel:{pass:0,intercept:0},
        reloadAccounts:{pass:0,intercept:0},
        reloadServers:{pass:0,intercept:0},
        addNewPointEnd:{pass:0,intercept:0},
        setMenuPanelDisplay:{pass:0,intercept:0},
        previewLine:{pass:0,intercept:0},
        addNewLineEnd:{pass:0,intercept:0},
        disableZoomAndMove:{pass:0,intercept:0},
        disableMove:{pass:0,intercept:0},
        addNewAreaEnd:{pass:0,intercept:0},
        addNewCurveEnd:{pass:0,intercept:0},
        allReinitialize:{pass:0,intercept:0},
      }
    }
  },
  router,
  store,
  components:{App},
  template:'<app></app>',
  created(){
    if(this.$store.state.userSettingConfig.openFpsMonitor){
      setTimeout(()=>this.monitorFPS(),1000);
      setInterval(()=>this.$store.state.monitorConfig.fps=this.fps,2000);
    }
  },
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
    sendSwitchInstruct(name,status){//发送一个带有单一状态的命令
      switch (name) {
        case 'previewLine':{//用于显示或关闭预览线段
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
        case 'disableMove':{
          if(this.filter(name)){
            this.$store.state.commits.disableMove=status;
            this.commitsConfig.disableMove.pass++;
          }else {
            this.commitsConfig.disableMove.intercept++;
          }
          break;
        }
      }
    },
    sendInstruct(name){//命令状态更新
      switch (name){
        case  'allReinitialize':{
          if(this.filter(name)){
            this.$store.state.commits.allReinitialize=!this.$store.state.commits.allReinitialize;
            this.commitsConfig.allReinitialize.pass++;
          }else {
            this.commitsConfig.allReinitialize.intercept++;
          }
          break;
        }
        case 'addNewAreaEnd':{
          if(this.filter(name)){
            this.$store.state.commits.addNewAreaEnd=!this.$store.state.commits.addNewAreaEnd;
            this.commitsConfig.addNewAreaEnd.pass++;
          }else {
            this.commitsConfig.addNewAreaEnd.intercept++;
          }
          break;
        }
        case 'addNewLineEnd':{
          if(this.filter(name)){
            this.$store.state.commits.addNewLineEnd=!this.$store.state.commits.addNewLineEnd;
            this.commitsConfig.addNewLineEnd.pass++;
          }else {
            this.commitsConfig.addNewLineEnd.intercept++;
          }
          break;
        }
        case 'addNewCurveEnd':{
          if(this.filter(name)){
            this.$store.state.commits.addNewCurveEnd=!this.$store.state.commits.addNewCurveEnd;
            this.commitsConfig.addNewCurveEnd.pass++;
          }else {
            this.commitsConfig.addNewCurveEnd.intercept++;
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
    computeMouseActualPos(mouseEvent){//返回移动后的元素坐标位置
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        let latLng=this.$store.state.baseMapConfig.baseMap.viewPositionToLatLng(mouseEvent.x,mouseEvent.y);
        return {x:latLng.lng,y:latLng.lat};
      }
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){//虚拟
        try{
          let [layer,mousePos,p0Pos,refPos]=[null,{x:null,y:null},{x:null,y:null},{x:null,y:null}];
          layer=this.$store.state.mapConfig.layer;
          mousePos.x=mouseEvent.x;mousePos.y=mouseEvent.y;
          p0Pos.x=this.$store.state.mapConfig.p0.point.x;
          p0Pos.y=this.$store.state.mapConfig.p0.point.y;
          if(layer===0){
            refPos.x=mousePos.x*this.unit1X+p0Pos.x+this.offsetX;
            refPos.y=p0Pos.y-mousePos.y*this.unit1Y+this.offsetY;
            return refPos;
          }
          if(layer>0){
            refPos.x=(mousePos.x*this.unit1X)+p0Pos.x;
            refPos.y=p0Pos.y-(mousePos.y*this.unit1Y);
            for (let i=0;i<layer;i++){
              refPos.x=refPos.x+(refPos.x*this.$store.state.mapConfig.zoomAdd);
              refPos.y=refPos.y+(refPos.y*this.$store.state.mapConfig.zoomAdd);
            }
            return refPos;
          }
          if(layer<0){
            refPos.x=mousePos.x*this.unit1X+p0Pos.x;
            refPos.y=p0Pos.y-mousePos.y*this.unit1X;
            for(let i=0;i>layer;i--){
              refPos.x=refPos.x+(refPos.x*this.$store.state.mapConfig.zoomSub);
              refPos.y=refPos.y+(refPos.y*this.$store.state.mapConfig.zoomSub);
            }
            return refPos;
          }
        }catch (e) {
          return false;
        }
      }
    },
    monitorFPS() {
      let now = performance.now();
      if (this.lastTime !== 0) {
        this.fps=Math.floor(1000 / (now - this.lastTime));
      }
      this.lastTime = now;
      requestAnimationFrame(this.monitorFPS);
    }
  },
  computed:{
    unit1X(){
      return this.$store.state.cameraConfig.unit1X;
    },
    unit1Y(){
      return this.$store.state.cameraConfig.unit1Y;
    },
    offsetX(){
      return this.$store.state.cameraConfig.offsetX;
    },
    offsetY(){
      return this.$store.state.cameraConfig.offsetY;
    },
  },
});
