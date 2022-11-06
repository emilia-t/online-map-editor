<!--仅次于根的父组件-->
<template>
  <div id="app">
    <!--------->
    <!--测试用-->
    <div class="test">
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
<!--    <panel-layer>-->
<!--    </panel-layer>-->
    <!--调试面板-->
<!--    <console-layer>-->
<!--    </console-layer>-->
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
/*
<!--调试面板-->
*/
import consoleLayer from "./components/consoleLayer";
export default {
  name: 'App',
  components: {
    //普通图层
    dataLayer,rulerLayer,backgroundLayer,createLayer,controlLayer,panelLayer,
    //特殊图层
    consoleLayer
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
/*css变量，用于统一样式*/
:root{
  --panelWidth:350px;/*图层面板宽度*/
  --panelHight:90%;/*图层面板高度*/
  --panelLeft: 15px;/*图层面板左边距*/
  --panelTop: 15px;/*图层面板上边距*/
  --controlWidth:700px;/*控制面板宽度*/
  --controlHeight:48px;/*控制面板宽度*/
  --controlLeft:0.5;/*控制面板左边距的比例*/
  --controlTop:15px;/*控制面板顶部边距*/
  --borderType01:15px;/*圆角样式*/
  --borderType02:10px;/*圆角样式*/
  --borderType03:5px;/*圆角样式*/
  /*颜色划分--仅用于具有统一性的文字和box，不适用于特殊化的文字和box
  0.突出背景颜色--ProminentBackgroundColor:;
  1.上层背景颜色--FirstBackgroundColor:;
  2.中层背景颜色--CenterBackgroundColor:;
  3.次层背景颜色--NextBackgroundColor:;
  4.底层背景颜色--BottomBackgroundColor:;

  5.焦点字体颜色--FocusFontColor:;
  6.突出文字颜色--ProminentColor:;
  7.上层文字颜色--FirstFontColor:;
  8.中层文字颜色--NextFontColor:;
  9.下层文字颜色--BottomFontColor:;

  10.上层阴影颜色--FirstShadowColor:;
  11.中层阴影颜色--CenterShadowColor:;
  12.次层阴影颜色--NextShadowColor:;
  13.底层阴影颜色--BottomShadowColor:;
  */
  /*0*/
  --ProminentBackgroundColor:#ff4949;
  /*4*/
  --BottomBackgroundColor:#fdfdfd;
  /*13*/
  --BottomShadowColor:0px 0px 6px #e7e7e7;
}
</style>
