import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  //提供唯一的公共数据源，所有共享的数据统一放到store的state进行储存数据，相当于data
  state: {
    classList:{
      //综合的一个连接服务端的通讯类
      comprehensive:class comprehensive {
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
          //指令类型合集
          this.typeList=['broadcast','get_publickey','login','publickey','loginStatus','get_userData','send_userData','get_mapData','send_mapData'];
          //指令合集
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
            },
            //以广播的形式删除某一要素
            broadcast_deleteElement(elementId){
              return {type:"broadcast",class:"deleteElement",data:{id:elementId}}
            },
            //以广播普通文字消息
            broadcast_textMessage(data){
              return {type:'broadcast',class:'textMessage',data}
            },
            //以广播更新元素数据
            broadcast_updateElement(data){
              return {type:'broadcast',class:'updateElement',data}
            }
          };
          //检测间
          this.QIR={
            isObject (obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
            },

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
        //广播更新某一要素
        broadcastUpdateElement(data){
          try {
            //0.检查数据
            //0.1检查是否属于object
            if(Object.prototype.toString.call(data)!=="[object Object]"){return false;}
            //0.2检查是否存在changes
            if(data.hasOwnProperty("changes")){
              //0.3检查是否存在color
              if(data.changes.hasOwnProperty("color")){
                //0.3.1检查颜色是否为字符
                if(Object.prototype.toString.call(data.changes.color)!=="[object String]"){return false;}
                //0.3.2检查颜色是否为16进制的格式
                let Exp=/^[0-9A-F]{6}$/i;
                if(Exp.test(data.changes.color)===false){alert("请输入正确的16进制颜色格式例如#123456");return false;}
              }
              //0.4检查是否存在width
              if(data.changes.hasOwnProperty("width")){
                let $num1=parseInt(data.changes.width);
                if(Object.prototype.toString.call($num1)!=="[object Number]"){
                  alert("宽度为数字，范围为2~64");
                  return false;
                }else {
                  if($num1>64 || $num1<2){
                    alert("宽度范围为2~64");
                    return false;
                  }else {
                    data.changes.width=~~(data.changes.width);
                  }
                }
              }
              //0.5检查是否存在details
              if(data.changes.hasOwnProperty("details")){
                //0.5.1检查是否为数组
                if(Object.prototype.toString.call(data.changes.details)==="[object Array]"){
                  //0.5.2循环检查类型
                  for(let i=0;i<data.changes.details.length;i++){
                    //0.5.3检查是否为对象
                    if(Object.prototype.toString.call(data.changes.details[i])!=="[object object]"){
                      //0.5.4检查是否包含key，value属性
                      if(data.changes.details[i].hasOwnProperty("key") && data.changes.details[i].hasOwnProperty("value")){
                        //0.5.5检查key属性是否存在非法字符[key只能由汉字[a~Z][0~9]组成]，
                        //0.5.6key正则表达式
                        const KeyExp=/[^a-z0-9A-Z_\u4e00-\u9fa5]/m;
                        const ValueExp=/[\[\]{}#`'"]|(-){2}|(\/){2}|(%){2}|\/\*/m;
                        //key
                        if(KeyExp.test(data.changes.details[i].key)){
                          alert("列名错误，仅允许使用字母、数字、汉字、下划线");
                          return false;
                        }
                        //value
                        if(ValueExp.test(data.changes.details[i].value)){
                          alert("列值错误，不允许使用如下字符[]、{}、#、`、'、\"、--、//、%%、/*");
                          return false;
                        }
                      }else{return false;}}else{return false;}}}else{return false;}}
              //end广播
              this.send(this.Instruct.broadcast_updateElement(data));
            }
          }catch (e) {}

        }
        //广播删除某一要素
        broadcastDeleteElement(id){
          this.send(this.Instruct.broadcast_deleteElement(id));
        }
        //广播普通文本信息
        broadcastSendText(data){
          this.send(this.Instruct.broadcast_textMessage(data));
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
                alert("宽度为数字，范围为2~64");
                return false;
              }else {
                if(data.width>64 || data.width<2){
                  alert("宽度范围为2~64");
                  return false;
                }else {
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
              //获取广播类型
              let classIs=jsonData.class;
              switch (classIs){
                //A1位置广播
                case 'A1':{
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
                //新增点数据广播
                case 'point':{
                  //一、解析坐标
                  try{
                    //1.将base64转化为普通字符
                    let [lock,baseA,baseB,Ps,Pt]=[true,null,null,null,null]
                    try{
                      baseA=window.atob(jsonData.data.points);
                      baseB=window.atob(jsonData.data.point);
                    }
                    catch(e){lock=false;}
                    try{
                      if(lock){
                        Ps=JSON.parse(baseA);
                        Pt=JSON.parse(baseB);
                      }
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                    }
                  }catch(e){}
                  //二、解析详细描述信息
                  try{
                    //1.将base64转化为普通字符
                    let [lock,baseA,Ps]=[true,null,null];
                    try{
                      baseA=window.atob(jsonData.data.details);
                    }
                    catch(e){lock=false;}
                    try {
                      if(lock){
                        Ps=JSON.parse(baseA);
                      }
                    }catch(e){lock=false;}
                    if(lock){
                      jsonData.data.details=Ps;
                    }
                  }catch(e){}
                  //更新messages
                  let NewMessageObj={'type':'broadcast','class':'point','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);
                  //添加到mapData
                  this.mapData.push(jsonData.data);
                  break;
                }
                //删除某一元素的广播
                case 'deleteElement':{
                  try{
                    let ID=jsonData.data.id;
                    //查找并删除该id
                    this.mapData.some((item, index)=>{
                      if (item.id==ID){
                        this.mapData.splice(index,1);
                        return true;
                      }
                    });
                    //更新消息
                    this.messages.push(jsonData);
                  }
                  catch (e) {}
                  break;
                }
                //普通文本消息
                case 'textMessage':{
                  //更新messages
                  let NewMessageObj={'type':'broadcast','class':'textMessage','conveyor':jsonData.conveyor,'time':jsonData.time,'data':jsonData.data};
                  this.messages.push(NewMessageObj);
                  break;
                }
                //更新某一元素的广播
                case 'updateElement':{
                  try{
                    //解码details如果有的话
                    if(jsonData.data.hasOwnProperty('details')){
                      jsonData.data.details=JSON.parse(window.atob(jsonData.data.details));
                    }
                    //提取id
                    let eId=jsonData.data.id;
                    //查找相应的地图数据并修改地图数据
                    for (let i=0;i<this.mapData.length;i++){
                      if(eId==this.mapData[i].id){
                        Object.assign(this.mapData[i],jsonData.data);
                        //更新message
                        this.messages.push(jsonData);
                        break;
                      }
                    }
                  }catch (e) {

                  }
                  break;
                }
              }
              break;
            }
            default:{
            }
          }
          }
        }
        //断开连接事件
        onClose(ev){
          this.isLink=false;
          return true;
        }
        //连接失败事件
        onError(ev){
          this.isLink=false;
          return true;
        }
        //连接成功事件
        onOpen(ev){
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
      A1Layer:0,
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
      A1:{
        x:0,
        y:0
      },
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
        color:'000000',
        width:0,
        defaultWidth:5
      },
      tempLine:{
        id:'tempLine',
        type:'line',
        points:[],
        point:{x:0,y:0},
        color: '00ffff',
        length: null,
        width: 2,
        size: null,
        child_relations: null,
        father_relation: null,
        child_nodes: null,
        father_node: null,
        details:[
          {key: '名称', value: ''},
          {key: '类型', value: ''},
          {key: '备注', value: ''},
          {key: '区域', value: ''}
        ],
        defaultWidth:2,
        showPos:[]
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
      },
      svgDbClick:{
        x:0,
        y:0
      },
      //元素被右键选择
      operated:{
        //被操作元素id
        id:null,
        //被操作元素的元素数据
        data:null
      },
      //SVG鼠标指针类型
      cursor:'default',
      //指针类型的锁止，允许某一个组件占用cursor使得其他组件无法更新cursor
      cursorLock:false
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
    //控制层的配置
    layerControlConfig:{
    },
    //点添加属性面板的配置
    pointAttributeBoardConfig:{

    },
    //元素右键操作面板的配置
    elementOperationBoardConfig:{
      posX:null,
      posY:null,
      display:false
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
      userQq:1077365277,
      //6.用户头像背景色(在消息面板处用)
      userHeadColor:'ffffff',
      //7.默认值
      default:{
        "user_email": "神秘用户",
        "user_name": "神秘用户",
        "map_layer": "0",
        "default_a1": "{x:0,y:0}",
        "save_point": null,
        "user_qq": "1077365277",
        "head_color": "ffffff"
      }
    }
  },
  getters: {

  },
  mutations: {

  },
  actions: {

  }
})
