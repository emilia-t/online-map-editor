<template>
  <!--
  职责：
  1.提供删除、添加地图数据的功能、提供打开控制台的功能
  权限：
  允许访问、修改、删除$store.state.mapConfig、$store.state.serverData内的数据
  -->
  <!---->
  <div class="controlLayer" ref="controlLayer" style="pointer-events:auto" >
    <!--按钮-->
    <!--添加-->
    <div class="controlButtonBox">
      <div @click="addInterestPointStart()" class="ButtonOut">
        <banana-control-button :color="Url1Color" :button-img-prop="Url1"></banana-control-button>
        <span class="controlButtonName">兴趣点</span>
      </div>
      <div @click="addRouteLineStart()" class="ButtonOut">
        <banana-control-button :color="Url2Color" :button-img-prop="Url2"></banana-control-button>
        <span class="controlButtonName">路径</span>
      </div>
      <div @click="addAreaStart()" class="ButtonOut">
        <banana-control-button :color="Url3Color" :button-img-prop="Url3"></banana-control-button>
        <span class="controlButtonName">区域</span>
      </div>
      <div @click="addCurveStart()" class="ButtonOut">
        <banana-control-button :color="Url4Color" :button-img-prop="Url4"></banana-control-button>
        <span class="controlButtonName">曲线</span>
      </div>
    </div>
    <!--元素右键编辑面板-->
    <banana-element-operation-board></banana-element-operation-board>
    <!--点编辑属性面板-->
    <banana-point-attribute-board :style-top="theConfig.bordPosTop" :style-left="theConfig.bordPosLeft"></banana-point-attribute-board>
    <!--线编辑属性面板-->
    <banana-line-attribute-board :style-top="theConfig.lineBoardTop" :style-left="theConfig.lineBoardLeft"></banana-line-attribute-board>
    <!--区域编辑属性面板-->
    <banana-area-attribute-board :style-top="theConfig.areaBoardTop" :style-left="theConfig.areaBoardLeft"></banana-area-attribute-board>
  </div>
</template>

<script>
import BananaElementOperationBoard from "./BananaElementOperationBoard";
import BananaControlButton from "./BananaControlButton";
import BananaAreaAttributeBoard from "./BananaAreaAttributeBoard";
import BananaPointAttributeBoard from "./BananaPointAttributeBoard";
import BananaLineAttributeBoard from "./BananaLineAttributeBoard";
import interestPoint from '../../static/point.png';//关注点
import lineImg from '../../static/route.png';//线段类型
import regionImg from '../../static/area.png';
import curveImg from '../../static/curve.png';
export default {
  name: "LayerControl",
  components:{BananaElementOperationBoard, BananaControlButton, BananaPointAttributeBoard,BananaLineAttributeBoard,BananaAreaAttributeBoard},
  data(){
    return {
      MY_NAME:"LayerControl",
      Url1:interestPoint,
      Url1Color:'#ffffff',
      Url2:lineImg,
      Url2Color:'#ffffff',
      Url3:regionImg,
      Url3Color:'#ffffff',
      Url4:curveImg,
      Url4Color:'#ffffff',
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
        //临时点数据
        tempPoint:{
          id:'tempPoint',
          type:'point',
          points:[{x:0,y:0}],
          point:{x:0,y:0},
          color:'#000000',
          width:0
        },
        //点属性面板的位置
        bordPosTop:0,
        bordPosLeft:-400,
        //线属性面板的位置
        lineBoardTop:0,
        lineBoardLeft:-400,
        //区域属性面板的位置
        areaBoardTop:0,
        areaBoardLeft:-400,
        //观察者
        obServe:false
      }
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.KeyListen();//开启键盘监听
    },
    //p0点位置移动1个单位
    moveP0(obj){
      this.$store.state.mapConfig.A1.x+=this.$store.state.cameraConfig.unit1X*obj.x;
      this.$store.state.mapConfig.A1.y+=this.$store.state.cameraConfig.unit1Y*obj.y;
    },
    addAreaStart(){
      if(!this.isAddArea){
        this.isAddArea=true;//更改添加状态为“可用”
        this.Url3Color='#d2d2d2';//更改背景色
        //更改按钮状态
        this.theConfig.buttonC=true;
        //修改svg鼠标悬浮样式
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='crosshair';
        }
        //更改其他按钮状态
        if(this.isAddPoint){
          this.addInterestPointStart();
        }
        //更改其他按钮状态
        if(this.isAddLine){
          this.addRouteLineStart();
        }
        //禁用更新指针
        this.$store.state.mapConfig.cursorLock=true;
        //通知预览启用
        this.$root.sendSwitchInstruct('previewLine',true);
      }else {
        this.isAddArea=false;//更改添加状态为“不可用”
        this.Url3Color='#ffffff';//更改背景色e72323
        //更改按钮状态
        this.theConfig.buttonC=false;
        //修改svg鼠标悬浮样式
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='default';
        }
        //通知预览停用
        this.$root.sendSwitchInstruct('previewLine',false);
      }
    },
    addArea(){
      //1监听下一次的鼠标点击位置
      if(this.theConfig.obServe===false){
        //允许更新，启用观察者
        this.theConfig.obServe=true;
        //避免重复添加监听，在第一次监听后即不再重复添加
        if(this.areaListener===false){
          document.addEventListener("click",(ev)=>{
            if(this.theConfig.obServe===true && this.isAddArea===true && this.addAreaClock===false && this.nodeSuppressor!==true){
              //判断target
              let tag=ev.target.nodeName;
              if(tag=="svg" || tag=="polyline" || tag=="circle"){
                //计算新增点位置
                let Pos=this.computeMouseActualPos(ev)
                this.theConfig.addAreaPos.push(Pos);
              }
            }
          });
          this.areaListener=true;
        }
      }
    },
    addAreaCancel(){
      //允许更新指针
      this.$store.state.mapConfig.cursor='default';
      this.$store.state.mapConfig.cursorLock=false;
      //1.重置临时线位置
      this.$store.state.mapConfig.tempArea.point.x=0;
      this.$store.state.mapConfig.tempArea.point.y=0;
      this.$store.state.mapConfig.tempArea.points=[];
      this.$store.state.mapConfig.tempArea.showPos=[];
      //2.观察者模式关闭
      this.theConfig.obServe=false;
      //3.重置属性面板位置
      this.theConfig.areaBoardLeft=-400;
      this.theConfig.areaBoardTop=0;
      //4.停用锁止
      this.addAreaClock=false;
      //清除点击位置缓存
      this.theConfig.addAreaPos=[];
    },
    addCurveStart(){

    },
    //添加路径线
    addRouteLineStart(){
      if(!this.isAddLine){
        this.isAddLine=true;//更改添加点状态为“可用”
        this.Url2Color='#d2d2d2';//更改背景色
        //更改按钮状态
        this.theConfig.buttonB=true;
        //修改svg鼠标悬浮样式
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='crosshair';
        }
        //更改其他按钮状态
        if(this.isAddPoint){
          this.addInterestPointStart();
        }
        //更改其他按钮状态
        if(this.isAddArea){
          this.addAreaStart();
        }
        //禁用更新指针
        this.$store.state.mapConfig.cursorLock=true;
        //通知预览启用
        this.$root.sendSwitchInstruct('previewLine',true);
      }else {
        this.isAddLine=false;//更改添加点状态为“不可用”
        this.Url2Color='#ffffff';//更改背景色e72323
        //更改按钮状态
        this.theConfig.buttonB=false;
        //修改svg鼠标悬浮样式
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='default';
        }
        //通知预览停用
        this.$root.sendSwitchInstruct('previewLine',false);
      }
    },
    //取消添加线
    addLineCancel(){
      //允许更新指针
      this.$store.state.mapConfig.cursor='default';
      this.$store.state.mapConfig.cursorLock=false;
      //1.重置临时线位置
      this.$store.state.mapConfig.tempLine.point.x=0;
      this.$store.state.mapConfig.tempLine.point.y=0;
      this.$store.state.mapConfig.tempLine.points=[];
      this.$store.state.mapConfig.tempLine.showPos=[];
      //2.观察者模式关闭
      this.theConfig.obServe=false;
      //3.重置属性面板位置
      this.theConfig.lineBoardLeft=-400;
      this.theConfig.lineBoardTop=0;
      //4.停用锁止
      this.addLineClock=false;
      //清除点击位置缓存
      this.theConfig.addLinePos=[];
    },
    //添加线
    addLine(){
      //1监听下一次的鼠标点击位置
      if(this.theConfig.obServe===false){
        //允许更新，启用观察者
        this.theConfig.obServe=true;
        //避免重复添加监听，在第一次监听后即不再重复添加
        if(this.lineListener===false){
          document.addEventListener("click",(ev)=>{
            if(this.theConfig.obServe===true && this.isAddLine===true && this.addLineClock===false && this.nodeSuppressor!==true){
              //判断target
              let tag=ev.target.nodeName;
              if(tag=="svg" || tag=="polyline" || tag=="circle"){
                //计算新增点位置
                let Pos=this.computeMouseActualPos(ev);
                this.theConfig.addLinePos.push(Pos);
              }
            }
          });
          this.lineListener=true;
        }
      }
    },
    //双击结束添加线段
    addAreaEnd(){
      //禁用点更新
      this.addAreaClock=true;
      //再双击的位置打开一个线段编辑面板
      //2调整属性面板位置
      this.theConfig.areaBoardLeft=this.$store.state.mapConfig.mousePoint.x+10;
      this.theConfig.areaBoardTop=this.$store.state.mapConfig.mousePoint.y+10;
      //结束通知
      this.$root.sendSwitchInstruct('previewLine',false);
    },
    //双击结束添加线段
    addLineEnd(){
      //禁用点更新
      this.addLineClock=true;
      //再双击的位置打开一个线段编辑面板
      //2调整属性面板位置
      this.theConfig.lineBoardLeft=this.$store.state.mapConfig.mousePoint.x+10;
      this.theConfig.lineBoardTop=this.$store.state.mapConfig.mousePoint.y+10;
      //结束通知
      this.$root.sendSwitchInstruct('previewLine',false);
    },
    //取消添加点
    addPointCancel(){
      //1.重置临时点位置
      this.$store.state.mapConfig.tempPoint.width=0;
      this.$store.state.mapConfig.tempPoint.point.x=0;
      this.$store.state.mapConfig.tempPoint.point.y=0;
      //2.观察者模式关闭
      this.theConfig.obServe=false;
      //3.重置属性面板位置
      this.theConfig.bordPosLeft=-400;
      this.theConfig.bordPosTop=0;
      //允许更新指针
      this.$store.state.mapConfig.cursor='default';
      this.$store.state.mapConfig.cursorLock=false;
    },
    //添加点
    addPoint(){
      //1监听下一次的鼠标点击位置
      if(this.theConfig.obServe===false){
        //启用观察者，保持更新
        this.theConfig.obServe=true;
        //避免重复添加监听
        if(this.pointListener===false){
          document.addEventListener("click",(ev)=>{
            if(this.theConfig.obServe===true && this.isAddPoint===true && this.nodeSuppressor!==true){
              //判断target
              let tag=ev.target.nodeName;
              if(tag=="svg" || tag=="polyline" || tag=="circle"){
                //计算新增点位置
                let Pos=this.computeMouseActualPos(ev)
                this.theConfig.addPointPos.x=Pos.x;
                this.theConfig.addPointPos.y=Pos.y;
              }
            }
          });
          this.pointListener=true;
        }
      }
    },
    //计算用户鼠标点与p0的位置距离并返回用户鼠标点击位置的真实坐标
    computeMouseActualPos(mouseEvent){
      try{
        //1.获取必要值 layer\mousePos\p0Pos
        let [layer,mousePos,p0Pos,refPos]=[null,{x:null,y:null},{x:null,y:null},{x:null,y:null}];
        layer=this.$store.state.mapConfig.layer;
        mousePos.x=mouseEvent.x;mousePos.y=mouseEvent.y;
        p0Pos.x=this.$store.state.mapConfig.p0.point.x;
        p0Pos.y=this.$store.state.mapConfig.p0.point.y;
        //2.开始计算
        //没有缩放
        if(layer===0){
          refPos.x=mousePos.x*this.unit1X+p0Pos.x+this.offsetX;//p0点加上鼠标的点击位置+精度补偿值
          refPos.y=p0Pos.y-mousePos.y*this.unit1Y+this.offsetY;
          //检测点击的位置是否符合单位1
          //console.log(refPos);
          return refPos;
        }
        //缩小
        if(layer>0){
          //1.拿到鼠标与p0的屏幕显示距离px
          refPos.x=(mousePos.x*this.unit1X)+p0Pos.x;//鼠标位置乘以单位1
          refPos.y=p0Pos.y-(mousePos.y*this.unit1Y);
          //2.转化
          for (let i=0;i<layer;i++){
            refPos.x=refPos.x+(refPos.x*this.$store.state.mapConfig.zoomAdd);
            refPos.y=refPos.y+(refPos.y*this.$store.state.mapConfig.zoomAdd);
          }
          //console.log(refPos);
          return refPos;
        }
        //放大
        if(layer<0){
          //1.拿到鼠标与p0的屏幕显示距离px
          refPos.x=mousePos.x*this.unit1X+p0Pos.x;
          refPos.y=p0Pos.y-mousePos.y*this.unit1X;
          //2.转化
          for(let i=0;i>layer;i--){
            refPos.x=refPos.x+(refPos.x*this.$store.state.mapConfig.zoomSub);
            refPos.y=refPos.y+(refPos.y*this.$store.state.mapConfig.zoomSub);
          }
          return refPos;
        }
      }catch (e) {
        return false;
      }
    },
    //添加关注点
    addInterestPointStart(){
      if(!this.isAddPoint){
        this.isAddPoint=true;//更改添加点状态为“可用”
        this.Url1Color='#d2d2d2';//更改背景色
        //更改按钮状态
        this.theConfig.buttonA=true;
        //修改svg鼠标悬浮样式
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='crosshair';
        }
        //禁用更新指针
        this.$store.state.mapConfig.cursorLock=true;
        //更改其他按钮状态
        if(this.isAddLine){
          this.addRouteLineStart();
        }
      }else {
        this.isAddPoint=false;//更改添加点状态为“不可用”
        this.Url1Color='#ffffff';//更改背景色e72323
        //更改按钮状态
        this.theConfig.buttonA=false;
        //修改svg鼠标悬浮样式
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='default';
        }
      }
    },
    //用于监听单个按键的
    KeyListen(){
      document.body.addEventListener('keyup',(e)=>{
        //在聚焦于输入框时拒绝操作
        if(this.$store.state.mapConfig.inputFocusStatus){
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
    //F8的事件
    F8Event(){
      this.$root.sendInstruct('openF4DebugBord');
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
    }
  },
  watch:{
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
        //1更新临时数据
        this.$store.state.mapConfig.tempPoint.width=this.$store.state.mapConfig.tempPoint.defaultWidth;
        this.$store.state.mapConfig.tempPoint.point.x=newValue.x;
        this.$store.state.mapConfig.tempPoint.point.y=newValue.y;
        //2调整属性面板位置
        this.theConfig.bordPosLeft=this.$store.state.mapConfig.mousePoint.x+10;
        this.theConfig.bordPosTop=this.$store.state.mapConfig.mousePoint.y+10;
      },
      deep:true
    },
    addNewLine:{
      handler(newValue){
        //在窗口大小更新时禁止更新
        if(this.$store.state.cameraConfig.windowChange===true){
          return false;
        }
        if(newValue.length!==0){
          //1更新临时线数据
          this.$store.state.mapConfig.tempLine.point.x=newValue[0].x;
          this.$store.state.mapConfig.tempLine.point.y=newValue[0].y;
          this.$store.state.mapConfig.tempLine.points.push(newValue[newValue.length-1]);
          //2.更新临时线显示位置
          this.$store.state.mapConfig.tempLine.showPos.push({x:this.$store.state.mapConfig.svgClick.x*this.unit1X,y:-this.$store.state.mapConfig.svgClick.y*this.unit1Y});
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
        //在窗口大小更新时禁止更新
        if(this.$store.state.cameraConfig.windowChange===true){
          return false;
        }
        //解决缩放问题，防抖
        if(newValue.length!==0){
          //1更新临时线数据
          this.$store.state.mapConfig.tempArea.point.x=newValue[0].x;
          this.$store.state.mapConfig.tempArea.point.y=newValue[0].y;
          this.$store.state.mapConfig.tempArea.points.push(newValue[newValue.length-1]);
          //2.更新临时线显示位置
          this.$store.state.mapConfig.tempArea.showPos.push({x:this.$store.state.mapConfig.svgClick.x*this.unit1X,y:-this.$store.state.mapConfig.svgClick.y*this.unit1Y});
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
      handler(newValue){
        //检测正则进行的操作
        if(this.isAddArea){
          this.addAreaEnd();
        }
        if(this.isAddLine){
          this.addLineEnd();
        }
      },
      deep:true
    }
  },
  destroyed(){
    //销毁连接及综合对象
    //this.$store.commit('destroyComprehensive');
    //console.log("layer control");
  }
}
</script>

<style scoped>

.controlLayer{
  width: auto;
  height: auto;
}
.ButtonOut{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.controlButtonBox{
  width: 70px;
  height: 325px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  z-index: 550;
  right: 0px;
  top:85px;
  background: rgb(252,252,252);
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  box-shadow:  #c5c5c5 0px 0px 6px;
}
.controlButtonName{
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 10px;
  color: rgba(42,42,42,0.8);
}
</style>
