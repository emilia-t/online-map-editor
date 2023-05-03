<template>
  <div class="messageLayerBox">
    <!--右侧唤起消息面板的按钮-->
    <div class="messageButton" ref="messageButton" @click="openOrHideMessage()">
      <svg t="1683100454463" class="icon8" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2649" width="200" height="200"><path d="M532.48 0C238.592 0 0 204.8 0 457.216c0 150.016 54.784 272.896 163.84 361.984v150.016c0 40.96 13.824 54.784 34.304 54.784 12.8-0.512 24.576-5.12 34.304-13.824l163.84-95.744c45.056 8.192 90.624 12.288 136.704 13.824 293.376 0 491.52-218.624 491.52-471.04S778.752 0 532.48 0z m0 849.92c-27.136 0-95.744-6.656-122.88-6.656l-27.136-6.656-20.48 13.824-122.88 78.336v-148.48l-27.136-20.48c-88.576-75.264-126.464-179.2-126.464-302.08 0-218.624 194.56-378.88 454.144-378.88 175.104-3.584 395.776 153.6 413.184 378.88-7.168 231.936-181.248 392.192-420.352 392.192zM272.896 402.944c-33.792 0-61.44 27.648-61.44 61.44s27.648 61.44 61.44 61.44 61.44-27.648 61.44-61.44c0-16.384-6.656-31.744-17.92-43.52s-27.136-17.92-43.52-17.92z m239.104 0c-33.792 0-61.44 27.648-61.44 61.44s27.648 61.44 61.44 61.44 61.44-27.648 61.44-61.44c0-16.384-6.656-31.744-17.92-43.52s-27.136-17.92-43.52-17.92z m239.104 0c-33.792 0-61.44 27.648-61.44 61.44s27.648 61.44 61.44 61.44 61.44-27.648 61.44-61.44c0-16.384-6.656-31.744-17.92-43.52-11.776-11.776-27.136-17.92-43.52-17.92z" p-id="2650"></path></svg>
      <div class="unreadNumber" v-show="unreadNumber!==0">{{unreadNumber}}</div>
    </div>
    <!--消息面板主体-->
    <div class="messageLayer" ref="messageLayer">
      <div class="topHandle" ref="topHandle" @click="openOrHideMessage()">
        <img alt="下拉按钮" :src="dropPng" title="点击隐藏" draggable="false"/>
      </div>
      <div class="handle" ref="handle"></div>
      <div class="messageBox" ref="messageBox">
        <div v-for="message in this.messageData" class="messageItem">
          <!--普通文本消息-->
          <div v-if="message.class==='textMessage'" :key="message.time+'M'+generateKey()" class="messageItemA">
            <div class="messageTime">{{message.time}}</div>
            <div class="messageConveyor">
              <div class="avatar" :style="{'backgroundColor': '#'+message.data.headColor}">{{message.conveyor.charAt(0)}}</div>
              {{message.conveyor}}
            </div>
            <div class="messageData">{{message.data.message}}</div>
          </div>
          <!--新增线段消息-->
          <div v-if="message.class==='line'" class="messageItemA">
            <div class="messageTime">{{message.time}}</div>
            <div class="messageConveyor">
              <div class="avatar" :style="{backgroundColor:'#ffffff'}">{{message.conveyor.charAt(0)}}</div>
              {{message.conveyor}}
            </div>
            <div class="messageData">我添加了一条线段，id为：{{message.data.elementId}}</div>
          </div>
          <!--新增点消息-->
          <div v-if="message.class==='point'" class="messageItemA">
            <div class="messageTime">{{message.time}}</div>
            <div class="messageConveyor">
              <div class="avatar" :style="{backgroundColor:'#ffffff'}">{{message.conveyor.charAt(0)}}</div>
              {{message.conveyor}}
            </div>
            <div class="messageData">我添加了一个点，id为：{{message.data.elementId}}</div>
          </div>
          <!--删除元素消息-->
          <div v-if="message.class==='deleteElement'" class="messageItemA">
            <div class="messageTime">{{message.time}}</div>
            <div class="messageConveyor">
              <div class="avatar" :style="{backgroundColor:'#ffffff'}">{{message.conveyor.charAt(0)}}</div>
              {{message.conveyor}}
            </div>
            <div class="messageData">我删除了一个元素，id为：{{message.data.id}}</div>
          </div>
          <!--更新元素消息-->
          <div v-if="message.class==='updateElement'" class="messageItemA">
            <div class="messageTime">{{message.time}}</div>
            <div class="messageConveyor">
              <div class="avatar" :style="{backgroundColor:'#ffffff'}">{{message.conveyor.charAt(0)}}</div>
              {{message.conveyor}}
            </div>
            <div class="messageData">我更新了一个元素，id为：{{message.data.id}}</div>
          </div>
        </div>
      </div>
      <div class="inputBox">
        <textarea class="inputTextBox" ref="inputTextBox" type="text" placeholder="请输入消息" rows="2" @keydown.enter="sendMessage"></textarea>
        <button class="sendButton" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import dropPng from '../../static/dropDown.png';
export default {
  name: "LayerMessage",
  data(){
    return {
      dropPng,
      isResizing: false,
      lastX: 0,
      illegalChars:["`", "#", "$", "%", "^", "&", "*", "(", ")" , "{", "}", "[", "]", "|", "\\", ";", ":", "'", "\"", "<", ">", ",", "/"],
      messageLayerShow:false,
      unreadNumber:0,
      unreadIs:true
    }
  },
  mounted() {
    this.resizeMessageBord();
  },
  methods:{
    //打开消息面板
    openOrHideMessage(){
      //关闭消息面板
      if(this.messageLayerShow){
        this.$refs.messageLayer.classList.add('messageLayerHide');
        this.$refs.messageLayer.classList.remove('messageLayerShow');
        this.$refs.messageButton.classList.add('messageButtonShow');
        this.$refs.messageButton.classList.remove('messageButtonHide');
        this.messageLayerShow=!this.messageLayerShow;
        //启用积累未读消息
        this.unreadIs=true;
      }else {
        //打开
        this.$refs.messageLayer.classList.remove('messageLayerHide');
        this.$refs.messageLayer.classList.add('messageLayerShow');
        this.$refs.messageButton.classList.remove('messageButtonShow');
        this.$refs.messageButton.classList.add('messageButtonHide');
        this.messageLayerShow=!this.messageLayerShow;
        //禁用积累未读消息
        this.unreadIs=false;
        //清除未读消息数量
        this.unreadNumber=0;
      }
    },
    //发送消息
    sendMessage() {
      let messages = this.$refs.inputTextBox.value;
      //去除首尾的多余字符
      let message = messages.trim();
      let headColor=this.userData.head_color;
      let name=this.userData.user_name;
      let data={message,headColor,name};
      if(this.checkMessage(message)){// 检测非法字符
        this.$store.state.serverData.socket.broadcastSendText(data);
        // 清空输入框内容和换行符
        setTimeout(
          ()=>{
            // 清空输入框内容和换行符
            this.$refs.inputTextBox.value='';
            this.$refs.inputTextBox.innerText='';
            this.$refs.inputTextBox.textContent='';
          },4)
      }
    },
    checkMessage(message) {
      // 如果仅包含空格或者换行符，则视为非法字符
      if (message.length === 0 || /^[\n\r]+$/.test(message)) {
        this.$root.general_script.alert_tips('消息内容不能为空或仅包含空格或换行符');
        return false;
      }
      const illegalCharPositions = [];
      const regExp = new RegExp(`[${this.illegalChars.join("\\")}]`, "g");
      let match;
      while ((match = regExp.exec(message)) !== null) {
        illegalCharPositions.push(match.index);
      }
      if (illegalCharPositions.length > 0) {
        this.$root.general_script.alert_tips(`此消息中包含 ${illegalCharPositions.length} 个非法字符：`);
        illegalCharPositions.forEach(position => {
          this.$root.general_script.alert_tips(`第 ${position+1} 个字符是非法字符：${message.charAt(position)}`);
        });
        return false;
      } else {
        return true;
      }
    },
    resizeMessageBord(){
      this.$refs.handle.addEventListener('mousedown', (e) => {
        this.isResizing = true;
        this.lastX = e.clientX;
      });
      // 鼠标移动时计算位移并更新元素宽度
      document.addEventListener('mousemove', (e) => {
        if (!this.isResizing) return;

        const diffX = e.clientX - this.lastX;
        const newWidth = Math.max(
          this.$refs.messageLayer.offsetWidth - diffX, // 新宽度不能小于最小宽度
          parseInt(window.getComputedStyle(this.$refs.messageLayer).minWidth)
        );
        this.$refs.messageLayer.style.width = `${newWidth}px`;
        this.lastX = e.clientX;
      });
      // 鼠标抬起时取消监听器
      document.addEventListener('mouseup', () => {
        this.isResizing = false;
      });
    },
    getRandomColor() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    //自动翻阅
    autoScrollDown(){
      setTimeout(()=>{
        if(this.isScrolledNearBottom){
          this.$refs.messageBox.scrollTop=this.$refs.messageBox.scrollHeight
        }
      },100);
    },
    //自动翻阅
    isScrolledNearBottom() {
      const scrollHeight = this.$refs.messageBox.scrollHeight;
      const scrollTop = this.$refs.messageBox.scrollTop;
      const clientHeight = this.$refs.messageBox.clientHeight;
      return scrollHeight - scrollTop - clientHeight < 50; // 可以适当调整阈值，单位为像素
    }
  },
  computed:{
    messageData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.messages;
      }else {
        return [];
      }
    },
    userData(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData;
        }else {
          return this.$store.state.serverData.default
        }
      }else {
        return this.$store.state.serverData.default
      }
    },
    // 生成随机数作为 key 值
    generateKey() {
      return () => Math.floor(Math.random() * 10000);
    }
  },
  watch:{
    messageData:{
      handler(){
        this.autoScrollDown();
        if(this.unreadIs){
          this.unreadNumber++;
        }
      },
      deep:true
    }
  },
  destroyed(){
    //销毁连接及综合对象
    //this.$store.commit('destroyComprehensive');
    //console.log("layerMessage");
  }
}
</script>

<style scoped>
.messageButton{
  width: 55px;
  height: 55px;
  bottom: 20px;
  position: fixed;
  z-index: 540;
  right: 0px;
}
.unreadNumber{
  user-select: none;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background: rgba(255, 66, 66, 0.8);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  position: absolute;
  top:20px;
  left:20px
}
.icon8{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 30px;
  height: 30px;
}
.messageLayerBox{
  width: auto;
  height: auto;
}
.messageLayer{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  width: 250px;
  max-width: 600px;
  min-width: 200px;
  max-height: calc(100% - 365px);
  background: #f5f5f5;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  bottom:20px;
  box-shadow: 0px 0px 6px #c5c5c5;
  height: 1%;
  right: -600px;
  z-index: 550;
}
.messageLayerShow{
  animation-name: messageLayerShow;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
.messageLayerHide{
  animation-name: messageLayerHide;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
.messageButtonShow{
  animation-name: messageButtonShow;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
.messageButtonHide{
  animation-name: messageButtonHide;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
@keyframes messageLayerShow {
  0%{
    right: -600px;
  }
  25%{
    right: 0px;
  }
  50%{
    height: 1%;
    right: 0px;
  }
  100%{
    height: 50%;
    right: 0px;
  }
}
@keyframes messageLayerHide {
  0%{
    height: 50%;
    right: 0px;
  }
  25%{
    height: 1%;
    right: 0px;
  }
  50%{
    right: 0px;
    height: 1%;
  }
  100%{
    right: -600px;
    height: 1%;
  }
}
@keyframes messageButtonShow {
  from{
    right: -60px;
  }
  to{
    right: 0px;
  }
}
@keyframes messageButtonHide {
  from{
    right: 0px;
  }
  to{
    right: -60px;
  }
}
.messageBox{
  flex: 1;
  width: 100%;
  overflow-y: auto;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 6px #c5c5c5;
}
.messageItemA{
  margin-bottom: 10px;
}
.messageTime{
  font-size: 12px;
  color: #999;
}
.messageConveyor{
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}
.avatar{
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 6px #c5c5c5;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  font-size: 20px;
  font-weight: 400;
}
.messageData{
  font-size: 14px;
  color: #666;
}
.inputBox{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 4px 4px;
  box-sizing: border-box;
  border-top: 1px solid #ccc;
}
.inputTextBox{
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 7px;
  box-sizing: border-box;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 0px 6px #c5c5c5;
  font-size: 14px;
  font-family: Roboto;
  resize: none;
}
.sendButton {
  background-color: #4294f8;
  border: none;
  color: white;
  padding: 2px 2px;
  text-align: center;
  text-decoration: none;
  margin: 0px 0px 0px 4px;
  cursor: pointer;
  border-radius: 5px;
  width: 50px;
  height: 28px;
  flex-direction: row;
  line-height: 30px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.handle {
  position: absolute;
  top: 0;
  left: -5px; /* 定位到左侧边缘 */
  width: 10px; /* 宽度一般设置为鼠标能够点击到的范围 */
  height: 100%;
  cursor: ew-resize; /* 设置鼠标样式 */
}
.topHandle{
  user-select: none;
  border-top-left-radius: 4px;
  position: absolute;
  top: -10px;
  left: 0px;
  width: 100%;
  height: 10px;
  background: #f7f7f7;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
