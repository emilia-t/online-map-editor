<template>
  <!--连接盒子-->
<div class="BananaConnectionBox">
  <!--图像-->
  <div class="ConnectionImgBox">
    <img class="ConnectionImg" alt="服务器显示图" :src="serverImg"/>
  </div>
  <!--阴影-->
  <router-link :to="`/m/${serverKey}`"><div class="ImgBoxShadow" @click="manualConnection()"></div></router-link>
  <!--右上角更多属性按钮-->
  <div class="moreButtonBox" @click="openDetailBoard">
    <svg t="1681047402121" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33387" width="200" height="200"><path d="M288 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" p-id="33388" data-spm-anchor-id="a313x.7781069.0.i32" class="selected"></path><path d="M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" p-id="33389" data-spm-anchor-id="a313x.7781069.0.i33" class="selected"></path><path d="M736 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#ffffff" p-id="33390" data-spm-anchor-id="a313x.7781069.0.i34" class="selected"></path></svg>
  </div>
  <!--左上角在线人数-->
  <div class="onlineNumber">
    <span>{{onlineNumber}} / {{serverMaxOnlineNumber}}</span>
  </div>
  <!--底部信息-->
  <div class="ConnectionDetails">
    <div>{{serverName}}</div>
    <div>{{serverAddress}}</div>
    <div>{{account}}</div>
  </div>
  <!--点击更多显示信息-->
  <div class="moreBoard" ref="moreBoard">
    <div class="moreBoardClose" @click="closeDetailBoard">
      <svg t="1681049938063" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34516" width="200" height="200"><path d="M235.403636 182.178909l270.475637 270.498909L776.401455 182.178909a58.181818 58.181818 0 1 1 82.292363 82.292364L588.171636 534.946909 858.693818 805.469091a58.181818 58.181818 0 1 1-82.292363 82.269091L505.879273 617.239273 235.403636 887.738182A58.181818 58.181818 0 0 1 153.134545 805.469091l270.475637-270.522182L153.134545 264.471273a58.181818 58.181818 0 0 1 82.269091-82.292364z" fill="#282C33" p-id="34517"></path></svg>
    </div>
    <span>服务器Key：{{serverKey}}</span>
    <span>最大在线人数：{{serverMaxOnlineNumber}}</span>
    <span>最大宽度：{{serverMaxWidth}}</span>
    <span>最大高度：{{serverMaxHeight}}</span>
    <span>默认点X：{{serverDefaultPointX}}</span>
    <span>默认点Y：{{serverDefaultPointY}}</span>
  </div>
  <!--右下角的在线状态-->
  <div class="serverStatus" :style="`color:${onlineShowColor}`">
    <span class="serverStatusSpan">{{onlineStatusText}}</span>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px">
      <circle style="transition: 1s" r="5px" :fill="onlineShowColor" cx="10" cy="10" stroke-width="1" pointer-events="fill" fill-opacity="0.8"></circle>
      <!--
      初始化时(开始页面)需要立刻检测服务器在线情况，在线则亮绿灯，不在线则亮红灯，或者用其他的方式，总之需要简明
      左侧的菜单面板在地图主体被打开后需要关闭，以及设置内容需要做
      常规里面的设置：开启默认登录、默认保存本地服务器配置、默认保存账号

      显示内的设置：显示标尺、右下角显示鼠标坐标、显示历史编辑id

      账户内显示：已经存储的账户、
      -->
    </svg>
  </div>
</div>
</template>

<script>
export default {
  name: "BananaConnectionBox",
  data(){
    return {
      onlineShowColor:'#ff1414',
      onlineStatusText:'offline'
    }
  },
  props:{
    serverKey:{
      type:String,
      default:'0',
      required:true
    },
    account:{
      type:String,
      default:'没有用户账户'
    },
    serverAddress:{
      type:String,
      default:'没有服务器地址',
      required:true
    },
    serverName:{
      type:String,
      default:'在线地图服务器',
      required:true
    },
    serverImg:{
      type:String,
      default:'data:image/png;base64,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'
    },
    //在线人数
    onlineNumber:{
      type:String,
      default:'0'
    },
    //这些时服务器的一些隐式信息，点击右上角的三个点可以查看
    //服务器地图最大宽度(左右)
    serverMaxWidth:{
      type:String,
      default:'不明'
    },
    //服务器地图最大高度(上下)
    serverMaxHeight:{
      type:String,
      default:'不明'
    },
    //服务器地图默认起始位置x
    serverDefaultPointX:{
      type:String,
      default:'不明'
    },
    //服务器地图默认起始位置y
    serverDefaultPointY:{
      type:String,
      default:'不明'
    },
    //服务器最大允许在线人数
    serverMaxOnlineNumber:{
      type:String,
      default:'∞'
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      //1.检测服务器在线状态
      this.checkOnline(this.serverAddress);
      //2.每隔一段时间检查
      setInterval(
        ()=>{
          if(this.$store.state.userSettingConfig.autoUpdateServerStatus){
            this.checkOnline(this.serverAddress);
          }
        }
      ,this.$store.state.userSettingConfig.autoUpdateServerStatusTime)
    },
    checkOnline(address){
      try {
        let tempCon=new WebSocket(address);
        tempCon.onopen=()=>{
          this.onlineShowColor='#2ffd6a';
          this.onlineStatusText='online';
          tempCon.close();
        }
        tempCon.onerror=(event)=>{
          event.preventDefault();
          this.onlineShowColor='#ff1414';
          this.onlineStatusText='offline';
          tempCon.close();
        }
        tempCon.addEventListener('error', (event) => {

        });
      }catch (e) {
      }
    },
    openDetailBoard(){
      this.$refs.moreBoard.style.top='0px';
    },
    closeDetailBoard(){
      this.$refs.moreBoard.style.top='-170px';
    },
    //手动连接
    manualConnection(){

    }
  }
}
</script>

<style scoped>
.BananaConnectionBox{
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
.moreBoard{
  display: flex;
  width: calc(220px -  20px);
  height: calc(165px - 10px);
  background: rgba(255,255,255,0.95);
  position: absolute;
  top: -170px;
  right: 0px;
  z-index: 555;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
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
  z-index: 560;
  width: 70px;
  height: 20px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-content: center;
  border-radius: 2px;
}
.serverStatusSpan{
  width: auto;
  height: inherit;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 1px;
}
</style>
