<template>
  <g :elementId="this.pointConfig.id">
    <circle :cx="dynamicPointsX" :cy="dynamicPointsY" r="0px" :data-source-points="dataSourcePoints" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:'+pointConfig.color"/>
<!--    <text class="selectNone" :x="dynamicPointsX" :y="dynamicPointsY+20" text-anchor="middle">P0</text>-->
  </g>
</template>

<script>
export default {
  name: "svgPointP0",
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
    //this.updateP0Pos();
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
        let newArr=this.pointConfig.point;
        this.pointConfig.point.x=this.pointConfig.point.x+(A1mvX*this.unit1X);
        this.pointConfig.point.y=this.pointConfig.point.y+(A1mvY*this.unit1Y);
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.occurredMoveMap=false;//告知已经处理本次移动过程
      }
      return true;
    },
    scale(){
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
      const MOX=this.mouse.x;
      const MOY=this.mouse.y;
      const pointPos=this.pointConfig.point;
      const TRX=-pointPos.x/this.unit1X;
      const TRY=pointPos.y/this.unit1Y;
      const axSize=MOX-TRX;
      const aySize=MOY-TRY;
      this.pointConfig.point.x=-(TRX-((zoom*axSize))*this.unit1X);
      this.pointConfig.point.y=(TRY-((zoom*aySize)))*this.unit1X;
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
    dynamicPointsX(){//返回屏幕坐标
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        return -this.pointConfig.point.x/this.unit1X - A1mvX;//等于自生除以单位1
      }else {
        return -this.pointConfig.point.x/this.unit1X;
      }
    },
    dynamicPointsY(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvY=this.A1.y-this.A1Cache.y;
        return this.pointConfig.point.y/this.unit1Y + A1mvY;
      }else {
        return this.pointConfig.point.y/this.unit1Y;
      }
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    sourcePointStr(){
      let st1=this.pointConfig.point.x/this.unit1X;
      let st2=this.pointConfig.point.y/this.unit1Y;
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
    mouse(){
      return {x:this.$store.state.mapConfig.mousePoint.x,y:this.$store.state.mapConfig.mousePoint.y};
    }
  },
  watch:{
    browserX:{
      handler(newValue,oldValue){
        let offset=(oldValue-newValue)/2;
        this.pointConfig.point.x+=offset*this.unit1X;
      },
      deep:true
    },
    browserY:{
      handler(newValue,oldValue){
        let offset=(newValue-oldValue)/2;
        this.pointConfig.point.y+=offset*this.unit1Y;
      },
      deep:true
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
    }
  }
}
</script>

<style scoped>

</style>
