<template>
  <g>
    <circle class="svgPointTempCircle" :cx="pointView.x" :cy="-pointView.y" :r="tempPoint.width+'px'" :fill="'#'+tempPoint.color"/>
  </g>
</template>

<script>
export default {
  name: "svgPointTemp",
  data(){
    return {
      dataSourcePoints:null,//数据源保存
      A1Cache:{x:0,y:0},
      pointView:{x:0,y:0},
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){//初始化配置
      this.dataSourcePoints=this.sourcePointStr;
    },
    move(){//移动（移动结束后固定数据）
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1.y-this.A1Cache.y;
        let newArr=this.tempPoint.point;
        this.tempPoint.point.x=(newArr.x/this.unit1X+A1mvX)*this.unit1X;
        this.tempPoint.point.y=(newArr.y/this.unit1Y+A1mvY)*this.unit1Y;
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
      }else if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.initializePosition();
      }
    },
    scale(){//缩放（直接修改数据）
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
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
        this.$store.state.mapConfig.tempPoint.point.x=-(TRX-((zoom*axSize)))*this.unit1X;
        this.$store.state.mapConfig.tempPoint.point.y=(TRY-((zoom*aySize)))*this.unit1Y;
      }
      else if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        this.initializePosition();
      }
    },
    initializePosition(){//初始化定位
      if(this.$store.state.baseMapConfig.baseMapType==='realistic'){
        let pointView=this.$store.state.baseMapConfig.baseMap.latLngToViewPosition(this.tempPoint.point.y,this.tempPoint.point.x);
        this.pointView.x=pointView.x;
        this.pointView.y=-pointView.y;
      }
      if(this.$store.state.baseMapConfig.baseMapType==='fictitious'){
        try{
          let [layer,pointPos,p0Pos,refPos]=[null,{x:null,y:null},{x:null,y:null},{x:null,y:null}];
          layer=this.$store.state.mapConfig.layer;
          pointPos.x=this.tempPoint.point.x;
          pointPos.y=this.tempPoint.point.y;
          p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
          p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
          if(layer===0){
            refPos.x=pointPos.x+p0Pos.x;
            refPos.y=pointPos.y+p0Pos.y;
            this.pointView.x=refPos.x;
            this.$store.state.mapConfig.tempPoint.point.x=refPos.x;
            this.pointView.y=refPos.y;
            this.$store.state.mapConfig.tempPoint.point.y=refPos.y;
          }
          if(layer>0){
            for (let i=0;i<layer;i++){
              pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomSub);
              pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomSub);
            }
            refPos.x=pointPos.x+p0Pos.x;
            refPos.y=pointPos.y+p0Pos.y;
            this.pointView.x=refPos.x;
            this.$store.state.mapConfig.tempPoint.point.x=refPos.x;
            this.pointView.y=refPos.y;
            this.$store.state.mapConfig.tempPoint.point.y=refPos.y;
            return true;
          }
          if(layer<0){
            for(let i=0;i>layer;i--){
              pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomAdd);
              pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomAdd);
            }
            refPos.x=pointPos.x+p0Pos.x;
            refPos.y=pointPos.y+p0Pos.y;
            this.pointView.x=refPos.x;
            this.$store.state.mapConfig.tempPoint.point.x=refPos.x;
            this.pointView.y=refPos.y;
            this.$store.state.mapConfig.tempPoint.point.y=refPos.y;
            return true;
          }
          return true;
        }catch (e) {
          return false;
        }
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
    tempPoint(){
      return this.$store.state.mapConfig.tempPoint;
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
  },
  watch:{
    layer:{
      handler(){
        setTimeout(()=>this.scale(),0);//调换渲染顺序背景->临时点
      }
    },
    doNeedMoveMap:{
      handler(newValue){
        if(newValue!==false){return false;}
        setTimeout(()=>this.move(),0);//click事件和mouseup顺序调换
      }
    }
  }
}
</script>

<style scoped>

</style>
