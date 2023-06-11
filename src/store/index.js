import Vue from 'vue'
import Vuex from 'vuex'
import * as Leaflet from "leaflet";
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    classList:{
      comprehensive:class comprehensive {//综合的一个连接服务端的通讯类
        constructor(url){
          this.url=url;
          this.isLink=false;
          this.isLogin=false;
          this.numberOfLoginAttempts=0;//登录成功次数
          this.numberOfLoginFailed=0;//登录失败次数
          this.reinitializeElement=0;//重新初始化元素
          this.reinitializeId=-1;//重新初始化元素id
          this.reinitializeSourcePoints=[];//初始化源
          this.reinitializeSourcePoint=null;//初始化源
          this.socket=undefined;//会话
          this.messages=[];
          this.publickey='';
          this.userData=null;
          this.mapData={points:[],lines:[],areas:[]};
          this.config={};
          this.otherA1=[];
          this.typeList=['broadcast','get_serverConfig','get_publickey','login','publickey','loginStatus','get_userData','send_userData','get_mapData','send_mapData'];//指令类型合集
          this.Instruct={//指令合集
            login(email,password) {//登录指令
              this.email=email || '';
              this.password=password || '';
              return {type:'login',data:{email:this.email,password:this.password}}
            },
            get_publickey() {//获取公钥指令
              return {type:'get_publickey'}
            },
            get_userData(){//获取用户数据指令
              return {type:'get_userData'}
            },
            get_mapData(){//获取地图数据指令
              return {type:'get_mapData'}
            },
            get_serverConfig(){//获取服务器配置
              return {type:'get_serverConfig'}
            },
            broadcast_A1(x,y,color,name){//广播我的A1位置
              return {type:'broadcast',class:'A1',data: {x,y,color,name}}
            },
            broadcast_point(data){//以广播的形式发送新增点数据
              return {type:'broadcast',class:'point',data}
            },
            broadcast_deleteElement(elementId){//以广播的形式删除某一要素
              return {type:'broadcast',class:'deleteElement',data:{id:elementId}}
            },
            broadcast_textMessage(data){//以广播普通文字消息
              return {type:'broadcast',class:'textMessage',data}
            },
            broadcast_updateElement(data){//以广播更新元素数据
              return {type:'broadcast',class:'updateElement',data}
            },
            broadcast_line(data){//以广播的形式添加一条线段
              return {type:'broadcast',class:'line',data}
            },
            broadcast_area(data){//以广播的形式添加一条线段
              return {type:'broadcast',class:'area',data}
            },
            broadcast_updateElementNode(data){//以广播形式更新元素节点
              return {type:'broadcast',class:'updateElementNode',data}
            }
          };
          this.QIR={//检测间
            /**检测是否为对象类型的数据,是则返回t
             * @return boolean
             * @param obj any
             */
            isObject (obj) {
              return Object.prototype.toString.call(obj) === '[object Object]';
            },
            /**检测一个对象是否存在某一个属性,有则返回t
             * @return boolean
             * @param obj any
             * @param propName string
             */
            hasProperty(obj, propName) {
              return obj.hasOwnProperty(propName);
            },
            /**检测一个字符串是否为六位的十六进制颜色,是则返回t
             * @return boolean
             * @param str
             */
            color16Check(str){
              if(Object.prototype.toString.call(str)!=='[object String]'){return false;}
              let Exp=/^[0-9A-F]{6}$/i;
              if(Exp.test(str)===false){alert('请输入正确的16进制颜色格式例如#123456');return false;}
              return true;
            },
            /**检测是否为数字,是则返回该数字的整数部分,否则返回false
             * @return boolean number
             * @param number
             */
            widthCheck(number){
              function isNumber(value) {
                if (typeof value === 'string' && !isNaN(value)) {
                  return true;
                }
                return typeof value === 'number' && !isNaN(value);
              }
              if(!isNumber(number)){
                alert('宽度为数字，范围为2~64');
                return false;
              }else {
                if(number>64 || number<2){
                  alert('宽度范围为2~64');
                  return false;
                }else {
                  return number=~~number;
                }
              }
            },
            /**检测自定义参数是否正常,正常则返回true
             * @return boolean
             * @param details
             */
            detailsCheck(details){
              const KeyExp=/[^a-z0-9A-Z_\u4e00-\u9fa5]/m;//key正则表达式
              const ValueExp=/[\[\]{}#`'"]|(-){2}|(\/){2}|(%){2}|\/\*/m;
              if(Object.prototype.toString.call(details)==='[object Array]'){//1检查是否为数组
                for(let i=0;i<details.length;i++){//2循环检查类型
                  if(Object.prototype.toString.call(details[i])!=='[object object]'){//3检查是否为对象
                    if(details[i].hasOwnProperty('key') && details[i].hasOwnProperty('value')){//4检查是否包含key，value属性
                      if(KeyExp.test(details[i].key)){//5检查key属性是否存在非法字符[key只能由汉字[a~Z][0~9]组成]，
                        alert('列名错误，仅允许使用字母、数字、汉字、下划线');
                        return false;
                      }
                      if(ValueExp.test(details[i].value)){
                        alert("列值错误，不允许使用如下字符[]、{}、#、`、'、\"、--、//、%%、/*");
                        return false;
                      }
                    }else {
                      return false;
                    }
                  }else {
                    return false;
                  }
                }
              }
              else {
                return false;
              }
              return true;
            },
            isNumber(value) {
              if (typeof value === 'string' && !isNaN(value)) {
                return true;
              }
              return typeof value === 'number' && !isNaN(value);
            },
            isArray(obj) {
              return Array.isArray(obj);
            }
        };
          this.startSetting();
        }
        startSetting(){//初始化配置
          this.link();
          this.heartbeat();
        }
        clearLocalData(){//清除本地数据
          this.userData=null;//1.清除会话内的用户数据
          this.otherA1=[];//2.清除他人的A1
          this.mapData.points=[];//3.清除地图数据
          this.mapData.lines=[];
          this.mapData.areas=[];
        }
        broadcastUpdateElementNode(data){//广播更新元素节点
          try{
            let sObj={};
            if(!this.QIR.isObject(data)){return false;}
            if(!this.QIR.hasProperty(data,'id')){return false;}//1.检查参数是否为数字
            if(!this.QIR.hasProperty(data,'points')){return false;}
            if(!this.QIR.isArray(data.points)){return false;}
            for(let i=0;i<data.points.length;i++){
              let nowCheck=data.points[i];
              if(!this.QIR.isObject(nowCheck)){return false;}
              if(this.QIR.isNumber(nowCheck.x)===false || this.QIR.isNumber(nowCheck.y)===false){return false;}
            }
            sObj.type=data.type;
            sObj.id=data.id;
            sObj.points=data.points;
            if(this.QIR.hasProperty(data,'point')){
             if(this.QIR.isObject(data.point)){
               if(this.QIR.hasProperty(data.point,'x') && this.QIR.hasProperty(data.point,'y')){
                 if(this.QIR.isNumber(data.point.x) && this.QIR.isNumber(data.point.y)){
                   sObj.point=data.point;
                 }
               }
             }
            }
            this.send(this.Instruct.broadcast_updateElementNode(sObj));
          }
          catch (e) {

          }
        }
        broadcastUpdateElement(data){//广播更新某一要素
          try {
            if(!this.QIR.isObject(data)){return false;}//0.1检查是否属于object
            if(this.QIR.hasProperty(data,'changes')){//0.2检查是否存在changes
              if(this.QIR.hasProperty(data.changes,'color')){//0.3检color
                if(!this.QIR.color16Check(data.changes.color)){
                  return false;
                }
              }
              if(this.QIR.hasProperty(data.changes,'width')){//0.4检查width
                let refWidth=this.QIR.widthCheck(data.changes.width);
                if(refWidth===false){return false;}else{data.changes.width=refWidth;}
              }
              if(this.QIR.hasProperty(data.changes,'details')){//0.5检查details
                if(!this.QIR.detailsCheck(data.changes.details)){
                  return false;
                }
              }
              this.send(this.Instruct.broadcast_updateElement(data));//0.6广播
            }
          }catch (e) {}

        }
        broadcastDeleteElement(id){//广播删除某一要素
          this.send(this.Instruct.broadcast_deleteElement(id));
        }
        broadcastSendText(data){//广播普通文本信息
          this.send(this.Instruct.broadcast_textMessage(data));
        }
        broadcastSendLine(data,area){//发送路径线数据(兼容区域类型，只需要在第二个参数area值为area即可)
          try{
            if(!this.QIR.isObject(data)){return false;}//0.1检查是否属于object
            if(!this.QIR.hasProperty(data,'class')){return false;}//0.2检查是否包含class类型
            if(area==='area'){//0.3检查class类型是否为line
              if(data.class!=='area'){return false;}
            }else {
              if(data.class!=='line'){return false;}
            }
            if(!this.QIR.hasProperty(data,'point')){return false;}//0.4检查是否包含point类型
            if(!this.QIR.isObject(data.point)){return false;}//0.5检查point是否为object
            if(!this.QIR.hasProperty(data.point,'x')){return false;}//0.6检查point是否由xy
            if(!this.QIR.hasProperty(data.point,'y')){return false;}
            if(!this.QIR.isNumber(data.point.x)){return false;}//0.7检查xy是否是数字
            if(!this.QIR.isNumber(data.point.y)){return false;}
            if(!this.QIR.hasProperty(data,'points')){return false;}//0.8检查points
            if(!this.QIR.isArray(data.points)){return false;}//0.8.1检查points是否为数组
            for(let i=0;i<data.points.length;i++){//0.8.2循环检测内部的xy参数
              if(!this.QIR.hasProperty(data.points[i],'x')){return false;}//0.8.3检测是否存在xy值
              if(!this.QIR.hasProperty(data.points[i],'y')){return false;}
              if(!this.QIR.isNumber(data.points[i].x)){return false;}//0.8.4检测xy是否是数字
              if(!this.QIR.isNumber(data.points[i].y)){return false;}
            }
            if(!this.QIR.hasProperty(data,'color')){return false;}//0.9检查color
            if(!this.QIR.color16Check(data.color)){return false;}//0.10检查颜色
            if(this.QIR.hasProperty(data,'width')){//0.11检查width
              let refWidth=this.QIR.widthCheck(data.width)
              if(!refWidth){return false;}else {data.width=refWidth;}
            }
            if(this.QIR.hasProperty(data,'details')){//0.11检查details
              if(!this.QIR.detailsCheck(data.details)){
                return false
              }
            }
            let basicStructure={//1.0构建点数据基本结构
              id:0,
              type:'line',
              points:[],
              point:null,//必要
              color:'',//必要
              length:null,//这里为空
              width:2,//宽度
              size:null,//这里为空
              childRelations:[],//这里为空
              fatherRelation:'',//这里为空
              childNodes:[],//这里为空
              fatherNode:'',//这里为空
              details:[]
            };
            basicStructure.points=data.points;//2.0归档
            basicStructure.point=data.point;
            basicStructure.color=data.color;
            basicStructure.width=data.width || basicStructure.width;
            basicStructure.details=data.details || basicStructure.details;
            if(area==='area'){//3.0广播
              basicStructure.type='area';
              this.send(this.Instruct.broadcast_area(basicStructure));
            }else {
              this.send(this.Instruct.broadcast_line(basicStructure));
            }
          }
          catch (e) {}
        }
        broadcastSendPoint(data){//发送关注点数据
          try {
            if(!this.QIR.isObject(data)){return false;}//0.1检查是否属于object
            if(!this.QIR.hasProperty(data,'class')){return false;}//0.2检查是否包含class类型
            if(data.class!=='point'){return false;}//0.3检查class类型是否为point
            if(!this.QIR.hasProperty(data,'point')){return false;}//0.4检查是否包含point类型
            if(!this.QIR.isObject(data.point)){return false;}//0.5检查point是否为object
            if(!this.QIR.hasProperty(data.point,'x')){return false;}//0.6检查point是否由xy
            if(!this.QIR.hasProperty(data.point,'y')){return false;}
            if(!this.QIR.isNumber(data.point.x)){return false;}//0.7检查xy是否是数字
            if(!this.QIR.isNumber(data.point.y)){return false;}
            if(!this.QIR.hasProperty(data,'color')){return false;}//0.8检查color
            if(!this.QIR.color16Check(data.color)){return false;}//0.9检查颜色
            if(this.QIR.hasProperty(data,'width')){//0.10检查width
              let refWidth=this.QIR.widthCheck(data.width)
              if(!refWidth){return false;}else {data.width=refWidth;}
            }
            if(this.QIR.hasProperty(data,'details')){//0.11检查details
              if(!this.QIR.detailsCheck(data.details)){
                return false
              }
            }
            let basicStructure={
              id:0,
              type:'point',
              points:[],
              point:null,
              color:'',
              length:null,
              width:2,
              size:null,
              childRelations:[],
              fatherRelation:'',
              childNodes:[],
              fatherNode:'',
              details:[]
            };
            basicStructure.points[0]=data.point;
            basicStructure.point=data.point;
            basicStructure.color=data.color;
            basicStructure.width=data.width || basicStructure.width;
            basicStructure.details=data.details || basicStructure.details;
            this.send(this.Instruct.broadcast_point(basicStructure));
          }catch (e) {}
        }
        broadcastMyA1(x,y,color,name){//广播A1
          this.send(this.Instruct.broadcast_A1(x,y,color,name));
        }
        heartbeat(){//心跳
          setInterval(()=>{
            if(this.socket!==undefined){
              this.socket.send('');
            }
          },55000)
        }
        closeLink(){//断开服务器连接
          this.socket.close();
          this.isLogin=false;
        }
        handleLocalStorage(method, key, value) {//本地存储接口
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
        getUserData(){//获取用户数据
          this.send(this.Instruct.get_userData());
        }
        getMapData(){//获取地图数据
          this.send(this.Instruct.get_mapData());
        }
        getServerConfig(){//获取服务器配置信息
          this.send(this.Instruct.get_serverConfig());
        }
        getServerPublickey(){//获取服务器公钥
          this.send(this.Instruct.get_publickey());
        }
        login(email,password){//登录方法
          if (check(''+email+password)){//1.检查用户输入
            this.send(this.Instruct.login(email,password));
          }
          function check(text){
            let pat=new RegExp('[^a-zA-Z0-9\_@.+/=-]','i');
            if(pat.test(text)===true) {
              alert('邮箱及密码只能是：字母，数字，下划线 @ . - ，如果您的邮箱包含除此之外的字符，请联系站长');
              return false;
            }else {return true}
          }
        }
        link(){//连接服务器方法
          this.socket=new WebSocket(this.url)
          this.socket.onopen=(ev)=>this.onOpen(ev)
          this.socket.onmessage=(ev)=>this.onMessage(ev);
          this.socket.onclose=(ev)=>this.onClose(ev);
          this.socket.onerror=(ev)=>this.onError(ev);
          return true;
        }
        send(instructObj){////发送数据
          if(this.isLink){
            if(this.instructObjCheck(instructObj)){//1.数据检查
              let json=JSON.stringify(instructObj);
              this.socket.send(json);
            }
          }
        }
        instructObjCheck(instructObj){//指令检查
          if(Object.prototype.toString.call(instructObj)!=='[object Object]'){
            return false;
          }
          if(instructObj.type===undefined){
            return false;
          }
          if(this.typeList.indexOf(instructObj.type)===-1){
            return false;
          }
          if(instructObj.type==='broadcast'){
            if(instructObj.class===undefined){
              return false;
            }
          }
          return true;
        }
        onMessage(ev){//收到消息事件
          let jsonData=JSON.parse(ev.data);
          if(jsonData.type!==undefined){
          let nowType=jsonData.type;//处理数据
          switch (nowType){
            case 'send_serverConfig':{//服务器发来配置信息
              this.config=jsonData.data;
              break;
            }
            case 'publickey':{//服务器发来公钥
              this.publickey=jsonData.data;
              break;
            }
            case 'loginStatus':{//服务器发来登录状态
              if(jsonData.data){
                this.isLogin=true;
                this.numberOfLoginAttempts++;
              }else {
                this.isLogin=false;
                this.numberOfLoginFailed++;
              }
              break;
            }
            case 'send_userData':{//服务器发来的用户数据
              this.userData=jsonData.data;
              break;
            }
            case 'send_mapData':{//服务器发来的地图数据
              for (let i=0;i<jsonData.data.length;i++){
                try{
                  let [Ps,Pt]=[null,null]//point相关
                  Pt=JSON.parse(window.atob(jsonData.data[i].point));
                  Ps=JSON.parse(window.atob(jsonData.data[i].points));
                  jsonData.data[i].points=Ps;
                  jsonData.data[i].point=Pt;
                  let [loc,baseD,Pu]=[true,null,null];//details
                  try{
                    baseD=window.atob(jsonData.data[i].details);
                  }
                  catch(e){loc=false;}
                  try {
                    if(loc){
                      Pu=JSON.parse(baseD);
                    }
                  }catch(e){loc=false;}
                  if(loc){
                    jsonData.data[i].details=Pu;
                  }
                  let NowType=jsonData.data[i].type;//分组
                  switch (NowType) {
                    case 'line':{
                      this.mapData.lines.push(jsonData.data[i]);
                      break;
                    }
                    case 'point':{
                      this.mapData.points.push(jsonData.data[i]);
                      break;
                    }
                    case 'area':{
                      this.mapData.areas.push(jsonData.data[i]);
                      break;
                    }
                  }
                }
                catch(e){}
              }
              break;
            }
            case 'broadcast':{//服务器发来的广播
              let classIs=jsonData.class;//获取广播类型
              switch (classIs){
                case 'A1':{//A1位置广播
                  let oldLength=this.otherA1.length;//曾经的长度
                  let newEm=jsonData.data.email;//新收到的
                  let lock=true;//是否新增
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
                  if(lock){//再新增
                    this.otherA1.push(jsonData.data);
                  }
                  break;
                }
                case 'line':{//新增线段数据广播
                  try{
                    let [lock,baseA,baseB,Ps,Pt]=[true,null,null,null,null]
                    try{
                      baseA=window.atob(jsonData.data.points);//将base64转化为普通字符
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
                  try{
                    let [lock,baseA,Ps]=[true,null,null];
                    try{
                      baseA=window.atob(jsonData.data.details);//将base64转化为普通字符
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
                  let NewMessageObj={'type':'broadcast','class':'line','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);//更新messages
                  this.mapData.lines.push(jsonData.data);//添加到mapData
                  break;
                }
                case 'area':{//新增线段数据广播
                  try{//解析坐标
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
                  try{//解析详细描述信息
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
                  let NewMessageObj={'type':'broadcast','class':'area','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);//更新messages
                  this.mapData.areas.push(jsonData.data);//添加到mapData
                  break;
                }
                case 'point':{//新增点数据广播
                  try{//解析坐标
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
                  try{
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
                  let NewMessageObj={'type':'broadcast','class':'point','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);
                  this.mapData.points.push(jsonData.data);
                  break;
                }
                case 'deleteElement':{//删除某一元素的广播
                  try{
                    let ID=jsonData.data.id;
                    this.mapData.points.some((item, index)=>{//查找并删除该id
                      if (item.id==ID){
                        this.mapData.points.splice(index,1);
                        return true;
                      }
                    });
                    this.mapData.lines.some((item, index)=>{
                      if (item.id==ID){
                        this.mapData.lines.splice(index,1);
                        return true;
                      }
                    });
                    this.mapData.areas.some((item, index)=>{
                      if (item.id==ID){
                        this.mapData.areas.splice(index,1);
                        return true;
                      }
                    });
                    this.messages.push(jsonData);//更新消息
                  }
                  catch (e) {}
                  break;
                }
                case 'textMessage':{//普通文本消息
                  let NewMessageObj={'type':'broadcast','class':'textMessage','conveyor':jsonData.conveyor,'time':jsonData.time,'data':jsonData.data};
                  this.messages.push(NewMessageObj);
                  break;
                }
                case 'updateElement':{//更新某一元素的广播
                  try{
                    if(jsonData.data.hasOwnProperty('details')){//解码details如果有的话
                      jsonData.data.details=JSON.parse(window.atob(jsonData.data.details));
                    }
                    let eId=jsonData.data.id;//提取id
                    for (let i=0;i<this.mapData.points.length;i++){//查找相应的地图数据并修改地图数据
                      if(eId==this.mapData.points[i].id){
                        Object.assign(this.mapData.points[i],jsonData.data);
                        this.messages.push(jsonData);//更新message
                        break;
                      }
                    }
                    for (let i=0;i<this.mapData.lines.length;i++){//查找相应的地图数据并修改地图数据
                      if(eId==this.mapData.lines[i].id){
                        Object.assign(this.mapData.lines[i],jsonData.data);
                        this.messages.push(jsonData);//更新message
                        break;
                      }
                    }
                    for (let i=0;i<this.mapData.areas.length;i++){//查找相应的地图数据并修改地图数据
                      if(eId==this.mapData.areas[i].id){
                        Object.assign(this.mapData.areas[i],jsonData.data);
                        this.messages.push(jsonData);//更新message
                        break;
                      }
                    }
                  }catch (e) {

                  }
                  break;
                }
                case 'updateElementNode':{//更新某一元素的节点的广播
                  try{//解析
                    let pointsObj=JSON.parse(window.atob(jsonData.data.points));
                    let pointObj=null;
                    if(this.QIR.hasProperty(jsonData.data,'point')){
                      pointObj=JSON.parse(window.atob(jsonData.data.point));
                    }
                    let CgID=jsonData.data.id;
                    let type=null;//查找type类型（如果有的话）
                    if(this.QIR.hasProperty(jsonData.data,'type')){
                      type=jsonData.data.type+'s';
                    }
                    if(type!==null){//如果有type类型的话则按照type类型查找
                      let length=this.mapData[type].length;
                      for(let k=0;k<length;k++){
                        if(this.mapData[type][k].id==CgID){
                          let copyObj={};
                          Object.assign(copyObj,this.mapData[type][k]);
                          copyObj.points=pointsObj;
                          if(pointObj!==null){
                            copyObj.point=pointObj;
                          }
                          this.mapData[type].splice(k,1,copyObj);//删除旧数据
                          this.reinitializeSourcePoints=copyObj.points;//同步源
                          if(pointObj!==null){
                            this.reinitializeSourcePoint=copyObj.point;//同步源
                          }
                          this.reinitializeElement++;//更改初始化
                          this.reinitializeId=copyObj.id;
                          break;
                        }
                      }
                    }else {//没有的话全局查找
                      let FindLock=false;
                      let FindType=null;
                      let FindUnder=null;
                      let lineLen=this.mapData.lines.length;
                      let pointLen=this.mapData.points.length;
                      let areaLen=this.mapData.areas.length;
                      let leng=Math.max(lineLen,pointLen,areaLen);
                      for(let i=0;i<leng;i++){
                        if(i<lineLen){
                          if(this.mapData['lines'][i].id==CgID){
                            FindLock=true;
                            FindType='lines';
                            FindUnder=i;
                            break;
                          }
                        }
                        if(i<pointLen){
                          if(this.mapData['points'][i].id==CgID){
                            FindLock=true;
                            FindType='points';
                            FindUnder=i;
                            break;
                          }
                        }
                        if(i<areaLen){
                          if(this.mapData['areas'][i].id==CgID){
                            FindLock=true;
                            FindType='areas';
                            FindUnder=i;
                            break;
                          }
                        }
                      }
                      if(FindLock){
                        let copyObj={};
                        Object.assign(copyObj,this.mapData[FindType][FindUnder]);
                        copyObj.points=pointsObj;
                        if(pointObj!==null){
                          copyObj.point=pointObj;
                        }
                        this.mapData[FindType].splice(FindUnder,1,copyObj);//2.删除旧数据
                        this.reinitializeElement++;//3.更改初始化
                        this.reinitializeId=copyObj.id;
                      }
                    }
                    let MesObj={
                      type: 'broadcast',
                      class: 'updateElementNode',
                      conveyor: jsonData.conveyor,
                      time: jsonData.time,
                      data: {
                        id: jsonData.data.id,
                        type: jsonData.data.type
                      }
                    };
                    this.messages.push(MesObj);//3.消息通知
                    break;
                  }catch (e) {

                  }
                }
              }
              break;
            }
            default:{
            }
          }
          }
        }
        onClose(ev){//断开连接事件
          this.isLink=false;
          return true;
        }
        onError(ev){//连接失败事件
          this.isLink=false;
          return true;
        }
        onOpen(ev){//连接成功事件
          this.isLink=true;
          this.getServerPublickey();//获取公钥
          this.getServerConfig();//获取服务器配置
          return true;
        }
      },
    },
    anonymousInstruct:{//匿名命令的临时缓存
      name:null,
      data:null
    },
    /**
     * 命令的缓存,各组件根据需求监听这里的数据变化，也可以监听整个commits
     * 命令是用于个体组件与外界进行通讯的手段之一，请在main.js的sendInstruct进行注册
    **/
    commits:{
      disableZoomAndMove:false,
      createTestLine:false,
      openF4DebugBord:false,
      openDetailsPanel:false,
      reloadAccounts:false,
      reloadServers:false,
      addNewPointEnd:false,
      previewLine:false,
      addNewLineEnd:false,
      addNewAreaEnd:false
    },
    cameraConfig:{//相机配置
      windowChange:false,//窗口变化
      doNeedMoveMap:false,//是否需要移动地图
      frameTime:1,//帧时间
      maxZoom:5,//最大缩放
      minZoom:-10,//最小缩放
      unit1X:1,//横轴单位1
      unit1Y:1,//纵轴单位1
      offsetX:0,//x偏移补偿
      offsetY:0,//y偏移补偿
    },
    leafletConfig:{//底图配置
      enableBaseMap:false,
      resolution:{
        width:null,
        height:null
      },
      options:{
        minZoom:3,
        maxZoom:18,
        center:[0,0],
        zoom:13,
        zoomControl:false,
        scrollWheelZoom:false,
        attributionControl:false,
        crs:L.CRS.EPSG3857,
        inertia:false
      },
      baseLayer:'',
    },
    mapConfig:{//地图配置
      A1Layer:0,
      layer:0,
      oldLayer:null,
      zoomAdd:1,//k
      zoomSub:(Math.pow(1+1,-1))-1,
      browser:{
        width:null,
        height:null
      },
      mapSize:{
        width: {
          max:null,
          min:null
        },
        height:{
          max:null,
          min:null
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
        color: '000000',
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
      tempArea:{
        id:'tempArea',
        type:'area',
        points:[],
        point:{x:0,y:0},
        color: '000000',
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
      svgMouseUp:{
        x:0,
        y:0
      },
      svgMouseDown:{
        x:0,
        y:0
      },
      clearClick:{
        x:0,
        y:0
      },
      operated:{//元素被右键选择
        id:null,//被操作元素id
        data:null//被操作元素的元素数据
      },
      cursor:'default',//SVG鼠标指针类型
      cursorLock:false,//指针类型的锁止
      reinitializeId:-1,//重新初始化的id
      inputFocusStatus:false//input聚焦状态
    },
    detailsPanelConfig:{//左侧元素信息面板显示的数据
      data:{

      },
      sourcePoint:{
        x:null,
        y:null
      },
      target:null
    },
    elementOperationBoardConfig:{//元素右键操作面板的配置
      posX:null,
      posY:null,
      display:false
    },
    pageConfig:{//页面配置
      homeSeparateState:true,
      mapSeparateState:false
    },
    userSettingConfig:{//用户设置
      UpdateServerStatus:false,//1.是否在服务器列表中开启每隔60秒自动更新服务器在线状态
      UpdateServerStatusTime:60000,
      startUpdateServerStatus:true,//2.是否启用启动时自动搜索服务器状态
      elementPanelLayerShow:false,//是否开启元素面板
    },
    serverData:{//服务器相关数据
      socket:undefined,//1.服务器连接会话
      underlay:undefined,//2.底图背景数据
      userName:'点击头像登录',
      userEmail:'Anyone@Any.com',
      userQq:1077365277,
      userHeadColor:'ffffff',
      default:{
        'user_email': '神秘用户',
        'user_name': '神秘用户',
        'map_layer': '0',
        'default_a1': '{x:0,y:0}',
        'save_point': null,
        'user_qq': '1077365277',
        'head_color': 'ffffff'
      }
    },
  },
  getters: {

  },
  mutations: {
    clearTempAreaCache(state){//清空临时区域的缓存
      state.mapConfig.tempArea={
        id:'tempArea',
        type:'area',
        points:[],
        point:{x:0,y:0},
        color: '000000',
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
      }
    },
    clearTempLineCache(state){//清空临时线段的缓存
      state.mapConfig.tempLine={
        id:'tempLine',
        type:'line',
        points:[],
        point:{x:0,y:0},
        color: '000000',
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
      }
    },
    destroyComprehensive(state){//销毁综合对象
      state.serverData.socket=undefined;
    },
    restoreMapConfig(state){//恢复默认地图配置
      state.mapConfig={
        A1Layer:0,layer:0,oldLayer:null,zoomAdd:1,zoomSub:(Math.pow(1+1,-1))-1,
        browser:{width:null,height:null},
        mapSize:{width:{x1:0,x2:0},height:{y1:0,y2:0}},
        A1:{x:0,y:0},
        centerPoint:{x:0,y:0},
        p0:{id:'p0',type:'point',points:[{x:0,y:0}],point:{x:0,y:0},color:'#000000',width:0},
        tempPoint:{id:'tempPoint',type:'point',points:[{x:0,y:0}],point:{x:0,y:0},color:'000000',width:0,defaultWidth:5},
        tempLine:{id:'tempLine',type:'line',points:[],point:{x:0,y:0},color:'000000',length:null,width:2,size:null,child_relations:null,father_relation:null,child_nodes:null,father_node:null,
          details:[{key:'名称',value:''},{key:'类型',value:''},{key:'备注',value:''},{key:'区域',value:''}],defaultWidth:2,showPos:[]},
        tempArea:{id:'tempArea',type:'area',points:[],point:{x:0,y:0},color:'000000',length:null,width:2,size:null,child_relations:null,father_relation:null,child_nodes:null,father_node:null,
          details:[{key:'名称',value:''},{key:'类型',value:''},{key:'备注',value:''},{key:'区域',value:''}],defaultWidth:2,showPos:[]},
        mousePoint:{x:0,y:0},
        mouseClick:{x:0,y:0},
        svgClick:{x:0,y:0},
        svgDbClick:{x:0,y:0},
        svgMouseUp:{x:0,y:0},
        svgMouseDown:{x:0,y:0},
        clearClick:{x:0,y:0},
        operated:{id:null,data:null},
        cursor:'default',cursorLock:false,reinitializeId:-1,inputFocusStatus:false
      }
    },
    restoreLeafletConfig(state){//恢复默认底图配置
      state.leafletConfig={
        enableBaseMap:false,
        options:{
          minZoom:3,
          maxZoom:18,
          center:[0,0],
          zoom:13,
          zoomControl:false,
          attributionControl:false,
          crs:L.CRS.EPSG3857,
          inertia:false
        },
        baseLayer:'',
      }
    },
    restoreCameraConfig(state){//恢复默认相机配置
      state.cameraConfig={
        doNeedMoveMap:false,
          frameTime:11,
          maxZoom:5,
          minZoom:-10,
          unit1X:1,
          unit1Y:1,
      }
    }
  },
  actions: {

  }
})
