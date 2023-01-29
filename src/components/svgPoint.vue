<template>
  <g :elementId="this.pointConfig.id">
    <circle :cx="-(this.translateCoordinate(pointConfig.point.x)+this.A1.x)" :cy="this.translateCoordinate(pointConfig.point.y)+this.A1.y" :r="pointConfig.width+'px'" :data-source-points="dataSourcePoints" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:'+pointConfig.color"/>
  </g>
</template>

<script>
export default {
  name: "svgPoint",
  data(){
    return {
      dataSourcePoints:null,//数据源保存
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0}//a1的缓存，用于每次移动时扣除上一次移动产生的A1距离
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
    //缩放（直接修改数据）
    scale(){
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomAdd:this.$store.state.mapConfig.zoomSub;
      const MOX=this.mouse.x;
      const MOY=this.mouse.y;
      const pointPos=this.pointConfig.point;
      const TRX=this.translateCoordinate(pointPos.x);
      const TRY=this.translateCoordinate(pointPos.y);
      const axSize=MOX+TRX;
      const aySize=MOY-TRY;
      console.log({TRX,TRY});
      console.log(this.mouse);
      this.pointConfig.point.x=this.reTranslateCoordinate(TRX-((zoom*axSize)));
      this.pointConfig.point.y=this.reTranslateCoordinate(TRY+((zoom*aySize)));
      //2023-1-28日：点缩放后的位置偏移很严重：连续缩小三次然后连续放大三次后位置完全变了，修复此bug，然后做添加点数据的功能
    }
  },
  computed:{
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
    mouse(){
      return {x:this.$store.state.mapConfig.mousePoint.x,y:this.$store.state.mapConfig.mousePoint.y};
    }
  },
  watch:{
    layer:{
      handler(newValue,oldValue){
        this.scale();
      }
    }
  }
}
</script>

<style scoped>

</style>
