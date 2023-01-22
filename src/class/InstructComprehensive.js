export default {
  constructor(){
    class InstructComprehensive {
      constructor(email,password,url){
        this.email=email || '';//用户名
        this.password=password || '';//用户密码
        this.url=url || 'ws://127.0.0.1:9998';
        this.socket=undefined;//会话
        this.messages=[];//收到的指令
      }
      link(){
        this.socket=new WebSocket(this.url);
        this.socket.onopen=(ev)=>this.onOpen(ev);
        this.socket.onmessage=(ev)=>this.onMessage(ev);
        this.socket.onclose=(ev)=>this.onClose(ev);
        this.socket.onerror=(ev)=>this.onError(ev);
      }
      send(instructObj){//该方法将指令类编译为json数据格式
        console.log(instructObj);
      }
      onMessage(ev){
        console.log("收到消息");
        console.log(ev);
        return true;
      }
      onClose(ev){
        console.log("连接断开");
        console.log(ev);
        return true;
      }
      onError(ev){
        console.log("连接失败");
        console.log(ev);
        return true;
      }
      onOpen(ev){
        console.log("连接陈功");
        console.log(ev);
        return true;
      }
    }
  }
}
