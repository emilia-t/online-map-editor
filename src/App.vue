<!--仅次于根的父组件-->
<template>
  <div id="app">
    <!--左侧的菜单面板-->
    <page-layer-menu-panel></page-layer-menu-panel>
    <!--初始界面-选择服务器+配置服务器-->
    <div id="SeparateHomePage" v-show="homeSeparateState">
      <!--背景层-->
<!--      <page-layer-background></page-layer-background>-->
      <!--连接管理界面-->
      <page-layer-connection-interface></page-layer-connection-interface>
    </div>
    <!--地图主体-->
    <router-view></router-view>
    <!--底部锚-->
    <layer-bottom-anchor></layer-bottom-anchor>
    <!--
    首先：用户直接访问例如：map.atsw.top访问的是主页，
    用户可以选择某个服务器然后进去地图界面
    用户也可以直接通过链接例如：map.atsw.top/m/k0 直接进入到地图界面，其中k0是地图的key

    则内部逻辑是：在APP.vue下展示起始页面的相关组件，并且随时调用
    在APP.vue下展示一个<route-view>，用以显示地图主体
    当用户切换到其他地图服务器时，这个地图（separateMap.vue）应该被销毁，然后立即再创建一个新的
    -->
  </div>
</template>

<script>
//地图主体
import SeparateMap from "./components/SeparateMap";
//底部信息
import LayerBottomAnchor from "./components/LayerBottomAnchor";
//起始页相关组件
import PageLayerBackground from "./components/page/LayerBackground";
import PageLayerHomePage from "./components/page/LayerHomePage"
import PageLayerMenuPanel from "./components/page/LayerMenuPanel";
import PageLayerConnectionInterface from "./components/page/LayerConnectionInterface";
export default {
  name: 'App',
  components: {
    //地图主体
    SeparateMap,
    //起始页相关组件
    PageLayerBackground,PageLayerHomePage,PageLayerMenuPanel,PageLayerConnectionInterface,
    //底部信息
    LayerBottomAnchor
  },
  mounted() {

  },
  computed:{
    homeSeparateState(){
      return this.$store.state.pageConfig.homeSeparateState;
    }
  },
  methods:{

  },
  // watch:{
  //   '$route'(to,from){
  //     console.log(to);
  //     console.log(from);
  //   }
  // }
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
  /*颜色
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
*{
  font-family: Roboto;
  touch-action: manipulation;
}
#SeparateHomePage{
  width: 100%;
  height: 100%;
  background: rgb(251,251,251);
}
</style>
