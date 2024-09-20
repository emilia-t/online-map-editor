<template>
  <div class="BananaConnectionBox" @mouseenter.stop="playSoundEffect('do_1')"><!--连接盒子-->
    <div class="ConnectionImgBox"><!--图像-->
      <img class="ConnectionImg" alt="图片加载失败" v-if="ServerImage!==''" :src="ServerImage"/>
      <image-loading-failed v-if="ServerImage===''"/>
    </div>
    <router-link :to="`/m/${MyConfig.serverKey}`" title="点击打开地图"><div class="ImgBoxShadow" @mousedown.stop="playSoundEffect('confirm_1')"></div></router-link><!--阴影-->
    <div class="onlineNumber" title="在线人数"><!--左上角在线人数-->
      <span v-text="onlineNumberView"/>
    </div>
    <div class="ConnectionDetails"><!--底部信息-->
      <div>默认服务器</div>
      <div>{{MyConfig.serverAddress}}</div>
    </div>
    <div class="serverStatus" title="服务器在线状态" :style="`color:${onlineShowColor}`"><!--右下角的在线状态-->
      <span class="serverStatusSpan">{{onlineStatusText}}</span>
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px">
        <circle style="transition: 1s" r="5px" :fill="onlineShowColor" cx="10" cy="10" stroke-width="1"
                pointer-events="fill" fill-opacity="0.8"/>
      </svg>
    </div>
  </div>
</template>

<script>
  import ImageLoadingFailed from "../svgValidIcons/custom/imageLoadingFailed";

  export default {
    name: "BananaConnectionBoxDefault",
    components:{ImageLoadingFailed},
    data(){
      return {
        MyConfig:{
          version:this.version,
          account:this.account,
          password:this.password,
          p0X:null,
          p0Y:null,
          imgTime:this.imgTime,
          maxHeight:this.maxHeight,
          onlineNumber:this.onlineNumber,
          maxOnlineUser:this.maxOnlineUser,
          maxWidth:this.maxWidth,
          serverAddress:this.serverAddress,
          serverImg:this.serverImg,
          serverKey:this.serverKey,
          serverName:this.serverName,
          baseMapUrl:null,//0.4新增属性
          defaultLayer:null,
          defaultZoom:null,
          enableBaseMap:null,
          maxLayer:null,
          maxZoom:null,
          minHeight:null,
          minLayer:null,
          minWidth:null,
          minZoom:null,
          unit1X:null,
          unit1Y:null,
          defaultX:null,
          defaultY:null,
          resolutionX:null,
          resolutionY:null,
        },
        defaultServerAddress:"",
        onlineShowColor:'#ff1414',
        onlineStatusText:'offline',
        serverMenuShow:false
      }
    },
    props:{
      source:{
        type:String,
        default:'manual',
        required:false
      },
      version:{
        type:String,
        default:'0.1',
        required:false
      },
      account:{
        type:String,
        default:'',
        required:false
      },
      password:{
        type:String,
        default:'',
        required:false
      },
      defaultX:{
        type:String,
        default:'',
        required:false
      },
      defaultY:{
        type:String,
        default:'',
        required:false
      },
      imgTime:{
        type:String,
        default:'',
        required:false
      },
      maxHeight:{
        type:String,
        default:'',
        required:false
      },
      onlineNumber:{
        type:String,
        default:'',
        required:false
      },
      maxOnlineUser:{
        type:String,
        default:'',
        required:false
      },
      maxWidth:{
        type:String,
        default:'',
        required:false
      },
      serverAddress:{
        type:String,
        default:'',
        required:false
      },
      serverImg:{
        type:String,
        default:'',
        required:false
      },
      serverKey:{
        type:String,
        default:'',
        required:false
      },
      serverName:{
        type:String,
        default:'',
        required:false
      }
    },
    mounted() {
      this.getDefaultServer();
      this.startSetting();
    },
    methods:{
      getDefaultServer(){//获取默认服务器配置
        let protocol=window.location.protocol==="http:"?"ws://":"wss://";
        let hostname=window.location.hostname;
        this.defaultServerAddress=protocol + hostname + ":4433";
      },
      startSetting(){
        this.checkOnline(this.defaultServerAddress);
      },
      playSoundEffect(name){
        this.$store.commit('setCoEffectsSound',name);
      },
      isNotEmpty(value){//检测传入参数是否是null或空字符
        return value !== null && value !== '';
      },
      checkOnline(address){//检查服务器在线状态
        try {
          let tempCon=new WebSocket(address);
          setTimeout(()=>tempCon.close(),1500);//关闭测试连接
          tempCon.onopen=()=>{
            if(this.MyConfig.imgTime===''){//查询本地配置中此服务器的img更新时间，如果没有则申请时将time设置为1970年1月1日0时0分0秒
              this.MyConfig.imgTime='1970-01-01 00:00:00';
            }
            this.onlineShowColor='#2ffd6a';
            this.onlineStatusText='online';
            let json=JSON.stringify({type:'get_serverConfig'});//获取服务器配置 --发送获取服务器配置的指令，然后在获取完毕后关闭连接
            tempCon.send(json);
            let json2=JSON.stringify({type:'get_serverImg',data:{time:this.imgTime}});//获取服务器图像
            tempCon.send(json2);
          };
          tempCon.onmessage=(event)=>{
            let jsonData=JSON.parse(event.data);//1.解析数据//1.转化json
            if(jsonData.type!==undefined){//2.检测是否存在必要值'type'
              let nowType=jsonData.type;//3.处理数据
              switch (nowType){
                case 'send_serverConfig':{
                  this.MyConfig.version=jsonData.data.version!==undefined ? jsonData.data.version : this.MyConfig.version;
                  this.MyConfig.p0X=jsonData.data.p0_x!==undefined ? jsonData.data.p0_x : this.MyConfig.p0X;
                  this.MyConfig.p0Y=jsonData.data.p0_y!==undefined ? jsonData.data.p0_y : this.MyConfig.p0Y;
                  this.MyConfig.maxHeight=jsonData.data.max_height!==undefined ? jsonData.data.max_height : this.MyConfig.maxHeight;
                  this.MyConfig.onlineNumber=jsonData.data.online_number!==undefined ? jsonData.data.online_number+'' : this.MyConfig.onlineNumber;
                  this.MyConfig.maxOnlineUser=jsonData.data.max_online!==undefined ? jsonData.data.max_online : this.MyConfig.maxOnlineUser;
                  this.MyConfig.maxWidth=jsonData.data.max_width!==undefined ? jsonData.data.max_width : this.MyConfig.maxWidth;
                  this.MyConfig.serverKey=jsonData.data.key!==undefined ? jsonData.data.key : this.MyConfig.serverKey;
                  this.MyConfig.serverName=jsonData.data.name!==undefined ? jsonData.data.name : this.MyConfig.serverName;
                  this.MyConfig.baseMapUrl=jsonData.data.base_map_url!==undefined ? jsonData.data.base_map_url : this.MyConfig.baseMapUrl;
                  this.MyConfig.defaultLayer=jsonData.data.default_layer!==undefined ? jsonData.data.default_layer : this.MyConfig.defaultLayer;
                  this.MyConfig.defaultZoom=jsonData.data.default_zoom!==undefined ? jsonData.data.default_zoom : this.MyConfig.defaultZoom;
                  this.MyConfig.enableBaseMap=jsonData.data.enable_base_map!==undefined ? jsonData.data.enable_base_map : this.MyConfig.enableBaseMap;
                  this.MyConfig.maxLayer=jsonData.data.max_layer!==undefined ? jsonData.data.max_layer : this.MyConfig.maxLayer;
                  this.MyConfig.maxZoom=jsonData.data.max_zoom!==undefined ? jsonData.data.max_zoom : this.MyConfig.maxZoom;
                  this.MyConfig.minHeight=jsonData.data.min_height!==undefined ? jsonData.data.min_height : this.MyConfig.minHeight;
                  this.MyConfig.minLayer=jsonData.data.min_layer!==undefined ? jsonData.data.min_layer : this.MyConfig.minLayer;
                  this.MyConfig.minWidth=jsonData.data.min_width!==undefined ? jsonData.data.min_width : this.MyConfig.minWidth;
                  this.MyConfig.minZoom=jsonData.data.min_zoom!==undefined ? jsonData.data.min_zoom : this.MyConfig.minZoom;
                  this.MyConfig.unit1X=jsonData.data.unit1_x!==undefined ? jsonData.data.unit1_x : this.MyConfig.unit1X;
                  this.MyConfig.unit1Y=jsonData.data.unit1_y!==undefined ? jsonData.data.unit1_y : this.MyConfig.unit1Y;
                  this.MyConfig.defaultX=jsonData.data.default_x!==undefined ? jsonData.data.default_x : this.MyConfig.defaultX;
                  this.MyConfig.defaultY=jsonData.data.default_y!==undefined ? jsonData.data.default_y : this.MyConfig.defaultY;
                  this.MyConfig.resolutionX=jsonData.data.resolution_x!==undefined ? jsonData.data.resolution_x : this.MyConfig.resolutionX;
                  this.MyConfig.resolutionY=jsonData.data.resolution_y!==undefined ? jsonData.data.resolution_y : this.MyConfig.resolutionY;
                  let configObj={//更新本地配置
                    version:'',account:'',password:'',p0X:'',p0Y:'',imgTime:'',maxHeight:'',
                    onlineNumber:'',maxOnlineUser:'',maxWidth:'',serverAddress:'',serverImg:'',serverKey:'',
                    serverName:'',
                    baseMapUrl:'',defaultLayer:'',defaultZoom:'',enableBaseMap:'',maxLayer:'',
                    maxZoom:'',minHeight:'',minLayer:'',minWidth:'',minZoom:'',unit1X:'',
                    unit1Y:'',defaultX:'',defaultY:'',resolutionX:'',resolutionY:''
                  };
                  configObj.version=this.MyConfig.version;
                  configObj.account=this.MyConfig.account;
                  configObj.password=this.MyConfig.password;
                  configObj.p0X=this.MyConfig.p0X;
                  configObj.p0Y=this.MyConfig.p0Y;
                  configObj.imgTime=this.MyConfig.imgTime;
                  configObj.maxHeight=this.MyConfig.maxHeight;
                  configObj.onlineNumber=this.MyConfig.onlineNumber;
                  configObj.maxOnlineUser=this.MyConfig.maxOnlineUser;
                  configObj.maxWidth=this.MyConfig.maxWidth;
                  //configObj.serverAddress=this.MyConfig.serverAddress;
                  configObj.serverAddress=this.defaultServerAddress;
                  configObj.serverImg=this.MyConfig.serverImg;
                  configObj.serverKey=this.MyConfig.serverKey;
                  configObj.serverName=this.MyConfig.serverName;
                  configObj.baseMapUrl=this.MyConfig.baseMapUrl;
                  configObj.defaultLayer=this.MyConfig.defaultLayer;
                  configObj.defaultZoom=this.MyConfig.defaultZoom;
                  configObj.enableBaseMap=this.MyConfig.enableBaseMap;
                  configObj.maxLayer=this.MyConfig.maxLayer;
                  configObj.maxZoom=this.MyConfig.maxZoom;
                  configObj.minHeight=this.MyConfig.minHeight;
                  configObj.minLayer=this.MyConfig.minLayer;
                  configObj.minWidth=this.MyConfig.minWidth;
                  configObj.minZoom=this.MyConfig.minZoom;
                  configObj.unit1X=this.MyConfig.unit1X;
                  configObj.unit1Y=this.MyConfig.unit1Y;
                  configObj.defaultX=this.MyConfig.defaultX;
                  configObj.defaultY=this.MyConfig.defaultY;
                  configObj.resolutionX=this.MyConfig.resolutionX;
                  configObj.resolutionY=this.MyConfig.resolutionY;
                  if(this.source==='manual'){
                    let nowServersConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));//获取本地配置
                    if(nowServersConfig===false){//本地配置无servers 新增该配置
                      let newServersObj={};
                      newServersObj[configObj.serverAddress]=configObj;
                      this.$root.general_script.handleLocalStorage('set','servers',JSON.stringify(newServersObj));//更新localstorage
                    }
                    else{//更新该配置
                      nowServersConfig[configObj.serverAddress]=configObj;//找到与当前url匹配的项目
                      this.$root.general_script.handleLocalStorage('set','servers',JSON.stringify(nowServersConfig));//更新localstorage
                    }
                  }
                  this.MyConfig=configObj;
                  break;
                }
                case 'send_serverImg':{
                  this.MyConfig.serverImg=jsonData.data.string!==undefined ? jsonData.data.string : this.MyConfig.serverImg;
                  this.MyConfig.imgTime=jsonData.data.time!==undefined ? jsonData.data.time : this.MyConfig.imgTime;
                  if(this.source==='manual'){
                    let nowServersConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));//获取本地配置
                    nowServersConfig[this.MyConfig.serverAddress]['serverImg']=this.MyConfig.serverImg;//找到与当前url匹配的项目
                    nowServersConfig[this.MyConfig.serverAddress]['imgTime']=this.MyConfig.imgTime;
                    this.$root.general_script.handleLocalStorage('set','servers',JSON.stringify(nowServersConfig));//还原
                  }
                  break;
                }
              }
            }
          };
          tempCon.onerror=(event)=>{
            event.preventDefault();
            this.onlineShowColor='#ff1414';
            this.onlineStatusText='offline';
            tempCon.close();
          }
        }catch (e) {
        }
      }
    },
    computed:{
      onlineNumberView(){
        if(this.MyConfig.serverImg===''){
          return '';
        }else {
          return this.MyConfig.onlineNumber+' / '+this.MyConfig.maxOnlineUser;
        }
      },
      ServerImage(){
        if(this.serverImg===''){
          return this.MyConfig.serverImg;
        }else {
          return this.serverImg;
        }
      }
    }
  }
</script>

<style scoped>
  .BananaConnectionBox{
    z-index: 545;
    width: 220px;
    height: 230px;
    background: rgb(255,255,255);
    margin: 20px 30px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 1px 1px 4px rgb(200,200,200);
    position: relative;
    animation: scale_box 0.3s ease forwards;
  }
  .BananaConnectionBox:hover{
    animation: scale_box_hover 0.3s ease forwards;
  }
  @keyframes scale_box {
    0%{
      transform: scale(1.08);
    }
    100%{
      transform: scale(1);
    }
  }
  @keyframes scale_box_hover {
    0%{
      transform: scale(1);
    }
    100%{
      transform: scale(1.08);
    }
  }
  .ConnectionImg{
    width: 220px;
    height: auto;
    position: inherit;
    z-index:inherit;
  }
  .ConnectionImgBox{
    width: 220px;
    height: 165px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 505;
    top:0px;
  }
  .ImgBoxShadow {
    width: 220px;
    height: 165px;
    background: linear-gradient(to bottom,rgba(0,0,0,.3),rgba(0,0,0,0) 68px);
    position: absolute;
    z-index: 550;
    top:0px;
    cursor: pointer;
  }
  .ConnectionDetails{
    width: calc(100% - 18px);
    height: calc(65px - 18px);
    position: absolute;
    bottom: 0px;
    z-index: 550;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 9px;
  }
  .ConnectionDetails div{
    user-select: text;
    font-weight: 200;
    font-size: 13px;
  }
  .onlineNumber{
    width: 60px;
    height: 40px;
    position: absolute;
    top:0px;
    left: 0px;
    z-index: 550;
    display: flex;
    justify-content: center;
    align-content: center;
    font-size: 13px;
    font-weight: 800;
    line-height: 26px;
    flex-wrap: wrap;
    color: white;
  }
  .moreBoard span{
    width: calc(100% - 4px);
    min-height: 26px;
  }
  .serverStatus{
    transition: 1s;
    background: rgba(255,255,255,0.35);
    position: absolute;
    bottom: 65px;
    right: 0px;
    z-index: 550;
    width: 60px;
    height: 20px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-content: center;
    border-top-left-radius:3px;
  }
  .serverStatusSpan{
    width: auto;
    height: inherit;
    font-size: 10px;
    line-height: 20px;
    letter-spacing: 1px;
  }
</style>
