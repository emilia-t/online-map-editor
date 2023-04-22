<template>
<div class="connectionInterfaceLayer">
  <div class="strip">

  </div>
  <!--主内容-->
  <div class="content">
    <!--顶部-->
    <div class="InterfaceHead">
      <!--标题-->
      <div class="HeadLeft">
        <svg t="1681041457556" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27339" width="200" height="200"><path d="M0 0" fill="" p-id="27340"></path><path d="M128 608h768v192H128v-192z m0-256h768v192H128v-192z m32-140.8h704l28.8 73.6H131.2L160 211.2zM131.2 160L64 284.8V864h896V284.8L896 160H131.2z" fill="" p-id="27341"></path><path d="M768 416h64v64h-64zM768 672h64v64h-64z" fill="" p-id="27342"></path></svg>
        <span class="InterfaceHeadTitle">服务器列表</span>
      </div>
      <!--创建新链接按钮-->
      <svg t="1681030518295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26321" width="200" height="200"><path d="M546.133333 479.662933h360.533334a32 32 0 1 1 0 64H546.133333v364.8a32 32 0 1 1-64 0v-364.8H117.333333a32 32 0 1 1 0-64H482.133333v-360.533333a32 32 0 0 1 64 0v360.533333z" fill="#333333" p-id="26322"></path></svg>
    </div>
    <!--连接盒子-->
    <hr/>
    <div class="connectionInterfaceBox">
      <banana-connection-box v-for="config in serverLocalConfig" :key="config.serverKey" :server-key="config.serverKey" :account="config.account" :server-address="config.serverAddress" :server-name="config.serverName" :server-img="config.serverImg"></banana-connection-box>
    </div>
  </div>
  <!--添加连接的面板-->
  <div class="addNewConnectBox">
    <!--中间的实际面板-->
    <div class="addNewConnectBoard">

    </div>
  </div>
</div>
</template>

<script>
import BananaConnectionBox from "./BananaConnectionBox"
export default {
  name: "LayerConnectionInterface",
  data(){
    return {

    }
  },
  components:{
    BananaConnectionBox
  },
  computed:{
    serverLocalConfig(){
      return this.$store.state.serverData.serverListConfig
    }
  },
  beforeDestroy(){
    console.log("即将销毁")
  }
}
</script>

<style scoped>
.addNewConnectBoard{
  width: 400px;
  height: 300px;
  background: #c7c7c7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  position: fixed;
  top: calc(50% - 150px);
  left: calc(50% - 200px);
}
.strip{
  width: 100%;
  height: 8px;
}
.content{
  width: calc(100% - 100px - 2px - 16px);
  height: calc(100% - 8px - 16px - 2px);
  margin: 0px 8px 8px 108px;
  border-radius: 4px;
  border: 1px solid rgb(220,220,220);
}
.addNewConnectBox{
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8);
  position: fixed;
  top:0px;
  left: 0px;
  z-index: 570;
  /*display: none;*/
}
.connectionInterfaceLayer{
  width: 100%;
  height:100%;
}
.InterfaceHead{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon{
  width: 30px;
  height: 30px;
  padding: 0px 40px 0px 0px;
}
.InterfaceHeadTitle{
  font-size: 20px;
  font-weight: 400;
  letter-spacing:4px
}
.HeadLeft{
  width: 260px;
  display: flex;
  justify-content: center;
  align-content: center;
}
.connectionInterfaceBox{
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
