<!--仅次于根的父组件-->
<template>
  <div id="app">

    <!--地图主体-->
    <div id="mapSeparate" v-if="mapSeparateState">
      <!--地图应用主体-->
      <!--用户层-->
      <!--用于显示用户数据-->
      <layer-user></layer-user>
      <!--数据层-->
      <!--用于显示(view)和添加(new)数据用-，其下的子组件例如svgLine组件拥有移动(move)，缩放(scale)、编辑(edit)、删除(del)的功能-->
      <layer-data></layer-data>
      <!--消息层-->
      <!--显示编辑历史等信息-->
      <layer-message></layer-message>
      <!--标尺层-->
      <!--用于显示上策和左侧经纬度标尺-->
      <layer-ruler></layer-ruler>
      <!--背景层-->
      <!--用于显示背景，例如谷歌给地图-->
      <layer-background></layer-background>
      <!--新建层-->
      <!--用于创建新的要素-->
      <layer-create></layer-create>
      <!--控制层-->
      <!--用于控制一些操作用，例如编辑按钮、清空按钮-->
      <layer-control></layer-control>
      <!--元素面板层-->
      <!--用于展示图层数据的-->
      <layer-element-panel></layer-element-panel>
      <!--属性面板层-->
      <layer-details-panel></layer-details-panel>
      <!--调试面板-->
      <layer-console></layer-console>
      <!--地图应用主体-->
    </div>

    <!--初始界面-选择服务器+配置服务器-->
    <!--这个页面主要用于提供本地地图创建和连接地图服务器，暂时不提供登录功能，配置数据，例如地图服务器地址均存放在本地存储-->
    <div id="homePageSeparate" v-if="homeSeparateState">
      <!--左侧的菜单面板-->
      <page-layer-menu-panel></page-layer-menu-panel>
      <!--连接管理界面-->
      <page-layer-connection-interface></page-layer-connection-interface>
<!--      <page-layer-home-page @pageLayerHomePageCallDefault="setDefaultLogin" @pageLayerHomePageCall="linkStar"></page-layer-home-page>-->
      <page-layer-background></page-layer-background>
    </div>

    <!--底部锚-->
    <layer-bottom-anchor></layer-bottom-anchor>

  </div>
</template>

<script>

import LayerData from "./components/LayerData";
import LayerRuler from "./components/LayerRuler";
import LayerBackground from "./components/LayerBackground";
import LayerCreate from "./components/LayerCreate";
import LayerControl from "./components/LayerControl";
import LayerElementPanel from "./components/LayerElementPanel";
import LayerConsole from "./components/LayerConsole";
import LayerUser from "./components/LayerUser";
import LayerDetailsPanel from "./components/LayerDetailsPanel";
import LayerMessage from "./components/LayerMessage";
import LayerBottomAnchor from "./components/LayerBottomAnchor";
import PageLayerBackground from "./components/page/LayerBackground";
import PageLayerHomePage from "./components/page/LayerHomePage"
import PageLayerMenuPanel from "./components/page/LayerMenuPanel";
import PageLayerConnectionInterface from "./components/page/LayerConnectionInterface"
export default {
  name: 'App',
  components: {
    //地图主体
    LayerUser,LayerData,LayerRuler,LayerBackground,LayerCreate,LayerControl,LayerElementPanel,LayerDetailsPanel,LayerMessage,LayerBottomAnchor,
    //特殊图层
    LayerConsole,
    //起始页
    PageLayerBackground,PageLayerHomePage,PageLayerMenuPanel,PageLayerConnectionInterface
  },
  data(){
    return {
      mapSeparateState:false,
      homeSeparateState:true,
      cancelState:false,
    }
  },
  mounted() {
    // let status=this.handleLocalStorage('get','defaultLinkServerStatus');
    // if(status!==false){
    //   let type=undefined;
    //   this.cancelState = type =confirm('是否自动连接？');
    //   if(!type){
    //     this.handleLocalStorage('remove','defaultLinkServerStatus')
    //   }
    // }
    this.defaultLogin();
  },
  methods:{
    defaultLogin(){
      let status=this.handleLocalStorage('get','defaultLinkServerStatus');
      let url=this.handleLocalStorage('get','defaultLinkServerAddress');
      if(status=='on' && this.cancelState==true){
        this.linkStar(url);
      }
    },
    setDefaultLogin(data){
      this.handleLocalStorage('set','defaultLinkServerStatus','on');
      this.handleLocalStorage('set','defaultLinkServerAddress',''+data);
    },
    linkStar(data){
      let lock=false;
      //1.设置地址
      this.$root.CONFIG.__SERVER_ADDRESS__=data;
      //2.测试连接
      this.socket=new WebSocket(data)
      this.socket.onopen=(ev)=>{
        this.mapSeparateState=true;
        this.homeSeparateState=false;
        //保存链接，下次自动连接
      };
      this.socket.onerror=(ev)=>{
        this.$root.general_script.alert_tips('连接失败，请检查地址是否正确')
      }
    },
    //本地存储接口
    handleLocalStorage(method, key, value) {
      switch (method) {
        case 'get' : {
          let temp = window.localStorage.getItem(key);
          if (temp) {
            return temp
          } else {
            return false
          }
        }
        case 'set' : {
          window.localStorage.setItem(key, value);
          break
        }
        case 'remove': {
          window.localStorage.removeItem(key);
          break
        }
        default : {
          return false
        }
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
#mapSeparate{
  width: 100%;
  height: 100%;
}
#homePageSeparate{
  width: 100%;
  height: 100%;
  background: rgb(251,251,251);
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
*{
  font-family: Roboto;
}
*{
  touch-action: manipulation;
}

</style>
