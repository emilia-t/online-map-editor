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
  }
}
</script>

<style scoped>

</style>
