<template>
  <div id="app">
    <layer-notification-popup></layer-notification-popup>
    <layer-toolbox></layer-toolbox>
    <layer-log></layer-log>
    <page-layer-menu-panel></page-layer-menu-panel><!--左侧的菜单面板-->
    <div id="SeparateHomePage" v-show="homeSeparateState"><!--初始界面-选择服务器+配置服务器-->
      <!--<page-layer-background></page-layer-background>--><!--背景层-->
      <page-layer-connection-interface></page-layer-connection-interface><!--连接管理界面-->
    </div>
    <router-view></router-view><!--地图主体-->
    <layer-bottom-anchor></layer-bottom-anchor><!--底部锚-->
  </div>
</template>

<script>
import LayerNotificationPopup from "./components/page/LayerNotificationPopup";
import LayerToolbox from "./components/page/LayerToolbox";
import SeparateMap from "./components/SeparateMap";
import LayerBottomAnchor from "./components/LayerBottomAnchor";
import PageLayerBackground from "./components/page/LayerBackground";
import PageLayerHomePage from "./components/page/LayerHomePage"
import PageLayerMenuPanel from "./components/page/LayerMenuPanel";
import PageLayerConnectionInterface from "./components/page/LayerConnectionInterface";
import LayerLog from "./components/page/LayerLog";
export default {
  name: 'App',
  components: {
    SeparateMap,
    PageLayerBackground,PageLayerHomePage,PageLayerMenuPanel,PageLayerConnectionInterface,
    LayerBottomAnchor,LayerLog,LayerToolbox,
    LayerNotificationPopup,
  },
  computed:{
    homeSeparateState(){
      return this.$store.state.pageConfig.homeSeparateState;
    }
  },
  methods:{

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
:root{

}
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) rgba(0,0,0,0.2);
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
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) rgba(0,0,0,0.2);
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
