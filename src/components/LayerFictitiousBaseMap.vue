<template>
<div class="LayerFictitiousBaseMap" :style="'opacity:'+opacity">

</div>
</template>

<script>
export default {
  name: "LayerFictitiousBaseMap",
  props:{
    opacity:{type:Number,default:0,required:false}
  },
}
</script>

<style scoped>
.LayerFictitiousBaseMap{
  display: none;
}
</style>
