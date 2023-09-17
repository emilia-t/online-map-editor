<template>
<div id="SeparateMap" v-if="mapSeparateState">
<!--  <layer-background v-if="this.$store.state.baseMapConfig.enableBaseMap"></layer-background>&lt;!&ndash;背景层&ndash;&gt;-->
  <layer-realistic-base-map v-if="this.$store.state.baseMapConfig.enableBaseMap && this.$store.state.baseMapConfig.baseMapType==='realistic'"></layer-realistic-base-map><!--背景层-->
  <layer-fictitious-base-map v-if="this.$store.state.baseMapConfig.enableBaseMap && this.$store.state.baseMapConfig.baseMapType==='fictitious'"></layer-fictitious-base-map><!--背景层-->
  <layer-user :server-key="serverKey"></layer-user><!--用户层-->
  <layer-data></layer-data><!--数据层-->
  <layer-message></layer-message><!--消息层-->
<!--  <layer-ruler></layer-ruler>--><!--标尺层-->
<!--  <layer-create></layer-create>--><!--新建层-->
  <layer-control></layer-control><!--控制层-->
  <layer-element-panel></layer-element-panel><!--元素面板层-->
  <layer-details-panel></layer-details-panel><!--属性面板层-->
  <layer-console></layer-console><!--调试面板-->
</div>
</template>

<script>
import LayerData from "./LayerData";
import LayerRuler from "./LayerRuler";
import LayerBackground from "./LayerBackground";
import LayerRealisticBaseMap from "./LayerRealisticBaseMap";
import LayerFictitiousBaseMap from "./LayerFictitiousBaseMap";
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
    LayerUser,LayerDetailsPanel,LayerMessage,LayerRealisticBaseMap,LayerFictitiousBaseMap,
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
  },
  methods:{
    startSetting(){//初始化
      let serverLocalConfig=this.$root.general_script.handleLocalStorage('get','servers');//获取本地服务器配置
      let find=false;
      let Address='';
      if(serverLocalConfig===false){
        this.$root.general_script.alert_tips('本地服务器配置为空');
        return false;
      }else {
        let allServerList=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));////获取所有配置
        for(let key in allServerList){//查找是否存在此配置
          if(allServerList[key].hasOwnProperty('serverKey')){//检测是否存在key
            if(allServerList[key].hasOwnProperty('serverAddress')){//检测是否存在url
              if(allServerList[key].serverKey===this.serverKey){
                find=true;
                Address=allServerList[key].serverAddress;
                break;
              }
            }
          }
        }
        if(!find){
          this.$root.general_script.alert_tips('找不到此服务器配置信息');
          return false;
        }
      }
      if(find){//找到了配置信息
        this.$root.general_script.alert_tips('正在连接服务器，请稍后...');
        let tempLink=new WebSocket(Address);//尝试连接
        tempLink.onopen=()=>{
          this.$root.general_script.alert_tips('连接成功');//显示提示信息
          this.tempLinked=true;
          tempLink.close();//断开连接
          this.$store.state.serverData.socket=new this.$store.state.classList.comprehensive(Address);//正式连接
          this.$store.state.pageConfig.mapSeparateState=true;//展开地图主体
          this.$store.state.pageConfig.homeSeparateState=false;//隐藏起始页
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
    initializeConfig(config){//初始化地图、底图配置
      let QIR={
        /**检测是否为对象类型的数据,是则返回t
         * @return boolean
         * @param obj any
         */
        isObject (obj) {
          return Object.prototype.toString.call(obj) === '[object Object]';
        },
        /**检测一个对象是否存在某一个属性,有则返回属性值否则返回false
         * @return boolean
         * @param obj any
         * @param propName string
         */
        hasProperty(obj, propName) {
          let has=obj.hasOwnProperty(propName);
          if(has){
            return obj[propName];
          }else {
            return has;
          }
        },
        /**检测是否为数字,是则返回该数字,否则返回false
         * @return boolean number
         * @param value
         */
        returnNumber(value) {
          if (typeof value === 'string' && !isNaN(value)) {
            return parseFloat(value);
          }
          let ref=typeof value === 'number' && !isNaN(value);
          if(ref){
            return parseFloat(value);
          }else {
            return ref
          }
        },
      };
      if(!QIR.isObject(config)){return false;}
      if(QIR.hasProperty(config,'p0_x')!==false){//检测是否存在default_x
        this.$store.state.mapConfig.p0.point.x=QIR.returnNumber(config['p0_x']);
      }
      if(QIR.hasProperty(config,'p0_y')!==false){//检测是否存在default_x
        this.$store.state.mapConfig.p0.point.y=QIR.returnNumber(config['p0_y']);
      }
      if(QIR.hasProperty(config,'max_height')!==false){//map size
        this.$store.state.mapConfig.mapSize.height.max=QIR.returnNumber(config['max_height']);
      }
      if(QIR.hasProperty(config,'min_height')!==false){
        this.$store.state.mapConfig.mapSize.height.min=QIR.returnNumber(config['min_height']);
      }
      if(QIR.hasProperty(config,'max_width')!==false){
        this.$store.state.mapConfig.mapSize.width.max=QIR.returnNumber(config['max_width']);
      }
      if(QIR.hasProperty(config,'min_width')!==false){
        this.$store.state.mapConfig.mapSize.width.min=QIR.returnNumber(config['min_width']);
      }
      if(QIR.hasProperty(config,'max_layer')!==false){//layer
        this.$store.state.cameraConfig.maxZoom=QIR.returnNumber(config['max_layer']);
      }
      if(QIR.hasProperty(config,'min_layer')!==false){
        this.$store.state.cameraConfig.minZoom=QIR.returnNumber(config['min_layer']);
      }
      if(QIR.hasProperty(config,'unit1_x')!==false){//unit
        this.$store.state.cameraConfig.unit1X=QIR.returnNumber(config['unit1_x']);
      }
      if(QIR.hasProperty(config,'offset_x')!==false){
        this.$store.state.cameraConfig.offsetX=QIR.returnNumber(config['offset_x']);
      }
      if(QIR.hasProperty(config,'unit1_y')!==false){
        this.$store.state.cameraConfig.unit1Y=QIR.returnNumber(config['unit1_y']);
      }
      if(QIR.hasProperty(config,'offset_y')!==false){
        this.$store.state.cameraConfig.offsetY=QIR.returnNumber(config['offset_y']);
      }
      if(QIR.hasProperty(config,'zoom_add')!==false){
        let add=QIR.returnNumber(config['zoom_add']);
        let zoomAdd=Math.log2(1+add);//Math.pow(2,Math.add)-1，Math.log2(1+0.25)
        this.$store.state.baseMapConfig.options.scaling=zoomAdd;
        this.$store.state.mapConfig.zoomAdd=add;
        this.$store.state.mapConfig.zoomSub=-add/(1+add);//-k/(1+k)
      }
      if(QIR.hasProperty(config,'enable_base_map')!==false){//地图底图相关配置，如果启用的话：
        this.$store.state.baseMapConfig.enableBaseMap=config['enable_base_map'];
        this.$store.state.baseMapConfig.baseMapType=config['base_map_type'];
        if(config['enable_base_map']===true){
          if(QIR.hasProperty(config,'max_zoom')!==false){
            this.$store.state.baseMapConfig.options.maxZoom=QIR.returnNumber(config['max_zoom']);
          }
          if(QIR.hasProperty(config,'min_zoom')!==false){
            this.$store.state.baseMapConfig.options.minZoom=QIR.returnNumber(config['min_zoom']);
          }
          if(QIR.hasProperty(config,'default_zoom')!==false){
            this.$store.state.baseMapConfig.options.zoom=QIR.returnNumber(config['default_zoom']);
          }
          if(QIR.hasProperty(config,'base_map_url')!==false){
            this.$store.state.baseMapConfig.baseLayer=config['base_map_url'];
          }
          if(QIR.hasProperty(config,'default_x')!==false){
            this.$store.state.baseMapConfig.options.center[1]=QIR.returnNumber(config['default_x']);
          }
          if(QIR.hasProperty(config,'default_y')!==false){
            this.$store.state.baseMapConfig.options.center[0]=QIR.returnNumber(config['default_y']);
          }
          if(QIR.hasProperty(config,'resolution_x')!==false){
            this.$store.state.baseMapConfig.resolution.width=QIR.returnNumber(config['resolution_x']);
          }
          if(QIR.hasProperty(config,'resolution_y')!==false){
            this.$store.state.baseMapConfig.resolution.height=QIR.returnNumber(config['resolution_y']);
          }
        }
      }
    }
  },
  computed:{
    mapSeparateState(){
      return this.$store.state.pageConfig.mapSeparateState;
    },
    serverConfig(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.config;
      }else {
        return {}
      }
    }
  },
  watch:{
    serverKey:{
      handler(newValue){
        if(newValue!==null){
          this.startSetting();
        }
      }
    },
    serverConfig:{
      handler(newValue){
        if(newValue.key!==undefined){
          this.initializeConfig(newValue);
        }
      },
      deep:true
    }
  },
  destroyed(){
    this.$store.commit('destroyComprehensive');//主体被销毁时，一并重置数据
    this.$store.commit('restoreCameraConfig');
    this.$store.commit('restoreBaseMapConfig');
    this.$store.commit('restoreMapConfig');
  }
}
</script>

<style scoped>
#SeparateMap{
  width: 100%;
  height: 100%;
}
</style>
