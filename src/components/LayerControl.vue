<template>
  <!--
  职责：
  1.允许用户向服务器添加地图数据、地图配置
  权限：
  允许访问、修改、删除$store.state.mapConfig、$store.state.serverData内的数据
  -->
  <!---->
  <div class="controlLayer" ref="controlLayer" style="pointer-events:auto" >
    <!--按钮-->
    <!--添加-->
    <banana-control-button ref="controlButton0" :color="Url0Color" :button-img-prop="Url0" :right-pos="'10px'" :top-pos="'100px'"></banana-control-button>
    <banana-control-button ref="controlButton1" :button-img-prop="Url1" :right-pos="'10px'" :top-pos="'180px'"></banana-control-button>
    <banana-control-button ref="controlButton2" :button-img-prop="Url2" :right-pos="'10px'" :top-pos="'260px'"></banana-control-button>
    <banana-control-button ref="controlButton3" :button-img-prop="Url3" :right-pos="'10px'" :top-pos="'340px'"></banana-control-button>
    <!--编辑属性面板-->
    <banana-point-attribute-board :style-top="theConfig.bordPosTop" :style-left="theConfig.bordPosLeft"></banana-point-attribute-board>
  </div>
</template>

<script>
import BananaControlButton from "./BananaControlButton";
import BananaPointAttributeBoard from "./BananaPointAttributeBoard";
import interestPoint from '../../static/interestPoint.png';//关注点
import constructionPoint from '../../static/constructionPoint.png';//施工点
import lineImg from '../../static/line.png';//线段类型
import regionImg from '../../static/region.png';
//区域类型
//#e72323 红色
//
export default {
  name: "LayerControl",
  components:{BananaControlButton, BananaPointAttributeBoard},
  data(){
    return {
      MY_NAME:"LayerControl",
      Url0:interestPoint,
      Url0Color:'#fffb3d',//#e72323&#e72323
      Url1:constructionPoint,
      Url2:lineImg,
      Url3:regionImg,
      isAddPoint:false,
      theConfig:{
        buttonA:false,
        buttonB:false,
        buttonC:false,
        buttonD:false,
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
        //属性面板的位置
        bordPosTop:0,
        bordPosLeft:-400,
        //观察者
        obServe:false
      }
    }
  },
  mounted() {
    this.startSetting();
    //setInterval(()=>{console.log(this.buttonA);console.log(this.theConfig.buttonsState[0])},100)
  },
  methods:{
    startSetting(){
      this.KeyListen();//开启键盘监听
      this.$refs.controlButton0.$el.addEventListener('click',()=>this.addInterestPointStart());//添加关注点添加事件
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
    },
    //添加点
    addPoint(){
      //1监听下一次的鼠标点击位置
      if(this.theConfig.obServe===false){
        this.theConfig.obServe=true;
        document.addEventListener("click",(ev)=>{
          if(this.theConfig.obServe===true){
            //判断target
            let tag=ev.target.nodeName;
            if(tag=="svg" || tag=="polyline" || tag=="circle"){
              //计算新增点位置
              let Pos=this.computeMouseActualPos(ev)
              this.theConfig.addPointPos.x=Pos.x;
              this.theConfig.addPointPos.y=Pos.y;
            }
          }
        })
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
          refPos.x=this.reTranslateCoordinate(mousePos.x)+this.$store.state.mapConfig.p0.point.x;
          refPos.y=-(this.reTranslateCoordinate(mousePos.y)-this.$store.state.mapConfig.p0.point.y);
          return refPos;
        }
        //缩小
        if(layer>0){
          //1.拿到鼠标与p0的屏幕显示距离px
          refPos.x=this.reTranslateCoordinate(mousePos.x)+this.$store.state.mapConfig.p0.point.x;
          refPos.y=-(this.reTranslateCoordinate(mousePos.y)-this.$store.state.mapConfig.p0.point.y);
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
          refPos.x=this.reTranslateCoordinate(mousePos.x)+this.$store.state.mapConfig.p0.point.x;
          refPos.y=-(this.reTranslateCoordinate(mousePos.y)-this.$store.state.mapConfig.p0.point.y);
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
    //更新临时SVG图层和临时点的数据
    updateTempData(newValue){
      this.$store.state.mapConfig.tempPoint.width=10;
      this.$store.state.mapConfig.tempPoint.point.x=newValue.x;
      this.$store.state.mapConfig.tempPoint.point.y=newValue.y;
    },
    //添加关注点
    addInterestPointStart(){
      if(!this.isAddPoint){
        this.isAddPoint=true;//更改添加点状态为“可用”
        this.Url0Color='#e72323';//更改背景色
        //更改按钮状态
        this.theConfig.buttonA=true;
      }else {
        this.isAddPoint=false;//更改添加点状态为“可用”
        this.Url0Color='#fffb3d';//更改背景色
        //更改按钮状态
        this.theConfig.buttonA=false;
      }

    },
    //禁用添加关注点
    addInterestPointDone(){
      this.isAddPoint=true;//更改添加点状态为“可用”
      this.Url0Color='#e72323';//更改背景色
    },
    //用于监听单个按键的
    KeyListen(){
      document.body.addEventListener('keyup',(e)=>{
        let KEY=e.key;
        switch (KEY){
          case 'F4':{
            this.F4Event();
          }
        }
      })
    },
    //F4的事件
    F4Event(){
      this.$root.sendInstruct('openF4DebugBord');
    }
  },
  computed:{
    buttonA(){
      return this.theConfig.buttonA;
    },
    addNewPos(){
      return this.theConfig.addPointPos;
    }
  },
  watch:{
    buttonA:{
      handler(newValue){
        if(newValue){
         this.addPoint();
        }else {
          this.addPointCancel();
        }
      }
    },
    addNewPos:{
      handler(newValue){
        //1更新临时数据
        this.updateTempData(newValue);
        //2调整属性面板位置
        this.theConfig.bordPosLeft=this.$store.state.mapConfig.mousePoint.x+10;
        this.theConfig.bordPosTop=this.$store.state.mapConfig.mousePoint.y+10;
        //
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
  /*background: red;*/
  /*display: flex;*/
  /*position: fixed;*/
  /*justify-content: center;*/
  /*left: calc((100% - (var(--panelWidth) + var(--panelLeft))) * var(--controlLeft));*/
  /*top: var(--controlTop);*/
  /*border-radius: var(--borderType02);*/
  /*box-shadow: var(--BottomShadowColor);*/
  /*background: var(--BottomBackgroundColor);*/
}
.tempSvg{
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
