<template>
  <div class="backgroundLayer">
    <div id="leaflet" class="map">

    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
export default {
  name: "LayerBackground",
  data(){
    return {
      MY_NAME:"LayerBackground",
      baseMap:null,
      moveStatus:false,
      moveStart:null,
      A1Cache:{x:0,y:0},
      moveIngPx:{x:0,y:0},
      moveBeginIs:false,
      moveBeginPos:{
        x:null,
        y:null
      },
      moveIngPos:[

      ],
      moveObServer:null,//移动侦测器
      moveOffset:{
        x:0,
        y:0
      }
    }
  },
  mounted() {
    this.startSetting();
  },
  methods: {
    startSetting(){
      this.moveBegin();
      this.moveIng();
      this.A1Cache=JSON.parse(JSON.stringify(this.A1));//初始化A1cache
      setTimeout(()=>{
          this.baseMap=L.map("leaflet", this.baseMapConfig.options);
          L.tileLayer(this.baseMapConfig.baseLayer).addTo(this.baseMap);
        }
      ,120)
      setTimeout(()=>{
        let SCX=this.$store.state.baseMapConfig.resolution.width;//获取服务器设定分辨率
        let SCY=this.$store.state.baseMapConfig.resolution.height;
        let MCX=this.$store.state.mapConfig.browser.width;//获取当前窗口大小
        let MCY=this.$store.state.mapConfig.browser.height;
        let offsetX=(MCX-SCX)/2;//计算差异
        let offsetY=(MCY-SCY)/2;
        this.baseMap.panBy({x:offsetX,y:offsetY});//地图偏移
      },130)
    },
    getCosA(x){//计算纬度,x=mouser.y
      return (90-(Math.acos((x-1027.9)/1027.9))*180/Math.PI);
    },
    movePx(obj){//按像素平移
      if (!obj.x && !obj.y) {
        return false;
      }
      this.baseMap.panBy(obj);
    },
    moveBegin(){//移动开始
      document.addEventListener('mousedown',(e)=>{
        if(e.button!==0){
          return false;
        }
        if(e.target.tagName==='svg' || e.target.tagName==='circle' || e.target.tagName==='polyline'){
          this.moveBeginIs=true;
          this.moveBeginPos.x=e.x;
          this.moveBeginPos.y=e.y;
        }
      })
    },
    moveIng(){//移动中
      document.addEventListener('mousemove',(e)=>{
        if(this.moveObServer===null){
          this.moveObServer=setInterval(()=>{
              if(this.moveBeginIs===true && this.doNeedMoveMap===true){
                if(this.moveIngPos.length===0){
                  this.moveIngPos.push(JSON.parse(JSON.stringify(this.A1Cache)));
                  this.moveIngPos.push(JSON.parse(JSON.stringify(this.A1)));
                  let offsetX=this.moveIngPos[0].x-this.moveIngPos[1].x;
                  let offsetY=this.moveIngPos[0].y-this.moveIngPos[1].y;
                  this.baseMap.panBy({x:offsetX,y:offsetY},{animate:false});
                  this.moveOffset.x+=offsetX;
                  this.moveOffset.y+=offsetY;
                }
                if(this.moveIngPos.length===2){
                  this.moveIngPos.shift();//1出列
                  this.moveIngPos.push(JSON.parse(JSON.stringify(this.A1)));
                  let offsetX=this.moveIngPos[1].x-this.moveIngPos[0].x;//计算偏差
                  let offsetY=this.moveIngPos[0].y-this.moveIngPos[1].y;
                  this.baseMap.panBy({x:offsetX,y:offsetY},{animate:false});
                  this.moveOffset.x+=offsetX;
                  this.moveOffset.y+=offsetY;
                }
              }
            }
            ,this.$store.state.cameraConfig.frameTime);
        }
      });
    }
  },
  computed:{
    A1(){
      return this.$store.state.mapConfig.A1;
    },
    baseMapConfig(){
      return this.$store.state.baseMapConfig;
    },
    svgMouseDown(){
      return this.$store.state.mapConfig.svgMouseDown;
    },
    mouse(){
      return this.$store.state.mapConfig.mousePoint;
    },
    svgMouseUp(){
      return this.$store.state.mapConfig.svgMouseUp;
    },
    layer(){
      return this.$store.state.mapConfig.layer;
    },
    odlLayer(){
      return this.$store.state.mapConfig.oldLayer;
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
  },
  watch:{
    doNeedMoveMap:{
      handler(newValue){
        if(newValue){
          this.moveBeginIs=true;
          this.A1Cache=JSON.parse(JSON.stringify(this.A1));
        }else {
          let moveEndA1=JSON.parse(JSON.stringify(this.A1));
          let endPosX=this.A1Cache.x-moveEndA1.x;
          let endPosY=this.A1Cache.y-moveEndA1.y;
          let endSetPyX=this.moveOffset.x+endPosX;
          let endSetPyY=endPosY-this.moveOffset.y;
          this.baseMap.panBy({x:-endSetPyX,y:endSetPyY},{animate:false});
          this.moveBeginIs=false;
          this.moveBeginIs=false;
          this.moveBeginPos={x:null, y:null};
          this.moveIngPos=[];
          this.A1Cache={x:0,y:0}
          this.moveOffset.x=0;
          this.moveOffset.y=0;
        }
      }
    },
    layer:{
      handler(newValue){
        if(newValue<this.odlLayer){//放大
          this.$store.state.baseMapConfig.options.zoom+=1;
          let mouserPos=JSON.parse(JSON.stringify(this.mouse));//获取鼠标位置的经纬度
          let browser=JSON.parse(JSON.stringify(this.$store.state.mapConfig.browser));
          let point=this.baseMap.containerPointToLayerPoint([mouserPos.x, mouserPos.y]);//2.将屏幕坐标转换为地图容器内的坐标
          let latlng=this.baseMap.layerPointToLatLng(point);//3.将地图容器坐标转换为经纬度坐标
          this.baseMap.setZoomAround(latlng,this.$store.state.baseMapConfig.options.zoom);
        }else {
          this.$store.state.baseMapConfig.options.zoom-=1;
          let mouserPos=this.mouse;
          let point=this.baseMap.containerPointToLayerPoint([mouserPos.x, mouserPos.y]);
          let latlng=this.baseMap.layerPointToLatLng(point);
          this.baseMap.setZoomAround(latlng,this.$store.state.baseMapConfig.options.zoom);
        }
      }
    }
  },
  destroyed(){

  }
}
</script>

<style scoped>
.backgroundLayer{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top:0px;
  z-index: 530;
}
.map{
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 530;
}
</style>
