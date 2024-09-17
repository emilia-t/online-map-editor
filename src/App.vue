<template>
  <div id="app">
    <layer-notification-popup/>
    <layer-toolbox/>
    <layer-log/>
    <page-layer-menu-panel/><!--左侧的菜单面板-->
    <div id="SeparateHomePage" v-show="homeSeparateState"><!--初始界面-选择服务器+配置服务器-->
      <!--<page-layer-background/>--><!--背景层-->
      <page-layer-connection-interface/><!--连接管理界面-->
    </div>
    <router-view/><!--地图主体-->
    <layer-bottom-anchor/><!--底部锚，除作者以外的人如果需要修改此处，请备注原因！If anyone other than the author needs to modify this area, please indicate the reason!-->
    <layer-sound-effect/><!--音效-->
  </div>
</template>

<script>
import LayerSoundEffect from "./components/currency/LayerSoundEffect";
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
    SeparateMap,LayerSoundEffect,
    PageLayerBackground,PageLayerHomePage,PageLayerMenuPanel,PageLayerConnectionInterface,
    LayerBottomAnchor,LayerLog,LayerToolbox,
    LayerNotificationPopup,
  },
  computed:{
    homeSeparateState(){
      return this.$store.state.pageConfig.homeSeparateState;
    }
  },
  mounted(){
    this.startSetting();
  },
  methods:{
    startSetting(){
      let userAgent=navigator.userAgent;
      let exp=/Firefox/g;
      if(exp.test(userAgent)){
         this.addNewStyle(
          [
          "*{scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.1) rgba(0,0,0,0.2);}"
          ]
        );
      }
    },
    addNewStyle(style_array){
        try{
            let styleElement=document.getElementById('styles_js');
            if (!styleElement) {
                styleElement=document.createElement('style');
                styleElement.type='text/css';
                styleElement.id='styles_js';
                document.getElementsByTagName('head')[0].appendChild(styleElement);
            }
            for(let i=0;i<style_array.length;i++){
                styleElement.appendChild(document.createTextNode(style_array[i]));
            }
        }catch (e) {
        }
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
::-webkit-scrollbar {
  width: 4px !important;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px !important;
  background: rgba(0,0,0,0.2) !important;
}
::-webkit-scrollbar-track {
  border-radius: 0 !important;
  background: rgba(0,0,0,0.1) ;
}
*{
  font-family: Roboto;
  touch-action: manipulation;
}
#SeparateHomePage{
  width: 100%;
  height: 100%;
}
</style>
