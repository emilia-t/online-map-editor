<template>
  <g :elementId="polyLineConfig.id" style="pointer-events: all">
    <g v-for="(str,index) in dynamicPointsStr">
      <polyline @mouseenter="showNode()" @mouseleave="hideNode()" :points="str.a+','+str.b+' '+str.c+','+str.d" :key="index+'border'" :style="highlightStyle" v-show="selectId===myId"/><!--路径选中边框-->
      <polyline @mouseenter="showNode()" @mouseleave="hideNode()" :points="str.a+','+str.b+' '+str.c+','+str.d" :key="index+'main'" :style="pathLineStyle" @contextmenu="rightClickOperation($event)" @click="showDetails()" @mousedown="shiftAllStart($event)" @mouseup="shiftAllEnd($event)"/><!--路径主体-->
      <circle :cx="str.a" :cy="str.b" :key="index+'effect'" :style="nodeEffectStyle(index)"/><!--路径选中效果-->
      <circle v-if="index===dynamicPointsStr.length-1" :key="'endNodeEffect'" :cx="str.c" :cy="str.d" :style="nodeEffectStyle(index+1)"/>
      <circle v-show="nodeDisplay" :cx="str.a" :cy="str.b" :key="index+'node'" v-bind:data-node-order="index" :style="pathNodeStyle" @click="selectNode(index)" @mousedown="shiftStart(index,$event)" @mouseup="shiftEnd($event)"/>路径节点
      <circle v-show="nodeDisplay" v-if="index===dynamicPointsStr.length-1" :key="'endNode'" :cx="str.c" :style="pathNodeStyle" :cy="str.d" v-bind:data-node-order="index+1" @click="selectNode(index+1)" @mousedown="shiftStart(index+1,$event)" @mouseup="shiftEnd($event)"/>
    </g>
  </g>
</template>
<script>
export default {
  name: "svgLine",
  data(){
    return {
      dataSourcePoint: {},//数据源
      dataSourcePoints: [],//数据源
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0},//a1的缓存
      highlightShow:false,
      myId:null,
      selectId:-1,
      shiftNodeOrder:null,
      shiftStartPoint:{x:null,y:null},
      shiftStartMouse:{x:null,y:null},
      shiftStatus:false,
      shiftAllStatus:false,
      shiftAllStartMouse:{x:null,y:null},
      shiftAllStartPoint:{x:null,y:null},
      shiftAllMoveCache:[],
      NodeDisplay:false
    }
  },
  props:{
    "polyLineConfig":{
      type:Object,
      default: function (){
        return {
          id:'l0000',
          type:'line',
          points:[{x:0.0000001,y:-0.0000001}],
          point:{x:0.0000001,y:-0.0000001},
          color:'ec3232'
        }
      }
    }
  },
  mounted:function (){
    this.startSetting();
  },
  methods:{
    startSetting(){//初始化配置
      this.myId=this.polyLineConfig.id;//拷贝id
      this.dataSourcePoint=JSON.parse(JSON.stringify(this.polyLineConfig.point));//拷贝源点数据
      this.dataSourcePoints=JSON.parse(JSON.stringify(this.polyLineConfig.points));//拷贝源点s数据
      this.mouseEvent();
      this.initializePosition();//不要提前
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
    },
    showNode(){
      this.NodeDisplay=true;
    },
    hideNode(){
      this.NodeDisplay=false;
    },
    shiftAllStart(ev){
      if(ev.button!==0){
        return false;
      }
      if(this.selectId===this.myId){//是否处于选中状态
        this.shiftAllStatus=true;
        this.shiftAllStartMouse.x=ev.x;
        this.shiftAllStartMouse.y=ev.y;
        let accPos=this.$root.computeMouseActualPos({x:ev.x,y:ev.y});//更新初始鼠标按下的实际位置
        if(accPos!==false){
          this.shiftAllStartPoint=accPos;
        }
      }
    },
    shiftAllEnd(ev){

    },
    circleShow(order){//显示节点
      if(order===this.shiftNodeOrder){
        return true;
      }else {
        return !this.doNeedMoveMap;
      }
    },
    selectNode(order) {//选中节点
      if(order===this.shiftNodeOrder){//如果再次选中自己则表示取消选中
        this.shiftNodeOrder=null;
        return true;
      }
      this.shiftNodeOrder=order;//确定选中节点是哪个
    },
    shiftStart(order,ev){//挪动节点开始
      this.shiftNodeOrder=order;//如果按下鼠标后鼠标在其他节点上则更改需要移动的节点
      this.$store.state.detailsPanelConfig.target=this.myId;//更新targetId
      this.$root.sendSwitchInstruct('disableZoomAndMove',true);//抑制details
      Object.assign(this.shiftStartPoint,this.polyLineConfig.points[order]);//保存当前节点坐标位置
      this.shiftStartMouse.x=ev.x;//保存当前鼠标点击位置
      this.shiftStartMouse.y=ev.y;
      if(ev.button!==0){
        return false;
      }
      this.shiftStatus=true;
    },
    shiftEnd(ev){//结束挪动
      if(ev.button!==0){
        return false;
      }
      this.shiftStatus=false;
      this.$root.sendSwitchInstruct('disableZoomAndMove',false);
    },
    rightClickOperation(mouseEvent){//右键选中
      mouseEvent.preventDefault();
      this.$store.state.elementOperationBoardConfig.display=true;//对右侧悬浮条的位置和显示状态操作
      this.$store.state.elementOperationBoardConfig.posX=mouseEvent.x;
      this.$store.state.elementOperationBoardConfig.posY=mouseEvent.y;
      this.$store.state.mapConfig.operated.id=this.myId;//设置operated
      this.$store.state.mapConfig.operated.data=this.polyLineConfig;
      return mouseEvent;
    },
    showDetails(){//显示详情
      this.$store.state.detailsPanelConfig.target=this.myId;//广播被选中id
      this.$store.state.detailsPanelConfig.data=this.polyLineConfig;
      this.$store.state.detailsPanelConfig.sourcePoint=this.dataSourcePoint;
    },
    initializePosition(){//初始化定位
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        let viewPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.dataSourcePoint.y,this.dataSourcePoint.x);
        this.polyLineConfig.point.x=viewPosition.x;
        this.polyLineConfig.point.y=-viewPosition.y;
        for(let i=0;i<this.dataSourcePoints.length;i++){//循环遍历
          let viewPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.dataSourcePoints[i].y,this.dataSourcePoints[i].x)
          this.polyLineConfig.points[i].x=viewPosition.x;
          this.polyLineConfig.points[i].y=-viewPosition.y;
        }
      }
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        try{
          let [layer,p0Pos]=[null,{x:null,y:null}];//1.获取必要值 layer\pointPos\p0Pos
          let pointsPos=this.polyLineConfig.points;//当前的点集合
          layer=this.$store.state.mapConfig.layer;
          p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
          p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
          for(let i=0;i<pointsPos.length;i++){
            if(layer===0){//无缩放
              this.polyLineConfig.points[i].x=pointsPos[i].x+p0Pos.x;
              this.polyLineConfig.points[i].y=pointsPos[i].y+p0Pos.y;
              continue;
            }
            if(layer>0){//有缩小
              for (let x=0;x<layer;x++){//1.计算缩小后-p0与新点之间的距离
                pointsPos[i].x=pointsPos[i].x+(pointsPos[i].x*this.$store.state.mapConfig.zoomSub);
                pointsPos[i].y=pointsPos[i].y+(pointsPos[i].y*this.$store.state.mapConfig.zoomSub);
              }
              this.polyLineConfig.points[i].x=pointsPos[i].x+p0Pos.x;
              this.polyLineConfig.points[i].y=pointsPos[i].y+p0Pos.y;
              continue;
            }
            if(layer<0){//放大
              for(let y=0;y>layer;y--){
                pointsPos[i].x=pointsPos[i].x+(pointsPos[i].x*this.$store.state.mapConfig.zoomAdd);
                pointsPos[i].y=pointsPos[i].y+(pointsPos[i].y*this.$store.state.mapConfig.zoomAdd);
              }
              //添加p0
              this.polyLineConfig.points[i].x=pointsPos[i].x+p0Pos.x;
              this.polyLineConfig.points[i].y=pointsPos[i].y+p0Pos.y;
              continue;
            }
          }
        }catch (e) {
          return false;
        }
      }
    },
    move(){//移动
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
          let A1mvX=this.A1.x-this.A1Cache.x;
          let A1mvY=this.A1Cache.y-this.A1.y;
          let newArr=this.polyLineConfig.points;
          for (let i=0;i<newArr.length;i++){
            this.polyLineConfig.points[i].x=(newArr[i].x/this.unit1X-A1mvX)*this.unit1X;
            this.polyLineConfig.points[i].y=(newArr[i].y/this.unit1Y+A1mvY)*this.unit1Y;
          }
          this.A1Cache.x=this.A1.x;
          this.A1Cache.y=this.A1.y;
          this.occurredMoveMap=false;//告知已经处理本次移动过程
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
        let newPosArr=[];
        for (let i=0;i<this.polyLineConfig.points.length;i++){
          const MOX=this.mouse.x;
          const MOY=this.mouse.y;
          const pointPos=this.polyLineConfig.points[i];
          const TRX=pointPos.x/this.unit1X;
          const TRY=-pointPos.y/this.unit1Y;
          const axSize=MOX-TRX;
          const aySize=MOY-TRY;
          let newPos={x:null,y:null};
          newPos.x=(TRX-((zoom*axSize)))*this.unit1X;
          newPos.y=-(TRY-((zoom*aySize)))*this.unit1Y;
          newPosArr.push(newPos);
        }
        this.polyLineConfig.points=newPosArr;
      }
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        this.initializePosition();
      }
    },
    mouseEvent(){//监听鼠标移动
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;
      })
    },
    nodeEffectStyle(order){
      return {
        r:parseInt(this.polyLineConfig.width)+4+'px',
        strokeWidth:1,
        pointerEvents:'fill',
        fillOpacity:0.9,
        fill:this.shiftNodeOrder===order?'#ff9191':'#bbb',
        display:this.shiftNodeOrder===order?'inherit':'none'
      }
    },
  },
  computed:{
    nodeDisplay(){
      return this.NodeDisplay === true || this.selectId === this.myId;
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
    clearClick(){
      return this.$store.state.mapConfig.clearClick;
    },
    pathNodeStyle(){
      return {
        r:parseInt(this.polyLineConfig.width)+1+'px',
        strokeWidth:1,
        pointerEvents:'fill',
        fillOpacity:1,
        fill:'#bbb'
      }
    },
    svgMouseUp(){
      return this.$store.state.mapConfig.svgMouseUp;
    },
    pathLineStyle(){
      return {
        stroke:'#'+this.polyLineConfig.color,
        strokeWidth:parseInt(this.polyLineConfig.width),
        strokeLinecap:'round'
      }
    },
    highlightStyle(){
      return {
        strokeWidth:parseInt(this.polyLineConfig.width)+5,
        stroke:'#9a9a9a',
        strokeLinecap:'round'
      }
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
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
    dynamicPointsStr() {
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let newArr = [];
        let refArr = [];
        let tempA = null;
        let tempB = null;
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        newArr = this.polyLineConfig.points;
        for (let i = 0; i < newArr.length; i++) {
          let x = newArr[i].x/this.unit1X - A1mvX;
          let y = -(newArr[i].y/this.unit1Y + A1mvY);
          if(tempA!==null){
            refArr.push({a:tempA,b:tempB,c:x,d:y})
          }
          tempA=x;
          tempB=y;
        }
        return refArr
      }else {
        let newArr = [];
        let refArr = [];
        let tempA = null;
        let tempB = null;
        newArr = this.polyLineConfig.points;
        for (let i = 0; i < newArr.length; i++) {
          let x = newArr[i].x/this.unit1X;
          let y = -newArr[i].y/this.unit1Y;
          if(tempA!==null){
            refArr.push({a:tempA,b:tempB,c:x,d:y})
          }
          tempA=x;
          tempB=y;
        }
        return refArr;
      }
    },
    targetId(){
      return this.$store.state.detailsPanelConfig.target;
    },
    reinitializeElement(){
      return this.$store.state.serverData.socket.reinitializeElement;
    },
    reinitializeId(){
      return this.$store.state.serverData.socket.reinitializeId;
    },
    reinitializeSourcePoints(){
      return this.$store.state.serverData.socket.reinitializeSourcePoints;
    },
    reinitializeSourcePoint(){
      return this.$store.state.serverData.socket.reinitializeSourcePoint;
    },
  },
  watch:{
    // browserX:{//仅限于canvas不支持动态视图才开启
    //   handler(newValue,oldValue){
    //     let offset=(newValue-oldValue)/2;
    //     for(let i=0;i<this.polyLineConfig.points.length;i++){
    //       this.polyLineConfig.points[i].x+=offset*this.unit1X;
    //     }
    //   },
    //   deep:true
    // },
    // browserY:{
    //   handler(newValue,oldValue){
    //     let offset=(oldValue-newValue)/2;
    //     for(let i=0;i<this.polyLineConfig.points.length;i++){
    //       this.polyLineConfig.points[i].y+=offset*this.unit1Y;
    //     }
    //   },
    //   deep:true
    // },
    clearClick:{
      handler(){
        this.shiftNodeOrder=null;
      },
      deep:true
    },
    reinitializeElement:{
      handler(newValue){
        if(newValue!==0){
          if(this.reinitializeId===this.myId){
            this.dataSourcePoints=JSON.parse(JSON.stringify(this.reinitializeSourcePoints));//更新源
            if(this.reinitializeSourcePoint!==null){//更新起始点源（如果有变化）
              if(this.dataSourcePoint.x!==this.reinitializeSourcePoint.x || this.dataSourcePoint.y!==this.reinitializeSourcePoint.y){
                this.dataSourcePoint=JSON.parse(JSON.stringify(this.reinitializeSourcePoint));
              }
            }
            this.initializePosition();//更新
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
    shiftStatus:{
      handler(newValue){
        if(newValue){
          this.$root.sendSwitchInstruct('disableZoomAndMove',true);//发送指令-允许缩放、移动视图
        }else {
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);//发送指令-禁止缩放、移动视图
        }
      }
    },
    shiftAllStatus:{
      handler(newValue){
        if(newValue){
          this.$root.sendSwitchInstruct('disableZoomAndMove',true);
        }else {
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);
        }
      }
    },
    mouse:{
      handler(newValue){
        if(this.shiftStatus){//节点移动
          if(this.myId===this.selectId){
            let nowOrder=this.shiftNodeOrder;
            if(nowOrder===null){
              return false;
            }
            this.polyLineConfig.points[nowOrder].x=newValue.x*this.unit1X;//移动自身的视图(跟随鼠标)
            this.polyLineConfig.points[nowOrder].y=-newValue.y*this.unit1Y;
            return true;
          }
        }
        if(this.shiftAllStatus){//整体移动
          if(this.shiftAllStartMouse.x!==null && this.shiftAllStartMouse.y!==null){
            this.$store.state.detailsPanelConfig.target=-1;
            let xOffset=0;
            let yOffset=0;
            if(this.shiftAllMoveCache.length===0){
              xOffset=(newValue.x-this.shiftAllStartMouse.x)*this.unit1X;
              yOffset=(this.shiftAllStartMouse.y-newValue.y)*this.unit1Y;
              this.shiftAllMoveCache.push(this.shiftAllStartMouse);//更新缓存
              this.shiftAllMoveCache.push(newValue);
            }else {
              this.shiftAllMoveCache.shift();//移除最前面一个
              this.shiftAllMoveCache.push(newValue);//新增一个在最后面
              xOffset=(newValue.x-this.shiftAllMoveCache[0].x)*this.unit1X;//重新计算偏移量
              yOffset=(this.shiftAllMoveCache[0].y-newValue.y)*this.unit1Y;
            }
            for(let i=0;i<this.polyLineConfig.points.length;i++){//更新每个节点的位置
              this.polyLineConfig.points[i].x=this.polyLineConfig.points[i].x+xOffset;
              this.polyLineConfig.points[i].y=this.polyLineConfig.points[i].y+yOffset;
            }
          }
        }
      }
    },
    svgMouseUp:{
      handler(newValue){
        this.shiftStatus=false;//节点移动
        let nowOrder=this.shiftNodeOrder;
        if(nowOrder!==null){
          if(this.shiftStartPoint.x!==null && this.shiftStartPoint.y!==null){
            if(this.shiftStartPoint.x!==this.polyLineConfig.points[nowOrder].x || this.shiftStartPoint.y!==this.polyLineConfig.points[nowOrder].y){
              if(this.targetId===this.myId){
                let newPos=this.$root.computeMouseActualPos(newValue);//1.计算新的位置
                let uObj={
                  id:null,
                  points:[]
                };
                uObj.id=this.myId;
                if(nowOrder===0){
                  uObj['point']=newPos;
                }
                let sourcePoints=JSON.parse(JSON.stringify(this.dataSourcePoints));
                sourcePoints[nowOrder]=newPos;//更新源的某个节点
                uObj.points=sourcePoints;
                uObj.type='line';
                this.$store.state.serverData.socket.broadcastUpdateElementNode(uObj);//上传服务器
                this.shiftStartPoint.x=null;
                this.shiftStartPoint.y=null;
                this.dataSourcePoints=sourcePoints;//更新源
                if(nowOrder===0){//如果更新了起始点
                  this.dataSourcePoint=uObj['point'];
                }
                this.shiftNodeOrder=null;
              }
            }
          }
        }
        if(this.shiftAllStatus===true){//整体移动
          let newAccPos=this.$root.computeMouseActualPos(newValue);//1.计算新的位置
          if(newAccPos!==false && this.shiftAllStartPoint!==false){
            let axOffset=newAccPos.x-this.shiftAllStartPoint.x;//计算实际偏移量
            let ayOffset=newAccPos.y-this.shiftAllStartPoint.y;
            for(let i=0;i<this.dataSourcePoints.length;i++){
              this.dataSourcePoints[i].x+=axOffset;
              this.dataSourcePoints[i].y+=ayOffset;
            }
            let auObj={
              id:null,
              points:[],
              point:{x:null,y:null}
            };
            auObj.id=this.myId;
            auObj.point.x=this.dataSourcePoints[0].x;
            auObj.point.y=this.dataSourcePoints[0].y;
            auObj.points=this.dataSourcePoints;
            auObj.type='line';
            this.$store.state.serverData.socket.broadcastUpdateElementNode(auObj);
          }
          this.shiftAllStatus=false;//结束移动
          this.shiftAllStartMouse={x:null,y:null};//清除缓存
          this.shiftAllStartPoint={x:null,y:null};
          this.shiftAllMoveCache=[];
        }
      },
      deep:true
    }
  }
}
</script>
