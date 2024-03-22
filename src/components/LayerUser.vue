<template>
  <div class="userLayer selectNone"><!--登录\显示用户数据-->
    <div class="userLayerBox" ref="userLayer" v-bind:style="UserLayerTranslate">
      <div class="headImage"><!--头像-->
        <img id="headImage" draggable="false" @click="openLoginBord()" :src="'http://q.qlogo.cn/g?b=qq&amp;nk='+qq+'&amp;s=640&amp;mType=friendlist'" alt="头像"/>
      </div>
      <div class="right">
        <div class="userName">{{name}}</div>
        <div class="userEmail">{{email}}</div>
        <div class="userPanelBottom">
          <div class="userPanelButton">
            Test mode
          </div>
        </div>
      </div>
    </div>
    <banana-login-board v-show="isOpenBord" :server-key="serverKey"></banana-login-board>
    <banana-users-presence></banana-users-presence>
  </div>
</template>

<script>
import BananaLoginBoard from "./BananaLoginBoard";
import BananaUsersPresence from "./BananaUsersPresence";
export default {
  name: "LayerUser",
  components: {BananaLoginBoard,BananaUsersPresence},
  data(){
    return {
      isOpenBord:false,
      doNeedMove:false,
      frameTime:16,
      A1:{x:0, y:0},
      theData:{
        moveStartPt:{
          x:null,
          y:null
        },
        moveMovePt:{
          x:null,
          y:null
        },
        moveEndPt:{
          x:null,
          y:null
        },
        moveObServer:null,//移动侦测器
        moveObServerDt:[]
      }
    }
  },
  props:{
    serverKey:{
      type:String,
      required:true
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){

    },
    openLoginBord(){//打开登录面板
      this.isOpenBord=true
    },
    getUserData(){
      this.$store.state.serverData.socket.getUserData();
    }
  },
  computed:{
    UserLayerTranslate(){
      return 'transform: translate('+(this.A1.x)*-1+'px,'+this.A1.y+'px)';
    },
    name(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.user_name;
        }else {
          return this.$store.state.serverData.userName
        }
      }else {
        return this.$store.state.serverData.userName;
      }
    },
    email(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.user_email;
        }else {
          return this.$store.state.serverData.userEmail
        }
      }else {
        return this.$store.state.serverData.userEmail;
      }
    },
    qq(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.user_qq;
        }else {
          return this.$store.state.serverData.userQq
        }
      }else {
        return this.$store.state.serverData.userQq
      }
    },
    headColor(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.head_color;
        }else {
          return this.$store.state.serverData.userHeadColor
        }
      }else {
        return this.$store.state.serverData.userHeadColor
      }
    },
    numberOfLoginAttempts(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.numberOfLoginAttempts;
      }else {
        return null;
      }
    },
    numberOfLoginFailed(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.numberOfLoginFailed;
      }else {
        return null;
      }
    },
    isLogin(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.isLogin;
      }else {
        return null;
      }
    }
  },
  watch:{
    numberOfLoginAttempts:{
      handler(newValue,oldValue){
        if(oldValue!==null){
          if(this.isLogin===true){//表示连接登录成功
            this.isOpenBord=false;//隐藏登录面板
          }
        }
      }
    },
    numberOfLoginFailed:{
      handler(newValue,oldValue){
        if(oldValue!==null){
          if(this.isLogin===true){//表示连接登录成功
            this.isOpenBord=false;//隐藏登录面板
          }
        }
      }
    }
  },
  destroyed(){

  }
}
</script>

<style scoped>
.selectNone{
  -webkit-touch-callout:none; /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
.userLayerBox{
  box-shadow: #c1c1c1 0px 0px 4px;
  background: #fefefe;
  width: 220px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 550;
  border-radius: 6px;
  overflow: hidden;
}
.userLayer{
  position: fixed;
  z-index: 550;
  right: 0px;
  top: 0px;
}
.headImage{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 70px;
  height: 60px
}
.headImage img:hover{
  transform: scale(1.25);
}
.headImage img{
  transition: .4s;
  width: 60px;
  height: 60px;
}
.right{
  width: calc(100% - 70px);
  height: 100%;
  display: flex;
  justify-content: left;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
}
.userName{
  margin:2px 0px;
  width: calc(100% - 2px);
  height: 18px;
  font-weight: 800;
  font-size: 16px;
  color: #181818;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.userEmail{
  margin:0px 0px 2px 0px;
  width: calc(100% - 2px);
  height: 14px;
  font-weight: 400;
  font-size: 12px;
  color: #3590ff;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.userPanelBottom{
  height: 14px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.userPanelButton{
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 100%;
  font-weight: 100;
  font-size: 12px;
  transition: 0.4s;
}
.userPanelButton:first-child:hover{
  background: #b2d3ff;
}
</style>
