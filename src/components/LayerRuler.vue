<template>
  <div class="rulerLayer">
    <div class="layer"><!--layer-->
      层级：{{layer}}
    </div>
    <div class="topRuler"><!--上侧的标尺-->

    </div>
    <div class="topLeftGap"><!--中间的空隙-->

    </div>
    <div class="leftRuler"><!--左侧的标尺-->

    </div>
  </div>
</template>

<script>
export default {
  name: "LayerRuler",
  data(){
    return {
      MY_NAME:"LayerRuler"
    }
  },
  computed:{
    layer(){
      return this.$store.state.mapConfig.layer;
    }
  }
}
</script>

<style scoped>
.rulerLayer{
  position: fixed;
  z-index: 545;
}
.layer{
  width: 100px;
  height: 20px;
  position: fixed;
  z-index: inherit;
  top: 15px;
  left: calc(50% - 50px);
  font-size: 12px;
}
.leftRuler{
  width: 15px;
  height: calc(100% - 15px);
  position: fixed;
  z-index: inherit;
  top: 15px;
  left: 0px;
  background: rgba(10,10,10,0.1);
}
.topRuler{
  width: calc(100% - 15px);
  height: 15px;
  position: fixed;
  z-index: inherit;
  top: 0px;
  left: 15px;
  background: rgba(10,10,10,0.1);
}
.topLeftGap{
  width: 15px;
  height: 15px;
  position: fixed;
  z-index: inherit;
  top: 0px;
  left: 0px;
  background: rgba(10,10,10,0.1);
}
</style>
