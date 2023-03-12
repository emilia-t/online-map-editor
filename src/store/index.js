import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
//vuex3.0基本操作https://blog.csdn.net/qq_56989560/article/details/124706021
export default new Vuex.Store({
  //提供唯一的公共数据源，所有共享的数据统一放到store的state进行储存数据，相当于data
  state: {
    classList:{
      //综合指令类
      InstructComprehensive:class InstructComprehensive {
        constructor(url){
          this.url=url || 'ws://127.0.0.1:9998';
          this.isLink=false;
          this.isLogin=false;
          this.numberOfLoginAttempts=0;
          this.socket=undefined;//会话
          this.messages=[];//收到的指令
          this.publickey='';
          this.userData=null;
          this.mapData=[];
          this.otherA1=[];
          this.typeList=['broadcast','get_publickey','login','publickey','loginStatus','get_userData','send_userData','get_mapData','send_mapData'];
          this.Instruct={
            //类似于coumputed
            //登录指令
            login(email,password) {
              this.email=email || '';
              this.password=password || '';
              return {type:"login",data:{email:this.email,password:this.password}}
            },
            //获取公钥指令
            get_publickey() {
              return {type:"get_publickey"}
            },
            //获取用户数据指令
            get_userData(){
              return {type:"get_userData"}
            },
            //获取地图数据指令
            get_mapData(){
              return {type:"get_mapData"}
            },
            //广播我的A1位置
            broadcast_A1(x,y,color,name){
              //广播类型数据必须要规定class
              return {type:"broadcast",class:"A1",data: {x,y,color,name}}
            },
            //以广播的形式发送新增点数据
            broadcast_point(data){
              return {type:"broadcast",class:"point",data}
            }
          };
          this.startSetting();
        }
        //初始化配置
        startSetting(){
          this.getServerPublickey();
          this.heartbeat();
        }
        //清除本地数据
        clearLocalData(){
          //1.清除会话内的用户数据
          this.userData=null;
          //2.清除他人的A1
          this.otherA1=[];
          //3.清除地图数据
          this.mapData=[];
        }
        //发送关注点数据
        broadcastSendPoint(data){
          try {
            //0.检查数据
            //0.1检查是否属于object
            if(Object.prototype.toString.call(data)!=="[object Object]"){return false;}
            //0.2检查是否包含class类型
            if(data.hasOwnProperty("class")===false){return false;}
            //0.3检查class类型是否为point
            if(data.class!=="point"){return false;}
            //0.4检查是否包含point类型
            if(data.hasOwnProperty("point")===false){return false;}
            //0.5检查point是否为object
            if(Object.prototype.toString.call(data.point)!=="[object Object]"){return false;}
            //0.6检查point是否由xy
            if(data.point.hasOwnProperty("x")===false){return false;}
            if(data.point.hasOwnProperty("y")===false){return false;}
            //0.7检查xy是否是数字[object Number]
            if(Object.prototype.toString.call(data.point.x)!=="[object Number]"){return false;}
            if(Object.prototype.toString.call(data.point.y)!=="[object Number]"){return false;}
            //0.8检查color
            if(data.hasOwnProperty("color")===false){return false;}
            //0.9检查颜色是否为字符
            if(Object.prototype.toString.call(data.color)!=="[object String]"){return false;}
            //0.10检查颜色是否为16进制的格式
            let Exp=/^[0-9A-F]{6}$/i;
            if(Exp.test(data.color)===false){alert("请输入正确的16进制颜色格式例如#123456");return false;}
            //0.11检查是否存在width并检查是否为数字并检查是否超过最大值
            if(data.hasOwnProperty("width")){
              let $num1=parseInt(data.width);
              if(Object.prototype.toString.call($num1)!=="[object Number]"){
                alert("宽度为数字，范围为int2~64");
                return false;
              }else {
                if(data.width>64 || data.width<2){
                  data.width=~~(data.width);
                }
              }
            }
            //0.12检查details,details必须是一个数组，且每个值都是一个由key=>value组成的对象
            if(data.hasOwnProperty("details")){
            //0.12.1检查是否为数组
            if(Object.prototype.toString.call(data.details)==="[object Array]"){
            //0.12.2循环检查类型
            for(let i=0;i<data.details.length;i++){
            //0.12.3检查是否为对象
            if(Object.prototype.toString.call(data.details[i])!=="[object object]"){
            //0.12.4检查是否包含key，value属性
              if(data.details[i].hasOwnProperty("key") && data.details[i].hasOwnProperty("value")){
            //0.12.5检查key属性是否存在非法字符[key只能由汉字[a~Z][0~9]组成]，
            //0.12.6key正则表达式
              const KeyExp=/[^a-z0-9A-Z_\u4e00-\u9fa5]/m;
              const ValueExp=/[\[\]{}#`'"]|(-){2}|(\/){2}|(%){2}|\/\*/m;
              //key
              if(KeyExp.test(data.details[i].key)){
                alert("列名错误，仅允许使用字母、数字、汉字、下划线");
                return false;
              }
              //value
              if(ValueExp.test(data.details[i].value)){
                alert("列值错误，不允许使用如下字符[]、{}、#、`、'、\"、--、//、%%、/*");
                return false;
              }
            }else{return false;}}else{return false;}}}else{return false;}}
            //1.0构建点数据基本结构
            let basicStructure={
              id:0,//由服务端生成最终id，客户端用数字0代替
              type:'point',
              points:[],
              point:null,//必要
              color:'',//必要
              length:null,//这里为空--不接收客户传参
              width:2,//建议要--最大为64
              size:null,//这里为空--不接收客户传参
              childRelations:[],//这里为空--不接收客户传参--暂定
              fatherRelation:'',//这里为空--不接收客户传参--暂定
              childNodes:[],//这里为空--不接收客户传参--暂定
              fatherNode:'',//这里为空--不接收客户传参--暂定
              details:[]//建议要
            };
            //2.0归档
            basicStructure.points[0]=data.point;
            basicStructure.point=data.point;
            basicStructure.color=data.color;
            basicStructure.width=data.width || basicStructure.width;
            basicStructure.details=data.details || basicStructure.details;
            //3.0广播
            //console.log(basicStructure);
            this.send(this.Instruct.broadcast_point(basicStructure));
          }catch (e) {}
        }
        //广播A1
        broadcastMyA1(x,y,color,name){
          this.send(this.Instruct.broadcast_A1(x,y,color,name));
        }
        //心跳回应，防止断开连接
        heartbeat(){
          setInterval(()=>{
            if(this.socket!==undefined){
              this.socket.send('');
            }
          },55000)
        }
        //断开服务器连接(注意是断开会话，不会删除账号数据)
        closeLink(){
          this.socket.close();
          //更新登录状态未登录
          this.isLogin=false;
        }
        //本地存储接口
        handleLocalStorage(method, key, value) {
          switch (method) {
            case 'get' : {
              let temp = window.localStorage.getItem(key);
              if (temp) {
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
        }
        //获取用户数据
        getUserData(){
          this.send(this.Instruct.get_userData());
        }
        //获取地图数据
        getMapData(){
          this.send(this.Instruct.get_mapData());
        }
        //获取服务器公钥
        getServerPublickey(){
          this.send(this.Instruct.get_publickey());
        }
        //登录方法
        login(email,password){
          //1.检查用户输入
          if (check(''+email+password)){
            this.send(this.Instruct.login(email,password));
          }
          function check(text){
            let pat=new RegExp("[^a-zA-Z0-9\_@.+/=-]","i");
            if(pat.test(text)===true) {
              alert("邮箱及密码只能是：字母，数字，下划线 @ . - ，如果您的邮箱包含除此之外的字符，请联系站长");
              return false;
            }else {return true}
          }
        }
        //连接服务器方法
        link(){
          this.socket=new WebSocket(this.url)
          this.socket.onopen=(ev)=>this.onOpen(ev)
          this.socket.onmessage=(ev)=>this.onMessage(ev);
          this.socket.onclose=(ev)=>this.onClose(ev);
          this.socket.onerror=(ev)=>this.onError(ev);
          return true;
        }
        //发送数据
        send(instructObj){//该方法将指令类编译为json数据格式
          if(this.isLink){
            //1.数据检查
            if(this.instructObjCheck(instructObj)){
              let json=JSON.stringify(instructObj);
              this.socket.send(json);
            }
          }
        }
        //指令检查
        instructObjCheck(instructObj){
          //1.检测是否为一个对象
          if(Object.prototype.toString.call(instructObj)!=="[object Object]"){
            return false;
          }
          //2.检测是否存在'type'属性
          if(instructObj.type===undefined){
            return false;
          }
          //3.检测是否存在不允许的数据类型
          if(this.typeList.indexOf(instructObj.type)===-1){
            return false;
          }else {
            return true;
          }
          //4.检测是否属于广播类
          if(instructObj.type==='broadcast'){

          }
        }
        //收到消息事件
        onMessage(ev){
          //1.转化json
          let jsonData=JSON.parse(ev.data);
          //2.检测是否存在必要值'type'
          if(jsonData.type!==undefined){
          //3.处理数据
          let nowType=jsonData.type;
          switch (nowType){
            //服务器发来公钥
            case 'publickey':{
              //保存公钥
              this.publickey=jsonData.data;
              break;
            }
            //服务器发来登录状态
            case 'loginStatus':{
              if(jsonData.data){
                //1更新登录状态
                this.isLogin=true;
                this.numberOfLoginAttempts++;
              }else {
                this.isLogin=false;
                this.numberOfLoginAttempts++;
              }
              break;
            }
            //服务器发来的用户数据
            case 'send_userData':{
              this.userData=jsonData.data;
              break;
            }
            //服务器发来的地图数据
            case 'send_mapData':{
              this.mapData=jsonData.data;
              break;
            }
            //服务器发来的广播
            case 'broadcast':{
              //otherA1:
              //[
              //data{color,email,name,x,y},...
              //]
              //处理数据-新的则接入---旧的则更新
              let oldLength=this.otherA1.length;//曾经的长度
              let newEm=jsonData.data.email;//新收到的
              let lock=true;//是新增吗，锁止
              for (let i=0;i<oldLength;i++){
                let nowEm=this.otherA1[i].email;
                if(nowEm==newEm){//更新旧数据
                  lock=false;
                  this.otherA1[i].color=jsonData.data.color;
                  this.otherA1[i].name=jsonData.data.name;
                  this.otherA1[i].x=jsonData.data.x;
                  this.otherA1[i].y=jsonData.data.y;
                }
              }
              //再新增
              if(lock){
                this.otherA1.push(jsonData.data);
              }
              break;
            }
            default:{
              //console.log(jsonData);
            }
          }
          }
        }
        //断开连接事件
        onClose(ev){
          console.log("服务器连接断开");
          this.isLink=false;
          return true;
        }
        //连接失败事件
        onError(ev){
          console.log("服务器连接失败");
          this.isLink=false;
          return true;
        }
        //连接成功事件
        onOpen(ev){
          console.log("已经连接服务器");
          this.isLink=true;
          return true;
        }
      },
    },
    //匿名命令的临时缓存
    anonymousInstruct:{
      name:null,
      data:null
    },
    //命令的缓存,各组件根据需求监听这里的数据变化，也可以监听整个commits
    //命令是用于个体组件与外界进行通讯的手段之一，请在main.js的sendInstruct进行注册
    commits:{
      createTestLine:false,
      openF4DebugBord:false,
      openDetailsPanel:false
    },
    //相机配置
    cameraConfig:{
      //是否需要移动地图
      doNeedMoveMap:false,
      //帧时间
      frameTime:11
    },
    //地图配置
    mapConfig:{
      layer:0,
      oldLayer:null,
      zoomAdd:0.2,
      zoomSub:-0.1666666666666,
      browser:{
        width:null,
        height:null
      },
      mapSize:{
        width: {
          x1:-1799999999,
          x2:1800000000
        },
        height:{
          y1:900000000,
          y2:-900000000
        }
      },
      startDefaultPoint:{
        x:0,
        y:0
      },
      /**
        将相机坐标系与地图坐标系更改为顺向的，
       这将会影响如下部分：
       1.移动函数，缩放函数
       2.显示，
       请按照如下步骤尝试更正坐标系
       1.更改移动函数为双逆向（即鼠标从左往右滑动，地图元素向左移动）
       2.更改地图元素显示部分为双逆向（此时鼠标移动恢复正常）
       3.更改地图添加点时计算问题
      */
      A1:{
        x:0,
        y:0
      },
      A1Layer:0,
      centerPoint:{
        x:0,
        y:0
      },
      p0:{
        id:'p0',
        type:'point',
        points:[{x:0,y:0}],
        point:{x:0,y:0},
        color:'#000000',
        width:5
      },
      tempPoint:{
        id:'tempPoint',
        type:'point',
        points:[{x:0,y:0}],
        point:{x:0,y:0},
        color:'#000000',
        width:0
      },
      mousePoint:{
        x:0,
        y:0
      },
      mouseClick:{
        x:0,
        y:0
      },
      svgClick:{
        x:0,
        y:0
      }
    },
    //左侧元素信息面板显示的数据
    detailsPanelConfig:{
      data:{

      },
      sourcePoint:{
        x:null,
        y:null
      },
      target:null
    },
    //服务器相关数据
    serverData:{
      //1.服务器连接会话
      socket:undefined,
      //2.底图背景数据
      underlay:undefined,
      //3.用户名//目前已经移交至socket会话的数据中，此处仅作实例
      userName:'神秘用户',
      //4.用户邮箱//目前已经移交至socket会话的数据中，此处仅作实例
      userEmail:'Anyone@Any.com',
      //5.用户QQ,默认为1077365277//目前已经移交至socket会话的数据中，此处仅作实例
      userQq:1077365277
    }
  },
  //类似于vue中的computed，进行缓存，对于Store中的数据进行加工处理形成新的数据
  getters: {

  },
  //里面定义方法，操作state方发
  //Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。
  mutations: {
    /**经纬度坐标系转化为整数坐标
    1.功能：用于将带有负号，小数点符号的经纬度转化为纯整数的数字坐标
    2.传参：point,必要的,默认为{0,0},代表经纬度的x,y值;check,可选的,默认为false,若check传入true则表示需要对此经纬度的格式进行检查
    3.返参：obj,{x:int,y:int},返回一个含有x,y值的对象
    **/
    // longitudeLatitudeToInt(point,check){
    //   let mapW=this.state.mapConfig.mapSize.width;
    //   let mapH=this.state.mapConfig.mapSize.height;
    //   //1.将经纬度转化为整数
    //   let x=point.x || 0;
    //   let y=point.y || 0;
    //   let checkOut=check || false;
    //   let obj={x,y};
    //   if(checkOut){
    //     if(x>180 || y>90){
    //       return obj;
    //     }
    //   }
    //   obj.x=((mapW/2)+(Math.round(obj.x*10000000)));
    //   obj.y=((mapH/2)-(Math.round(obj.y*10000000)));
    //   return obj;
    // }
  },
  // 操作异步操作mutation
  actions: {

  }
})
