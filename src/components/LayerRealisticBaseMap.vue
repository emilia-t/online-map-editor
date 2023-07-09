<template>
  <div class="baseMap">
    <canvas id="baseMap" ref="baseMap"></canvas>
  </div>
</template>

<script>
export default {
  name: "LayerRealisticBaseMap",
  data(){
    return {
      moveStatus:false,
      offsetCache:{x:0,y:0},
      A1Cache:{x:0,y:0},
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      setTimeout(
        ()=>{
          let option={};
          option.defaultX=this.$store.state.baseMapConfig.options.center[1];
          option.defaultY=this.$store.state.baseMapConfig.options.center[0];
          option.resolutionX=this.$store.state.baseMapConfig.resolution.width;
          option.resolutionY=this.$store.state.baseMapConfig.resolution.height;
          option.maxZoom=this.$store.state.baseMapConfig.options.maxZoom;
          option.minZoom=this.$store.state.baseMapConfig.options.minZoom;
          option.defaultZoom=this.$store.state.baseMapConfig.options.zoom;
          option.baseMapUrl=this.$store.state.baseMapConfig.baseLayer;
          option.scaling=this.$store.state.baseMapConfig.options.scaling;
          this.A1Cache.x=this.A1.x;//初始化A1cache
          this.A1Cache.y=this.A1.y;
          this.$store.state.baseMapConfig.baseMap=new this.$store.state.classList.realisticBaseMap(this.$refs.baseMap,option);
          this.moveStart();
          this.moveIng();
          this.moveEnd();
        }
      ,10);
    },
    moveStart(){
      document.addEventListener('mousedown',(e)=>{
        if(e.button!==0){
          return false;
        }
        if(e.target.tagName==='svg' ||
          e.target.tagName==='circle' ||
          e.target.tagName==='polyline' ||
          e.target.tagName==='image'
        ){
          this.moveStatus=true;
          this.A1Cache.x=this.A1.x;
          this.A1Cache.y=this.A1.y;
          this.offsetCache.x=this.baseMap.view.offsetX;
          this.offsetCache.y=this.baseMap.view.offsetY;
        }
      }
      );
    },
    moveIng(){//移动中
      document.addEventListener('mousemove',(e)=>{
        if(this.moveStatus){
          let moveX=this.A1Cache.x-this.A1.x;
          let moveY=this.A1Cache.y-this.A1.y;
          this.baseMap.view.offsetX=this.offsetCache.x+moveX;
          this.baseMap.view.offsetY=this.offsetCache.y-moveY;
          this.baseMap.render();
        }
      });
    },
    moveEnd(){
      document.addEventListener('mouseup',(e)=>{
        if(e.button!==0){
          return false;
        }
        if(e.target.tagName==='svg' || e.target.tagName==='circle' || e.target.tagName==='polyline'){
          this.moveStatus=false;
          this.A1Cache.x=this.A1.x;
          this.A1Cache.y=this.A1.y;
          this.offsetCache.x=this.baseMap.view.offsetX;
          this.offsetCache.y=this.baseMap.view.offsetY;
        }
      });
    },
  },
  computed:{
    A1(){
      return this.$store.state.mapConfig.A1;
    },
    layer(){
      return this.$store.state.mapConfig.layer;
    },
    wheelMouse(){
      return this.$store.state.mapConfig.mouseWheelPos;
    },
    baseMap(){
      return this.$store.state.baseMapConfig.baseMap;
    },
    browserSize(){
      return this.$store.state.mapConfig.browser;
    }
  },
  watch:{
    layer:{
      handler(newValue,oldValue){
        const dzl = this.baseMap.options.scaling;
        const zoomLevelOffset = (newValue > oldValue) ? 1 * dzl : -1 * dzl;
        const oldZ = this.baseMap.options.zoom;
        this.baseMap.options.zoom = this.baseMap.options.zoom - zoomLevelOffset;
        if (this.baseMap.options.zoom < this.baseMap.options.minZoom) {
          this.baseMap.options.zoom = this.baseMap.options.minZoom;
          return;
        }
        if (this.baseMap.options.zoom > this.baseMap.options.maxZoom) {
          this.baseMap.options.zoom = this.baseMap.options.maxZoom;
          return;
        }
        this.baseMap.updateViewport(this.wheelMouse.x,this.wheelMouse.y, oldZ, this.baseMap.options.zoom);
        console.log(this.baseMap.options.zoom);
        this.baseMap.render();
      }
    },
    browserSize:{
      handler(){
        this.$store.state.baseMapConfig.baseMap.setCanvasSize();
        this.$store.state.baseMapConfig.baseMap.render();
      },deep:true
    }
  }
}
</script>

<style scoped>
.baseMap{
  width: 100%;
  height: 100%;
  background: #cecece;
  position: fixed;
  top: 0px;
  left: 0px;
}
#baseMap{
  width: inherit;
  height: inherit;
  background: #cecece;
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
