<template>
  <g :elementId="polyLineConfig.id">
    <g v-for="(str,index) in dynamicPointsStr">
      <!--路径选中边框-->
      <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" :key="index+'border'" :style="highlightStyle" v-show="selectId===myId"/>
      <!--路径主体-->
      <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" :key="index+'main'" :style="pathLineStyle" @contextmenu="rightClickOperation($event)" @click="showDetails()"/>
      <!--路径选中效果-->
      <circle :cx="str.a" :cy="str.b" :key="index+'effect'" :style="nodeEffectStyle(index)"/>
      <circle v-if="index===dynamicPointsStr.length-1" :key="'endNodeEffect'" :cx="str.c" :cy="str.d" :style="nodeEffectStyle(index+1)"/>
      <!--路径节点-->
      <circle :cx="str.a" :cy="str.b" :key="index+'node'" v-bind:data-node-order="index" :style="pathNodeStyle" @click="selectNode(index)" @mousedown="shiftStart(index,$event)" @mouseup="shiftEnd($event)"/>
      <circle v-if="index===dynamicPointsStr.length-1" :key="'endNode'" :cx="str.c" :style="pathNodeStyle" :cy="str.d" v-bind:data-node-order="index+1" @click="selectNode(index+1)" @mousedown="shiftStart(index+1,$event)" @mouseup="shiftEnd($event)"/>
    </g>
  </g>
</template>
<script>
export default {
  name: "svgLine",
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
    }
  },
  props:{
    "polyLineConfig":{
      type:Object,//对象类型，可以修改属性
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
    //初始化配置
    startSetting(){
      //拷贝id
      this.myId=this.polyLineConfig.id;
      //拷贝源点数据
      this.dataSourcePoint=JSON.parse(JSON.stringify(this.polyLineConfig.point));
      //拷贝源点s数据
      this.dataSourcePoints=JSON.parse(JSON.stringify(this.polyLineConfig.points));
      //this.dataSourcePoints=this.dynamicPointsStr;
      this.mouseEvent();
      //初始化时就移动到相应的位置上,这一步不要提前否则影响源点的拷贝
      this.initializePosition();
      //console.log(this.polyLineConfig);
      //初始化A1cache
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
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
    //移动节点的逻辑错误——>必须要再节点被选中后才能移动节点，而不是可以直接移动，因为这会导致移动节点和点击线段展示details的操作重叠
    //需要设置一个当节点被选中后的效果
    shiftStart(order,ev){
      //如果按下鼠标后鼠标在其他节点上则更改需要移动的节点
      this.shiftNodeOrder=order;
      //更新targetId
      this.$store.state.detailsPanelConfig.target=this.myId;
      //抑制details
      this.$root.sendSwitchInstruct('disableZoomAndMove',true);
      //保存当前节点坐标位置
      Object.assign(this.shiftStartPoint,this.polyLineConfig.points[order]);
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
      //此函数仅为了解决用户在原地松开左键，导致无法正常watch松开左键的问题
      //必须按下的是鼠标左键
      if(ev.button!==0){
        return false;
      }
      //使挪动状态变更为true
      this.shiftStatus=false;
      //关闭抑制details
      this.$root.sendSwitchInstruct('disableZoomAndMove',false);
    },
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
      this.$store.state.mapConfig.operated.data=this.polyLineConfig;
      return mouseEvent;
    },
    showDetails(){
      //1.广播被选中id（myId）
      this.$store.state.detailsPanelConfig.target=this.myId;
      this.$store.state.detailsPanelConfig.data=this.polyLineConfig;
      this.$store.state.detailsPanelConfig.sourcePoint=this.dataSourcePoint;
    },
    //转化坐标
    translateCoordinate(float){
      return float*10000000;
    },
    //逆向转化坐标
    reTranslateCoordinate(float){
      return float/10000000;
    },
    //初始化定位
    initializePosition(){
      //如果视图本身没有出现任何移动、缩放、会导致重复进行初始化
      //
      try{
        //1.获取必要值 layer\pointPos\p0Pos
        let [layer,p0Pos]=[null,{x:null,y:null}];
        //当前的点集合
        let pointsPos=this.polyLineConfig.points;
        layer=this.$store.state.mapConfig.layer;
        p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
        p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
        for(let i=0;i<pointsPos.length;i++){
          //无缩放
          if(layer===0){
            this.polyLineConfig.points[i].x=pointsPos[i].x+p0Pos.x;
            this.polyLineConfig.points[i].y=pointsPos[i].y+p0Pos.y;
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
            this.polyLineConfig.points[i].x=pointsPos[i].x+p0Pos.x;
            this.polyLineConfig.points[i].y=pointsPos[i].y+p0Pos.y;
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
            this.polyLineConfig.points[i].x=pointsPos[i].x+p0Pos.x;
            this.polyLineConfig.points[i].y=pointsPos[i].y+p0Pos.y;
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
        let newArr=this.polyLineConfig.points;
        for (let i=0;i<newArr.length;i++){
          this.polyLineConfig.points[i].x=this.reTranslateCoordinate(this.translateCoordinate(newArr[i].x)-A1mvX);
          this.polyLineConfig.points[i].y=this.reTranslateCoordinate(this.translateCoordinate(newArr[i].y)+A1mvY);
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
      for (let i=0;i<this.polyLineConfig.points.length;i++){
        const MOX=this.mouse.x;
        const MOY=this.mouse.y;
        const pointPos=this.polyLineConfig.points[i];
        const TRX=this.translateCoordinate(pointPos.x);
        const TRY=-this.translateCoordinate(pointPos.y);
        const axSize=MOX-TRX;
        const aySize=MOY-TRY;
        let newPos={x:null,y:null};
        newPos.x=this.reTranslateCoordinate(TRX-((zoom*axSize)));
        newPos.y=-this.reTranslateCoordinate(TRY-((zoom*aySize)));
        newPosArr.push(newPos);
      }
      this.polyLineConfig.points=newPosArr;
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
    clearClick(){
      return this.$store.state.mapConfig.clearClick;
    },
    //path node的样式
    pathNodeStyle(){
      return {
        r:parseInt(this.polyLineConfig.width)+1+'px',
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
        stroke:'#'+this.polyLineConfig.color,
        strokeWidth:parseInt(this.polyLineConfig.width),
        strokeLinecap:'round'
      }
    },
    //path highlight 的动态样式
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
          let x = this.translateCoordinate(newArr[i].x) - A1mvX;
          let y = -(this.translateCoordinate(newArr[i].y) + A1mvY);
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
          let x = this.translateCoordinate(newArr[i].x);
          let y = -this.translateCoordinate(newArr[i].y);
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
  //移动过程中使用动态坐标，移动结束后修改源数据
  watch:{
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
    mouse:{
      handler(newValue){
        if(this.shiftStatus===true){
          if(this.myId===this.selectId){
            let nowOrder=this.shiftNodeOrder;
            if(nowOrder===null){
              return false;
            }
            //移动自身的视图(跟随鼠标)
            this.polyLineConfig.points[nowOrder].x=this.reTranslateCoordinate(newValue.x);
            this.polyLineConfig.points[nowOrder].y=this.reTranslateCoordinate(-newValue.y);
          }
        }
      }
    },
    svgMouseUp:{
      handler(newValue){
        this.shiftStatus=false;
        let nowOrder=this.shiftNodeOrder;
        if(nowOrder===null){
          return false;
        }
        if(this.shiftStartPoint.x!==null && this.shiftStartPoint.y!==null){
          if(this.shiftStartPoint.x!==this.polyLineConfig.points[nowOrder].x || this.shiftStartPoint.y!==this.polyLineConfig.points[nowOrder].y){
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
              uObj.type='line';
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
      },
      deep:true
    }
  }
}
</script>
