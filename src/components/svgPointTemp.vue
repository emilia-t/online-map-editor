<template>
  <g :elementId="this.pointConfig.id">
    <circle :cx="svgClick.x" :cy="svgClick.y" :r="pointConfig.width+'px'" :data-source-points="dataSourcePoints" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:'+pointConfig.color"/>
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
      }
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    //初始化配置
    startSetting(){
      this.dataSourcePoints=this.sourcePointStr;
      this.mouseEvent();
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
    //移动（移动结束后固定数据）
    move(){
      if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1.y-this.A1Cache.y;
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
      const MOX=this.mousePoint.x;
      const MOY=this.mousePoint.y;
      const pointPos=this.pointConfig.point;
      const TRX=-this.translateCoordinate(pointPos.x);
      const TRY=this.translateCoordinate(pointPos.y);
      const axSize=MOX-TRX;
      const aySize=MOY-TRY;
      this.pointConfig.point.x=-this.reTranslateCoordinate(TRX-((zoom*axSize)));
      this.pointConfig.point.y=this.reTranslateCoordinate(TRY-((zoom*aySize)));
    }
  },
  computed:{
    //这里考虑是否需要用到
    dynamicPointsX(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        return -this.translateCoordinate(this.pointConfig.point.x) - A1mvX;
      }else {
        return -this.translateCoordinate(this.pointConfig.point.x);
      }
    },
    dynamicPointsY(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvY=this.A1.y-this.A1Cache.y;
        return this.translateCoordinate(this.pointConfig.point.y) + A1mvY;
      }else {
        return this.translateCoordinate(this.pointConfig.point.y);
      }
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    sourcePointStr(){
      let st1=this.translateCoordinate(this.pointConfig.point.x);
      let st2=this.translateCoordinate(this.pointConfig.point.y);
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
