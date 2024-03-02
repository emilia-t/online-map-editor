/**
 * 将在0.4.9版本后将更新vuex state 除Data数据以外更改为正常的修改state模式
 * 尤其是 commits
 * 同样的 将取消匿名的指令 anonymousInstruct
 * type:config\data\storage
 * **/
import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    classList:{
      realisticBaseMap:class realisticBaseMap {//真实地图底图类
        constructor(mountDocument,baseMapOptions){
          this.ctx=null;
          this.el=null;//挂载点
          this.tileSize=256;
          this.network={
            tileCache:[],
            downloadManage:[],
            allTileCount:0,
            downTileCount:0,
            needTiles:[],
          };
          this.map={
            width:null,//宽度
            height:null,//高度
            browserX:null,//视窗宽度
            browserY:null,//视窗高度
          };
          this.view={
            offsetX:0,//横轴虚拟坐标偏移量
            offsetY:0,//纵轴虚拟坐标偏移量
            cacheX:0,
            cacheY:0,
          };
          this.options={//选项

          };
          this.QIR={//质检间
            isObject (obj) {
              return Object.prototype.toString.call(obj) === '[object Object]';
            },
            hasProperty(obj, propName) {
              return obj.hasOwnProperty(propName);
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
          this.initial(mountDocument,baseMapOptions);
        }
        initial(mountDocument,baseMapOptions){//初始化
          this.el=mountDocument;
          this.ctx=mountDocument.getContext('2d');
          this.el.width=this.el.clientWidth;
          this.el.height=this.el.clientHeight;
          this.map.width=mountDocument.clientWidth;
          this.map.height=mountDocument.clientHeight;
          if(this.optionCheck(baseMapOptions)===false)return false;
          this.options=baseMapOptions;
          this.options['zoom']=baseMapOptions.defaultZoom;
          let latLng=this.latLngRotate(this.options.defaultY,this.options.defaultX);
          if(latLng===false)return false;
          this.view.offsetY=(this.map.height/2)-(this.latToTileY(latLng.lat,this.options.defaultZoom)*this.tileSize);
          this.view.offsetX=(this.map.width/2)-(this.lngToTileX(latLng.lng,this.options.defaultZoom)*this.tileSize);
          this.render();
        }
        render(){//渲染函数
          this.clearCanvas();
          let leftTopPos=this.screenToTile(0,0);
          let rightBottomPos=this.screenToTile(this.map.width,this.map.height);
          let minNumberX=this.callTileNumber(leftTopPos.x,this.tileSize,this.options.zoom);
          let minNumberY=this.callTileNumber(leftTopPos.y,this.tileSize,this.options.zoom);
          let maxNumberX=this.callTileNumber(rightBottomPos.x,this.tileSize,this.options.zoom);
          let maxNumberY=this.callTileNumber(rightBottomPos.y,this.tileSize,this.options.zoom);
          let rowCount=maxNumberX-minNumberX+1;
          let columnCount=maxNumberY-minNumberY+1;
          let tails=[];
          for(let i=0;i<rowCount;i++){
            for(let j=0;j<columnCount;j++){
              let x=minNumberX+i;
              let y=minNumberY+j;
              tails.push({x,y})
            }
          }
          this.network.needTiles=this.tilesFilter(tails);//获取当前需要的瓦图的二参
          let zoom=this.options.zoom===parseInt(this.options.zoom)?
            this.options.zoom:
            parseInt(this.options.zoom)+1;
          this.network.downloadManage.forEach((tile)=>{
              if(tile.z!==zoom){
                if(this.network.needTiles.find((e)=>e.x===tile.x&&e.y===tile.y)===undefined){
                  tile.xhr.abort();
                  this.removeArrayValue(this.network.downloadManage,tile);
                }
              }
            }
          );
          this.network.allTileCount+=this.network.needTiles.length;
          this.network.needTiles.forEach(et => {
            const etSize = this.callTileSize(this.tileSize, this.options.zoom);
            const tileV = this.mapLatToViewport(et.x * etSize, et.y * etSize);
            this.drawRect(tileV.x, tileV.y, etSize, etSize);
            //const text = `${zoom}/${et.x}/${et.y}.png`;
            const text = '加载图片中';
            this.drawText(text, tileV.x + etSize / 2, tileV.y + etSize / 2);
            this.drawTileImg(zoom, et.x, et.y);
          });
        }
        setCanvasSize(){
          this.el.width=this.el.clientWidth;
          this.el.height=this.el.clientHeight;
          this.map.width=this.el.clientWidth;
          this.map.height=this.el.clientHeight;
        }
        axiosDownloadImg(z,x,y){
              let url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
              let imgAxios=axios.create({
                responseType:'blob'
              });
              imgAxios
                .get(url)
                .then(ref=>{
                    if(ref.status===200){
                      let blob = new Blob([ref.data], { type: 'image/png' });
                      let img = createImageBitmap(blob);
                      this.network.tileCache.push({ img: img, z: z, x: x, y: y });
                      this.network.downTileCount++;
                      return img;
                    }
                  }
                )
        }
        drawTileImg(z, x, y) {
          const img = this.getImg(this, z, x, y);
          img.then((e) => {
            if (this.isTileShouldDownload( z, x, y)) {
              if (e instanceof ImageBitmap) {//判断是否为ImageBitmap
                const etSize = this.callTileSize(this.tileSize, this.options.zoom);
                const tileV = this.mapLatToViewport(x * etSize, y * etSize);
                this.ctx.drawImage(e, tileV.x, tileV.y, etSize, etSize);
              }
            }
          }).catch((e) => {
            //console.log(e);
          });
        }
        isTileShouldDownload( z, x, y) {
          let zoom = this.options.zoom;
          if (this.options.zoom !== Math.floor(this.options.zoom)) {
            zoom = Math.floor(this.options.zoom + 1);
          }
          return !!this.network.needTiles.find(t => z === zoom && t.x === x && t.y === y);
        }
        async getImg(vp, z, x, y) {
          const found = this.network.tileCache.find(e => (e.z === z && e.x=== x && e.y === y));
          if (found === undefined) {//缓存中没有
            const downloadManageObj = this.network.downloadManage.find(e => (e.z === z && e.x === x && e.y === y));
            if (downloadManageObj === undefined) {
              return this.xhrDownloadImg(z, x, y);
            }
            else {
              return Promise.reject();
            }
          } else {
            return found.img;
          }
        }
        xhrDownloadImg(z, x, y) {
          return new Promise((resolve, reject) =>
          {
            let url = this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
            let imgXhr = new XMLHttpRequest();
            let downloadObj = { xhr: imgXhr, z: z, x: x, y: y };
            downloadObj.xhr.open('GET', url, true);
            downloadObj.xhr.responseType = 'blob';
            downloadObj.xhr.onload = (e)=> {
              if (downloadObj.xhr.status === 200 && downloadObj.xhr.response) {
                let blob = new Blob([downloadObj.xhr.response], { type: 'image/png' });
                let img = createImageBitmap(blob);
                this.network.tileCache.push({ img: img, z: z, x: x, y: y });
                this.network.downTileCount += 1;
                this.removeArrayValue(this.network.downloadManage,downloadObj);//下载完成后移除
                //('dm下载完成减少');
                resolve(img);
              } else {
                reject('下载似乎失败了');
                this.removeArrayValue(this.network.downloadManage,downloadObj);
                //('dm下载失败减少');
              }
            };
            this.network.downloadManage.push(downloadObj);//保存xhr对象 和xyz索引
            downloadObj.xhr.send(null);
          }
          );
        }
        drawText(text, x, y) {
          this.ctx.fillStyle = "white"
          this.ctx.font = "18px serif";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "middle";
          this.ctx.fillText(text, x, y);
        }
        drawRect(x, y, width, height) {
          this.ctx.strokeStyle = 'white';
          this.ctx.strokeRect(x, y, width, height);
        }
        removeArrayValue(arr, value) {
          let index = arr.indexOf(value);
          while(index > -1){
            arr.splice(index, 1);
            index = arr.indexOf(value);
          }
        }
        clearCanvas(){//清除canvas
          this.ctx.clearRect(0, 0, this.map.width, this.map.height);
        }
        panBy(offset,option){//移动地图
          this.view.offsetX-=offset.x;
          this.view.offsetY-=offset.y;
          this.render();
        }
        viewPositionToLatLng(mouseX,mouseY){//鼠标位置转经纬度
            let mouseVirtualPosition=this.screenToTile(mouseX,mouseY);
            if(this.virtualPositionCheck(mouseVirtualPosition.x,mouseVirtualPosition.y)){
              let lng=this.tileToLng(mouseVirtualPosition.x/this.tileSize,this.options.zoom);
              let lat=this.tileToLat(mouseVirtualPosition.y/this.tileSize,this.options.zoom);
              return {lat,lng};
            }else {
              return {lat:-1, lng:-1}
            }
        }
        latLngToViewPosition(lat, lng) {//经纬度转虚拟显示坐标
          ({ lat: lat, lng: lng } = this.latLngRotate(lat, lng)); //尝试使用解构赋值
          const my = this.latToTileY(lat, this.options.zoom) * this.tileSize;
          const mx = this.lngToTileX(lng, this.options.zoom) * this.tileSize;
          const vp = this.mapLatToViewport(mx, my);
          return { x: vp.x, y: vp.y };
        }
        virtualPositionCheck(virtualX,virtualY){//检查坐标否处于瓦图范围外
          let maxSize=this.options.zoom===parseInt(this.options.zoom)?
            this.callTileSize(this.tileSize,this.options.zoom)*Math.pow(2,this.options.zoom):
            this.callTileSize(this.tileSize,this.options.zoom)*Math.pow(2,parseInt(this.options.zoom)+1);
          return !(virtualX <= 0 || virtualY <= 0 || virtualX >= maxSize || virtualY >= maxSize);
        }
        screenToTile(mouseX,mouseY){//get (screen/Mouse) Position On Tile
          return{
            x:mouseX-this.view.offsetX,
            y:mouseY-this.view.offsetY
          }
        }
        mapLatToViewport(mx, my){
          const vx = mx + this.view.offsetX;
          const vy = my + this.view.offsetY;
          return { x: vx, y: vy };
        }
        tilesFilter(tails) {//过滤不需要加载的瓦图
          let news=[];
          let max=Math.pow(2, this.options.zoom);
          if (this.options.zoom !== Math.floor(this.options.zoom)) {
            max = Math.pow(2, Math.floor(this.options.zoom + 1));
          }
          for (let i = 0; i < tails.length; i++) {
            const e = tails[i];
            if (e.x >= 0 && e.y >= 0 && e.x < max && e.y < max) {
              news.push(e);
            }
          }
          return news;
        }
        latLngRotate(lat,lng) {//经纬度转化
          let latLimit = 85.0511287798066;
          lng = lng - Math.floor((lng + 180) / 360) * 360;
          return {lat,lng};
        }
        latLngCheck(lat,lng){//经纬度检查
          let latLimit = 85.0511287798066;
          lng = lng - Math.floor((lng + 180) / 360) * 360;
          return !(lat < (0 - latLimit) || lat > latLimit);
        }
        tileToLat(tileY,zoom){//瓦片位置虚拟位置转经纬度
          let n = Math.PI - 2 * Math.PI * tileY / Math.pow(2, zoom);
          return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
        }
        tileToLng(tileX,zoom){//瓦片位置虚拟位置转经纬度
          return (tileX / Math.pow(2, zoom) * 360 - 180);
        }
        lngToTileX(lon,z){//转化经度为瓦片x
          return ((lon+180)/360*Math.pow(2,z));
        }
        latToTileY(lat,z){//转化纬度为瓦片y
          let radian=lat*Math.PI/180;//将角度转化为弧度 lat * PI / 180
          return(
            (
              1-Math.log(
                Math.tan(radian)+ //计算纬度的正切
                1/Math.cos(radian) //计算纬度的反接余弦
              )//计算两者之和的对数
              /Math.PI//除以PI
           )
           /2*Math.pow(2,z)//除以2的指定缩放级别的幂
          );
        }
        callTileNumber(coordinate,tileSize,zoom){
          return Math.floor(coordinate/this.callTileSize(tileSize,zoom));
        }
        callTileSize(tileSize,zoomLevel){//根据不同缩放等级计算缩放后的瓦片尺寸
          let rtSize = tileSize;
          if (zoomLevel !== Math.floor(zoomLevel)) {
            rtSize = tileSize * Math.pow(2, zoomLevel - Math.floor(zoomLevel + 1));
          }
          return rtSize;
        }
        updateViewport(scrollX, scrollY, oldZ, newZ) {//计算鼠标滚轮缩放位置的虚拟位置并更新偏移(移动)
          const mousePos = this.screenToTile(scrollX, scrollY);
          const baseScale = Math.pow(2, newZ - oldZ);
          const newPos = { x: mousePos.x * baseScale, y: mousePos.y * baseScale };
          this.view.offsetX = scrollX - newPos.x;
          this.view.offsetY = scrollY - newPos.y;
        }
        optionCheck(baseMapOptions){//参数检查
          if(!this.QIR.isObject(baseMapOptions))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'defaultX'))return false;
          if(!this.QIR.isNumber(baseMapOptions.defaultX))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'defaultY'))return false;
          if(!this.QIR.isNumber(baseMapOptions.defaultY))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'resolutionX'))return false;
          if(!this.QIR.isNumber(baseMapOptions.resolutionX))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'resolutionY'))return false;
          if(!this.QIR.isNumber(baseMapOptions.resolutionY))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'maxZoom'))return false;
          if(!this.QIR.isNumber(baseMapOptions.maxZoom))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'minZoom'))return false;
          if(!this.QIR.isNumber(baseMapOptions.minZoom))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'defaultZoom'))return false;
          if(!this.QIR.isNumber(baseMapOptions.defaultZoom))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'scaling'))return false;
          if(!this.QIR.isNumber(baseMapOptions.scaling))return false;
          if(!this.QIR.hasProperty(baseMapOptions,'baseMapUrl'))return false;
        }
      },
      comprehensive:class comprehensive {//综合的一个连接服务端的通讯类
        constructor(url){
          this.url=url;
          this.isLink=false;
          this.isLogin=false;
          this.localId=-1;//元素创建后的本地虚拟id
          this.updateId=1;//提交给服务器的本次变更id前缀为"up"为提交变更,前缀为"re"为撤销变更
          this.localLayerId=1;//图层创建后的本地虚拟id
          this.deleteLayerId=-1;//图层创建后的本地虚拟id
          this.numberOfLoginAttempts=0;//登录成功次数
          this.numberOfLoginFailed=0;//登录失败次数
          this.reinitializeElement=0;//重新初始化元素
          this.reinitializeId=-1;//重新初始化元素id
          this.reinitializeSourcePoints=[];//初始化源
          this.reinitializeSourcePoint=null;//初始化源
          this.socket=undefined;//会话
          this.errors=[];//执行错误的指令返回数据
          this.errorsROnly=[];//只读的
          this.corrects=[];//执行正确的指令返回数据
          this.correctsROnly=[];//只读的
          this.messages=[];
          this.presence=[];
          this.selectElements=[];
          this.pickElements=[];
          this.publickey='';
          this.userData=null;
          this.mapData={points:[],lines:[],areas:[],curves:[]};
          this.mapLayerData=[];
          this.mapLayerOrder=[];
          this.config={};
          this.lastEdit='很久以前';
          this.updateCount=0;//对更新元素属性和节点的统计
          this.lastDeleteId=-1;
          this.otherA1=[];
          this.typeList=['broadcast','get_serverConfig','get_publickey','publickey','login','loginStatus','anonymousLogin','anonymousLoginStatus','get_userData','send_userData','get_mapData','send_mapData','get_presence','send_presence','get_activeData','send_activeData','send_error','send_correct','get_mapLayer','send_mapLayer'];//指令类型合集
          this.Instruct={//指令合集
            login(email,password) {//登录指令
              this.email=email || '';
              this.password=password || '';
              return {type:'login',data:{email:this.email,password:this.password}}
            },
            anonymousLogin(name){
              return {
                type:'anonymousLogin',
                data:{name}
              }
            },
            get_presence() {//获取在线用户数据
              return {type:'get_presence'}
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
            get_mapLayer(){//获取地图数据指令
              return {type:'get_mapLayer'}
            },
            get_serverConfig(){//获取服务器配置
              return {type:'get_serverConfig'}
            },
            get_activeData(){//获取活动的数据
              return {type:'get_activeData'}
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
            },
            broadcast_selectIngElement(data){
              return {type:'broadcast',class:'selectIngElement',data}
            },
            broadcast_selectEndElement(data){
              return {type:'broadcast',class:'selectEndElement',data}
            },
            broadcast_pickIngElement(data){
              return {type:'broadcast',class:'pickIngElement',data}
            },
            broadcast_pickEndElement(data){
              return {type:'broadcast',class:'pickEndElement',data}
            },
            broadcast_restoreElement(data){
              return {type:'broadcast',class:'restoreElement',data}
            },
            broadcast_updateLayerData(data){
              return {type:'broadcast',class:'updateLayerData',data}
            },
            broadcast_createGroupLayer(data){
              return {type:'broadcast',class:'createGroupLayer',data}
            },
            broadcast_deleteLayer(id){
              return {type:'broadcast',class:'deleteLayer',data:{id}}
            },
            broadcast_updateLayerOrder(passive,active,type){
              return {type:'broadcast',class:'updateLayerOrder',data:{passive,active,type}}
            },
            broadcast_deleteLayerAndMembers(id){
              return {type:'broadcast',class:'deleteLayerAndMembers',data:{id}}
            },
          };
          this.QIR={//检测间
            /**
             * 日志函数
             */
            onLog(text,type){
              function reset(){
                window.logConfig={
                  message:{code:-1,time:'',text:'',from:'',type:'',data:undefined}
                };
              }
              let lock=false;
              try{
                window.logConfig.message.code-=1;
                window.logConfig.message.text=text;
                window.logConfig.message.from='external:comprehensive';
                window.logConfig.message.type=type;
              }catch (e) {
                lock=true;
              }
              if(lock){
                reset();
              }
            },
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
              if(Exp.test(str)===false){
                this.onLog('请输入正确的16进制颜色格式例如#123456','warn');
                return false;
              }
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
                this.onLog('宽度为数字，范围为2~64','warn');
                return false;
              }else {
                if(number>64 || number<2){
                  this.onLog('宽度范围为2~64','warn');
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
                      if(details[i].key==''){
                        this.onLog('属性名不能为空','warn');
                        return false;
                      }
                      if(KeyExp.test(details[i].key)){//5检查key属性是否存在非法字符[key只能由汉字[a~Z][0~9]组成]，
                        this.onLog('列名错误，仅允许使用字母、数字、汉字、下划线','warn');
                        return false;
                      }
                      if(ValueExp.test(details[i].value)){
                        this.onLog('列值错误，不允许使用如下字符[]、{}、#、`、\'、\"、--、//、%%、/*','warn');
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
          this.otherA1.length=0;//2.清除他人的A1
          this.mapData.points.length=0;//3.清除地图数据
          this.mapData.lines.length=0;
          this.mapData.areas.length=0;
        }
        broadcastUpdateLayerData(data){//id,structure,members
          this.send(this.Instruct.broadcast_updateLayerData(data));
        }
        broadcastCreateGroupLayer(data){
          this.send(this.Instruct.broadcast_createGroupLayer(data));
        }
        broadcastDeleteLayer(id){
          this.send(this.Instruct.broadcast_deleteLayer(id));
        }
        broadcastDeleteLayerAndMembers(id){
          this.send(this.Instruct.broadcast_deleteLayerAndMembers(id));
        }
        broadcastUpdateLayerOrder(passiveId,activeId,type){
          this.send(this.Instruct.broadcast_updateLayerOrder(passiveId,activeId,type));
        }
        broadcastSelectIngElement(id){
          this.send(this.Instruct.broadcast_selectIngElement(id));
        }
        broadcastSelectEndElement(id){
          this.send(this.Instruct.broadcast_selectEndElement(id));
        }
        broadcastPickIngElement(id){
          this.send(this.Instruct.broadcast_pickIngElement(id));
        }
        broadcastPickEndElement(id){
          this.send(this.Instruct.broadcast_pickEndElement(id));
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
            sObj.updateId=data.updateId;
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
            console.log(e);
          }
        }
        broadcastUpdateElement(data,type){//广播更新某一要素
          try {
            if(!data.hasOwnProperty('updateId')){
              this.onLog('更新元素失败，缺失updateId','warn');
              return false;
            }
            if(type==='point' || type==='line' || type==='area' || type==='curve'){
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
                data.type=type;
                this.send(this.Instruct.broadcast_updateElement(data));//0.6广播
              }
            }else {
              this.onLog('更新元素失败，所更新的元素类型不支持:'+type,'warn');
              return false;
            }
          }catch (e) {

          }
        }
        broadcastDeleteElement(id){//广播删除某一要素
          this.send(this.Instruct.broadcast_deleteElement(id));
        }
        broadcastRestoreElement(id){//广播删除某一要素
          this.send(this.Instruct.broadcast_restoreElement(id));
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
              id:data.id,
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
              id:data.id,
              type:'point',
              points:[],
              point:null,
              color:'',
              width:2,
              childRelations:[],
              fatherRelation:'',
              childNodes:[],
              fatherNode:'',
              details:[],
              custom:null
            };
            basicStructure.points[0]=data.point;
            basicStructure.point=data.point;
            basicStructure.color=data.color;
            basicStructure.width=data.width || basicStructure.width;
            basicStructure.details=data.details || basicStructure.details;
            basicStructure.custom=data.custom || basicStructure.custom;
            this.send(this.Instruct.broadcast_point(basicStructure));
          }catch (e) {}
        }
        broadcastMyA1(x,y,color,name){//广播A1
          this.send(this.Instruct.broadcast_A1(x,y,color,name));
        }
        heartbeat(){//心跳
          setInterval(()=>{
            if(this.isLink===true){
              if(this.socket!==undefined){
                this.socket.send('');
              }
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
        clearPresence(){
          this.presence=[];
        }
        getPresence(){
          this.send(this.Instruct.get_presence());
        }
        getMapData(){//获取地图数据
          this.send(this.Instruct.get_mapData());
        }
        getMapLayer(){
          this.send(this.Instruct.get_mapLayer());
        }
        getServerConfig(){//获取服务器配置信息
          this.send(this.Instruct.get_serverConfig());
        }
        getActiveData(){//获取服务器配置信息
          this.send(this.Instruct.get_activeData());
        }
        getServerPublickey(){//获取服务器公钥
          this.send(this.Instruct.get_publickey());
        }
        login(email,password){//登录方法
          let pat=new RegExp('[^a-zA-Z0-9\_@.+/=-]');
          if(!pat.test(''+email+password)){
            this.send(this.Instruct.login(email,password));
          }else {
            this.onLog('邮箱及密码只能是字母、数字、下划线 @ . - ，','warn');
          }
        }
        anonymousLogin(name){
          let pat=/[^_A-Za-z0-9\u4e00-\u9fa5]/;
          if(!pat.test(''+name)){
            this.send(this.Instruct.anonymousLogin(name));
          }else {
            this.onLog('名称只能是字母、数字、下划线或汉字','warn');
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
        send(instructObj){//发送数据
          if(this.isLink){
            if(this.instructObjCheck(instructObj)){//1.数据检查
              let json=JSON.stringify(instructObj);
              this.socket.send(json);
            }
          }else {
            this.onLog('服务器连接中断','warn');
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
        onLog(text,type){
          function reset(){
            window.logConfig={
              message:{code:-1,time:'',text:'',from:'',type:'',data:undefined}
            };
          }
          let lock=false;
          try{
            window.logConfig.message.code-=1;
            window.logConfig.message.text=text;
            window.logConfig.message.from='external:comprehensive';
            window.logConfig.message.type=type;
          }catch (e) {
            lock=true;
          }
          if(lock){
            reset();
          }
        }
        onMessage(ev){//收到消息事件
          let jsonData=JSON.parse(ev.data);
          if(jsonData.type!==undefined){
          let nowType=jsonData.type;//处理数据
          switch (nowType){
            case 'send_presence':{
              this.presence=jsonData.data;
              break;
            }
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
            case 'anonymousLoginStatus':{//服务器发来匿名登录状态
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
            case 'send_activeData':{//活动的数据
              if(jsonData.data.length===0){
                return false;
              }
              let pickElements=[];
              let selectElements=[];
              for (let key in jsonData.data) {
                let eId=key.slice(1);
                let pickUser=jsonData.data[key]['pick'];
                let selectUser=jsonData.data[key]['select'];
                if(pickUser!==null){
                  pickElements.push({
                    id:parseInt(eId),
                    user:pickUser.name,
                    color:pickUser.color,
                  });
                }
                if(selectUser!==null){
                  selectElements.push({
                    id:parseInt(eId),
                    user:selectUser.name,
                    color:selectUser.color,
                  });
                }
              }
              this.selectElements=selectElements;
              this.pickElements=pickElements;
              break;
            }
            case 'send_mapData':{//服务器发来的地图数据
              for (let i=0;i<jsonData.data.length;i++){
                try{
                  let [Ps,Pt,basePs,basePt]=[null,null,null,null]//point相关
                  Pt=JSON.parse(window.atob(jsonData.data[i].point));
                  basePt=JSON.parse(window.atob(jsonData.data[i].point));
                  Ps=JSON.parse(window.atob(jsonData.data[i].points));
                  basePs=JSON.parse(window.atob(jsonData.data[i].points));
                  jsonData.data[i].points=Ps;
                  jsonData.data[i].basePoints=basePs;
                  jsonData.data[i].point=Pt;
                  jsonData.data[i].basePoint=basePt;
                  let [loc,baseD,Pu]=[true,null,null];//details
                  let [lock,base64,ref]=[true,null,null];//custom
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
                  try{
                    base64=window.atob(jsonData.data[i].custom);
                  }
                  catch(e){loc=false;}
                  try {
                    if(lock){
                      ref=JSON.parse(base64);
                    }
                  }catch(e){loc=false;}
                  if(lock){
                    jsonData.data[i].custom=ref;
                  }
                  let NowType=jsonData.data[i].type;//分组
                  jsonData.data[i].id=parseInt(jsonData.data[i].id);//hack
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
            case 'send_mapLayer':{
              try{
                let res=[];
                let ord=[];
                let layerNumber=jsonData.data.length;
                for(let i=0;i<layerNumber;i++){
                  if(jsonData.data[i].type==='order'){
                    ord=JSON.parse(jsonData.data[i].members);
                  }else {
                    jsonData.data[i].id=parseInt(jsonData.data[i].id);//hack
                    jsonData.data[i].members=JSON.parse(window.atob(jsonData.data[i].members));
                    jsonData.data[i].structure=JSON.parse(window.atob(jsonData.data[i].structure))
                    res.push(jsonData.data[i]);
                  }
                }
                this.mapLayerData=res;
                this.mapLayerOrder=ord;
              }catch (e) {
                console.log(e);
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
                    let [lock,baseA,baseB,Ps,Pt,basePs,basePt]=[true,null,null,null,null,null,null]
                    try{
                      baseA=window.atob(jsonData.data.points);//将base64转化为普通字符
                      baseB=window.atob(jsonData.data.point);
                    }
                    catch(e){lock=false;}
                    try{
                      if(lock){
                        Ps=JSON.parse(baseA);
                        Pt=JSON.parse(baseB);
                        basePs=JSON.parse(baseA);
                        basePt=JSON.parse(baseB);
                      }
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                      jsonData.data.basePoints=basePs;
                      jsonData.data.basePoint=basePt;
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
                  jsonData.data.id=parseInt(jsonData.data.id);//hack
                  let NewMessageObj={'type':'broadcast','class':'line','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);//更新messages
                  this.mapData.lines.push(jsonData.data);//添加到mapData
                  this.lastEdit=jsonData.time;
                  break;
                }
                case 'area':{//新增线段数据广播
                  try{//解析坐标
                    let [lock,baseA,baseB,Ps,Pt,basePs,basePt]=[true,null,null,null,null,null,null]
                    try{
                      baseA=window.atob(jsonData.data.points);
                      baseB=window.atob(jsonData.data.point);
                    }
                    catch(e){lock=false;}
                    try{
                      if(lock){
                        Ps=JSON.parse(baseA);
                        Pt=JSON.parse(baseB);
                        basePs=JSON.parse(baseA);
                        basePt=JSON.parse(baseB);
                      }
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                      jsonData.data.basePoints=basePs;
                      jsonData.data.basePoint=basePt;
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
                  jsonData.data.id=parseInt(jsonData.data.id);//hack
                  let NewMessageObj={'type':'broadcast','class':'area','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);//更新messages
                  this.mapData.areas.push(jsonData.data);//添加到mapData
                  this.lastEdit=jsonData.time;
                  break;
                }
                case 'point':{//新增点数据广播
                  try{//解析坐标
                    let [lock,baseA,baseB,Ps,Pt,basePs,basePt]=[true,null,null,null,null,null,null]
                    try{
                      baseA=window.atob(jsonData.data.points);
                      baseB=window.atob(jsonData.data.point);
                    }
                    catch(e){lock=false;}
                    try{
                      if(lock){
                        Ps=JSON.parse(baseA);
                        Pt=JSON.parse(baseB);
                        basePs=JSON.parse(baseA);
                        basePt=JSON.parse(baseB);
                      }
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                      jsonData.data.basePoints=basePs;
                      jsonData.data.basePoint=basePt;
                    }
                  }catch(e){}
                  try{//details解析
                    let [lock,baseA,Ps]=[true,null,null];
                    let [lockCustom,baseCustom,ref]=[true,null,null];
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
                    try{
                      baseCustom=window.atob(jsonData.data.custom);
                    }
                    catch(e){lockCustom=false;}
                    try {
                      if(lockCustom){
                        ref=JSON.parse(baseCustom);
                      }
                    }catch(e){lockCustom=false;}
                    if(lockCustom){
                      jsonData.data.custom=ref;
                    }
                  }catch(e){}
                  jsonData.data.id=parseInt(jsonData.data.id);//hack
                  let NewMessageObj={'type':'broadcast','class':'point','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);
                  this.mapData.points.push(jsonData.data);
                  this.lastEdit=jsonData.time;
                  break;
                }
                case 'deleteElement':{//删除某一元素的广播
                  try{
                    let find=false;
                    let ID=parseInt(jsonData.data.id);//hack
                    if(isNaN(ID)){return false;}
                    this.mapData.points.some((item, index)=>{//查找并删除该id
                      if (item.id==ID){
                        this.mapData.points.splice(index,1);
                        find=true;
                        return true;
                      }
                    });
                    if(!find){
                      this.mapData.lines.some((item, index)=>{
                        if (item.id==ID){
                          this.mapData.lines.splice(index,1);
                          find=true;
                          return true;
                        }
                      });
                    }
                    if(!find){
                      this.mapData.areas.some((item, index)=>{
                        if (item.id==ID){
                          this.mapData.areas.splice(index,1);
                          find=true;
                          return true;
                        }
                      });
                    }
                    if(find){
                      this.messages.push(jsonData);//更新消息
                      this.lastEdit=jsonData.time;
                      this.lastDeleteId=ID;
                    }
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
                    if(jsonData.data.hasOwnProperty('custom')){//解码details如果有的话
                      jsonData.data.custom=JSON.parse(window.atob(jsonData.data.custom));
                    }
                    let eType=undefined;
                    if(jsonData.data.hasOwnProperty('type')){
                      eType=jsonData.data.type+'s';
                    }
                    let found=false;
                    let eId=parseInt(jsonData.data.id);//hack
                    if(!isNaN(eId) && eType!==undefined){
                      const Len=this.mapData[eType].length;
                      for (let i=0;i<Len;i++){//查找相应的地图数据并修改地图数据
                        if(eId===this.mapData[eType][i].id){
                          Object.assign(this.mapData[eType][i],jsonData.data);
                          this.messages.push(jsonData);//更新message
                          this.lastEdit=jsonData.time;
                          this.updateCount++;
                          found=true;
                          break;
                        }
                      }
                    }
                    if(!found){
                      this.onLog('存在未同步的元素,建议刷新页面ID:'+eId,'warn');
                    }
                  }catch (e) {
                    this.onLog('存在未同步的元素,建议刷新页面ID:'+jsonData.data.id,'warn');
                  }
                  break;
                }
                case 'updateElementNode':{//更新某一元素的节点的广播
                  try{//解析
                    let pointsObj=JSON.parse(window.atob(jsonData.data.points));
                    let basePointsObj=JSON.parse(window.atob(jsonData.data.points));
                    let [pointObj,basePointObj]=[null,null];
                    if(this.QIR.hasProperty(jsonData.data,'point')){
                      pointObj=JSON.parse(window.atob(jsonData.data.point));
                      basePointObj=JSON.parse(window.atob(jsonData.data.point));
                    }
                    let CgID=parseInt(jsonData.data.id);//hack
                    let type=null;//查找type类型
                    if(this.QIR.hasProperty(jsonData.data,'type')){
                      type=jsonData.data.type+'s';
                    }
                    if(type!==null){//如果有type类型的话则按照type类型查找
                      let length=this.mapData[type].length;
                      for(let k=0;k<length;k++){
                        if(this.mapData[type][k].id===CgID){
                          let copyObj={};
                          Object.assign(copyObj,this.mapData[type][k]);
                          copyObj.points=pointsObj;
                          copyObj.basePoints=basePointsObj;
                          if(pointObj!==null){
                            copyObj.point=pointObj;
                            copyObj.basePoint=basePointObj;
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
                      this.lastEdit=jsonData.time;
                      this.updateCount++;
                    }else{
                      this.onLog('存在未同步的元素,建议刷新页面ID:'+CgID,'warn');
                    }
                    break;
                  }catch (e) {
                    this.onLog('存在未同步的元素,建议刷新页面ID:'+jsonData.data.id,'warn');
                  }
                  break;
                }
                case 'selectIngElement':{
                  let obj={
                    id:jsonData.data.id,
                    user:jsonData.conveyor,
                    color:jsonData.data.color,
                  };
                  this.selectElements.push(obj);
                  break;
                }
                case 'selectEndElement':{
                  for(let i=0;i<this.selectElements.length;i++){
                    if(this.selectElements[i].id===jsonData.data){
                      this.selectElements.splice(i,1);
                      break;
                    }
                  }
                  break;
                }
                case 'pickIngElement':{
                  let obj={
                    id:jsonData.data.id,
                    user:jsonData.conveyor,
                    color:jsonData.data.color,
                  };
                  this.pickElements.push(obj);
                  break;
                }
                case 'pickEndElement':{
                  for(let i=0;i<this.pickElements.length;i++){
                    if(this.pickElements[i].id===jsonData.data){
                      this.pickElements.splice(i,1);
                      break;
                    }
                  }
                  break;
                }
                case 'logIn':{
                  for(let i=0;i<this.presence.length;i++){//判断是否重复
                    if(this.presence[i].userEmail===jsonData.data.userEmail){
                      return false;
                    }
                  }
                  this.presence.push(jsonData.data);
                  break;
                }
                case 'logOut':{
                  for(let i=0;i<this.presence.length;i++){
                    if(this.presence[i].userEmail===jsonData.data.email){
                      this.presence.splice(i,1);
                      break;
                    }
                  }
                  break;
                }
                case 'createGroupLayer':{
                  if(this.QIR.hasProperty(jsonData,'data')){
                    if(this.QIR.hasProperty(jsonData.data,'id') &&
                      this.QIR.hasProperty(jsonData.data,'type') &&
                      this.QIR.hasProperty(jsonData.data,'members') &&
                      this.QIR.hasProperty(jsonData.data,'structure')
                    ){
                      let newMembers=JSON.parse(window.atob(jsonData.data.members));
                      let newStructure=JSON.parse(window.atob(jsonData.data.structure));
                      jsonData.data.id=parseInt(jsonData.data.id);//hack
                      this.mapLayerData.push({
                        id:jsonData.data.id,
                        type:jsonData.data.type,
                        members:newMembers,
                        structure:newStructure,
                      });
                    }
                  }
                  break;
                }
                case 'deleteLayer':{
                  for(let i=0;i<this.mapLayerData.length;i++){
                    if(this.mapLayerData[i].id==jsonData.data.id){
                      this.mapLayerData.splice(i,1);
                      this.deleteLayerId=jsonData.data.id;
                    }
                  }
                  break;
                }
                case 'deleteLayerAndMembers':{
                  for(let i=0;i<this.mapLayerData.length;i++){
                    if(this.mapLayerData[i].id==jsonData.data.id){
                      this.mapLayerData.splice(i,1);
                      this.deleteLayerId=jsonData.data.id;
                    }
                  }
                  let changeCount=0;
                  let changePoint=false;
                  let changeLine=false;
                  let changeArea=false;
                  for(let key in jsonData.data.members){
                    if(changeCount===3){
                      break;
                    }
                    if     (jsonData.data.members[key]===1){
                      if(changePoint===false){
                        changePoint=true;
                        changeCount+=1;
                      }
                    }
                    else if(jsonData.data.members[key]===2){
                      if(changeLine===false){
                        changeLine=true;
                        changeCount+=1;
                      }
                    }
                    else if(jsonData.data.members[key]===3){
                      if(changeArea===false){
                        changeArea=true;
                        changeCount+=1;
                      }
                    }
                  }
                  if(changePoint){
                    let newPoints=this.mapData.points.filter(
                      (element)=>{
                        return !jsonData.data.members.hasOwnProperty(element.id)
                      });
                    this.mapData.points.length=0;
                    this.mapData.points.push(...newPoints);
                  }
                  if(changeLine){
                    let newLines=this.mapData.lines.filter(
                      (element)=>{
                        return !jsonData.data.members.hasOwnProperty(element.id)
                      });
                    this.mapData.lines.length=0;
                    this.mapData.lines.push(...newLines);
                  }
                  if(changeArea){
                    let newAreas=this.mapData.areas.filter(
                      (element)=>{
                        return !jsonData.data.members.hasOwnProperty(element.id)
                      });
                    this.mapData.areas.length=0;
                    this.mapData.areas.push(...newAreas);
                  }
                  break;
                }
                case 'updateLayerData':{
                  if(this.QIR.hasProperty(jsonData,'data')){
                  if(this.QIR.hasProperty(jsonData.data,'id')){
                    let ID=jsonData.data.id;
                    let newMembers=undefined;
                    if(this.QIR.hasProperty(jsonData.data,'members')){
                      newMembers=JSON.parse(window.atob(jsonData.data.members))
                    }
                    let newStructure=undefined;
                    if(this.QIR.hasProperty(jsonData.data,'structure')){
                      newStructure=JSON.parse(window.atob(jsonData.data.structure))
                    }
                    for(let i=0;i<this.mapLayerData.length;i++){
                      if(ID==this.mapLayerData[i].id){
                        if(newMembers!==undefined){
                          this.mapLayerData[i].members=newMembers;
                        }
                        if(newStructure!==undefined){
                          this.mapLayerData[i].structure=newStructure;
                        }
                      }
                    }
                  }
                  }
                  break;
                }
                case 'updateLayerOrder':{
                  this.mapLayerOrder=JSON.parse(jsonData.data.members);
                  break;
                }
              }
              break;
            }
            case 'send_error':{
              this.errors.push(jsonData);
              this.errorsROnly.push(jsonData);
              break;
            }
            case 'send_correct':{
              this.corrects.push(jsonData);
              this.correctsROnly.push(jsonData);
              break;
            }
            default:{
            }
          }
          }
        }
        onClose(ev){//断开连接事件
          this.isLink=false;
          this.onLog('服务器连接中断','warn');
          return true;
        }
        onError(ev){//连接失败事件
          this.isLink=false;
          this.onLog('服务器连接失败','warn');
          return true;
        }
        onOpen(ev){//连接成功事件
          this.isLink=true;
          this.onLog('服务器连接成功','tip');
          this.getServerPublickey();//获取公钥
          this.getServerConfig();//获取服务器配置
          return true;
        }
      },
      mixCanvas:class mixCanvas{//混合地图数据渲染类
        $configs={//$开头的为私有属性，请通过内部函数修改私有属性
          pipelineHealthy:true,
          renderRangeX:1,
          renderRangeY:1,
          renderView:{
            x1:0,
            x2:0,
            y1:0,
            y2:0,
          },
          offsetX:0,
          offsetY:0,
        };
        $manage={
          optionsRule:{//传入options包含的项目及项目的类型\如果required为false则必须包含一个默认值
            viewWidth:{//可视宽度
              type:'int',
              required:true,
            },
            viewHeight:{
              type:'int',
              required:true,
            },
            mapHiddenElements:{//被主动隐藏的要素
              type:'map',
              required:false,
              default:new Map(),
            },
            mapEjectElements:{//临时弹出不显示的要素
              type:'map',
              required:false,
              default:new Map(),
            },
            renderRangeX:{
              type:'percentage',
              required:false,
              default:'100%',
            },
            renderRangeY:{
              type:'percentage',
              required:false,
              default:'100%',
            }
          },
          colorLinks:{//the mapping relationship between color blocks and elements.example'000001':{id:54,type:'point'}

          },
        };
        $dom=null;
        $canvas=null;
        $cBlock=null;
        $cBlockDom=null;
        constructor(pipeline){
          this.pipeline=pipeline;//管线允许外部自由修改
          this.startSetting();
        }
        QIR(type,data){
          switch (type) {
            /**
             typeCheck data:{
              value:any,
              correct:'type string'
             }
             return true/false
             true:normal
            **/
            case 'tc':{
              const Type=data.correct;
              const Value=data.value;
              switch (Type) {
                case 'int':{
                  return Number.isInteger(Value);
                }
                case 'float':{
                  return typeof Value === 'number' && !Number.isInteger(Value);
                }
                case 'percentage':{
                  const regex = /^(100(\.00?)?%|\d{1,3}(\.\d{1,2})?)%$/;
                  return regex.test(Value);
                }
                case 'string':{
                  return typeof Value === 'string';
                }
                case 'boolean':{
                  return typeof Value === 'boolean';
                }
                case 'object':{
                  return Value !== null && typeof Value === 'object' && !Array.isArray(Value);
                }
                case 'map':{
                  return Object.prototype.toString.call(Value) === '[object Map]';
                }
                case 'array':{
                  return Array.isArray(Value);
                }
              }
              break;
            }
          }
        }
        startSetting(){
          this.pipelineCheck();
          this.canvasBuild();
          this.mixSetRenderRange();
          this.mixDraw();
        }
        /**
         RenderRangeCheck data:element
         return true/false
         true:normal
         **/
        renderRangeCheck(data){
          let [gap,num,out]=[0,0,0];
          let node=data.points.length;
          if(node<=5){
           gap=1;
          }else if(node>5 && node<=25){
           gap=2;
          }else if(node>25 && node<=50){
           gap=4;
          }else if(node>50 && node<=100){
           gap=8;
          }else if(node>100){
           gap=16;
          }
          const renderView=this.$configs.renderView;
          for(let i=0;i<node;i+=gap){
            num++;
            if(
              data.points[i].y > renderView.y2 ||
              data.points[i].y < renderView.y1 ||
              data.points[i].x < renderView.x1 ||
              data.points[i].x > renderView.x2
            )
            {
              out++;
            }
          }
          return num !== out;
        }
        /**mixWatcher
         * 内部监听器，若外部有监听则内部不要再次监听
         * target：object，被监听的对象
         * operate：对象发生改变时的处理函数
         *     operate(newValue,oldValue,property);
         *     newValue：新的值
         *     oldValue：旧的值
         *     property：被修改的属性名
         * 返回值：
         *    返回一个Proxy对象
         * 示例：监听offsetX，实现视图移动
         * this.$configs=this.mixWatcher(this.$configs,(newValue,oldValue,property)=>{
         *   if(property==='offsetX'){
         *     this.mixWash();this.mixDraw();
         *   }
         * })
        **/
        mixWatcher(target,operate){
          const handler={
            set(target,property,value) {
              let oldValue=target[property];
              if (typeof value==='object') {
                value=new Proxy(value,handler);
              }
              operate(value,oldValue,property);
              target[property]=value;
              return true;
            }
          };
          for (let key in target) {
            if(target.hasOwnProperty(key)){
              if (typeof target[key] === 'object') {
                target[key]=new Proxy(target[key],handler);
              }
            }
          }
          return new Proxy(target, handler);
        }

        /**
         *need check pipeline healthy
        **/

        mixWash(){//清洗canvas和colorBlock
          if(!this.$configs.pipelineHealthy){return false;}
          this.$canvas.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);
          this.$cBlock.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);
          this.$manage.colorLinks={};
        }
        mixDraw(){//绘制元素并同时绘制色块并建立色块与元素的映射关系
          if(this.$configs.renderRangeX<=0 || this.$configs.renderRangeY<=0){//当渲染范围为小于等于0时任何都不渲染
            return false;
          }
          if(!this.$configs.pipelineHealthy){return false;}
          let pLen=this.pipeline.elements.points.length;
          let lLen=this.pipeline.elements.lines.length;
          let aLen=this.pipeline.elements.areas.length;
          let cBlockNum=2;
          function transform(number) {
            return number.toString(16).padStart(6,'0');
          }
          for(let i=0;i<aLen;i++){//先后渲染顺序区域->线段->点
            if(!this.renderRangeCheck(this.pipeline.elements.areas[i])){
              continue;
            }
            if(this.pipeline.options.mapHiddenElements.has(this.pipeline.elements.areas[i].id)){
              continue;
            }
            if(this.pipeline.options.mapEjectElements.has(this.pipeline.elements.areas[i].id)){
              continue;
            }
            let colorBlock=transform(cBlockNum);
            this.addArea(this.pipeline.elements.areas[i],colorBlock);
            this.addColorLinks(this.pipeline.elements.areas[i],colorBlock);
            cBlockNum+=4;
          }
          for(let i=0;i<lLen;i++){
            if(!this.renderRangeCheck(this.pipeline.elements.lines[i])){
              continue;
            }
            if(this.pipeline.elements.lines[i].points===undefined){
              continue;
            }
            if(this.pipeline.options.mapHiddenElements.has(this.pipeline.elements.lines[i].id)){
              continue;
            }
            if(this.pipeline.options.mapEjectElements.has(this.pipeline.elements.lines[i].id)){
              continue;
            }
            let colorBlock=transform(cBlockNum);
            this.addLine(this.pipeline.elements.lines[i],colorBlock);
            this.addColorLinks(this.pipeline.elements.lines[i],colorBlock);
            cBlockNum+=4;
          }
          for(let i=0;i<pLen;i++){
            /**
             *渲染前过滤
            **/
            if(!this.renderRangeCheck(this.pipeline.elements.points[i])){
              continue;
            }
            if(this.pipeline.elements.points[i].points===undefined){
              continue;
            }
            if(this.pipeline.options.mapHiddenElements.has(this.pipeline.elements.points[i].id)){
              continue;
            }
            if(this.pipeline.options.mapEjectElements.has(this.pipeline.elements.points[i].id)){
              continue;
            }
            /**
             *渲染前过滤结束
             **/
            let colorBlock=transform(cBlockNum);
            this.addPoint(this.pipeline.elements.points[i],colorBlock);
            this.addColorLinks(this.pipeline.elements.points[i],colorBlock);
            cBlockNum+=4;
          }
        }
        mixReSize(){
          if(!this.$configs.pipelineHealthy){return false;}
          this.$dom.setAttribute('width',this.pipeline.options.viewWidth+'px');
          this.$dom.setAttribute('height',this.pipeline.options.viewHeight+'px');
          this.$cBlockDom.setAttribute('width',this.pipeline.options.viewWidth+'px');
          this.$cBlockDom.setAttribute('height',this.pipeline.options.viewHeight+'px');
        }
        mixOffset(x,y){
          if(!this.$configs.pipelineHealthy){return false;}
          this.$configs.offsetX=x;
          this.$configs.offsetY=y;
        }
        mixSetRenderRange(){//设置渲染范围
          if(!this.$configs.pipelineHealthy){return false;}
          let x=parseFloat(this.pipeline.options.renderRangeX) / 100;
          let y=parseFloat(this.pipeline.options.renderRangeY) / 100;
          if(!isNaN(x) && !isNaN(y)){
            this.$configs.renderRangeX=x;
            this.$configs.renderRangeY=y;
            this.$configs.renderView.x1=((1-this.$configs.renderRangeX)*window.innerWidth)/2;//x1为渲染边界最左侧
            this.$configs.renderView.x2=this.$configs.renderView.x1+(this.$configs.renderRangeX*window.innerWidth);
            this.$configs.renderView.y1=((1-this.$configs.renderRangeY)*window.innerHeight)/2;//y1为渲染边界最上侧
            this.$configs.renderView.y2=this.$configs.renderView.y1+(this.$configs.renderRangeY*window.innerHeight);
          }else {
            this.throwError('Error in rendering range parameters')
          }
        }
        mixGetElementByXY(x,y){//获取坐标下的元素数据
          if(!this.$configs.pipelineHealthy){return false;}
          function rgbToHex(r,g,b){//rgb转化为6 16格式 未填充
            return ((r<<16)|(g<<8)|b).toString(16);
          }
          const pixelData=this.$cBlock.getImageData(x,y,1,1).data;
          const color=("000000"+rgbToHex(pixelData[0],pixelData[1],pixelData[2])).slice(-6);
          if(this.$manage.colorLinks.hasOwnProperty(color)){
            return this.$manage.colorLinks[color];
          }else {
            return false;
          }
        }
        canvasBuild(){//创建基本canvas与虚拟canvas
          if(!this.$configs.pipelineHealthy){return false;}
          this.$dom=document.getElementById(this.pipeline.el);
          this.$dom.setAttribute('width',this.pipeline.options.viewWidth+'px');
          this.$dom.setAttribute('height',this.pipeline.options.viewHeight+'px');
          this.$canvas=this.$dom.getContext('2d');

          this.$cBlockDom=document.createElement('CANVAS');
          this.$cBlockDom.setAttribute('width',this.pipeline.options.viewWidth+'px');
          this.$cBlockDom.setAttribute('height',this.pipeline.options.viewHeight+'px');
          this.$cBlock=this.$cBlockDom.getContext('2d');
        }

        /**
         *no check pipeline healthy
        **/
        addPoint(element,colorBlock){//添加点，需要完整的元素数据和色块
          this.$canvas.beginPath();//normal canvas
          this.$canvas.fillStyle='#'+element.color;
          this.$canvas.arc(element.point.x+this.$configs.offsetX,element.point.y+this.$configs.offsetY,element.width,0,Math.PI*2);
          this.$canvas.fill();

          this.$cBlock.beginPath();//color block canvas
          this.$cBlock.fillStyle='#'+colorBlock;
          this.$cBlock.arc(element.point.x+this.$configs.offsetX,element.point.y+this.$configs.offsetY,element.width,0,Math.PI*2);
          this.$cBlock.fill();
        }
        addLine(element,colorBlock){//添加线，需要完整的元素数据和色块
          let Len=element.points.length;
          this.$canvas.beginPath();//normal canvas
          this.$canvas.moveTo(element.points[0].x+this.$configs.offsetX, element.points[0].y+this.$configs.offsetY);
          for(let i=1;i<Len;i++) {
            this.$canvas.lineTo(element.points[i].x + this.$configs.offsetX, element.points[i].y + this.$configs.offsetY);
          }
          this.$canvas.lineWidth=element.width;
          this.$canvas.strokeStyle='#'+element.color;
          this.$canvas.lineJoin='round';
          this.$canvas.stroke();

          this.$cBlock.beginPath();//color block canvas
          this.$cBlock.moveTo(element.points[0].x+this.$configs.offsetX, element.points[0].y+this.$configs.offsetY);
          for(let i=1;i<Len;i++) {
            this.$cBlock.lineTo(element.points[i].x + this.$configs.offsetX, element.points[i].y + this.$configs.offsetY);
          }
          this.$cBlock.lineWidth=element.width;
          this.$cBlock.strokeStyle='#'+colorBlock;
          this.$cBlock.lineJoin='round';
          this.$cBlock.stroke();
        }
        addArea(element,colorBlock){//添加区域，需要完整的元素数据和色块
          this.$canvas.beginPath();//normal canvas
          let Len=element.points.length;
          this.$canvas.moveTo(element.points[0].x+this.$configs.offsetX, element.points[0].y+this.$configs.offsetY);
          for(let i=1;i<Len;i++){
            this.$canvas.lineTo(element.points[i].x+this.$configs.offsetX, element.points[i].y+this.$configs.offsetY);
          }
          this.$canvas.closePath();
          this.$canvas.fillStyle='#'+element.color+'80';
          this.$canvas.fill();

          this.$cBlock.beginPath();//color block canvas
          this.$cBlock.moveTo(element.points[0].x+this.$configs.offsetX, element.points[0].y+this.$configs.offsetY);
          for(let i=1;i<Len;i++){
            this.$cBlock.lineTo(element.points[i].x+this.$configs.offsetX, element.points[i].y+this.$configs.offsetY);
          }
          this.$cBlock.closePath();
          this.$cBlock.fillStyle='#'+colorBlock;
          this.$cBlock.fill();
        }
        addColorLinks(element,colorBlock){//添加色块->元素链接
          if(!this.$manage.colorLinks.hasOwnProperty(colorBlock)){
            this.$manage.colorLinks[colorBlock]=element;
          }
        }
        throwError(message){
          this.mixLog(message,'warn');
        }
        pipelineCheck(){
          if(this.QIR('tc',{value:this.pipeline,correct:'object'})){
            if(!this.pipeline.hasOwnProperty('el')){
              this.throwError('Missing attribute: el');
              this.pipelineClose();return false;
            }
            if(!this.QIR('tc',{value:this.pipeline.el,correct:'string'})){
              this.throwError('Property should be an string: el');
              this.pipelineClose();return false;
            }
            if(!this.pipeline.hasOwnProperty('options')){
              this.throwError('Missing attribute: options');
              this.pipelineClose();return false;
            }
            if(!this.QIR('tc',{value:this.pipeline.options,correct:'object'})){
              this.throwError('Property should be an object: options');
              this.pipelineClose();return false;
            }
            Object.keys(this.$manage.optionsRule).forEach(//检测选项是否正确
              (key)=>{
                if(this.$manage.optionsRule[key].required){//是否为必须项
                  if(!this.pipeline.options.hasOwnProperty(key)){//不包含必须项
                    this.throwError(`option error:missing ${key}`);
                    this.pipelineClose();
                    return false;
                  }else {//检查类型
                    if(!this.QIR('tc',{
                      value:this.pipeline.options[key],
                      correct:this.$manage.optionsRule[key].type,
                    })){//类型错误
                      this.throwError(`option type error:${key} need ${this.$manage.optionsRule[key].type}`);
                      this.pipelineClose();
                      return false;
                    }
                  }
                }else{
                  if(!this.pipeline.options.hasOwnProperty(key)){
                    this.pipeline.options[key]=this.$manage.optionsRule[key].default;
                  }else {//检查类型
                    if(!this.QIR('tc',{
                      value:this.pipeline.options[key],
                      correct:this.$manage.optionsRule[key].type,
                    })){//类型错误
                      this.throwError(`option type error:${key} need ${this.$manage.optionsRule[key].type}`);
                      this.pipelineClose();
                      return false;
                    }
                  }
                }
              }
            );

            if(!this.pipeline.hasOwnProperty('elements')){
              this.throwError('Missing attribute: elements');
              this.pipelineClose();return false;
            }
            if(!this.QIR('tc',{value:this.pipeline.elements,correct:'object'})){
              this.throwError('Property should be an object: elements');
              this.pipelineClose();return false;
            }
            if(!this.pipeline.elements.hasOwnProperty('points')){
              this.throwError('Missing attribute: points');
              this.pipelineClose();return false;
            }
            if(!this.pipeline.elements.hasOwnProperty('lines')){
              this.throwError('Missing attribute: lines');
              this.pipelineClose();return false;
            }
            if(!this.pipeline.elements.hasOwnProperty('areas')){
              this.throwError('Missing attribute: areas');
              this.pipelineClose();return false;
            }
            if(!this.QIR('tc',{value:this.pipeline.elements.points,correct:'array'})){
              this.throwError('Property should be an array: points');
              this.pipelineClose();return false;
            }
            if(!this.QIR('tc',{value:this.pipeline.elements.lines,correct:'array'})){
              this.throwError('Property should be an array: lines');
              this.pipelineClose();return false;
            }
            if(!this.QIR('tc',{value:this.pipeline.elements.areas,correct:'array'})){
              this.throwError('Property should be an array: areas');
              this.pipelineClose();return false;
            }
          }
          else {
            this.pipelineClose();
          }
        }
        pipelineClose(){
          this.$configs.pipelineHealthy=false;
        }
        pipelineOpen(){
          this.$configs.pipelineHealthy=true;
        }
        mixLog(text,type){
          function reset(){
            window.logConfig={
              message:{code:-1,time:'',text:'',from:'',type:'',data:undefined}
            };
          }
          let lock=false;
          try{
            window.logConfig.message.code-=1;
            window.logConfig.message.text=text;
            window.logConfig.message.from='external:comprehensive';
            window.logConfig.message.type=type;
          }catch (e) {
            lock=true;
          }
          if(lock){
            reset();
          }
        }
      }
    },
    /**
     * 命令的缓存,各组件根据需求监听这里的数据变化，也可以监听整个commits
     * 命令是用于个体组件与外界进行通讯的手段之一，请在mutations、actions注册相关功能
    **/
    commits:{
      disableMove:false,
      disableZoomAndMove:false,
      createTestLine:false,
      openF4DebugBord:false,
      openDetailsPanel:false,
      reloadAccounts:false,
      reloadServers:false,
      addNewPointEnd:false,
      previewLine:false,
      addNewLineEnd:false,
      addNewAreaEnd:false,
      allReinitialize:false,
      suppressPickSelect:false,
    },
    /**
     * Config:可读可写 read write
     * Data:可读 read
    **/
    toolboxConfig:{
      position:{
        x:null,
        y:null,
      },
      showPanel:false,
    },
    effectsConfig:{
      svgFlicker:{
        svgType:null,
        svgData:null,
        duration:1000,
        changeCode:1,
      }
    },
    logConfig:{
      message:{
        code:1,
        time:'',
        text:'',
        from:'',//from:'[internal:name ] | [external:name]'
        type:'',//warn | error
        data:undefined,//异常处理数据
      },
      showPanel:false,
    },
    mapConfig:{//地图配置
      layer:0,
      oldLayer:null,
      zoomAdd:1,//k
      zoomSub:-1/(1+1),//-k/(1+k)
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
      movingDistance:{
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
      mousePoint:{//鼠标位置
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
      svgMouseRUp:{
        x:0,
        y:0
      },
      svgMouseRDown:{
        x:0,
        y:0
      },
      clearClick:{
        x:0,
        y:0
      },
      mouseWheelPos:{
        x:0,
        y:0
      },
      mouseClickLatLng:{
        x:null,
        y:null
      },
      operated:{//元素被右键选择
        id:-1,//被操作元素id
        data:null//被操作元素的元素数据
      },
      cursor:'default',//SVG鼠标指针类型
      cursorLock:false,//指针类型的锁止
      reinitializeId:-1,//重新初始化的id
      inputFocusStatus:false//input聚焦状态
    },
    pageConfig:{//页面配置
      homeSeparateState:true,
      mapSeparateState:false
    },
    cameraConfig:{//相机配置
      windowChange:false,//窗口变化
      doNeedMoveMap:false,//是否需要移动地图
      frameTime:16,//帧时间
      maxZoom:5,//最大缩放
      minZoom:-10,//最小缩放
      unit1X:1,//横轴单位1
      unit1Y:1,//纵轴单位1
      offsetX:0,//x偏移补偿
      offsetY:0,//y偏移补偿
      wheelInterval:50,//每次缩放间隔
      zoomIng:false,//缩放中否
      mixCanvasFlash:false,//mixCanvas的刷新
      pauseInitialSvgId:-1,//暂停解析svg的id
    },
    monitorConfig:{
      fps:0,
    },
    baseMapConfig:{//底图配置
      enableBaseMap:false,
      baseMapType:'unknown',
      baseMap:null,
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
        inertia:false,
        scaling:null
      },
      baseLayer:'',
    },
    recorderConfig:{
      lastUploadId:-1,
      lastUploadClass:null,
      lastDeleteId:-1,
      initialIntent:[

      ],
      reachIntent:[

      ],
      failIntent:[

      ]
    },
    userRouteConfig:{
      routes:[],
      use:null,//若无use则更改为null
    },
    userSettingConfig:{//用户设置
      openFpsMonitor:false,//fps监控开启
      openElementPanel:false,//是否开启元素面板
      openStepRecorder:false,//步骤记录器
      mouseSamplingRate:'medium',//调整移动采样率
      closeDefaultLayer:false,//默认关闭默认图层
      mixVisibleRange:'medium',
      autoGetRoute:false,//自动获取路由表
      enableSSL:false,//路由拉取时启用加密传输
      defaultAccountLogin:false,//自动使用默认账号登录
    },
    detailsPanelConfig:{//左侧元素信息面板显示的数据
      data:{

      },
      sourcePoint:{
        x:null,
        y:null
      },
      target:-1,
      targetNode:null,
    },
    elementPanelConfig:{
      hiddenElements:[],
    },
    operationBoardConfig:{//元素右键操作面板的配置
      posX:null,
      posY:null,
      display:false
    },
    serverData:{//仅读
      socket:undefined,
      underlay:undefined,//2.底图背景数据
      userName:'点击头像登录',
      userEmail:'Anyone@Any.com',
      userQq:1077365277,
      userHeadColor:'ffffff',
      default:{
        'user_email': '未登录',
        'user_name': '未登录',
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
    suppressPickSelect(state,product){//禁用全体元素选中
      state.commits.suppressPickSelect=product;
    },
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
      };
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
      };
    },
    destroyComprehensive(state){//销毁综合对象
      state.serverData.socket=undefined;
    },
    restoreMapConfig(state){//恢复默认地图配置
      state.mapConfig={
        layer:0,
        oldLayer:null,
        zoomAdd:1,
        zoomSub:-1/(1+1),
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
        mouseWheelPos:{
          x:0,
          y:0
        },
        mouseClickLatLng:{
          x:null,
          y:null
        },
        operated:{
          id:null,
          data:null
        },
        cursor:'default',
        cursorLock:false,
        reinitializeId:-1,
        inputFocusStatus:false
      };
    },
    restoreBaseMapConfig(state){//恢复默认底图配置
      state.baseMapConfig={
        enableBaseMap:false,
        baseMapType:'unknown',
        baseMap:null,
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
          inertia:false,
          scaling:null
        },
        baseLayer:'',
      };
    },
    restoreCameraConfig(state){//恢复默认相机配置
      state.cameraConfig={
        windowChange:false,
        doNeedMoveMap:false,
        frameTime:16,
        maxZoom:5,
        minZoom:-10,
        unit1X:1,
        unit1Y:1,
        offsetX:0,
        offsetY:0,
        wheelInterval:50,
        zoomIng:false,
      };
    },
    /**
     * type(set/res/cha/arr)+StateType(Co/Da)+(NameProperty)
     * product:{type:'str',data:any}
     * data:{id,type} or data:[{id,type},{id,type}]
     * */
    arrCoElementPanelHiddenElements(state,product){//product:{type:push|remove|join|quit|byTypeJoin|byTypeQuit,data:Item|Array}
      switch (product.type) {
        case 'push':{//单一添加
          state.elementPanelConfig.hiddenElements.push(product.data);
          break;
        }
        case 'remove':{//单一删除
          let index=state.elementPanelConfig.hiddenElements.findIndex((item)=>{return item.id===product.data.id});
          if (index>-1) {
            state.elementPanelConfig.hiddenElements.splice(index, 1);
          }
          break;
        }
        case 'join':{//集体加入
          let arr1=state.elementPanelConfig.hiddenElements;
          let arr2=product.data;
          let merged=arr1.concat(arr2);
          let result=merged.filter((value,index,self)=>
            self.findIndex(item=>item.id===value.id)===index
          );
          state.elementPanelConfig.hiddenElements=result;
          break;
        }
        case 'quit':{//集体退出
          let arr1=state.elementPanelConfig.hiddenElements;
          let arr2=product.data;
          let set=new Set(arr2.map(value=>value.id));
          let result=arr1.filter(value=>!set.has(value.id));
          state.elementPanelConfig.hiddenElements=result;
          break;
        }
        case 'byTypeJoin':{//按类型集体加入
          let arr1=state.elementPanelConfig.hiddenElements.filter(item=>item.type!==product.by);
          let arr2=product.data;
          let result=arr1.concat(arr2);
          state.elementPanelConfig.hiddenElements=result;
          break;
        }
        case 'byTypeQuit':{//按类型集体退出
          state.elementPanelConfig.hiddenElements=
            state.elementPanelConfig.hiddenElements.filter(item=>item.type!==product.by);
          break;
        }
      }
    },
    resCoMapOperated(state){
      state.mapConfig.operated.id=-1;
      state.mapConfig.operated.data=null;
    },
    setCoLogMessage(state,product){//product:{text:'text',from:'[internal:name ] | [external:name]',type:'warn | error'}
      function formatDate(date) {
        let y=date.getFullYear();
        let m=date.getMonth()+1;
        let d=date.getDate();
        let h=date.getHours();
        let u=date.getMinutes();
        let s=date.getSeconds();
        return `${y}-${m}-${d} ${h}:${u}:${s}`;
      }
      state.logConfig.message.text=product.text;
      state.logConfig.message.from=product.from;
      state.logConfig.message.type=product.type;
      state.logConfig.message.data=product.data;
      state.logConfig.message.time=formatDate(new Date());
      state.logConfig.message.code+=1;//code更新应在末尾
    },
    setCoLogShowPanel(state,product){//product:true/false
      state.logConfig.showPanel=product;
    },
    setCoToolboxShowPanel(state,product){//product:true/false
      state.toolboxConfig.showPanel=product;
    },
    setCoToolboxPosition(state,product){//product:{x,y}
      state.toolboxConfig.position.x=product.x;
      state.toolboxConfig.position.y=product.y;
    },
    setCoEffectsSvgFlicker(state,product){//product:{svgType:'point'|'line'|'area',svgData:elementObject,duration:millisecond}
      state.effectsConfig.svgFlicker.svgType=product.svgType;
      state.effectsConfig.svgFlicker.svgData=product.svgData;
      state.effectsConfig.svgFlicker.duration=product.duration;
      state.effectsConfig.svgFlicker.changeCode+=1;
    }
  },
  actions: {

  }
})
