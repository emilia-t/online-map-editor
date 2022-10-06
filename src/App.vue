<!--仅次于根的父组件-->
<template>
  <div id="app">
    <!--数据层-->
    <data-layer>

    </data-layer>
    <!--标尺层-->
    <!--背景层-->
    <!--新建层-->
  </div>
</template>

<script>
//import MapBox from "./components/mapBox";
import dataLayer from "./components/dataLayer";
import rulerLayer from "./components/rulerLayer";
import backgroundLayer from "./components/backgroundLayer";
export default {
  name: 'App',
  components: {dataLayer,rulerLayer,backgroundLayer},
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
