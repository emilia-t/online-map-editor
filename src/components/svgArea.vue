<template>
  <g v-if="rendering" ref="svgElement">
    <polygon ref="Polygon"
             :points="dynamicPointsString"
             :fill="pathLineFill"
             @contextmenu="rightClickOperation($event)"
             @click="showDetails()"
             @mousedown="shiftAllStart($event)"
             @mouseup="shiftAllEnd($event)"
             filter="url(#svgFilterShadowArea)"
             class="svgAreaPathLine"/><!--区域主体-->
    <g v-for="(str,index) in dynamicPointsStr">
      <polyline :points="str.a+','+str.b+' '+str.c+','+str.d"
                :fill="pathLineFill"
                @contextmenu="rightClickOperation($event)"
                @click="showDetails()"
                @mousedown="shiftAllStart($event)"
                @mouseup="shiftAllEnd($event)"
                class="svgAreaPathLine"/><!--区域外边框-->
      <polyline :points="str.c+','+str.d+' '+dynamicPointsStr[0].a+','+dynamicPointsStr[0].b"
                :fill="pathLineFill"
                @contextmenu="rightClickOperation($event)"
                @click="showDetails()"
                @mousedown="shiftAllStart($event)"
                @mouseup="shiftAllEnd($event)"
                v-if="index===dynamicPointsStr.length-1"
                class="svgAreaPathLine"/>

      <polyline :points="str.a+','+str.b+' '+str.c+','+str.d"
                :stroke="highlightStroke"
                v-show="selectConfig.id===myId || pickConfig.id===myId"
                class="svgAreaHighlight"/><!--区域选中边框-->
      <polyline :points="str.c+','+str.d+' '+dynamicPointsStr[0].a+','+dynamicPointsStr[0].b"
                :stroke="highlightStroke"
                v-if="index===dynamicPointsStr.length-1"
                v-show="selectConfig.id===myId || pickConfig.id===myId"
                class="svgAreaHighlight"/>

      <circle :cx="str.a" :cy="str.b"
              :style="nodeEffectStyle(index)"
              v-bind:data-node-order="index"
              @click="selectNode(index,$event)"
              @mousedown="shiftStart(index,$event)"
              @mouseup="shiftEnd($event)"
              v-show="nodeDisplay"/><!--区域节点-->
      <circle :cx="str.c" :cy="str.d"
              :style="nodeEffectStyle(index+1)"
              v-bind:data-node-order="index+1"
              @click="selectNode(index+1,$event)"
              @mousedown="shiftStart(index+1,$event)"
              @mouseup="shiftEnd($event)"
              v-if="index===dynamicPointsStr.length-1"
              v-show="nodeDisplay"/>

      <circle :cx="getVirtualCenterX(str.a,str.c)"
              :cy="getVirtualCenterY(str.b,str.d)"
              :style="virtualNodeStyle(index)"
              @mousedown="virtualNodeDown(index)"
              v-show="selectId===myId"/><!--虚拟节点-->

      <text :x="areaCenter.x" :y="areaCenter.y" :style="pickFill"
            v-if="index===0"
            v-show="selectConfig.id===myId || pickConfig.id===myId"
            v-text="svgText"
            text-anchor="middle"
            class="svgAreaSelectText"></text><!--活动文字-->
    </g>
  </g>
</template>
<script>
export default {
  name: "svgArea",
  data(){
    return {
      dataSourcePoint: {},//数据源保存
      dataSourcePoints: [],//数据源s保存
      A1Cache:{x:0,y:0},//a1的缓存
      myId:null,
      selectId:-1,
      shiftStatus:false,
      shiftNodeOrder:null,
      shiftNodeCount:null,//移动节点时元素节点总数
      shiftStartPoint:{x:null,y:null},
      shiftStartMouse:{x:null,y:null},
      shiftEndMouse:{x:null,y:null},
      shiftAllStatus:false,
      shiftAllStartMouse:{x:null,y:null},
      shiftAllStartPoint:{x:null,y:null},
      shiftAllMoveCache:[],
      NodeDisplay:false,
      shiftVirtualStatus:false,
      shiftVirtualNodeOrder:null,
      mouseDownPosition:{x:null,y:null},
      mouseUpPosition:{x:null,y:null},
      rendering:true,
      dynamicVNodeId:null,
      dynamicVNodes:null,
    }
  },
  props:{
    "areaConfig":{
      type:Object,
      default: function (){
        return {
          id:'l0000',
          type:'area',
          points:[{x:0.0000001,y:-0.0000001}],
          point:{x:0.0000001,y:-0.0000001},
          color:'ec3232'
        }
      }
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
    "showDetailsId":{
      type:Number,
      default:0
    },
  },
  mounted:function (){
    this.startSetting();
  },
  methods:{
    startSetting(){//初始化配置
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
      this.myId=this.areaConfig.id;
      this.dataSourcePoint=JSON.parse(JSON.stringify(this.areaConfig.basePoint));
      this.dataSourcePoints=JSON.parse(JSON.stringify(this.areaConfig.basePoints));
      this.initializePosition();
      this.KeyListen();
      if(this.showDetailsId===this.myId){
        this.showDetails();
      }
    },
    isElementInViewport(){//检测元素是否在可视范围内如果在范围内返回true否则返回false
      try {
        let points=JSON.parse(JSON.stringify(this.areaConfig.points));
        let len=points.length;
        let ofs=1;//采样间隔
        let num=0;//采样点总数
        let out=0;//范围的外采样点数
        if(len<=5){
          ofs=1;
        }else if(len>5 && len<=25){
          ofs=2;
        }else if(len>25 && len<=50){
          ofs=4;
        }else if(len>50 && len<=100){
          ofs=8;
        }else if(len>100){
          ofs=16;
        }
        for(let i=0;i<len;i+=ofs){
          num++;
          if((points[i].y<-50 || points[i].y>(this.browserY+50))
          || (points[i].x<-50 || points[i].x>(this.browserX+50))){
            out++;
          }
        }
        return num !== out;
      }catch (e) {
        return false;
      }
    },
    KeyListen(){//监听单个按键
      document.body.addEventListener('keyup',(e)=>{
        if(this.selectId!==this.myId){
          return false;
        }
        if(this.$store.state.mapConfig.inputFocusStatus){//在聚焦模式下拒绝操作
          return false;
        }
        let KEY=e.key;
        switch (KEY){
          case 'Delete':{
            if(this.dataSourcePoints.length<4 || this.areaConfig.points.length<4){
              this.$store.commit('setCoLogMessage',{text:'至少需要保留三个节点',from:'internal:svgArea',type:'tip'});
              return false;
            }
            if(this.$store.state.detailsPanelConfig.targetNode!==null){
              let delOrder=this.shiftNodeOrder;
              let orderBack=false;
              if(delOrder>=this.areaConfig.points.length-1){//最后一个节点节点后移
                orderBack=true;
              }
              let sourcePoints=JSON.parse(JSON.stringify(this.dataSourcePoints));
              let sendObj={
                id:this.myId,
                updateId:'up'+this.$store.state.serverData.socket.updateId++,
                type:'area',
              };
              let recordObj=JSON.parse(JSON.stringify({
                type:'updateNode',
                class:'area',
                id:sendObj.updateId,
                changes:['node'],
                oldValue:{
                  point:this.dataSourcePoint,
                  points:this.dataSourcePoints
                },
              }));
              this.$store.state.recorderConfig.initialIntent.push(recordObj);
              sourcePoints.splice(delOrder,1);
              if(delOrder===0){
                sendObj['point']={x:sourcePoints[0].x,y:sourcePoints[0].y};
                sendObj['points']=sourcePoints;
              }else {
                sendObj['points']=sourcePoints;
              }
              this.$store.state.serverData.socket.broadcastUpdateElementNode(sendObj);
              if(orderBack){
                this.shiftNodeOrder--;
              }
            }
            break;
          }
        }
      });
    },
    virtualNodeDown(index){//更改虚拟节点样式
      this.shiftVirtualStatus=true;
      this.shiftVirtualNodeOrder=index;
      this.$root.sendSwitchInstruct('disableZoomAndMove',true);
    },
    getVirtualCenterX(pt1x,pt2x){//计算并返回中心的虚拟点
      return (pt1x+pt2x)/2;
    },
    getVirtualCenterY(pt1y,pt2y){
      return (pt1y+pt2y)/2;
    },
    virtualNodeStyle(index){
      if(this.shiftVirtualNodeOrder===index){
        if(this.shiftVirtualStatus && this.selectId===this.myId){
          return {
            cx:this.mouse.x,
            cy:this.mouse.y,
            r:'8px',
            strokeWidth:1,
            stroke:'#000000',
            pointerEvents:'fill',
            fill:'#ffffff'
          }
        }else {
          return {
            r:'6px',
            strokeWidth:1,
            stroke:'#000000',
            pointerEvents:'fill',
            fill:'#ffffff'
          }
        }
      }else {
        return {
          r:'6px',
          strokeWidth:1,
          stroke:'#8e8b86',
          pointerEvents:'fill',
          fillOpacity:0.8,
          fill:'#ffffff'
        }
      }
    },
    showNode(){
      this.NodeDisplay=true;
    },
    hideNode(){
      this.NodeDisplay=false;
    },
    shiftAllStart(ev){//整体移动
      this.mouseDownPosition.x=ev.x;
      this.mouseDownPosition.y=ev.y;
      if(ev.button!==0){//左键
        return false;
      }
      if(this.selectId===this.myId){//是否处于选中状态
        this.shiftAllStatus=true;
        this.shiftAllStartMouse.x=ev.x;
        this.shiftAllStartMouse.y=ev.y;
        let accPos=this.$root.computeMouseActualPos({x:ev.x,y:ev.y});
        if(accPos!==false){
          this.shiftAllStartPoint=accPos;
        }
      }
    },
    shiftAllEnd(ev){
      this.mouseUpPosition.x=ev.x;
      this.mouseUpPosition.y=ev.y;
    },
    circleShow(order){//显示节点
      if(order===this.shiftNodeOrder){
        return true;
      }else {
        return !this.doNeedMoveMap;
      }
    },
    selectNode(order,ev) {//选中节点
      let startX=this.shiftStartMouse.x;
      let endX=this.shiftEndMouse.x;
      let startY=this.shiftStartMouse.y;
      let endY=this.shiftEndMouse.y;
      if(startX===endX && startY===endY){//定点点击取消或选中
        let nowValue=ev.target.getAttribute('data-select');
        if(nowValue===null){
          ev.target.setAttribute('data-select','n');
          nowValue='n';
        }
        if(nowValue==='n'){
          ev.target.setAttribute('data-select','y');
          this.shiftNodeOrder=order;
        }else {
          ev.target.setAttribute('data-select','n');
          this.shiftNodeOrder=null;
        }
      }else {//移动过后保持选中
        ev.target.setAttribute('data-select','y');
        this.shiftNodeOrder=order;
      }
    },
    shiftStart(order,ev){//挪动节点开始
      if(ev.button!==0)return false;
      if(this.shiftNodeOrder!==order)this.shiftNodeOrder=order;//允许中途更换节点
      if(this.shiftNodeOrder===null)this.shiftNodeOrder=order;//确定选中节点是哪个
      this.shiftNodeCount=this.areaConfig.points.length;
      this.$store.state.detailsPanelConfig.target=this.myId;//更新targetId
      this.$root.sendSwitchInstruct('disableZoomAndMove',true);//抑制details
      Object.assign(this.shiftStartPoint,this.areaConfig.points[order]);//保存当前节点坐标位置
      this.shiftStartMouse.x=ev.x;//保存当前鼠标点击位置
      this.shiftStartMouse.y=ev.y;
      this.shiftStatus=true;
    },
    shiftEnd(ev){//结束移动
      if(ev.button!==0){
        return false;
      }
      this.shiftEndMouse.x=ev.x;//保存当前鼠标点击位置
      this.shiftEndMouse.y=ev.y;
      this.shiftStatus=false;
      this.$root.sendSwitchInstruct('disableZoomAndMove',false);
    },
    rightClickOperation(mouseEvent){//右键选中
      if(this.suppressPickSelect===true){
        return false;
      }
      if(this.selectConfig.id!==undefined){
        if(this.selectConfig.user!==this.$store.state.serverData.socket.userData.user_name){
          this.$store.commit('setCoLogMessage',{text:this.selectConfig.user+'正在编辑属性，请稍等',from:'internal:svgArea',type:'tip'});
        }
        return false;
      }
      mouseEvent.preventDefault();
      this.$store.state.operationBoardConfig.display=true;//对右侧悬浮条的位置和显示状态操作
      this.$store.state.operationBoardConfig.posX=mouseEvent.x;
      this.$store.state.operationBoardConfig.posY=mouseEvent.y;
      this.$store.state.mapConfig.operated.id=this.myId;//设置operated
      this.$store.state.mapConfig.operated.data=this.areaConfig;
      return mouseEvent;
    },
    showDetails(){//显示详情
      if(this.suppressPickSelect===true){
        return false;
      }
      if(this.mouseDownPosition.x!==this.mouseUpPosition.x || this.mouseDownPosition.y!==this.mouseUpPosition.y){
        return false;
      }
      if(this.pickConfig.id!==undefined){
        if(this.pickConfig.user!==this.$store.state.serverData.socket.userData.user_name){
          this.$store.commit('setCoLogMessage',{text:this.pickConfig.user+'正在更新形状，请稍等',from:'internal:svgArea',type:'tip'});
        }
        return false;
      }
      setTimeout(
        ()=>{
          this.$store.state.detailsPanelConfig.target=this.myId;
          this.$store.state.detailsPanelConfig.data=this.areaConfig;
          this.$store.state.detailsPanelConfig.sourcePoint=this.dataSourcePoint;
        }
      ,0);
    },
    initializePosition(){//初始化定位
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        let viewPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.dataSourcePoint.y,this.dataSourcePoint.x);
        this.areaConfig.point.x=viewPosition.x;
        this.areaConfig.point.y=viewPosition.y;
        //循环遍历
        for(let i=0;i<this.dataSourcePoints.length;i++){
          let viewPosition=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.dataSourcePoints[i].y,this.dataSourcePoints[i].x)
          this.areaConfig.points[i].x=viewPosition.x;
          this.areaConfig.points[i].y=viewPosition.y;
        }
      }
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        try{
          let [layer,p0Pos]=[null,{x:null,y:null}];
          let pointsPos=this.areaConfig.points;
          layer=this.$store.state.mapConfig.layer;
          p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
          p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
          for(let i=0;i<pointsPos.length;i++){
            if(layer===0){
              this.areaConfig.points[i].x=pointsPos[i].x+p0Pos.x;
              this.areaConfig.points[i].y=pointsPos[i].y+p0Pos.y;
              continue;
            }
            if(layer>0){
              for (let x=0;x<layer;x++){
                pointsPos[i].x=pointsPos[i].x+(pointsPos[i].x*this.$store.state.mapConfig.zoomSub);
                pointsPos[i].y=pointsPos[i].y+(pointsPos[i].y*this.$store.state.mapConfig.zoomSub);
              }
              this.areaConfig.points[i].x=pointsPos[i].x+p0Pos.x;
              this.areaConfig.points[i].y=pointsPos[i].y+p0Pos.y;
              continue;
            }
            if(layer<0){
              for(let y=0;y>layer;y--){//1.计算缩小后-p0与新点之间的距离
                pointsPos[i].x=pointsPos[i].x+(pointsPos[i].x*this.$store.state.mapConfig.zoomAdd);
                pointsPos[i].y=pointsPos[i].y+(pointsPos[i].y*this.$store.state.mapConfig.zoomAdd);
              }
              this.areaConfig.points[i].x=pointsPos[i].x+p0Pos.x;
              this.areaConfig.points[i].y=pointsPos[i].y+p0Pos.y;
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
        if(this.doNeedMoveMap===false){
          let A1mvX=this.A1.x-this.A1Cache.x;
          let A1mvY=this.A1Cache.y-this.A1.y;
          let newArr=this.areaConfig.points;
          for (let i=0;i<newArr.length;i++){
            this.areaConfig.points[i].x=(newArr[i].x/this.unit1X-A1mvX)*this.unit1X;
            this.areaConfig.points[i].y=(newArr[i].y/this.unit1Y+A1mvY)*this.unit1Y;
          }
          this.A1Cache.x=this.A1.x;
          this.A1Cache.y=this.A1.y;
        }
      }
      else if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
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
        for (let i=0;i<this.areaConfig.points.length;i++){
          const MOX=this.mouse.x;
          const MOY=this.mouse.y;
          const pointPos=this.areaConfig.points[i];
          const TRX=pointPos.x/this.unit1X;
          const TRY=-pointPos.y/this.unit1Y;
          const axSize=MOX-TRX;
          const aySize=MOY-TRY;
          let newPos={x:null,y:null};
          newPos.x=(TRX-((zoom*axSize)))*this.unit1X;
          newPos.y=-(TRY-((zoom*aySize)))*this.unit1Y;
          newPosArr.push(newPos);
        }
        this.areaConfig.points=newPosArr;
      }
      else if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        this.initializePosition();
      }
    },
    nodeEffectStyle(order){//path node 的动态样式
      if(this.shiftNodeOrder===order){
        return {
          r:'8px',
          strokeWidth:1,
          stroke:'#010101',
          pointerEvents:'fill',
          fill:'#ffffff',
          fillOpacity:0.95
        }
      }else {
        return {
          r:'6px',
          strokeWidth:1,
          stroke:'#000000',
          pointerEvents:'fill',
          fill:'#ffffff'
        }
      }
    },
  },
  computed:{
    areaCenter(){
      let points=JSON.parse(JSON.stringify(this.areaConfig.points));
      let len=points.length;
      let ofs=1;//采样间隔
      let count=0;//采样点数
      let polymerize={x:0,y:0};
      if(len<=5){
        ofs=1;
      }else if(len>5 && len<=25){
        ofs=2;
      }else if(len>25 && len<=50){
        ofs=4;
      }else if(len>50 && len<=100){
        ofs=8;
      }else if(len>100){
        ofs=16;
      }
      for(let i=0;i<len;i+=ofs){
        count++;
        polymerize.x+=points[i].x;
        polymerize.y+=points[i].y;
      }
      return {x:polymerize.x/count,y:polymerize.y/count}
    },
    browserX(){
      return this.$store.state.mapConfig.browser.width;
    },
    browserY(){
      return this.$store.state.mapConfig.browser.height;
    },
    suppressPickSelect(){
      return this.$store.state.commits.suppressPickSelect;
    },
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
    nodeDisplay(){
      return this.NodeDisplay === true || this.selectId === this.myId;
    },
    unit1X(){
      return this.$store.state.cameraConfig.unit1X;
    },
    unit1Y(){
      return this.$store.state.cameraConfig.unit1Y;
    },
    clearClick(){
      return this.$store.state.mapConfig.clearClick;
    },
    svgMouseUp(){
      return this.$store.state.mapConfig.svgMouseUp;
    },
    pathLineFill(){
      return '#'+this.areaConfig.color;
    },
    highlightStroke(){
      if(this.pickConfig.user!==undefined){
        return '#'+this.pickConfig.color;
      }else if(this.selectConfig.user!==undefined){
        return '#'+this.selectConfig.color;
      }else {
        return '#ff5e5e';
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
    dynamicPointsStr(){
      let newArr = this.areaConfig.points;
      let refArr = [];
      let tempA = null;
      let tempB = null;
      let Len=newArr.length;
      for (let i = 0; i < Len; i++) {
        let x = newArr[i].x/this.unit1X;
        let y = newArr[i].y/this.unit1Y;
        if(tempA!==null){
          refArr.push({a:tempA,b:tempB,c:x,d:y})
        }
        tempA=x;
        tempB=y;
      }
      return refArr;
    },
    dynamicPointsString(){
      let newArr=this.areaConfig.points;
      let refArr='';
      let Len=newArr.length;
      for (let i = 0; i < Len; i++) {
        let x = newArr[i].x/this.unit1X;
        let y = newArr[i].y/this.unit1Y;
        refArr+=x+','+y+' ';
      }
      return refArr;
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
    allReinitialize(){
      return this.$store.state.commits.allReinitialize;
    },
  },
  watch:{
    // browserX:{//仅限于canvas不支持动态视图才开启
    //   handler(newValue,oldValue){
    //     let offset=(newValue-oldValue)/2;
    //     for(let i=0;i<this.areaConfig.points.length;i++){
    //       this.areaConfig.points[i].x+=offset*this.unit1X;
    //     }
    //   },
    //   deep:true
    // },
    // browserY:{
    //   handler(newValue,oldValue){
    //     let offset=(oldValue-newValue)/2;
    //     for(let i=0;i<this.areaConfig.points.length;i++){
    //       this.areaConfig.points[i].y+=offset*this.unit1Y;
    //     }
    //   },
    //   deep:true
    // },
    dynamicPointsStr:{
      handler(){
        if(this.isElementInViewport()===false){
          this.rendering=false;
        }else {
          this.rendering=true;
        }
      }
    },
    allReinitialize:{
      handler(){
        this.initializePosition();
      }
    },
    clearClick:{
      handler(){
        this.shiftNodeOrder=null;
        this.shiftNodeCount=null;
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
            this.initializePosition();
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
        if(this.doNeedMoveMap)return false;
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
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);
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
            this.areaConfig.points[nowOrder].x=newValue.x*this.unit1X;//移动自身的视图(跟随鼠标)
            this.areaConfig.points[nowOrder].y=newValue.y*this.unit1Y;
            return true;
          }
        }
        if(this.shiftAllStatus){//整体移动
          if(this.shiftAllStartMouse.x!==null && this.shiftAllStartMouse.y!==null){
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
            for(let i=0;i<this.areaConfig.points.length;i++){//更新每个节点的位置
              this.areaConfig.points[i].x=this.areaConfig.points[i].x+xOffset;
              this.areaConfig.points[i].y=this.areaConfig.points[i].y-yOffset;
            }
          }
        }
        if(this.shiftVirtualStatus){//虚拟节点移动
          if(this.areaConfig.points.length===this.dataSourcePoints.length){//当节点数一致时
            this.$store.state.cameraConfig.pauseInitialSvgId=this.myId;
            this.dynamicVNodeId=this.shiftVirtualNodeOrder+1;
            this.areaConfig.points.splice(this.dynamicVNodeId,0,{x:newValue.x,y:newValue.y});
            this.dynamicVNodes=JSON.parse(JSON.stringify(this.areaConfig.points));
          }else {//在虚拟节点上处理
            this.dynamicVNodes[this.dynamicVNodeId].x=newValue.x;
            this.dynamicVNodes[this.dynamicVNodeId].y=newValue.y;
            this.areaConfig.points=JSON.parse(JSON.stringify(this.dynamicVNodes));
          }
        }
      }
    },
    svgMouseUp:{
      handler(newValue){
        if(this.shiftVirtualStatus){
          let points=JSON.parse(JSON.stringify(this.dataSourcePoints));
          let newPoint=this.$store.state.baseMapConfig.baseMap.viewPositionToLatLng(newValue.x,newValue.y);
          points.splice(this.shiftVirtualNodeOrder+1,0,{x:newPoint.lng,y:newPoint.lat});
          let data={
            id:this.myId,
            updateId:'up'+this.$store.state.serverData.socket.updateId++,
            points,
            type:'area'
          };
          let recordObj=JSON.parse(JSON.stringify({
            type:'updateNode',
            class:'area',
            id:data.updateId,
            changes:['node'],
            oldValue:{
              point:this.dataSourcePoint,
              points:this.dataSourcePoints
            },
          }));
          this.$store.state.recorderConfig.initialIntent.push(recordObj);
          this.$store.state.serverData.socket.broadcastUpdateElementNode(data);
          this.shiftVirtualStatus=false;
          this.shiftVirtualNodeOrder=null;
          this.dynamicVNodeId=null;
          this.dynamicVNodes=null;
          this.$store.state.cameraConfig.pauseInitialSvgId=-1;//解除暂停解析
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);
          if(this.$refs.svgElement.classList.contains('graduallyEmergingFirst')){
            this.$refs.svgElement.classList.remove('graduallyEmergingFirst');
            this.$refs.svgElement.classList.add('graduallyEmergingAfter');
          }else {
            this.$refs.svgElement.classList.remove('graduallyEmergingAfter');
            this.$refs.svgElement.classList.add('graduallyEmergingFirst');
          }
        }
        this.shiftStatus=false;//节点移动停止
        if(this.shiftNodeOrder!==null){
          let nowOrder=this.shiftNodeOrder;
          if(this.shiftStartPoint.x!==null && this.shiftStartPoint.y!==null){
            if(this.shiftStartPoint.x!==this.areaConfig.points[nowOrder].x || this.shiftStartPoint.y!==this.areaConfig.points[nowOrder].y){
              if(this.targetId===this.myId && this.shiftNodeCount===this.areaConfig.points.length){
                let newPos=this.$root.computeMouseActualPos(newValue);//1.计算新的位置
                let uObj={
                  id:null,
                  updateId:'up'+this.$store.state.serverData.socket.updateId++,
                  points:[]
                };
                uObj.id=this.myId;
                if(nowOrder===0){
                  uObj['point']=newPos;
                }
                let sourcePoints=JSON.parse(JSON.stringify(this.dataSourcePoints));
                sourcePoints[nowOrder]=newPos;//更新源的某个节点
                uObj.points=sourcePoints;
                uObj.type='area';
                let recordObj=JSON.parse(JSON.stringify({
                  type:'updateNode',
                  class:'area',
                  id:uObj.updateId,
                  changes:['node'],
                  oldValue:{
                    point:this.dataSourcePoint,
                    points:this.dataSourcePoints
                  },
                }));
                this.$store.state.recorderConfig.initialIntent.push(recordObj);
                this.$store.state.serverData.socket.broadcastUpdateElementNode(uObj);
                this.shiftStartPoint.x=null;//处理完毕后清空
                this.shiftStartPoint.y=null;
                this.dataSourcePoints=sourcePoints;//更新源
                if(nowOrder===0){//如果更新了起始点
                  this.dataSourcePoint=uObj['point'];
                }
                //this.shiftNodeOrder=null;//清除选中点
              }
            }
          }
        }
        if(this.shiftAllStatus===true){//整体移动
          let updateId='up'+this.$store.state.serverData.socket.updateId++;
          let recordObj=JSON.parse(JSON.stringify({
            type:'updateNode',
            class:'area',
            id:updateId,
            changes:['node'],
            oldValue:{
              point:this.dataSourcePoint,
              points:this.dataSourcePoints
            },
          }));
          this.$store.state.recorderConfig.initialIntent.push(recordObj);
          let newAccPos=this.$root.computeMouseActualPos(newValue);//计算新的位置
          if(newAccPos!==false && this.shiftAllStartPoint!==false){
            let axOffset=newAccPos.x-this.shiftAllStartPoint.x;//计算实际偏移量
            let ayOffset=newAccPos.y-this.shiftAllStartPoint.y;
            for(let i=0;i<this.dataSourcePoints.length;i++){//循环增加每隔节点（源）
              this.dataSourcePoints[i].x+=axOffset;
              this.dataSourcePoints[i].y+=ayOffset;
            }
            let auObj={
              id:null,
              updateId:updateId,
              points:[],
              point:{x:null,y:null}
            };
            auObj.id=this.myId;
            auObj.point.x=this.dataSourcePoints[0].x;
            auObj.point.y=this.dataSourcePoints[0].y;
            auObj.points=this.dataSourcePoints;
            auObj.type='area';
            this.$store.state.serverData.socket.broadcastUpdateElementNode(auObj);
          }
          this.shiftAllStatus=false;//结束移动
          this.shiftAllStartMouse={x:null,y:null};//清除缓存
          this.shiftAllStartPoint={x:null,y:null};
          this.shiftAllMoveCache=[];
        }
      },
      deep:true
    },
    shiftNodeOrder:{
      handler(newValue){
        this.$store.state.detailsPanelConfig.targetNode=newValue;
      }
    }
  }
}
</script>
