<!--仅次于根的父组件-->
<template>
  <div id="app">
    <data-layer>

    </data-layer>
  </div>
</template>

<script>
//import MapBox from "./components/mapBox";
import dataLayer from "./components/dataLayer";
export default {
  name: 'App',
  components: {dataLayer},
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
