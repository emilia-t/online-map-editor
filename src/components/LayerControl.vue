<template>
  <div class="controlLayer" ref="controlLayer" style="pointer-events:auto" >
    <div class="controlButtonBox"><!--添加按钮-->
      <div @click="addInterestPointStart()" class="ButtonOut">
        <point :custom="'fill:'+Url1Color"></point>
      </div>
      <div @click="addRouteLineStart()" class="ButtonOut">
        <segment-line :custom="'fill:'+Url2Color"></segment-line>
      </div>
      <div @click="addAreaStart()" class="ButtonOut">
        <region :custom="'fill:'+Url3Color"></region>
      </div>
      <div @click="addCurveStart()" class="ButtonOut">
        <segment-curve :custom="'fill:'+Url4Color"></segment-curve>
      </div>
    </div>
    <banana-element-operation-board></banana-element-operation-board><!--元素右键编辑面板-->
    <banana-point-attribute-board :style-top="theConfig.bordPosTop" :style-left="theConfig.bordPosLeft"></banana-point-attribute-board><!--点编辑属性面板-->
    <banana-line-attribute-board :style-top="theConfig.lineBoardTop" :style-left="theConfig.lineBoardLeft"></banana-line-attribute-board><!--线编辑属性面板-->
    <banana-area-attribute-board :style-top="theConfig.areaBoardTop" :style-left="theConfig.areaBoardLeft"></banana-area-attribute-board><!--区域编辑属性面板-->
    <banana-recorder-panel></banana-recorder-panel>
  </div>
</template>

<script>
import BananaElementOperationBoard from "./BananaElementOperationBoard";
import BananaControlButton from "./BananaControlButton";
import BananaAreaAttributeBoard from "./BananaAreaAttributeBoard";
import BananaPointAttributeBoard from "./BananaPointAttributeBoard";
import BananaLineAttributeBoard from "./BananaLineAttributeBoard";
import BananaRecorderPanel from "./BananaRecorderPanel";
import Point from "./svgValidIcons/40X/point";
import SegmentLine from "./svgValidIcons/40X/segmentLine";
import Region from "./svgValidIcons/40X/region";
import SegmentCurve from './svgValidIcons/40X/segmentCurve';
export default {
  name: "LayerControl",
  components:{Point,SegmentLine,Region,SegmentCurve,BananaElementOperationBoard, BananaControlButton, BananaPointAttributeBoard,BananaRecorderPanel,BananaLineAttributeBoard,BananaAreaAttributeBoard},
  data(){
    return {
      MY_NAME:"LayerControl",
      Url1Color:'#000000',
      Url2Color:'#000000',
      Url3Color:'#000000',
      Url4Color:'#000000',
      nodeSuppressor:false,//节点抑制器，此项为true则会抑制节点更新，会对添加点、线段、面造成影响
      isAddPoint:false,
      isAddLine:false,
      isAddArea:false,
      addAreaClock:false,
      addLineClock:false,//false表示未锁止
      areaListener:false,
      lineListener:false,
      pointListener:false,
      theConfig:{
        buttonA:false,
        buttonB:false,
        buttonC:false,
        buttonD:false,
        addAreaPos:[],
        addLinePos:[],
        addPointPos:{
          x:null,
          y:null
        },
        bordPosTop:0,//点属性面板的位置
        bordPosLeft:-400,
        lineBoardTop:0,//线属性面板的位置
        lineBoardLeft:-400,
        areaBoardTop:0,//区域属性面板的位置
        areaBoardLeft:-400,
        obServe:false,//观察者
        lineAddNodeLastPos:{x:null,y:null},
        areaAddNodeLastPos:{x:null,y:null},
      },
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.KeyListen();//开启键盘监听
      this.MultiKeyListen();
    },
    addAreaStart(){
      if(!this.isAddArea){
        this.isAddArea=true;//更改添加状态为“可用”
        this.Url3Color='#82abfe';//更改背景色
        this.theConfig.buttonC=true;//更改按钮状态
        if(this.$store.state.mapConfig.cursorLock===false){//修改svg鼠标悬浮样式
          this.$store.state.mapConfig.cursor='crosshair';
        }
        if(this.isAddPoint){//更改其他按钮状态
          this.addInterestPointStart();
        }
        if(this.isAddLine){//更改其他按钮状态
          this.addRouteLineStart();
        }
        this.$store.state.mapConfig.cursorLock=true;//禁用更新指针
        this.$store.commit('suppressPickSelect',true);
        this.$root.sendSwitchInstruct('previewLine',true);//通知预览启用
      }else {
        this.isAddArea=false;//更改添加状态为“不可用”
        this.Url3Color='#000000';//更改背景色e72323
        this.theConfig.buttonC=false;//更改按钮状态
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='default';
        }
        this.$store.commit('suppressPickSelect',false);
        this.$root.sendSwitchInstruct('previewLine',false);//通知预览停用
      }
    },
    addArea(){
      if(this.theConfig.obServe===false){
        this.theConfig.obServe=true;//启用观察者
        if(this.areaListener===false){//避免重复
          document.addEventListener("click",(ev)=>{
            if(this.theConfig.obServe===true && this.isAddArea===true && this.addAreaClock===false && this.nodeSuppressor!==true){
              let tag=ev.target.nodeName;//判断target
              if(tag==='svg' || tag==='polyline' || tag==='circle' || tag==='path' || tag==='polygon'){
                let Pos=this.computeMouseActualPos(ev)//计算新增点位置
                if(Pos.x===this.theConfig.areaAddNodeLastPos.x && Pos.y===this.theConfig.areaAddNodeLastPos.y){
                  return false;
                }else{
                  this.theConfig.areaAddNodeLastPos=Pos;
                  this.theConfig.addAreaPos.push(Pos);
                }
              }
            }
          });
          this.areaListener=true;
        }
      }
    },
    addAreaCancel(){
      this.$store.state.mapConfig.cursor='default';//允许更新指针
      this.$store.state.mapConfig.cursorLock=false;
      this.$store.state.mapConfig.tempArea.point.x=0;//重置临时线位置
      this.$store.state.mapConfig.tempArea.point.y=0;
      this.$store.state.mapConfig.tempArea.points=[];
      this.$store.state.mapConfig.tempArea.showPos=[];
      this.theConfig.obServe=false;//观察者模式关闭
      this.theConfig.areaBoardLeft=-400;//重置属性面板位置
      this.theConfig.areaBoardTop=0;
      this.addAreaClock=false;//停用锁止
      this.theConfig.addAreaPos=[];//清除点击位置缓存
    },
    addCurveStart(){

    },
    addRouteLineStart(){//添加路径线
      if(!this.isAddLine){
        this.isAddLine=true;//更改添加点状态为“可用”
        this.Url2Color='#82abfe';//更改背景色
        this.theConfig.buttonB=true;//更改按钮状态
        if(this.$store.state.mapConfig.cursorLock===false){//修改svg鼠标悬浮样式
          this.$store.state.mapConfig.cursor='crosshair';
        }
        if(this.isAddPoint){//更改其他按钮状态
          this.addInterestPointStart();
        }
        if(this.isAddArea){
          this.addAreaStart();
        }
        this.$store.state.mapConfig.cursorLock=true;//禁用更新指针
        this.$store.commit('suppressPickSelect',true);
        this.$root.sendSwitchInstruct('previewLine',true);//通知预览启用
      }else {
        this.isAddLine=false;//更改添加点状态为“不可用”
        this.Url2Color='#000000';//更改背景色e72323
        this.theConfig.buttonB=false;//更改按钮状态
        if(this.$store.state.mapConfig.cursorLock===false){//修改svg鼠标悬浮样式
          this.$store.state.mapConfig.cursor='default';
        }
        this.$store.commit('suppressPickSelect',false);
        this.$root.sendSwitchInstruct('previewLine',false);//通知预览停用
      }
    },
    addLineCancel(){//取消添加线
      this.$store.state.mapConfig.cursor='default';//允许更新指针
      this.$store.state.mapConfig.cursorLock=false;
      this.$store.state.mapConfig.tempLine.point.x=0;//1.重置临时线位置
      this.$store.state.mapConfig.tempLine.point.y=0;
      this.$store.state.mapConfig.tempLine.points=[];
      this.$store.state.mapConfig.tempLine.showPos=[];
      this.theConfig.obServe=false;//2.观察者模式关闭
      this.theConfig.lineBoardLeft=-400;//3.重置属性面板位置
      this.theConfig.lineBoardTop=0;
      this.addLineClock=false;//4.停用锁止
      this.theConfig.addLinePos=[];//清除点击位置缓存
    },
    addLine(){//添加线
      if(this.theConfig.obServe===false){
        this.theConfig.obServe=true;//启用观察者
        if(this.lineListener===false){//避免重复
          document.addEventListener("click",(ev)=>{
            if(this.theConfig.obServe===true && this.isAddLine===true && this.addLineClock===false && this.nodeSuppressor!==true){
              let tag=ev.target.nodeName;//判断target
              if(tag==='svg' || tag==='polyline' || tag==='circle' || tag==='path' || tag==='polygon'){
                let Pos=this.computeMouseActualPos(ev);//计算新增点位置
                if(Pos.x===this.theConfig.lineAddNodeLastPos.x && Pos.y===this.theConfig.lineAddNodeLastPos.y){
                  return false;
                }else {
                  this.theConfig.lineAddNodeLastPos=Pos;
                  this.theConfig.addLinePos.push(Pos);
                }
              }
            }
          });
          this.lineListener=true;
        }
      }
    },
    addAreaEnd(){//双击结束添加区域
      this.addAreaClock=true;//禁用点更新
      this.theConfig.areaBoardLeft=this.$store.state.mapConfig.mousePoint.x+10;//调整属性面板位置
      this.theConfig.areaBoardTop=this.$store.state.mapConfig.mousePoint.y+10;
      this.$root.sendSwitchInstruct('previewLine',false);//结束通知
    },
    addLineEnd(){//双击结束添加线段
      this.addLineClock=true;//禁用点更新
      this.theConfig.lineBoardLeft=this.$store.state.mapConfig.mousePoint.x+10;//调整属性面板位置
      this.theConfig.lineBoardTop=this.$store.state.mapConfig.mousePoint.y+10;
      this.$root.sendSwitchInstruct('previewLine',false);//结束通知
    },
    addPointCancel(){//取消添加点
      this.$store.state.mapConfig.tempPoint.width=0;//重置临时点位置
      this.$store.state.mapConfig.tempPoint.point.x=0;
      this.$store.state.mapConfig.tempPoint.point.y=0;
      this.theConfig.obServe=false;//观察者模式关闭
      this.theConfig.bordPosLeft=-400;//重置属性面板位置
      this.theConfig.bordPosTop=0;
      this.$store.state.mapConfig.cursor='default';//允许更新指针
      this.$store.state.mapConfig.cursorLock=false;
    },
    addPoint(){//添加点
      if(this.theConfig.obServe===false){//监听下一次的鼠标点击位置
        this.theConfig.obServe=true;//启用观察者
        if(this.pointListener===false){//避免重复
          document.addEventListener("click",(ev)=>{
            if(this.theConfig.obServe===true && this.isAddPoint===true && this.nodeSuppressor!==true){
              let tag=ev.target.nodeName;//判断target
              if(tag==='svg' || tag==='polyline' || tag==='circle' || tag==='path' || tag==='polygon'){
                let Pos=this.computeMouseActualPos(ev)//计算新增点位置
                this.theConfig.addPointPos.x=Pos.x;
                this.theConfig.addPointPos.y=Pos.y;
              }
            }
          });
          this.pointListener=true;
        }
      }
    },
    computeMouseActualPos(mouseEvent){//计算鼠标点与p0的位置距离并返回鼠标点击位置的坐标
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        let latLng=this.$store.state.baseMapConfig.baseMap.viewPositionToLatLng(mouseEvent.x,mouseEvent.y);
        return {x:latLng.lng,y:latLng.lat};
      }
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){//虚拟
        try{
          let [layer,mousePos,p0Pos,refPos]=[null,{x:null,y:null},{x:null,y:null},{x:null,y:null}];//获取必要值
          layer=this.$store.state.mapConfig.layer;
          mousePos.x=mouseEvent.x;mousePos.y=mouseEvent.y;
          p0Pos.x=this.$store.state.mapConfig.p0.point.x;
          p0Pos.y=this.$store.state.mapConfig.p0.point.y;
          if(layer===0){//没有缩放
            refPos.x=mousePos.x*this.unit1X+p0Pos.x+this.offsetX;//p0点加上鼠标的点击位置+精度补偿值
            refPos.y=p0Pos.y-mousePos.y*this.unit1Y+this.offsetY;
            return refPos;
          }
          if(layer>0){//缩小
            refPos.x=(mousePos.x*this.unit1X)+p0Pos.x;//获取鼠标与p0的屏幕显示距离px
            refPos.y=p0Pos.y-(mousePos.y*this.unit1Y);
            for (let i=0;i<layer;i++){//转化
              refPos.x=refPos.x+(refPos.x*this.$store.state.mapConfig.zoomAdd);
              refPos.y=refPos.y+(refPos.y*this.$store.state.mapConfig.zoomAdd);
            }
            return refPos;
          }
          if(layer<0){//放大
            refPos.x=mousePos.x*this.unit1X+p0Pos.x;//获取鼠标与p0的屏幕显示距离px
            refPos.y=p0Pos.y-mousePos.y*this.unit1X;
            for(let i=0;i>layer;i--){//转化
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
    addInterestPointStart(){//添加关注点
      if(!this.isAddPoint){
        this.isAddPoint=true;//更改添加点状态
        this.Url1Color='#82abfe';
        this.theConfig.buttonA=true;//更改按钮状态
        if(this.$store.state.mapConfig.cursorLock===false){//修改svg鼠标悬浮样式
          this.$store.state.mapConfig.cursor='crosshair';
        }
        this.$store.state.mapConfig.cursorLock=true;//禁用更新指针
        this.$store.commit('suppressPickSelect',true);
        if(this.isAddLine){//更改其他按钮状态
          this.addRouteLineStart();
        }
        if(this.isAddArea){
          this.addAreaStart();
        }
      }else {
        this.$store.commit('suppressPickSelect',false);
        this.isAddPoint=false;//更改添加点状态
        this.Url1Color='#000000';
        this.theConfig.buttonA=false;//更改按钮状态
        if(this.$store.state.mapConfig.cursorLock===false){//修改svg鼠标悬浮样式
          this.$store.state.mapConfig.cursor='default';
        }
      }
    },
    KeyListen(){//监听按键
      document.body.addEventListener('keyup',(e)=>{
        if(this.$store.state.mapConfig.inputFocusStatus){//在聚焦模式下拒绝操作
          return false;
        }
        let KEY=e.key;
        switch (KEY){
          case 'F8':{
            this.F8Event();
            break;
          }
          case '1':{
            this.addInterestPointStart();
            break;
          }
          case '2':{
            this.addRouteLineStart();
            break;
          }
          case '3':{
            this.addAreaStart();
            break;
          }
          case ' ':{
            this.nodeSuppressor=false;
            break;
          }
          case 'Escape':{
            if(this.buttonA){
              this.addInterestPointStart();
            }
            if(this.buttonB){
              this.addRouteLineStart();
            }
            if(this.buttonC){
              this.addAreaStart();
            }
            break;
          }
          case 'Delete':{
            if(this.$store.state.detailsPanelConfig.targetNode===null){
              if(this.$store.state.detailsPanelConfig.target!==-1){
                let id=this.$store.state.detailsPanelConfig.target;
                let recordObj=JSON.parse(JSON.stringify({
                  type:'delete',
                  class:this.$store.state.detailsPanelConfig.data.type,
                  id:id,
                }));
                this.$store.state.recorderConfig.initialIntent.push(recordObj);
                this.$store.state.serverData.socket.broadcastDeleteElement(id);
              }
            }
            break;
          }
          case 'Enter':{
            if(this.isAddArea){
              this.addAreaEnd();
            }
            if(this.isAddLine){
              this.addLineEnd();
            }
            break;
          }
        }
      });
      document.body.addEventListener('keydown',(e)=>{
        let KEY=e.key;
        switch (KEY){
          case ' ':{
            this.nodeSuppressor=true;
          }
        }
      });
    },
    MultiKeyListen(){
      document.addEventListener('keydown', (event)=> {
        if(this.$store.state.mapConfig.inputFocusStatus){//在聚焦模式下拒绝操作
          return false;
        }
        let secondly=event.key;
        if(event.ctrlKey){
          switch (secondly) {
            case 'z':{
              if(this.$store.state.mapConfig.tempLine.points.length!==0){
                this.$store.state.mapConfig.tempLine.points.pop();
                this.$store.state.mapConfig.tempLine.showPos.pop();
                return true;
              }
              if(this.$store.state.mapConfig.tempArea.points.length!==0){
                this.$store.state.mapConfig.tempArea.points.pop();
                this.$store.state.mapConfig.tempArea.showPos.pop();
                return true;
              }
              if(this.$store.state.recorderConfig.reachIntent.length!==0){
                this.restoreOldIntent(this.$store.state.recorderConfig.reachIntent.shift());
              }
              break;
            }
          }
        }
      });
    },
    restoreOldIntent(intent){
      let id=intent.id;
      let type=intent.type;
      let kind=intent.class;
      switch (type){
        case 'upload':{
          this.$store.commit('setCoLogMessage',{text:'已撤回上传，但无法保证成功',from:'internal:LayerControl',type:'tip'});
          this.$store.state.serverData.socket.broadcastDeleteElement(id);
          break;
        }
        case 'updateElement':{
          for(let i=0;i<intent.changes.length;i++){
            let change=intent.changes[i];
            switch (change){
              case 'color':{
                let sendDataObj={
                  id:id,
                  updateId:intent.updateId,
                  changes:{color:intent.oldValue}
                };
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj);
                break;
              }
              case 'width':{
                let sendDataObj={
                  id:id,
                  updateId:intent.updateId,
                  changes:{width:intent.oldValue}
                };
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj);
                break;
              }
              case 'custom':{
                let sendDataObj={
                  id:id,
                  updateId:intent.updateId,
                  changes:{custom:intent.oldValue}
                };
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj);
                break;
              }
              case 'details':{
                let sendDataObj={
                  id:id,
                  updateId:intent.updateId,
                  changes:{details:intent.oldValue}
                };
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj);
                break;
              }
            }
          }
          break;
        }
        case 'updateNode':{
          let sendDataObj={
            id:id,
            point:intent.oldValue.point,
            points:intent.oldValue.points,
            type:kind,
          };
          this.$store.state.serverData.socket.broadcastUpdateElementNode(sendDataObj);
          break;
        }
        case 'delete':{
          this.$store.state.serverData.socket.broadcastRestoreElement(id);
          break;
        }
      }
    },
    F8Event(){
      this.$root.sendInstruct('openF4DebugBord');
    },
  },
  computed:{
    zoomIng(){
      return this.$store.state.cameraConfig.zoomIng;
    },
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
    buttonA(){
      return this.theConfig.buttonA;
    },
    buttonB(){
      return this.theConfig.buttonB;
    },
    buttonC(){
      return this.theConfig.buttonC;
    },
    addNewArea(){
      return this.theConfig.addAreaPos;
    },
    addNewPoint(){
      return this.theConfig.addPointPos;
    },
    addNewLine(){
      return this.theConfig.addLinePos;
    },
    svgDbClick(){
      return this.$store.state.mapConfig.svgDbClick;
    },
    addNewPointEnd(){
      return this.$store.state.commits.addNewPointEnd;
    },
    addNewLineEnd(){
      return this.$store.state.commits.addNewLineEnd;
    },
    addNewAreaEnd(){
      return this.$store.state.commits.addNewAreaEnd;
    },
    rightTarget(){
      return this.$store.state.mapConfig.operated.id;
    },
    leftTarget(){
      return this.$store.state.detailsPanelConfig.target;
    },
  },
  watch:{
    zoomIng:{
      handler(newValue){
        if(newValue){
          this.$root.sendSwitchInstruct('disableMove',true);
          setTimeout(()=>{
            this.$root.sendSwitchInstruct('disableMove',false);
          },this.$store.state.cameraConfig.wheelInterval);
        }
      }
    },
    addNewAreaEnd:{
      handler(){
        this.addAreaStart();
      }
    },
    addNewPointEnd:{
      handler(){
        this.addInterestPointStart();
      }
    },
    addNewLineEnd:{
      handler(){
        this.addRouteLineStart();
      }
    },
    buttonC:{
      handler(newValue){
        if(newValue){
          this.addArea();
        }else {
          this.addAreaCancel();
        }
      }
    },
    buttonB:{
      handler(newValue){
        if(newValue){
          this.addLine();
        }else {
          this.addLineCancel();
        }
      }
    },
    buttonA:{
      handler(newValue){
        if(newValue){
         this.addPoint();
        }else {
          this.addPointCancel();
        }
      }
    },
    addNewPoint:{
      handler(newValue){
        this.$store.state.mapConfig.tempPoint.width=this.$store.state.mapConfig.tempPoint.defaultWidth;//1更新临时数据
        this.$store.state.mapConfig.tempPoint.point.x=newValue.x;
        this.$store.state.mapConfig.tempPoint.point.y=newValue.y;
        this.theConfig.bordPosLeft=this.$store.state.mapConfig.mousePoint.x+10;//2调整属性面板位置
        this.theConfig.bordPosTop=this.$store.state.mapConfig.mousePoint.y+10;
      },
      deep:true
    },
    addNewLine:{
      handler(newValue){
        if(this.$store.state.cameraConfig.windowChange===true){//在窗口大小更新时禁止更新
          return false;
        }
        if(newValue.length!==0){
          this.$store.state.mapConfig.tempLine.point.x=newValue[0].x;//1更新临时线数据
          this.$store.state.mapConfig.tempLine.point.y=newValue[0].y;
          this.$store.state.mapConfig.tempLine.points.push(newValue[newValue.length-1]);
          this.$store.state.mapConfig.tempLine.showPos.push({x:this.$store.state.mapConfig.svgClick.x*this.unit1X,y:-this.$store.state.mapConfig.svgClick.y*this.unit1Y});//2.更新临时线显示位置
        }else {
          this.$store.state.mapConfig.tempLine.point.x=0;
          this.$store.state.mapConfig.tempLine.point.y=0;
          this.$store.state.mapConfig.tempLine.points=[];
          this.$store.state.mapConfig.tempLine.showPos=[];
        }
      },
      deep:true
    },
    addNewArea:{
      handler(newValue){
        if(this.$store.state.cameraConfig.windowChange===true){//在窗口大小更新时禁止更新
          return false;
        }
        if(newValue.length!==0){
          this.$store.state.mapConfig.tempArea.point.x=newValue[0].x;//1更新临时线数据
          this.$store.state.mapConfig.tempArea.point.y=newValue[0].y;
          this.$store.state.mapConfig.tempArea.points.push(newValue[newValue.length-1]);
          this.$store.state.mapConfig.tempArea.showPos.push({x:this.$store.state.mapConfig.svgClick.x*this.unit1X,y:-this.$store.state.mapConfig.svgClick.y*this.unit1Y});//2.更新临时线显示位置
        }else {
          this.$store.state.mapConfig.tempArea.point.x=0;
          this.$store.state.mapConfig.tempArea.point.y=0;
          this.$store.state.mapConfig.tempArea.points=[];
          this.$store.state.mapConfig.tempArea.showPos=[];
        }
      },
      deep:true
    },
    svgDbClick:{
      handler(){
        if(this.isAddArea){//检测正则进行的操作
          this.addAreaEnd();
        }
        if(this.isAddLine){
          this.addLineEnd();
        }
      },
      deep:true
    },
    rightTarget:{
      handler(newValue,oldValue){
        if(newValue!==-1){
          if(oldValue!==null && oldValue!==-1){
            this.$store.state.serverData.socket.broadcastSelectEndElement(oldValue);
          }
          this.$store.state.serverData.socket.broadcastSelectIngElement(newValue);
        }else {
          if(oldValue!==null && oldValue!==-1) {
            this.$store.state.serverData.socket.broadcastSelectEndElement(oldValue);
          }
        }
      }
    },
    leftTarget:{
      handler(newValue,oldValue){
        if(newValue!==-1){
          if(oldValue!==null && oldValue!==-1){
            this.$store.state.serverData.socket.broadcastPickEndElement(oldValue);
          }
          this.$store.state.serverData.socket.broadcastPickIngElement(newValue);
        }else {
          if(oldValue!==null && oldValue!==-1) {
            this.$store.state.serverData.socket.broadcastPickEndElement(oldValue);
          }
        }
      }
    },
  },
  destroyed(){

  }
}
</script>

<style scoped>

.controlLayer{
  width: auto;
  height: auto;
}
.ButtonOut{
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.controlButtonBox{
  width: 60px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  z-index: 550;
  right: 10px;
  top:80px;
  background: white;
  border-radius: 6px;
  box-shadow:  #c5c5c5 0px 0px 6px;
}
</style>
