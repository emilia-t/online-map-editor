<template>
  <!--旧的版本-登录面板-->
<div class="linkPage" v-if="display">
  <div class="linkPageBox">
    <!--表头-->
    <div class="linkPageTitle">欢迎登录 <span style="color:#282828;text-decoration: underline" @click="closePage()">关闭</span></div>
    <div class="linkPageText">账号</div>
    <div class="linkPageUser" @click="" contenteditable="true" ref="linkPageUser"></div>
    <div class="linkPageText">密码</div>
    <div class="linkPagePassword" contenteditable="true" ref="linkPagePassword"></div>
    <div class="linkInButton" @click="sendLinkRequest()">登录</div>
    <!--侧边动效-->
<!--    <div class="linkPageBlock01"></div>-->
<!--    <div class="linkPageBlock02"></div>-->
<!--    <div class="linkPageBlock03"></div>-->
<!--    <div class="linkPageBlock04"></div>-->
<!--    <div class="linkPageBlock05"></div>-->
<!--    <div class="linkPageBlock06"></div>-->
<!--    <div class="linkPageBlock07"></div>-->
  </div>
</div>
</template>

<script>
export default {
  name: "linkPage",
  data(){
    return {
      linkUserId:"",
      linkPassword:"",
      display:false,
      websocket:null
    }
  },
  methods:{
    closePage(){
      this.display=false
    },
    openPage(){
      this.display=true
    },
    sendLinkRequest(){
      let uid=this.linkUserId=this.$refs.linkPageUser.innerText;
      let pwd=this.linkUserId=this.$refs.linkPagePassword.innerText;
      //{"mestype":"link","username":"临冉","password":"123456789"}
      let obj={"mestype":"link","username":uid,"password":pwd}
      let send=JSON.stringify(obj)
      this.websocket.send(send)
    },
    //连接至服务器
    linkToDefaultServer(){
      //1创建websocket对象
      if(this.websocket===null){
        this.websocket=new WebSocket("ws://192.168.1.105:9998")
      }else {

      }
      //2监听对象
      this.websocket.onmessage=function (event){
        console.log(event.data)
      }
    }
  },
  watch:{

  },
  mounted() {
    this.linkToDefaultServer();
  }
}
</script>

<style scoped>
.linkPage{width: 500px;height: 330px;position:fixed;z-index: 450;}
.linkPageBox{width: 500px;height: 330px;background: rgba(208, 232, 255, 0.8);position:fixed;z-index: 450;overflow: hidden;border-radius: 10px;position:fixed;left: calc(50% - 250px);top: calc(50% - 150px);}
.linkPageTitle{width: auto;height: 30px;font-size: 22px;padding: 30px 30px 30px 30px;cursor:default}
.linkPageText{font-size: 20px;padding: 10px 30px;cursor:default}
.linkPageUser{width: 400px;background: rgba(255, 255, 255, 0.8);height: 40px;border-radius: 12px;margin: 0px 30px;border: 1px solid #c6c6c6;font-size: 20px;text-indent: 20px;line-height: 40px}
.linkPagePassword{width: 400px;background: rgba(255, 255, 255, 0.8);height: 40px;border-radius: 12px;margin: 0px 30px;border: 1px solid #c6c6c6;font-size: 20px;text-indent: 20px;line-height: 40px}
.linkInButton{width: 100px;height: 30px;margin: 20px 30px;font-size: 20px;background: rgba(253, 253, 253, 0.8);text-align: center;line-height: 30px;border-radius: 10px;cursor:default}
/**/
@keyframes float {
  0%{height: 95px}
  33%{height: 100px}
  66%{height: 105px}
  100%{height: 100px;}
}
.linkPageBlock01{animation: float 0.7s forwards;width: 30px;height: 100px;background: #4aa744;z-index: 401;transform: rotate(-45deg);border-radius: 30px}
.linkPageBlock02{animation: float 0.7s forwards;width: 30px;height: 100px;background: #4aa744;z-index: 401;transform: rotate(-45deg);border-radius: 30px}
.linkPageBlock03{float: right;width: 30px;height: 100px;background: #4aa744;z-index: 401;transform: rotate(37deg);border-radius: 20px}
.linkPageBlock04{float: right;width: 30px;height: 100px;background: #4aa744;z-index: 401;transform: rotate(-45deg);border-radius: 30px}
.linkPageBlock05{float: right;width: 50px;height: 120px;background: #4aa744;z-index: 401;transform: rotate(-45deg);border-radius: 50px}
.linkPageBlock06{float: right;width: 100px;height: 120px;background: #4aa744;z-index: 401;transform: rotate(-45deg);border-radius: 50px}
.linkPageBlock07{float: right;width: 50px;height: 60px;background: #4aa744;z-index: 401;transform: rotate(-45deg);border-radius: 50px}
</style>
