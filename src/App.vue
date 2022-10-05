<!--仅次于根的父组件-->
<template>
  <div id="app">
    <map-box></map-box>
  </div>

</template>

<script>
import MapBox from "./components/mapBox";
export default {
  name: 'App',
  components: {MapBox},
  data(){
    return {

    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
body, html {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}
</style>
