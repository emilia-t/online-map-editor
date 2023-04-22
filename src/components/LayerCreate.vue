<template>
  <!--
  职责：创建地图图层（待定）
  权限：允许访问$store.state.serverData内的数据
  -->
  <div class="createLayer">

  </div>
</template>

<script>
export default {
  name: "LayerCreate",
  data(){
    return {
      MY_NAME:"LayerCreate"
    }
  },
  destroyed(){
    //销毁连接及综合对象
    //this.$store.commit('destroyComprehensive');
    //console.log("layer create");
  }
}
</script>

<style scoped>

</style>
