<template>
  <div class="controlLayer" ref="controlLayer" style="pointer-events:auto" >
    <div class="controlButtonBox1"><!--添加按钮-->
      <div @click="pointButton()" @mousedown.stop="enablePoint?(isAddPoint?playSoundEffect('unconfirm_1'):playSoundEffect('confirm_1')):playSoundEffect('unable_1')" class="ButtonOut">
        <point :custom="'fill:'+Url1Color"/>
      </div>
      <div @click="lineButton()" @mousedown.stop="enableLine?(isAddLine?playSoundEffect('unconfirm_1'):playSoundEffect('confirm_1')):playSoundEffect('unable_1')" class="ButtonOut">
        <segment-line :custom="'fill:'+Url2Color"/>
      </div>
      <div @click="areaButton()" @mousedown.stop="enableArea?(isAddArea?playSoundEffect('unconfirm_1'):playSoundEffect('confirm_1')):playSoundEffect('unable_1')" class="ButtonOut">
        <region :custom="'fill:'+Url3Color"/>
      </div>
      <div @click="curveButton()" @mousedown.stop="enableCurve?(isAddCurve?playSoundEffect('unconfirm_1'):playSoundEffect('confirm_1')):playSoundEffect('unable_1')" class="ButtonOut">
        <segment-curve :custom="'fill:'+Url4Color"/>
      </div>
    </div>
    <div class="controlButtonBox2" ref="controlButtonBox2">
      <div class="ButtonOut" @click="showBaseLayerList()" @mousedown.stop="baseMapListView?playSoundEffect('unconfirm_1'):playSoundEffect('confirm_1')">
        <layer-switch :custom="'cursor:pointer'"/>
      </div>
      <div class="baseLayerList" v-if="baseMapListView">
        <div class="defaultUseLayer" @mousedown.stop="playSoundEffect('click_a')">
          <input type="radio"  id="defaultBaseMapOpt" name="baseMapGroup" :checked="baseMapSelectId===-1" @click="baseMapSelectId=-1"/>
          <label for="defaultBaseMapOpt" v-text="'默认底图'"/>
        </div>
        <div class="baseLayerSelect" v-for="map in baseMapList" :key="map.id" @mousedown.stop="playSoundEffect('click_a')">
          <input type="radio"  :id="'baseMapOpt'+map.id" name="baseMapGroup" :value="map.url" :checked="baseMapSelectId===map.id" @click="baseMapSelectId=map.id"/>
          <label :for="'baseMapOpt'+map.id" v-text="map.name"/>
        </div>
      </div>
    </div>
    <banana-element-operation-board/><!--元素右键编辑面板-->
    <banana-point-attribute-board :style-top="theConfig.bordPosTop" :style-left="theConfig.bordPosLeft"/><!--点编辑属性面板-->
    <banana-line-attribute-board :style-top="theConfig.lineBoardTop" :style-left="theConfig.lineBoardLeft"/><!--线编辑属性面板-->
    <banana-curve-attribute-board :style-top="theConfig.curveBoardTop" :style-left="theConfig.curveBoardLeft"/><!--线编辑属性面板-->
    <banana-area-attribute-board :style-top="theConfig.areaBoardTop" :style-left="theConfig.areaBoardLeft"/><!--区域编辑属性面板-->
    <banana-recorder-panel/>
  </div>
</template>

<script>
import BananaElementOperationBoard from "./BananaElementOperationBoard";
import BananaControlButton from "./BananaControlButton";
import BananaAreaAttributeBoard from "./BananaAreaAttributeBoard";
import BananaPointAttributeBoard from "./BananaPointAttributeBoard";
import BananaLineAttributeBoard from "./BananaLineAttributeBoard";
import BananaCurveAttributeBoard from "./BananaCurveAttributeBoard";
import BananaRecorderPanel from "./BananaRecorderPanel";
import Point from "./svgValidIcons/40X/point";
import SegmentLine from "./svgValidIcons/40X/segmentLine";
import Region from "./svgValidIcons/40X/region";
import SegmentCurve from './svgValidIcons/40X/segmentCurve';
import LayerSwitch from './svgValidIcons/40X/LayerSwitch';
export default {
  name: "LayerControl",
  components:{Point,SegmentLine,Region,SegmentCurve,BananaElementOperationBoard, BananaControlButton, BananaPointAttributeBoard,BananaRecorderPanel,BananaLineAttributeBoard,BananaCurveAttributeBoard,BananaAreaAttributeBoard,LayerSwitch},
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
      isAddCurve:false,
      isAddArea:false,
      addAreaClock:false,//false表示未锁止
      addLineClock:false,
      addCurveClock:false,
      areaListener:false,
      lineListener:false,
      curveListener:false,
      pointListener:false,
      baseMapListView:false,
      baseMapSelectId:-1,
      baseMapList:[
        {
          name:'高德地图', url:'http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8', id:0,
        },
        // {
        //   name:'百度地图', url:'http://maponline1.bdimg.com/tile/?qt=vtile&styles=pl&scaler=1&showtext=1', id:3,
        // },
        {
          name:'谷歌地图', url:'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn', id:6,
        },
        {
          name:'OpenStreetMap', url:'http://tile.openstreetmap.org', id:9,// /z/x/y
        },
        {
          name:'Carto Voyager', url:'http://b.basemaps.cartocdn.com/rastertiles/voyager', id:10,// /z/x/y
        },
        {
          name:'高德卫星影像', url:'http://webst04.is.autonavi.com/appmaptile?style=6', id:12,
        },
        {
          name:'Google Satellite', url:'http://khms1.google.com/kh/v=947?', id:15,
        },
        {
          name:'ArcGIS Satellite', url:'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile', id:18,// /z/x/y
        }
      ],
      theConfig:{
        buttonA:false,
        buttonB:false,
        buttonC:false,
        buttonD:false,
        addAreaPos:[],
        addLinePos:[],
        addCurvePos:[],
        addPointPos:{
          x:null,
          y:null
        },
        bordPosTop:0,//点属性面板的位置
        bordPosLeft:-400,
        lineBoardTop:0,//线属性面板的位置
        lineBoardLeft:-400,
        curveBoardTop:0,//曲线属性面板的位置
        curveBoardLeft:-400,
        areaBoardTop:0,//区域属性面板的位置
        areaBoardLeft:-400,
        obServe:false,//观察者
        lineAddNodeLastPos:{x:null,y:null},
        curveAddNodeLastPos:{x:null,y:null},
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
    playSoundEffect(name){
      this.$store.commit('setCoEffectsSound',name);
    },
    showBaseLayerList(){
      this.$refs.controlButtonBox2.classList.toggle('baseMapListShow');
      this.baseMapListView=!this.baseMapListView;
    },
    addAreaStart(){
      if(typeof this.useTpId!=='string'){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(this.useTpId==='none' || this.useTpId===''){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(!this.isAddArea){
        this.$store.commit('setCoMapDrawing',true);
        this.isAddArea=true;//更改添加状态为“可用”
        this.Url3Color='#82abfe';//更改背景色
        this.theConfig.buttonC=true;//更改按钮状态
        if(this.isAddPoint){//更改其他按钮状态
          this.addPointStart();
        }
        if(this.isAddLine){
          this.addLineStart();
        }
        if(this.isAddCurve){
          this.addCurveStart();
        }
        this.$store.commit('suppressPickSelect',true);
        this.$root.sendSwitchInstruct('previewLine',true);//通知预览启用
      }else {
        this.$store.commit('setCoMapDrawing',false);
        this.isAddArea=false;//更改添加状态为“不可用”
        this.Url3Color='#000000';//更改背景色e72323
        this.theConfig.buttonC=false;//更改按钮状态
        this.$store.commit('suppressPickSelect',false);
        this.$root.sendSwitchInstruct('previewLine',false);//通知预览停用
      }
    },
    addArea(){
      if(this.theConfig.obServe===false){
        if(this.areaListener===false){//避免重复
          document.addEventListener("click",(ev)=>{
            if(this.svgMouseDown.x!==ev.x || this.svgMouseDown.y!==ev.y){//移动过程中不添加
              return false;
            }
            if(this.theConfig.obServe===true && this.isAddArea===true && this.addAreaClock===false && this.nodeSuppressor!==true){
              let tag=ev.target.nodeName;//判断target
              if(tag==='svg' || tag==='polyline' || tag==='circle' || tag==='path' || tag==='polygon'){
                if(ev.target.classList[0]==='Icon40X'){return;}
                let Pos=this.computeMouseActualPos(ev);//计算新增点位置
                if(Pos.x===this.theConfig.areaAddNodeLastPos.x &&
                   Pos.y===this.theConfig.areaAddNodeLastPos.y){
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
        this.theConfig.obServe=true;
      }
    },
    addAreaCancel(){
      this.$store.state.mapConfig.cursor='default';//允许更新指针
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
    addLineStart(){//添加路径线
      if(typeof this.useTpId!=='string'){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(this.useTpId==='none' || this.useTpId===''){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(!this.isAddLine){
        this.$store.commit('setCoMapDrawing',true);
        this.isAddLine=true;//更改添加状态为“可用”
        this.Url2Color='#82abfe';//更改背景色
        this.theConfig.buttonB=true;//更改按钮状态
        if(this.isAddPoint){//更改其他按钮状态
          this.addPointStart();
        }
        if(this.isAddArea){
          this.addAreaStart();
        }
        if(this.isAddCurve){
          this.addCurveStart();
        }
        this.$store.commit('suppressPickSelect',true);
        this.$root.sendSwitchInstruct('previewLine',true);//通知预览启用
      }else {
        this.$store.commit('setCoMapDrawing',false);
        this.isAddLine=false;//更改添加点状态为“不可用”
        this.Url2Color='#000000';//更改背景色e72323
        this.theConfig.buttonB=false;//更改按钮状态
        this.$store.commit('suppressPickSelect',false);
        this.$root.sendSwitchInstruct('previewLine',false);//通知预览停用
      }
    },
    addLine(){//添加线
      if(this.theConfig.obServe===false){
        if(this.lineListener===false){//避免重复
          document.addEventListener("click",(ev)=>{
            if(this.svgMouseDown.x!==ev.x || this.svgMouseDown.y!==ev.y){//移动过程中不添加
              return false;
            }
            if(this.theConfig.obServe===true && this.isAddLine===true && this.addLineClock===false && this.nodeSuppressor!==true){
              let tag=ev.target.nodeName;//判断target
              if(tag==='svg' || tag==='polyline' || tag==='circle' || tag==='path' || tag==='polygon'){
                if(ev.target.classList[0]==='Icon40X'){return;}
                let Pos={x:null,y:null};
                if(this.adsorptionX!==null && this.adsorptionY!==null){
                  Pos.x=this.adsorptionX;//复用吸附的节点坐标
                  Pos.y=this.adsorptionY;
                }else{
                  Pos=this.computeMouseActualPos(ev);//计算新增点位置
                }
                if(Pos.x===this.theConfig.lineAddNodeLastPos.x &&
                  Pos.y===this.theConfig.lineAddNodeLastPos.y){//避免在同一个位置添加点
                  return false;
                }else{
                  this.theConfig.lineAddNodeLastPos=Pos;
                  this.theConfig.addLinePos.push(Pos);
                }
              }
            }
          });
          this.lineListener=true;
        }
        this.theConfig.obServe=true;
        this.$store.state.mapConfig.cursor='default';//允许更新指针
      }
    },
    addLineCancel(){//取消添加线
      this.$store.state.mapConfig.cursor='default';//允许更新指针
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
    curveButton(){
      if(this.enableCurve){
        this.addCurveStart();
      }else{
        this.$store.commit('setCoLogMessage',{text:'添加曲线已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
      }
    },
    areaButton(){//右侧“区域”按钮事件
      if(this.enableArea){
        this.addAreaStart();
      }else{
        this.$store.commit('setCoLogMessage',{text:'添加区域已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
      }
    },
    lineButton(){//右侧“线段”按钮事件
      if(this.enableLine){
        this.addLineStart();
      }else{
        this.$store.commit('setCoLogMessage',{text:'添加线段已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
      }
    },
    pointButton(){//右侧“点”按钮事件
      if(this.enablePoint){
        this.addPointStart();
      }else{
        this.$store.commit('setCoLogMessage',{text:'添加点已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
      }
    },
    addPointStart(){//添加关注点
      if(typeof this.useTpId!=='string'){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(this.useTpId==='none' || this.useTpId===''){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(!this.isAddPoint){
        this.$store.commit('setCoMapDrawing',true);
        this.$store.commit('suppressPickSelect',true);
        this.isAddPoint=true;//更改添加状态
        this.Url1Color='#82abfe';
        this.theConfig.buttonA=true;//更改按钮状态
        if(this.isAddLine){//更改其他按钮状态
          this.addLineStart();
        }
        if(this.isAddArea){
          this.addAreaStart();
        }
        if(this.isAddCurve){
          this.addCurveStart();
        }
      }else {
        this.$store.commit('setCoMapDrawing',false);
        this.$store.commit('suppressPickSelect',false);
        this.isAddPoint=false;//更改添加状态
        this.Url1Color='#000000';
        this.theConfig.buttonA=false;//更改按钮状态
      }
    },
    addPoint(){//添加点
      if(this.theConfig.obServe===false){//监听下一次的鼠标点击位置
        if(this.pointListener===false){//避免重复
          document.addEventListener("click",(ev)=>{
            if(this.svgMouseDown.x!==ev.x || this.svgMouseDown.y!==ev.y){//移动过程中不添加
              return false;
            }
            if(this.theConfig.obServe===true && this.isAddPoint===true && this.nodeSuppressor!==true){
              let tag=ev.target.nodeName;//判断target
              if(tag==='svg' || tag==='polyline' || tag==='circle' || tag==='path' || tag==='polygon'){
                if(ev.target.classList[0]==='Icon40X'){return;}
                let Pos=this.computeMouseActualPos(ev);//计算新增点位置
                this.theConfig.addPointPos.x=Pos.x;
                this.theConfig.addPointPos.y=Pos.y;
              }
            }
          });
          this.pointListener=true;
        }
        this.theConfig.obServe=true;
      }
    },
    addPointCancel(){//取消添加点
      this.$store.state.mapConfig.tempPoint.width=0;//重置临时点位置
      this.$store.state.mapConfig.tempPoint.point.x=0;
      this.$store.state.mapConfig.tempPoint.point.y=0;
      this.theConfig.obServe=false;//观察者模式关闭
      this.theConfig.bordPosLeft=-400;//重置属性面板位置
      this.theConfig.bordPosTop=0;
      this.$store.state.mapConfig.cursor='default';//允许更新指针
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
    addCurve(){//添加曲线
      if(this.theConfig.obServe===false){
        if(this.curveListener===false){//避免重复
          document.addEventListener("click",(ev)=>{
            if(this.svgMouseDown.x!==ev.x || this.svgMouseDown.y!==ev.y){//移动过程中不添加
              return false;
            }
            if(this.theConfig.obServe===true && this.isAddCurve===true && this.addCurveClock===false && this.nodeSuppressor!==true){
              let tag=ev.target.nodeName;//判断target
              if(tag==='svg' || tag==='polyline' || tag==='circle' || tag==='path' || tag==='polygon'){
                if(ev.target.classList[0]==='Icon40X'){return;}
                let Pos={x:null,y:null};
                if(this.adsorptionX!==null && this.adsorptionY!==null){
                  Pos.x=this.adsorptionX;//复用吸附的节点坐标
                  Pos.y=this.adsorptionY;
                }else{
                  Pos=this.computeMouseActualPos(ev);//计算新增点位置
                }
                if(Pos.x===this.theConfig.curveAddNodeLastPos.x &&
                  Pos.y===this.theConfig.curveAddNodeLastPos.y){//避免在同一个位置添加点
                  return false;
                }else{
                  this.theConfig.curveAddNodeLastPos=Pos;
                  this.theConfig.addCurvePos.push(Pos);
                }
              }
            }
          });
          this.curveListener=true;
        }
        this.theConfig.obServe=true;
        this.$store.state.mapConfig.cursor='default';//允许更新指针
      }
    },
    addCurveStart(){//添加曲线
      if(typeof this.useTpId!=='string'){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(this.useTpId==='none' || this.useTpId===''){
        this.$store.commit('setCoLogMessage',{text:'请先选择一个图层',from:'internal:LayerControl',type:'tip'});
        return false;
      }
      if(!this.isAddCurve){
        this.$store.commit('setCoMapDrawing',true);
        this.isAddCurve=true;//更改添加状态为“可用”
        this.Url4Color='#82abfe';//更改背景色
        this.theConfig.buttonD=true;//更改按钮状态
        if(this.isAddPoint){//更改其他按钮状态
          this.addPointStart();
        }
        if(this.isAddArea){
          this.addAreaStart();
        }
        if(this.isAddLine){
          this.addLineStart();
        }
        this.$store.commit('suppressPickSelect',true);
        this.$root.sendSwitchInstruct('previewLine',true);//通知预览启用
      }else {
        this.$store.commit('setCoMapDrawing',false);
        this.isAddCurve=false;//更改添加状态为“不可用”
        this.Url4Color='#000000';//更改背景色e72323
        this.theConfig.buttonD=false;//更改按钮状态
        this.$store.commit('suppressPickSelect',false);
        this.$root.sendSwitchInstruct('previewLine',false);//通知预览停用
      }
    },
    addCurveEnd(){//双击结束
      this.addCurveClock=true;//禁用点更新
      this.theConfig.curveBoardLeft=this.$store.state.mapConfig.mousePoint.x+10;//调整属性面板位置
      this.theConfig.curveBoardTop=this.$store.state.mapConfig.mousePoint.y+10;
      this.$root.sendSwitchInstruct('previewLine',false);//结束通知
    },
    addCurveCancel(){//取消添加
      this.$store.state.mapConfig.cursor='default';//允许更新指针
      this.$store.state.mapConfig.tempCurve.point.x=0;//1.重置临时线位置
      this.$store.state.mapConfig.tempCurve.point.y=0;
      this.$store.state.mapConfig.tempCurve.points=[];
      this.$store.state.mapConfig.tempCurve.showPos=[];
      this.theConfig.obServe=false;//2.观察者模式关闭
      this.theConfig.curveBoardLeft=-400;//3.重置属性面板位置
      this.theConfig.curveBoardTop=0;
      this.addCurveClock=false;//4.停用锁止
      this.theConfig.addCurvePos=[];//清除点击位置缓存
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
    KeyListen(){//监听按键
      document.body.addEventListener('keyup',(e)=>{
        if(this.$store.state.mapConfig.inputFocusStatus){//在聚焦模式下拒绝操作
          return false;
        }
        let KEY=e.key;
        switch (KEY){
          case 'F8':{
            e.preventDefault();
            this.F8Event();
            break;
          }
          case '1':{
            e.preventDefault();
            if(!this.enablePoint){
              this.$store.commit('setCoLogMessage',{text:'添加点已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
              break;
            }
            this.isAddPoint?this.playSoundEffect('unconfirm_1'):this.playSoundEffect('confirm_1');
            this.addPointStart();
            break;
          }
          case '2':{
            e.preventDefault();
            if(!this.enableLine){
              this.$store.commit('setCoLogMessage',{text:'添加线段已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
              break;
            }
            this.isAddLine?this.playSoundEffect('unconfirm_1'):this.playSoundEffect('confirm_1');
            this.addLineStart();
            break;
          }
          case '3':{
            e.preventDefault();
            if(!this.enableArea){
              this.$store.commit('setCoLogMessage',{text:'添加区域已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
              break;
            }
            this.isAddArea?this.playSoundEffect('unconfirm_1'):this.playSoundEffect('confirm_1');
            this.addAreaStart();
            break;
          }
          case '4':{
            e.preventDefault();
            if(!this.enableCurve){
              this.$store.commit('setCoLogMessage',{text:'添加曲线已被禁用，请选择其他图层',from:'internal:LayerControl',type:'tip'});
              break;
            }
            this.isAddCurve?this.playSoundEffect('unconfirm_1'):this.playSoundEffect('confirm_1');
            this.addCurveStart();
            break;
          }
          case ' ':{
            e.preventDefault();
            this.nodeSuppressor=false;
            break;
          }
          case 'Escape':{
            e.preventDefault();
            if(this.buttonA){
              this.playSoundEffect('unconfirm_1');
              this.addPointStart();
            }
            if(this.buttonB){
              this.playSoundEffect('unconfirm_1');
              this.addLineStart();
            }
            if(this.buttonC){
              this.playSoundEffect('unconfirm_1');
              this.addAreaStart();
            }
            if(this.buttonD){
              this.playSoundEffect('unconfirm_1');
              this.addCurveStart();
            }
            break;
          }
          case 'Delete':{
            e.preventDefault();
            if(this.$store.state.detailsPanelConfig.targetNode===null){
              if(this.$store.state.detailsPanelConfig.target!==-1){
                let id=this.$store.state.detailsPanelConfig.target;
                let tmpId=null;//template id
                try{tmpId=this.$store.state.detailsPanelConfig.data.custom.tmpId;}catch(e){}
                let recordObj=JSON.parse(JSON.stringify({
                  type:'delete',
                  class:this.$store.state.detailsPanelConfig.data.type,
                  id:id,
                  tmpId:tmpId
                }));
                this.$store.state.recorderConfig.initialIntent.push(recordObj);
                this.$store.state.serverData.socket.broadcastDeleteElement(id,tmpId);
              }
            }
            break;
          }
          case 'Enter':{
            e.preventDefault();
            if(this.isAddArea){
              this.addAreaEnd();
            }
            if(this.isAddLine){
              this.addLineEnd();
            }
            if(this.isAddCurve){
              this.addCurveEnd();
            }
            break;
          }
          case 'Alt':{
            e.preventDefault();
            if(this.adsorptionNode){
              this.$store.commit('setUnAdsorptionNode');//关闭自动节点吸附
              this.$store.commit('setCoLogMessage',{text:'已关闭自动吸附',from:'internal:LayerControl',type:'tip'});
            }else{
              this.$store.commit('setOpAdsorptionNode');//开启自动节点吸附
              this.$store.commit('setCoLogMessage',{text:'已启用自动吸附',from:'internal:LayerControl',type:'tip'});
            }
            break;
          }
        }
      });
      document.body.addEventListener('keydown',(e)=>{
        if(this.$store.state.mapConfig.inputFocusStatus){//在聚焦模式下拒绝操作
          return false;
        }
        let KEY=e.key;
        switch (KEY){
          case ' ':{
            e.preventDefault();
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
          this.$store.state.serverData.socket.broadcastDeleteElement(id,intent.tmpId);
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
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,intent.class);
                break;
              }
              case 'width':{
                let sendDataObj={
                  id:id,
                  updateId:intent.updateId,
                  changes:{width:intent.oldValue}
                };
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,intent.class);
                break;
              }
              case 'custom':{
                let sendDataObj={
                  id:id,
                  updateId:intent.updateId,
                  changes:{custom:intent.oldValue}
                };
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,intent.class);
                break;
              }
              case 'details':{
                let sendDataObj={
                  id:id,
                  updateId:intent.updateId,
                  changes:{details:intent.oldValue}
                };
                this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,intent.class);
                break;
              }
            }
          }
          break;
        }
        case 'updateNode':{
          let sendDataObj={
            id:id,
            updateId:intent.updateId,
            point:intent.oldValue.point,
            points:intent.oldValue.points,
            type:kind,
          };
          this.$store.state.serverData.socket.broadcastUpdateElementNode(sendDataObj);
          break;
        }
        case 'delete':{
          let tmpId=null;
          try{tmpId=intent.tmpId;}catch(e){}
          this.$store.state.serverData.socket.broadcastRestoreElement(id,tmpId);
          break;
        }
      }
    },
    F8Event(){
      this.$root.sendInstruct('openF4DebugBord');
    },
  },
  computed:{
    useTpId(){
      return  this.$store.state.templateConfig.useTpId;
    },
    adsorptionNode(){
      return this.$store.state.userSettingConfig.adsorptionNode;
    },
    defaultBaseMapUrl(){
      return this.$store.state.baseMapConfig.baseLayer;
    },
    templateId(){
      return this.$store.state.templateConfig.useTpId+this.$store.state.templateConfig.useTpName
    },
    enablePoint(){
      return this.$store.state.templateConfig.useTypeRule.point;
    },
    enableLine(){
      return this.$store.state.templateConfig.useTypeRule.line;
    },
    enableArea(){
      return this.$store.state.templateConfig.useTypeRule.area;
    },
    enableCurve(){
      return this.$store.state.templateConfig.useTypeRule.curve;
    },
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
    buttonD(){
      return this.theConfig.buttonD;
    },
    addNewArea(){//watch
      return this.theConfig.addAreaPos;
    },
    addNewPoint(){//watch
      return this.theConfig.addPointPos;
    },
    addNewLine(){//watch
      return this.theConfig.addLinePos;
    },
    addNewCurve(){//watch
      return this.theConfig.addCurvePos;
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
    addNewCurveEnd(){
      return this.$store.state.commits.addNewCurveEnd;
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
    svgMouseDown(){
      return this.$store.state.mapConfig.svgMouseDown;
    },
    adsorptionX(){
      return this.$store.state.mapConfig.adsorption.x;
    },
    adsorptionY(){
      return this.$store.state.mapConfig.adsorption.y;
    },
    adsorptionVX(){
      return this.$store.state.mapConfig.adsorption.vx;
    },
    adsorptionVY(){
      return this.$store.state.mapConfig.adsorption.vy;
    },
  },
  watch:{
    baseMapSelectId:{
      handler(value){
        if(value===-1){
          this.$store.state.baseMapConfig.baseMap.setBaseMapUrl(this.defaultBaseMapUrl);
        }else {
          for(let i=0;i<this.baseMapList.length;i++){
            if(this.baseMapList[i].id===value){
              this.$store.state.baseMapConfig.baseMap.setBaseMapUrl(this.baseMapList[i].url);
            }
          }
        }
      }
    },
    enablePoint:{
      handler(value){
        if(!value){
          if(this.buttonA){
            this.addPointStart();//取消正在进行的点添加
          }
          this.Url1Color='#919191';//灰度右侧按钮颜色
        }else {
          if(this.Url1Color==='#919191'){//如果右侧按钮是灰度则还原为黑色
            this.Url1Color='#000000';
          }
        }
      }
    },
    enableLine:{
      handler(value){
        if(!value){
          if(this.buttonB){
            this.addLineStart();
          }
          this.Url2Color='#919191';
        }else {
          if(this.Url2Color==='#919191'){
            this.Url2Color='#000000';
          }
        }
      }
    },
    enableArea:{
      handler(value){
        if(!value){
          if(this.buttonC){
            this.addAreaStart();
          }
          this.Url3Color='#919191';
        }else {
          if(this.Url3Color==='#919191'){
            this.Url3Color='#000000';
          }
        }
      }
    },
    enableCurve:{
      handler(value){
        if(!value){
          if(this.buttonD){
            this.addCurveStart();
          }
          this.Url4Color='#919191';
        }else {
          if(this.Url4Color==='#919191'){
            this.Url4Color='#000000';
          }
        }
      }
    },
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
        this.addPointStart();
      }
    },
    addNewLineEnd:{
      handler(){
        this.addLineStart();
      }
    },
    addNewCurveEnd:{
      handler(){
        this.addCurveStart();
      }
    },
    buttonD:{
      handler(newValue){
        if(newValue){
          setTimeout(
            ()=>{
              this.addCurve();
              this.$store.state.mapConfig.cursor='crosshair';
              this.$store.state.mapConfig.cursorLock=true;
            }
            ,0);
        }else {
          this.addCurveCancel();
          this.$store.state.mapConfig.cursor='default';
          this.$store.state.mapConfig.cursorLock=false;
        }
      }
    },
    buttonC:{
      handler(newValue){
        if(newValue){
          setTimeout(
            ()=>{
              this.addArea();
              this.$store.state.mapConfig.cursor='crosshair';
              this.$store.state.mapConfig.cursorLock=true;
            }
          ,0);
        }else {
          this.addAreaCancel();
          this.$store.state.mapConfig.cursor='default';
          this.$store.state.mapConfig.cursorLock=false;
        }
      }
    },
    buttonB:{
      handler(newValue){
        if(newValue){
          setTimeout(
            ()=>{
              this.addLine();
              this.$store.state.mapConfig.cursor='crosshair';
              this.$store.state.mapConfig.cursorLock=true;
            }
          ,0);
        }else {
          this.addLineCancel();
          this.$store.state.mapConfig.cursor='default';
          this.$store.state.mapConfig.cursorLock=false;
        }
      }
    },
    buttonA:{
      handler(newValue){
        if(newValue){
          setTimeout(
            ()=>{
              this.addPoint();
              this.$store.state.mapConfig.cursor='crosshair';
              this.$store.state.mapConfig.cursorLock=true;
            }
          ,0);
        }else {
          this.addPointCancel();
          this.$store.state.mapConfig.cursor='default';
          this.$store.state.mapConfig.cursorLock=false;
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
          if(this.adsorptionVX!==null && this.adsorptionVY!==null){
            this.$store.state.mapConfig.tempLine.showPos.push({x:this.adsorptionVX,y:-this.adsorptionVY});//2.更新临时线显示位置
          }else{
            this.$store.state.mapConfig.tempLine.showPos.push({x:this.$store.state.mapConfig.svgClick.x*this.unit1X,y:-this.$store.state.mapConfig.svgClick.y*this.unit1Y});//2.更新临时线显示位置
          }
        }else {
          this.$store.state.mapConfig.tempLine.point.x=0;
          this.$store.state.mapConfig.tempLine.point.y=0;
          this.$store.state.mapConfig.tempLine.points=[];
          this.$store.state.mapConfig.tempLine.showPos=[];
        }
      },
      deep:true
    },
    addNewCurve:{
      handler(newValue){
        if(this.$store.state.cameraConfig.windowChange===true){//在窗口大小更新时禁止更新
          return false;
        }
        if(newValue.length!==0){
          this.$store.state.mapConfig.tempCurve.point.x=newValue[0].x;//1更新临时线数据
          this.$store.state.mapConfig.tempCurve.point.y=newValue[0].y;
          this.$store.state.mapConfig.tempCurve.points.push(newValue[newValue.length-1]);

          if(this.adsorptionVX!==null && this.adsorptionVY!==null){
            this.$store.state.mapConfig.tempCurve.showPos.push({x:this.adsorptionVX,y:-this.adsorptionVY});//2.更新临时线显示位置
          }else{
            this.$store.state.mapConfig.tempCurve.showPos.push({x:this.$store.state.mapConfig.svgClick.x*this.unit1X, y:-this.$store.state.mapConfig.svgClick.y*this.unit1Y});//2.更新临时线显示位置
          }
        }else {
          this.$store.state.mapConfig.tempCurve.point.x=0;
          this.$store.state.mapConfig.tempCurve.point.y=0;
          this.$store.state.mapConfig.tempCurve.points=[];
          this.$store.state.mapConfig.tempCurve.showPos=[];
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
        if(this.isAddCurve){
          this.addCurveEnd();
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
.controlButtonBox1{
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
.controlButtonBox2{
  width: 60px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  z-index: 550;
  right: 10px;
  top:310px;
  background: white;
  border-radius: 6px;
  box-shadow:  #c5c5c5 0px 0px 6px;
}
.baseMapListShow{
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  z-index: 550;
  right: 10px;
  top:310px;
  background: white;
  border-radius: 6px;
  box-shadow:  #c5c5c5 0px 0px 6px;
}
.baseLayerSelect{
  width: auto;
  height: 30px;
  margin: 0px 8px;
  font-size: 14.5px;
  font-weight: 400;
}
.defaultUseLayer{
  user-select: none;
  width: auto;
  height: 30px;
  margin: 0px 8px;
  font-size: 14.5px;
  font-weight: 400;
}
</style>
