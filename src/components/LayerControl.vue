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
        <span class="controlButtonName">路径线</span>
      </div>
      <div @click="addAreaStart()" class="ButtonOut">
        <banana-control-button :color="Url3Color" :button-img-prop="Url3"></banana-control-button>
        <span class="controlButtonName">区域面</span>
      </div>
    </div>
    <!--元素右键编辑面板-->
    <banana-element-operation-board></banana-element-operation-board>
    <!--点编辑属性面板-->
    <banana-point-attribute-board :style-top="theConfig.bordPosTop" :style-left="theConfig.bordPosLeft"></banana-point-attribute-board>
    <!--线编辑属性面板-->
    <banana-line-attribute-board :style-top="theConfig.lineBoardTop" :style-left="theConfig.lineBoardLeft"></banana-line-attribute-board>
  </div>
</template>

<script>
import BananaElementOperationBoard from "./BananaElementOperationBoard";
import BananaControlButton from "./BananaControlButton";
import BananaPointAttributeBoard from "./BananaPointAttributeBoard";
import BananaLineAttributeBoard from "./BananaLineAttributeBoard";
import interestPoint from '../../static/point.png';//关注点
import lineImg from '../../static/route.png';//线段类型
import regionImg from '../../static/area.png';
export default {
  name: "LayerControl",
  components:{BananaElementOperationBoard, BananaControlButton, BananaPointAttributeBoard,BananaLineAttributeBoard},
  data(){
    return {
      MY_NAME:"LayerControl",
      Url1:interestPoint,
      Url1Color:'#ffffff',
      Url2:lineImg,
      Url2Color:'#ffffff',
      Url3:regionImg,
      Url3Color:'#ffffff',
      isAddPoint:false,
      isAddLine:false,
      addLineClock:false,//false表示未锁止
      lineListener:false,
      pointListener:false,
      theConfig:{
        buttonA:false,
        buttonB:false,
        buttonC:false,
        buttonD:false,
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
    addAreaStart(){},
    //添加线段的流程：
    //1.点击右侧控制面板中间的路径线按钮------
    //2.鼠标点击地图上的任意一个点(A)---这个点击一定是click
    //2.1再地图SVG上生成一个虚拟的(临时的)灰点，直径为5px，计算该点的位置
    //3.鼠标移动到除了A以外的任何一个SVG位置（期间允许移动和缩放地图）

    //补充：鼠标再确认下一个点的位置时鼠标与上一个点之间需要有一条随鼠标而移动的连接线A->Mouse

    //3.2鼠标点击SVG上的一个地方----这个点击一定是click
    //3.3再地图SVG上生成另一个虚拟的灰点，直接为5px，并计算该点的位置(B)
    //4.鼠标双击svg结束绘制，保存前面的所有点位置，并展开一个线段属性编辑面板
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
        //禁用更新指针
        this.$store.state.mapConfig.cursorLock=true;
      }else {
        this.isAddLine=false;//更改添加点状态为“可用”
        this.Url2Color='#ffffff';//更改背景色e72323
        //更改按钮状态
        this.theConfig.buttonB=false;
        //修改svg鼠标悬浮样式
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='default';
        }
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
    //添加点
    addLine(){
      //1监听下一次的鼠标点击位置
      if(this.theConfig.obServe===false){
        //允许更新，启用观察者
        this.theConfig.obServe=true;
        //避免重复添加监听，在第一次监听后即不再重复添加
        if(this.lineListener===false){
          document.addEventListener("click",(ev)=>{
            if(this.theConfig.obServe===true && this.isAddLine===true && this.addLineClock===false){
              //判断target
              let tag=ev.target.nodeName;
              if(tag=="svg" || tag=="polyline" || tag=="circle"){
                //计算新增点位置
                let Pos=this.computeMouseActualPos(ev)
                this.theConfig.addLinePos.push(Pos);
              }
            }
          });
          this.lineListener=true;
        }
      }
    },
    //双击结束添加线段
    addLineEnd(){
      //禁用点更新
      this.addLineClock=true;
      //再双击的位置打开一个线段编辑面板
      //2调整属性面板位置
      this.theConfig.lineBoardLeft=this.$store.state.mapConfig.mousePoint.x+10;
      this.theConfig.lineBoardTop=this.$store.state.mapConfig.mousePoint.y+10;
    },
    //转化坐标
    translateCoordinate(float){
      return float*10000000;
    },
    //逆向转化坐标
    reTranslateCoordinate(float){
      return float/10000000;
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
            if(this.theConfig.obServe===true && this.isAddPoint===true){
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
          refPos.x=this.reTranslateCoordinate(mousePos.x)+p0Pos.x;
          refPos.y=p0Pos.y-this.reTranslateCoordinate(mousePos.y);
          return refPos;
        }
        //缩小
        if(layer>0){
          //1.拿到鼠标与p0的屏幕显示距离px
          refPos.x=this.reTranslateCoordinate(mousePos.x)+p0Pos.x;
          refPos.y=p0Pos.y-this.reTranslateCoordinate(mousePos.y);
          //2.转化
          for (let i=0;i<layer;i++){
            refPos.x=refPos.x+(refPos.x*this.$store.state.mapConfig.zoomAdd);
            refPos.y=refPos.y+(refPos.y*this.$store.state.mapConfig.zoomAdd);
          }
          return refPos;
        }
        //放大
        if(layer<0){
          //1.拿到鼠标与p0的屏幕显示距离px
          refPos.x=this.reTranslateCoordinate(mousePos.x)+p0Pos.x;
          refPos.y=p0Pos.y-this.reTranslateCoordinate(mousePos.y);
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
        this.isAddPoint=false;//更改添加点状态为“可用”
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
        }
      })
    },
    //F8的事件
    F8Event(){
      this.$root.sendInstruct('openF4DebugBord');
    }
  },
  computed:{
    buttonA(){
      return this.theConfig.buttonA;
    },
    buttonB(){
      return this.theConfig.buttonB;
    },
    addNewPoint(){
      return this.theConfig.addPointPos;
    },
    addNewLine(){
      return this.theConfig.addLinePos;
    },
    svgDbClick(){
      return this.$store.state.mapConfig.svgDbClick;
    }
  },
  watch:{
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
        if(newValue.length!==0){
          //1更新临时线数据
          this.$store.state.mapConfig.tempLine.point.x=newValue[0].x;
          this.$store.state.mapConfig.tempLine.point.y=newValue[0].y;
          this.$store.state.mapConfig.tempLine.points.push(newValue[newValue.length-1]);
          //2.更新临时线显示位置
          this.$store.state.mapConfig.tempLine.showPos.push({x:this.reTranslateCoordinate(this.$store.state.mapConfig.svgClick.x),y:-this.reTranslateCoordinate(this.$store.state.mapConfig.svgClick.y)});
        }else {
          this.$store.state.mapConfig.tempLine.point.x=0;
          this.$store.state.mapConfig.tempLine.point.y=0;
          this.$store.state.mapConfig.tempLine.points=[];
          this.$store.state.mapConfig.tempLine.showPos=[];
        }
      },
      deep:true
    },
    svgDbClick:{
      handler(newValue){
        //检测正则进行的操作
        if(this.isAddPoint){

        }
        if(this.isAddLine){
          this.addLineEnd();
        }
      },
      deep:true
    }
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
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  right: 0px;
  top:100px;
  background: rgba(250,250,250,0.85);
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
