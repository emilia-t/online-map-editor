<template>
  <div class="dataLayer" id="dataLayer" ref="dataLayer" style="pointer-events: auto">
    <svg class="elementData" id="elementData" ref="elementData" @contextmenu="preventDefault($event)" @dblclick="elementDataDbClick($event)" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" :style="'cursor:'+cursor">
      <svg-area v-for="area in MyAreaData" :key="area.id" :area-config="area"></svg-area><!--区域数据-->
      <svg-line v-for="line in MyPolyLineData" :key="line.id" :poly-line-config="line"></svg-line><!--线段数据-->
      <svg-point v-for="point in MyPointData" :key="point.id" :point-config="point"></svg-point><!--点位数据-->
      <svg-point-p0 :point-config="this.$store.state.mapConfig.p0" ref="ElementP0"></svg-point-p0><!--p0-->
      <svg-point-temp></svg-point-temp><!--临时点数据-->
      <svg-line-temp></svg-line-temp><!--临时线数据-->
      <svg-area-temp></svg-area-temp><!--临时区域数据-->
    </svg>
  </div>
</template>

<script>
import SvgLine from "./svgLine";
import SvgArea from "./svgArea";
import SvgPoint from "./svgPoint";
import SvgPointP0 from "./svgPointP0";
import SvgLineTemp from "./svgLineTemp";
import SvgAreaTemp from "./svgAreaTemp";
import SvgPointTemp from "./svgPointTemp";
export default {
  name: "LayerData",
  components: {SvgPoint,SvgLine,SvgPointP0,SvgLineTemp,SvgPointTemp,SvgArea,SvgAreaTemp},
  data(){
    return {
      MY_NAME:"LayerData",
      theData:{
        moveStartPt:{
          x:null,
          y:null
        },
        moveMovePt:{
          x:null,
          y:null
        },
        moveEndPt:{
          x:null,
          y:null
        },
        moveObServer:null,//移动侦测器
        moveObServerDt:[]
      }
    }
  },
  mounted:function(){
    this.startSetting();
  },
  methods:{
    startSetting(){//初始化设置
      this.getBrowserConfig();//获取浏览器配置
      this.getScreenCenter();//获取屏幕中心点
      this.getMousePos();//实时获取鼠标位置
      this.mapMoveStart();//添加移动侦听
      this.mapMoveIng();
      this.mapMoveEnd();
      this.visualAngleScale();//启用滚轮监听
      this.clearSelect();//启用点击空白处清除选中
      this.getMouseClick();//启用鼠标点击监听
      this.elementDataClick();//实时获取svg点击位置
      this.listenBrowserSize();//检测浏览器窗口大小变化
      this.getMouseUpSvg();//启用鼠标左键松开按下监听
      this.getMouseDownSvg();
    },
    preventDefault(mouseEvent){//阻止右键选中
      mouseEvent.preventDefault();
    },
    listenBrowserSize(){//检测浏览器窗口大小变化
      let resizeTimer;
      window.addEventListener('resize',()=>{
        clearTimeout(resizeTimer);
        resizeTimer=setTimeout(()=>{
          this.$store.state.cameraConfig.windowChange=false;
        },200);
        this.getBrowserConfig();
        this.$store.state.cameraConfig.windowChange=true;
      });
    },
    getMouseUpSvg(){//获取鼠标左键松开的位置(svg)
      this.$refs.elementData.addEventListener('mouseup',(e)=>{
        if(e.button===0){
          this.$store.state.mapConfig.svgMouseUp.x=e.x;this.$store.state.mapConfig.svgMouseUp.y=e.y;
        }
      }
      )
    },
    getMouseDownSvg(){//获取鼠标左键按下的位置(svg)
      this.$refs.elementData.addEventListener('mousedown',(e)=>{
          if(e.button===0){
            this.$store.state.mapConfig.svgMouseDown.x=e.x;this.$store.state.mapConfig.svgMouseDown.y=e.y;
          }
        }
      )
    },
    getMouseClick(){//获取鼠标点击位置
      document.addEventListener("click", (e)=>{this.$store.state.mapConfig.mouseClick.x=e.x;this.$store.state.mapConfig.mouseClick.y=e.y;})
    },
    getMousePos(){//实时获取鼠标位置
      document.addEventListener("mousemove", (e)=>{this.$store.state.mapConfig.mousePoint.x=e.x;this.$store.state.mapConfig.mousePoint.y=e.y;})
    },
    elementDataClick(){//实时获取svg点击位置
      this.$refs.elementData.addEventListener("click",(e)=>{this.$store.state.mapConfig.svgClick.x=e.x;this.$store.state.mapConfig.svgClick.y=e.y;})
    },
    elementDataDbClick(e){//双击svg事件
      this.$store.state.mapConfig.svgDbClick.x=e.x;
      this.$store.state.mapConfig.svgDbClick.y=e.y;
    },
    visualAngleScale(){//缩放视角
      let visualAngleTimer;//定时器标识
      let browserAgent=window.navigator.userAgent;
      let browser=null;
      if(browserAgent.indexOf('Firefox')!==-1){
        browser='firefox';
      } else if(browserAgent.indexOf('Chrome')!==-1){
        browser='chrome';
      }
      switch (browser){
        case 'firefox':{
          this.$refs.dataLayer.addEventListener('DOMMouseScroll',e=>Callback(e,'firefox'));
          break;
        }
        case 'chrome':{
          this.$refs.dataLayer.addEventListener('mousewheel',e=>Callback(e,'chrome'));
          break;
        }
        default:{
          this.$refs.dataLayer.addEventListener('mousewheel',e=>Callback(e,'chrome'));
        }
      }
      let Callback=(e,browser)=>{
        clearTimeout(visualAngleTimer);
        visualAngleTimer=setTimeout(()=>{
          let tp=null;
          switch (browser){
            case 'chrome':{
              tp=e.wheelDelta;
              break;
            }
            case 'firefox':{
              tp=(e.detail)*-1;
              break;
            }
          }
          if(this.$store.state.commits.disableZoomAndMove===false){//在进行节点移动操作时禁用缩放
            if(tp>0){//滚轮前进，放大
              if(this.$store.state.mapConfig.layer<=this.$store.state.cameraConfig.minZoom){
                return false;
              }
              this.$store.state.mapConfig.oldLayer=this.$store.state.mapConfig.layer;
              this.$store.state.mapConfig.layer-=1;//层级下调
            }else {//滚轮后退，缩放
              if(this.$store.state.mapConfig.layer>=this.$store.state.cameraConfig.maxZoom){
                return false;
              }
              this.$store.state.mapConfig.oldLayer=this.$store.state.mapConfig.layer;
              this.$store.state.mapConfig.layer+=1;//层级下调
            }
          }
        },200)
      };
    },
    getBrowserConfig(){//获取浏览器高度和宽度
      this.$store.state.mapConfig.browser.width=window.innerWidth;
      this.$store.state.mapConfig.browser.height=window.innerHeight;
    },
    getScreenCenter(){//获取屏幕中心点
      this.$store.state.mapConfig.centerPoint.x=window.innerWidth/2;
      this.$store.state.mapConfig.centerPoint.y=window.innerHeight/2;
    },
    createTestLine(){//创建一条测试用的Line

    },
    mapMoveStart(){//dataLayer的鼠标移动监听-按下
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousedown',(e)=>{
        if(e.button===0){
          this.$store.state.cameraConfig.doNeedMoveMap=true;
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveStartPt=point;
        }
        if(this.$store.state.mapConfig.cursorLock===false){//更改cursor
          this.$store.state.mapConfig.cursor='grabbing';
        }
      })
    },
    mapMoveIng(){//dataLayer的鼠标移动监听-移动
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousemove',(e)=>{
        if(this.$store.state.cameraConfig.doNeedMoveMap){
          this.theData.moveMovePt={x:e.x,y:e.y};
          if(this.theData.moveObServer===null){
            this.setMoveObServer();
          }
        }
      })
    },
    mapMoveEnd(){//dataLayer的鼠标移动监听-松开
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mouseup',(e)=>{
        if(e.button===0){
          this.$store.state.cameraConfig.doNeedMoveMap=false;
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveEndPt=point;
          if(this.theData.moveObServer!==null){//停用移动侦测器
            this.removeMoveObServer();
          }
          this.clearMoveCache();//清空移动缓存
        }
        if(this.$store.state.mapConfig.cursorLock===false){//更改cursor
          this.$store.state.mapConfig.cursor='default';
        }
      });
    },
    setMoveObServer(){//设置移动侦测器
      if(this.theData.moveObServer===null){
        this.theData.moveObServer=setInterval(
          ()=>{
            if(this.$store.state.commits.disableZoomAndMove===false){//如果有移动节点的操作会抑制更新
              try {
                let pt=this.theData.moveMovePt;
                let le=this.theData.moveObServerDt.length;
                switch (le){
                  case 2:{
                    this.theData.moveObServerDt.shift();
                    this.theData.moveObServerDt.push(pt);
                    let A1=this.theData.moveObServerDt[0];
                    let A2=this.theData.moveObServerDt[1];
                    let xc3=-(A2.x-A1.x);
                    let yc4=A2.y-A1.y;
                    this.$store.state.mapConfig.A1.x+=xc3;
                    this.$store.state.mapConfig.A1.y+=yc4;
                    break;
                  }
                  case 0:{
                    this.theData.moveObServerDt.push(pt);
                    let Apt=this.theData.moveStartPt;
                    let xc,yc;
                    xc=-(pt.x-Apt.x);
                    yc=pt.y-Apt.y;
                    this.$store.state.mapConfig.A1.x+=xc;
                    this.$store.state.mapConfig.A1.y+=yc;
                    break;
                  }
                  case 1:{
                    this.theData.moveObServerDt.push(pt);
                    let Bpt=this.theData.moveObServerDt[0];
                    let xc2,yc2;
                    xc2=-(pt.x-Bpt.x);
                    yc2=pt.y-Bpt.y;
                    this.$store.state.mapConfig.A1.x+=xc2;
                    this.$store.state.mapConfig.A1.y+=yc2;
                    break;
                  }
                  default:{
                    break;
                  }
                }
              }
              catch (e) {

              }
            }
          }
          ,this.frameTime)
      }
    },
    removeMoveObServer(){//移除移动侦测器
      if(this.theData.moveObServer!==null){
        clearInterval(this.theData.moveObServer);
        this.theData.moveObServer=null;
      }
    },
    clearMoveCache(){//清空移动缓存
      this.theData.moveStartPt.x=null;
      this.theData.moveStartPt.y=null;
      this.theData.moveMovePt.x=null;
      this.theData.moveMovePt.y=null;
      this.theData.moveEndPt.x=null;
      this.theData.moveEndPt.y=null;
      this.theData.moveObServerDt.length=0;
    },
    instruction(newValue){//命令接收器
      let instructName=[];//1获取命令名
      for (let key in newValue) {
        instructName.push(key)
      }
      for(let i=0;i<instructName.length;i++){
        let name = instructName[i];
        switch (name){
          case 'createTestLine':{
            this.createTestLine();
            break;
          }
        }
      }
    },
    clearSelect(){//清除选中要素及选中要素数据
      this.$refs.elementData.addEventListener('click',(ev)=>{
        let nodeNames=['polyline','circle'];//可以被选中的要素nodeName合集
        if(nodeNames.indexOf(ev.target.nodeName)===-1){
          this.$store.state.detailsPanelConfig.target=-1;
          this.$store.state.detailsPanelConfig.data={point:{x:null,y:null}};
          this.$store.state.mapConfig.clearClick.x=ev.x;//更新点击空白处操作位置
          this.$store.state.mapConfig.clearClick.y=ev.y;
        }
        this.$store.state.elementOperationBoardConfig.display=false;//关闭element operation board
      })
    }
  },
  computed:{
    cursor(){
      return this.$store.state.mapConfig.cursor;
    },
    frameTime() {
      return this.$store.state.cameraConfig.frameTime;
    },
    commitsCreateTestLine() {
      return this.$store.state.commits.createTestLine;
    },
    anonymousInstruct() {
      return this.$store.state.anonymousInstruct;
    },
    A1() {
      return this.$store.state.mapConfig.A1;
    },
    MyAreaData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.areas;
      }else {
        return [];
      }
    },
    MyPolyLineData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.lines;
      }else {
        return [];
      }
    },
    MyPointData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.points;
      }else {
        return [];
      }
    }
  },
  watch:{
    commitsCreateTestLine:{
      handler(newValue,oldValue){
        this.createTestLine();
      },
      deep:true
    },
    anonymousInstruct:{
      handler(newValue,oldValue){
        this.instruction(newValue,oldValue);
      },
      deep:true
    }
  },
  destroyed(){

  }
}
</script>
<style scoped>
#dataLayer{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  z-index: 545;left: 0px;
  top:0px;
  pointer-events: none
}
.elementData{
  width: 100%;
  height: 100%;
  cursor: default;
  position: absolute;
  z-index: 545;
  left: 0px;
  top:0px;
}
</style>
