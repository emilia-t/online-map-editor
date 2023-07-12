<template>
  <div class="BananaUsersPresence">
    <div class="leftHandle" title="点击隐藏" ref="leftHandle">
      <img src="../../static/dropDown.png" alt="点击隐藏" ref="leftHandleImg">
    </div>
    <div class="collaborator" title="协作人员">
      <img class="collImgB" src="../../static/usersPresence.png" alt="协作人员">
    </div>
    <div class="usersBox" ref="userBox">
      <div v-for="user in this.usersList" :key="user.userEmail" class="userHeadBox" :title="user.userName" ><!--单一-->
        <img :src="'http://q.qlogo.cn/g?b=qq&nk='+user.userQq+'&s=640&mType=friendlist'">
      </div>
    </div>
    <div class="collaborator" title="协作人员">
      <img class="collImgA" src="../../static/usersPresence.png" alt="协作人员">
    </div>
  </div>
</template>

<script>
export default {
  name: "BananaUsersPresence",
  data(){
    return {
      panelStatus:true,
      boxWidth:42,
      usersList:[],
      duration:800,
      maxShow:10
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.$refs.leftHandle.addEventListener('click',()=>this.openAndClose());
    },
    getPresence(){
      this.$store.state.serverData.socket.getPresence();
    },
    clearPresence(){
      this.$store.state.serverData.socket.clearPresence();
    },
    openAndClose(){
      if(this.panelStatus){
        this.$refs.userBox.animate([
          {width:this.usersNumber*this.boxWidth+'px'},{width:0+'px'}],
          {duration:this.duration,iterations:1,fill:'forwards',easing:'ease'});
        this.$refs.leftHandleImg.style.transform='rotate(90deg)';
        this.$refs.leftHandle.title='点击展开';
        this.panelStatus=false;
      }else {
        this.$refs.userBox.animate([
            {width:0+'px'},{width:this.usersNumber*this.boxWidth+'px'}],
          {duration:this.duration,iterations:1,fill:'forwards',easing:'ease'});
        this.$refs.leftHandleImg.style.transform='rotate(270deg)';
        this.$refs.leftHandle.title='点击隐藏';
        this.panelStatus=true;
      }
    }
  },
  computed:{
    usersNumber(){
      if(this.usersList.length>this.maxShow){
        return this.maxShow;
      }else {
        return this.usersList.length;
      }
    },
    usersCount(){
      return this.usersList.length;
    },
    isLogin(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.isLogin;
      }else {
        return null;
      }
    },
    presence(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.presence;
      }else {
        return [];
      }
    }
  },
  watch:{
    isLogin:{
      handler(newValue){
        if(newValue===true){
          this.getPresence();
        }else {
          this.clearPresence();
        }
      }
    },
    presence:{
      handler(newValue){
        this.usersList=newValue;
        setTimeout(()=>{
          if(this.usersCount>this.maxShow){
            this.$refs.userBox.classList.add('scrollbar');
          }
          this.$refs.userBox.animate([
              {width:0+'px'},{width:this.usersNumber*this.boxWidth+'px'}],
            {duration:0,iterations:1,fill:'forwards',easing:'ease'});
          this.$refs.leftHandleImg.style.transform='rotate(270deg)';
          this.$refs.leftHandle.title='点击隐藏';
          this.panelStatus=true;
          },50)
      },deep:true
    },
    usersCount:{
      handler(newValue){
        if(newValue>this.maxShow){
          this.$refs.userBox.classList.add('scrollbar');
        }else {
          this.$refs.userBox.classList.remove('scrollbar');
        }
      },deep:true
    }
  }
}
</script>

<style scoped>
.scrollbar{
  overflow-x: auto!important;
}
.leftHandle{
  width: 16px;
  height: 45px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.leftHandle img{
  width: 18px;
  height: 6px;
  transform: rotate(270deg);
  transition: 0.8s;
  -webkit-user-drag: none;
}
.collaborator{
  width: 40px;
  height: 45px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.collImgA{
  width: 32px;
  height: 32px;
  -webkit-user-drag: none;
}
.collImgB{
  width: 32px;
  height: 32px;
  transform:scaleX(-1);
  -webkit-user-drag: none;
}
.BananaUsersPresence{
  -webkit-user-drag: none;
  user-select: none;
  transition: 0.3s;
  width: auto;
  height: 45px;
  position: absolute;
  right: 240px;
  top: 10px;
  z-index: 550;
  background: #fefefe;
  box-shadow: #c1c1c1 0px 0px 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}
.usersBox{
  min-width: 0px;
  max-width: 420px;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 45px;
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  transition: 0.8s;
}
.usersBox::-webkit-scrollbar {
  width: 100%;
  height: 4px;
}
.usersBox::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: rgba(0,0,0,0.2);
}
.usersBox::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
.userHeadBox{
  width: auto;
  height: auto;
  padding: 5px;
  display: flex;
  align-items: center;
  flex-direction: row;
}
.userHeadBox img{
  width: 32px;
  height: 32px;
  border-radius: 6px;
  box-shadow: #cdcdcd 0px 0px 4px;
  -webkit-user-drag: none;
}
</style>
