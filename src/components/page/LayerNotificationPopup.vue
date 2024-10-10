<template>
  <div class="notificationPopupLayer" v-if="popupShow">
    <div class="notificationPopupBox">
      <div class="PopupIcon">
        <notification-icon/>
      </div>
      <div class="PopupContent">
        <div class="PopupInner">
          <div class="PopupTitle">
            版本更新通知
          </div>
          <div class="PopupVerChange">
            当前版本 {{this.$root.Version}}
          </div>
          <div class="PopupText">本次版本更新了以下内容，请阅读：
            1.增加了全局音效功能(在常规设置中可以设置
            2.更新主页UI界面并增加本地服务器搜索功能
            3.增加了更多的底图(在地图右侧图层按钮
            4.增加了节点自动吸附的功能(Alt键
            5.增加了打开和关闭菜单的快捷键(F键
            6.优化了部分图标和UI显示效果
            7.增加了对OMS版本的匹配功能
            8.修复了已知的Bug
          </div>
        </div>
        <div class="PopupButtonBox">
          <div class="PopupButton" @click="popupRead()">
            我已了解
          </div>
          <div class="PopupNextUp">
            <input type="checkbox" id="PopupNextUpNone" ref="PopupNextUpNone" @click="popupNextUp()">
            <label for="PopupNextUpNone">下次不再提示</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationIcon from "../svgValidIcons/notificationIcon";
export default {
  name: "LayerNotificationPopup",
  components:{notificationIcon,},
  data(){
    return{
      popupShow:false,
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.findLocalNotificationConfig();
    },
    handleLocalStorage(method, key, value) {
      try {
        switch (method) {
          case 'get' : {
            let temp = window.localStorage.getItem(key);
            if (temp!==null) {
              return temp
            } else {
              return false
            }
          }
          case 'set' : {
            window.localStorage.setItem(key, value);
            break
          }
          case 'remove': {
            window.localStorage.removeItem(key);
            break
          }
          default : {
            return false
          }
        }
      }catch (e){
        this.$store.commit('setCoLogMessage',{text:'获取本地存储失败',from:'internal:LayerLog',type:'error',data:e});
      }
    },
    findLocalNotificationConfig(){
      let Config=this.handleLocalStorage('get','notificationConfig');
      if(Config!==false){
        Config=JSON.parse(Config);
        if(!this.isObject(Config)){//check
          this.clearNotificationConfig();
          return false;
        }
        if(!Config.hasOwnProperty('noticeLastReadTime')
          || !Config.hasOwnProperty('noticeReadState')
          || !Config.hasOwnProperty('noticeAgainPopup')
          || !Config.hasOwnProperty('lastReadVersion')
        ){
          this.clearNotificationConfig();
          return false;
        }
        if(Config.noticeAgainPopup === true){
          this.popupShow=true;
        }else{
          if(Config.lastReadVersion!==this.$root.Version){
            this.popupShow=true;
          }
        }
      }else {
        this.setDefaultConfig();
        this.popupShow = true;
      }
    },
    clearNotificationConfig(){
      this.handleLocalStorage('remove','notificationConfig');
    },
    setDefaultConfig(){
      let config={
        noticeLastReadTime:'1970-1-1 0:0:0',
        noticeReadState:false,
        noticeAgainPopup:true,
        lastReadVersion:"0",
      };
      let json=JSON.stringify(config);
      this.handleLocalStorage('set','notificationConfig',json);
    },
    isObject(obj) {
      return obj !== null && typeof obj === 'object';
    },
    popupNextUp(){
      let checkedStatus=this.$refs.PopupNextUpNone.checked;
      let OldConfig=JSON.parse(this.handleLocalStorage('get','notificationConfig'));
      OldConfig.noticeLastReadTime=this.getReadDate();
      OldConfig.noticeAgainPopup=!checkedStatus;
      let json=JSON.stringify(OldConfig);
      this.handleLocalStorage('set','notificationConfig',json);
    },
    popupRead(){
      let OldConfig=JSON.parse(this.handleLocalStorage('get','notificationConfig'));
      OldConfig.noticeLastReadTime=this.getReadDate();
      OldConfig.noticeReadState=true;
      OldConfig.lastReadVersion=this.$root.Version;
      let checkedStatus=this.$refs.PopupNextUpNone.checked;
      OldConfig.noticeAgainPopup=!checkedStatus;
      let json=JSON.stringify(OldConfig);
      this.handleLocalStorage('set','notificationConfig',json);
      this.popupShow=false;
    },
    getReadDate(){
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  }
}
</script>

<style scoped>
.notificationPopupLayer{
  width: 110%;
  height: 110%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 700;
  left: -5%;
  top: -5%;
  background: rgba(0,0,0,0.2);
  animation: popupOpen 0.5s forwards;
}
@keyframes popupOpen {
  0%{
    opacity: 0;
    transform: scale(0.90);
  }
  50%{
    opacity: 1;
    transform: scale(1.05);
  }
  100%{
    opacity: 1;
    transform: scale(1);
  }
}
.notificationPopupBox{
  width: 470px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.PopupNextUpSpan{
  content: '\2713';
}
.PopupNextUp{
  font-weight: 100;
  font-size: 12px;
  position: absolute;
  right: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.PopupNextUp input{
  margin: 5px 4px 3px 4px;
}
.PopupVerChange{
  font-size: 11px;
  font-weight: 100;
  padding: 0px 10px;
}
.PopupText{
  height: auto;
  max-height: 165px;
  padding:2px 10px 0px 10px;
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  white-space: pre-line;
  line-height: 24px;
  overflow-y: auto;
}
.PopupTitle{
  height: auto;
  padding: 30px 0px 15px 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}
.PopupIcon{
  width: 100%;
  height: 50px;
  transform: translateY(25px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.PopupContent{
  width: 100%;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: #c5c5c5 0px 0px 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.PopupInner{
  width: 100%;
  height: 250px;
}
.PopupButtonBox{
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}
.PopupButton{
  width: 160px;
  height: 35px;
  background: #715ee2;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  display: flex;flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>
