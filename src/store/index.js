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
          this.url=url;
          this.isLink=false;
          this.isLogin=false;
          this.numberOfLoginAttempts=0;//登录成功次数
          this.numberOfLoginFailed=0;//登录失败次数
          this.socket=undefined;//会话
          this.messages=[];
          this.publickey='';
          this.userData=null;
          this.mapData={points:[],lines:[],areas:[]};
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
              return {type:'login',data:{email:this.email,password:this.password}}
            },
            //获取公钥指令
            get_publickey() {
              return {type:'get_publickey'}
            },
            //获取用户数据指令
            get_userData(){
              return {type:'get_userData'}
            },
            //获取地图数据指令
            get_mapData(){
              return {type:'get_mapData'}
            },
            //获取服务器配置
            get_serverConfig(){
              return {type:'get_serverConfig'}
            },
            //广播我的A1位置
            broadcast_A1(x,y,color,name){
              //广播类型数据必须要规定class
              return {type:'broadcast',class:'A1',data: {x,y,color,name}}
            },
            //以广播的形式发送新增点数据
            broadcast_point(data){
              return {type:'broadcast',class:'point',data}
            },
            //以广播的形式删除某一要素
            broadcast_deleteElement(elementId){
              return {type:'broadcast',class:'deleteElement',data:{id:elementId}}
            },
            //以广播普通文字消息
            broadcast_textMessage(data){
              return {type:'broadcast',class:'textMessage',data}
            },
            //以广播更新元素数据
            broadcast_updateElement(data){
              return {type:'broadcast',class:'updateElement',data}
            },
            //以广播的形式添加一条线段
            broadcast_line(data){
              return {type:'broadcast',class:'line',data}
            }
          };
          //检测间
          this.QIR={
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
                // 先尝试将字符串类型的数字转换为数字类型
                if (typeof value === 'string' && !isNaN(value)) {
                  return true;
                }
                // 使用 isNaN 函数判断是否为数字
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
              //key正则表达式
              const KeyExp=/[^a-z0-9A-Z_\u4e00-\u9fa5]/m;
              const ValueExp=/[\[\]{}#`'"]|(-){2}|(\/){2}|(%){2}|\/\*/m;
              //1检查是否为数组
              if(Object.prototype.toString.call(details)==='[object Array]'){
                //2循环检查类型
                for(let i=0;i<details.length;i++){
                  //3检查是否为对象
                  if(Object.prototype.toString.call(details[i])!=='[object object]'){
                    //4检查是否包含key，value属性
                    if(details[i].hasOwnProperty('key') && details[i].hasOwnProperty('value')){
                      //5检查key属性是否存在非法字符[key只能由汉字[a~Z][0~9]组成]，
                      if(KeyExp.test(details[i].key)){
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
            /**检测参数是否为数字,是则返回true
             * @return boolean
             * @param value
             */
            isNumber(value) {
              // 先尝试将字符串类型的数字转换为数字类型
              if (typeof value === 'string' && !isNaN(value)) {
                return true;
              }
              // 使用 isNaN 函数判断是否为数字
              return typeof value === 'number' && !isNaN(value);
            },
            /**检测参数是否为数组,是则返回true
             * @return boolean
             * @param obj
             */
            isArray(obj) {
              return Array.isArray(obj);
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
          this.mapData.points=[];
          this.mapData.lines=[];
          this.mapData.areas=[];
        }
        //广播更新某一要素
        broadcastUpdateElement(data){
          try {
            //0.检查数据
            //0.1检查是否属于object
            if(!this.QIR.isObject(data)){return false;}
            //0.2检查是否存在changes
            if(this.QIR.hasProperty(data,'changes')){
              //0.3检color
              if(this.QIR.hasProperty(data.changes,'color')){
                if(!this.QIR.color16Check(data.changes.color)){
                  return false;
                }
              }
              //0.4检查width
              if(this.QIR.hasProperty(data.changes,'width')){
                let refWidth=this.QIR.widthCheck(data.changes.width);
                if(refWidth===false){return false;}else{data.changes.width=refWidth;}
              }
              //0.5检查details
              if(this.QIR.hasProperty(data.changes,'details')){
                if(!this.QIR.detailsCheck(data.changes.details)){
                  return false;
                }
              }
              //0.6广播
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
        //发送路径线数据
        broadcastSendLine(data){
          try{
            //0.检查数据
            //0.1检查是否属于object
            if(!this.QIR.isObject(data)){return false;}
            //0.2检查是否包含class类型
            if(!this.QIR.hasProperty(data,'class')){return false;}
            //0.3检查class类型是否为line
            if(data.class!=='line'){return false;}
            //0.4检查是否包含point类型
            if(!this.QIR.hasProperty(data,'point')){return false;}
            //0.5检查point是否为object
            if(!this.QIR.isObject(data.point)){return false;}
            //0.6检查point是否由xy
            if(!this.QIR.hasProperty(data.point,'x')){return false;}
            if(!this.QIR.hasProperty(data.point,'y')){return false;}
            //0.7检查xy是否是数字
            if(!this.QIR.isNumber(data.point.x)){return false;}
            if(!this.QIR.isNumber(data.point.y)){return false;}

            //0.8检查points
            if(!this.QIR.hasProperty(data,'points')){return false;}
            //0.8.1检查points是否为数组
            if(!this.QIR.isArray(data.points)){return false;}
            //0.8.2循环检测内部的xy参数
            for(let i=0;i<data.points.length;i++){
              //0.8.3检测是否存在xy值
              if(!this.QIR.hasProperty(data.points[i],'x')){return false;}
              if(!this.QIR.hasProperty(data.points[i],'y')){return false;}
              //0.8.4检测xy是否是数字
              if(!this.QIR.isNumber(data.points[i].x)){return false;}
              if(!this.QIR.isNumber(data.points[i].y)){return false;}
            }
            //0.9检查color
            if(!this.QIR.hasProperty(data,'color')){return false;}
            //0.10检查颜色
            if(!this.QIR.color16Check(data.color)){return false;}
            //0.11检查width
            if(this.QIR.hasProperty(data,'width')){
              let refWidth=this.QIR.widthCheck(data.width)
              if(!refWidth){return false;}else {data.width=refWidth;}
            }
            //0.11检查details
            if(this.QIR.hasProperty(data,'details')){
              if(!this.QIR.detailsCheck(data.details)){
                return false
              }
            }
            //1.0构建点数据基本结构
            let basicStructure={
              id:0,
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
            basicStructure.points=data.points;
            basicStructure.point=data.point;
            basicStructure.color=data.color;
            basicStructure.width=data.width || basicStructure.width;
            basicStructure.details=data.details || basicStructure.details;
            //3.0广播
            //console.log(basicStructure);
            this.send(this.Instruct.broadcast_line(basicStructure));
          }
          catch (e) {}
        }
        //发送关注点数据
        broadcastSendPoint(data){
          try {
            //0.检查数据
            //0.1检查是否属于object
            if(!this.QIR.isObject(data)){return false;}
            //0.2检查是否包含class类型
            if(!this.QIR.hasProperty(data,'class')){return false;}
            //0.3检查class类型是否为point
            if(data.class!=='point'){return false;}
            //0.4检查是否包含point类型
            if(!this.QIR.hasProperty(data,'point')){return false;}
            //0.5检查point是否为object
            if(!this.QIR.isObject(data.point)){return false;}
            //0.6检查point是否由xy
            if(!this.QIR.hasProperty(data.point,'x')){return false;}
            if(!this.QIR.hasProperty(data.point,'y')){return false;}
            //0.7检查xy是否是数字
            if(!this.QIR.isNumber(data.point.x)){return false;}
            if(!this.QIR.isNumber(data.point.y)){return false;}
            //0.8检查color
            if(!this.QIR.hasProperty(data,'color')){return false;}
            //0.9检查颜色
            if(!this.QIR.color16Check(data.color)){return false;}
            //0.10检查width
            if(this.QIR.hasProperty(data,'width')){
              let refWidth=this.QIR.widthCheck(data.width)
              if(!refWidth){return false;}else {data.width=refWidth;}
            }
            //0.11检查details
            if(this.QIR.hasProperty(data,'details')){
              if(!this.QIR.detailsCheck(data.details)){
                return false
              }
            }
            //1.0构建点数据基本结构
            let basicStructure={
              id:0,
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
            let pat=new RegExp('[^a-zA-Z0-9\_@.+/=-]','i');
            if(pat.test(text)===true) {
              alert('邮箱及密码只能是：字母，数字，下划线 @ . - ，如果您的邮箱包含除此之外的字符，请联系站长');
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
          if(Object.prototype.toString.call(instructObj)!=='[object Object]'){
            return false;
          }
          //2.检测是否存在type属性
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
            //5.检查是否包含class
            if(instructObj.class===undefined){
              return false;
            }
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
                this.numberOfLoginFailed++;
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
              for (let i=0;i<jsonData.data.length;i++){
                try{
                  //point相关
                  let [Ps,Pt]=[null,null]
                  Pt=JSON.parse(window.atob(jsonData.data[i].point));
                  Ps=JSON.parse(window.atob(jsonData.data[i].points));
                  jsonData.data[i].points=Ps;
                  jsonData.data[i].point=Pt;
                  //details
                  let [loc,baseD,Pu]=[true,null,null];
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
                  //分组
                  let NowType=jsonData.data[i].type;
                  switch (NowType) {
                    case 'line':{
                      this.mapData.lines.push(jsonData.data[i]);
                      break;
                    }
                    case 'point':{
                      this.mapData.points.push(jsonData.data[i]);
                      break;
                    }
                    case 'areas':{
                      break;
                    }
                  }
                }
                catch(e){}
              }
              //console.log(this.mapData);
              //这里一旦与vue的watch关联则会导致line内的points的xy全部丢失,找原因
              //setTimeout(()=>console.log(this.mapData),5000)
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
                //新增线段数据广播
                case 'line':{
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
                  let NewMessageObj={'type':'broadcast','class':'line','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);
                  //添加到mapData
                  this.mapData.lines.push(jsonData.data);
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
                  this.mapData.points.push(jsonData.data);
                  break;
                }
                //删除某一元素的广播
                case 'deleteElement':{
                  try{
                    let ID=jsonData.data.id;
                    //查找并删除该id
                    this.mapData.points.some((item, index)=>{
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
                    for (let i=0;i<this.mapData.points.length;i++){
                      if(eId==this.mapData.points[i].id){
                        Object.assign(this.mapData.points[i],jsonData.data);
                        //更新message
                        this.messages.push(jsonData);
                        break;
                      }
                    }
                    //查找相应的地图数据并修改地图数据
                    for (let i=0;i<this.mapData.lines.length;i++){
                      if(eId==this.mapData.lines[i].id){
                        Object.assign(this.mapData.lines[i],jsonData.data);
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
      openDetailsPanel:false,
      reloadAccounts:false,
      reloadServers:false,
      addNewPointEnd:false,
      previewLine:false,
      addNewLineEnd:false
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
        width:0
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
    //元素右键操作面板的配置
    elementOperationBoardConfig:{
      posX:null,
      posY:null,
      display:false
    },
    //页面配置
    pageConfig:{
      homeSeparateState:true,
      mapSeparateState:false
    },
    //用户设置
    userSettingConfig:{
      //1.是否在服务器列表中开启每隔60秒自动更新服务器在线状态
      UpdateServerStatus:false,
      UpdateServerStatusTime:60000,
      //2.是否启用启动时自动搜索服务器状态
      startUpdateServerStatus:true,
      //是否开启元素面板
      elementPanelLayerShow:false
    },
    //服务器相关数据
    serverData:{
      //1.服务器连接会话
      socket:undefined,
      //2.底图背景数据
      underlay:undefined,
      //3.用户名//目前已经移交至socket会话的数据中，此处仅作实例
      userName:'点击头像登录',
      //4.用户邮箱//目前已经移交至socket会话的数据中，此处仅作实例
      userEmail:'Anyone@Any.com',
      //5.用户QQ,默认为1077365277//目前已经移交至socket会话的数据中，此处仅作实例
      userQq:1077365277,
      //6.用户头像背景色(在消息面板处用)
      userHeadColor:'ffffff',
      //7.默认值
      default:{
        'user_email': '神秘用户',
        'user_name': '神秘用户',
        'map_layer': '0',
        'default_a1': '{x:0,y:0}',
        'save_point': null,
        'user_qq': '1077365277',
        'head_color': 'ffffff'
      },
      //8.服务器列表配置（示例）
      // serverListConfig:[
      //   {
      //     serverKey:'k0',
      //     account:'sophietwilight@qq.com',
      //     serverAddress:'ws://192.168.31.105:443',
      //     serverName:'长沓游戏地图',
      //     serverImg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAClCAMAAAAAqWO6AAACN1BMVEVdY9vS7obX8I/C5ndsdeXD6oXM7YZmb99ia9/D63q66HthZ95ocubO7H/g9JJdYdRmbN7K6Hi76YfJ7X1lb+VvfO224XBWW9Fuc93Y8Ybd84rB4oXN7Z5ygu5zguhxeuWLkejS74/L6oa+4nHR64+n425iZ9p3hu3W7J/49+2v5HF7geHA4np+iOtqzkfS74Gt5YG735TL7ZHK55KM2lrW7oXJ6H+853OHlfN/j+t8zk2a21+JnPe44nvZ857h9Z75+PbS635JyTe33Hy26HRax0FiZdW55IZYXtWr4JLN6Z6WruRGuDjE6ZO43oaGh+DK5oel22O86ZSm3HKv3HOotofL46Gb4nBKykS+3Ls1WLt62FVZz0Ob3Y6a2nOuycmm3oBuzmJXvz+Qp/mAkfNGwTlXzF93kPVuul+u3Gav3X/AQ3Lh4u2Knehnw0VPWMqWoVp5ukqS0Fe+56KXpX7p8NGWn+dUu16StoqoyYVxoI2tzq2kq+mnu8yD2o/K4baJzmyEt2Gmu+JYtEGEz1WktnJvpkfe8rON3HFxX8W9zZJJZ8rInXa93KS4uYK9y8Ws3quRe8awvK3T4s6Uu8a7zX/b6bZl107P7LN0yYHKo51yctJntUSSlH+VtWSyvOV72XK/x6hXadJUxoDFx+p1omukRonQtoWunICjz2WSXbCPzYSjlKNnyJHlxbCkp56sn2Sre4CnZqyanc7MxLFova+PzJ9Tg5JxmMXYbWODhon4nbXPdqjCo/jDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAgAElEQVR4nFy78VfaaNo+bkiT+SSn4Uyg5QxEaSHw4mBMEEmQILgJ8PFrBQTBigNVQQFjRw5Ep9Sx3WpB6nHUTp06Oi46dWccddqttt2dnfbsH/c9sbvvO+/nCcnhh2q9uO77uq/7fh5asuNrM9kfurPZl4XfBn/+/MebQ0OdHR0dNzo+67jR0fFZx2cdHR0dQ0NDN7/8ykwQFEclKIHiSB/OkVycwnFXUuBAHBTANMUBtx/cvKn8dIdnCYsB7TiVKC2zLEfFfLO3//THdZRIkGRSSnolMM6flXjdWS5UCuVKdSnn4kv1Oq+TK02ar9fq9TxP8xKfi7Nn9bgMxkVZqrvIUqielmUdWA/J5FlGOlup1WqlymH5olIu5xrllcZFZYUvtSxnE+PLs9Hsy8LLH+5899XYzZudQx2f3ehQLuX1EdnNH7/801eEL8ZyFEdxHE5SpE+iKJLkOBz0JkFKSMgcRVj2vnv0TkHXuY0EkiQn4JRBzapZIEB89UdsXx4REnVG4qCOE3haqufqujO+UmmWJLIeKvH8GS55XfkSL9V5PnzG5yQyR8clb66Ey02dKyzz4TM5XAuV6rn4Gc3XpFgjXAvXmrVGudy4KJcPw4ertUYj3JLN1tcKLwqFFy8jXe0vf/vHzaHOoUvePlLX0Tl088cvv/zyT59//iRGmGNCjKIE6oyKJ0mKJCmSAiVQSupwXCcIFOWbVKu+fefxDD68RY0ndBzFsSxLCMlxov/7P4L7qt0SIJMkieM68qxEl2p83UW73PESjUv1uJSi5TO50vSW6iE5l+PrZzKfy4W9Mq/zgnE51JRyNfwsTEvyJdWlswqda5abuXL5olwuX7wvl8unpWa52WipLo/PFqrZxeWX2Rd/vjP/2DPU2fHZ/zDX2XHz5pefK+urdopghZggrMfsFJXEcUr54yhJokgQxymcY1mK42Yh5/DcU7VaRYEgBVICTlLJMyoQjf4b3JeXz8/bKVIn6CT8TJLOvKWSLMhyPhTneZrkS7JXDHm9dLgeL+V4vlTPy+RZqRLO0WI9HnfzdCnOhypeUs7TdJiON3OlOBk+4yurtWaj3Li4aJTLpxer4Xw4HG6ZfZGaXK6OdxPdXT/89MM/7g11dty4hPXZZVQOdd68+eAS3Odf3SYIio0Jt4+o7oSOSpDJpEzhAiXhJIkLAiewMEYtU5ZYt8Ec4wCOA73KR0BRVCwQ+/7zPwTlV3/aI2O6pI7SnenOzuR6jo6TLp73lmS5Lsl8uMln6t4zSY7LfKlO1+reuETKfCgkk16Rr3hJPkyLdbJCiyWelEu1OtmM8/lmuVy5uGiWG7XGRalSLlcajZZsYfHFi8Uuomuye31g4OGlHNww3ugwtnXc6DAqUXnz3kfqnnxPBQKxGLj+9CkBJkkS1CXjgiAIHJnw4iTLcnaM4zCOM7MxykdRJIVzuIAr/0IgiD9g+9N3xG0LTklnAkniJCmRZ3VZ8ooySdOyLsTHeZn05kOSgPNeOiTTpbAsy666hMsyX5LPcFxHh0rhvFiXpFKOjisZ6pWkRq1RERtnuVpZWWJtYzVXLrcU1gZ+mhmOdnUNDAysPxzq6DDeMP7l2Q3j21+etXU8U5Lu3+C+6iOIWCCQJDef/v2IonAKBHUkh+O4gOOSTtLp7G5W4HRUwEeRZwlQp8M4ARdi+A6eTMT+EJRfKgGAxygFlQSSkiRJZ6R0ViLJM7oe510uuh6vN0WvQMqStySLfK5E4qVcKFTyyjLNe/lQOMRL9ZKY5+VwmK+H6zItyRcXlUZYFuSydHFRKTcVfOVyy08vX7xs/+rLr759+dtzT4fRduOZ7de7vxg7fv21o6Pj7i+dtmdD0w9+/ph0FsICJG8/7d58urm+iVFWlqIEnBM40J6Q66QOZ3EuTiZBlsPilA4kBU5hDQ+cJS3t3/03b9/HVNROTKeTdDukpMNJZUkkKdfrcZeY8UrhnEy6cvW4RNKlMy8vyvGczMuyXKL5EimHc7JXFGWZ5MMhmefluCjzeTG/U6+EmxUSl8g4f1YpNFfL4Uaj0bL85+jSzz8P3nv3brCjo8P47O5b29DQdOdQ0dPZ0dlzs7Pz7d23Q/d+fqKgA2IE4bt9Gyf+nqA2BY5j3aDAXWYcnvBKOE5ySQkDQYHTxUkOJ3UCFT/DKZyIxdo//28x2SMCVFJH4oK0zpISrvxByiOdCZW8uZAsyXGc5EtSXMb5ECmJIi2d5cIlmpdCMi9JYZ4s5XIZWirVZakk8lIzzvNymK/kGxfk2dkOGRfFcDjcqDTKF42WgTsP5zy2DqPNaDQWjTeePfPc7Oy86fHc9PTcmxh7OujpePbL0NA7JTK/au+Pjc9yQozoT1iDnI4jBSoZJwUDq1cYwjlBcHOcIIAYmMQEjPImSZ2O4gQ8FvufEv69JRCICTguUHiMuPykFc6Fep4u8d467xVdEi2RmZBX4kNiXMrVwrxMy3yoJIk0L8UrPBmX+TAdz9FSnA7zEimXZDJcOmuWm025QtN8RalwZ/F4I1dqad+86eno6Ozo6DQ+e/vM4xkce/rgwc8/Pn7w8N6XT27vfXvzpme689ndNz8/+fyrr550z05aZn0QZ4Y4gdKdJfGkjsMFAcQFksJ1yjsQAQUBBxUh0ZEsK7AgSbGBrv/w9qevYlFBCOgUA2DAz3RyPF6XcFyQS/FQyEW7+JwshwSSlvh4hi/xdIkM5cOiJNAhb6kkkZKcIaV6SOLrYk4USzSvBGku1DzbKJebTakUDstyQ76o8M2Ls0ajZXDupsfY0VE0Dt29+8uQZ3CvtXXvq6++/+rzJ7duzc9vPvfc9Nz0TA/dfTvx1Xddt7snZ4n+yVmOi7EsK4x746CAcTgOJsG4DtfpLqVRUKIVP+d2zllQYMkEQVDnI4++PP/yEt/3Psoi4EmSlHSsQOJSnY9LStrF66U4n+f5nEzyaZ4nyTrNx3NhWSrlQyGvlBO9pMzLdDgu8GJIlus5/ixOh0K0yJfC+czFRVkMNc/4cLgZrvB8riJVauWLlocKccbir796huaKHs/D9oGBgeH5wXs/j8233x6YuNdz8/HEw8F7PZ6ee/cGHz7s6rYcaQjY7DMDPtRHoazAciCoc4O6eNwN4oJbjwVJkHMHzuM75wJiYAXhXFkj5+fb5+c//+nRbCCZpBT/trMdM+Ak6XVJvDcuCzq+TobCclx0CWRIzHt5mhfjNK3UB5IXRTFXkkVRilfoTCjE8yIth3hSknPhUkgsyRX6bKNSC+ebzeZhMy+WciW+0QiXW1rH5owdxV/uDnl6PR1Gz8PW+Vt3hieWvvvu8ZJzYGBsau7eo9bb85tznUM9v9wd6hl8vqmKxCz9VAzgOD3AAgCLUCCIYzhIKaHIsQaDwOoZ8DxGnDOGdYVJEh/ZWV88//JPf/r8eyIWSCZ1eBIk2U0dDnpBkrTLLslL4qSX5GVXPEPHJZ7naboeCpFSSab5uCzLMh/K0bkSLdE5ng9L8TAdL4UliS7JPC/yOC0enlQaF41KM5Su1HJnSmmUm42W+b6lQY/n1yHP3POnY889Y6p2S2RiyWHyRwa6h397+HRzs/XW/MCtpbnOjqG3d5913ny3ZPHP+hxmsxmAEBbkBJAVMNDNKokG4lqBxfXsyMj2ubRzLmy92sGw9ZGtke3z+0dPv3v6iO2nKEGXpEg8KZHSZYl0kaTkjSt6KQmSSIs5PhPKxEuSFBLltIxLUj3uFWlSFnlJkuOhEC6FZT4TFr00TYveEC2UwnKpsVFpXmxciJVGrdwIizwvnZ1JFy0DA/7Wh0O9nsGxeb+//bf57u7u7jt3hru7Vd2T3d3zzuHhW34l+x72eGxtHR1Gm6dnKXZnrd9sBlRWimUxDMMEgcP0ehbUxXHE68ZZ1cj61nkgdn5+HhMEcOf++frO+vp3T4+2CMDno7ikJIBx0q5UfgF3S5LOHo/juEuMC3ExVOfpUiknk6ScK9FyRq7zfNor52hJpuOSgNMiyYdEMZfLSZIYyuX4EB0Oi5WLjcrh1mqt3Gg0co1GmD+UZbzSaHnxMrJ38qb38V73fHfX0maXpTui6p+MdTvbNRGV3z95pz/i7LrTNbx376bRaDR2dLQZ55ZmI9F+wAIArJkTWLMOAO12FsMYq1VgEUHP4giDnLM752cII5ASTpwT3es73323brHEOMWh6XDOKuFS3K7DSRDX4TrSjeMkH8f5Uk6iaZIX43g8JEkkL2ZCdT4vCzJPKvYyrsQgyYd5iRcliZfivJyjablSCVVWxcpKvnxxUauVN5olSTrjw42W2c2x1pO/9z7y3+oaHvjyu/F+i8XS79D0QzGHqtti0vRPDjzXTA7fmf/Z4zF2GI13fy12zm1GZy2xKBvjWA5gUEQQQDeuR7C4TnAH7Syuk8CYAs7tFrh4WhDOR85HzhfOz9cBbp1QpBUE4yTm1rlJEFd+VId7laQj8bSM46SUydGknOdJnJRLougtyRLJ03yIpkVeFqU4H8qHFIlRCpycE+nc2VYzHF4p58qN3EUld3py0WwqH8Vho6X/+eP21kc9S7e6LZbIfGR8cpaIEY4YNL42blHFiFgEWnoOtLdH5n/suaTuL3d/sc0tTUa7ZicJwpeEWCGIYgIWDAo4FkdwUHLjoGBgWKUUCDqBJElKWF8XtqyzIygXiMYInU6HkTgHxt2SG8dxECfdEi7XFZuC07Q3nlbizivRIbFOhuicwhRPi2KGlkJ1XiyRoZCsiCcve2k+zpea4dLqSTPcuKjkyo1GuVlbWcmVL0C+5LqotES6bvW9P+r9TRGS2bV+J0RQ5ljMZyFm0ckEFDMREKDqtjjbv52bm/N0KPB+NU6/e/58M0oEAlTADPs4O8siglL3EFZgcRwzGGI75+dg4BzHCULPGrQLi8S5ef2cwylBafDAJIkLSFzAcbc3jgteXEk8nJTINL8rinKal708Tpdkmg6FQiLN07RIeyUpLtIyH8+EJEFxYiIdJ+VQOBQK8/WTw3CuFC5XmpVKOdw8XL2Qz2rN8kWlpZswtVJPe36LdFv6Y1D/JBRbjxJUlDObzY6ET2UBLBYH4ewe/ra3x9PjMRqNbX/5pWicnr75fLsrGghwHIpxCGRgSRwjcUwrsILAxl6dL56TO+d6w9YrVkCI84TunF0fwXZ2UIrjkhLL4pyAx+0SYvXiuOAW0mm9Lo7HeT4TkmlapiVXmpdJqSSWQnwlL4piKETTmRBJ0hlRlLwKbwpztDdeyot0LlVphmvhsjJraFZKK3IpfHFxcdEQWywWi2Xn+cPhAYfFYplNQIRqYimQTCYDAYrzxQhKoScwa+nyTzx48Phep9HY9uyXNoXA68V30ajFF0gCoD2IACSO2612VmAZQRCSpO5Vkjg/P3+1I7A7r+57E+dc9MPiq3WGo5I6lgLxJI6DQtAlWBUpEUhJwnUkqXPzIWtGErwZUaRpWeJlWaTjITqUC4f5kkineTFXKoklOSRKaVmSRZoO0WExnMsdlk/KlbJYLjfDuXCt0giVNzZWai0WVX/3xsPbjtlIzIL2mxME5L+9eXtzkeICSSqgSyQTyUCM0PRHWr998mTvngLLZrxEZyw+X4wSAR8V84GX3Q0u2QUBd+MCKbDdizohsLwewzhkcR1EAlsxYH19HeQ4UiewGCdguACCpC6umBodLuCSLi5J7nooFxJD9jgfKon5jEjr0vW4zEt0SZK9stIS8CLNlxSOpVCeF2gxnOf5UKnUPDxbLYUrzbwSlpXazGqlfPL65KTFourujjyMDIxbLChhNhNEgAVU33/1qDsmxNgYFbPECJVa5bT0tw63zvc9VQLz+rNfigq4TttELBqghO5ZjNOBKKi4e0ZwxXVSUDAgLh3odRsEt47VgriWwVi9XosqTS7BAQKH4aAOxK3eS2Bx3I3H3biSd+lMiffyklfi+VA+7uVx3MqTpTguhXgB59MSH7+cNQi8XMrIohiO42JODG/UmhWxVqmFm+XGTDNcK1U2dk6OXrfEYq0bJ49vjb9wmH1mSjOaVMViHCioVD4IUBnUygvuh1RmqF8zPDy/N6igu3H31zajscNou7cJRX0sFqR8IAJiKKiTQLIeB4OjAisE3VbvrtvACrgQH7XrWNSKcCzEtRNkgFJaChwXMLfXLrjdbreAk0lBkc50hk/H494MzcdduXyc9sYzdFqqkwrcNE3nvaSYofmwIi18KJ+nedKbEytlPt9cbeTytfDFRa5SOZxpHm6Vtl6/bomOx/DtwcjkizUfQZh9PjNnxhyE2oyOImYE4hIJLsaNjsYsMYdjrTsy/7xHSbu//HrZ/XUWH952jJqSKEZhCCYgIJ4k3YIec+OMm9VrEdwKsnqWYTHBjWA+HQCz5pjFsrROBThQF/QKOB6U3JLbLeE4guEC7vaG6DTN4+lQvK405W7FndD5l7G4ty5mRLEkezOiLIq8HMJpHpdyJVHGJfoiFA6XKqXDZqNxUW6Uy5XSytbG6tHr1y2TxGLg+WOCMM/6YAiIcYDPh/o4M0f51ig750M5O4QmfZDZHNMMRCO3By8V01ZUdMVW7JzaU7UDEAVgQhJB3KAeQ1gWDyIGJsioGauiLawBA/QsCrAMxpkBSyz6cHqQoJLL1oQXE9xWya5YMDDuxWcJwZ3mSXmXdom81+slSS8txcV4ZiabETNiXgzxylzBm+HrMh738jzulXgaJ3mabjbFsFjZOjzMic1yhd9qNDP869cnr1sife9PBidMDkiTmERmOQCyWvUowgD68fSoFUURDub0CKoHYKC/3+Hve9rbM6007UZjxy93n9ketLebYjGK4jDQzgkYy5G4oE27ECZtZVmWURx1MIhgWoRlAYQjKIJ7WPR41gMJHQbGQdCNu+04g+CGoDX2sAvXSa7d3RxP0ilRMdGhEpkOue6/zIVzcqgk0vFMvU7LJR4n3XxGDoVogYxLoiKW4XCjlgqJShUv5yorlXKtfvJ6/XXLxoZ+Ym5J0z/J9tt9dphILkd3Esmd2UACDSxSi1YOAIiXywFiJ+owE+vrm0O/D3kUwTTais/uPutdIojZ2UDAHvOBHGh3e0EcBK0uBnPbEbegsOi1MxiHIByQoKAYEVi62eHxPO+iYpzAcjhud7uFuNWq0yEYyOISGA950xmXK5fG3bu5UDrOe8V0lq6H0hmRFzNx3Ctm6BAp8bTM07wcr3vpcCnXDIfD5WajsSJWNirlrUPxcONwdf3169ct75d/GxzT+B3jPsDh8KEcMTKyoKxVL7MzQiwEmYR7a2HkYGRhB51dGFlcGDn63djpMdpsRmObsWN6TrEqs/0+VAdyHO7zUogg2REQcblw0C1gGGwPClDdznGQHVJZiIE5m8fomX7qo0AAEwREJzCMPSi53YJbEtyI25vx1kve9C6dyYQypI6vp0siT7roeCjvrZfScVzm43U+wyuDiLgohsRwnA6J4Vz4TG5u7DQOT8ry2WFj4/Uy/fr16/WWgeeDj8yW2f7+Uc04SqBmNrYzsrAwnhy1L24t7KzuLKxpiR1uAblPOdCR9ZGF+yPPbXM90x6bx+OxeWwd03NPl7ooKAFhdk5nN4BBASNxHPGOxu04FgyiCAIAQRRmTSooRnS9a+uweWyDt1VmChMwjAODl9M/RnFidpCOu3gcdKXrqV2R9mZ2pXQ6zte93gxvF2mJ9oYyNK4TZa+ojGszfEmUc/lMOK9sHJTlyok3J7sPc+WNrZMRMbTeXZdblnpvm25ZHOPjZsjHQZRZP7JwSVRyfHVhwXewsOjFhIWdhcACwMZGRg5+uH9wv9jzeGJi4seJQZun+Ovd4nTPc8ICQXYrYEcwxo0FQQET3JwLdIPuIIZpVQYYBlQqSyza3zVn89g8c7f6TCoWwzhG58YZAcEF3Gq1u7wCnXZ5Xa5QGk+HQplUjpZ4yZ33yqGMKPJxV4mUQqJE83w9Q9O0Mmy+bH1EsbLOhytyXKDDef6ifHFxsVGu1bYOw7mW9cHNiDPSH1G6TwiCOWxkcSQwElsgOCyxMH4QRDBicXV1YWRxJ0YtjCws7ixsP35629/n33vyaNDjKf5yt1ic64rGOIgVRkmOEzA3himGBdVZMU6AERXAAioVNB6IRpcGjTZbh2fQ3wdAAGtGGYZlDQZMr457cQx0496MKxHPpHfT6Yw3E4q7vHYd7ZVw2VXiQzo+k/aWaJ6u014+441nvAIvinW53giLubxYKolkRQzl5IuL8/NXG+Xm1lau2fL+2YRzoDsagyfX+qFJu0a/szCCrI6MmLXwzGp0VY9hOwuLCx9WRxYI88jiyMjCSFe7s7W9tTXS2tf3eLpYfHvXM/18NqZJ+vRoQkdhnFUHUjjGBDEqwQIwYOBQDjIT0Sjx3OOx2Ww2z5hFFUtirJ7lOLfWLRhYN8JYvXarjkzggpDIuOp1Vzbk0mUUdfHq9BkX7RLpXTFE4mSGJ2lloESLCntiSJKUeV5OFGs1mS+JlYp09tvfu4WT8s5Jo9yyc9H73Nnd7eyHYhBghgD94sLOzs7IAhJbOBgJLOhHdhgEsS8gTNC+M7K6uLg1smjqNplM/r6+vr4nYxOPe395VpyegJ0JB8ihWlQAQI4DSTul1QNBvdZqhlnI4SOixOY7j6KxHttcq9+SnGVVo/EggrA459a6XAhoDbpBt9WbBtm615Wxp73pNI2Du+Ju0FunM6JLKoXotE7KiDqvWBckUenx6vWSYp5zohhuNMUwX2qcyVKgW00mtkLy6/pqy5OuN3Njw61OgjAThDL12VpYvL96/wCgFgMLyYOFAy4YtM4eoHa7fWt5JHmwQ2yZYpaYSaX2m0ytfX19z3vnisW5AbMJ5SiKo0DAirh9mN3OgXbWAPkQnwqdjUajzz02o81o67DZHvotJhjQs1arwcBgHIaAVisuCFYrxoH2XReeSPu8u6l6Ih23Z8RUbTmU2c3zOsHuiqeVWu4l+bigE0U6Q4t1qRK+4PM5ZVwZLvHlM6lEs7jAi4cXJ69LoZaB2+/fP7yz0xXtimnMFqjfN9uv15uCVgfAUAFtYhmxo0GEWwwGIT3AofZFAlCZAbMJgGIUMdmvirQOPJ569rb4FIBiHIdRCOWjOADFWB+CQADHsZAPIqKBgXdtNpvN+DEquwmLWqViWQzxMaAXVTp3VnDrKBDkuHTW+4K2ZkMprz3vjWdCpWxMDoVkHN8VMxlFPmg+o7jPUAmXZQkX4odCPdwo15qXM68zvC7r6/Jqo7J1tCrmWpbmv/z73Nz79+9PWqNRKAZoYDMEmJZ+i8IQhyLWUbsVRVGG4eyjKAoAsBWAKcoMq2EIMkNmlSkScbY+nrv7diLmgBwWs48y+yjKzHKA1gfo7YiZ05gD0a6lubbLdFPWvYlIN2cxsALA6UDO7bMHBQBjOZDCOA7kxukCXZCTrrNEOpUO7qbSu7iLd+GCNxR30a6MLLuUmR8dl0iJlpSizuOS0vTkQmKYrIcCpNIc0pWLi4oYDrf03pvq7entvfluYvjOpNMC9TvMlljk9ndjXZAZQ+1W5bayDMK5cTsCsHYEgFBIrTJw1lEFIAxFTHtzvXdfDa8T5s0o5SN8BERxMR+HmLkECiVeENH1OQWZsVi0eTo8nuKgyWKGWMA3Dpo5zIePcljCigEcZwdRVAhkQ9ls6YWU8KYyKe9uKj/KxhHvrl7QCd7deNpFp10uhTHJJdbd8bTUFPmM3Mznm+WcHPeW4oIgeb3hfLnSrDVqLZ4ez7TH4/FM3zyaHxiOjEcgIqaw0nfbjGKw8p8iQZAFtAaVHqAQ1O4DMUyvZoHRBAIFOQjSqPz+vcGhoaXhsfXbt+EYQRD9gUBiTeHXDBCBANE/0WbzGG3GoV+eFe/+UrQNqkxqFQv4gpwy8wQFRhfEfBiCcSgAjaazy9XlbHU3Za8vc+wyT9Ou3VQ9nnbZcR2PGFyKgKR1Bm8mH0rveityKFfKX5RnwuJhjo8ru9cG0ltqNkorlfJFs6VTsRqe6bnpubsXg5sDwxFTd9TRr4FiqM8OIAinZQDMjGGQVm9Qa5E1F8KRZgPLUtagWW81w0EHrOoztT7uLZ6vPzWrJiMRaPN8LEYkY8pmOBUgiGj/wzabrejxvH3zdHBoaO7dbb8TgHwsC3AcBXIcQJn1SYwFYtRyIlEovPAlqOR4dpwD9FqDoPeldHUXxuhKu7vpXZ2BtHolRBTj7hBdpxX7lecPK4dnGXFlqyyKsoFlBaGrVKmUVsshMdfS4+np6e3t7b3XO/Svd99evL/97fD8eH+/Bh2HIJbg7LCAgiiCBTktCwMG1s5xQcAAA1YYxswACpu1KpUp4u+b6H37/v3G/PrGycTcL/vO/gBFRAOBaDTq7HroKRY9v7wtKhtIj8ZaT947HSbOx40CZoSiOA6w2hN2yGxhzYHZ2fGX0aV3S1GCQB3p9O7omkuwG1hEizFub1YU44a0mEnjvEi7del0XPaGajXxsJQRxZUNXixVzgysIX0Wb5YqF4cXjVqtZa53bnDw4cTEd4PTvYMTb98Nzr3fsDgtZhiFtImsFWUFux3BlHaMRVhWrzZgrIHDGAZjtYBBi8GwGTDBpj7/08GeoaHem7+8LRaH3n5LDGsIajYQJSYnBotFZf95cOJJ37zTr1L1vT9h9CiHUjCK+ACW9fl8CTPEARbiRXY8uvZbsc0z926gsLuWSKftQYNBj6d205lMKpEUEYNLTLkNVpEWvRleystkeSVULufz5YvVRu1CYPUxWsa9eVE5aZMRGy1zU4Pze+2trfPzgz2e3qmpqd6hfx21RqIQwUHpF6AZATAIQUBGQEEWQzCWxdR6lsEYQK9kIayFg5BerXY6nH2Pfnw8ODg1NdXTWxzsOtnp2uwfjs4PFm22t3eHhnr3+vytfrXf36dWG9ScD+DMAGuGWDSBcJwPAIBYdHY8+nzpH0qzaM1j3c4AACAASURBVOt9WXjBrKU4bdoK4sH0Lu3dTaXTGbsh7Q25DWlxN+Pajbt5UqloqyeVJn1ycnJxsiHY6VI6XmnULirlSj5faekd3PO3Dg/Pzw/Pz/V4PD09Pb1TU6eEMxYjzIlRDKY4xIvaOdauxbRY0B10swYtCoJBRqWH1QYMAzgENsGQyem8tCx7j/YeDRane1+9n+p9vzF//vZXz7O7nt7BvT6/X60y9alVahO8gUEsR1FmXxDwoagZmEQJIhrdfP5uWumkjEbbRPdkUE+tGey7yV0ws+vNejOpfD6U2qVdKckrpkTRG/LGxeWtSim0sz67U4qun5zIlY2SyIcrF40SX6tcNESxpfdh663WO87WgWH/RG9v7+DE4HTv1L/exzR3TD4IQO0cgqIcxnJWEMQwwYoGWTXDGCCtQQ8HDWpA2aHrvn3bqQKckLNPcSxP+samp5U0K3bsP3/7y9shW/Hxo1Z/u19t8ptQhwmyIu83nACRJBIQZOYCPgLQZMejk5v32q5ftvhG42Bf34s1tcFrT+y64rupVKaUXnZlspl8KJ+qp8U0naLx+u4uf3Ds9fL44Uz34cLCaaVZ+nDcOM5VSmIqnG+u1prNlsetAwOTkxGTM9IeWZoYm997MtHbO/XuyLIlrE3CFs4MzCIsh3FWSosxAogEEQbTG9Rqg16NwAY1rDdYrZAKgyF4dFSj6rskcGywt+gpeoq9vcVisTg9uNfX16dSWdRqWAOZTDAskQJFQRzEjQcAwucjJvtno8SSQtoN4xWj8fe/qVTjPuCFNV1I7Rb4rCvgwtO7pDeVyeZC9njJTaYy6YPj44MPxwvHp6dvtraOj48/1I6PPxwfHzRFsRauNWbO8qsrLY+GI5qIytQfdTr9flVf68C8/+lU73Tv9vt9zeamaRzy2X2UFcXcdgzDEMRutQcZg9pggJEgjOkNeoMqGHRr9VoEgCDIpHaqFUf95PFgcbqosFf0eKYe9flbTWqN0wRBDpUeQEeTyQRhjlGBQLIfjgUmFVUdiD5sMxqvK1fb73/rjyVm0dRu1puopxKky7VrPaMzu5ndtMuVtwq4dVfMrlSrHxYWZ2aq1dWVyvHK6vFMo/bhuPzmolwL5UOrhzONUqkFGtY4LSanZX7CqYoMa0yTd5z+pz8+fjA1NfVwbMzpiEBwTNkxBFAUAzGr1Z5GEcZg0BsMeiU+UVitDsKoHtCiKIRCKhOsUvv9/r4nT5VudtrTMz31tM9vUmn6NKgJNdvNgMWX0GzsBH2zgUAgOktEo+Oz0WhXdHPOeF3h7YoyyTZ3j66hhQRVX6Oz6dFUKWtlvdlUKlVK6EK6tFfK5XczmcPj3bMZMZSriKXT44Nq48PBwcHB8cLFSrgWrqyunuTCLRFnDLaYIbNzQGMywRpIA/tVe37/k73Bqbn3kQh8QmicEGrmQEVVUKtbbx+1YogWMTB6hgla9cGgfpTRs4Ae0BtQRA+rVIBT7fRfdkTtD3unpsb8fqfJqdI7UJW5fxSCYEKLvN/QBGajBBFdjkaj0fWB6NLzOYU4hTmjsfi0T+3Lju+u2X3keCqVSfjS8TVXsp5fru96da5UXMqWSCl7UM4fHzQWDps11/Hx8czMcblcOqiKoljO1Zor9eWVcIsFtpj7UYtj1AxAoxYINpkgi+bOnUjrWO/U2zd7J+8nHq/PTqpgdA1BUDuCavWIGyeRoNag1+uDVrUhqNcr6m4wQIweRnwwYDChJrXToYhL33dPv+8bdposEARBZjOKqoiED+qHNjaY/vFoNDrbFe1aWurq6pq7bjTeuGTOaGyb6PNrNKO6RCo1iq2lCrQ1nSqk7Pj4/Z10KsPVU2lrxjtqP/jw6uDDh4M3H5rL+PFM9eB0ZuZDrfTqONzYKOVzjXBztdEC9UMwZAGghDlmhqBRVGPWmCzz/ZqIf+zB1L0Jy8Pe3lfvnZMqdC04GmTsWobRIjoSZBg9Y4AVYUHgS2hqNQLoARhBYVg7qlGZIJPf36cQ6Fc5IQICHKMJQtmMsBAxCEBQqLubiES7Bpbmpj3vlt613bik7ZI5z5i//0Wh4EgWUlkfXfAWUlmXN5Q93x7LZl0UNxra3U1nUqGZmZnDg4PVlXJZth4clz7M1D4cfzg+rOUu1mcqodzqxcb7FggAHFYUMFsdAGfQ+CB41OpUASon5PffnvjdMzfVq1QGDWRGUTODoqAWw7RIkAS1DMMF9IusWs8Yoga1Ip/KgpQJLgKpTWoVrDb51f52k4kjQDNg5ojkrI+AZjUWTWzgZMfZFX050LVdtBnb2trarl+/fuP6FeOV60Zj28O+F5OqbDWdLfjsa7tZb7Y+s370MvuTxZDO7yZcqXSytJvOJ+Mz1d2DBf545WRLnDkd+TDz4cPKwodcuLGyuroSrm1tvX/folJBkAaANaMICsGsD1BbUEQFA/2jTtVv//z6n78/HXs81fvwkbM/5kABDrPrcC2IgG6rhGtHVrdWFwIGQj2iZg1qA8zAGIwgKAJAQVhtgmGVIo8aMwFRhI/gfA4KIjgCImajEd/79YGBr75fej5tu9THS8o+Xsa2p31/zhYKhWxh3LVWTxYWz7d/+779xW7a7XMtF1zc2a4rkCpl0yMfTpe/Xtg6eLPilY6PD45r1dyrg5n7+dXVlZ1cLbxydnHSojJwsB2FAQgAUE6vWCkIUKkhh8qk/+fX/7j/9abf/7i3t/fnzyOJBADrWQDDECuCkzoQX10gRlYZ84hhRL3VbVAb9AYzq02jBpRBEAOsV2lhGHWgqI8DqESSm0z4KMhCRKPRO/Nbbx4M/v7jz71FW5sSjMp95fr1K5dyMv1td392OZtdS7qq2fT4y6VvJ9Xu0VQ1Nbo77vXuJtJVOrkskQcfZpYzx6fZ1PGHGffxsVhrNI4/fFj4IZfLiDMzq6tiSd5osQIADDussArBTHbUoILUijYgqFZ9//4/z7/++uvN1tYfp6Z6n1qGzWYAVdwlg+AgSJLcwuriwsJibFUBRymFXW0AgkGtHhlFYEavAoIwEIRhjRWF+td9vuRywOcjXmYHBgbe/1K0TfdOF9ts15X1Ed5H3jzFwVvdMctaoYC8SGVfFNKFXWZ0LVVIJM7G08uppJT11rM4Hj9bKKRmDj5U8+FateI6OM5XP3w4TjUPPhyvNBpbWydHK/k83zJrRiBYa7VCepPeDqv1GKxWq9UwCgP6rq+//vprf/c/N7/7cWrq2XtlaOzQAixqt2oFN0jqVncSi2eCMiHDVglGa1Ab1EwQRRgtEoSDMIOgAAzZIQuMov0QSiw7YE2MmHw5sP7+l+lpW6ftMtOU++NSoNmKvYMPb5kslsLyi2whEXBV15azo4VUahnXWdd0hSqZ3C2kUq611Jorn1o5Xlg4XFhtrORnjmu1RjOVr201wiuvS6nd3VRZOXrfTtgRWK1WAWo1AKgMBj0KG1RqPQwAwOT9f/7w9frX93+fUEr62/c7DgKdhAxKYGoxUudOLuIjWww5sro6skAxQasSmYw9iOlhRlEXZYwOcMq4kAWU2QQ62e90dvVP3P21eP2jiPwH2Y2PtNmKcz9/197XN6wCXrwoZLPZF4VC2rCWyq4tF9YShXQ2VUezqUJpec2blbK1WipVX986OVmppWorJTE3U6stbOVrqa2VfD6cW82uNFq6t2HIoDKo1QBqUj57NQoZABhGEYzTMj/cR76+//X9f05NPZiauvlgaVjzIg2hWr2WE9wkeSbh5A6jdQcxhgOYYJAxKPD0jFaPIlqDSg0HUcRnRziIBQAYcqxpzM7urrG5tuIf+FKQ/TsojdPP91r/7Pf7Vc4X2bXl7Np4dq2Q9RWy2UI2VUgWXiSrhcJutlo3xAvxJF1dPV2dSWVWT0aa4XCqVm3kU2L2ZGVrJpQJ12ZSucbWSovl6ZHWrDfAjAa5LMZ6A2NFDWoY5JQDeYmvldj8xzeDDzY/f9A79W5/wKEBYIOBQREEwUjS7XZrXVpEiyGIVqs3GAyMVqsdTQeRIGLQ601ckEI52KRWm1CNem3S0eXcvFm8ZO2P8D6GZLH42N83POk0rWkms4VxYLzgC6ytjSeq4y+Wq9VlLpAcTaQLxGg960hn0/bkTHZ5Zmallsru1qrlWm5lJhyurWQqMzPNcCqVq82UlistgHpiwgRzqFKQFT+sh5mg8v72prIhCgW+Xvz666Xfn3/n/+rzx1M37+5HTHooqNIjiFavJUE3iWuDWjviDroxRs8gBr0b045aUYZBtYBWbVAZYARWASYT9AK2OPoHWt//pXiZa39EZrO1FYvFwZ+f9LUOTJq6J8cnx19M+ojxLJVYC2SzgWxiPBEIBKjlQkFhtLCbTSz7hHR9ZiW7sT+TSq1unSyszJQWVk5Xw7XV/XIjHK5VaysnFy0wtjdhwYKwYoXVpiCC6g2w4jnUanW7Sq9Hlha//mHe6XQ4/a1Pvv/x3tAYAAVfaPUGBjXoMbebYRjMELQjSFDB5mYYg1oRFEYfRAHlN+phIIhCsB4ahSGLs/Xkbq8iJH+E12ab7hn8ffCp0qoPv5j0myyT4+MBYraQXZ5cHg+Mz04uJ6Kzs4HZ2dnl5eRZtpDYSSZ11HJ4catQfb2+nGqevH69kpo5WS6srlRXV7MrKwsXx6nmyfJMCwDZDSpApdcbYK3eatdb9WgQU1y/As9g0qst/4TVKo3DoVK88KOp/YgTCmoNSihioA5E7AyO4N6gFkcQLaPVehk9Y0cYxaVpEQMAYwBModCoA5g0OyORyOa7no8q+T/YOqenH+99O9/X2t7uHFb3qfpU44XCZGJy5ofx5cLLyfHCy9nojuKvo7PRaCA6m9xJJpM7a6mZ+8u5kZFCvlqbWdnKNldOqqXD1OFMQVxZPXq9VRs5qYotHMoBgHJIxA5ole1rOB3EEIOe1av/vfoWLcrcAzCpnMq+zvsTpwoNwqgWAXU6nU6Lu0m3cv7O7cZBhjEwWgRxI1qrNajXopeHaREzACV8pn6NxRlp/bG35/8Jy87p3on5+Sd9863OiNPhmBx/oekef+F4WZiMZu+8HP/hp+r4T4sDvz1/93w9Gl2MLgYWZwM7AXD5eD1TWFhMpaqrM4eHqdTK/uJKKjVzMlKrFUIryyu57FYz34KMAlqf3e5TNM5qhxkszegRgx4xqNWX+PQGdZ8SpSq9CtI4hx/f3ICcqGZ0VMtQJEiSIOPWCjjjxgW3G3czBjWCMNogptUyGGq1AnqVQaVWw2YY8vU7uyPt+709tj8Wt+tt0z2DT5QBVavf6TeZ1tYmC8Tai+4X2R9e/vRDNLoejf7t5Z3oT//obLPNLS1Fo9Glh+uTk8lYcjFbnTmZSaVS2cOZlWp4JrtyWKumVlYPR3K1mXw+lZ+5aLTAQYZzJ7wg5WawS01AGQbTIlZEz1z2pAz8MUJVKKyCHRNTU1OD6xqNA4UxVIt47SBJ4iCIg6RW67W6GUZ/mXssgyCsVovq1QaVSgWbzBaVyhlxbt5+3ztt+1/YbNODY+3zkdYBk8rpjEz2Rwii/+XywIuf7vywubTUdee3e7//dufhP97ZbtwwGofePX8+5Ll9p7pMxBarqZWTrXK1OlNIrS5UU/mVrVw1nJ/ZWq2t7B+OzOTLlZUWlvMph818JKhFrIwWQREFnpZBGQbRG4IwilgVBg0GGDaMjo49nhqcevuehMwEhGqDSjiSpJvUKS+7NYjgWkyL4HqEATCM8aGgWQvDiFkFm9SRSCQy9v37nuk/RmXb9emeifb5VmdrxG+KOPodwyaVpd/Ud+eHF0uPH/TMPf/d1tY27bF1tl25cuXGlStKWex8/uefCpPR03L1EtjMTKr6er1WK28dpVKpmcORrVRhcWtrJbVSrrVwaJADdaROOdNjxRlEKVTBoNKu2YOK7BkMiNKNXpKngZz+vb2+sf2776MQh6IczBBR8iNAHQl6rW436QZBd9SOa+1uTsvZ7ckExEGmydGISjPZ2vr6X9PTNpvtm6u261e/afni2l+v23oeD9xx/nnNNDzptJgi/fAdjWV4baDr27k2o+16W5vR2HblyvUrV69cuao8rty4Yez5femnn6jThfJxuRoupKrHjeXqTPVwZrUaTqUKpUIqX1hJzYSbG4ctDOdFQZTjcIr0IW6EwawMEwQxBnOjdi3KopjewFySqFbrTbDqck/1ycS9x5tLHIQgenW7ckxZST7cTZI6nVvHMNrbBKh8z4ULIj7O50tCo2v9UPdwpH3vyY83p23/3zdffPPNtet//eKbL7653jY9NjDvv+PwOzURk9NkiqxNWrruRG7fKxptN4xtxitXPsK6evlQ8N3onH46+ZLYCpy+2ThdOF4o7K7MrKymqqlyrVoLh++vpFLhar7aWLbXW4Kja3YMYzCdDrQjXIxhGD2OaRk9ErQjDMLCTJDRMrCeURtUeoMa1Wg0Kqdf/d3U1ATsgFl90K23M1qc0WoZt9UNIm63XcsYDDioBUnF5ABmlJid7Sf6u4bb91q/ejA9Xfzi2hdXv7j2179+8c0337S1TTyZ9/v97SanyrJ51BVxRC3O7j8PjE13Xs4drl+9el1B9od15Ubbu83Iy9PTNxcXpxv7JyvVhZOZlfJKKlVtVKvhkaNqtZqqNg7j2XCLNugKogiKEUcB0h7dVkbmbsZytL65/nJ9c53TM4y+u990WfRgtRoKwjCEwqa+sWfv2iEIMQTXEOXQlxbH8biV1OFazIsa3KgyBeQobhSFOAjyEURXZCCyt7H/oLdnuu0bBda1osLcF9dtY33+9tbJyHDE5Bwb276lGn4x3H7n2zmbzXj9yiVf/2t9cgnv+rvffts+PZ05Pt3fHzk93d/KFmaqjWr+eOb4+Gh95nih2iiECqFUi2vNrrVjWnx9m5SCO9uCFmH0hqOjrp3to+71bYVJRq/uUwRTr77saFCU6u93Ptn41x7ss64hQSvjtiuH50GdDnS7FcrduN2NoVqrfXRtFIIAS0wT6Y4M7J3c7e3t6ZkufvGN7doX1/76jbLa2ubm2/3OYYdGNWya3dyM9k++vDPwaE45G3D9qnJd+X+gfXL1k6s3Oqc9N4ceHn+9sX9yulhY3a/WZgobF+WZldeLMyvV1f3zVHUhXE21rLlQDuU47fr2+vpsdBthFHDdRzHiaN1HbEftboYB9AyjDIGULlYPaVUw5ID69v+1BzshCNHrYcQa1CknanBQ59YyDOLWKj0RYg0iyJoVjjmdw86xidt7D+/1KqfibN9cLV774uo316799YsvirY2z8OByLDD2W5xDgxEogPR7jt/e6506Nf/H9KuXb32b+Y+UWZkN4wdX9//+/7Iy+XqyuvTmeXC6UohVV1ZqZ6ebuyPNMpvZsLVlqAVYxA7KGwfrW+v72y/xBmMEdq3j462lRtxY267NhjUY4pm6tUo4oT1iAZ2Rib+dfLEaVLBMMIEraNWpeCR1rjdKui1GMOyDAujEGodd5g1EUurZnDiydNL3qZttqtXbVevXi1evV682lb0FNvafhs2KeM/J+QYJu4MRwZ++ofN2Hblkrfr/xvdtaufXFPwXblx5cqN6+9G/v56pLpYXVleruZnZsqNaqpamDndOj29eHPxZuU43MKNYtzoqDZ6BLq316PbR0d4UK9dP9IyR+uMfTumZ7QIFtQijP2jYAaXhjc3NbBJ8+3U3X89nldBMARrESRo1YJuEnPbdUEto1cSFcMYYA1RARBkaW2dGPx2frC3d/qyENhsV4u2q7arxattbZ7e6eKEs7V70glFTON3HJHJH7r+9g+lJ7ryR1wfgf378cnVT65cufLZjc79+yOvj0ZeFn5IVavHMzMjp43jlYXT/Y3z/TdvTt+8WThu4eyjCDia3F5fx7dj69ux7fVg0Lq4vb29/ffto+1ZhmEExK2YYIa5LHaA/tEmrHKa2p9Ovet9sBfZNCF6JZQZBnTjmN3rdrsRVItpQZTRQ9Y1lUnj949NTY19969n/wF3tagQp9gwW/HBj2P+4e5It8U5OeyYjDhvDQ/MFW1txusKtv/gu/bvqLx27dq1T5T76pUbN2707J+f//3k9f3q1nG5XEhVCy9nVlb290/3FSFVrtMWzDwe5NzRI8vR9jZObLOW7XXGzXQfrbO+o/WYXRmbK3bRjTJ65tKIqfSISmXSOPempm7efdD6yOSAGYRBMIbBtdqgDpQSyldztQiHMaNr1lGHye9XTNvU3Zu9CrQ2BZtCnO1qW5tt+sET//yAOkI4+x3dzojl1q07/5g2trXd+HdE/ifz/pu3a0poXv3kxpUbNzpf7T/d39+fye6PFI6rM8crK9Xq/Q0F3f5K9dWzV8+etZhZDEEVw2zePnK/PCLxbsAdODo66mKQo+3tbcKthKUbwxC73a3sWRkwGDIYTJDD+ePU1Nu3e7fGEAgB0CCjtTMYSYIJHQjqtHoEAexWh3VtDYoM+x8pG7b3enqmbcW2NpuCrXhJXdt0z5dPWgcimkj/MKHpt0T6h4f/NtepEKdgUorclevXL3Ep+D7ypryuKlbFNnS+v7+/v3D/RbV68eZUeXtwenq6/+rds99/v/HJZ1eutJhRdm3NDmPa9e0YvrhNUqAOPFonj9YZ/dG672gSwewIooSdPYggbjeC6JEgABugiKlvb+/x1N7eGAzDMMMAWgRwa0HcqvQ+GMsAmBblUNShcq617g329r572zs9bWtru0y3jylXtE0/2NvzDzg1/RqLxdHl6O8a7pqfKyol7iNzl9PM/4TnJbqPCK9eUagzvjrf39rfH5k5vr9wevHmMhpfvXnVeePaJ59++skn/3eoBTJr7BDCAkfbMbc2to2RlM6KYOQ2gTBH68FgUMGlDVpHR4MgA7pBUAvpGRhQwQ5Na5/z8dSXassihCAxAkaUftC9mnQjbrsb1FrXRigtQVhgp/PJnd8eTz27W5xus023Xabc5W1rm+75rtXv1zhbJyPmO/2W4WgkMjA219lmbPtPVLZd+fT69et/vfZNy//5P//B9um1a58qinLlRs/+/v3zjf39/ZXTjeOVN6cj58/vv7px5bNPP/3kvz77r46/tJj0KIxCse2/WzCzdn1bz+EMEiSOtnFMd7TOIEgQY7RaqyudDoJuBOQwZbNDCwGaUU2kdezdv75zLh5oEPhgYQKCZ88WdQcUuLCIIzsLyPgHNHawNKCJLC5+uL/09N7bToW4tuv/Fspi0TY9/Xh+bzjS6nA4hh1r/d2R7luR2w+V3QPjR7quX/3rN1/89b+u/9c3X3zxxV//DewjumufXv3shu3d/v7+yP7CQuH+yOnBVte7mx3/+OSTTz/99LNPP/mvvwz9pQVyQppRGIoSQXPQGj1CWQxhyO1t5Ys12wPuUS2jZaxBxot61xgd5UaUbR0oaHXATr9z/vG9t1+2vlxwOhcWHj2G1w4WPqweLCyMcHqWOdjiDuCDEUfB4fgwMnI+8urDtG26bbqt2HbVZrtqsxWnbdPT018+aW39c8QZ8TsdrSpnxNI9f2uwzaZU8I9qqVi0v35x5Ztvvvjmi5Z/x6WC79Nr165+eu1G57vXRz+d75/+VK3e3z/94ffOG59e+/TTT///yt7HKW113/cnaIKk/uBEq1ioQBoxmjAGcmTBbMCuwYECE+ECwuAefnRk6roo45lBqT8Qe5y7xh/dLLVaL5bp0Yp192jt2tWt9ay1/rjvfAJ2de197p3vfRICASW88v48n+dHPs8TmUKhV7r8lSaJm9BxKZ1UftSLjeDIv/5vZIgVZxR49KiTNbf0ftc9OChvb5d3j/z5u5ZOufxB6wN8ZESHYqhuODlhm0gOn8/Ss/OtuVVivbvh7cjsL7NQLLQMZJxvBw7sGEek3qrHFuaWdnYMfZN9D0WzBItMpy2WiTmvEAwSgsMkUBRlogS1oI5lxYLgvkaEO345Lnt5/x4o9/JrngPlmhXNykbN1c/V6vmbN2PgSD4Er2SibIAnUygrMpnES6njBEoQAwSO4O1o6LtQJ9vwqOFR56NHDQ3fyTv/x4B8oL1lpHek4buGcENLQ/uDVgyRE7hDV562TUzsLYy9fT2/8NPClSAdffua/aX3x9kf27+bfzv79pfZ2bevUZR/Sy0sbf6SndqZrGU5sRwHNttWOUerabfJRJiklJoSTDStXru4NYgXWcEsj8dfysZf3n85Pv5yvOurQd6pp9Fc37w5eHZwfvDhzdsPP+0pwRxlIJxCVvHLZAqJ2jE3nYyT6ySKY3gv1sKG2Uf2hgEzPtjS8Kizs6FhoFOOt4xE26EroaWlV96OdUsRHSZ1lH02/2+rs7O/jP0yOz/2ds/4dgGdfW+2j83iI51O58Jbp+o1gRHoL2Nj87O/3J6eTn5V7v7DdNpiO1nzxAU1ZVKbOE6QUjThWQ+qc9tZMMuemlm+fHj/eLx5vOnlPyrXoWhWaDS31Zv56vvZ6uz8D69y/kZROJkCBGQqMqVCspycsNhKXIpDURzlBtBe+59YVj6AD3a3NPyLGQot8//8rn3gXwdGWgaHGvDOBva7ASzK5YJcbsI2dTU9vDk7eD72QOdZjbjfjv04Nvb2xwfto69fswu/LDg3F1AU3RybXdhc+vkjSAdZrhkQ02nLRCy37YEB24LAFVM8wfPxA4+aLtvALqEl13xf1qG5f9zU0dTRfK/OdudROhTNikaN4fq2+nzxzZsPixcHPxuUoBoAKmWMX1ZRyiQQ1DaxEo9zlBsnSQ5PyFVIr9w8wD7qZB89sj/6rpMd6PxuJNr7XQMMeINQWDkXJZLb8e2J/NXE3PDmLIq+nSVQXan0duzFT6/HZqPR129nx2Z/eT87Ozv6YDblmV0b2765tVj66lXLh5NglZZsLOfxxI1uY3w0ngq6gzwXD+Zyxdt03/07d3lfA30M4Eq+FnM1k1Q0K5pljKHvdrFanX/z8+L7jz2N4cxIWgAAIABJREFUoJiIplQyfqVMppRM2GxZW8xEOCh3yi1X2UM4OsgNIA0tMK+H/dGjkP1Pf+oMN/xL6BH7SBUw98oxOdaL6QjBk7TZVne3l2/ezi7oZn9ZMK3uvR37aeH17OxIdPBBdzv7FpejcnTk7fzY281fIptntvRkn1g9EfNcX63DUu31CIJgyhTXPQKl9vLB3M0e9P7Vyjmx++Rrveurm1TUletjDMx1tXpzUa3eMqJRijaplPmvfFe+W0ZSXvHZbL6tWM6kS3FEgEQgIosckvcOmENA1/lIPjLyCKZ66mRhdhp5N7QEooRHSNomfnuzujL/y1iUQBbGTKsTv8yOwWCZwZHudvmI85fBEbQXRRdmx8YWxjbf3k5YLsFfTtbDgdNpy97NjTonGI0wjc4oLwiCJ65Wl5MWg+bbxtxdlfmbpGhWNCtkGsZgsFarX36+qN42yURXKVPIlEols7Q2vDa8X5YEh7chDNi2mtyLSE0EQZIY1o0ORNfx3pCdfWRnH7Gs3NzZyTaYW9jOcEs7KkeIaJwwxfdsEzu/bQv8qI7gUhyR8/nG1kNOVeC1d3BkMNqrGkO65RyOSVtbTcOO0vxS0jZ1CZdTH97RWWwTvuWlktHoAT7B6DGphVxOvZw29NyVdHdsdcLGuyRrlt1/OGkwMPdvrxuPb182AVxNN5nMv0I7gnFq85NEEMpJsRVps61ulyImAaGQwBCJDeBPcXOD/RHLNiT+JwtDBXD5kDza+wDBpCjHEcOebdvkxMRETu3QOVaXCMIzkRzWPcAGKV7XgnUPykdG5Ih0BJXqEJNJJ9C5nG8iP6XdMUw+TE/W1DNY0um0zeJLGktLeyXgE7y0t7xl6bsPHqXxn5QDLGimKqFmuXN56of+zGbG39iorBVxoklalxxr9PwPm3/9q0RKOxzQSE5b01mbbVlNmFAOHTnidANcL2pm7XaW7QyPNLCP2N5ec7t8HcO6EQ5zEJ5cedVm035MmtTEnk0tFW5syVYdguFUpB2BiyK961JMjqLdiFRKmEwmtedmZffvf5+aOk1bdrTp9CRctprsS/el+yx7vrQlu7wS8ZQ8xdxa0mLoewg9X78352rZTuy11Gg0kw+Znp6+y8+XBv+ldVL7apnRNIquRKZQKphXn9Zoejiy+deffpQI0pLXEdvzTVrSk2mLbYswuhMY0cthR1GdzgyFHmS8P4U78U7cPDQ4giA6jDAJ6m21unw4sTM1kRTi2aTOodubUBMYhLu1Y4PYINoyIh+U45hcinEoZ9Jtl3Kx2HZydTK9Y9NOTe3YDOmdnZ2dvr4+sZJptVjShce5nCe+ncutpg0QBHBHJzZ4wK9AG05rgFmRpq4Ky9fFPZ91aspv1Ro0SuVdCad89WkzTvOp4fXnT59LUM4t0Gp1eRVi1NM2XzxI6SgpikafHeHtKhDuEcsmQon/kTC3DCIIhnRLdbq9ZGHicHdubSJtm1hVxye3dah6YklHYDo5J8cHWnBssHsAx3FMjiIozrl1hHElKYolxlNP5PMWi+23qdPThw97zpi+Putk2ppOn2yX4ATsrloMhvsaw0ONWNjVeyvFZDAY0ob0b29uchfb1erN9vXk5RTMwtZYq3bJZDJmKWc8Kh69kB788Py5BK7dEHQwqPZBL4DFtjqnJghdgEjd3NwsjY4SJMk2jLzoDD9iOzuRoW4Mw3SR5IRt0mabmJ6GHxobTvocAlqaEFB0AAODxLoHkUGsN4oNtUdHcI4bYtGAoHbEfLcTtolCwWazTFgshd21uVXb6srV1GlfX8+ZH4IXrdmsNW1NW7WGhxpRuVrG62hubBR10/QYbDvvkrHt6s319s118bqazf7y2cBolI2/w21uZp4+m4+nnp6/kEhNpI4LeoOOmM2WtqZtE4dlT8rEEdeQ2ZMlEsNINhSGoShyHB/A5d1RLga9BhM2W9pmS08k1ersHkZwS8utGNqNoXg7MjiIDHbjA+0tyICcwJFBlcrNobxJbI8fzu2fFAq2wkl5LUevreXUa7tJX9/Dy6lTZtJqNUxOwpiYhxBXpLmv0dTpGjXw0DRqDNrTqf6bavFiO3Z9e319e3t7XYW/giZczSoVe6Oe0YPnBz88e5p5IcFJrFUgpLQ64rNZwWdO5IT14Howm85OWgu77gxpxgZYtgUbiGJROU5yOCHkcsmbtd1VwPMvbxezFwS3vrL8gIBxMWIlG4P4SwSFEKL1djvZTaK826tO+raSe7lyee7x9P5a0aMeVucEWi3GZvqsl1M76Un/1KU/Df3oPeJPhv476HXWiBuN5j4zNXUY265eXBQ91erF9fVe9vb2tu+00vi7s7zybBpfzz7/4dmz588kSPSI40wmqTrXX7DZrBbbqtobpAVub9KWtdkKPGVnzXaz3fwdGh1pQHEcjRIEEefUavUWGOflZbJ8zREmnTqHYTo5hsjl8hE5xCu24yNRtGUgyrIoqnKinOAorZQ98eTq6urumiMXJxyCmhNMasGTGx4ur9q0Wt/q1tXnKatBvMg1Cao1NgOhqF+jpvG+xm+YKF4Ui8Wix1OsXlSrRU9sae7w9PIh2GWtduJf4mn+w/v55+//PSHBo9Eoh5lMDmGuf88HdNPloDcYF7YmIJ5b7UCl0tYHiLkXHcHJ/42j7SgmJXQOtTq3PWFJ2y4vJ5KeYZNJZ2rFojjWjQygD+QjONaOR9vbo3K52W7v5uzvYu84oxdCFNXJpG9iWe0IEkJQEEwmtSmeEhy54NpKMkmv0fuxJZvVcFZ5WDndgb7L+1ADY/p6NM2a+5rKQ4M2e7FdvKge5A6K1erFRfWieLF9ot3RKMEuxdpJdt9BpZ69Xng+G1iQ4Pa/BDAuJTUJ6rXcqi1ttRUOk46gSa1W7+1tB+lhTCo1RRF0ADWbsSg3MqDDcE6nkwY9/RPpdFrrn0yadDophmKYnJN3d8tbURwZ+XOvfARD5A+k2Pc4Z+d3d1+VlnYdJsKhNsVzsUNaF1+HRqTJpOPi6x6TSa12rDnWhstq9dx0QXt62bdzeWUx9FUqD3s0fYzBoGm8fzZ11mcwZGPl4sWBJxg/iBeLxWr1unq9vGPQNIK/hNqJdYWmqYPn7//j+b+94CQjP374LzZKYJzOEXTEfLW6SlKtNlEOjmt1oCaTtFUX1aEo0g7Da6JcO4aSOp2DAzNOW2yFw7LDIZVKkV4C74bADPmgHMNHcDFiB8GQkfVeEllZfvdOt6bTqUsOzgOR4iYTQXCEFEW5xHoKwqa8Ak2raceao7w2bZvw2bIna9vX6Z2py/s9hnSfwcBMTW30GRhDNpcrFo+qnuJB/KB6cHMT2/OdXvYxtXJOpmRia95949On88+fP33+WhL626u//C1KUoTACQ71yqovm07bCttuj4ngCJOJ40xSnUkKBRyEg2EoguhQDtVxQXV5Ffzl4ZraZNLpunUYPoJgA0g3CsFDcNWkG8IcH6BoN0n9dWu/RD+giFRKZzKZTDqK0plMHCo1uVOElDC5qSARFNTu4HCQpoPTJ+VyrLwdL2/fZP07BsPO1NSUX1O5/1Bj6DGkrz3xIl8tHlWfVYvF+G4hfTkFZUENTuanvedL8YPnz98+f/7D3yTy1x/+9hMe4hAyYXKoHWuxrA2GvXjUOhNhIlJRt5Re9fE6BEHMQCfHMdbNcdI4p875QOWJFYdJx3XrcOwoOoJ0d2PdGIJ2y1shQg7rhsh8aStFt0rpVmkqSuhaW02okW+VSuEaLYpSUbdJakoRbpXbbRJ4PhgPeoLlHE2vebbX1orV7cN02r+zc5WHIr1H02Mw5LcvDooHz6vVatVTre71GC4hx4mluEwpuy0bMwuqdz/88OHt2+f/IWn4/vXfevHeFJHQqTnOo44dFibSllUvrYMIhDmK1wnLq8luHYKiMPwDwwlVAEtu6RxCzmdL2y6vdh06HeQ4bAQXJxlpReB6/wMpdCRBnJWOeKB7IA1QGG4nW1sdra3d3rLUAeNepNIhzk0SJEmkUJ2Q4igB5bkjNYRtOGiHQw2OcW5rOb+6tV/OG6BWyRgMq56L6kH8PH5+UK3e3FwzUz0aZaNGWes5ke298xhVqZ/ezn7+29sfEpI/v/i+EyelCIZSKBEsmrZ2+0/S2RW1QPN/3aR3UzodqqbLUkSKDXUjCIkS8v3k1sREjlDTK6u+ydPfyiYTccSRiBzrRpAHrRj2AKK5sW4EH8Eg9usBLm0FpVCuFx+Wtg63tg4PQ+xOq3S4tVXXOqzTody6QJECSlO8SefhHDqHWvByca56tF2ky6uxtbVyeSsLs3n0GKxb3nic9nqLR5Hz6vbu5Onp/UZlrWoJyl395ePszesX//72b5//9vyZxI63oCTOIRwhFTjOLcSSays+25YQ5H/68IbnUgRpMkkf6EgU8hvZPoS2rp3EVlbU4OHUq7adN2W1m0tgCIYjyIgc6/2zvLUbwtmQB0jLkBipg3ZDMGdrayuBSlsf0LQUrqYAlqgjIJrslNTR6pDqAgSl4+KpoCMlxI9M1aPqUfWiehErq7fjxetlq8Fg0MbKtLEIRnnhKV7n/VNMo0Y0ShFP6f/8+e3b+erzzx9++Pz+uUSOhfCB9WjmzxyKBoK0bi/pcMRsvu1t49jYTyq3CidIzCQlSVRay3QoAmf+gYlAdQJ0gBXWgoSJgPox2ougcjSKdKPyloGovLulXW7H27sRDCJtRKDW1lZKWuZBSB0RQcUr7aKIOh1sh6WU223ijogAT5jWj7ypg2K8KBQPtrbUF9fb28XitcVqPYzkPNWDKqzbWpjcV8xwtYqzUuF/8+Hzh88//jD/4cO/ff43iRwdMKvM5EAKBjOYgtzqtqjIRKE8OspnUDTlxgkSxSAeFCJeEYwztUp1OoIzqU3q8sTkqiNIcCRlt6d6cQTHuwei8nakHRuBljvW0o51Q6AAgsF4tNZWZAiVPhiWciSCoZGIyAXqARi8cOikOpPOpBNQyh1MeRJHCSkvxA/iW8LN9cX2TfXCZ/Vbk6WSxwiVk+oezF6pUdYznEinffPx84eFz++rT2fff5iVsC0IjttRTIpSCRO67pm4cXiC28ndw8KSUaD41ymc41AEC5jtKjkoR45wUQIjCJQKBB3BVdtEWRAIEguYB3BCLrcPttjbEYiYlT54gLYPtSMDcNnrgRQCw0E9qfQBQmJ2nFfxESkpDehaUVTko1qlgWGOAEyp1BHg+BSXqj4V6KNn1YNgsRiPe+I3F3vQclhZ298vxQ+KNzmf4XTnvhLKgdoFAoWCuZr/MP/qw+cfqs9n34xJzKqwHcdxFYZhKCEYV5eHHYTgUM+tZW0xKTWqkqoCOIogJAnByiQ6hEVhLBVGoJTJ5Cl6fOllgeKdKhINIAjSQpLdIygUcRBp2Q0uaKAbWxfBxAi31lbUjh/heKgU+d5MSrGQyhxCpa0YH6BaCYKiTK0OupUebjUu8VTq2dHRM/fowXrppjpKOzwX5dyuJV/QFpKxHB0venI3V5NTOz1KcChKpUzPVBQuZm/xdvHjh88f3j8f+zQrGcAGOBZFcT6Amgj3sk8qEB61I5Zci6WXg8HNTRJVqcxOVIegOImQCGbH8BSGcJzUJF0/yG1N2Hw5o8q9nomG2RAuhWHI7Q+kCNLSgshbIPQe6R6JdkOII4oj3fYRVm5n/1fUHEaGpAt2VEoiKpZiQ2FS10oFUF0rahqmW6WtDnolQD57Nko/PeJTz1eSo7Q3SHvic2snVqvVYNWuRi4OqtXrPDhLpUbEk1X8CoVSnKOf2dnZqVyM/XVWQpoxTIWTFE+gbv7vKzpKnVo3USsraz6bT01TKYLEUziIh9sREkHkHBddx6ATiQiue7YnLLbLUpyXpqIJkrSzQxjLhnDzCNZCtuC4vBfHW8zY4JAZJ1uwAdwcGAo7QzB7kz1hDkip9XVEKjWTUmeCapWiBIqYqNZhqcpIt1KUCj16Xn26njhw8ykvzXNHB3xuu1yeKzAG6NBbqnouLuLL6Z2z+xplDU+mV8DVHVFFmZ758PnDXyTRdbMZ59AhlYoiliM6XqUTTGqeXinYLNktB+/mEm7CnkIRlAOrxEl7dP0II8lUSpoKenK+9OTUq+lhnXs9ShC4ncVgJlbW3IIMtbQPoSO4HJObW8zhAUT6PTk4Ntvebsa/W3jdzbJhmKDKzJqJIUJOSXFUBZMBoHZSqnLTXprkR02Jp6OJc/c64X56ZKSPqtXcmnBOl+fyBqaHsS7lSqWLi/Je3+SOEmZ6h2aBuOiVMplL6VJ+fDM7n5CE7Shit2dQjPDsrZpUJoEiTOL8XtbsxPSaN5hKUTqcG6JgaDCJ23Eusx4N4KNRlYlwFD2r0KKbXgsSAprCRzisWyrF5Gb5kBzHEXO7vQUdgnjZ3pDZbA7/+Nr544L8R/TH1+HXZvsAG07Y7aydNAcQaZRDUXsoQ5I8QiJQbkh1rTRlenrkTqWeps5TR6pU3Ht0YIznyjdWQw/Tk4wtb18Ub6q3fZdTDEyGpFEq9RXRY+or0KHuv6gePJdQdtzO4Xb35tLyniBQFOEWKF6tXk1bbLaTObXJneK4FE7ioBtKojgaNavMKp1UR0kd8WA5P2mxHXqCKc6NIvZoN4l0w5ggc7TTbLb/CRtqMeMtQyzLdr6Iwmw4s2Pts6H516/HBs0qs5l9MYLaURaTIixJmlU4m8FXtniSklIUlO5S6ujZkerpAUGkDp6eB1MHBx7P9s21lbEyPdmtlYP4xcX1pJU581cuYSr0+80dMui+lClciopSeT0//15ix1V2RBXZfBcpp9w86la5KT7uWfFZs4dJ2+oqHY8TXDSFJTjSjQWG0ERvirRnSDdJSU183JPzTaazEyc3Hg7VIakU0m02Y2aYWnVg4PsBu7mlIToyZG9pMbO9uHwMoBpm5T+pXi8M2DFcJQ+ZAwNhNhwgAzA+N0CqzJESFQhQlFk6TEtbdc+eZoLPXjxbT/Av4uqDo6Nqrhi/yVoZhslHHBfVItRatFat/3Rqx+o/Oz1TyjbOKuBb9Ar91bsPHyShEDoUKJV0D3Ruzu1OpISEQPHCsiWd3U3abPmcYCKOUm6Us6PcgAnNcHYOdWMoauJSvFEoLWf7rJaszedJESi6vrC4OCg320dgYpSEyGhfb2BxiN6w2wfHwj/+h7Nh9j9nf1z48Wkvaw/bh8xhUoUOkChid4adITbgZIcQyoxTpYiUlra6zwNU4GnqPKEaPfLG1w+Ozs+NuXKW6ekx+CKR4vmFsbh9c319fT2Rtfr9l6eXlZ6zqbOeyhlUN2VXCz9LMG5AFSBxiuI5SiDilDtl8gS95cO01mbLT2Rjaq9wRKCYnbKvJ1AUwzM4qZMS61R8PZijYxNpa196YmIvGOTcyPni4pd5VTsetgOWvKXXbP4u3BD+PvrnaNjcObgw+x/vF+QLCz8u/LgQDbHOsJlFQ2ZzyE6GWBRPBAJO1smqAgGnU7q/AhU16RBFCi8y6089iYOjZ0b+4Ig+KMa0PQzj95WKJWovlivd3BQvbra3b67z1kmr1m+dNDD+qakNpbKiib2T2O0ZXAVToFD8qJvnOMEdNBrVubUJq9ZiydqW1QKdQlGOQkg7x+EomSJJLEVwlCAE1eqkzdrXZ/WvqtWCCdXBqJ8vmcSCfIA1Iy32UG9ogA1BhnOyeLSTfRQKJRpY8yAyYGdZ1twZZsNOO8tG7WYclUpJO6syw/BqVhVQmQOjKtXrwGiACqyPHr1InNPx50+F0bj3IH6dZXqsWl/xIn5wES/GL7YjxWpx+6K4u7y8Ow063hqsZ2caZbMifyUhsTB6lKIIN+/28LzRI3hGBQcdn5u2WA1Wi82Xy+mCBMGTJKUbIkIZjkRJIsVRJiHoja3abNY+g3Xq1ZqQ4nWb84tfvnz59/nFhZEWs9kMfdV2c8g8Yg+3DEbDbCcbCrFhmEcjDM7THIZ9liQTCaeTZVmUtbOBACuOa3E6nc5OlVOlCkgplSrjlrauedaPjo4Ogt5c9ZZhrNokVJyrBwcH1eJFtRqJX5SKxbW18kX1onrjY3o0zOmpUslIpCSVinIoUUqWStCI89JeurxfXtnNWg0Gqy2/GvFSnNtE6SiKQlEOlRKcPZVCg+7cis2StRj6DJOX/7XtMJlMiHFx/kvxYn5xcXGh3exsaAmFwiwbCoWidnNiBDezuNnMhkKJ0FCANJthspQwazabWecjkIuVSlvQTOJFGCbDcaoaFhfMqu7AAtXKL8zPL1EH8/PVxYOEJ75n7WG02S1PafTguScXjx8czJ9H4iUjdDrkLqrVm9ge3GvnaupUppSQqDlj3Nxc9uXzy3urJa/X65nr7y+X1TGLwWDV2nzeoJqXUhRKYRSFcCnKnUB1Jj7opWMTWUva0NeTNnzMeaEU0T3IZG5gQOGXH35ckLP2EdzOdsKEUvYGmFgKD0O5FmIDZDcbsofsQ6ow6zSzYaez0+lkqSHK4wxnMqMgm9M5vzg/r9qMfAls8vOLt/PRL4tfFudT58V4rMdv1WpX6QgdP/g0N7e/tDW3T7/zxg8iC9V46eJm++Ja6/f7s9adilKisr97t7UV293dj2UtluxqTNgX75mRW7EY+qwWW4w2UoLbjRKU253SuaMoZeJSbjQlrPgsWYsFZhdKF7Y9JkFHQQTt/MLi4uIL+eLie3vIztoBykx+j8O0Wev/asfsiN1pJlsDve4EjpjBBp0wb60z7BxSGTczrGqzVGP7srj4ZXRxc9G4KP35+u0NOf9l8cuXZ9XqQZKx+vO7+znaeDD369yvv/568vjX/l8//xSBRN/Et69vDX6/38/0MErJqOfT/towTzuGDwsnJ4cT+d36bXh2s30GA1yUV1Met8dNkCYSpSipOwVdcUGPoF625G1ai7XP0JdO5nLrpgDqThBy7tHi4n8ugm3+y/fhsNmMmFmzPfwi1Lk+ELKzrEplZ3WkFMdYNICozKyz0wkzDztZ++bPLKsK1/bCjxYXFhdaFlWLxsWln798Wdw8//LlS/UoVa0uWRnr6lquavQe7P4KqR82f5k/P/ccnHviS55bv9av9fsLh4YziSoyLKVo3rv/uL//8ePpgtaiFe93cnJoMfQYrPmYWjCaKIoX3JSJclMowel0Og6ugcZsFovFYjX09Vl86mAxxVOJFKmyOxedmfkvi/P2lvlMgzmAtJhZ1h4O2RN2knVm2JZSpJVEpGYzSQ49aA0PIOGQk2XDbGJhQdTsNWzCLFi3c3Hxy+JHk25+3iHA/mIpXhViBitzSNPn57kV0O1XUb1ff/2wUCrHYis3+9sFYNP6p/v9FYlqmDZRglG0xf5pQ58BkiVfsPYZevoMVl/Zq/Z4BFrK8xRlIt0cStE6KsgFg57Y3upqXmuxGnqs+a2gJ4UGCJRUBZBB84jqy+Lid/OLX+bN5kAmQbYgCMuydnsATy0tLQmqAGqm7CzpDKvsbqeTDZBO1hl2ZpzO12Cg4c2Sk114P79Abr47f35gom42KX6TvzGWIokDOpLMMr4Vj9Gz/XjuN8B6/Ouvv518+nX3ce3WSP2PTwpaLdwG6pCReL2UysvP1di0jEHT08P0MT0Gg6Gnx2Cw+HI5b1AQQD2e4t3xTRNlokwqD08Lnu3ydF6UbnLqY9nLe7hUCk2FUJVqZN4pDy2IPsDp3Gyw21kEhaINCSB7PpUojYpNZEIh1un8z5CTDTjDmZDTGXbCCEfjZmzLGMES9oAKJTcPnqooiuLhlgnSVOo8Hjc6Ylf5/RuPca7/sahaTblf+79Jh37tYX9/f15C86NG6o6tD245BBf5NBoYkSGaZS7uEYJej0C7PZxqK0fwBEXzEbcpV/TkVi02LcDtTCUF73oqFU0lUA6qMkggsTj/5f2XjDkwirOqaBhB7SEVSXJ2Y0CkY832FwAJwjlV9lCiltdS1L+snGxt7W4FjF6jKsLveo5UPM9HlrPZJd7IB0cP4vH4lnV6PxLp738sUn2C/DT9FW66v/9xfwHY+vsl/XMr+3OipCcGuJ3SH1Kf1bIdieciOSHuycVTxlcrFEV5hZQ7Igh00LMds1i0FoOhzzC1qvYaUyY+wSGBUBgNhO2Z+feLXw6+N6sidpU5HCXZdU6uIlVueyChYsNQTofEki4QgCpJwJlgnc7X8PLdFqS5ubX9fT5Cq3gvxVMRX9ZX4nn6/Hx4yeNJ5ufKNOhRvxvOt6Kd5PPTokec7n/cL/n69rSBMdSQxMFcEBSh6dFmp9dypdL21p5vWShtbdEU76W4A095n4fbT6i3fBaLtq/n4Y52xaSm3Kl1N6VTJcwqu9s+MP9+McyqQmY2FLaTAfzpi0QigCbc68+igUwmUCvOAk5nhg0gpIo9H9sUS4bw30W4V6UARdL7kQBPU5TX612J0F4vbTyK08XiVn5/X4SrYXybpvN5v7Yw3X9S8B9Of4WbPtFCgxau9X1N9xt7rJaTtWJuVZu1GrJby7s0TQtGIT5qNNK8YFR7c+WVrBY6uh/aYkHB6+YSHEWRqhSbIVWJVOmVXcUmVDC5vFmF4omonSRJ1dNn66pwig2Enc5MGO6u5VRlEk729asFJ8wrHChtbW0dvtp8p/Pu05SXoml6n6b31/b399f23Qex8kJ5OR/b3we4Q3/hj3jTBb9W6/dr8/4KU9FO1+FO/AbRJL9la2xs7NFmT7a3fWJHdjYWMfK0Z99rjOwm19bK3lzOU4a4ih64EJ9eNnp5h/GID1Bu1I26VfaAnabNaMAOc0Q5MwF7YAi4A05VisykMm5KJU7plnFmwplwxplZ+NkJ+wHq3avlrVfLWzFqn+Ypitrf34/M7dP7Xp6G25fsl+lYXptcE73EdMF/Jd6m606ggv9qx89UzirKSoWpHErANvsL4l3nvrJ9HYrXZ9Cu7sHUhj2MZS+XM3qN5f798txhof9xPx3M5SK57b37jfc1jT0IeyBWAAAQP0lEQVSW7I1R4N0JwU1xbjKQCSUyATuZyJhHn3IBMmBXwQ0s7DDZpVMVCLgzoYwKpulxBvhA6sXoa6dzYcFIBQI8T6k2Nzf5d1vv1vYpL+WlqblPnz7tUzTt5b1e2stH6C1tfqXuAfN+v7YGtru9vVvQav1TUxXlGbR5KhXGLylMn0yDK6mjKcWBeOJQPFAOutEKWa22R2PNlnK5SFnMxifi7fYiRk+uvGRt1PT0aDR9fcu5HO8VeIpSuSlOl3qRyiRUoYwxnglQhCoQsDszIWcGdY9mUqnMC5AqpRrNOEd5t4oPjDpHVTxFeSmKp2jHGk2v/X1LTXspPlB6t7//if7k9e7zPM1D5isvaw/XVkQiLdyPUnSMj2/mY8t+7U5Fqawompo2XBWFolKRaLV+rZjdxA6yZggZa5TBFgA1Bq32BApqjcaQjeXKc3W/ejLdP90/N7e74tPAbNzgenrSS0GvlxJ43r3u5gNEIpFJJVILr84zAVVA6k45nSGoFKsCmdFRVSo+yqdeZDILo6OjKpitbVTlXYNMNTc3t++laZ4vbZ0vrfGUl1/59O7T5ifKS3sjvNcbieRK+ezKvljnmL5iKgzjzwNcbC8f29qZqihdiopLoVC4Kq5KhwRE++pJYAxXDUzW2NwoA+ksBq0VlNOk92p2Pv14ulAo5LMn09PT1maG0RoMPY2N98929gSPxyt43B4Px1MpjzvhfpEpbUXczsyoM3Wk4lWwjgoqPmUcXVDxqQOP0Zgx8kbPglEFNQSKp6h3P72hKZ6n6b8vX+95IzzNl3jRTiHTRehIJBK7slyVd/unoQqcrzBMxe+H6uL2lXbZd3ba7Kq49BWXq+JytU1NScR7IIJojUpZs0zZLAO22tLc2Kzs0WoNWgPAWcUbCE4XHk/ntYY+qMoYNJrDraxVAwNL729M+XLGG4EWvDxv5I2plMdtHOUjw1IhoEplVJkMxfOBFPgEwbPpiZeWRheMwGXc9MCAAviA5+ml+Zt3Xp4eLUaSF6+8EZ4fNdI8VBrmyvv7JWNkZVmrtS7v729ptfmTQz9TUVYYvz/fv7t0yGiUYIt6l8sFD5drY0MC9ijmNVGrDllzh0wcpCYuMPzVoE1rDQaNxmDJn/Q/nu4/yRtEqSFZH59YxTGzjY3MmSGpjsSWl/eWeKrk8aTiAg8FsJEzpoxG+OWqIHHOC3x8YS/r90O/997NrfbWf+tPRsBZQIrcXNysULzXk4q9Chp53ssbadrr5b2iGe7PxZb7/Nr8VqQ8d5jX+hlGqYRMxgCctnlqQ1EBMtjUkkQDvbXKRpkMonCaod+vQ/aVT9nMaEXpDIxBq9XmDw8PDy01x1qnM/TcudiennwMBndbSl5PZNfoCYKKRmM8yBd5SgA8Y8rDG41LTKNM06iE8CCmVlPQ+JciEchPtAgHlPRWkvZ6vZSXp/eNkfJcf/9JIX8ynWf8Wu1qbmXucX9NNiXgVbS7y1fKqVOFC5ZvkkS0yUYlsDXXyWSyDgU8gXKG6YJBC/cSNGi1cJPEOzQxqlPUu+6CGhs1ffmTSPlwZT9S6j+ZK29NG7e3xUu8Xm9y2Wg0ennBaPTmbu/D8RobxR5UpQzyQyNjZXxXjN+3crO4V4NbWqYjopaR/Uhkrn96Ou8HqRhGu7cy1/+4fzoPugGZqJ5Gs3HaVMtr38L5GTHMVNRMBIP4aEWHTNbYIWtWavKPp0E6wNMaNDV7FKlgEcsOcDzwUDb2GA7752pOuv9x/0lhJZndS6ojudxeVrvk9Xg8JeOKZ/uqUSOeEjidtVein4ZAUcaX3IvtRlYiKyuxLdrrjXgjtHeuHJkraA8LDFODu4pB5bgAdRCIG6ooKspK88aGUqav57Vv4LQaZbOyWeyHFoPDOmDtUCjEmJxGTeHxiWiYhRNt3aPWzrtYGor5srZpbGyuKHt6Cod3NYbHh7ZCQQuzgSwv+yyFldzNXmzLV9jL9jTKxntejmuOYYTOS6U46Pgl9KIq4X7DWUhXV1rrVTK2QtO0t9y/HznUMif52tUpRpuPwdfnGaaiVFRcFZfSpW86naooXH80yTZXW5sEQtbrZKJkIh5slOKgC+2J6C21j6cNdbmalR2yZoV44kVTriPKmk/P7kMo6yFUefqnC5a8JavVFvJWi9WqzSbLqz35vMFg0Mg0snHZuKzxWBygIzsehxFWGplM2SgGlgPiDtPDMH3a7LJveXdXrIfkT078jFiq+X1ilVkLulWUCpeiSaaonG78UbK2NoBzSRgZXM/6OsRHoWhqUjR1NNU0bFZoGGAzFB6fgBNQwNKsqJXytWwpPgDv/sYZjJLVWqDIeHyozYO3Llit0CzWWrNZMG3QpxFwXr4UhRsfbxTH6byE3CcD8cR0VWHgvtHiobXLWobxL0/vHkImY/z5XahIFPwVRiNWRzbONu58/zeiudogSZivBglcQCbiNTWL7zQrNXADYAPYvChls0KUrZ4/a46n/oBKmxKcqvYEykKtVmvpnwYwgwYuMfX4mbr5A9VxkwyUGxd3Xh7Xs4XoYpSyHYaxMnmAYhjDst/PMIcnWydglFcnW2JNgmEqTOV+o8Kl35g6/W/J4Eni19RHG9TA6myKe8rmJtFANRpD3uDXNDIaEa221s23QzRlYAM8EFEJSmsN+bzohbTT/Xlrj3ipE5T5mgHGj8fHlaAbPEF6+Tsa0O2AbPnpQy2TP9w6BLgrbT7P+P1X4CdBOKbCMJoz8P56ieS/YasrZ2CUAFdTrJ7uASi8J+KB01c234UR18NZOiB2s54/64MVmmWySjPgaRimVnZo81r4+lpt9fd0PP6ycfz45fHx8fi4Ylx5PA4jw35PShnUf5XMIdT1tgon0AkJNWS/nylMT5+cFKanxfynPD1r+wf3WIeC7UZXW025u7x2r7bACyCEnVrsSi3VnE3d7dy5HtC3SSw7ZLKO09NmcL0wRB0IGbEglP1jamqSKcRTJXPBadEfK2R6mV7mksEqkykrO7filfuTx48P/cxJHtiATrwt/WHBf5hXVhqVFWXTvX9mu+OrKedngK2pqUmvEHHuAVXTPQATcf8x1ST9XeiaFYuLrKPpdGoDrm/C0qip2dgfuWRgE02KJn09C8ArhUKv0MtkMj3QuSofIYF0+WnoGC8U/CIb42eUFSWjrMCTcmPq9B9Ktd+ZNsQtKMcYlPWD3dM33btjA1AgrYspiiRmxSZF01fuOmHNAYk/tqPjbAMcqBhK/a2tNdWW2l/BiayfGT1A6msLqKeXNe18vPz48eMOaOf3Ly/7rwqgmsHvZ5SuWl1SWVG2TZ39I5tLtFEQ7rhro60NHhItI1Pom/RN+nvi2qS/d09/T0winohyZ65N9xRNYLTiCzFris9fnWwTjHcGab+O9qqL/XXRAxgQ6Zs6XBt6vUIP/6KHPYUedkUJd77CvfkV7FDr94PvVCoregBUulwb37qRNlfbTJtrBrbjbV2Q2bpg6WqTFPx6RZ0OlnsKsEzAqyMCpChhje8r7736ezXwOwsVtx0df7Tjml7ABVIBv16v35iamtpoEp/PmvQbZx0yvV5RJ6x8/LjTWFEyfu3Vlb9w6NdqT/p3fX6l0qXQV/QVV9PZadMfJRvvmhlv2xA974xok6JpShgNoN2x3S0iGqCKa42gbqlijhRVq+dO8VFTVmTTn210dNRzIlgdnLgmURUA7GjaON1oarq3sdEl0ev1etfGxkZbE3R7HCtcdfEqHy/F8BLG79cmV/Z3t1bmyvtrW1Db0kMlq+n09KtwNRcyPjM+0zYzA3C17NbV1TbTJmGUcDbhMPqaVnUsEfEb/f5PqYZbZxQ5JKdTpxt6yFniuDAgEkfnw0EkG1NTp6euJr3knuSeHg4skUgkeonk5empXt/RJDZaFDsfKzKxIsb0XJVXVvbLkFaulC5Zrf74ZGqjrlyttO4SJRtvqyvXtdHWBfmuS6JU1rj09yT6rwu8FsnqlL9j3/v21R/e+P3vOp6cnoLFNW2cnW2ctTXp9fc2zk7PngDmxtmMpEMi0TdJmkTh9LUDQmprOtuQ6PUuhXJnR8Ps7EBZ5t8qv/rp1zf0m7++ebVxdrkhtkZdro0uFzQHfneSoNxGHW4GZOuC9O0R7vDuniSSe7DCL5bUfvhXq/2qrATWr5C1TyUdkg7xs43T01rGajs9PT11SfQ1Conknh6OWztO7fhNEonkydnUWZNL71JWIDLND0PQrsrlN5/+69Onv/z6l4+Xl5dnolx617HLpRAdZ42ua2N8fEZcAW6jq0tc2+pwXyWrG8m3pPBaDwj/7SLCiE/wV3W4u0/Er3sCKGJqEr/uGwuB9ViiPxZ/gV5//GTmrAuUqwffQaabm9757dObT2/+8vnN5dTZJbRr9GenEle9kVqpKdc1PrMxMzMzs9E1Pr4BykGa2ZBI9MdNcAiJqwZWw/km1Xe+xb97H07B7wLX1b8naaqj6YGs9lGN7V6TBLK3+JFe4vpqLuLBjyUSfZukTQ+DoQEP+n4YppDd+e3Nm7/++ubNm7PLjUuXS1k5Pj3r0IttVDDMenktPtpEzSC1gX5d4lcf135u2936D2z/wFS33Lsk8n3d/frRNyep/t5LyfGM5Hjm5fiTl211nGOX5PjYdXysPz5WuFxtkjaXZOO0Q4wrrEDbDooD/9XKp09//zudbJYooNnGKKc2joGsDlcHArngBei2MdPVNdM10wWHAJw28RmW+tPdItqt5P8x/eEf4NQdSyRPxp+Mz9x7UvNrteO4jo+PX16/vFUcH9+Kh2+THHdNnR679BWxbec6BvG0u5GtT7ul0taV4p6rDYoNWUWhdNXYXCAXZDCQaka0RlgAr6urhtDWJnnypLa2PZE8aZM8ERfY6DUypUz/ra5Pfv9U8uTuFDypSS7+xbH4rIcX4pkT/+AYsvtM10sx14P9tUnajm+/HB+/PH55fHv7Ulb3e/e6zmZcelE5l8ulALqtyO6nT6XS3Il/h6m0HW+cNUF/sssF5bnLVctfd2QbM6DbTNcMZELJk7Ynx0+eABSsgCc+vr6SKJUav0LSJtEDUf3dr6fin9baAicI9IYdOFuSJxKxLHo5U1Oudrwnx8fHx23Hx1/g2aVva2t70vakretJWxt4Q1DnWKxN7m2++/u7N+/evHnz8dVV2xOX0lVRuPTQa+KquLo2ZtpELhFspr6Kj5kayP8t6TVKRqlvUiqb4Pf8H9I/fw1I98d3oCx6UnPXXfXTCYBgw8fg339/78nGhqQJ8FwuaAdclWDCmrGfd3YYgPm9v6QCVlnTqeYta0x3OzMSUbauu7X2JB77LkFNVclcLS3d1oX7/5f+8B2QxIKoXhrdHQpw2iRPRLFEb/ekpsHZ1OkGFGauY1DuyngT37wx7mmUlYrrdKqr67jeSG1rc3W1iWQiVJ3s9ySpfd3/JUnANe8VS0u3EtHEYO2CE1A/CfD6br+2/vMCKxy9ljHGa2ZUS09EDw7uru24XkDBn56eznR1bWx0uSpK5e3m/O3PnleVSkXv2ji9o4Ca/0zbnUj19Me9/w9CuT25fM2dnwAAAABJRU5ErkJggg=='
      //   },
      //   {
      //     serverKey:'k1',
      //     account:'sophietwilight@qq.com',
      //     serverAddress:'ws://192.168.31.105:444',
      //     serverName:'虎背山游戏地图',
      //     serverImg:'data:image/png;base64,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'
      //   }
      // ]
    },
  },
  getters: {

  },
  mutations: {
    //清空临时线段的缓存
    clearTempLineCache(state){
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
    //销毁综合对象
    destroyComprehensive(state){
      state.serverData.socket=undefined;
    }
  },
  actions: {

  }
})
