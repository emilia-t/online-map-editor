<template>
<div id="SeparateMap" v-if="mapSeparateState">
<!--  <layer-background v-if="this.$store.state.baseMapConfig.enableBaseMap"/>&lt;!&ndash;背景层&ndash;&gt;-->
  <layer-realistic-base-map :opacity="loading?0:1" v-if="useBaseMap"/><!--背景层-->
  <layer-fictitious-base-map :opacity="loading?0:1" v-if="!useBaseMap"/><!--背景层-->
  <layer-user :server-key="serverKey" v-show="!loading"/><!--用户层-->
  <layer-data v-show="!loading"/><!--数据层-->
  <layer-message v-show="!loading"/><!--消息层-->
<!--  <layer-ruler/>标尺层-->
  <layer-control v-show="!loading"/><!--控制层-->
  <layer-element-panel v-show="!loading"/><!--元素面板层-->
  <layer-details-panel v-show="!loading"/><!--属性面板层-->
  <layer-console v-show="!loading"/><!--调试面板-->
  <pomelo-loading :view="loading"/><!--加载界面-->
  <pomelo-delay/>
</div>
</template>

<script>
import LayerData from "./LayerData";
import LayerRuler from "./LayerRuler";
import LayerBackground from "./LayerBackground";
import LayerRealisticBaseMap from "./LayerRealisticBaseMap";
import LayerFictitiousBaseMap from "./LayerFictitiousBaseMap";
import LayerControl from "./LayerControl";
import LayerElementPanel from "./LayerElementPanel";
import LayerConsole from "./LayerConsole";
import LayerUser from "./LayerUser";
import LayerDetailsPanel from "./LayerDetailsPanel";
import LayerMessage from "./LayerMessage";
import PomeloLoading from "./PomeloLoading";
import PomeloDelay from "./PomeloDelay";
export default {
  name: "SeparateMap",
  components:{
    LayerData,LayerRuler,LayerBackground,LayerControl,LayerElementPanel,LayerConsole,
    LayerUser,LayerDetailsPanel,LayerMessage,LayerRealisticBaseMap,LayerFictitiousBaseMap,
    PomeloLoading,PomeloDelay
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
      nowLinkClock:false,
      loading:true,//加载中状态默认为true//开发可以关闭
    }
  },
  mounted() {
    this.startSetting();
    this.changeLoad();//开发时关闭加载页面
  },
  methods:{
    startSetting(){//初始化
      let serverLocalConfig=this.$root.general_script.handleLocalStorage('get','servers');//获取本地服务器配置
      let find=false;
      let Address='';
      let needRouteSearch=false;
      if(serverLocalConfig===false){
        this.$store.commit('setCoLogMessage',{text:'本地服务器配置为空',from:'internal:SeparateMap',type:'warn'});
      }
      else{
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
      }
      if(!find){
        //this.$store.commit('setCoLogMessage',{text:'找不到本地服务器配置信息',from:'internal:SeparateMap',type:'warn'});
        needRouteSearch=true;
      }
      if(find){//找到了配置信息
        let tempLink=new WebSocket(Address);//尝试连接
        tempLink.onopen=()=>{
          this.tempLinked=true;
          tempLink.close();//断开连接
          this.$store.state.serverData.socket=new this.$store.state.classList.instructPipe(Address);//正式连接
          this.$store.state.pageConfig.mapSeparateState=true;//展开地图主体
          this.$store.state.pageConfig.homeSeparateState=false;//隐藏起始页
        };
        tempLink.onerror=()=>{
          if(!this.tempLinked){
            this.$store.commit('setCoLogMessage',{text:'服务器连接失败',from:'internal:SeparateMap',type:'warn'});
          }
        };
        tempLink.onclose=()=>{
          if(!this.tempLinked){
            this.$store.commit('setCoLogMessage',{text:'服务器已关闭连接',from:'internal:SeparateMap',type:'warn'});
          }
        }
      }
      if(needRouteSearch){//向路由获取服务器地址
        let routeObject=null;
        if(this.$store.state.userRouteConfig.use!==null){
          //this.$store.commit('setCoLogMessage',{text:'正在从路由获取服务器地址',from:'internal:SeparateMap',type:'tip'});
          routeObject=this.$store.state.userRouteConfig.use;
          let address=routeObject.address;
          let port=routeObject.port;
          let enableSSL=this.$store.state.userSettingConfig.enableSSL;
          let agreement='http://';
          if(enableSSL){agreement='https://';}
          let makeUp=agreement+address+':'+port;//组合链接

          let instructObj={
            type:'get_route',
            data:{
              key:this.serverKey
            }
          };
          let jsonParams=JSON.stringify(instructObj);
          let xhr=new XMLHttpRequest();
          xhr.onreadystatechange=()=>{
            if (xhr.readyState===4){
              const jsonData=this.parseJson(xhr.responseText);
              if(jsonData===false){
                return false;
              }
              if(typeof jsonData==='object' && jsonData!==null){
                if(jsonData.hasOwnProperty('data') && jsonData.hasOwnProperty('type')){
                  if(typeof jsonData.data==='object' && jsonData.data!==null && jsonData.type==='send_route'){
                    if(jsonData.data.hasOwnProperty('url')){
                      if(this.isValidUrl(jsonData.data.url)){
                        Address=jsonData.data.url;
                        let tempLink=new WebSocket(Address);//尝试连接
                        tempLink.onopen=()=>{
                          this.tempLinked=true;
                          tempLink.close();//断开连接
                          this.$store.state.serverData.socket=new this.$store.state.classList.instructPipe(Address);//正式连接
                          this.$store.state.pageConfig.mapSeparateState=true;//展开地图主体
                          this.$store.state.pageConfig.homeSeparateState=false;//隐藏起始页
                        };
                        tempLink.onerror=()=>{
                          if(!this.tempLinked){
                            this.$store.commit('setCoLogMessage',{text:'服务器连接失败',from:'internal:SeparateMap',type:'warn'});
                          }
                        };
                        tempLink.onclose=()=>{
                          if(!this.tempLinked){
                            this.$store.commit('setCoLogMessage',{text:'服务器已关闭连接',from:'internal:SeparateMap',type:'warn'});
                          }
                        };
                      }
                    }
                  }
                }
              }
            }
          };
          xhr.open('POST',makeUp ,true);
          xhr.send(jsonParams);//发送请求
        }
      }
    },
    changeLoad(){//切换加载状态
      setTimeout(
        ()=>{
          if(this.$store.state.serverData.socket!==undefined){
            if(this.$store.state.serverData.socket.loadData===true && this.$store.state.serverData.socket.loadLayer===true){
              this.loading=false;
            }else {
              this.changeLoad();
            }
          }else {//2秒后再次检查是否加载完毕
            this.changeLoad();
          }
        }
      ,this.$store.state.pageConfig.loadingTime);
    },
    isValidUrl(url){//检测url是否正常正常则返回true
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    },
    parseJson(str){//校验并返回json
      try{
        return JSON.parse(str);
      }catch(e){
        return false;
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
    useBaseMap(){//使用虚拟地图还是现实地图
      return this.$store.state.baseMapConfig.enableBaseMap && this.$store.state.baseMapConfig.baseMapType==='realistic';
    },
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
    this.$store.commit('destroyInstructPipe');//主体被销毁时，一并重置数据
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
