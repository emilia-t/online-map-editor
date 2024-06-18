<template>
  <div class="dataLayer" id="dataLayer" ref="dataLayer" style="pointer-events: auto">
    <canvas id="mixCanvas"/>
    <svg style="transform:translateZ(0)" class="elementData" id="elementData" ref="elementData"
         width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"
         @contextmenu="preventDefault($event)" @dblclick="elementDataDbClick($event)"  :style="'cursor:'+cursor">
      <defs><!--滤镜-->
        <filter id="svgFilterShadow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
        <filter id="svgFilterShadowArea">
          <feFlood flood-color="#000000" />
          <feComposite in2="SourceGraphic" operator="out" />
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite operator="atop" in2="SourceGraphic"/>
        </filter>
        <filter id="svgFilterOutline">
          <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="1"/>
          <feMerge>
            <feMergeNode in="DILATED" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g ref="svgAllElement">
        <svg-effects/><!--效果层-->
        <svg-point-temp/><!--临时点数据-->
        <svg-line-temp/><!--临时线数据-->
        <svg-curve-temp/><!--临时区域数据-->
        <svg-area-temp/><!--临时区域数据-->

        <svg-area v-for="area in svgAreaData" :key="area.id"
          :pick-config="pickElement(area.id)" :select-config="selectElement(area.id)"
          :area-config="area" :show-details-id="showDetailsId" v-show="!mapHiddenElements.has(area.id)">
        </svg-area><!--区域数据-->

        <svg-line v-for="line in svgLineData" :key="line.id"
          :pick-config="pickElement(line.id)" :select-config="selectElement(line.id)"
          :poly-line-config="line" :show-details-id="showDetailsId" v-show="!mapHiddenElements.has(line.id)">
        </svg-line><!--线段数据-->

        <svg-curve v-for="curve in svgCurveData" :key="curve.id"
          :pick-config="pickElement(curve.id)" :select-config="selectElement(curve.id)"
          :curve-config="curve" :show-details-id="showDetailsId" v-show="!mapHiddenElements.has(curve.id)">
        </svg-curve><!--线段数据-->

        <svg-point v-for="point in svgPointData" :key="point.id"
          :pick-config="pickElement(point.id)" :select-config="selectElement(point.id)"
          :point-config="point" :show-details-id="showDetailsId" v-show="!mapHiddenElements.has(point.id)">
        </svg-point><!--点位数据-->

        <svg-point-p0 :point-config="this.$store.state.mapConfig.p0" ref="ElementP0">
        </svg-point-p0><!--p0-->
      </g>
    </svg>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import SvgEffects from './svgEffects';
import SvgPoint from "./svgPoint";
import SvgLine from "./svgLine";
import SvgCurve from "./svgCurve";
import SvgArea from "./svgArea";
import SvgPointP0 from "./svgPointP0";
import SvgLineTemp from "./svgLineTemp";
import SvgCurveTemp from "./svgCurveTemp";
import SvgAreaTemp from "./svgAreaTemp";
import SvgPointTemp from "./svgPointTemp";
export default {
  name: "LayerData",
  components: {SvgPoint,SvgLine,SvgCurve,SvgArea,SvgPointP0,SvgLineTemp,SvgCurveTemp,SvgPointTemp,SvgAreaTemp,SvgEffects},
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
      },
      showDetailsId:0,
      mixCanvas:null,
      mixPipeLine:{
        el:null,
        options:{
          viewWidth:null,
          viewHeight:null,
          mapHiddenElements:null,
          mapEjectElements:null,
          renderRangeX:'150%',
          renderRangeY:'150%',
        },
        elements:{
          points:null,
          lines:null,
          areas:null,
          curves:null
        }
      },
      svgPointData:[

      ],
      svgLineData:[

      ],
      svgAreaData:[

      ],
      svgCurveData:[

      ]
    }
  },
  mounted:function(){
    this.startSetting();
  },
  methods:{
    startSetting(){//初始化设置
      this.getBrowserConfig();//获取浏览器配置
      this.getScreenCenter();//获取屏幕中心点
      this.mapMoveStart();//添加移动侦听
      this.mapMoveIng();
      this.mapMoveEnd();
      this.mapMoveOut();
      this.visualAngleScale();//启用滚轮监听
      this.listenMousePos();//实时获取鼠标位置
      this.listenBrowserSize();//检测浏览器窗口大小变化
      this.listenClearSelect();//启用点击空白处清除选中
      this.listenMouseClick();//启用鼠标点击监听
      this.listenMouseUpSvg();//启用鼠标左键松开按下监听
      this.listenMouseDownSvg();
      this.listenElementDataClick();//实时获取svg点击位置
      this.initialMapData();
      this.setMixCanvas();
      // setTimeout(//检查调试mixCanvas
      //   ()=>{
      //     this.mixCanvas.mixColorBlockView()
      //   }
      // ,3000);
    },
    initialMapData(){
      this.initialPointData();
      this.initialLineData();
      this.initialAreaData();
      this.initialCurveData();
    },
    initialPointData(){//解析点数据
      let Len=this.MyPointData.length;
      for(let p=0;p<Len;p++){
        let viewPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.MyPointData[p].basePoint.y,this.MyPointData[p].basePoint.x);
        this.$store.state.serverData.socket.mapData.points[p].point={x:viewPosition.x,y:viewPosition.y};
        this.$store.state.serverData.socket.mapData.points[p].points=[{x:viewPosition.x,y:viewPosition.y}];
      }
    },
    initialLineData(){//解析线段数据
      let Len=this.MyPolyLineData.length;
      for(let p=0;p<Len;p++){
        let pointPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.MyPolyLineData[p].basePoint.y,this.MyPolyLineData[p].basePoint.x);
        this.$store.state.serverData.socket.mapData.lines[p].point={x:pointPosition.x,y:pointPosition.y};
        const count=this.$store.state.serverData.socket.mapData.lines[p].points.length;
        this.$store.state.serverData.socket.mapData.lines[p].points=[];
        for(let i=0;i<count;i++){
          try{
            let pointsPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.MyPolyLineData[p].basePoints[i].y,this.MyPolyLineData[p].basePoints[i].x);
            this.$store.state.serverData.socket.mapData.lines[p].points.push({x:pointsPosition.x,y:pointsPosition.y});
          }catch (e) {

          }
        }
      }
    },
    initialAreaData(){//解析区域数据
      let Len=this.MyAreaData.length;
      for(let p=0;p<Len;p++){
        if(this.pauseInitialSvgId===this.MyAreaData[p].id){
          continue;
        }
        let pointPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.MyAreaData[p].basePoint.y,this.MyAreaData[p].basePoint.x);
        this.$store.state.serverData.socket.mapData.areas[p].point={x:pointPosition.x,y:pointPosition.y};
        const count=this.$store.state.serverData.socket.mapData.areas[p].points.length;
        this.$store.state.serverData.socket.mapData.areas[p].points=[];
        for(let i=0;i<count;i++){
          try{//存在节点数量同步问题
            let pointsPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.MyAreaData[p].basePoints[i].y,this.MyAreaData[p].basePoints[i].x);
            this.$store.state.serverData.socket.mapData.areas[p].points.push({x:pointsPosition.x,y:pointsPosition.y});
          }catch (e) {

          }
        }
      }
    },
    initialCurveData(){//解析曲线数据
      let Len=this.MyCurveData.length;
      for(let p=0;p<Len;p++){
        if(this.pauseInitialSvgId===this.MyCurveData[p].id){
          continue;
        }
        let pointPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.MyCurveData[p].basePoint.y,this.MyCurveData[p].basePoint.x);
        this.$store.state.serverData.socket.mapData.curves[p].point={x:pointPosition.x,y:pointPosition.y};
        const count=this.$store.state.serverData.socket.mapData.curves[p].points.length;
        this.$store.state.serverData.socket.mapData.curves[p].points=[];
        for(let i=0;i<count;i++){
          try{
            let pointsPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.MyCurveData[p].basePoints[i].y,this.MyCurveData[p].basePoints[i].x);
            this.$store.state.serverData.socket.mapData.curves[p].points.push({x:pointsPosition.x,y:pointsPosition.y});
          }catch (e) {

          }
        }
      }
    },
    setMixCanvas(){
      setTimeout(
        ()=>{
          this.mixPipeLine.el='mixCanvas';
          this.mixPipeLine.elements.points=this.MyPointData;
          this.mixPipeLine.elements.lines=this.MyPolyLineData;
          this.mixPipeLine.elements.areas=this.MyAreaData;
          this.mixPipeLine.elements.curves=this.MyCurveData;
          this.mixPipeLine.options.viewWidth=this.browserSize.width;
          this.mixPipeLine.options.viewHeight=this.browserSize.height;
          this.mixPipeLine.options.mapHiddenElements=this.mapHiddenElements;
          this.mixPipeLine.options.mapEjectElements=new Map();
          if(this.mixVisibleRange==='low'){
            this.mixPipeLine.options.renderRangeX='100%';
            this.mixPipeLine.options.renderRangeY='100%';
          }else if(this.mixVisibleRange==='medium'){
            this.mixPipeLine.options.renderRangeX='150%';
            this.mixPipeLine.options.renderRangeY='150%';
          }else if(this.mixVisibleRange==='high'){
            this.mixPipeLine.options.renderRangeX='200%';
            this.mixPipeLine.options.renderRangeY='200%';
          }
          this.mixCanvas=new this.$store.state.classList.mixCanvas(this.mixPipeLine);
        },
        0
      );
    },
    selectElement(id){
      let select=this.selectElements.find(num=>num.id===id);
      if(select===undefined){
        return {}
      }else {
        return select;
      }
    },
    pickElement(id){
      let select=this.pickElements.find(num=>num.id===id);
      if(select===undefined){
        return {};
      }else {
        return select;
      }
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
    listenMouseUpSvg(){//获取鼠标左键松开的位置(svg)
      this.$refs.elementData.addEventListener('mouseup',(e)=>{
        if(e.button===0){
          this.$store.state.mapConfig.svgMouseUp.x=e.x;
          this.$store.state.mapConfig.svgMouseUp.y=e.y;
          this.$store.state.mapConfig.svgMouseUp.target=e.target;
        }else if(e.button===2){
          this.$store.state.mapConfig.svgMouseRUp.x=e.x;
          this.$store.state.mapConfig.svgMouseRUp.y=e.y;
          this.$store.state.mapConfig.svgMouseRUp.target=e.target;
        }
      }
      )
    },
    listenMouseDownSvg(){//获取鼠标左键按下的位置(svg)
      this.$refs.elementData.addEventListener('mousedown',(e)=>{
          if(e.button===0){
            this.$store.state.mapConfig.svgMouseDown.x=e.x;
            this.$store.state.mapConfig.svgMouseDown.y=e.y;
            this.$store.state.mapConfig.svgMouseDown.target=e.target;
          }else if(e.button===2){
            this.$store.state.mapConfig.svgMouseRDown.x=e.x;
            this.$store.state.mapConfig.svgMouseRDown.y=e.y;
            this.$store.state.mapConfig.svgMouseRDown.target=e.target;
          }
        }
      )
    },
    listenMouseClick(){//获取鼠标点击位置
      document.addEventListener("click", (e)=>{
        this.$store.state.mapConfig.mouseClick.x=e.x;
        this.$store.state.mapConfig.mouseClick.y=e.y;
      });
    },
    listenMousePos(){//实时获取鼠标位置
      document.addEventListener("mousemove", (e)=>{
        this.$store.state.mapConfig.mousePoint.x=e.x;
        this.$store.state.mapConfig.mousePoint.y=e.y;
      });
    },
    listenElementDataClick(){//实时获取svg点击位置
      this.$refs.elementData.addEventListener("click",(e)=>{
        this.$store.state.mapConfig.svgClick.x=e.x;
        this.$store.state.mapConfig.svgClick.y=e.y;
      });
    },
    listenClearSelect(){//清除选中要素及选中要素数据
      this.$refs.elementData.addEventListener("click",(ev)=>{
        let downX=this.$store.state.mapConfig.svgMouseDown.x;
        let upX=this.$store.state.mapConfig.svgMouseUp.x;
        let downY=this.$store.state.mapConfig.svgMouseDown.y;
        let upY=this.$store.state.mapConfig.svgMouseUp.y;
        if(downX!==upX || downY!==upY){
          return false;
        }
        let nodeNames=['polyline','polygon','circle','path'];//可以被选中的要素nodeName合集
        if(nodeNames.indexOf(ev.target.nodeName)===-1){
          this.$store.state.detailsPanelConfig.target=-1;
          this.$store.state.mapConfig.operated.id=-1;
          this.$store.state.mapConfig.operated.data=null;
          this.$store.state.detailsPanelConfig.data={point:{x:null,y:null}};
          this.$store.state.mapConfig.clearClick.x=ev.x;//更新点击空白处操作位置
          this.$store.state.mapConfig.clearClick.y=ev.y;
        }
        setTimeout(()=>this.showDetailsId=0,0);
        this.$store.state.operationBoardConfig.display=false;//关闭element operation board
      })
    },
    elementDataDbClick(e){//双击svg事件
      this.$store.state.mapConfig.svgDbClick.x=e.x;
      this.$store.state.mapConfig.svgDbClick.y=e.y;
    },
    visualAngleScale(){//缩放视角
      let visualAngleTimer=null;//定时器标识
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
          this.$refs.dataLayer.addEventListener('mousewheel',e=>Callback(e,'chrome'),{passive:true});
          break;
        }
        default:{
          this.$refs.dataLayer.addEventListener('mousewheel',e=>Callback(e,'chrome'));
        }
      }
      let Callback=(e,browser)=>{
        this.$store.state.cameraConfig.zoomIng=true;
        if(visualAngleTimer===null){
          visualAngleTimer=setTimeout(()=>{
            let tp=null;
            switch (browser){case 'chrome':{tp=e.wheelDelta;break;}case 'firefox':{tp=(e.detail)*-1;break;}}
            if(this.$store.state.commits.disableZoomAndMove===false){//在进行节点移动操作时禁用缩放
              clearTimeout(visualAngleTimer);
              visualAngleTimer=null;
              if(tp>0){//滚轮前进，放大
                if(this.$store.state.mapConfig.layer<=this.$store.state.cameraConfig.minZoom){return false;}
                this.$store.state.mapConfig.oldLayer=this.$store.state.mapConfig.layer;
                this.$store.state.mapConfig.layer-=1;//层级下调
                this.$store.state.cameraConfig.zoomIng=false;
                this.$store.state.mapConfig.mouseWheelPos.x=e.x;
                this.$store.state.mapConfig.mouseWheelPos.y=e.y;
              }else {//滚轮后退，缩放
                if(this.$store.state.mapConfig.layer>=this.$store.state.cameraConfig.maxZoom){return false;}
                this.$store.state.mapConfig.oldLayer=this.$store.state.mapConfig.layer;
                this.$store.state.mapConfig.layer+=1;//层级下调
                this.$store.state.cameraConfig.zoomIng=false;
                this.$store.state.mapConfig.mouseWheelPos.x=e.x;
                this.$store.state.mapConfig.mouseWheelPos.y=e.y;
              }
            }
          },this.$store.state.cameraConfig.wheelInterval);
        }
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
      void 0;
    },
    mapMoveOut(){//鼠标移出界面外后停止移动
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mouseout',(e)=>{
        if(e.y<=1 || e.y>=window.innerHeight-1 || e.x<=1 || e.x>=window.innerWidth-1){
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
        }
      });
    },
    mapMoveStart(){//dataLayer的鼠标移动监听-按下
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousedown',(e)=>{
        if(this.$store.state.commits.disableMove){//缩放时避免移动
          return false;
        }
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
      });
    },
    mapMoveEnd(){//dataLayer的鼠标移动监听-松开
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mouseup',(e)=>{
        if(e.button===0){
          this.$store.state.cameraConfig.doNeedMoveMap=false;
          this.theData.moveEndPt={x:e.x,y:e.y};
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
                    this.$store.state.mapConfig.movingDistance.x+=xc3;
                    this.$store.state.mapConfig.A1.x+=xc3;
                    this.$store.state.mapConfig.movingDistance.y+=yc4;
                    this.$store.state.mapConfig.A1.y+=yc4;
                    break;
                  }
                  case 0:{
                    this.theData.moveObServerDt.push(pt);
                    let Apt=this.theData.moveStartPt;
                    let xc,yc;
                    xc=-(pt.x-Apt.x);
                    yc=pt.y-Apt.y;
                    this.$store.state.mapConfig.movingDistance.x+=xc;
                    this.$store.state.mapConfig.A1.x+=xc;
                    this.$store.state.mapConfig.movingDistance.y+=yc;
                    this.$store.state.mapConfig.A1.y+=yc;
                    break;
                  }
                  case 1:{
                    this.theData.moveObServerDt.push(pt);
                    let Bpt=this.theData.moveObServerDt[0];
                    let xc2,yc2;
                    xc2=-(pt.x-Bpt.x);
                    yc2=pt.y-Bpt.y;
                    this.$store.state.mapConfig.movingDistance.x+=xc2;
                    this.$store.state.mapConfig.A1.x+=xc2;
                    this.$store.state.mapConfig.movingDistance.y+=yc2;
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
          ,this.$store.state.cameraConfig.frameTime);
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
      this.$store.state.mapConfig.movingDistance.x=0;
      this.$store.state.mapConfig.movingDistance.y=0;
    },
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
    drawing(){
      return this.$store.state.mapConfig.drawing;
    },
    pauseInitialSvgId(){
      return this.$store.state.cameraConfig.pauseInitialSvgId
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    mixCanvasFlash(){
      return this.$store.state.cameraConfig.mixCanvasFlash;
    },
    browserSize(){
      return this.$store.state.mapConfig.browser;
    },
    layer(){
      return this.$store.state.mapConfig.layer;
    },
    svgMouseDown(){
      return this.$store.state.mapConfig.svgMouseDown;
    },
    svgMouseUp(){
      return this.$store.state.mapConfig.svgMouseUp;
    },
    svgMouseRDown(){
      return this.$store.state.mapConfig.svgMouseRDown;
    },
    svgMouseRUp(){
      return this.$store.state.mapConfig.svgMouseRUp;
    },
    mapHiddenElements(){
      let map=new Map();
      this.hiddenElements.forEach(value=>map.set(value.id,true));
      return map;
    },
    movingDistance(){
      return this.$store.state.mapConfig.movingDistance;
    },
    pickElements(){
      return this.$store.state.serverData.socket.pickElements;
    },
    selectElements(){
      return this.$store.state.serverData.socket.selectElements;
    },
    lastPickIng(){
      return this.$store.state.serverData.socket.lastPickIng;
    },
    lastPickEnd(){
      return this.$store.state.serverData.socket.lastPickEnd;
    },
    lastSelectIng(){
      return this.$store.state.serverData.socket.lastSelectIng;
    },
    lastSelectEnd(){
      return this.$store.state.serverData.socket.lastSelectEnd;
    },
    cursor(){
      return this.$store.state.mapConfig.cursor;
    },
    updateCount(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.updateCount;
      }else {
        return 0;
      }
    },
    MyCurveData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.curves;
      }else {
        return [];
      }
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
    },
    mixVisibleRange(){
      return this.$store.state.userSettingConfig.mixVisibleRange;
    },
    lastDeleteId(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastDeleteId;
      }else {
        return -1;
      }
    },
    lastAddPoint(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastAddPoint;
      }else {
        return null;
      }
    },
    lastAddLine(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastAddLine;
      }else {
        return null;
      }
    },
    lastAddArea(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastAddArea;
      }else {
        return null;
      }
    },
    lastAddCurve(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastAddCurve;
      }else {
        return null;
      }
    },
  },
  watch:{
    mixVisibleRange:{
      handler(newValue){
        switch (newValue){
          case 'low':{
            this.mixPipeLine.options.renderRangeX='100%';
            this.mixPipeLine.options.renderRangeY='100%';
            this.mixCanvas.mixSetRenderRange();
            this.mixCanvas.mixDraw();
            break;
          }
          case 'medium':{
            this.mixPipeLine.options.renderRangeX='150%';
            this.mixPipeLine.options.renderRangeY='150%';
            this.mixCanvas.mixSetRenderRange();
            this.mixCanvas.mixDraw();
            break;
          }
          case 'high':{
            this.mixPipeLine.options.renderRangeX='200%';
            this.mixPipeLine.options.renderRangeY='200%';
            this.mixCanvas.mixSetRenderRange();
            this.mixCanvas.mixDraw();
            break;
          }
        }
      }
    },
    updateCount:{//用于同步svg与mixCanvas的数据
      handler(){
        let pointLen=this.svgPointData.length;
        let lineLen=this.svgLineData.length;
        let areaLen=this.svgAreaData.length;
        let curveLen=this.svgCurveData.length;
        let mapPoints=new Map(this.MyPointData.map(item=>[item.id,item]));
        let mapLines=new Map(this.MyPolyLineData.map(item=>[item.id,item]));
        let mapAreas=new Map(this.MyAreaData.map(item=>[item.id,item]));
        let mapCurves=new Map(this.MyCurveData.map(item=>[item.id,item]));
        for(let i=0;i<pointLen;i++){
          Object.assign(this.svgPointData[i],mapPoints.get(this.svgPointData[i].id));
        }
        for(let i=0;i<lineLen;i++){
          Object.assign(this.svgLineData[i],mapLines.get(this.svgLineData[i].id));
        }
        for(let i=0;i<areaLen;i++){
          Object.assign(this.svgAreaData[i],mapAreas.get(this.svgAreaData[i].id));
        }
        for(let i=0;i<curveLen;i++){
          Object.assign(this.svgCurveData[i],mapCurves.get(this.svgCurveData[i].id));
        }
        this.mixCanvas.mixDraw();
      }
    },
    lastDeleteId:{
      handler(newValue){
        if(newValue!==-1){
          this.svgPointData.removeByElementId(newValue);
          this.svgLineData.removeByElementId(newValue);
          this.svgAreaData.removeByElementId(newValue);
          this.svgCurveData.removeByElementId(newValue);
          this.mixCanvas.moveDrawJoin(newValue,false);
          this.mixCanvas.moveDrawOut(newValue,true);
        }
      }
    },
    svgMouseUp:{
      handler(newValue){
        if(this.drawing)return false;
        if(newValue.x!==this.svgMouseDown.x || newValue.y!==this.svgMouseDown.y)return false;
        if(this.svgMouseDown.target.getAttribute('data-t')==='node')return false;
        let element=this.mixCanvas.mixGetElementByXY(newValue.x,newValue.y);
        if(element!==false){
          if(element.type==='point'){
            let len=this.svgPointData.length;
            for(let i=0;i<len;i++){//遍历当前已弹入的元素，避免重复弹出
              if(this.svgPointData[i].id===element.id){
                return false;
              }
            }
            this.svgPointData.push(element);//弹入svg
            this.showDetailsId=element.id;
          }
          else if(element.type==='line'){
            let len=this.svgLineData.length;
            for(let i=0;i<len;i++){
              if(this.svgLineData[i].id===element.id){
                return false;
              }
            }
            this.svgLineData.push(element);
            this.showDetailsId=element.id;
          }
          else if(element.type==='area'){
            let len=this.svgAreaData.length;
            for(let i=0;i<len;i++){
              if(this.svgAreaData[i].id===element.id){
                return false;
              }
            }
            this.svgAreaData.push(element);
            this.showDetailsId=element.id;
          }
          else if(element.type==='curve'){
            let len=this.svgCurveData.length;
            for(let i=0;i<len;i++){
              if(this.svgCurveData[i].id===element.id){
                return false;
              }
            }
            this.svgCurveData.push(element);
            this.showDetailsId=element.id;
          }
        }
      },
      deep:true
    },
    svgMouseRUp:{
      handler(newValue){
        if(newValue.x!==this.svgMouseRDown.x || newValue.y!==this.svgMouseRDown.y)return false;
        let element=this.mixCanvas.mixGetElementByXY(newValue.x,newValue.y);//源
        if(element!==false){
          if
          (element.type==='point'){
            for(let i=0;i<this.svgPointData.length;i++){
              if(this.svgPointData[i].id===element.id){
                return false;
              }
            }
            this.svgPointData.push(element);
          }
          else if
          (element.type==='line'){
            for(let i=0;i<this.svgLineData.length;i++){
              if(this.svgLineData[i].id===element.id){
                return false;
              }
            }
            this.svgLineData.push(element);
          }
          else if
          (element.type==='area'){
            for(let i=0;i<this.svgAreaData.length;i++){
              if(this.svgAreaData[i].id===element.id){
                return false;
              }
            }
            this.svgAreaData.push(element)
          }
          this.$store.state.operationBoardConfig.display=true;//对右侧悬浮条的位置和显示状态操作
          this.$store.state.operationBoardConfig.posX=newValue.x;
          this.$store.state.operationBoardConfig.posY=newValue.y;
          this.$store.state.mapConfig.operated.id=element.id;//设置operated
          this.$store.state.mapConfig.operated.data=element;
        }
      },
      deep:true
    },
    browserSize:{
      handler(){
        if(this.mixCanvas===null)return false;
        this.mixPipeLine.options.viewWidth=this.browserSize.width;
        this.mixPipeLine.options.viewHeight=this.browserSize.height;
        this.mixPipeLine.options.viewHeight=this.browserSize.height;
        this.mixCanvas.mixReSize();
        this.mixCanvas.mixSetRenderRange();
        this.mixCanvas.mixDraw();
      },
      deep:true
    },
    MyPointData:{
      handler(){
        this.initialPointData();
        this.mixCanvas.mixDraw();
      }
    },
    MyPolyLineData:{
      handler(){
        this.initialLineData();
        this.mixCanvas.mixDraw();
      }
    },
    MyAreaData:{
      handler(){
        this.initialAreaData();
        this.mixCanvas.mixDraw();
      }
    },
    MyCurveData:{
      handler(){
        this.initialCurveData();
        this.mixCanvas.mixDraw();
      }
    },
    movingDistance:{
      handler(newValue){
        this.$refs.svgAllElement.style.transform='translate('+-newValue.x+'px,'+newValue.y+'px)';
        this.mixCanvas.mixOffset(-newValue.x,newValue.y);
        this.mixCanvas.mixMove();
      },
      deep:true
    },
    doNeedMoveMap:{
      handler(newValue){
        this.mixCanvas.moving(newValue);//mixCanvas的moving和此值同步
        if(newValue)return false;
        this.initialMapData();
        this.mixCanvas.mixDraw();
      }
    },
    mixCanvasFlash:{
      handler(){
        this.initialMapData();
        this.mixCanvas.mixDraw();
      }
    },
    layer:{
      handler(){
        setTimeout(
          ()=>{
            this.initialMapData();
            this.mixCanvas.mixDraw();
          }
        ,0)
      }
    },
    mapHiddenElements:{
      handler(newValue){
        this.mixPipeLine.options.mapHiddenElements=newValue;
        this.mixCanvas.mixDraw();
      }
    },
    lastPickIng:{
      handler(newValue){
        let ID=parseInt(newValue.split(':')[0]);
        let addElement = this.MyPointData.find(item => item.id === ID);
        if(addElement===undefined){
          addElement = this.MyPolyLineData.find(item => item.id === ID);
        }
        if(addElement===undefined){
          addElement = this.MyAreaData.find(item => item.id === ID);
        }
        if(addElement===undefined){
          addElement = this.MyCurveData.find(item => item.id === ID);
        }
        if(addElement!==undefined){
          this.mixPipeLine.options.mapEjectElements.set(addElement.id,addElement);
          switch (addElement.type) {
            case 'point':{
              if(this.svgPointData.findIndex(item => item.id === addElement.id)===-1){
                this.svgPointData.push(JSON.parse(JSON.stringify(addElement)));

              }
              break;
            }
            case 'line':{
              if(this.svgLineData.findIndex(item => item.id === addElement.id)===-1) {
                this.svgLineData.push(JSON.parse(JSON.stringify(addElement)));
              }
              break;
            }
            case 'area':{
              if(this.svgAreaData.findIndex(item => item.id === addElement.id)===-1) {
                this.svgAreaData.push(JSON.parse(JSON.stringify(addElement)));
              }
              break;
            }
            case 'curve':{
              if(this.svgCurveData.findIndex(item => item.id === addElement.id)===-1) {
                this.svgCurveData.push(JSON.parse(JSON.stringify(addElement)));
              }
              break;
            }
          }
          this.mixCanvas.moveDrawJoin(addElement.id,false);
          this.mixCanvas.moveDrawOut(addElement.id,true);
          this.mixCanvas.mixDraw();
        }
      }
    },
    lastPickEnd:{
      handler(newValue){
        let ID=parseInt(newValue.split(':')[0]);
        if(this.selectElements.findIndex(item=>item.id===ID)!==-1){//存在其他人使用此要素时不移除svg
          return;
        }
        let remElement = this.MyPointData.find(item => item.id === ID);
        if(remElement===undefined){
          remElement = this.MyPolyLineData.find(item => item.id === ID);
        }
        if(remElement===undefined){
          remElement = this.MyAreaData.find(item => item.id === ID);
        }
        if(remElement===undefined){
          remElement = this.MyCurveData.find(item => item.id === ID);
        }
        if(remElement!==undefined){
          this.mixPipeLine.options.mapEjectElements.delete(remElement.id);
          switch (remElement.type) {
            case 'point':{
              this.svgPointData.removeByElementId(remElement.id);
              this.initialPointData();
              break;
            }
            case 'line':{
              this.svgLineData.removeByElementId(remElement.id);
             this.initialLineData();
              break;
            }
            case 'area':{
              this.svgAreaData.removeByElementId(remElement.id);
              this.initialAreaData();
              break;
            }
            case 'curve':{
              this.svgCurveData.removeByElementId(remElement.id);
              this.initialCurveData();
              break;
            }
          }
          this.mixCanvas.moveDrawOut(remElement.id,false);
          this.mixCanvas.moveDrawJoin(remElement.id,true);
          this.mixCanvas.moveDrawElement(remElement.id,remElement);
          this.mixCanvas.mixDraw();
        }
      }
    },
    lastSelectIng:{
      handler(newValue){
        let ID=parseInt(newValue.split(':')[0]);
        let addElement = this.MyPointData.find(item => item.id === ID);
        if(addElement===undefined){
          addElement = this.MyPolyLineData.find(item => item.id === ID);
        }
        if(addElement===undefined){
          addElement = this.MyAreaData.find(item => item.id === ID);
        }
        if(addElement===undefined){
          addElement = this.MyCurveData.find(item => item.id === ID);
        }
        if(addElement!==undefined){
          this.mixPipeLine.options.mapEjectElements.set(addElement.id,addElement);
          switch (addElement.type) {
            case 'point':{
              if(this.svgPointData.findIndex(item => item.id === addElement.id)===-1){
                this.svgPointData.push(JSON.parse(JSON.stringify(addElement)));
              }
              break;
            }
            case 'line':{
              if(this.svgLineData.findIndex(item => item.id === addElement.id)===-1) {
                this.svgLineData.push(JSON.parse(JSON.stringify(addElement)));
              }
              break;
            }
            case 'area':{
              if(this.svgAreaData.findIndex(item => item.id === addElement.id)===-1) {
                this.svgAreaData.push(JSON.parse(JSON.stringify(addElement)));
              }
              break;
            }
            case 'curve':{
              if(this.svgCurveData.findIndex(item => item.id === addElement.id)===-1) {
                this.svgCurveData.push(JSON.parse(JSON.stringify(addElement)));
              }
              break;
            }
          }
          this.mixCanvas.moveDrawJoin(addElement.id,false);
          this.mixCanvas.moveDrawOut(addElement.id,true);
          this.mixCanvas.mixDraw();
        }
      },
    },
    lastSelectEnd:{
      handler(newValue){
        let ID=parseInt(newValue.split(':')[0]);
        if(this.pickElements.findIndex(item=>item.id===ID)!==-1){//存在其他人使用此要素时不移除svg
          return;
        }
        let remElement = this.MyPointData.find(item => item.id === ID);
        if(remElement===undefined){
          remElement = this.MyPolyLineData.find(item => item.id === ID);
        }
        if(remElement===undefined){
          remElement = this.MyAreaData.find(item => item.id === ID);
        }
        if(remElement===undefined){
          remElement = this.MyCurveData.find(item => item.id === ID);
        }
        if(remElement!==undefined){
          this.mixPipeLine.options.mapEjectElements.delete(remElement.id);
          switch (remElement.type) {
            case 'point':{
              this.svgPointData.removeByElementId(remElement.id);
              this.initialPointData();
              break;
            }
            case 'line':{
              this.svgLineData.removeByElementId(remElement.id);
              this.initialLineData();
              break;
            }
            case 'area':{
              this.svgAreaData.removeByElementId(remElement.id);
              this.initialAreaData();
              break;
            }
            case 'curve':{
              this.svgCurveData.removeByElementId(remElement.id);
              this.initialCurveData();
              break;
            }
          }
          this.mixCanvas.moveDrawOut(remElement.id,false);
          this.mixCanvas.moveDrawJoin(remElement.id,true);
          this.mixCanvas.moveDrawElement(remElement.id,remElement);
          this.mixCanvas.mixDraw();
        }
      }
    },
    lastAddPoint:{
      handler(newValue){
        if(newValue!==null){
          this.mixCanvas.moveDrawJoin(newValue.id,true);
          this.mixCanvas.moveDrawElement(newValue.id,newValue);
        }
      }
    },
    lastAddLine:{
      handler(newValue){
        if(newValue!==null){
          this.mixCanvas.moveDrawJoin(newValue.id,true);
          this.mixCanvas.moveDrawElement(newValue.id,newValue);
        }
      }
    },
    lastAddArea:{
      handler(newValue){
        if(newValue!==null){
          this.mixCanvas.moveDrawJoin(newValue.id,true);
          this.mixCanvas.moveDrawElement(newValue.id,newValue);
        }
      }
    },
    lastAddCurve:{
      handler(newValue){
        if(newValue!==null){
          this.mixCanvas.moveDrawJoin(newValue.id,true);
          this.mixCanvas.moveDrawElement(newValue.id,newValue);
        }
      }
    },
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
