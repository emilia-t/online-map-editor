<template>
  <!--
  职责：
  1.显示地图的底图、背景
  权限：
  2.允许读取、修改、删除$store.state.underlay内的数据
  -->
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
      //
      moveBeginIs:false,
      moveBeginPos:{
        x:null,
        y:null
      },
      moveIngPos:[

      ],
      //移动侦测器
      moveObServer:null,
      //
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
      //监听鼠标移动
      //this.mouseEvent();
      this.moveBegin();
      this.moveIng();
      //初始化A1cache
      this.A1Cache=JSON.parse(JSON.stringify(this.A1));
      setTimeout(()=>{
          this.baseMap=L.map("leaflet", this.leafletConfig.options);
          L.tileLayer(this.leafletConfig.baseLayer).addTo(this.baseMap);
        }
      ,120)
      setTimeout(()=>{
        //1获取服务器设定的默认视窗大小：1920*980
        let SCX=this.$store.state.leafletConfig.resolution.width;
        let SCY=this.$store.state.leafletConfig.resolution.height;
        //2.获取当前窗口大小
        let MCX=this.$store.state.mapConfig.browser.width;
        let MCY=this.$store.state.mapConfig.browser.height;
        //3.计算差异
        let offsetX=(MCX-SCX)/2;
        let offsetY=(MCY-SCY)/2;
        //4.地图偏移
        this.baseMap.panBy({x:offsetX,y:offsetY});
      },130)
    },
    //计算纬度,x=mouser.y
    getCosA(x){
      return (90-(Math.acos((x-1027.9)/1027.9))*180/Math.PI);
    },
    //按像素平移
    movePx(obj){
      if (!obj.x && !obj.y) {
        return false;
      }
      this.baseMap.panBy(obj);
    },
    //横向像素平移
    rowMoveByPx(x){
      this.movePx({x,y:0});
      console.log(this.baseMap.getCenter());
    },
    //纵向像素平移
    colMoveByPx(y){
      this.movePx({x:0,y});
      console.log(this.baseMap.getCenter());
    },
    //设置缩放
    setZoomUP(){
      this.$store.state.leafletConfig.options.zoom++;
      this.baseMap.setZoom(this.$store.state.leafletConfig.options.zoom);
    },
    setZoomDown(){
      this.$store.state.leafletConfig.options.zoom--;
      this.baseMap.setZoom(this.$store.state.leafletConfig.options.zoom);
      this.baseMap._onWheelScroll();
      //事件防抖
      // _onMouseWheel: function (e) {
      //   var now = L.Util.now();  // 当前时间
      //   if (this._startTime && now - this._startTime < this._wheelDebounceTime) {
      //     return;  // 时间间隔小于 _wheelDebounceTime(默认80ms),忽略事件
      //   }
      //   // 处理逻辑...
      //   this._startTime = now;  // 更新上次触发时间
      // }
    },
    //重置容器大小
    //移动开始
    moveBegin(){
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
    moveIng(){
      document.addEventListener('mousemove',(e)=>{
        if(this.moveObServer===null){
          this.moveObServer=setInterval(()=>{
              if(this.moveBeginIs===true && this.doNeedMoveMap===true){
                //0个
                if(this.moveIngPos.length===0){
                  this.moveIngPos.push(JSON.parse(JSON.stringify(this.A1Cache)));
                  this.moveIngPos.push(JSON.parse(JSON.stringify(this.A1)));
                  let offsetX=this.moveIngPos[0].x-this.moveIngPos[1].x;
                  let offsetY=this.moveIngPos[0].y-this.moveIngPos[1].y;
                  this.baseMap.panBy({x:offsetX,y:offsetY},{animate:false});
                  //console.log({x:offsetX,y:offsetY});
                  this.moveOffset.x+=offsetX;
                  this.moveOffset.y+=offsetY;
                }
                // //1个
                // if(this.moveIngPos.length===1){
                //   this.moveIngPos.push(JSON.parse(JSON.stringify(this.A1)));
                //   //计算偏差
                //   let offsetX=this.moveIngPos[0].x-this.moveIngPos[1].x;
                //   let offsetY=this.moveIngPos[0].y-this.moveIngPos[1].y;
                //   this.baseMap.panBy({x:offsetX,y:offsetY},{animate:false});
                //   this.moveOffset.x+=offsetX;
                //   this.moveOffset.y+=offsetY;
                // }
                //2个
                if(this.moveIngPos.length===2){
                  //1出列
                  this.moveIngPos.shift();
                  this.moveIngPos.push(JSON.parse(JSON.stringify(this.A1)));
                  //计算偏差
                  let offsetX=this.moveIngPos[1].x-this.moveIngPos[0].x;
                  let offsetY=this.moveIngPos[0].y-this.moveIngPos[1].y;
                  //console.log(offsetX);
                  this.baseMap.panBy({x:offsetX,y:offsetY},{animate:false});
                  //console.log({x:offsetX,y:offsetY});
                  this.moveOffset.x+=offsetX;
                  this.moveOffset.y+=offsetY;
                }
              }
            }
            ,this.$store.state.cameraConfig.frameTime)
        }
      })
    }
  },
  computed:{
    A1(){
      return this.$store.state.mapConfig.A1;
    },
    leafletConfig(){
      return this.$store.state.leafletConfig;
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
          // console.log(Date.now());
          // console.log(this.A1.x);
          this.A1Cache=JSON.parse(JSON.stringify(this.A1));
        }else {
          //这里存在的问题，在移动过程中svgPoint与底图的移动不同步
          //从A1Cache中看出，如果在0.5秒后结束移动，则LayerBackground没能获取A1Cache
          //解决此问题，然后同样的修改line \ area
          //固定位置-以A1cache->A1为最终位置
          let moveEndA1=JSON.parse(JSON.stringify(this.A1));
          let endPosX=this.A1Cache.x-moveEndA1.x;
          let endPosY=this.A1Cache.y-moveEndA1.y;
          // console.log("---->");
          // console.log(moveEndA1);
          // console.log(this.A1Cache);

          let endSetPyX=this.moveOffset.x+endPosX;
          let endSetPyY=endPosY-this.moveOffset.y;
          // console.log("nowA1");
          // console.log(moveEndA1);
          // console.log("A1cache");
          // console.log({endPosX,endPosY});
          // console.log("endOFF SET");
          // console.log({endSetPyX,endSetPyY});
          this.baseMap.panBy({x:-endSetPyX,y:endSetPyY},{animate:false});
          this.moveBeginIs=false;
          this.moveBeginIs=false;
          this.moveBeginPos={x:null, y:null};
          this.moveIngPos=[];
          this.A1Cache={x:0,y:0}
          this.moveOffset.x=0;
          this.moveOffset.y=0;
          //固定位置

        }
      }
    },
    layer:{
      handler(newValue){
        if(newValue<this.odlLayer){//放大
          this.$store.state.leafletConfig.options.zoom+=1;
          //获取鼠标位置的经纬度
          //this.baseMap.zoomIn();
          let mouserPos=JSON.parse(JSON.stringify(this.mouse));
          let browser=JSON.parse(JSON.stringify(this.$store.state.mapConfig.browser));
          //2.将屏幕坐标转换为地图容器内的坐标
          let point=this.baseMap.containerPointToLayerPoint([mouserPos.x, mouserPos.y]);
          //3.将地图容器坐标转换为经纬度坐标
          let latlng=this.baseMap.layerPointToLatLng(point);
          this.baseMap.setZoomAround(latlng,this.$store.state.leafletConfig.options.zoom);
        }else {
          this.$store.state.leafletConfig.options.zoom-=1;
          //this.baseMap.zoomOut();
          let mouserPos=this.mouse;
          //2.将屏幕坐标转换为地图容器内的坐标
          let point=this.baseMap.containerPointToLayerPoint([mouserPos.x, mouserPos.y]);
          //3.将地图容器坐标转换为经纬度坐标
          let latlng=this.baseMap.layerPointToLatLng(point);
          this.baseMap.setZoomAround(latlng,this.$store.state.leafletConfig.options.zoom);
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
