<!--仅次于根的父组件-->
<template>
  <div id="app">
    <!--数据层-->
    <!--用于显示和编辑数据用-->
    <data-layer>

    </data-layer>
    <!--标尺层-->
    <!--用于显示上策和左侧经纬度标尺-->
    <ruler-layer>

    </ruler-layer>
    <!--背景层-->
    <!--用于显示背景，例如谷歌给地图-->
    <background-layer>

    </background-layer>
    <!--新建层-->
    <!--用于创建新的要素-->
    <create-layer>

    </create-layer>
  </div>
</template>

<script>
//import MapBox from "./components/mapBox";
import dataLayer from "./components/dataLayer";
import rulerLayer from "./components/rulerLayer";
import backgroundLayer from "./components/backgroundLayer";
import createLayer from "./components/createLayer";
export default {
  name: 'App',
  components: {dataLayer,rulerLayer,backgroundLayer,createLayer},
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
