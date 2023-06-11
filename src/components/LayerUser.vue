<template>
  <div class="userLayer selectNone"><!--登录\显示用户数据-->
    <div class="userLayerBox" ref="userLayer" v-bind:style="UserLayerTranslate">
      <div class="headImage"><!--头像-->
        <img id="headImage" draggable="false" @click="openLoginBord()" :src="'http://q.qlogo.cn/g?b=qq&amp;nk='+qq+'&amp;s=640&amp;mType=friendlist'" alt="头像"/>
      </div>
      <div class="right">
        <span>{{name}}</span>
        <span>{{email}}</span>
      </div>
    </div>
    <banana-login-board v-show="isOpenBord" :server-key="serverKey"></banana-login-board>
  </div>
</template>

<script>
import BananaLoginBoard from "./BananaLoginBoard";
export default {
  name: "LayerUser",
  components: {BananaLoginBoard},
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
    this.mapMoveStart();
    this.mapMoveIng();
    this.mapMoveEnd();
  },
  methods:{
    mapMoveStart(){
      let dataLayer=this.$refs.userLayer;
      dataLayer.addEventListener('mousedown',(e)=>{
        if(e.button===0){
          this.doNeedMove=true;
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveStartPt=point;
        }
      })
    },
    mapMoveIng(){
      let dataLayer=this.$refs.userLayer;
      dataLayer.addEventListener('mousemove',(e)=>{
        if(this.doNeedMove){
          this.theData.moveMovePt={x:e.x,y:e.y};
          if(this.theData.moveObServer===null){
            this.setMoveObServer();
          }
        }
      })
    },
    mapMoveEnd(){
      let dataLayer=this.$refs.userLayer;
      dataLayer.addEventListener('mouseup',(e)=>{
        if(e.button===0){
          this.doNeedMove=false;
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveEndPt=point;
          if(this.theData.moveObServer!==null){//停用移动侦测器
            this.removeMoveObServer();
          }
          this.clearMoveCache();//清空移动缓存
        }
      })
    },
    setMoveObServer(){//设置移动侦测器
      if(this.theData.moveObServer===null){
        this.theData.moveObServer=setInterval(
          ()=>{
            try {
              let pt=this.theData.moveMovePt;
              let le=this.theData.moveObServerDt.length;
              switch (le){
                case 2:{
                  this.theData.moveObServerDt.shift();
                  this.theData.moveObServerDt.push(pt);
                  let A1=this.theData.moveObServerDt[0];
                  let A2=this.theData.moveObServerDt[1];
                  let xc3=((A2.x-A1.x)*-1);
                  let yc4=(A2.y-A1.y);
                  this.A1.x+=xc3;
                  this.A1.y+=yc4;
                  break;
                }
                case 0:{
                  this.theData.moveObServerDt.push(pt);
                  let Apt=this.theData.moveStartPt;
                  let xc,yc;
                  xc=(pt.x-Apt.x)*-1;
                  yc=(pt.y-Apt.y);
                  this.A1.x+=xc;
                  this.A1.y+=yc;
                  break;
                }
                case 1:{
                  this.theData.moveObServerDt.push(pt);
                  let Bpt=this.theData.moveObServerDt[0];
                  let xc2,yc2;
                  xc2=(pt.x-Bpt.x)*-1;
                  yc2=pt.y-Bpt.y;
                  this.A1.x+=xc2;
                  this.A1.y+=yc2;
                  break;
                }
                default:{
                  break;
                }
              }
            }catch (e) {

            }
          }
          ,this.frameTime)
      }
    },
    clearMoveCache(){//清空移动缓存
      this.theData.moveStartPt.x=null;
      this.theData.moveStartPt.y=null;
      this.theData.moveMovePt.x=null;
      this.theData.moveMovePt.y=null;
      this.theData.moveEndPt.x=null;
      this.theData.moveEndPt.y=null;
      this.theData.moveObServerDt.length=0;
    },
    removeMoveObServer(){//移除移动侦测器
      if(this.theData.moveObServer!==null) {
        clearInterval(this.theData.moveObServer);
        this.theData.moveObServer=null;
      }
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
  box-shadow: #c1c1c1 0px 0px 4px;background: #fefefe;width: 240px;height: 60px;display: flex;justify-content: center;align-items: center;position: fixed;top: 10px;right: 10px;z-index: 550;border-radius: 6px;overflow: hidden;
}
.headImage{display: flex;justify-content: center;align-items: center;width: 60px;height: 60px}
.headImage img:hover{box-shadow: #d7d7d7 0px 0px 4px;width: 60px;height: 60px}
.headImage img{border-radius: 6px;box-shadow: #cdcdcd 0px 0px 4px;transition: .4s;width: 45px;height: 45px}
.right{width: calc(100% - 55px);margin-left: 5px;height: 100%;display: flex;justify-content: left;align-content: space-around;align-items: center;flex-wrap: wrap;overflow: hidden}
.right span:first-child{text-shadow: #d2d2d2 2px 2px 2px;width: calc(100% - 2px);line-height: 36px;height: 50%;font-weight: 800;font-size: 18px;color: #181818;overflow: hidden}
.right span:last-child{text-shadow: #d4d4d4 2px 2px 2px;width: calc(100% - 2px);line-height: 24px;height: 50%;font-weight: 400;font-size: 12px;color: #3590ff}
</style>
