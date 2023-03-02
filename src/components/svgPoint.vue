<template>
  <g :elementId="this.pointConfig.id">
    <circle ref="element" @click="showDetails()" :cx="dynamicPointsX" :cy="dynamicPointsY" :r="pointConfig.width+'px'" :data-source-points="dataSourcePoints" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:'+'#'+pointConfig.color"/>
    <!--动效-->
    <circle v-if="selectStatus" ref="element" @click="showDetails()" :cx="dynamicPointsX" :cy="dynamicPointsY" :r="((pointConfig.width+0)/10+radius[0])+'px'" :data-source-points="dataSourcePoints" stroke="#fa5454" stroke-width="2" :style="'pointer-events:fill;fill-opacity:0.8;fill:none'"/>
  </g>
</template>

<script>
export default {
  name: "svgPoint",
  data(){
    return {
      dataSourcePoints:null,//数据源保存
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0},
      selectStatus:false,
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
      }
    }
  },
  mounted() {
    this.startSetting();
    setInterval(()=>{
      this.radius.push(this.radius.shift());
    },110)
  },
  methods:{
    //初始化配置
    startSetting(){
      this.dataSourcePoints=this.sourcePointStr;
      this.mouseEvent();
      this.$refs.element.addEventListener('click',(ev)=>this.selectAnimation(ev))
    },
    //被选中时的动效
    selectAnimation(ev){
      console.log(ev);

    },
    //展示自身details
    showDetails(){
      this.selectStatus=!this.selectStatus;
      console.log(this.pointConfig);
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
      const MOX=this.mouse.x;
      const MOY=this.mouse.y;
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
    mouse(){
      return {x:this.$store.state.mapConfig.mousePoint.x,y:this.$store.state.mapConfig.mousePoint.y};
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
