<template>
  <g :elementId="tempPoint.id">
    <circle :cx="svgClick.x" :cy="svgClick.y" :r="tempPoint.width+'px'" :data-source-points="dataSourcePoints" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:#'+tempPoint.color"/>
  </g>
</template>

<script>
export default {
  name: "svgPointTemp",
  data(){
    return {
      dataSourcePoints:null,//数据源保存
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0}
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){//初始化配置
      this.dataSourcePoints=this.sourcePointStr;
      this.mouseEvent();
    },
    mouseEvent(){//监听鼠标移动
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;//告知相机发生过移动行为
      })
    },
    move(){//移动（移动结束后固定数据）
      if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1.y-this.A1Cache.y;
        let newArr=this.tempPoint.point;
        this.tempPoint.point.x=(newArr.x/this.unit1X+A1mvX)*this.unit1X;
        this.tempPoint.point.y=(newArr.y/this.unit1Y+A1mvY)*this.unit1Y;
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.occurredMoveMap=false;//告知已经处理本次移动过程
      }
      return true;
    },
    scale(){//缩放（直接修改数据）
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
      const MOX=this.mousePoint.x;
      const MOY=this.mousePoint.y;
      const pointPos=this.tempPoint.point;
      const TRX=-(pointPos.x/this.unit1X);
      const TRY=(pointPos.y/this.unit1Y);
      const axSize=MOX-TRX;
      const aySize=MOY-TRY;
      this.tempPoint.point.x=-(TRX-((zoom*axSize)))*this.unit1X;
      this.tempPoint.point.y=(TRY-((zoom*aySize)))*this.unit1Y;
    }
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
    dynamicPointsX(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        return -(this.tempPoint.point.x/this.unit1X) - A1mvX;
      }else {
        return -(this.tempPoint.point.x/this.unit1X);
      }
    },
    dynamicPointsY(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvY=this.A1.y-this.A1Cache.y;
        return this.tempPoint.point.y/this.unit1Y + A1mvY;
      }else {
        return this.tempPoint.point.y/this.unit1Y;
      }
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    sourcePointStr(){
      let st1=this.tempPoint.point.x/this.unit1X;
      let st2=this.tempPoint.point.y/this.unit1Y;
      return st1+','+st2;
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
    mousePoint(){
      return this.$store.state.mapConfig.mousePoint;
    },
    svgClick(){
      return this.$store.state.mapConfig.svgClick;
    },
    tempPoint(){
      return this.$store.state.mapConfig.tempPoint;
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
    }
  }
}
</script>

<style scoped>

</style>
