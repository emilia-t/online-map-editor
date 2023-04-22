<template>
  <div class="messageLayer" ref="messageLayer">
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
      <button class="sendButton">发送</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayerMessage",
  data(){
    return {
      isResizing: false,
      lastX: 0,
      illegalChars:["`", "#", "$", "%", "^", "&", "*", "(", ")" , "{", "}", "[", "]", "|", "\\", ";", ":", "'", "\"", "<", ">", ",", "/"],
    }
  },
  mounted() {
    this.resizeMessageBord();
  },
  methods:{
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
.messageLayer{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  width: 250px;
  min-width: 200px;
  height: 50%;
  max-height: calc(100% - 365px);
  min-height: 120px;
  background: #f5f5f5;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  right: 0px;
  bottom:20px;
  box-shadow: 0px 0px 6px #c5c5c5;
}
.messageBox{
  flex: 1;
  width: 100%;
  overflow-y: auto;
  background: #fff;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
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
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 2px 2px;
  text-align: center;
  text-decoration: none;
  margin: 0px 0px 0px 4px;
  cursor: pointer;
  border-radius: 5px;
  width: 50px;
  height: 100%;
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

</style>
