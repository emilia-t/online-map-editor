<template>
  <!--
  职责：
  1.显示地图的底图、背景
  权限：
  2.允许读取、修改、删除$store.state.underlay内的数据
  -->
  <div class="backgroundLayer">

  </div>
</template>

<script>
export default {
  name: "LayerBackground",
  data(){
    return {
      MY_NAME:"LayerBackground"
    }
  },
  destroyed(){
    //销毁连接及综合对象
    //this.$store.commit('destroyComprehensive');
    //console.log("layer background");
  }
}
</script>

<style scoped>

</style>
