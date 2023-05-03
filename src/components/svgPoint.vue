<template>
  <g :elementId="this.myId">
    <circle ref="element" @click="showDetails()"  :cx="-dynamicPointsX" :cy="dynamicPointsY" :r="pointConfig.width+'px'" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:'+'#'+pointConfig.color" @contextmenu="rightClickOperation($event)"/>
    <!--动效-->
    <circle v-if="selectId===myId" ref="element" @contextmenu="rightClickOperation($event)" @click="showDetails()" :cx="-dynamicPointsX" :cy="dynamicPointsY" :r="dynamicStyle" stroke="#fa5454" stroke-width="2" :style="'pointer-events:fill;fill-opacity:0.8;fill:none'"/>
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
      radius:[1,2,3,4,5,6,5,4,3,2]
    }
  },
  props:{
    "pointConfig":{
      type:Object,
      default: function (){
        return {
          id:'p0000',
          type:'point',
          points:[{x:-0.0000001,y:0.0000001}],
          point:{x:-0.0000001,y:0.0000001},
          color:'#ec3232',
          width:2
        }
      },
      required:true
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    //初始化配置
    startSetting(){
      //拷贝id
      this.myId=this.pointConfig.id;
      //拷贝源点数据
      Object.assign(this.dataSourcePoint,this.pointConfig.point);
      //监听鼠标移动
      this.mouseEvent();
      //初始化时就移动到相应的位置上,这一步不要提前否则影响源点的拷贝
      this.initializePosition();
      //简陋的动效
      setInterval(()=>{this.radius.push(this.radius.shift());},110)
      //初始化A1cache
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
    },
    //展示自身details
    showDetails(){
      //1.广播被选中id（myId）
      this.$store.state.detailsPanelConfig.target=this.myId;
      this.$store.state.detailsPanelConfig.data=this.pointConfig;
      this.$store.state.detailsPanelConfig.sourcePoint=this.dataSourcePoint;
    },
    //监听鼠标移动
    mouseEvent(){
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;//告知相机发生过移动行为
      })
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
        let [layer,pointPos,p0Pos,refPos,tempPos]=[null,{x:null,y:null},{x:null,y:null},{x:null,y:null},{x:null,y:null}];
        layer=this.$store.state.mapConfig.layer;
        pointPos.x=this.pointConfig.point.x;pointPos.y=this.pointConfig.point.y;
        p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
        p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
        //2.开始计算
        //无缩放
        if(layer===0){
          refPos.x=pointPos.x+p0Pos.x;
          refPos.y=pointPos.y+p0Pos.y;
          this.pointConfig.point.x=refPos.x;
          this.pointConfig.point.y=refPos.y;
        }
        //有缩小
        if(layer>0){
          //1.计算缩小后-p0（0,0）与新点之间的距离
          for (let i=0;i<layer;i++){
            pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomSub);
            pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomSub);
          }
          //添加p0
          refPos.x=pointPos.x+p0Pos.x;
          refPos.y=pointPos.y+p0Pos.y;
          //修改p
          this.pointConfig.point.x=refPos.x;
          this.pointConfig.point.y=refPos.y;
          return true;
        }
        //放大
        if(layer<0){
          //1.计算缩小后-p0（0,0）与新点之间的距离
          for(let i=0;i>layer;i--){
            pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomAdd);
            pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomAdd);
          }
          //添加p0
          refPos.x=pointPos.x+p0Pos.x;
          refPos.y=pointPos.y+p0Pos.y;
          //修改p
          this.pointConfig.point.x=refPos.x;
          this.pointConfig.point.y=refPos.y;
          return true;
        }
        return true;
      }catch (e) {
        return false;
      }
    },
    //移动（移动结束后固定数据）
    move(){
      if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
        let A1mvX=this.A1Cache.x-this.A1.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        let newArr=this.pointConfig.point;
        this.pointConfig.point.x=this.reTranslateCoordinate(this.translateCoordinate(newArr.x)+A1mvX);
        this.pointConfig.point.y=this.reTranslateCoordinate(this.translateCoordinate(newArr.y)+A1mvY);
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
      let pointPos={};
      Object.assign(pointPos,this.pointConfig.point)
      const MOX=this.mouse.x;
      const MOY=this.mouse.y;
      const TRX=this.translateCoordinate(pointPos.x);
      const TRY=-this.translateCoordinate(pointPos.y);
      const axSize=MOX-TRX;
      const aySize=MOY-TRY;
      this.pointConfig.point.x=this.reTranslateCoordinate(TRX-((zoom*axSize)));
      this.pointConfig.point.y=-this.reTranslateCoordinate(TRY-((zoom*aySize)));
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
      this.$store.state.mapConfig.operated.data=this.pointConfig;
      return mouseEvent;
    }
  },
  computed:{
    //简陋的选中动效样式
    dynamicStyle(){
      return ((this.pointConfig.width+0)/10+this.radius[0])+'px'
    },
    dynamicPointsX(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvX=this.A1Cache.x-this.A1.x;
        return -this.translateCoordinate(this.pointConfig.point.x) - A1mvX;
      }else {
        return -this.translateCoordinate(this.pointConfig.point.x);
      }
    },
    dynamicPointsY(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvY=this.A1Cache.y-this.A1.y;
        return -(this.translateCoordinate(this.pointConfig.point.y) + A1mvY);
      }else {
        return -(this.translateCoordinate(this.pointConfig.point.y));
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
    targetId(){
      return this.$store.state.detailsPanelConfig.target;
    }
  },
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

<style scoped>

</style>
