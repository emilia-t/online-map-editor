<!--仅次于根的父组件-->
<template>
  <div id="app">
    <!--------->
    <!--测试用-->
    <div class="test">
      <button @click="">{{$store.state.name}}</button>
    </div>
    <!--测试用-->
    <!--------->
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
    <!--控制层-->
    <!--用于控制一些操作用，例如编辑按钮、清空按钮-->
    <control-layer>

    </control-layer>
    <!--面板层-->
    <!--用于展示图层数据的-->
    <panel-layer>

    </panel-layer>
  </div>
</template>

<script>
//import MapBox from "./components/mapBox";
/*
数据层
用于显示和编辑数据用
*/
import dataLayer from "./components/dataLayer";
/*
标尺层
用于显示上策和左侧经纬度标尺
*/
import rulerLayer from "./components/rulerLayer";
/*
背景层
用于显示背景，例如谷歌给地图
*/
import backgroundLayer from "./components/backgroundLayer";
/*
<!--新建层-->
<!--用于创建新的要素-->
*/
import createLayer from "./components/createLayer";
/*
<!--控制层-->
<!--用于控制一些操作用，例如编辑按钮、清空按钮-->
*/
import controlLayer from "./components/controlLayer";
/*
<!--面板层-->
<!--用于展示图层数据的-->
*/
import panelLayer from "./components/panelLayer";

export default {
  name: 'App',
  components: {
    //普通图层
    dataLayer,rulerLayer,backgroundLayer,createLayer,controlLayer,panelLayer
    //特殊图层
  },
  data(){
    return {

    }
  },
  methods:{
    test:()=>{
      //制作全局通讯用的组件或其他东西

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
