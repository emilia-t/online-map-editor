<template>
  <g :elementId="this.myId" @mousedown="shiftStart($event)" @mouseup="shiftEnd($event)" ref="svgElement">
    <g @mouseenter="mouseover=true" @mouseleave="mouseover=false" @contextmenu="rightClickOperation($event)" @click="showDetails()" v-if="this.pointConfig.custom.icon===null">
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="22px" stroke="#ffffff" stroke-width="2" style="pointer-events:fill;fill-opacity:0.8;fill:none" v-show="selectId===myId || mouseover"/>
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="22px" :stroke="pickStroke" stroke-width="2" style="pointer-events:fill;fill-opacity:0.8;fill:none" v-show="selectConfig.id===myId || pickConfig.id===myId"/>
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="1px" stroke="#ffffff70" stroke-width="45" style="pointer-events:fill;fill-opacity:0.8;fill:none" v-show="selectId===myId || mouseover || selectConfig.id===myId || pickConfig.id===myId"/>
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" :r="pointConfig.width+'px'" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:'+'#'+pointConfig.color"/>
      <text :x="dynamicPointsX" :y="dynamicPointsY-13" v-show="selectConfig.id===myId || pickConfig.id===myId" :style="pickFill" class="svgPointSelectText" v-text="svgText"></text>
    </g>
    <g @mouseenter="mouseover=true" @mouseleave="mouseover=false" @contextmenu="rightClickOperation($event)" @click="showDetails()" v-if="this.pointConfig.custom.icon!==null">
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="22px" stroke="#ffffff" stroke-width="2" style="pointer-events:fill;fill-opacity:0.8;fill:none" v-show="selectId===myId || mouseover"/>
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="22px" :stroke="pickStroke" stroke-width="2" style="pointer-events:fill;fill-opacity:0.8;fill:none" v-show="selectConfig.id===myId || pickConfig.id===myId"/>
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="1px" stroke="#ffffff70" stroke-width="45" style="pointer-events:fill;fill-opacity:0.8;fill:none" v-show="selectId===myId || mouseover"/>
      <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="13px" :fill="this.pointConfig.custom.color"/>
      <image :x="dynamicPointsX-13" :y="dynamicPointsY-13"  width="26px" height="26px" :href="'../../static/icons/'+this.pointConfig.custom.icon"></image>
      <text :x="dynamicPointsX" :y="dynamicPointsY-13" v-show="selectConfig.id===myId || pickConfig.id===myId" :style="pickFill" class="svgPointSelectText" v-text="svgText"></text>
    </g>
  </g>
</template>

<script>
export default {
  name: "svgPoint",
  data(){
    return {
      dataSourcePoint:{},//源点
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0},
      myId:null,
      selectId:-1,//被选中的id
      shiftStatus:false,//挪动的状态，当元素被选中后再次左键按下则状态为true，表示可挪动节点，默认为false
      shiftStartPoint:{x:null,y:null},
      shiftStartMouse:{x:null,y:null},
      shiftEndMouse:{x:null,y:null},
      mouseover:false,
      rightLock:false,
      leftLock:false,
    }
  },
  props:{
    "pointConfig":{
      type:Object,
      default: function (){
        return {
          id:'p0000',
          type:'point',
          points:[{x:0,y:0}],
          point:{x:0,y:0},
          color:'#ec3232',
          width:2
        }
      },
      required:true
    },
    "selectConfig":{
      type:Object,
      default:function (){
        return {}
      }
    },
    "pickConfig":{
      type:Object,
      default:function (){
        return {}
      }
    },
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){//初始化配置
      this.myId=this.pointConfig.id;//拷贝
      this.dataSourcePoint=JSON.parse(JSON.stringify(this.pointConfig.point));
      this.mouseEvent();//监听鼠标移动
      this.initializePosition();//初始化
      this.A1Cache.x=this.A1.x;//初始化A1cache
      this.A1Cache.y=this.A1.y;
    },
    shiftStart(ev){//挪动节点
      this.shiftStartMouse.x=ev.x;
      this.shiftStartMouse.y=ev.y;
      if(this.selectId!==this.myId){return false;}
      if(ev.button!==0){return false;}
      Object.assign(this.shiftStartPoint,this.pointConfig.point);//保存当前元素坐标位置
      this.shiftStatus=true;//使挪动状态变更为true
    },
    shiftEnd(ev){//鼠标在svg中、松开左键、固定节点位置
      if(ev.button!==0){return false;}
      this.shiftEndMouse.x=ev.x;//保存当前鼠标点击位置
      this.shiftEndMouse.y=ev.y;
      this.shiftStatus=false;
    },
    showDetails(){//展示自身details
      if(this.shiftStartMouse.x!==this.shiftEndMouse.x || this.shiftStartMouse.y!==this.shiftEndMouse.y){
        return false;
      }
      if(this.leftLock){
        if(this.pickConfig.user!==this.$store.state.serverData.socket.userData.user_name){
          this.$root.general_script.alert_tips(this.pickConfig.user+'正在更新坐标，请稍等');
        }
        return false;
      }
      setTimeout(()=>{
        this.$store.state.detailsPanelConfig.data=this.pointConfig;
        this.$store.state.detailsPanelConfig.sourcePoint=this.dataSourcePoint;
        this.$store.state.detailsPanelConfig.target=this.myId;//广播被选中id（myId）
      },0);//异步
    },
    mouseEvent(){//监听鼠标移动
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;
      })
    },
    initializePosition(){//初始化定位
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        let viewPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.dataSourcePoint.y,this.dataSourcePoint.x);
        this.pointConfig.point.x=viewPosition.x;
        this.pointConfig.point.y=-viewPosition.y;
      }
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        try{
          let [layer,pointPos,p0Pos,refPos,tempPos]=[null,{x:null,y:null},{x:null,y:null},{x:null,y:null},{x:null,y:null}];
          layer=this.$store.state.mapConfig.layer;
          pointPos.x=this.pointConfig.point.x;pointPos.y=this.pointConfig.point.y;
          p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
          p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
          if(layer===0){
            refPos.x=pointPos.x+p0Pos.x;
            refPos.y=pointPos.y+p0Pos.y;
            this.pointConfig.point.x=refPos.x;
            this.pointConfig.point.y=refPos.y;
          }
          if(layer>0){
            for (let i=0;i<layer;i++){
              pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomSub);
              pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomSub);
            }
            refPos.x=pointPos.x+p0Pos.x;
            refPos.y=pointPos.y+p0Pos.y;
            this.pointConfig.point.x=refPos.x;
            this.pointConfig.point.y=refPos.y;
            return true;
          }
          if(layer<0){
            for(let i=0;i>layer;i--){
              pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomAdd);
              pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomAdd);
            }
            refPos.x=pointPos.x+p0Pos.x;
            refPos.y=pointPos.y+p0Pos.y;
            this.pointConfig.point.x=refPos.x;
            this.pointConfig.point.y=refPos.y;
            return true;
          }
          return true;
        }catch (e) {
          return false;
        }
      }
    },
    move(){//移动
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
          let A1mvX=this.A1Cache.x-this.A1.x;
          let A1mvY=this.A1Cache.y-this.A1.y;
          let newArr=this.pointConfig.point;
          this.pointConfig.point.x=newArr.x+(A1mvX*this.unit1X);
          this.pointConfig.point.y=newArr.y+(A1mvY*this.unit1Y);
          this.A1Cache.x=this.A1.x;
          this.A1Cache.y=this.A1.y;
          this.occurredMoveMap=false;
        }
      }
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.initializePosition();
      }
      return true;
    },
    scale(){//缩放
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        let layer=this.layer;
        let oldLayer=this.oldLayer;
        let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
        let pointPos={};
        pointPos=JSON.parse(JSON.stringify(this.pointConfig.point));
        const MOX=this.mouse.x;
        const MOY=this.mouse.y;
        const TRX=pointPos.x/this.unit1X;
        const TRY=-pointPos.y/this.unit1Y;
        const axSize=MOX-TRX;
        const aySize=MOY-TRY;
        this.pointConfig.point.x=(TRX-((zoom*axSize)))*this.unit1X;
        this.pointConfig.point.y=-(TRY-((zoom*aySize)))*this.unit1Y;
      }
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        this.initializePosition();
      }
    },
    rightClickOperation(mouseEvent){
      if(this.rightLock){
        if(this.selectConfig.user!==this.$store.state.serverData.socket.userData.user_name){
          this.$root.general_script.alert_tips(this.selectConfig.user+'正在编辑属性，请稍等');
        }
        return false;
      }
      mouseEvent.preventDefault();
      this.$store.state.elementOperationBoardConfig.display=true;//对右侧悬浮条的位置和显示状态操作
      this.$store.state.elementOperationBoardConfig.posX=mouseEvent.x;
      this.$store.state.elementOperationBoardConfig.posY=mouseEvent.y;
      this.$store.state.mapConfig.operated.id=this.myId;//设置operated
      this.$store.state.mapConfig.operated.data=this.pointConfig;
      return mouseEvent;
    }
  },
  computed:{
    pickFill(){
      if(this.pickConfig.user!==undefined){
        return{
          fill:'#'+this.pickConfig.color
        }
      }else if(this.selectConfig.user!==undefined){
        return{
          fill:'#'+this.selectConfig.color
        }
      }else {
        return{
          fill:'#ff5e5e'
        }
      }
    },
    pickStroke(){
      if(this.pickConfig.user!==undefined){
        return '#'+this.pickConfig.color;
      }else if(this.selectConfig.user!==undefined){
        return '#'+this.selectConfig.color;
      }else {
        return '#ff5e5e';
      }
    },
    svgText(){
      if(this.selectConfig.user===undefined || this.pickConfig.user===undefined){
        if(this.selectConfig.user===undefined){
          return this.pickConfig.user;
        }
        return this.selectConfig.user;
      }else {
        return `${this.pickConfig.user}、${this.selectConfig.user}`
      }
    },
    browserX(){
      return this.$store.state.mapConfig.browser.width;
    },
    browserY(){
      return this.$store.state.mapConfig.browser.height;
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
    svgMouseUp(){
      return this.$store.state.mapConfig.svgMouseUp;
    },
    dynamicPointsX(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvX=this.A1Cache.x-this.A1.x;
        return (this.pointConfig.point.x/this.unit1X) + A1mvX;//先转化为单位量，再相减
      }else {
        return this.pointConfig.point.x/this.unit1X;//等于自生的坐标除以单位1
      }
    },
    dynamicPointsY(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvY=this.A1Cache.y-this.A1.y;
        return -((this.pointConfig.point.y/this.unit1Y) + A1mvY);
      }else {
        return -this.pointConfig.point.y/this.unit1Y;
      }
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    p0(){
      return this.$store.state.mapConfig.p0.point;
    },
    A1(){
      return this.$store.state.mapConfig.A1;
    },
    layer(){
      return this.$store.state.mapConfig.layer;
    },
    oldLayer(){
      return this.$store.state.mapConfig.oldLayer;
    },
    mouse(){
      return {x:this.$store.state.mapConfig.mousePoint.x,y:this.$store.state.mapConfig.mousePoint.y};
    },
    targetId(){
      return this.$store.state.detailsPanelConfig.target;
    },
    reinitializeSourcePoint(){
      return this.$store.state.serverData.socket.reinitializeSourcePoint;
    },
    reinitializeElement(){
      return this.$store.state.serverData.socket.reinitializeElement;
    },
    reinitializeId(){
      return this.$store.state.serverData.socket.reinitializeId;
    }
  },
  watch:{
    // browserX:{//仅限于canvas不支持动态视图才开启
    //   handler(newValue,oldValue){
    //     let offset=(newValue-oldValue)/2;
    //     this.pointConfig.point.x+=offset*this.unit1X;
    //   },
    //   deep:true
    // },
    // browserY:{
    //   handler(newValue,oldValue){
    //     let offset=(oldValue-newValue)/2;
    //     this.pointConfig.point.y+=offset*this.unit1Y;
    //   },
    //   deep:true
    // },
    pickConfig:{
      handler(newValue){
        let lock=newValue.id;
        this.leftLock = lock !== undefined;
      }
    },
    selectConfig:{
      handler(newValue){
        let lock=newValue.id;
        this.rightLock = lock !== undefined;
      }
    },
    reinitializeElement:{
      handler(newValue){
        if(newValue!==0){
          if(this.reinitializeId===this.myId){
            this.dataSourcePoint=JSON.parse(JSON.stringify(this.reinitializeSourcePoint));//更新源
            this.initializePosition();
          }
        }
      }
    },
    shiftStatus:{
      handler(newValue){
        if(newValue){
          this.$root.sendSwitchInstruct('disableZoomAndMove',true);//发送指令-允许缩放、移动视图
        }else {
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);
        }
      }
    },
    mouse:{
      handler(newValue){
        if(this.shiftStatus===true){
        if(this.myId===this.selectId){
          this.pointConfig.point.x=newValue.x;//移动自身的视图(跟随鼠标)
          this.pointConfig.point.y=-newValue.y;
        }
        }
      }
    },
    layer:{
      handler(){
        this.scale();
      }
    },
    doNeedMoveMap:{
      handler(){
        this.move();
      }
    },
    targetId:{
      handler(newValue){
        this.selectId=newValue;
      }
    },
    svgMouseUp:{
      handler(newValue){
        this.shiftStatus=false;
        if(this.shiftStartPoint.x!==null && this.shiftStartPoint.y!==null){//检查是否于源点有区别
          if(this.shiftStartPoint.x!==this.pointConfig.point.x || this.shiftStartPoint.y!==this.pointConfig.point.y){
            if(this.targetId===this.myId){
              let newPos=this.$root.computeMouseActualPos(newValue);//1.计算新的位置
              let uObj={
                id:null,
                point:null,
                points:[]
              };
              uObj.id=this.myId;
              uObj.point=newPos;
              uObj.points.push(newPos);
              uObj.type='point';
              this.$store.state.serverData.socket.broadcastUpdateElementNode(uObj);
              if(this.$refs.svgElement.classList.contains('graduallyEmergingFirst')){
                this.$refs.svgElement.classList.remove('graduallyEmergingFirst');
                this.$refs.svgElement.classList.add('graduallyEmergingAfter');
              }else {
                this.$refs.svgElement.classList.remove('graduallyEmergingAfter');
                this.$refs.svgElement.classList.add('graduallyEmergingFirst');
              }
              this.shiftStartPoint.x=null;//处理完毕后清空
              this.shiftStartPoint.y=null;
            }
          }
        }
      },
      deep:true
    }
  }
}
</script>
