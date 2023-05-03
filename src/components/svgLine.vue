<template>
  <g :elementId="polyLineConfig.id">
    <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" v-for="str in dynamicPointsStr" :style="highlightStyle" v-show="selectId===myId"/>
    <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" v-for="str in dynamicPointsStr" :style="pathLineStyle" @contextmenu="rightClickOperation($event)" @click="showDetails()"/>
    <circle :cx="translateCoordinate(point.x)" :cy="-translateCoordinate(point.y)" v-for="point in this.polyLineConfig.points" :style="pathNodeStyle" v-show="!doNeedMoveMap"/>
  </g>
</template>
<script>
export default {
  name: "svgLine",
  data(){
    return {
      dataSourcePoint: {},//数据源保存
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0},//a1的缓存，用于每次移动时扣除上一次移动产生的A1距离
      highlightShow:false,
      myId:null,
      selectId:-1
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
  methods:{
    //初始化配置
    startSetting(){
      //拷贝id
      this.myId=this.polyLineConfig.id;
      //拷贝源点数据
      Object.assign(this.dataSourcePoint,this.polyLineConfig.point);
      //this.dataSourcePoints=this.dynamicPointsStr;
      this.mouseEvent();
      //初始化时就移动到相应的位置上,这一步不要提前否则影响源点的拷贝
      this.initializePosition();
      //console.log(this.polyLineConfig);
      //初始化A1cache
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
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
    }
  },
  mounted:function (){
    this.startSetting();
  },
  computed:{
    //path line 的动态样式
    pathLineStyle(){
      return {
        stroke:'#'+this.polyLineConfig.color,
        strokeWidth:parseInt(this.polyLineConfig.width),
        strokeLinecap:'round'
      }
    },
    //path node 的动态样式
    pathNodeStyle(){
      return {
        r:parseInt(this.polyLineConfig.width)+3+'px',
        strokeWidth:1,
        pointerEvents:'fill',
        fillOpacity:0.9,
        fill:'#bbb'
      }
    },
    //path highlight 的动态样式
    highlightStyle(){
      return {
        strokeWidth:parseInt(this.polyLineConfig.width)+4,
        stroke:'#ff0f67',
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
    }
  },
  //移动过程中使用动态坐标，移动结束后修改源数据
  watch:{
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
    }
  }
}
</script>
