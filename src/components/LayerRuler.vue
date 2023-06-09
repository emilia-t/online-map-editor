<template>
  <!--
  职责：显示地图的标尺、层级
  权限：允许访问$store.state.mapConfig内的数据
  -->
  <div class="rulerLayer">
    <!--layer-->
    <div class="layer">
      层级：{{layer}}
    </div>
    <!--上侧的标尺-->
    <div class="topRuler">

    </div>
    <!--中间的空隙-->
    <div class="topLeftGap">

    </div>
    <!--左侧的标尺-->
<!--    <div class="leftRuler">-->

<!--    </div>-->
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
