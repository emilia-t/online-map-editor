<template>
  <div class="notificationPopupLayer" v-if="popupShow">
    <div class="notificationPopupBox">
      <div class="PopupIcon">
        <notification-icon></notification-icon>
      </div>
      <div class="PopupContent">
        <div class="PopupInner">
          <div class="PopupTitle">
            版本更新通知
          </div>
          <div class="PopupVerChange">
            0.4.9(Preview) -> 0.4.9.5(Develop)
          </div>
          <div class="PopupText">本次版本更新了以下内容，请阅读：
            1.新增日志功能，用以查看以往日志记录，按 L 键打开面板
            2.新增插件功能，用以安装额外的应用功能，位于左侧菜单栏
            3.新增Kml2Omd，用以将KML转为OMD文件，位于工具(插件)
            4.新增全局通知弹窗，用于发布重要信息
            5.修复了部分已知Bug
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
    this.findLocalNotificationConfig();
  },
  methods:{
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
          || !Config.hasOwnProperty('noticeAgainPopup')){
          this.clearNotificationConfig();
          return false;
        }
        if(Config.noticeAgainPopup === true){
          console.log(Config);
          this.popupShow=true;
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
      OldConfig.noticeLastReadTime=this.getFormattedDate();
      OldConfig.noticeAgainPopup=!checkedStatus;
      let json=JSON.stringify(OldConfig);
      this.handleLocalStorage('set','notificationConfig',json);
    },
    popupRead(){
      let OldConfig=JSON.parse(this.handleLocalStorage('get','notificationConfig'));
      OldConfig.noticeLastReadTime=this.getFormattedDate();
      OldConfig.noticeReadState=true;
      let json=JSON.stringify(OldConfig);
      this.handleLocalStorage('set','notificationConfig',json);
      this.popupShow=false;
    },
    getFormattedDate(){
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
  font-size: 10px;
  font-weight: 100;
  padding: 0px 10px;
}
.PopupText{
  height: auto;
  padding: 10px;
  width: calc(100% - 20px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  white-space: pre-line;
  line-height: 24px;
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
