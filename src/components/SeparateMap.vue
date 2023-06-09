<template>
<div id="SeparateMap" v-if="mapSeparateState">
  <!--背景层-->
  <!--用于显示背景，例如谷歌给地图-->
  <layer-background v-if="this.$store.state.leafletConfig.enableBaseMap"></layer-background>
  <!--地图应用主体-->
  <!--用户层-->
  <!--用于显示用户数据-->
  <layer-user :server-key="serverKey"></layer-user>
  <!--数据层-->
  <!--用于显示(view)和添加(new)数据用-，其下的子组件例如svgLine组件拥有移动(move)，缩放(scale)、编辑(edit)、删除(del)的功能-->
  <layer-data></layer-data>
  <!--消息层-->
  <!--显示编辑历史等信息-->
  <layer-message></layer-message>
  <!--标尺层-->
  <!--用于显示上策和左侧经纬度标尺-->
<!--  <layer-ruler></layer-ruler>-->
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
    //setInterval(()=>console.log(this.$store.state.serverData.socket.config),2000)
  },
  methods:{
    //初始连接服务器
    startSetting(){
      /**
       * 由于0.4版本将很多配置交给了服务器进行设置在这一步中还需要更新这些配置：
       * （在地图被销毁阶段还需要恢复配置$store.mutations.restore）
       * 1.更新最大高度(y轴的最大值)(mapConfig.mapSize)
       * 2.更新最小高度(y轴的最小值)
       * 3.更新最大宽度(x轴最大值)
       * 4.更新最小宽度(x轴最小值)
       * 4.更新最大层级(layer最大值)
       * 5.更新最小层级(layer最小值)
       * 6.更新默认层级(layer默认值)
       * 7.更新缩放比(zoomAdd和zoomSub值)
       * 8.更新横轴单位1(unit1X值)
       * 9.更新纵轴单位1(unit1Y值)
       * 如果有启用底图服务则：
       * 10.更新enableBaseMap(leafletConfig内)
       * 11.更新最大底图缩放等级(zoom最大值)
       * 12.更新最小底图缩放等级(zoom最小值)
       * 13.更新默认底图缩放等级(zoom默认值)
       * 14.更新底图URL(baseLayer值)
       * */
        //0.检测serverKey是否再服务器列表中由配置数据
        //获取本地服务器配置
      let serverLocalConfig=this.$root.general_script.handleLocalStorage('get','servers');
      let find=false;
      let Address='';
      if(serverLocalConfig===false){
        this.$root.general_script.alert_tips('本地服务器配置为空');
        return false;
      }else {
        //获取所有配置
        let allServerList=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));//注意正常会获取到一个数组[{serverConfigObj}...]
        //查找是否存在此配置
        for(let key in allServerList){
          //检测是否存在key
          if(allServerList[key].hasOwnProperty('serverKey')){
            //检测是否存在url
            if(allServerList[key].hasOwnProperty('serverAddress')){
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
      //找到了配置信息
      if(find){
        //显示提示信息
        this.$root.general_script.alert_tips('正在连接服务器，请稍后...');
        //尝试连接
        let tempLink=new WebSocket(Address);
        tempLink.onopen=()=>{
          //显示提示信息
          this.$root.general_script.alert_tips('连接成功');
          this.tempLinked=true;
          //断开连接
          tempLink.close();
          //正式连接
          this.$store.state.serverData.socket=new this.$store.state.classList.comprehensive(Address);
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
    //初始化地图、底图配置
    initializeConfig(config){
      //几个检测函数
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
          // 先尝试将字符串类型的数字转换为数字类型
          if (typeof value === 'string' && !isNaN(value)) {
            return parseFloat(value);
          }
          // 使用 isNaN 函数判断是否为数字
          let ref=typeof value === 'number' && !isNaN(value);
          if(ref){
            return parseFloat(value);
          }else {
            return ref
          }
        },
      }
      if(!QIR.isObject(config)){return false;}
      //检查是否存在，一些必要的选项：
      //p0_x\p0_y
      //max_height\min_height\max_width\min_width
      //max_layer\min_layer\default_layer
      //unit1_x\unit1_y

      //检测是否存在default_x
      if(QIR.hasProperty(config,'p0_x')!==false){
        this.$store.state.mapConfig.p0.point.x=QIR.returnNumber(config['p0_x']);
      }
      //检测是否存在default_x
      if(QIR.hasProperty(config,'p0_y')!==false){
        this.$store.state.mapConfig.p0.point.y=QIR.returnNumber(config['p0_y']);
      }
      //map size
      if(QIR.hasProperty(config,'max_height')!==false){
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
      //layer
      if(QIR.hasProperty(config,'max_layer')!==false){
        this.$store.state.cameraConfig.maxZoom=QIR.returnNumber(config['max_layer']);
      }
      if(QIR.hasProperty(config,'min_layer')!==false){
        this.$store.state.cameraConfig.minZoom=QIR.returnNumber(config['min_layer']);
      }
      //unit
      if(QIR.hasProperty(config,'unit1_x')!==false){
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
        let add=QIR.returnNumber(config['zoom_add'])
        this.$store.state.mapConfig.zoomAdd=add;
        this.$store.state.mapConfig.zoomSub=(Math.pow(1+add,-1))-1;//(Math.pow(1+1,-1))-1
      }
      //地图底图相关配置，如果启用的话：
      //enable_base_map\max_zoom\min_zoom\default_zoom\default_x\default_y
      //resolution_x\resolution_y
      //base_map_url
      if(QIR.hasProperty(config,'enable_base_map')!==false){
        this.$store.state.leafletConfig.enableBaseMap=config['enable_base_map'];
        if(config['enable_base_map']===true){
          if(QIR.hasProperty(config,'max_zoom')!==false){
            this.$store.state.leafletConfig.options.maxZoom=QIR.returnNumber(config['max_zoom']);
          }
          if(QIR.hasProperty(config,'min_zoom')!==false){
            this.$store.state.leafletConfig.options.minZoom=QIR.returnNumber(config['min_zoom']);
          }
          if(QIR.hasProperty(config,'default_zoom')!==false){
            this.$store.state.leafletConfig.options.zoom=QIR.returnNumber(config['default_zoom']);
          }
          if(QIR.hasProperty(config,'base_map_url')!==false){
            this.$store.state.leafletConfig.baseLayer=config['base_map_url'];
          }
          if(QIR.hasProperty(config,'default_x')!==false){
            this.$store.state.leafletConfig.options.center[1]=QIR.returnNumber(config['default_x']);
          }
          if(QIR.hasProperty(config,'default_y')!==false){
            this.$store.state.leafletConfig.options.center[0]=QIR.returnNumber(config['default_y']);
          }
          if(QIR.hasProperty(config,'resolution_x')!==false){
            this.$store.state.leafletConfig.resolution.width=QIR.returnNumber(config['resolution_x']);
          }
          if(QIR.hasProperty(config,'resolution_y')!==false){
            this.$store.state.leafletConfig.resolution.height=QIR.returnNumber(config['resolution_y']);
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
      handler(newValue,oldValue){
        if(newValue!==null){
          this.startSetting();
        }
      }
    },
    serverConfig:{
      handler(newValue){
        if(newValue.key!==undefined){
          this.initializeConfig(newValue)
        }
      },
      deep:true
    }
  },
  destroyed(){
    //主体被销毁时，一并重置数据
    this.$store.commit('destroyComprehensive');
    this.$store.commit('restoreCameraConfig');
    this.$store.commit('restoreLeafletConfig');
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
