<template>
<div id="SeparateMap" v-if="mapSeparateState">
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
<!--  <layer-element-panel></layer-element-panel>-->
  <!--属性面板层-->
  <layer-details-panel></layer-details-panel>
  <!--调试面板-->
  <layer-console></layer-console>
  <!--地图应用主体-->
</div>
</template>

<script>
import LayerData from "./LayerData";
import LayerRuler from "./LayerRuler";
import LayerBackground from "./LayerBackground";
import LayerCreate from "./LayerCreate";
import LayerControl from "./LayerControl";
import LayerElementPanel from "./LayerElementPanel";
import LayerConsole from "./LayerConsole";
import LayerUser from "./LayerUser";
import LayerDetailsPanel from "./LayerDetailsPanel";
import LayerMessage from "./LayerMessage";
export default {
  name: "SeparateMap",
  components:{
    LayerData,LayerRuler,LayerBackground,LayerCreate,LayerControl,LayerElementPanel,LayerConsole,
    LayerUser,LayerDetailsPanel,LayerMessage
  },
  props:{
    serverKey:{
      type:String,
      required:true
    }
  },
  data(){
    return {
      MapServerAddress:null,
      tempLinked:false,
      nowLinkClock:false
    }
  },
  mounted() {
    this.startSetting();
    //setInterval(()=>console.log(this.$store.state.serverData.socket),2000)
  },
  methods:{
    //连接服务器
    startLinkServer(Address){
      //创建新综合指令对象
      this.$store.state.serverData.socket=new this.$store.state.classList.comprehensive(Address);
      //连接服务器
      this.$store.state.serverData.socket.link();
    },
    //初始连接服务器
    startSetting(){
      //检测当前是否存在连接
      // if(this.checkNowLink()){
      //
      //   return true;
      // }
      //0.检测serverKey是否再服务器列表中由配置数据
      let serverList=this.$store.state.serverData.serverListConfig;
      let Key=this.serverKey;
      let Address='';
      let find=false;
      for (let i=0;i<serverList.length;i++){
        if(Key==serverList[i].serverKey){
          find=true;
          Address=serverList[i].serverAddress;
          break;
        }
      }
      //找到了配置信息
      if(find){
        //显示提示信息
        this.$root.general_script.alert_tips('正在连接服务器，请稍后...');
        //尝试连接
        let tempLink=new WebSocket(Address);
        tempLink.onopen=()=>{
          this.tempLinked=true;
          //断开连接
          tempLink.close();
          //正式连接
          this.startLinkServer(Address);
          //显示提示信息
          this.$root.general_script.alert_tips('连接成功');
          //展开地图主体
          this.$store.state.pageConfig.mapSeparateState=true;
          //隐藏起始页
          this.$store.state.pageConfig.homeSeparateState=false;
        }
        tempLink.onerror=()=>{
          if(!this.tempLinked){
            this.$root.general_script.alert_tips('连接服务器失败');
          }
        }
        tempLink.onclose=()=>{
          if(!this.tempLinked){
            this.$root.general_script.alert_tips('服务器已关闭连接');
          }
        }
      }
    },
    //检测正在进行的连接，如果存在连接则返回true
    checkNowLink(){
      return this.$store.state.serverData.socket !== undefined;
    }
  },
  computed:{
    mapSeparateState(){
      return this.$store.state.pageConfig.mapSeparateState;
    }
  },
  watch:{
    serverKey:{
      handler(newValue,oldValue){
        if(newValue!==null){
          console.log(newValue);
          this.startSetting();
        }
      }
    }
  },
  destroyed(){
    //主体被销毁时，连接及综合对象销毁
    this.$store.commit('destroyComprehensive');
  }
}
</script>

<style scoped>
#SeparateMap{
  width: 100%;
  height: 100%;
}
</style>
