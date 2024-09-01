<template>
  <div class="baseMap" :style="'opacity:'+opacity">
    <canvas id="baseMap" ref="baseMap"/>
  </div>
</template>

<script>
export default {
  name: "LayerRealisticBaseMap",
  data(){
    return {
      moveStatus:false,
      A1Cache:{x:0,y:0},
    }
  },
  props:{
    opacity:{type:Number,default:0,required:false}
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.A1Cache.x=this.A1.x;//初始化A1cache
      this.A1Cache.y=this.A1.y;
      this.moveStart();
      this.moveEnd();
      this.setRealisticTile();
    },
    setRealisticTile(){
      if(this.getConfigTime===0){//如果还未获取到服务器配置
        setTimeout(()=>this.setRealisticTile(),10);//10毫秒后再初始化底图
        return false;
      }else{
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
          if(this.$refs.baseMap===undefined){
            setTimeout(()=>this.setRealisticTile(),10);//10毫秒后再初始化底图
            return false;
          }
          this.$store.state.baseMapConfig.baseMap=new this.$store.state.classList.realisticTile(this.$refs.baseMap,option);
          return true;
        }
        ,0); 
      }
    },
    setCanvasSize(){
      if(this.$store.state.baseMapConfig.baseMap===null){
        setTimeout(()=>this.setCanvasSize(),10);
        return false;
      }else{
        this.$store.state.baseMapConfig.baseMap.setCanvasSize();
        this.$store.state.baseMapConfig.baseMap.render();
        return true;
      }
    },
    moveStart(){
      document.addEventListener('mousedown',(e)=>{
        if(e.button!==0){
          return false;
        }
        if(e.target.tagName==='svg' ||
          e.target.tagName==='circle' ||
          e.target.tagName==='polyline' ||
          e.target.tagName==='image' ||
          e.target.tagName==='polygon' ||
          e.target.tagName==='path'
        ){
          this.moveStatus=true;
          this.A1Cache=JSON.parse(JSON.stringify({x:this.A1.x,y:this.A1.y}));
        }
      }
      );
    },
    moveEnd(){
      document.addEventListener('mouseup',(e)=>{
        if(e.button!==0){
          return false;
        }
        if(e.target.tagName==='svg' || e.target.tagName==='circle' || e.target.tagName==='polyline'){
          this.moveStatus=false;
          this.A1Cache=JSON.parse(JSON.stringify({x:this.A1.x,y:this.A1.y}));
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
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    movingDistance(){
      return this.$store.state.mapConfig.movingDistance;
    },
    getConfigTime(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.getConfigTime;
      }else {
        return 0;
      }
    },
  },
  watch:{
    A1:{
      handler(newValue){
        if(this.moveStatus===true && this.doNeedMoveMap===true){
          let Value=JSON.parse(JSON.stringify({x:newValue.x,y:newValue.y}));
          let moveX=this.A1Cache.x-Value.x;
          let moveY=this.A1Cache.y-Value.y;
          this.A1Cache.x=Value.x;
          this.A1Cache.y=Value.y;
          this.baseMap.view.offsetX+=moveX;
          this.baseMap.view.offsetY-=moveY;
          this.baseMap.render();
        }
      },
      deep:true
    },
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
        this.baseMap.render();
      }
    },
    browserSize:{
      handler(){
        this.setCanvasSize();
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
  top: 0;
  left: 0;
}
#baseMap{
  width: inherit;
  height: inherit;
  background: #cecece;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
