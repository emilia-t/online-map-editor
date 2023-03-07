<!--仅次于根的父组件-->
<template>
  <div id="app">
    <!--------->
    <!--测试用-->

    <!--测试用-->
    <!--------->
    <!--用户层-->
    <!--用于显示用户数据-->
    <layer-user>
    </layer-user>
    <!--数据层-->
    <!--用于显示(view)和添加(new)数据用-，其下的子组件例如svgLine组件拥有移动(move)，缩放(scale)、编辑(edit)、删除(del)的功能-->
    <layer-data>
    </layer-data>

    <!--标尺层-->
    <!--用于显示上策和左侧经纬度标尺-->
    <layer-ruler>
    </layer-ruler>
    <!--背景层-->
    <!--用于显示背景，例如谷歌给地图-->
    <layer-background>
    </layer-background>
    <!--新建层-->
    <!--用于创建新的要素-->
    <layer-create>
    </layer-create>
    <!--控制层-->
    <!--用于控制一些操作用，例如编辑按钮、清空按钮-->
    <layer-control>
    </layer-control>
    <!--元素面板层-->
    <!--用于展示图层数据的-->
    <layer-element-panel></layer-element-panel>
    <!--属性面板层-->
    <layer-details-panel></layer-details-panel>
    <!--调试面板-->
    <layer-console>
    </layer-console>
  </div>
</template>

<script>
/*
数据层
用于显示和编辑数据用
*/
import LayerData from "./components/LayerData";
/*
标尺层
用于显示上策和左侧经纬度标尺
*/
import LayerRuler from "./components/LayerRuler";
/*
背景层
用于显示背景，例如谷歌给地图
*/
import LayerBackground from "./components/LayerBackground";
/*
<!--新建层-->
<!--用于创建新的要素-->
*/
import LayerCreate from "./components/LayerCreate";
/*
<!--控制层-->
<!--用于控制一些操作用，例如编辑按钮、清空按钮-->
*/
import LayerControl from "./components/LayerControl";
/*
<!--面板层-->
<!--用于展示图层数据的-->
*/
import LayerElementPanel from "./components/LayerElementPanel";
/*
<!--调试面板-->
*/
import LayerConsole from "./components/LayerConsole";
import LayerUser from "./components/LayerUser";
import LayerDetailsPanel from "./components/LayerDetailsPanel";
export default {
  name: 'App',
  components: {
    LayerUser,
    //普通图层
    LayerData,LayerRuler,LayerBackground,LayerCreate,LayerControl,LayerElementPanel,LayerDetailsPanel,
    //特殊图层
    LayerConsole
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
  background: #fff;
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
  --panelHight:calc(100% - (var(--panelTop) * 2));/*图层面板高度*/
  --panelLeft: 15px;/*图层面板左边距*/
  --panelTop: 15px;/*图层面板上边距*/
  --controlWidth:500px;/*控制面板宽度*/
  --controlHeight:60px;/*控制面板宽度*/
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
  --ProminentBackgroundColor:#edd976;
  /*4*/
  --BottomBackgroundColor:#fdfdfd;
  /*13*/
  --BottomShadowColor:2px 2px 10px #d8d8d8;
}
*::-webkit-scrollbar {
  width: 4px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0,0,0,0.2);
}
*::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
</style>
