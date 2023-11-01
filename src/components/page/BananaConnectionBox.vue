<template>
<div class="BananaConnectionBox"><!--连接盒子-->
  <div class="ConnectionImgBox"><!--图像-->
    <img class="ConnectionImg" alt="服务器显示图" :src="serverImg"/>
  </div>
  <router-link :to="`/m/${serverKey}`" title="点击打开地图"><div class="ImgBoxShadow"></div></router-link><!--阴影-->
  <div class="downloadButtonBox" title="下载OMS文件" @click="downLoad()"><!--右上角更多属性按钮-->
    <download></download>
  </div>
  <div class="moreButtonBox" title="点击查看更多" @click="openDetailBoard()"><!--右上角更多属性按钮-->
    <svg t="1681047402121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33387" width="200" height="200"><path d="M288 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" p-id="33388" data-spm-anchor-id="a313x.7781069.0.i32" class="selected"></path><path d="M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" p-id="33389" data-spm-anchor-id="a313x.7781069.0.i33" class="selected"></path><path d="M736 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" p-id="33390" data-spm-anchor-id="a313x.7781069.0.i34" class="selected"></path></svg>
  </div>
  <div class="onlineNumber" title="在线人数"><!--左上角在线人数-->
    <span>{{onlineNumber}} / {{maxOnlineUser}}</span>
  </div>
  <div class="ConnectionDetails"><!--底部信息-->
    <div>{{serverName}}</div>
    <div>{{serverAddress}}</div>
    <div>{{account}}</div>
  </div>
  <div class="moreBoard" ref="moreBoard"><!--点击更多显示信息-->
    <div class="moreBoardClose" title="点击关闭" @click="closeDetailBoard">
      <svg t="1681049938063" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34516" width="200" height="200"><path d="M235.403636 182.178909l270.475637 270.498909L776.401455 182.178909a58.181818 58.181818 0 1 1 82.292363 82.292364L588.171636 534.946909 858.693818 805.469091a58.181818 58.181818 0 1 1-82.292363 82.269091L505.879273 617.239273 235.403636 887.738182A58.181818 58.181818 0 0 1 153.134545 805.469091l270.475637-270.522182L153.134545 264.471273a58.181818 58.181818 0 0 1 82.269091-82.292364z" fill="#282C33" p-id="34517"></path></svg>
    </div>
    <span>服务器Key：{{serverKey}}</span>
    <span>最大在线人数：{{MyConfig.maxOnlineUser}}</span>
    <span>最大宽度：{{MyConfig.maxWidth}}</span>
    <span>最小宽度：{{MyConfig.minWidth}}</span>
    <span>最大高度：{{MyConfig.maxHeight}}</span>
    <span>最小高度：{{MyConfig.minHeight}}</span>
    <span>默认点X：{{MyConfig.p0X}}</span>
    <span>默认点Y：{{MyConfig.p0Y}}</span>
    <span>横轴单位1：{{MyConfig.unit1X}}</span>
    <span>纵轴单位1：{{MyConfig.unit1Y}}</span>
    <span>最大层级：{{MyConfig.maxLayer}}</span>
    <span>最小层级：{{MyConfig.minLayer}}</span>
    <span>默认层级：{{MyConfig.defaultLayer}}</span>
    <span>是否启用底图：{{MyConfig.enableBaseMap}}</span>
    <span>最大底图缩放数：{{MyConfig.maxZoom}}</span>
    <span>最小底图缩放数：{{MyConfig.minZoom}}</span>
    <span>默认底图缩放数：{{MyConfig.defaultZoom}}</span>
    <span>中心点X：{{MyConfig.defaultX}}</span>
    <span>中心点Y：{{MyConfig.defaultY}}</span>
    <span>分辨率：{{MyConfig.resolutionX}}×{{MyConfig.resolutionY}}</span>
  </div>
  <div class="serverDelete" ref="serverDelete" title="点击删除服务器"><!--左下角的删除按钮-->
    <svg t="1682340682455" ref="serverDeleteIcon" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10839" width="200" height="200"><path d="M585.27998 767.998465 585.27998 365.722472c0-46.879704 73.238025-46.879704 73.238025 0l0 402.275993C658.518005 814.883285 585.27998 814.883285 585.27998 767.998465L585.27998 767.998465 585.27998 767.998465zM365.500415 767.998465 365.500415 365.722472c0-46.879704 73.271794-46.879704 73.271794 0l0 402.275993C438.771185 814.883285 365.500415 814.883285 365.500415 767.998465L365.500415 767.998465 365.500415 767.998465zM988.190423 182.861748 805.060569 182.861748l0-73.16844c0-60.576657-49.247634-109.692285-108.754936-109.692285L328.879356 0.001023c-60.673871 0-109.887736 49.116651-109.887736 109.692285l0 73.16844L35.860742 182.861748c-46.949288 0-46.949288 73.104995 0 73.104995l952.32968 0C1035.104919 255.966743 1035.104919 182.861748 988.190423 182.861748L988.190423 182.861748 988.190423 182.861748zM292.26239 109.692285c0-19.428491 17.158798-36.58729 36.615942-36.58729l367.426277 0c19.459191 0 35.484166 14.863523 35.484166 36.58729l0 73.16844L292.26239 182.860724 292.26239 109.692285 292.26239 109.692285zM768.410857 1024 255.607562 1024c-60.640102 0-109.853967-49.111534-109.853967-109.687168L145.753595 365.722472c0-21.723767 17.158798-36.586267 36.615942-36.586267 19.462261 0 36.621059 14.862499 36.621059 36.586267l0 548.589336c0 19.389606 17.192567 36.547381 36.615942 36.547381l512.803295 0c19.457144 0 36.649711-17.157775 36.649711-36.547381L805.059546 366.855272c0-48.012504 73.238025-48.012504 73.238025 0l0 547.456536C878.298594 974.888466 829.084729 1024 768.410857 1024L768.410857 1024zM768.410857 1024" fill="#272636" p-id="10840"></path></svg>
  </div>
  <div class="serverStatus" title="服务器在线状态" :style="`color:${onlineShowColor}`"><!--右下角的在线状态-->
    <span class="serverStatusSpan">{{onlineStatusText}}</span>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px">
      <circle style="transition: 1s" r="5px" :fill="onlineShowColor" cx="10" cy="10" stroke-width="1" pointer-events="fill" fill-opacity="0.8"></circle>
    </svg>
  </div>
</div>
</template>

<script>
import Download from "../svgValidIcons/download";
export default {
  name: "BananaConnectionBox",
  components:{Download},
  data(){
    return {
      MyConfig:{
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
      onlineShowColor:'#ff1414',
      onlineStatusText:'offline',
      serverMenuShow:false
    }
  },
  props:{
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
      required:true
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
    this.startSetting();
  },
  methods:{
    startSetting(){
      let setObj=JSON.parse(this.$root.general_script.handleLocalStorage('get','settings'));//0.获取本地配置(设置)
      if(setObj.set_GS_AutoCheckServerStatus==true){//1.检测服务器在线状态（在线的情况下会主动更新服务器配置）
        this.checkOnline(this.serverAddress);
      }
      this.appendDeleteServer();//删除按钮添加删除服务器的事件
    },
    deleteServer(){//删除服务器
      let Config=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));//1.查询本地存储
      delete Config[this.MyConfig.serverAddress];
      this.$root.general_script.handleLocalStorage('set','servers',JSON.stringify(Config));//2.重写localstorage
      this.$store.commit('setCoLogMessage',{text:'已删除服务器',from:'internal:BananaConnectionBox',type:'tip'});
      this.$emit('ancBoxChange','reload');//传告Interface
    },
    appendDeleteServer(){//给删除按钮添加事件
      this.$refs.serverDelete.addEventListener('click',(ev)=>{
        ev.stopPropagation();
        this.deleteServer();
      })
    },
    checkOnline(address){//检查服务器在线状态
      try {
        let tempCon=new WebSocket(address);
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
          setTimeout(()=>tempCon.close(),500);//关闭测试连接
        }
        tempCon.onmessage=(event)=>{
          let jsonData=JSON.parse(event.data);//1.解析数据//1.转化json
          if(jsonData.type!==undefined){//2.检测是否存在必要值'type'
            let nowType=jsonData.type;//3.处理数据
            switch (nowType){
              case 'send_serverConfig':{
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
                  account:'',password:'',p0X:'',p0Y:'',imgTime:'',maxHeight:'',
                  onlineNumber:'',maxOnlineUser:'',maxWidth:'',serverAddress:'',serverImg:'',serverKey:'',
                  serverName:'',
                  baseMapUrl:'',defaultLayer:'',defaultZoom:'',enableBaseMap:'',maxLayer:'',
                  maxZoom:'',minHeight:'',minLayer:'',minWidth:'',minZoom:'',unit1X:'',
                  unit1Y:'',defaultX:'',defaultY:'',resolutionX:'',resolutionY:''
                };
                configObj.account=this.MyConfig.account;
                configObj.password=this.MyConfig.password;
                configObj.p0X=this.MyConfig.p0X;
                configObj.p0Y=this.MyConfig.p0Y;
                configObj.imgTime=this.MyConfig.imgTime;
                configObj.maxHeight=this.MyConfig.maxHeight;
                configObj.onlineNumber=this.MyConfig.onlineNumber;
                configObj.maxOnlineUser=this.MyConfig.maxOnlineUser;
                configObj.maxWidth=this.MyConfig.maxWidth;
                configObj.serverAddress=this.MyConfig.serverAddress;
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
                let nowServersConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));//获取本地配置
                nowServersConfig[configObj.serverAddress]=configObj;//找到与当前url匹配的项目
                this.$root.general_script.handleLocalStorage('set','servers',JSON.stringify(nowServersConfig));//更新localstorage
                this.MyConfig=configObj;
                break;
              }
              case 'send_serverImg':{
                this.MyConfig.serverImg=jsonData.data.string!==undefined ? jsonData.data.string : this.MyConfig.serverImg;
                this.MyConfig.imgTime=jsonData.data.time!==undefined ? jsonData.data.time : this.MyConfig.imgTime;
                let nowServersConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));//获取本地配置
                nowServersConfig[this.MyConfig.serverAddress]['serverImg']=this.MyConfig.serverImg;//找到与当前url匹配的项目
                nowServersConfig[this.MyConfig.serverAddress]['imgTime']=this.MyConfig.imgTime;
                this.$root.general_script.handleLocalStorage('set','servers',JSON.stringify(nowServersConfig));//还原
                this.MyConfig.serverImg=jsonData.data.string;//更新组件
                this.MyConfig.imgTime=jsonData.data.time;
                break;
              }
            }
          }
        }
        tempCon.onerror=(event)=>{
          event.preventDefault();
          this.onlineShowColor='#ff1414';
          this.onlineStatusText='offline';
          tempCon.close();
        }
      }catch (e) {
      }
    },
    downLoad(){
      let account=this.account;
      let password=null;
      let serverName=this.serverName;
      let serverAddress=this.serverAddress;
      let localAccounts=JSON.parse(window.localStorage.getItem('accounts'));
      for(let key in localAccounts){
        if(key===account){
          password=localAccounts[key].P;
        }
      }
      let OMS={
        oms:'oms',
        version:'1.0',
        account,
        password,
        serverName,
        serverAddress,
      };
      const file=new Blob([JSON.stringify(OMS)], {type: 'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = serverName+'.oms';
      a.click();
    },
    openDetailBoard(){
      this.$refs.moreBoard.style.top='0px';
    },
    closeDetailBoard(){
      this.$refs.moreBoard.style.top='-170px';
    }
  }
}
</script>

<style scoped>
.serverDelete{
  z-index: 550;
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 65px;
  left:0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: white;
  border-top-right-radius: 3px;
}
.serverDelete svg{
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  z-index: inherit;
}
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
.downloadButtonBox{
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0px;
  right: 40px;
  z-index: 550;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.moreButtonBox{
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 550;
  cursor: pointer;
}
.icon{
  width: inherit;
  height: inherit;
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
.moreBoard{
  display: flex;
  width: calc(220px -  20px);
  height: calc(165px - 10px);
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(255,255,255,0.95);
  position: absolute;
  top: -170px;
  right: 0px;
  z-index: 555;
  justify-content: flex-start;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 5px 10px;
  font-weight: 200;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0,0,0,0.8);
  transition: 0.3s;
}
.moreBoardClose{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  right:10px;
  z-index: 555;
  cursor: pointer;
}
.serverStatus{
  transition: 1s;
  background: rgba(255,255,255,0.35);
  position: absolute;
  bottom: 65px;
  right: 0px;
  z-index: 550;
  width: 70px;
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
