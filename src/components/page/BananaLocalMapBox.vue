<template>
  <div class="BananaLocalMapBox">
    <div class="mapName">
      {{config.name}}
    </div>
    <div>

    </div>
  </div>
</template>

<script>
export default {
  name: "BananaLocalMapBox",
  props:{
    "config":{
      type:Object,
      default: function (){
        return {
          key:null,
          url:null,
          name:null,
          maxHeight:null,
          minHeight:null,
          maxWidth:null,
          minWidth:null,
          unit1Y:null,
          offsetY:null,
          unit1X:null,
          offsetX:null,
          defaultX:null,
          defaultY:null,
          resolutionX:null,
          resolutionY:null,
          p0X:null,
          p0Y:null,
          maxLayer:null,
          minLayer:null,
          defaultLayer:null,
          zoomAdd:null,
          enableBaseMap:null,
          baseMapType:null,
          maxZoom:null,
          minZoom:null,
          defaultZoom:null,
          baseMapUrl:null
        }
      },
      required:true
    }
  },
  data(){
    return{
      config:{
        key:null,
        url:null,
        name:null,
        maxHeight:null,
        minHeight:null,
        maxWidth:null,
        minWidth:null,
        unit1Y:null,
        offsetY:null,
        unit1X:null,
        offsetX:null,
        defaultX:null,
        defaultY:null,
        resolutionX:null,
        resolutionY:null,
        p0X:null,
        p0Y:null,
        maxLayer:null,
        minLayer:null,
        defaultLayer:null,
        zoomAdd:null,
        enableBaseMap:null,
        baseMapType:null,
        maxZoom:null,
        minZoom:null,
        defaultZoom:null,
        baseMapUrl:null
      }
    }
  }
}
</script>

<style scoped>
.BananaLocalMapBox{

}
</style>
