<template>
  <g :elementId="areaConfig.id">
    <!--区域主体-->
    <polyline :points="dynamicPointsString" :style="pathLineStyle" @contextmenu="rightClickOperation($event)" @click="showDetails()" @mousedown="shiftAllStart($event)" @mouseup="shiftAllEnd($event)"/>
    <g v-for="(str,index) in dynamicPointsStr">
      <!--区域外边框-->
      <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" :key="index+'main'" :style="pathLineStyle" @contextmenu="rightClickOperation($event)" @click="showDetails()" @mousedown="shiftAllStart($event)" @mouseup="shiftAllEnd($event)"/>
      <polyline v-if="index===dynamicPointsStr.length-1" :points="str.c+','+str.d+' '+dynamicPointsStr[0].a+','+dynamicPointsStr[0].b" :key="index+'endMain'" :style="pathLineStyle" @contextmenu="rightClickOperation($event)" @click="showDetails()" @mousedown="shiftAllStart($event)" @mouseup="shiftAllEnd($event)"/>
      <!--区域选中边框-->
      <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" :key="index+'border'" :style="highlightStyle" v-show="selectId===myId"/>
      <polyline v-if="index===dynamicPointsStr.length-1" :points="str.c+','+str.d+' '+dynamicPointsStr[0].a+','+dynamicPointsStr[0].b" :key="index+'endBorder'" :style="highlightStyle" v-show="selectId===myId"/>
      <!--区域选中效果-->
      <circle :cx="str.a" :cy="str.b" :key="index+'effect'" :style="nodeEffectStyle(index)"/>
      <circle v-if="index===dynamicPointsStr.length-1" :key="'endNodeEffect'" :cx="str.c" :cy="str.d" :style="nodeEffectStyle(index+1)"/>
      <!--区域节点-->
      <circle :cx="str.a" :cy="str.b" :key="index+'node'" v-bind:data-node-order="index" :style="pathNodeStyle" @click="selectNode(index)" @mousedown="shiftStart(index,$event)" @mouseup="shiftEnd($event)"/>
      <circle v-if="index===dynamicPointsStr.length-1" :key="'endNode'" :cx="str.c" :style="pathNodeStyle" :cy="str.d" v-bind:data-node-order="index+1" @click="selectNode(index+1)" @mousedown="shiftStart(index+1,$event)" @mouseup="shiftEnd($event)"/>
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
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0},//a1的缓存，用于每次移动时扣除上一次移动产生的A1距离
      highlightShow:false,
      myId:null,
      selectId:-1,
      //shift
      shiftNodeOrder:null,
      shiftStartPoint:{x:null,y:null},
      shiftStartMouse:{x:null,y:null},
      shiftStatus:false,
      //shift all
      shiftAllStatus:false,
      shiftAllStartMouse:{x:null,y:null},
      shiftAllStartPoint:{x:null,y:null},
      shiftAllMoveCache:[]
    }
  },
  props:{
    "areaConfig":{
      type:Object,//对象类型，可以修改属性
      default: function (){
        return {
          id:'l0000',
          type:'area',
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
    //初始化配置
    startSetting(){
      //拷贝id
      this.myId=this.areaConfig.id;
      //拷贝源点数据
      this.dataSourcePoint=JSON.parse(JSON.stringify(this.areaConfig.point));
      //拷贝源点s数据
      this.dataSourcePoints=JSON.parse(JSON.stringify(this.areaConfig.points));
      this.mouseEvent();
      //初始化时就移动到相应的位置上,这一步不要提前否则影响源点的拷贝
      this.initializePosition();
      //console.log(this.areaConfig);
      //初始化A1cache
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
    },
    //4.上传至服务器
    shiftAllStart(ev){
      //保证在左键按下才能移动
      if(ev.button!==0){
        return false;
      }
      //1.拷贝源
      //console.log(this.dataSourcePoints);
      //2.查看是否处于选中状态
      if(this.selectId===this.myId){
        //3.将移动状态更新为true
        this.shiftAllStatus=true;
        //4.更新初始鼠标按下的位置
        this.shiftAllStartMouse.x=ev.x;
        this.shiftAllStartMouse.y=ev.y;
        //5.更新初始鼠标按下的实际位置
        let accPos=this.$root.computeMouseActualPos({x:ev.x,y:ev.y});
        if(accPos!==false){
          this.shiftAllStartPoint=accPos;
        }
      }
    },
    //整体移动结束
    shiftAllEnd(ev){

    },
    //显示节点
    circleShow(order){
      //1.如果这是一个被选中的节点，则不受dnm影响
      if(order===this.shiftNodeOrder){
        return true;
      }else {
        return !this.doNeedMoveMap;
      }
    },
    //选中节点
    selectNode(order) {
      //如果再次选中自己则表示取消选中
      if(order===this.shiftNodeOrder){
        this.shiftNodeOrder=null;
        return true;
      }
      //确定选中节点是哪个
      this.shiftNodeOrder=order;
    },
    //挪动节点开始
    shiftStart(order,ev){
      //如果按下鼠标后鼠标在其他节点上则更改需要移动的节点
      this.shiftNodeOrder=order;
      //更新targetId
      this.$store.state.detailsPanelConfig.target=this.myId;
      //抑制details
      this.$root.sendSwitchInstruct('disableZoomAndMove',true);
      //保存当前节点坐标位置
      Object.assign(this.shiftStartPoint,this.areaConfig.points[order]);
      //保存当前鼠标点击位置
      this.shiftStartMouse.x=ev.x;
      this.shiftStartMouse.y=ev.y;
      //必须按下的是鼠标左键
      if(ev.button!==0){
        return false;
      }
      //使挪动状态变更为true
      this.shiftStatus=true;
    },
    //鼠标在svg中、松开左键、固定节点位置
    shiftEnd(ev){
      //必须按下的是鼠标左键
      if(ev.button!==0){
        return false;
      }
      //使挪动状态变更为true
      this.shiftStatus=false;
      //关闭抑制details
      this.$root.sendSwitchInstruct('disableZoomAndMove',false);
    },
    //右键选中
    rightClickOperation(mouseEvent){
      //阻止默认事件
      mouseEvent.preventDefault();
      //对右侧悬浮条的位置和显示状态操作
      this.$store.state.elementOperationBoardConfig.display=true;
      this.$store.state.elementOperationBoardConfig.posX=mouseEvent.x;
      this.$store.state.elementOperationBoardConfig.posY=mouseEvent.y;
      //设置operated
      this.$store.state.mapConfig.operated.id=this.myId;
      //同步该元素的数据
      this.$store.state.mapConfig.operated.data=this.areaConfig;
      return mouseEvent;
    },
    //显示详情
    showDetails(){
      //1.广播被选中id（myId）
      this.$store.state.detailsPanelConfig.target=this.myId;
      this.$store.state.detailsPanelConfig.data=this.areaConfig;
      this.$store.state.detailsPanelConfig.sourcePoint=this.dataSourcePoint;
    },
    //初始化定位
    initializePosition(){
      try{
        //1.获取必要值 layer\pointPos\p0Pos
        let [layer,p0Pos]=[null,{x:null,y:null}];
        //当前的点集合
        let pointsPos=this.areaConfig.points;
        layer=this.$store.state.mapConfig.layer;
        p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
        p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
        for(let i=0;i<pointsPos.length;i++){
          //无缩放
          if(layer===0){
            this.areaConfig.points[i].x=pointsPos[i].x+p0Pos.x;
            this.areaConfig.points[i].y=pointsPos[i].y+p0Pos.y;
            continue;
          }
          //有缩小
          if(layer>0){
            //1.计算缩小后-p0（0,0）与新点之间的距离
            for (let x=0;x<layer;x++){
              pointsPos[i].x=pointsPos[i].x+(pointsPos[i].x*this.$store.state.mapConfig.zoomSub);
              pointsPos[i].y=pointsPos[i].y+(pointsPos[i].y*this.$store.state.mapConfig.zoomSub);
            }
            //添加p0
            this.areaConfig.points[i].x=pointsPos[i].x+p0Pos.x;
            this.areaConfig.points[i].y=pointsPos[i].y+p0Pos.y;
            continue;
          }
          //放大
          if(layer<0){
            //1.计算缩小后-p0（0,0）与新点之间的距离
            for(let y=0;y>layer;y--){
              pointsPos[i].x=pointsPos[i].x+(pointsPos[i].x*this.$store.state.mapConfig.zoomAdd);
              pointsPos[i].y=pointsPos[i].y+(pointsPos[i].y*this.$store.state.mapConfig.zoomAdd);
            }
            //添加p0
            this.areaConfig.points[i].x=pointsPos[i].x+p0Pos.x;
            this.areaConfig.points[i].y=pointsPos[i].y+p0Pos.y;
            continue;
          }
        }
      }catch (e) {
        return false;
      }
    },
    //移动（移动结束后固定数据）
    move(){
      if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        let newArr=this.areaConfig.points;
        for (let i=0;i<newArr.length;i++){
          this.areaConfig.points[i].x=(newArr[i].x/this.unit1X-A1mvX)*this.unit1X;
          this.areaConfig.points[i].y=(newArr[i].y/this.unit1Y+A1mvY)*this.unit1Y;
        }
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.occurredMoveMap=false;//告知已经处理本次移动过程
      }
      return true;
    },
    //缩放（直接修改数据）
    scale(){
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
    },
    //监听鼠标移动
    mouseEvent(){
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;//告知相机发生过移动行为
      })
    },
    //path node 的动态样式
    nodeEffectStyle(order){
      return {
        r:8+'px',
        strokeWidth:1,
        pointerEvents:'fill',
        fillOpacity:0.9,
        fill:this.shiftNodeOrder===order?'#ff9191':'#bbb',
        display:this.shiftNodeOrder===order?'inherit':'none'
      }
    },
  },
  computed:{
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
    //path node的样式
    pathNodeStyle(){
      return {
        r:6+'px',
        strokeWidth:1,
        pointerEvents:'fill',
        fillOpacity:1,
        fill:'#bbb'
      }
    },
    //松开左键位置
    svgMouseUp(){
      return this.$store.state.mapConfig.svgMouseUp;
    },
    //path line 的动态样式
    pathLineStyle(){
      return {
        stroke:'#dedede',
        strokeWidth:3,
        opacity:0.5,
        strokeLinecap:'round',
        fill:'#'+this.areaConfig.color
      }
    },
    //path highlight 的动态样式
    highlightStyle(){
      return {
        strokeWidth:5,
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
        newArr = this.areaConfig.points;
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
        newArr = this.areaConfig.points;
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
    dynamicPointsString() {
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let newArr = [];
        let refArr = '';
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        newArr = this.areaConfig.points;
        for (let i = 0; i < newArr.length; i++) {
          let x = newArr[i].x/this.unit1X - A1mvX;
          let y = -(newArr[i].y/this.unit1Y + A1mvY);
          refArr+=x+','+y+' ';
        }
        return refArr
      }else {
        let newArr = [];
        let refArr = '';
        newArr = this.areaConfig.points;
        for (let i = 0; i < newArr.length; i++) {
          let x = newArr[i].x/this.unit1X;
          let y = -newArr[i].y/this.unit1Y;
          refArr+=x+','+y+' ';
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
  //移动过程中使用动态坐标，移动结束后修改源数据
  watch:{
    browserX:{
      handler(newValue,oldValue){
        let offset=(newValue-oldValue)/2;
        for(let i=0;i<this.areaConfig.points.length;i++){
          this.areaConfig.points[i].x+=offset*this.unit1X;
        }
      },
      deep:true
    },
    browserY:{
      handler(newValue,oldValue){
        let offset=(oldValue-newValue)/2;
        for(let i=0;i<this.areaConfig.points.length;i++){
          this.areaConfig.points[i].y+=offset*this.unit1Y;
        }
      },
      deep:true
    },
    clearClick:{
      handler(){
        this.shiftNodeOrder=null;
      },
      deep:true
    },
    reinitializeElement:{
      handler(newValue){
        if(newValue!==0){
          if(this.reinitializeId==this.myId){
            //更新源
            this.dataSourcePoints=JSON.parse(JSON.stringify(this.reinitializeSourcePoints));
            //更新起始点源（如果有变化）
            if(this.reinitializeSourcePoint!==null){
              if(this.dataSourcePoint.x!==this.reinitializeSourcePoint.x || this.dataSourcePoint.y!==this.reinitializeSourcePoint.y){
                this.dataSourcePoint=JSON.parse(JSON.stringify(this.reinitializeSourcePoint));
              }
            }
            //更新
            this.initializePosition();

          }
        }
      }
    },
    layer:{
      handler(newValue,oldValue){
        this.scale();
      }
    },
    doNeedMoveMap:{
      handler(newValue,oldValue){
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
          //发送指令-允许缩放、移动视图
          this.$root.sendSwitchInstruct('disableZoomAndMove',true);
        }else {
          //发送指令-禁止缩放、移动视图
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);
        }
      }
    },
    shiftAllStatus:{
      handler(newValue){
        if(newValue){
          //发送指令-允许缩放、移动视图
          this.$root.sendSwitchInstruct('disableZoomAndMove',true);
        }else {
          //发送指令-禁止缩放、移动视图
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);
        }
      }
    },
    mouse:{
      handler(newValue){
        //隐藏元素面板
        //节点移动
        if(this.shiftStatus){
          if(this.myId===this.selectId){
            let nowOrder=this.shiftNodeOrder;
            if(nowOrder===null){
              return false;
            }
            //移动自身的视图(跟随鼠标)
            this.areaConfig.points[nowOrder].x=newValue.x*this.unit1X;
            this.areaConfig.points[nowOrder].y=-newValue.y*this.unit1Y;
            return true;
          }
        }
        //整体移动
        if(this.shiftAllStatus){
          if(this.shiftAllStartMouse.x!==null && this.shiftAllStartMouse.y!==null){
            //刷新target id 这里会在移动结束后使得target id由 x 变为 -1 然后再因为按下了按键变为 x从而更新面板位置
            //效果为：移动过程中隐藏元素信息面板，结束后恢复显示元素信息面板
            this.$store.state.detailsPanelConfig.target=-1;
            //移动整体
            //计算偏移量
            //如果没有上一次的移动缓存则使用起始位置
            let xOffset=0;
            let yOffset=0;
            if(this.shiftAllMoveCache.length===0){
              xOffset=(newValue.x-this.shiftAllStartMouse.x)*this.unit1X;
              yOffset=(this.shiftAllStartMouse.y-newValue.y)*this.unit1Y;
              //更新缓存
              this.shiftAllMoveCache.push(this.shiftAllStartMouse);
              this.shiftAllMoveCache.push(newValue);
            }else {
              //移除最前面一个
              this.shiftAllMoveCache.shift();
              //新增一个在最后面
              this.shiftAllMoveCache.push(newValue);
              //重新计算偏移量
              xOffset=(newValue.x-this.shiftAllMoveCache[0].x)*this.unit1X;
              yOffset=(this.shiftAllMoveCache[0].y-newValue.y)*this.unit1Y;
            }
            //更新每个节点的位置
            for(let i=0;i<this.areaConfig.points.length;i++){
              //
              this.areaConfig.points[i].x=this.areaConfig.points[i].x+xOffset;
              this.areaConfig.points[i].y=this.areaConfig.points[i].y+yOffset;
            }
          }
        }
      }
    },
    svgMouseUp:{
      handler(newValue){
        //节点移动
        this.shiftStatus=false;
        let nowOrder=this.shiftNodeOrder;
        if(nowOrder!==null){
          if(this.shiftStartPoint.x!==null && this.shiftStartPoint.y!==null){
            if(this.shiftStartPoint.x!==this.areaConfig.points[nowOrder].x || this.shiftStartPoint.y!==this.areaConfig.points[nowOrder].y){
              if(this.targetId===this.myId){
                //处理
                //1.计算新的位置
                let newPos=this.$root.computeMouseActualPos(newValue);
                //2.上传服务器(一共修改两项>point和points)
                let uObj={
                  id:null,
                  points:[]
                };
                uObj.id=this.myId;
                if(nowOrder===0){
                  uObj['point']=newPos;
                }
                //拷贝一份源  理论上说这个子元素被更改后组件会被销毁，但实际没有，所以如果更改了节点，这里的源并不会被同步修改
                let sourcePoints=JSON.parse(JSON.stringify(this.dataSourcePoints));
                //更新源的某个节点
                sourcePoints[nowOrder]=newPos;
                uObj.points=sourcePoints;
                uObj.type='area';
                this.$store.state.serverData.socket.broadcastUpdateElementNode(uObj);
                //处理完毕后清空
                this.shiftStartPoint.x=null;
                this.shiftStartPoint.y=null;
                //更新源
                this.dataSourcePoints=sourcePoints;
                //如果更新了起始点
                if(nowOrder===0){
                  //更新起始点源
                  this.dataSourcePoint=uObj['point'];
                }
                //清除选中点
                this.shiftNodeOrder=null;
              }
            }
          }
        }
        //整体移动
        if(this.shiftAllStatus===true){
          //1.计算新的位置
          let newAccPos=this.$root.computeMouseActualPos(newValue);
          //
          if(newAccPos!==false && this.shiftAllStartPoint!==false){
            //计算实际偏移量
            let axOffset=newAccPos.x-this.shiftAllStartPoint.x;
            let ayOffset=newAccPos.y-this.shiftAllStartPoint.y;
            //循环增加每隔节点（源）
            for(let i=0;i<this.dataSourcePoints.length;i++){
              this.dataSourcePoints[i].x+=axOffset;
              this.dataSourcePoints[i].y+=ayOffset;
            }
            //2.上传服务器(一共修改两项>point和points)
            let auObj={
              id:null,
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
          //结束移动
          this.shiftAllStatus=false;
          //清除缓存
          this.shiftAllStartMouse={x:null,y:null};
          this.shiftAllStartPoint={x:null,y:null};
          this.shiftAllMoveCache=[];
        }
      },
      deep:true
    }
  }
}
</script>
