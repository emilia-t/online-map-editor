/**
 * type:config\data\storage
 * **/
import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import {Path} from "leaflet/dist/leaflet-src.esm";

Vue.use(Vuex);
export default new Vuex.Store({
  state:{
    classList:{
      realisticTile:class realisticTile{//真实地图底图类
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
                if(this.network.needTiles.find((e)=>e.x===tile.x&&e.y===tile.y)===undefined){//移除不需要的下载
                  tile.xhr.abort();//暂停下载
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
            const text = 'Loading';
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
        setBaseMapUrl(url){
          this.options.baseMapUrl=url;//更换底图源
          this.network.tileCache.length=0;//清空底图缓存
          this.network.downloadManage.length=0;//清空底图缓存
          this.network.needTiles.length=0;//清空底图缓存
          this.render();//重新渲染
        }
        getTopLevelDomain(url) {
          try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            const domainParts = hostname.split('.');
            const domainLength = domainParts.length;
            const topLevelDomain = domainParts.slice(domainLength - 2).join('.');
            return topLevelDomain;
          } catch (error) {
            return null;
          }
        }
        axiosDownloadImg(z,x,y){
          let domain=this.getTopLevelDomain(this.options.baseMapUrl);
          let url='';
          switch (domain) {
            case 'autonavi.com':{
              url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
              break;
            }
            // case 'bdimg.com':{
            //   url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
            //   break;
            // }
            case 'google.cn':{
              url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
              break;
            }
            case 'google.com':{
              url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
              break;
            }
            case 'openstreetmap.org':{
              url=this.options.baseMapUrl+`/${z}/${x}/${y}.png`;
              break;
            }
            case 'cartocdn.com':{
              url=this.options.baseMapUrl+`/${z}/${x}/${y}.png`;
              break;
            }
            case 'arcgisonline.com':{
              url=this.options.baseMapUrl+`/${z}/${x}/${y}.png`;
              break;
            }
            default:{//无法解析底图url则使用高德
              url='http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8'+`&x=${x}&y=${y}&z=${z}`;
            }
          }
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
            })
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
          return new Promise((resolve, reject) => {
            let domain=this.getTopLevelDomain(this.options.baseMapUrl);
            let url='';
            switch (domain) {
              case 'autonavi.com':{
                url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
                break;
              }
              // case 'bdimg.com':{
              //   //url="https://maponline1.bdimg.com/tile/?qt=vtile&x=209409&y=54868&z=20&styles=pl&scaler=1&showtext=1";
              //   //url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
              //   //console.log(url);
              //   break;
              // }
              case 'google.cn':{
                url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
                break;
              }
              case 'google.com':{
                url=this.options.baseMapUrl+`&x=${x}&y=${y}&z=${z}`;
                break;
              }
              case 'openstreetmap.org':{
                url=this.options.baseMapUrl+`/${z}/${x}/${y}.png`;
                break;
              }
              case 'cartocdn.com':{
                url=this.options.baseMapUrl+`/${z}/${x}/${y}.png`;
                break;
              }
              case 'arcgisonline.com':{
                url=this.options.baseMapUrl+`/${z}/${x}/${y}.png`;
                break;
              }
              default:{//无法解析底图url则使用高德
                url='http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8'+`&x=${x}&y=${y}&z=${z}`;
              }
            }
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
                resolve(img);
              } else {
                reject(new Error('download tail failed'));
                this.removeArrayValue(this.network.downloadManage,downloadObj);
              }
            };
            this.network.downloadManage.push(downloadObj);//保存xhr对象 和xyz索引
            downloadObj.xhr.send(null);
          }
          );
        }
        drawText(text, x, y) {
          this.ctx.fillStyle = "white";
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
      instructPipe:class instructPipe{//综合的一个连接服务端的通讯类
        constructor(url){
          this.url=url;
          this.loadData=false;//首次加载数据的状态
          this.loadLayer=false;//首次加载图层的状态
          this.loadActive=false;//首次加载活动数据的状态
          this.isLink=false;
          this.isLogin=false;
          this.localId=-1;//元素创建后的本地虚拟id
          this.updateId=1;//提交给服务器的本次变更id前缀为"up"为提交变更,前缀为"re"为撤销变更
          this.deleteLayerId=-1;//图层及其成员被删除id
          this.createLayerId=-1;//新创建的图层id
          this.updateLayerIds=[];//[]layerId list
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
          this.mapLayerOrderId=0;
          this.config={};
          this.getConfigTime=0;//最后一次获取的服务器配置的时间
          this.lastEdit='很久以前';
          this.updateCount=0;//对更新元素属性次数的统计
          this.lastUpdateId=-1;//最后一次更新的元素的属性的元素id
          this.lastDeleteId=-1;
          this.lastAddPoint=null;//主要用于mixMove()
          this.lastAddLine=null;
          this.lastAddArea=null;
          this.lastAddCurve=null;
          this.lastUpdateTmpId='id:0';//tmpId and code
          this.lastPSEndId=[];//最后被被清除选中的元素
          this.lastPing=0;
          this.lastPong=0;
          this.lastSelectIng='0:0';//最后被选中的元素id,弹回mixCanvas
          this.lastSelectEnd='0:0';//最后被结束选中的元素id,弹回mixCanvas
          this.lastPickIng='0:0';//id:code
          this.lastPickEnd='0:0';
          this.otherA1=[];
          this.typeList=['ping','pong','broadcast','get_serverConfig','get_publickey','publickey','login','loginStatus','anonymousLogin','anonymousLoginStatus','get_userData','send_userData','get_mapData','send_mapData','get_presence','send_presence','get_activeData','send_activeData','send_error','send_correct','get_mapLayer','send_mapLayer'];//指令类型合集
          this.Instruct={//指令合集
            ping(){
              return {type:'ping'};
            },
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
            broadcast_deleteElement(elementId,tmpId){//以广播的形式删除某一要素
              return {type:'broadcast',class:'deleteElement',data:{id:elementId,tmpId:tmpId}}
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
            broadcast_curve(data){//以广播的形式添加一条线段
              return {type:'broadcast',class:'curve',data}
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
            broadcast_restoreElement(id,tmpId){
              return {type:'broadcast',class:'restoreElement',data:{id:id,tmpId:tmpId}}
            },
            broadcast_createGroupLayer(){
              return {type:'broadcast',class:'createGroupLayer'}
            },
            broadcast_updateLayerOrder(passive,active,type){
              return {type:'broadcast',class:'updateLayerOrder',data:{passive,active,type}}
            },
            broadcast_adjustElementOrder(elementA,elementB,templateA,templateB,method){
              return {type:'broadcast',class:'adjustElementOrder',data:{elementA,elementB,templateA,templateB,method}}
            },
            broadcast_deleteLayerAndMembers(id){
              return {type:'broadcast',class:'deleteLayerAndMembers',data:{id}}
            },
            broadcast_batchDeleteElement(id){
              return {type:'broadcast',class:'batchDeleteElement',data:{id}}
            },
            broadcast_renameLayer(id,name){
              return {type:'broadcast',class:'renameLayer',data:{id,name}}
            },
            broadcast_updateTemplateData(template){
              return {type:'broadcast',class:'updateTemplateData',data:{template}}
            }
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
                window.logConfig.message.from='external:instructPipe';
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
              const ValueExp=/["]/m;
              if(Object.prototype.toString.call(details)==='[object Array]'){//1检查是否为数组
                for(let i=0;i<details.length;i++){//2循环检查类型
                  if(Object.prototype.toString.call(details[i])!=='[object object]'){//3检查是否为对象
                    if(details[i].hasOwnProperty('key') && details[i].hasOwnProperty('value')){//4检查是否包含key，value属性
                      if(details[i].key===''){
                        this.onLog('属性名不能为空','warn');
                        return false;
                      }
                      if(ValueExp.test(details[i].value)){
                        this.onLog('列值错误，不允许使用如下字符\"','warn');
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
          this.intervalPing();
        }
        unicastInstructCheck(DATA,TYPE){//指令的检查移动到此处
          let status=true;
          switch (TYPE){
            case 'pong':{//无需检查
              break;
            }
            case 'send_presence':{
              break;
            }
            case 'send_serverConfig':{//服务器发来配置信息
              break;
            }
            case 'publickey':{//服务器发来公钥
              break;
            }
            case 'loginStatus':{//服务器发来登录状态
              break;
            }
            case 'anonymousLoginStatus':{//服务器发来匿名登录状态
              break;
            }
            case 'send_userData':{//服务器发来的用户数据
              break;
            }
            case 'send_activeData':{//活动的数据
              break;
            }
            case 'send_mapData':{//服务器发来的地图数据
              break;
            }
            case 'send_mapLayer':{
              break;
            }
            case 'send_error':{
              break;
            }
            case 'send_correct':{
              break;
            }
            default:{break;}
          }
          return status;
        }
        broadInstructCheck(DATA,CLASS){//指令的检查移动到此处
          let status=true;
          switch (CLASS){
            case 'A1':{//A1位置广播
              break;
            }
            case 'line':{//新增线段数据广播
              break;
            }
            case 'curve':{//新增曲线数据广播
              break;
            }
            case 'area':{//新增线段数据广播
              break;
            }
            case 'point':{//新增点数据广播
              break;
            }
            case 'deleteElement':{//删除某一元素的广播
              break;
            }
            case 'batchDeleteElement':{//批量删除元素的广播
              break;
            }
            case 'textMessage':{//普通文本消息
              break;
            }
            case 'updateElement':{//更新某一元素的广播
              break;
            }
            case 'batchUpdateElement':{//批量更新元素的广播
              break;
            }
            case 'updateElementNode':{//更新某一元素的节点的广播
              break;
            }
            case 'selectIngElement':{
              break;
            }
            case 'selectEndElement':{
              break;
            }
            case 'pickIngElement':{
              break;
            }
            case 'pickEndElement':{
              break;
            }
            case 'pickSelectEndElements':{//取消所有元素选中效果
              break;
            }
            case 'logIn':{
              break;
            }
            case 'logOut':{
              break;
            }
            case 'createGroupLayer':{
              break;
            }
            case 'deleteLayerAndMembers':{
              break;
            }
            case 'updateLayerData':{
              break;
            }
            case 'batchUpdateLayerData':{
              break;
            }
            case 'updateLayerOrder':{
              break;
            }
            case 'renameLayer':{
              break;
            }
            default:{break;}
          }
          return status;
        }
        intervalPing(){
          setInterval(
            ()=>{
              if(this.isLogin){
                this.lastPing=new Date().getTime();
                this.send(this.Instruct.ping());
                setTimeout(()=>{if(Math.abs(this.lastPong-this.lastPing)>1000){this.onLog('服务器连接超时(>1S)','warn');this.socket.close();}},1000);//连接超时检测
              }
            },
            5000
          );
        }
        clearLocalData(){//清除本地数据
          this.userData=null;//1.清除会话内的用户数据
          this.otherA1.length=0;//2.清除他人的A1
          this.mapData.points.length=0;//3.清除地图数据
          this.mapData.lines.length=0;
          this.mapData.areas.length=0;
          this.mapData.curves.length=0;
        }
        broadcastRenameLayer(id,name){//重命名图层名称
          if(typeof id==='number' && typeof name==='string'){
            this.send(this.Instruct.broadcast_renameLayer(id,name));
            return true;
          }
          return false;
        }
        broadcastUpdateTemplateData(template){
          this.send(this.Instruct.broadcast_updateTemplateData(template));
        }
        broadcastBatchDeleteElement(id){//批量删除元素
          if(Array.isArray(id)){
            let len=id.length;
            let lock=false;
            for(let i=0;i<len;i++){if(typeof id[i]!=='number')lock=true;}//检查数组内是否都为元素ID
            if(!lock){
              this.send(this.Instruct.broadcast_batchDeleteElement(id));
            }
          }
        }
        broadcastCreateGroupLayer(){
          this.send(this.Instruct.broadcast_createGroupLayer());
        }
        broadcastDeleteLayerAndMembers(id){
          this.send(this.Instruct.broadcast_deleteLayerAndMembers(id));
        }
        broadcastUpdateLayerOrder(passiveId,activeId,type){
          this.send(this.Instruct.broadcast_updateLayerOrder(passiveId,activeId,type));
        }
        broadcastAdjustElementOrder(elementA,elementB,templateA,templateB,method){
          this.send(this.Instruct.broadcast_adjustElementOrder(elementA,elementB,templateA,templateB,method));
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
            //console.log(e);
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
                  if(refWidth===false){return false;}
                  else{data.changes.width=refWidth;}
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
        broadcastDeleteElement(id,tmpId){//广播删除某一要素
          if(typeof id!=='number' && typeof tmpId!=='string'){return false;}
          if(tmpId===''){return false;}
          this.send(this.Instruct.broadcast_deleteElement(id,tmpId));
        }
        broadcastRestoreElement(id,tmpId){//广播恢复删除某一要素
          if(typeof id!=='number' && typeof tmpId!=='string'){return false;}
          if(tmpId===''){return false;}
          this.send(this.Instruct.broadcast_restoreElement(id,tmpId));
        }
        broadcastSendText(data){//广播普通文本信息
          this.send(this.Instruct.broadcast_textMessage(data));
        }
        broadcastSendLine(data,Type){//发送路径线数据(兼容区域和曲线类型，只需要在第二个参数Type传入area或curve即可)
          if('custom' in data){
            if(typeof data.custom.tmpId!=='string' || data.custom.tmpId===''){
              this.onLog('添加失败，因为模板id为空，请选中图层后再添加。','error');
              return false;
            }
          }else{
            this.onLog('添加失败，因为缺失custom。','error');
            return false;
          }
          try{
            if(!this.QIR.isObject(data)){return false;}//0.1检查是否属于object
            if(!this.QIR.hasProperty(data,'class')){return false;}//0.2检查是否包含class类型
            if(Type==='area'){//0.3检查class类型是否正确
              if(data.class!=='area'){return false;}
            }else if(Type==='curve'){
              if(data.class!=='curve'){return false;}
            }else{//default line
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
              let refWidth=this.QIR.widthCheck(data.width);
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
              width:2,//宽度
              childRelations:[],//这里为空
              fatherRelation:'',//这里为空
              childNodes:[],//这里为空
              fatherNode:'',//这里为空
              details:[],
              custom:{tmpId:null}
            };
            basicStructure.points=data.points;//2.0归档
            basicStructure.point=data.point;
            basicStructure.color=data.color;
            basicStructure.width=data.width || basicStructure.width;
            basicStructure.details=data.details || basicStructure.details;
            basicStructure.custom=data.custom || basicStructure.custom;
            if(Type==='area'){//3.0广播
              basicStructure.type='area';
              this.send(this.Instruct.broadcast_area(basicStructure));
            }else if(Type==='curve'){
              basicStructure.type='curve';
              this.send(this.Instruct.broadcast_curve(basicStructure));
            }else{//default line
              this.send(this.Instruct.broadcast_line(basicStructure));
            }
          }
          catch (e) {}
        }
        broadcastSendPoint(data){//发送关注点数据
          try {
            if('custom' in data){
              if(typeof data.custom.tmpId!=='string' || data.custom.tmpId===''){
                this.onLog('添加失败，因为模板id为空，请选中图层后再添加。','error');
                return false;
              }
            }else{
              this.onLog('添加失败，因为缺失custom。','error');
              return false;
            }
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
              let refWidth=this.QIR.widthCheck(data.width);
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
              custom:{icon:null,tmpId:null}
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
        test(){//测试用
          let json=JSON.stringify({
            type:"test",
            data:null
          });
          this.socket.send(json);
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
          this.socket=new WebSocket(this.url);
          this.socket.onopen=(ev)=>this.onOpen(ev);
          this.socket.onmessage=(ev)=>this.onMessage(ev);
          this.socket.onclose=(ev)=>this.onClose(ev);
          this.socket.onerror=(ev)=>this.onError(ev);
          return true;
        }
        send(instructObj){//发送数据
          if(this.isLink){
            if(this.instructObjCheck(instructObj)){//1.数据检查
              let json=JSON.stringify(instructObj);
              // 指令截取
              // if(instructObj.type==='broadcast' && instructObj.class==='area'){
              //   console.log("%c↓↓↓截取到的发送指令↓↓↓","color:blue;");
              //   console.log(JSON.parse(JSON.stringify(instructObj)));
              //   console.log("%c↑↑↑截取到的发送指令↑↑↑","color:blue;");
              // }
              // 指令截取
              // 始终输出发送的指令
              if(Vue.G_PrintInstructAll){
                console.log("%c↓↓↓发送出去的指令↓↓↓","color:blue;");
                console.log(JSON.parse(JSON.stringify(instructObj)));
                console.log("%c↑↑↑发送出去的指令↑↑↑","color:blue;");
              }
              // 始终输出发送的指令
              this.socket.send(json);
            }else{
              this.onLog('指令无效或不安全','error');
            }
          }else{
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
        onLog(text,type,data){
          function reset(){
            window.logConfig={
              message:{code:-1,time:'',text:'',from:'',type:'',data:undefined}
            };
          }
          let lock=false;
          try{
            window.logConfig.message.code-=1;
            window.logConfig.message.text=text;
            window.logConfig.message.from='external:instructPipe';
            window.logConfig.message.type=type;
            window.logConfig.message.data=data;
          }catch (e) {
            lock=true;
          }
          if(lock){
            reset();
          }
        }
        onMessage(ev){//收到消息事件
          let jsonData=null;
          try{jsonData=JSON.parse(ev.data);}catch(e){this.onLog('无法解析指令','error',ev.data);return false;}
          // 指令截取
          // if(jsonData.type==='broadcast' && jsonData.class==='area'){
          //   console.log("%c↓↓↓截取到的发送指令↓↓↓","color:green;");
          //   console.log(JSON.parse(JSON.stringify(jsonData)));
          //   console.log("%c↑↑↑截取到的发送指令↑↑↑","color:green;");
          // }
          // 指令截取
          // 始终输出接收的指令
          if(Vue.G_PrintInstructAll){
            console.log("%c↓↓↓接收到的指令↓↓↓","color:green;");
            console.log(JSON.parse(JSON.stringify(jsonData)));
            console.log("%c↑↑↑接收到的指令↑↑↑","color:green;");
          }
          // 始终输出接收的指令
          if(jsonData.type!==undefined && typeof jsonData.type==='string'){
          let nowType=jsonData.type;
          if(!this.unicastInstructCheck(jsonData,nowType)){this.onLog('无法解析指令','error',jsonData);return false;}
          switch (nowType){
            case 'pong':{
              this.lastPong=new Date().getTime();
              break;
            }
            case 'send_presence':{
              this.presence=jsonData.data;
              break;
            }
            case 'send_serverConfig':{//服务器发来配置信息
              this.config=jsonData.data;
              this.getConfigTime=new Date().getTime();
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
                this.loadActive=true;
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
              this.loadActive=true;
              break;
            }
            case 'send_mapData':{//服务器发来的地图数据
              for (let i=0;i<jsonData.data.length;i++){
                try{
                  let [Ps,Pt,basePs,basePt]=[null,null,null,null];//point/s解析
                  Pt=JSON.parse(jsonData.data[i].point);
                  basePt=JSON.parse(jsonData.data[i].point);
                  Ps=JSON.parse(jsonData.data[i].points);
                  basePs=JSON.parse(jsonData.data[i].points);
                  jsonData.data[i].points=Ps;
                  jsonData.data[i].basePoints=basePs;
                  jsonData.data[i].point=Pt;
                  jsonData.data[i].basePoint=basePt;

                  let [loc,baseD]=[true,null];//details解析
                  try{baseD=JSON.parse(jsonData.data[i].details);}
                  catch(e){loc=false;}
                  if(loc){jsonData.data[i].details=baseD;}

                  let [lock,baseG]=[true,null];//custom解析
                  try{baseG=JSON.parse(jsonData.data[i].custom);}
                  catch(e){lock=false;}
                  if(lock){jsonData.data[i].custom=baseG;}

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
                    case 'curve':{
                      this.mapData.curves.push(jsonData.data[i]);
                    }
                  }
                }
                catch(e){console.log(e);}
              }
              this.loadData=true;
              break;
            }
            case 'send_mapLayer':{
              try{
                let res=[];
                let ord=[];
                let ordId=0;
                let layerCount=jsonData.data.length;
                for(let i=0;i<layerCount;i++){
                  if(jsonData.data[i].type==='order'){
                    ord=JSON.parse(jsonData.data[i].members);
                    ordId=parseInt(jsonData.data[i].id);
                  }
                  else{
                    jsonData.data[i].id=parseInt(jsonData.data[i].id);//hack
                    jsonData.data[i].members=JSON.parse(jsonData.data[i].members);//不再使用base64编码members,structure
                    jsonData.data[i].structure=JSON.parse(jsonData.data[i].structure);
                    res.push(jsonData.data[i]);
                  }
                }
                this.mapLayerData=res;
                this.mapLayerOrder=ord;
                this.mapLayerOrderId=ordId;
                this.loadLayer=true;
              }
              catch (e) {
                this.onLog('图层构建失败','error',jsonData);
              }
              break;
            }
            case 'broadcast':{//服务器发来的广播
              let classIs=jsonData.class;//获取广播类型
              if(!this.broadInstructCheck(jsonData,classIs)){this.onLog('无法解析指令','error',jsonData);return false;}
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
                  let error=false;
                  try{//points point解析
                    if(typeof jsonData.data.point!=='object' || typeof jsonData.data.points!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,Ps,Pt,basePs,basePt]=[true,null,null,null,null];
                    try{
                      Ps=JSON.parse(JSON.stringify(jsonData.data.points));
                      Pt=JSON.parse(JSON.stringify(jsonData.data.point));
                      basePs=JSON.parse(JSON.stringify(jsonData.data.points));
                      basePt=JSON.parse(JSON.stringify(jsonData.data.point));
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                      jsonData.data.basePoints=basePs;
                      jsonData.data.basePoint=basePt;
                    }
                  }catch(e){
                    console.log(e);
                    this.onLog('添加线段失败，无法解析point或points','error',jsonData);
                    error=true;
                  }
                  try{//details custom解析
                    if(typeof jsonData.data.details!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,details]=[true,null];
                    try{
                      details=JSON.parse(JSON.stringify(jsonData.data.details));
                    }catch(e){console.log(e);lock=false;}
                    if(lock){
                      jsonData.data.details=details;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加线段失败，无法解析details','error',jsonData);
                    error=true;
                  }
                  try{
                    if(typeof jsonData.data.custom!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,custom]=[true,null];
                    try{
                      if(lock){
                        custom=JSON.parse(JSON.stringify(jsonData.data.custom));
                      }
                    }catch(e){console.log(e);lock=false;}
                    if(lock){
                      jsonData.data.custom=custom;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加线段失败，无法解析custom','error',jsonData);
                    error=true;
                  }
                  if(error){
                    break;
                  }
                  if('id' in jsonData.data){//hack
                    jsonData.data.id=parseInt(jsonData.data.id);
                  }
                  if('custom' in jsonData.data){//hack
                    if(typeof jsonData.data.custom.tmpId!=='string'){
                      jsonData.data.custom.tmpId='';
                    }
                  }else{
                    jsonData.data.custom={tmpId:''};
                  }
                  let NewMessageObj={'type':'broadcast','class':'line','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);//更新messages
                  this.mapData.lines.push(jsonData.data);//添加到mapData
                  this.lastAddLine=jsonData.data;
                  this.lastEdit=jsonData.time;
                  break;
                }
                case 'curve':{//新增曲线数据广播
                  let error=false;
                  try{//points point解析
                    if(typeof jsonData.data.point!=='object' || typeof jsonData.data.points!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,Ps,Pt,basePs,basePt]=[true,null,null,null,null];
                    try{
                      Ps=JSON.parse(JSON.stringify(jsonData.data.points));
                      Pt=JSON.parse(JSON.stringify(jsonData.data.point));
                      basePs=JSON.parse(JSON.stringify(jsonData.data.points));
                      basePt=JSON.parse(JSON.stringify(jsonData.data.point));
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                      jsonData.data.basePoints=basePs;
                      jsonData.data.basePoint=basePt;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加曲线失败，无法解析point或points','error',jsonData);
                    error=true;
                  }
                  try{//details custom解析
                    if(typeof jsonData.data.details!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,details]=[true,null];
                    try{
                      details=JSON.parse(JSON.stringify(jsonData.data.details));
                    }catch(e){console.log(e);lock=false;}
                    if(lock){
                      jsonData.data.details=details;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加曲线失败，无法解析details','error',jsonData);
                    error=true;
                  }
                  try{
                    if(typeof jsonData.data.custom!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,custom]=[true,null];
                    try{
                      custom=JSON.parse(JSON.stringify(jsonData.data.custom));
                    }catch(e){console.log(e);lock=false;}
                    if(lock){
                      jsonData.data.custom=custom;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加曲线失败，无法解析custom','error',jsonData);
                    error=true;
                  }
                  if(error){
                    break;
                  }
                  if('id' in jsonData.data){//hack
                    jsonData.data.id=parseInt(jsonData.data.id);
                  }
                  if('custom' in jsonData.data){//hack
                    if(typeof jsonData.data.custom.tmpId!=='string'){
                      jsonData.data.custom.tmpId='';
                    }
                  }else{
                    jsonData.data.custom={tmpId:''};
                  }
                  let NewMessageObj={'type':'broadcast','class':'curve','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);//更新messages
                  this.mapData.curves.push(jsonData.data);//添加到mapData
                  this.lastAddCurve=jsonData.data;
                  this.lastEdit=jsonData.time;
                  break;
                }
                case 'area':{//新增线段数据广播
                  let error=false;
                  try{//points point解析
                    if(typeof jsonData.data.point!=='object' || typeof jsonData.data.points!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,Ps,Pt,basePs,basePt]=[true,null,null,null,null];
                    try{
                      Ps=JSON.parse(JSON.stringify(jsonData.data.points));
                      Pt=JSON.parse(JSON.stringify(jsonData.data.point));
                      basePs=JSON.parse(JSON.stringify(jsonData.data.points));
                      basePt=JSON.parse(JSON.stringify(jsonData.data.point));
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                      jsonData.data.basePoints=basePs;
                      jsonData.data.basePoint=basePt;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加区域失败，无法解析point或points','error',jsonData);
                    error=true;
                  }
                  try{//details custom解析
                    if(typeof jsonData.data.details!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,details]=[true,null];
                    try{
                      details=JSON.parse(JSON.stringify(jsonData.data.details));
                    }catch(e){console.log(e);lock=false;}
                    if(lock){
                      jsonData.data.details=details;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加区域失败，无法解析details','error',jsonData);
                    error=true;
                  }
                  try{
                    if(typeof jsonData.data.custom!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,custom]=[true,null];
                    try{
                      custom=JSON.parse(JSON.stringify(jsonData.data.custom));
                    }catch(e){console.log(e);lock=false;}
                    if(lock){
                      jsonData.data.custom=custom;
                    }
                  }catch(e){console.log(e);
                    this.onLog('添加区域失败，无法解析custom','error',jsonData);
                    error=true;
                  }
                  if(error){
                    break;
                  }
                  if('id' in jsonData.data){//hack
                    jsonData.data.id=parseInt(jsonData.data.id);
                  }
                  if('custom' in jsonData.data){//hack
                    if(typeof jsonData.data.custom.tmpId!=='string'){
                      jsonData.data.custom.tmpId='';
                    }
                  }else{
                    jsonData.data.custom={tmpId:''};
                  }
                  let NewMessageObj={'type':'broadcast','class':'area','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);//更新messages
                  this.mapData.areas.push(jsonData.data);//添加到mapData
                  this.lastAddArea=jsonData.data;
                  this.lastEdit=jsonData.time;
                  break;
                }
                case 'point':{//新增点数据广播
                  let error=false;
                  try{//points point解析
                    if(typeof jsonData.data.point!=='object' || typeof jsonData.data.points!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,Ps,Pt,basePs,basePt]=[true,null,null,null,null];
                    try{
                      Ps=JSON.parse(JSON.stringify(jsonData.data.points));
                      Pt=JSON.parse(JSON.stringify(jsonData.data.point));
                      basePs=JSON.parse(JSON.stringify(jsonData.data.points));
                      basePt=JSON.parse(JSON.stringify(jsonData.data.point));
                    }
                    catch(e){lock=false;}
                    if(lock){
                      jsonData.data.points=Ps;
                      jsonData.data.point=Pt;
                      jsonData.data.basePoints=basePs;
                      jsonData.data.basePoint=basePt;
                    }
                  }
                  catch(e){
                    this.onLog('添加点失败，无法解析point或points','error',jsonData);
                    error=true;
                  }
                  try{//details custom解析
                    if(typeof jsonData.data.details!=='object' || typeof jsonData.data.custom!=='object'){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    let [lock,details]=[true,null];
                    let [lockCustom,custom]=[true,null];
                    try{
                      details=JSON.parse(JSON.stringify(jsonData.data.details));
                    }catch(e){console.log(e);lock=false;}
                    if(lock){
                      jsonData.data.details=details;
                    }
                    try{
                      custom=JSON.parse(JSON.stringify(jsonData.data.custom));
                    }catch(e){console.log(e);lockCustom=false;}
                    if(lockCustom){
                      jsonData.data.custom=custom;
                    }
                  }
                  catch(e){
                    this.onLog('添加点失败，无法解析details或custom','error',jsonData);
                    error=true;
                  }
                  if(error){
                    break;
                  }
                  if('id' in jsonData.data){//hack
                    jsonData.data.id=parseInt(jsonData.data.id);
                  }
                  if('custom' in jsonData.data){//hack
                    if(typeof jsonData.data.custom.tmpId!=='string'){
                      jsonData.data.custom.tmpId='';
                    }
                  }else{
                    jsonData.data.custom={tmpId:''};
                  }
                  let NewMessageObj={'type':'broadcast','class':'point','conveyor':jsonData.conveyor,'time':jsonData.time,'data':{'elementId':jsonData.data.id}};
                  this.messages.push(NewMessageObj);
                  this.mapData.points.push(jsonData.data);
                  this.lastAddPoint=jsonData.data;
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
                    if(!find){
                      this.mapData.curves.some((item, index)=>{
                        if (item.id==ID){
                          this.mapData.curves.splice(index,1);
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
                case 'batchDeleteElement':{//批量删除元素的广播
                  try{
                    let point=jsonData.data.point;
                    let line=jsonData.data.line;
                    let area=jsonData.data.area;
                    let curve=jsonData.data.curve;
                    let len=0;
                    let ID=0;
                    len=point.length;
                    for(let i=0;i<len;i++){
                      ID=parseInt(point[i]);
                      this.mapData.points.some((item, index)=>{//查找并删除该id
                        if (item.id==ID){
                          this.mapData.points.splice(index,1);
                        }
                      });
                    }
                    len=line.length;
                    for(let i=0;i<len;i++){
                      ID=parseInt(line[i]);
                      this.mapData.lines.some((item, index)=>{//查找并删除该id
                        if (item.id==ID){
                          this.mapData.lines.splice(index,1);
                        }
                      });
                    }
                    len=area.length;
                    for(let i=0;i<len;i++){
                      ID=parseInt(area[i]);
                      this.mapData.areas.some((item, index)=>{//查找并删除该id
                        if (item.id==ID){
                          this.mapData.areas.splice(index,1);
                        }
                      });
                    }
                    len=curve.length;
                    for(let i=0;i<len;i++){
                      ID=parseInt(curve[i]);
                      this.mapData.curves.some((item, index)=>{//查找并删除该id
                        if (item.id==ID){
                          this.mapData.curves.splice(index,1);
                        }
                      });
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
                    if(Object.hasOwnProperty.call(jsonData.data,'details')){
                      if(typeof jsonData.data.details!=='object'){
                        throw new Error('cannot parse data');//本地捕获异常
                      }
                    }
                    if(Object.hasOwnProperty.call(jsonData.data,'custom')){
                      if(typeof jsonData.data.custom!=='object'){
                        throw new Error('cannot parse data');//本地捕获异常
                      }
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
                          this.updateCount+=1;
                          this.lastUpdateId=eId;
                          found=true;
                          break;
                        }
                      }
                    }
                    if(!found){
                      this.onLog('存在未同步的元素,建议刷新页面ID:'+eId,'warn');
                    }
                  }catch (e) {
                    this.onLog('指令解析失败','error',jsonData);
                  }
                  break;
                }
                case 'batchUpdateElement':{//批量更新元素的广播
                  if(!Array.isArray(jsonData.data)){
                    break;
                  }
                  let count=jsonData.data.length;
                  for(let K=0;K<count;K++){
                    try{
                      if(jsonData.data[K].hasOwnProperty('details')){//解码details如果有的话
                        if(typeof jsonData.data[K].details!=='object'){
                          throw new Error('cannot parse data');//本地捕获异常
                        }
                      }
                      if(jsonData.data[K].hasOwnProperty('custom')){//解码custom如果有的话
                        if(typeof jsonData.data[K].custom!=='object'){
                          throw new Error('cannot parse data');//本地捕获异常
                        }
                      }
                      let eType=undefined;
                      if(jsonData.data[K].hasOwnProperty('type')){
                        eType=jsonData.data[K].type+'s';
                      }
                      let found=false;
                      let eId=parseInt(jsonData.data[K].id);//hack
                      if(!isNaN(eId) && eType!==undefined){
                        let Len=this.mapData[eType].length;
                        for (let i=0;i<Len;i++){//查找相应的地图数据并修改地图数据
                          if(eId===this.mapData[eType][i].id){
                            Object.assign(this.mapData[eType][i],jsonData.data[K]);
                            this.lastEdit=jsonData.time;
                            this.updateCount+=1;
                            found=true;
                            break;
                          }
                        }
                      }
                      if(!found){
                        this.onLog('存在未同步的元素,建议刷新页面ID:'+eId,'warn');
                      }
                    }catch (e) {
                      this.onLog('指令解析失败','error',jsonData);
                    }
                  }
                  break;
                }
                case 'updateElementNode':{//更新某一元素的节点的广播
                  try{
                    if(!Object.hasOwnProperty.call(jsonData.data,'id')){
                      throw new Error('cannot parse data');//本地捕获异常
                    }
                    if(!Object.hasOwnProperty.call(jsonData.data,'points')){
                      throw new Error('cannot parse data');//本地捕获异常
                    }else{
                      if(typeof jsonData.data.points!=='object'){
                        throw new Error('cannot parse data');//本地捕获异常
                      }
                    }
                    if(Object.hasOwnProperty.call(jsonData.data,'point')){
                      if(typeof jsonData.data.point!=='object'){
                        throw new Error('cannot parse data');//本地捕获异常
                      }
                    }
                    let pointsObj=JSON.parse(JSON.stringify(jsonData.data.points));//不再使用base64编码数据也不再使用json重复打包数据
                    let basePointsObj=JSON.parse(JSON.stringify(jsonData.data.points));//不再使用base64编码数据也不再使用json重复打包数据
                    let [pointObj,basePointObj]=[null,null];
                    if(this.QIR.hasProperty(jsonData.data,'point')){
                      pointObj=JSON.parse(JSON.stringify(jsonData.data.point));//不再使用base64编码数据也不再使用json重复打包数据
                      basePointObj=JSON.parse(JSON.stringify(jsonData.data.point));//不再使用base64编码数据也不再使用json重复打包数据
                    }
                    let CgID=parseInt(jsonData.data.id);//hack | Cg mean change
                    let type=null;//查找type类型
                    if(this.QIR.hasProperty(jsonData.data,'type')){
                      type=jsonData.data.type+'s';
                    }
                    if(type!==null){//如果有type类型的话则按照type类型查找
                      let length=this.mapData[type].length;
                      for(let k=0;k<length;k++){
                        if(this.mapData[type][k].id===CgID){
                          let newPointsCount=basePointsObj.length;
                          let oldPointsCount=this.mapData[type][k].points.length;
                          let frontCount=Math.min(newPointsCount,oldPointsCount);
                          let rearCount=Math.abs(newPointsCount-oldPointsCount);
                          for(let f=0;f<frontCount;f++){//对齐长度一致的部位(前部)
                            this.mapData[type][k].basePoints[f].x=basePointsObj[f].x;
                            this.mapData[type][k].points[f].x=pointsObj[f].x;
                            this.mapData[type][k].basePoints[f].y=basePointsObj[f].y;
                            this.mapData[type][k].points[f].y=pointsObj[f].y;
                          }
                          if(rearCount>0){//新旧长度不一致
                            if(newPointsCount>oldPointsCount){//新增坐标
                              let newPointsArr1=basePointsObj.slice(-rearCount);
                              let newPointsArr2=pointsObj.slice(-rearCount);
                              this.mapData[type][k].basePoints.push(...newPointsArr1);
                              this.mapData[type][k].points.push(...newPointsArr2);
                            }else{//移除坐标
                              this.mapData[type][k].basePoints.splice(-rearCount);
                              this.mapData[type][k].points.splice(-rearCount);
                            }
                          }
                          if(basePointObj!==null){
                            this.mapData[type][k].basePoint.x=basePointObj.x;
                            this.mapData[type][k].point.x=pointObj.x;
                            this.mapData[type][k].basePoint.y=basePointObj.y;
                            this.mapData[type][k].point.y=pointObj.y;
                          }
                          this.reinitializeSourcePoints=pointsObj;//同步源
                          if(pointObj!==null){
                            this.reinitializeSourcePoint=pointObj;//同步源
                          }
                          this.reinitializeElement++;//更改初始化
                          this.reinitializeId=CgID;
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
                      this.updateCount+=1;
                    }else{
                      this.onLog('存在未同步的元素,建议刷新页面ID:'+CgID,'warn');
                    }
                  }catch (e) {
                    this.onLog('指令解析失败','error',jsonData);
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
                  let code=parseInt(this.lastSelectIng.split(':')[1])+1;
                  this.lastSelectIng=obj.id+':'+code;
                  break;
                }
                case 'selectEndElement':{
                  let len=this.selectElements.length;
                  for(let i=0;i<len;i++){
                    if(this.selectElements[i].id===jsonData.data){
                      this.selectElements.splice(i,1);
                      let code=parseInt(this.lastSelectEnd.split(':')[1])+1;
                      this.lastSelectEnd=jsonData.data+':'+code;
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
                  let code=parseInt(this.lastPickIng.split(':')[1])+1;
                  this.lastPickIng=obj.id+':'+code;
                  break;
                }
                case 'pickEndElement':{
                  let len=this.pickElements.length;
                  for(let i=0;i<len;i++){
                    if(this.pickElements[i].id===jsonData.data){
                      this.pickElements.splice(i,1);
                      let code=parseInt(this.lastPickEnd.split(':')[1])+1;
                      this.lastPickEnd=jsonData.data+':'+code;
                      break;
                    }
                  }
                  break;
                }
                case 'pickSelectEndElements':{//取消所有元素选中效果
                  let count=jsonData.data.id.length;
                  let len1=this.pickElements.length;
                  let len2=this.selectElements.length;
                  let psEnd=jsonData.data.id;
                  for(let p=0;p<count;p++){
                    let ID=jsonData.data.id[p];
                    for(let i=0;i<len1;i++){
                      if(this.pickElements[i].id===ID){
                        this.pickElements.splice(i,1);
                        break;
                      }
                    }
                    for(let i=0;i<len2;i++){
                      if(this.selectElements[i].id===ID){
                        this.selectElements.splice(i,1);
                        break;
                      }
                    }
                  }
                  this.lastPSEndId=psEnd;
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
                      try{
                        if(typeof jsonData.data.members!=='object' || typeof jsonData.data.structure!=='object'){
                          throw new Error('cannot parse data');//本地捕获异常
                        }
                        let newMembers=JSON.parse(JSON.stringify(jsonData.data.members));//不再使用base64编码members,structure
                        let newStructure=JSON.parse(JSON.stringify(jsonData.data.structure));
                        jsonData.data.id=parseInt(jsonData.data.id);//hack
                        this.mapLayerData.push({
                          id:jsonData.data.id,
                          type:jsonData.data.type,
                          members:newMembers,
                          structure:newStructure,
                        });
                        this.createLayerId=jsonData.data.id;
                      }catch(e){console.log(e);
                        this.onLog('指令解析失败','error',jsonData);
                      }
                    }
                  }
                  break;
                }
                case 'deleteLayerAndMembers':{
                  for(let i=0;i<this.mapLayerData.length;i++){
                    if(this.mapLayerData[i].id==jsonData.data.id){//删除图层
                      this.mapLayerData.splice(i,1);
                      this.deleteLayerId=jsonData.data.id;
                    }
                  }
                  let changeCount=0;
                  let changePoint=false;
                  let changeLine=false;
                  let changeArea=false;
                  let changeCurve=false;
                  for(let key in jsonData.data.members){//查询图层的成员类型
                    if(changeCount===4){
                      break;
                    }
                    if(jsonData.data.members[key]===1){
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
                    else if(jsonData.data.members[key]===4){
                      if(changeCurve===false){
                        changeCurve=true;
                        changeCount+=1;
                      }
                    }
                  }
                  if(changePoint){//删除点
                    let newPoints=this.mapData.points.filter(
                      (element)=>{
                        return !jsonData.data.members.hasOwnProperty(element.id)
                      });
                    this.mapData.points.length=0;
                    this.mapData.points.push(...newPoints);
                  }
                  if(changeLine){//删除线段
                    let newLines=this.mapData.lines.filter(
                      (element)=>{
                        return !jsonData.data.members.hasOwnProperty(element.id)
                      });
                    this.mapData.lines.length=0;
                    this.mapData.lines.push(...newLines);
                  }
                  if(changeArea){//删除区域
                    let newAreas=this.mapData.areas.filter(
                      (element)=>{
                        return !jsonData.data.members.hasOwnProperty(element.id)
                      });
                    this.mapData.areas.length=0;
                    this.mapData.areas.push(...newAreas);
                  }
                  if(changeCurve){//删除曲线
                    let newCurves=this.mapData.curves.filter(
                      (element)=>{
                        return !jsonData.data.members.hasOwnProperty(element.id)
                      });
                    this.mapData.curves.length=0;
                    this.mapData.curves.push(...newCurves);
                  }
                  break;
                }
                case 'updateLayerData':{
                  if(this.QIR.hasProperty(jsonData,'data')){
                  if(this.QIR.hasProperty(jsonData.data,'id')){
                    let ID=jsonData.data.id;
                    let newMembers=undefined;
                    if(this.QIR.hasProperty(jsonData.data,'members')){
                      if(typeof jsonData.data.members!=='object'){
                        this.onLog('更新图层数据失败，无法解析指令','error',jsonData);
                        break;
                      }
                      newMembers=JSON.parse(JSON.stringify(jsonData.data.members));
                    }
                    let newStructure=undefined;
                    if(this.QIR.hasProperty(jsonData.data,'structure')){
                      if(typeof jsonData.data.structure!=='object'){
                        this.onLog('更新图层数据失败，无法解析指令','error',jsonData);
                        break;
                      }
                      newStructure=JSON.parse(JSON.stringify(jsonData.data.structure));
                    }
                    for(let i=0;i<this.mapLayerData.length;i++){
                      if(ID==this.mapLayerData[i].id){
                        if(newMembers!==undefined){
                          this.mapLayerData[i].members=newMembers;
                        }
                        if(newStructure!==undefined){
                          this.mapLayerData[i].structure=newStructure;

                          if(this.QIR.hasProperty(jsonData.data,'templateVary')){
                            if(jsonData.data.templateVary===true){
                              let newCustom=newStructure[1];
                              if(this.QIR.hasProperty(newCustom,'template')){
                                let newTmp=newCustom.template;
                                if(this.QIR.hasProperty(newTmp,'id') && typeof newTmp.id==='string'){
                                  let splitArray=this.lastUpdateTmpId.split(':');
                                  this.lastUpdateTmpId=newTmp.id+':'+parseInt(splitArray[1])+1;//更新模板
                                }
                              }
                            }
                          }

                        }
                        if(newMembers!==undefined || newStructure!==undefined){
                          this.updateLayerIds.push(ID);//更新图层
                        }
                      }
                    }
                  }
                  }
                  break;
                }
                case 'batchUpdateLayerData':{
                  if(!this.QIR.hasProperty(jsonData,'data')){break;}
                  if(!Array.isArray(jsonData.data)){break;}
                  let IDS=[];
                  let count=jsonData.data.length;
                  for(let g=0;g<count;g++){
                    if(!this.QIR.hasProperty(jsonData.data[g],'id')){continue;}
                    let ID=jsonData.data[g].id;
                    let newMembers=undefined;
                    if(this.QIR.hasProperty(jsonData.data[g],'members')){
                      if(typeof jsonData.data[g].members!=='object'){
                        this.onLog('更新图层数据失败，无法解析指令','error',jsonData);
                        continue;
                      }
                      newMembers=JSON.parse(JSON.stringify(jsonData.data[g].members));
                    }
                    let newStructure=undefined;
                    if(this.QIR.hasProperty(jsonData.data[g],'structure')){
                      if(typeof jsonData.data[g].structure!=='object'){
                        this.onLog('更新图层数据失败，无法解析指令','error',jsonData);
                        continue;
                      }
                      newStructure=JSON.parse(JSON.stringify(jsonData.data[g].structure));
                    }
                    for(let i=0;i<this.mapLayerData.length;i++){
                      if(ID==this.mapLayerData[i].id){
                        if(newMembers!==undefined){
                          this.mapLayerData[i].members=newMembers;
                        }
                        if(newStructure!==undefined){
                          this.mapLayerData[i].structure=newStructure;
                          if(this.QIR.hasProperty(jsonData.data,'templateVary')){
                            if(jsonData.data.templateVary===true){
                              let newCustom=newStructure[1];
                              if(this.QIR.hasProperty(newCustom,'template')){
                                let newTmp=newCustom.template;
                                if(this.QIR.hasProperty(newTmp,'id') && typeof newTmp.id==='string'){
                                  let splitArray=this.lastUpdateTmpId.split(':');
                                  this.lastUpdateTmpId=newTmp.id+':'+parseInt(splitArray[1])+1;
                                }
                              }
                            }
                          }
                        }
                        if(newMembers!==undefined || newStructure!==undefined){
                          IDS.push(ID);//更新图层
                        }
                      }
                    }
                  }
                  this.updateLayerIds.push(...IDS);
                  break;
                }
                case 'updateLayerOrder':{
                  if(!this.QIR.hasProperty(jsonData,'data'))break;
                  if(!this.QIR.isObject(jsonData.data))break;
                  if(!this.QIR.hasProperty(jsonData.data,'members'))break;
                  try{
                    let order=JSON.parse(JSON.stringify(jsonData.data.members));
                    if(Array.isArray(order)){
                      this.mapLayerOrder=order;
                    }
                  }
                  catch(e){
                    console.log(e);
                    this.onLog('指令解析失败','error',jsonData);
                  }
                  break;
                }
                case 'renameLayer':{
                  if(!this.QIR.hasProperty(jsonData,'data'))break;
                  if(!this.QIR.isObject(jsonData.data))break;
                  if(!this.QIR.hasProperty(jsonData.data,'id'))break;
                  if(!this.QIR.hasProperty(jsonData.data,'name'))break;
                  let len=this.mapLayerData.length;
                  for(let i=0;i<len;i++){
                    if(this.mapLayerData[i]['id']===Number(jsonData.data.id)){
                      this.mapLayerData[i]['structure'][0]=jsonData.data.name;
                      this.mapLayerData[i]['structure'].push(0);//强制更新视图
                      this.mapLayerData[i]['structure'].pop();//强制更新视图
                      break;
                    }
                  }
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
            default:{this.onLog('无法解析指令','error',jsonData);}
          }
          }
          else{this.onLog('无法解析指令','error',jsonData);}
        }
        onClose(){//断开连接事件
          this.isLink=false;
          this.onLog('服务器连接中断','warn');
          return true;
        }
        onError(){//连接失败事件
          this.isLink=false;
          this.onLog('服务器连接失败','warn');
          return true;
        }
        onOpen(){//连接成功事件
          this.isLink=true;
          this.onLog('服务器连接成功','tip');
          this.getServerPublickey();//获取公钥
          this.getServerConfig();//获取服务器配置
          return true;
        }
      },
      mixCanvas:class mixCanvas{//混合地图数据渲染类
        $configs={//渲染范围配置；$开头的为私有属性，请通过内部函数修改私有属性
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
        $iNames=[//图标名称
          "usualIcon000.png","usualIcon001.png","usualIcon002.png","usualIcon003.png",
          "usualIcon004.png",
        ];
        $icons={//图标库
          //"icon_name":new Image();
          "usualIcon000.png":null,
          "usualIcon001.png":null,
          "usualIcon002.png":null,
          "usualIcon003.png":null,
          "usualIcon004.png":null,
        };
        $dom=null;
        $canvas=null;
        $cBlock=null;
        $cBlockDom=null;
        $drawCache=[
          /** Example
          {
            "id":23,//元素的id
            "path":new Path2D(),//缓存要素主路径
            "color":"#123456",//缓存要素主颜色
            "type":"line",//缓存要素类型
            "icon":null,//专用于带有图标的point
            "width":2,//专用于带有宽度的元素
            "path2":new Path2D()//专用于需要辅助路径的元素
          }
          **/
        ];
        $moving=false;//是否在移动视图中
        $moveDraw={//在移动过程中出现的新增或变动的元素渲染
          /* 类型解释
           * 'join'表示新增或弹入的元素(弹入指的是元素被取消选中后需要重新回到mixCanvas的渲染列表中)
           * 'out'表示删除或弹出的元素id(弹出指的是元素被选中后需要移除出mixCanvas的渲染列表)
           * 'element'存放的需要在移动过程中单独渲染的元素(渲染顺序按照join中的元素id)
           */
          join:[
            // 23
          ],
          out:[
            //  45,
            //  58
          ],
          element:{
            // "23":{
            //  id: 23,
            //  type: 'point',
            //  point: {x: 234, y: 567},
            //  color: 'aabbcc',
            //  width: 8
            // }
          }
        };
        pipeline=null;
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
          this.iconBuild();
          this.pipelineCheck();
          this.canvasBuild();
          this.mixSetRenderRange();
          this.mixDraw();
        }
        /**
         iconBuild
         save icon to local
         **/
        iconBuild(){
          for(let key in this.$icons){
            if(Object.prototype.hasOwnProperty.call(this.$icons,key)){
              let img=new Image();
              img.src='../../static/icons/'+key;
              this.$icons[key]=img;
            }
          }
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
        * mixMove()的拆分函数
         * 且不包含mixWash()
         * 且不包含colorBlock渲染
        **/
        drawPoint(element){//渲染单个点元素
          let custom=element.custom;
          let icon;//图标名称
          let split=false;//false 默认渲染 true 图标渲染
          if(custom!==null){
            icon=custom.icon;
            if(this.$iNames.includes(icon)){
              split=true;
            }
          }
          if(split){
            let path=new Path2D();
            let XX=element.point.x;
            let YY=element.point.y;
            path.arc(XX,YY,12,0,Math.PI*2);
            this.$canvas.fillStyle='#'+element.color;//normal canvas
            this.$canvas.fill(path);
            this.$canvas.drawImage(this.$icons[icon],XX-13,YY-13, 26,26);//图标 13 是图标半径
          }
          else{
            let path=new Path2D();
            let XX=element.point.x;
            let YY=element.point.y;
            path.arc(XX,YY,element.width,0,Math.PI*2);
            this.$canvas.fillStyle='#'+element.color;//normal canvas
            this.$canvas.fill(path);
          }
        }
        drawLine(element){//渲染单个线段元素
          let path=new Path2D();
          let Len=element.points.length;
          path.moveTo(element.points[0].x, element.points[0].y);
          for(let i=1;i<Len;i++) {
            path.lineTo(element.points[i].x, element.points[i].y);}
          this.$canvas.lineWidth=element.width;//normal canvas
          this.$canvas.strokeStyle='#'+element.color;
          this.$canvas.lineJoin='round';
          this.$canvas.stroke(path);
        }
        drawArea(element){//渲染单个区域元素
          let path=new Path2D();
          let Len=element.points.length;
          path.moveTo(element.points[0].x, element.points[0].y);
          for(let i=1;i<Len;i++){
            path.lineTo(element.points[i].x, element.points[i].y);}
          path.closePath();
          this.$canvas.fillStyle='#'+element.color+'80';//normal canvas
          this.$canvas.fill(path);
        }
        drawCurve(element){//渲染单个曲线元素
          let path1=new Path2D();
          let path2=new Path2D();
          let points=element.points;
          let len=points.length;
          if(len<2)return;//确保有足够的点来绘制曲线
          path1.moveTo(points[0].x,points[0].y);
          let Leng=points.length-2;
          for(let i=1;i<Leng;i++){
            path1.quadraticCurveTo(
              points[i].x,points[i].y,
              ((points[i].x)+(points[i+1].x))/2,
              ((points[i].y)+(points[i+1].y))/2
            );
          }
          path1.quadraticCurveTo(// 最后两个点使用二次贝塞尔曲线连接
            points[points.length-2].x,
            points[points.length-2].y,
            points[points.length-1].x,
            points[points.length-1].y
          );
          this.$canvas.strokeStyle='#'+element.color;//设置绘图样式
          this.$canvas.lineWidth=element.width;
          this.$canvas.stroke(path1);

          path2.arc(points[0].x,points[0].y,element.width,0,Math.PI*2);
          path2.arc(points[len-1].x,points[len-1].y,element.width,0,Math.PI*2);
          this.$canvas.shadowBlur=10;//阴影模糊程度
          this.$canvas.fillStyle='#ffffff';
          this.$canvas.fill(path2);
          this.$canvas.shadowBlur=0;//重置阴影属性，防止影响后续绘图
        }
        /**
         *  set $moving
         **/
        moving(bool){
          this.$moving=bool;
        }
        /**
         *  set $moveDraw.out
         *   id: element id number
         *   bool: true=push , false=remove
         **/
        moveDrawOut(id,bool){
          if(bool){
            if(!this.$moveDraw.out.includes(id)){
              this.$moveDraw.out.push(id);
            }
          }else{
            this.$moveDraw.out.remove(id);
          }
        }
        /**
         *  set $moveDraw.join
         *   id: element id number
         *   bool: true=push , false=remove
         **/
        moveDrawJoin(id,bool){
          if(bool){
            if(!this.$moveDraw.join.includes(id)){
              this.$moveDraw.join.push(id);
            }
          }else{
            this.$moveDraw.join.remove(id);
          }
        }
        /**
         *  set $moveDraw.element
         *   id: element id number
         *   data: element  data obj
         **/
        moveDrawElement(id,data){
          const X=this.$configs.offsetX;//需要减除join前的移动偏移量
          const Y=this.$configs.offsetY;
          const L=data.points.length;
          data.point.x-=X;
          data.point.y-=Y;
          for(let i=0;i<L;i++){
            data.points[i].x-=X;
            data.points[i].y-=Y;
          }
          this.$moveDraw.element[id]=data;
        }
        /**
         *  get drawCacheObj
         **/
        drawCacheObj(id,path,color,type,icon,width,path2){
          return{
            id,path,color,type,icon,width,path2
          };
        }
        /**
         *need check pipeline healthy
        **/
        mixMove(){//移动视图
          /*mixWash()*/
          this.$canvas.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);
          this.$cBlock.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);

          this.$canvas.save();//保存当前坐标系
          this.$canvas.translate(this.$configs.offsetX,this.$configs.offsetY);//移动坐标系
          let Len=this.$drawCache.length;
          let Out=this.$moveDraw.out;//Array
          let len=this.$moveDraw.out.length;//Array length
          let Join=this.$moveDraw.join;//Array
          let LEN=this.$moveDraw.join.length;//Array length
          for(let i=0;i<Len;i++){
            if(len!==0){//移动过程中弹出的不渲染
              if(Out.includes(this.$drawCache[i].id)){continue;}
            }
            if(LEN!==0){//移动过程中新增或重新弹入的单独在最后渲染
              if(Join.includes(this.$drawCache[i].id)){continue;}
            }
            if(this.$drawCache[i].type==='area'){
              this.$canvas.fillStyle=this.$drawCache[i].color;
              this.$canvas.fill(this.$drawCache[i].path);
            }
            else if(this.$drawCache[i].type==='line'){
              this.$canvas.lineWidth=this.$drawCache[i].width;
              this.$canvas.strokeStyle=this.$drawCache[i].color;
              this.$canvas.lineJoin='round';
              this.$canvas.stroke(this.$drawCache[i].path);
            }
            else if(this.$drawCache[i].type==='curve'){
              this.$canvas.strokeStyle=this.$drawCache[i].color;
              this.$canvas.lineWidth=this.$drawCache[i].width;
              this.$canvas.stroke(this.$drawCache[i].path);
              this.$canvas.shadowBlur=10;//阴影模糊程度
              this.$canvas.fillStyle='#ffffff';
              this.$canvas.fill(this.$drawCache[i].path2);
              this.$canvas.shadowBlur=0;
            }
            else if(this.$drawCache[i].type==='point'){
              this.$canvas.fillStyle=this.$drawCache[i].color;
              this.$canvas.fill(this.$drawCache[i].path);
            }
            else if(this.$drawCache[i].type==='icon'){
              this.$canvas.fillStyle=this.$drawCache[i].color;
              this.$canvas.fill(this.$drawCache[i].path);
              this.$canvas.drawImage(
                this.$icons[this.$drawCache[i]['icon']['icon']],
                this.$drawCache[i]['icon']['XX']-13,
                this.$drawCache[i]['icon']['YY']-13,
                26,26);
            }
          }
          /*渲染移动过程中新增或重新弹入的元素*/
          for(let p=0;p<LEN;p++){
            let id=this.$moveDraw.join[p];
            if(id in this.$moveDraw.element){
              let type=this.$moveDraw.element[id].type;
              switch(type){
                case 'point':{
                  this.drawPoint(this.$moveDraw.element[id]);
                  break;
                }
                case 'line':{
                  this.drawLine(this.$moveDraw.element[id]);
                  break;
                }
                case 'area':{
                  this.drawArea(this.$moveDraw.element[id]);
                  break;
                }
                case 'curve':{
                  this.drawCurve(this.$moveDraw.element[id]);
                  break;
                }
              }
            }
          }
          this.$canvas.restore();//恢复原来的坐标系
        }
        mixWash(){//清洗canvas和colorBlock，已集成在mixDraw()中
          if(!this.$configs.pipelineHealthy){return false;}
          this.$canvas.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);
          this.$cBlock.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);
          this.$manage.colorLinks={};
        }
        mixDraw(){//绘制元素并同时绘制色块并建立色块与元素的映射关系
          if(this.$moving)return false;//移动过程中不能使用mixDraw()，使用mixMove()替代
          if(this.$configs.renderRangeX<=0 || this.$configs.renderRangeY<=0)return false;//当渲染范围为小于等于0时不渲染
          if(!this.$configs.pipelineHealthy)return false;

          /*mixWash()*/
          this.$canvas.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);
          this.$cBlock.clearRect(0,0,this.pipeline.options.viewWidth,this.pipeline.options.viewHeight);
          this.$manage.colorLinks={};
          this.$moveDraw.out.length=0;
          this.$moveDraw.join.length=0;
          this.$moveDraw.element={};
          this.$drawCache.length=0;//清空之前的缓存

          let pLen=this.pipeline.elements.points.length;
          let cLen=this.pipeline.elements.curves.length;
          let lLen=this.pipeline.elements.lines.length;
          let aLen=this.pipeline.elements.areas.length;
          let offsetX=this.$configs.offsetX;
          let offsetY=this.$configs.offsetY;
          let cBlockNum=Number(8388608);//(16^6)*0.5=8388608?预留了一半的颜色用于显示其他内容
          let added=Math.floor(8388608/(pLen+cLen+lLen+aLen+100));//?floor(8388608/(元素总数量+预留数量))=递增值

          for(let i=0;i<aLen;i++){//先后渲染顺序区域->线段->曲线->点
            if(!this.renderRangeCheck(this.pipeline.elements.areas[i])){
              continue;
            }
            if(this.pipeline.options.mapHiddenElements.has(this.pipeline.elements.areas[i].id)){
              continue;
            }
            if(this.pipeline.options.mapEjectElements.has(this.pipeline.elements.areas[i].id)){
              continue;
            }
            let colorBlock=cBlockNum.toString(16).padStart(6,'0');
            this.addArea(this.pipeline.elements.areas[i],colorBlock,offsetX,offsetY);
            this.addColorLinks(this.pipeline.elements.areas[i],colorBlock);
            cBlockNum+=added;
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
            let colorBlock=cBlockNum.toString(16).padStart(6,'0');
            this.addLine(this.pipeline.elements.lines[i],colorBlock,offsetX,offsetY);
            this.addColorLinks(this.pipeline.elements.lines[i],colorBlock);
            cBlockNum+=added;
          }
          for(let i=0;i<cLen;i++){
            if(!this.renderRangeCheck(this.pipeline.elements.curves[i])){
              continue;
            }
            if(this.pipeline.elements.curves[i].points===undefined){
              continue;
            }
            if(this.pipeline.options.mapHiddenElements.has(this.pipeline.elements.curves[i].id)){
              continue;
            }
            if(this.pipeline.options.mapEjectElements.has(this.pipeline.elements.curves[i].id)){
              continue;
            }
            let colorBlock=cBlockNum.toString(16).padStart(6,'0');
            this.addCurve(this.pipeline.elements.curves[i],colorBlock,offsetX,offsetY);
            this.addColorLinks(this.pipeline.elements.curves[i],colorBlock);
            cBlockNum+=added;
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
            let colorBlock=cBlockNum.toString(16).padStart(6,'0');
            this.addPoint(this.pipeline.elements.points[i],colorBlock,offsetX,offsetY);
            this.addColorLinks(this.pipeline.elements.points[i],colorBlock);
            cBlockNum+=added;
          }
        }
        mixColorBlockView(){//显示mixColorBlock 调试用途
          let body=document.getElementsByTagName('BODY');
          this.$cBlockDom.setAttribute('style',
            'position:fixed;'+
            'z-index:999999;'+
            'left:0;'+
            'top:0;'+
            'pointer-events:none;'
            // +'background-color:#FFFFFF' 纯白背景色
        );
          body[0].appendChild(this.$cBlockDom);
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
        mixGetElementByXY(x,y){//通过获取该坐标下的色块颜色,查询渲染此颜色对应的元素是什么(colorLinks)
          if(!this.$configs.pipelineHealthy)return false;
          const pixelData = this.$cBlock.getImageData(x, y, 1, 1).data;
          const colorA = ((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16);
          const colorB = ('000000' + colorA).slice(-6);
          if(this.$manage.colorLinks.hasOwnProperty(colorB))return this.$manage.colorLinks[colorB];
          return false;
        }
        canvasBuild(){//创建基本canvas与虚拟canvas
          if(!this.$configs.pipelineHealthy){return false;}
          this.$dom=document.getElementById(this.pipeline.el);
          this.$dom.setAttribute('width',this.pipeline.options.viewWidth+'px');
          this.$dom.setAttribute('height',this.pipeline.options.viewHeight+'px');
          this.$canvas=this.$dom.getContext('2d');
          this.$canvas.shadowColor='rgba(0, 0, 0, 0.5)';//默认阴影颜色

          this.$cBlockDom=document.createElement('CANVAS');
          this.$cBlockDom.setAttribute('width',this.pipeline.options.viewWidth+'px');
          this.$cBlockDom.setAttribute('height',this.pipeline.options.viewHeight+'px');
          this.$cBlockDom.setAttribute('id','mixCanvasColorBlock');
          this.$cBlock=this.$cBlockDom.getContext('2d',{willReadFrequently:true});//willReadFrequently:true?优化getImageData()的性能
          this.$cBlock.imageSmoothingEnabled=false;//禁用图像平滑?点击色块边缘时会存在偏色问题
        }

        /**
         *no check pipeline healthy
        **/
        addPoint(element,colorBlock,offsetX,offsetY){//添加点，需要完整的元素数据和色块
          let id=element.id;
          let custom=element.custom;
          let icon;//图标名称
          let split=false;//false 默认渲染 true 图标渲染
          if(custom!==null){
            icon=custom.icon;
            if(this.$iNames.includes(icon)){
              split=true;
            }
          }
          if(split){
            let path=new Path2D();
            let XX=element.point.x+offsetX;
            let YY=element.point.y+offsetY;
            path.arc(XX,YY,12,0,Math.PI*2);

            this.$canvas.fillStyle='#'+element.color;//normal canvas
            this.$canvas.fill(path);
            this.$canvas.drawImage(this.$icons[icon],XX-13,YY-13, 26,26);//图标 13 是图标半径

            this.$cBlock.fillStyle='#'+colorBlock;//color block canvas
            this.$cBlock.fill(path);

            this.$drawCache.push(this.drawCacheObj(
              id,
              path,
              '#'+element.color,
              'icon',
              {icon,XX,YY}
            ));
          }
          else{
            let path=new Path2D();
            let XX=element.point.x+offsetX;
            let YY=element.point.y+offsetY;
            path.arc(XX,YY,element.width,0,Math.PI*2);
            this.$canvas.fillStyle='#'+element.color;//normal canvas
            this.$canvas.fill(path);

            this.$cBlock.fillStyle='#'+colorBlock;//color block canvas
            this.$cBlock.fill(path);

            this.$drawCache.push(this.drawCacheObj(
              id,
              path,
              '#'+element.color,
              'point'
            ));
          }
        }
        addLine(element,colorBlock,offsetX,offsetY){//添加线，需要完整的元素数据和色块
          let path=new Path2D();
          let id=element.id;
          let Len=element.points.length;
          path.moveTo(element.points[0].x+offsetX, element.points[0].y+offsetY);
          for(let i=1;i<Len;i++) {
          path.lineTo(element.points[i].x+offsetX, element.points[i].y+offsetY);}
          this.$canvas.lineWidth=element.width;//normal canvas
          this.$canvas.strokeStyle='#'+element.color;
          this.$canvas.lineJoin='round';
          this.$canvas.stroke(path);

          this.$cBlock.lineWidth=(parseInt(element.width, 10)+1)<=3?4:parseInt(element.width,10)+1;//color block canvas?+1扩大1px渲染范围增大mixGetElementByXY()的容错
          this.$cBlock.strokeStyle='#'+colorBlock;
          this.$cBlock.lineJoin='round';
          this.$cBlock.stroke(path);

          this.$drawCache.push(this.drawCacheObj(
            id,
            path,
            '#'+element.color,
            'line',
            undefined,
            element.width
          ));
        }
        addArea(element,colorBlock,offsetX,offsetY){//添加区域，需要完整的元素数据和色块
          let path=new Path2D();
          let id=element.id;
          let Len=element.points.length;
          path.moveTo(element.points[0].x+offsetX, element.points[0].y+offsetY);
          for(let i=1;i<Len;i++){
          path.lineTo(element.points[i].x+offsetX, element.points[i].y+offsetY);}
          path.closePath();
          this.$canvas.fillStyle='#'+element.color+'80';//normal canvas
          this.$canvas.fill(path);
          this.$cBlock.fillStyle='#'+colorBlock;//color block canvas
          this.$cBlock.fill(path);

          this.$drawCache.push(this.drawCacheObj(
            id,
            path,
            '#'+element.color+'80',
            'area'
          ));
        }
        addCurve(element,colorBlock,offX,offY){//添加曲线，需要完整的元素数据和色块
          let path1=new Path2D();
          let path2=new Path2D();
          let id=element.id;
          let points=element.points;
          let len=points.length;
          if(len<2)return;//确保有足够的点来绘制曲线
          path1.moveTo(points[0].x+offX,points[0].y+offY);
          let Leng=points.length-2;
          for(let i=1;i<Leng;i++){
          path1.quadraticCurveTo(
            points[i].x+offX,points[i].y+offY,
            ((points[i].x+offX)+(points[i+1].x+offX))/2,
            ((points[i].y+offY)+(points[i+1].y+offY))/2
          );
          }
          path1.quadraticCurveTo(// 最后两个点使用二次贝塞尔曲线连接
            points[points.length-2].x+offX,
            points[points.length-2].y+offY,
            points[points.length-1].x+offX,
            points[points.length-1].y+offY
          );
          this.$canvas.strokeStyle='#'+element.color;//设置绘图样式
          this.$canvas.lineWidth=element.width;
          this.$canvas.stroke(path1);

          let radius=element.width<=2?2:element.width-2;
          path2.arc(points[0].x+offX,points[0].y+offY,radius,0,Math.PI*2);
          path2.arc(points[len-1].x+offX,points[len-1].y+offY,radius,0,Math.PI*2);
          this.$canvas.shadowBlur=10;//阴影模糊程度
          this.$canvas.fillStyle='#ffffff';
          this.$canvas.fill(path2);
          this.$canvas.shadowBlur=0;//重置阴影属性，防止影响后续绘图

          this.$cBlock.strokeStyle='#'+colorBlock;//color block canvas
          this.$cBlock.fillStyle='#'+colorBlock;
          this.$cBlock.lineWidth=(parseInt(element.width, 10)+1)<=3?4:parseInt(element.width,10)+1;//?+1扩大1px渲染范围增大mixGetElementByXY()的容错
          this.$cBlock.stroke(path1);
          this.$cBlock.fill(path2);

          this.$drawCache.push(this.drawCacheObj(
            id,
            path1,
            '#'+element.color,
            'curve',
            undefined,
            element.width,
            path2
          ));
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
            window.logConfig.message.from='external:instructPipe';
            window.logConfig.message.type=type;
          }catch (e) {
            lock=true;
          }
          if(lock){
            reset();
          }
        }
      },
      tmpProof:class tmpProof{//templateCheck模板校验工具__Version(1.0)
        $language='english';// or 'chinese'
        constructor(language){
          if(typeof this.$language==='string')this.$language=language;
        }
        /*
         * 字符串数据类型
         */
        Text(str){
          str=typeof str==='string'?str:'';
          return '☍t'+str;
        }
        List_(str){
          str=typeof str==='string'?str:'';
          return '☍l'+str;
        }
        Date(str){
          str=typeof str==='string'?str:'';
          return '☍d'+str;
        }
        Time(str){
          str=typeof str==='string'?str:'';
          return '☍m'+str;
        }
        Datetime(str){
          str=typeof str==='string'?str:'';
          return '☍e'+str;
        }
        Percent(str){
          str=typeof str==='string'?str:'';
          return '☍p'+str;
        }
        initialData(type){//type string
          switch (type){
            case 'text':return this.Text();
            case 'list':return this.List_();
            case 'percent':return this.Percent();
            case 'datetime':return this.Datetime();
            case 'date':return this.Date();
            case 'time':return this.Time();
            case 'number':return null;
            case 'bool':return false;
            default:return this.Text();
          }
        }
        GetContent(value){//获取数据的数据内容
          if(typeof value==='boolean' || typeof value==='number')return value;
          if(value===null)return null;
          return value.substr(2);
        }
        GetType(value){//获取数据的数据类型
          if(typeof value==='boolean')return 'bool';
          if(typeof value==='number')return 'number';
          if(value===null)return 'number';
          let tag=value.substring(0,2);
          if        (tag==='☍t'){return 'text';}
          else if(tag==='☍l'){return 'list';}
          else if(tag==='☍d'){return 'date';}
          else if(tag==='☍m'){return 'time';}
          else if(tag==='☍e'){return 'datetime';}
          else if(tag==='☍p'){return 'percent';}
          else {return 'text';}//异常的没有数据符号的数据
        }
        /*
         * 转化相关函数
         */
        datetimeToDate(datetime){
          if(this.isDatetime(datetime)){
            return datetime.substring(0,10);
          }else{
            return '';
          }
        }
        datetimeToTime(datetime){
          if(this.isDatetime(datetime)){
            return datetime.substr(11);
          }else{
            return '';
          }
        }
        dateToDatetime(date){
          if(this.isDate(date)){
            return date+'T00:00:00';
          }else {
            return '';
          }
        }
        dateToTime(date){
          if(this.isDate(date)){
            return '00:00:00';
          }else{
            return '';
          }
        }
        timeToDatetime(){
          return '';
        }
        timeToDate(){
          return '';
        }
        /**
         * 数据转化
         * @param value | String|Number|Boolean|Null
         * @param type | String
         * @return {Object,String,Number,Boolean,Null}
         **/
        conversion(value,type){
          /**
           * 特殊情况处理
           * (number类型的值可以为null)
           * 若要转化为字符串类型的数据则返回对应空值
           * 若要转化为number则返回源值
           * 若要转化为bool则返回false
           **/
          if(value===null){
            switch(type){
              case 'text':{return this.Text();}
              case 'datetime':{return this.Datetime();}
              case 'date':{return this.Date();}
              case 'time':{return this.Time();}
              case 'list':{return this.List_();}
              case 'percent':{return this.Percent();}
              case 'bool':{return false;}
              case 'number':{return value;}
              default:{return value;}
            }
          }
          /**
           * 数据类型检测
           **/
          let fail={state:false,message:'fail'};
          let jsTypes=['string','number','boolean'];
          let dtTypes=['text','datetime','date','time','list','percent','bool','number'];
          let jsType=typeof value;//旧数据的js数据类型
          let oldType;//源数据类型
          let tag;//数据符号类型
          let content;//数据内容
          if(!jsTypes.includes(jsType))return fail;
          if(!dtTypes.includes(type))return fail;
          if(jsType==='string'){
            tag=value.substring(0,2);
            if        (tag==='☍t'){oldType='text';content=value.substr(2);}
            else if(tag==='☍l'){oldType='list';content=value.substr(2);}
            else if(tag==='☍d'){oldType='date';content=value.substr(2);}
            else if(tag==='☍m'){oldType='time';content=value.substr(2);}
            else if(tag==='☍e'){oldType='datetime';content=value.substr(2);}
            else if(tag==='☍p'){oldType='percent';content=value.substr(2);}
            else {oldType='text';content=value;}//异常的没有数据符号的字符串数据
          }
          else if(jsType==='number'){
            oldType='number';
          }
          else if(jsType==='boolean'){
            oldType='bool';
          }
          /**
           * 转化内容
           **/
          switch (oldType){
            case 'text':{
              switch (type){
                case 'text':{
                  return value;//返回原值
                }
                case 'datetime':{
                  if(this.isDatetime(content)){
                    return this.Datetime(content);
                  }else{
                    return this.Datetime();
                  }
                }
                case 'date':{
                  if(this.isDate(content)){
                    return this.Date(content);
                  }else{
                    return this.Date();
                  }
                }
                case 'time':{
                  if(this.isTime(content)){
                    return this.Time(content);
                  }else{
                    return this.Time();
                  }
                }
                case 'list':{
                  return this.List_(content);//保留源内容
                }
                case 'percent':{
                  if(this.isPercent(content)){
                    return this.Percent(content);//保留源内容
                  }
                  let number=Number(content)*100;
                  if(this.isNumber(number)){
                    return this.Percent(number+'%');
                  }
                  return this.Percent('0%');
                }
                case 'bool':{
                  return content === '1' || content === '100%';
                }
                case 'number':{
                  if(this.isPercent(content)){
                    let number1=parseFloat(content)/100;//末尾包含%不能使用Number(content)
                    if(this.isNumber(number1)){
                      return number1;
                    }else{
                      return 0;
                    }
                  }
                  let number2=Number(content);
                  if(this.isNumber(number2)){
                    return number2;
                  }
                  return 0;
                }
                default:{return this.Text();}
              }
            }
            case 'datetime':{
              switch(type){
                case 'text':{return this.Text(content);}
                case 'datetime':{return value;}//返回源值
                case 'date':{return this.Date(this.datetimeToDate(content));}
                case 'time':{return this.Time(this.datetimeToTime(content));}
                case 'list':{return this.List_(content);}
                case 'percent':{return this.Percent();}
                case 'bool':{return false;}
                case 'number':{return 0;}
                default:{return this.Datetime();}
              }
            }
            case 'date':{
              switch(type){
                case 'text':{return this.Text(content);}
                case 'datetime':{return this.Datetime(this.dateToDatetime(content));}
                case 'date':{return value;}//返回源值
                case 'time':{return this.Time(this.dateToTime(content));}
                case 'list':{return this.List_(content);}
                case 'percent':{return this.Percent();}
                case 'bool':{return false;}
                case 'number':{return 0;}
                default:{return this.Date();}
              }
            }
            case 'time':{
              switch(type){
                case 'text':{return this.Text(content);}
                case 'datetime':{return this.Datetime(this.timeToDatetime());}
                case 'date':{return this.Date(this.timeToDate());}
                case 'time':{return value;}//返回源值
                case 'list':{return this.List_(content);}
                case 'percent':{return this.Percent();}
                case 'bool':{return false;}
                case 'number':{return 0;}
                default:{return this.Time();}
              }
            }
            case 'list':{

              switch (type){
                case 'text':{

                  return this.Text(content);//保留源内容
                }
                case 'datetime':{
                  if(this.isDatetime(content)){
                    return this.Datetime(content);
                  }else{
                    return this.Datetime();
                  }
                }
                case 'date':{
                  if(this.isDate(content)){
                    return this.Date(content);
                  }else{
                    return this.Date();
                  }
                }
                case 'time':{
                  if(this.isTime(content)){
                    return this.Time(content);
                  }else{
                    return this.Time();
                  }
                }
                case 'list':{
                  return value;//返回原值
                }
                case 'percent':{
                  if(this.isPercent(content)){
                    return this.Percent(content);//保留源内容
                  }
                  let number=Number(content)*100;
                  if(this.isNumber(number)){
                    return this.Percent(number+'%');
                  }
                  return this.Percent('0%');
                }
                case 'bool':{
                  return content === '1' || content === '100%';
                }
                case 'number':{
                  if(this.isPercent(content)){
                    let number1=parseFloat(content)/100;//末尾包含%不能使用Number(content)
                    if(this.isNumber(number1)){
                      return number1;
                    }else{
                      return 0;
                    }
                  }
                  let number2=Number(content);
                  if(this.isNumber(number2)){
                    return number2;
                  }
                  return 0;
                }
                default:{return this.List_();}
              }
            }
            case 'percent':{
              switch(type){
                case 'text':{return this.Text(content);}
                case 'datetime':{return this.Datetime();}
                case 'date':{return this.Date();}
                case 'time':{return this.Time();}
                case 'list':{return this.List_(content);}
                case 'percent':{return value;}//返回源值
                case 'bool':{return content === '100%';}
                case 'number':{
                  let number=parseFloat(content)/100;
                  if(this.isNumber(number)){
                    return number;
                  }else {
                    return 0;
                  }
                }
                default:{return this.Percent();}
              }
            }
            /**
             * number bool 无 tag 和 content 值
            **/
            case 'number':{//数字转其他类型
              /**
               * 特殊情况
               * NaN \ Infinity \ -Infinity
               * 全部视作0
               **/
              if(isNaN(value) || value===Infinity || value===-Infinity)value=0;
              switch(type){
                case 'text':{
                  return this.Text(value.toString());
                }
                case 'datetime':{
                  return this.Datetime();
                }
                case 'date':{
                  return this.Date();
                }
                case 'time':{
                  return this.Time();
                }
                case 'list':{
                  return this.List_(value.toString());
                }
                case 'percent':{
                  let number=value*100;
                  if(number!==Infinity){
                    return this.Percent(number+'%');
                  }else {
                    return this.Percent('0%');
                  }
                }
                case 'bool':{
                  return value===1;
                }
                case 'number':{
                  return value;
                }
                default:{return 0;}
              }
            }
            case 'bool':{//布尔转其他类型
              switch (type){
                case 'text':{
                  return value?this.Text('1'):this.Text('0');
                }
                case 'datetime':{
                  return this.Datetime();
                }
                case 'date':{
                  return this.Date();
                }
                case 'time':{
                  return this.Time();
                }
                case 'list':{
                  return value?this.List_('1'):this.List_('0');
                }
                case 'percent':{
                  return value?this.Percent('100%'):this.Percent('0%');
                }
                case 'number':{
                  return value?1:0;
                }
                case 'bool':{
                  return value;
                }
                default:{return false;}
              }
            }
          }
        }
        /*
         * check function 检查函数
         */
        isValidTime(str){//检测字符串是否是时间格式-正确则返回true
          const reg = /^☍m([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])(:([0-5]?[0-9]))?$/;
          return reg.test(str);
        }
        isTime(str){//isValidTime的变体，不检查类型符号
          const reg = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])(:([0-5]?[0-9]))?$/;
          return reg.test(str);
        }
        isValidDate(str){//检查一个字符串是否符合标准日期格式
          const reg = /^☍d\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
          return reg.test(str);
        }
        isDate(str){//isValidDate的变体，不检查类型符号
          const reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
          return reg.test(str);
        }
        isValidDatetime(str){//检查一个字符串是否符合标准时间格式
          const reg = /^☍e\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
          return reg.test(str);
        }
        isDatetime(str){//isValidDatetime的变体，不检查类型符号
          const reg = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
          return reg.test(str);
        }
        isAllowPercent(value){//检测字符串是否是百分数
          const reg = /^☍p-?\d+(\.\d+)?%$/;
          return reg.test(value);
        }
        isPercent(value){//isAllowPercent的变体，不检查类型符号
          const reg = /^-?\d+(\.\d+)?%$/;
          return reg.test(value);
        }
        isAllowList(value){//检测list字符串是否正确-正确则返回true
          const reg = /^☍l(?!.*,,)(?=.*[^,]$)/;
          return reg.test(value);
        }
        isAllowId(id){//检测模板id是否正确-正确则返回true
          const reg = /^[0-9a-zA-Z]{8,14}$/;
          return reg.test(id);
        }
        isIntegerP(value){//判断一个数字是否为正整数P:positive
          return Number.isInteger(value) && value>0;
        }
        isNumber(value){//判断一个值是否为数字(不包含无限和NaN)
          if(typeof value!=='number')return false;
          if(isNaN(value))return false;
          return !(value === -Infinity || value === Infinity);
        }
        isColor16(color){//检测一个字符串是否是标准的16进制颜色-正确则返回true
          const regex=/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
          return regex.test(color);
        }
        isAllowValueTyp(type,value){//依据type检测value(或default)是否是正确的type类型-正确则返回true
          switch (type) {
            case 'text':{
              if(typeof value==='string'){
                return value.substring(0, 2) === '☍t';
              }else{
                return false;
              }
            }
            case 'number':{
              return typeof value === 'number';
            }
            case 'datetime':{
              if(typeof value!=='string')return false;
              return this.isValidDatetime(value);
            }
            case 'date':{
              if(typeof value!=='string')return false;
              return this.isValidDate(value);
            }
            case 'time':{
              if(typeof value!=='string')return false;
              return this.isValidTime(value);
            }
            case 'bool':{
              return typeof value === 'boolean';
            }
            case 'list':{
              if(typeof value!=='string')return false;
              return this.isAllowList(value);
            }
            case 'percent':{
              if(typeof value!=='string')return false;
              return this.isAllowPercent(value);
            }
          }
        }
        isAllowMethod(type,method){//判断method是否为type允许使用的方法-正确则返回true
          switch (type){
            case 'number':{
              return ['equ','nequ','gre','greq','les','lesq','mod0','nmod0'].includes(method);
            }
            case 'percent':{
              return ['equ','nequ','gre','greq','les','lesq'].includes(method);
            }
            case 'datetime':{
              return ['equ','nequ','gre','greq','les','lesq'].includes(method);
            }
            case 'date':{
              return ['equ','nequ','gre','greq','les','lesq'].includes(method);
            }
            case 'time':{
              return ['equ','nequ','gre','greq','les','lesq'].includes(method);
            }
            case 'bool':{
              return ['equ','nequ'].includes(method);
            }
            case 'list':{
              return ['equ','nequ'].includes(method);
            }
            case 'text':{
              return ['equ','nequ'].includes(method);
            }
            default:{
              return false;
            }
          }
        }
        isAllowValueTypL(type,value){//依据type检测value(或default)是否是type类型的数据以及长度是否合理-正确则返回true
          switch (type) {
            case 'text':{
              if(typeof value!=='string')return false;
              if(value.substring(0,2)!=='☍t')return false;
              return value.length <= 2002;
            }
            case 'list':{
              if(typeof value!=='string')return false;
              return this.isAllowList(value);
            }
            case 'date':{
              if(typeof value!=='string')return false;
              return this.isValidDate(value);
            }
            case 'time':{
              if(typeof value!=='string')return false;
              return this.isValidTime(value);
            }
            case 'datetime':{
              if(typeof value!=='string')return false;
              return this.isValidDatetime(value);
            }
            case 'percent':{
              if(typeof value!=='string')return false;
              return this.isAllowPercent(value);
            }
            case 'number':{
              if(typeof value!=='number')return false;
              return !(value===Infinity || value===-Infinity) ;
            }
            case 'bool':{
              return typeof value === 'boolean';
            }
          }
        }
        isDetailsType(str){//检测str是否为模板属性规定以内的类型-正确则返回true
          return ['text','number','datetime','date','time','bool','list','percent'].includes(str);
        }
        isNameDetails(obj){//检测是否obj是默认的name属性-正确则返回true
          let obj1={
            set:false,
            name:'name',
            default:'☍tunknown',
            type:'text'
          };
          const keys1 = Object.keys(obj1);
          const keys2 = Object.keys(obj);
          if (keys1.length !== keys2.length) {
            return false;
          }
          for (let key of keys1) {
            if (obj1[key] !== obj[key]) {
              return false;
            }
          }
          return true;
        }
        /**isAllowBasis检查某个规则依据是否正确
         * @param name string
         * @param type string
         * @param details array
         * @return boolean
         */
        isAllowBasis(name,type,details){
          const len=details.length;
          for(let i=0;i<len;i++){
            if(name===details[i].name && type===details[i].type){
              return true;
            }
          }
          return false;
        }
        codeExplain(code){//错误代码的解释
          let english=this.$language==='english';
          let A=code%100;//在第N项
          let B=(code-A);
          switch (B){
            case 500:{return english?'Template is null':'模板为空';}
            case 1000:{return english?'Template is not an object':'模板不是一个对象';}
            case 2000:{return english?'Template missing id attribute':'模板缺失id属性';}//A layer property check
            case 2100:{return english?'Template id value type error':'模板id值类型错误';}
            case 2200:{return english?'Template id value cannot be empty':'模板id值不能为空字符';}
            case 2300:{return english?'Template id does not comply with regulations':'模板id值不符合标准';}

            case 4000:{return english?'Template missing name attribute':'模板缺失name属性';}
            case 4100:{return english?'Template name value type error':'模板名称值类型错误';}
            case 4200:{return english?'Template name value cannot be empty':'模板名称值不能为空字符';}

            case 6000:{return english?'Template missing creator attribute':'模板缺失creator属性';}
            case 6100:{return english?'Template creator value type error':'模板创建者值类型错误';}
            case 6200:{return english?'Template creator value cannot be empty':'模板创建者值不能为空字符';}

            case 8000:{return english?'Template missing modify attribute':'模板缺少modify属性';}
            case 8100:{return english?'Template modify value type error':'模板编辑日期值类型错误';}
            case 8200:{return english?'Template modify value cannot be empty':'模板编辑日期值不能为空';}
            case 8300:{return english?'Template modify does not comply with regulations':'模板编辑日期值不符合标准';}

            case 10000: { return english ? 'Template missing locked attribute' : '模板缺失locked属性'; }
            case 10100: { return english ? 'Template locked value type error' : '模板locked值类型错误'; }

            case 12000: { return english ? 'Template missing explain attribute' : '模板缺失explain属性'; }
            case 12100: { return english ? 'Template explain value type error' : '模板描述信息值类型错误'; }

            case 14000: { return english ? 'Template missing typeRule attribute' : '模板缺失typeRule属性'; } //typeRule property check
            case 15000: { return english ? 'Template typeRule is not an object' : '模板typeRule不是一个对象'; }

            case 16000: { return english ? 'TypeRule missing point attribute' : '类型规则缺失point属性'; }
            case 17000: { return english ? 'TypeRule point value type error' : '类型规则point值类型错误'; }

            case 18000: { return english ? 'TypeRule missing line attribute' : '类型规则缺失line属性'; }
            case 19000: { return english ? 'TypeRule line value type error' : '类型规则line值类型错误'; }

            case 20000: { return english ? 'TypeRule missing area attribute' : '类型规则缺失area属性'; }
            case 21000: { return english ? 'TypeRule area value type error' : '类型规则area值类型错误'; }

            case 22000: { return english ? 'TypeRule missing curve attribute' : '类型规则缺失curve属性'; }
            case 23000: { return english ? 'TypeRule curve value type error' : '类型规则curve值类型错误'; }
            case 24000: { return english ? 'TypeRule at least one must be allowed' : '类型规则至少需要允许一个'; }

            case 30000: { return english ? 'Template missing detailsRule attribute' : '模板缺失detailsRule属性'; } //detailsRule property check
            case 30100: { return english ? 'Template detailsRule is not an array' : '模板detailsRule不是一个数组'; }
            case 30200: { return english ? 'Template detailsRule length cannot = 0' : '模板detailsRule长度不能为0'; }
            case 30300: { return english ? 'Template detailsRule length cannot > 90' : '模板detailsRule长度不能大于90'; }
            case 30400: { return english ? 'Template detailsRule first element type error' : '模板detailsRule第一个元素类型错误'; }
            case 30500: { return english ? 'Template detailsRule first element value error' : '模板detailsRule第一个元素值错误'; }

            case 31000: { return english ? 'Template detailsRule type error in:' + A + ' item' : '模板属性规则类型错误，在：' + A + '项'; }
            case 32000: { return english ? 'DetailsRule missing set attribute in:' + A + ' item' : '属性规则缺失set属性，在：' + A + '项'; }
            case 32100: { return english ? 'DetailsRule set value type error in:' + A + ' item' : '属性规则set值类型错误，在：' + A + '项'; }

            case 33000: { return english ? 'DetailsRule missing name attribute in:' + A + ' item' : '属性规则缺失name属性，在：' + A + '项'; }
            case 33100: { return english ? 'DetailsRule name value type error in:' + A + ' item' : '属性规则name值类型错误，在：' + A + '项'; }
            case 33200: { return english ? 'DetailsRule name value cannot be empty in:' + A + ' item' : '属性规则name值不能为空，在：' + A + '项'; }
            case 33300: { return english ? 'DetailsRule name value length cannot > 40 in:' + A + ' item' : '属性规则name值长度不能大于40，在：' + A + '项'; }
            case 33400: { return english ? 'DetailsRule name cannot duplicated:'+A+' item': '属性规则name值不能重复，在：' + A + '项';}


            case 35000: { return english ? 'DetailsRule missing type attribute in:' + A + ' item' : '属性规则缺失type属性，在：' + A + '项'; }
            case 35100: { return english ? 'DetailsRule type value type error in:' + A + ' item' : '属性规则type值类型错误，在：' + A + '项'; }
            case 35200: { return english ? 'DetailsRule type value undefined in:' + A + ' item' : '属性规则type值未定义，在：' + A + '项'; }


            case 37000: { return english ? 'DetailsRule missing default attribute in:' + A + ' item' : '属性规则缺失default属性，在：' + A + '项'; }
            case 37100: { return english ? 'DetailsRule default value type error in:' + A + ' item' : '属性规则default值类型错误，在：' + A + '项'; }

            case 40000: { return english ? 'Template missing colorRule attribute' : '模板缺失colorRule属性'; } //colorRule property check
            case 40100: { return english ? 'Template colorRule is not an object' : '模板颜色规则不是一个对象'; }
            case 40200: { return english ? 'ColorRule missing basis attribute' : '颜色规则缺失basis属性'; }
            case 40300: { return english ? 'ColorRule basis value type error' : '颜色规则basis值类型错误'; }
            case 40400: { return english ? 'ColorRule missing type attribute' : '颜色规则缺失type属性'; }
            case 40500: { return english ? 'ColorRule type value type error' : '颜色规则type值类型错误'; }
            case 40600: { return english ? 'The attribute on which the color rule is based is invalid' : '颜色规则所依据的属性无效'; }
            case 40700: { return english ? 'ColorRule missing condition attribute' : '颜色规则缺失condition属性'; }
            case 40800: { return english ? 'ColorRule condition is not an array' : '颜色规则condition不是一个数组'; }
            case 40900: { return english ? 'If the basis is empty, the type must be empty' : '如果basis为空，则type必须为空'; }
            case 41000: { return english ? 'If the basis is empty, the condition must be an empty array' : '如果basis为空，则condition必须是一个空数组'; }
            case 41100: { return english ? 'If the basis is not empty, the type cannot be empty' : '如果basis不为空，则type不能为空'; }
            case 41200: { return english ? 'ColorRule type value not allowed' : '颜色规则type值不允许'; }
            case 41300: { return english ? 'ColorRule item length cannot > 90' : '颜色规则数量不能大于90'; }

            case 42000: { return english ? 'ColorRule item is not an object in:' + A + ' item' : '此条颜色规则不是一个对象，在：' + A + '项'; }
            case 42100: { return english ? 'ColorRule item missing set attribute in:' + A + ' item' : '此条颜色规则缺失set属性，在：' + A + '项'; }
            case 42200: { return english ? 'ColorRule item set value type error in:'+A+' item': '此条颜色规则set值类型错误，在：' + A + '项';}

            case 43000: { return english ? 'ColorRule item missing color attribute in:' + A + ' item' : '此条颜色规则缺失color属性，在：' + A + '项'; }
            case 43100: { return english ? 'ColorRule item color value type error in:' + A + ' item' : '此条颜色规则color值类型错误，在：' + A + '项'; }
            case 43200: { return english ? 'ColorRule item color value format error in:' + A + ' item' : '此条颜色规则color值格式错误，在：' + A + '项'; }

            case 44000: { return english ? 'ColorRule item missing method attribute in:' + A + ' item' : '此条颜色规则缺失method属性，在：' + A + '项'; }
            case 44100: { return english ? 'ColorRule item method value type error in:' + A + ' item' : '此条颜色规则的method值类型错误，在：' + A + '项'; }
            case 44200: { return english ? 'ColorRule item method not allowed in:' + A + ' item' : '此条颜色规则的method不合理，在：' + A + '项'; }

            case 45000: { return english ? 'ColorRule item missing value attribute in:' + A + ' item' : '此条颜色规则缺失value属性，在：' + A + '项'; }
            case 45100: { return english ? 'ColorRule item value type not allowed in:' + A + ' item' : '此条颜色规则的value类型不合理，在：' + A + '项'; }
            case 45200: { return english ? 'ColorRule item value length cannot > 100 in:' + A + ' item' : '此条颜色规则的value字符长度不能大于100，在：' + A + '项'; }

            case 50000: { return english ? 'Template missing widthRule attribute' : '模板缺失widthRule属性'; } //widthRule property check
            case 50100: { return english ? 'Template widthRule is not an object' : '模板widthRule不是一个对象'; }
            case 50200: { return english ? 'WidthRule missing basis attribute' : '宽度规则缺失basis属性'; }
            case 50300: { return english ? 'WidthRule basis value type error' : '宽度规则basis值类型错误'; }
            case 50400: { return english ? 'WidthRule missing type attribute' : '宽度规则缺失type属性'; }
            case 50500: { return english ? 'WidthRule type value type error' : '宽度规则type值类型错误'; }
            case 50600: { return english ? 'The attribute on which the width rule is based is invalid' : '宽度规则所依据的属性无效'; }
            case 50700: { return english ? 'WidthRule missing condition attribute' : '宽度规则缺失condition属性'; }
            case 50800: { return english ? 'WidthRule condition is not an array' : '宽度规则condition不是一个数组'; }
            case 50900: { return english ? 'If the basis is empty, the type must be empty' : '宽度规则中，如果basis为空，则type必须为空'; }
            case 51000: { return english ? 'If the basis is empty, the condition must be an empty array' : '宽度规则中，如果basis为空，则condition必须是一个空数组'; }
            case 51100: { return english ? 'If the basis is not empty, the type cannot be empty' : '宽度规则中，如果basis不为空，则type不能为空'; }
            case 51200: { return english ? 'WidthRule type value not allowed' : '宽度规则type值不合理'; }
            case 51300: { return english ? 'WidthRule item length cannot > 90' : '宽度规则数量不能大于90'; }

            case 52000: { return english ? 'WidthRule item is not an object in:' + A + ' item' : '此条宽度规则不是一个对象，在：' + A + '项'; }
            case 52100: { return english ? 'WidthRule item missing set attribute in:' + A + ' item' : '此条宽度规则缺失set属性，在：' + A + '项'; }
            case 52200: { return english ? 'WidthRule item set value type error in:'+A+' item' : '此条宽度规则set值类型错误，在：' + A + '项';}

            case 53000: { return english ? 'WidthRule item missing width attribute in:' + A + ' item' : '此条宽度规则缺失width属性，在：' + A + '项'; }
            case 53100: { return english ? 'WidthRule item width value type error in:' + A + ' item' : '此条宽度规则width值类型错误，在：' + A + '项'; }
            case 53200: { return english ? 'WidthRule item width value must be integer in:' + A + ' item' : '此条宽度规则width值必须为整数，在：' + A + '项'; }

            case 54000: { return english ? 'WidthRule item missing method attribute in:' + A + ' item' : '此条宽度规则缺失method属性，在：' + A + '项'; }
            case 54100: { return english ? 'WidthRule item method value type error in:' + A + ' item' : '此条宽度规则的method值类型错误，在：' + A + '项'; }
            case 54200: { return english ? 'WidthRule item method not allowed in:' + A + ' item' : '此条宽度规则的method不合理，在：' + A + '项'; }

            case 55000: { return english ? 'WidthRule item missing value attribute in:' + A + ' item' : '此条宽度规则缺失value属性，在：' + A + '项'; }
            case 55100: { return english ? 'WidthRule item value type not allowed in:' + A + ' item' : '此条宽度规则的value类型不合理，在：' + A + '项'; }
            case 55200: { return english ? 'WidthRule item value length cannot > 100 in:' + A + ' item' : '此条宽度规则的value字符长度不能大于100，在：' + A + '项'; }
          }
        }
        /**
         * 模板检查，若正常则返回true，否则返回其他错误的代码
         * @param template | Object
         * @return {boolean,number}
         */
        tpCheck(template){
          if(template===null)return 500;
          let arr=[];
          let names=['name'];//details rule item.name
          let len=0;
          let count=0;
          let cType='';//color rule type
          let wType='';//width rule type
          function isObj(value){return typeof value==='object' && !Array.isArray(value) && value!==null;}


          if(!isObj(template))return 1000;


          if(!Object.prototype.hasOwnProperty.call(template,'id'))return 2000;//A layer property check
          if(typeof template.id!=='string')return 2100;
          if(template.id==='')return 2200;
          if(!this.isAllowId(template.id))return 2300;

          if(!Object.prototype.hasOwnProperty.call(template,'name'))return 4000;
          if(typeof template.name!=='string')return 4100;
          if(template.name==='')return 4200;

          if(!Object.prototype.hasOwnProperty.call(template,'creator'))return 6000;
          if(typeof template.creator!=='string')return 6100;
          if(template.creator==='')return 6200;

          if(!Object.prototype.hasOwnProperty.call(template,'modify'))return 8000;
          if(typeof template.modify!=='string')return 8100;
          if(template.modify==='')return 8200;
          if(!this.isDatetime(template.modify))return 8300;

          if(!Object.prototype.hasOwnProperty.call(template,'locked'))return 10000;
          if(typeof template.locked!=='boolean')return 10100;

          if(!Object.prototype.hasOwnProperty.call(template,'explain'))return 12000;
          if(typeof template.explain!=='string')return 12100;


          if(!Object.prototype.hasOwnProperty.call(template,'typeRule'))return 14000;//typeRule property check
          if(!isObj(template.typeRule))return 15000;
          if(!Object.prototype.hasOwnProperty.call(template.typeRule,'point'))return 16000;
          if(typeof template.typeRule.point!=='boolean')return 17000;
          if(template.typeRule.point)count++;
          if(!Object.prototype.hasOwnProperty.call(template.typeRule,'line'))return 18000;
          if(typeof template.typeRule.line!=='boolean')return 19000;
          if(template.typeRule.line)count++;
          if(!Object.prototype.hasOwnProperty.call(template.typeRule,'area'))return 20000;
          if(typeof template.typeRule.area!=='boolean')return 21000;
          if(template.typeRule.area)count++;
          if(!Object.prototype.hasOwnProperty.call(template.typeRule,'curve'))return 22000;
          if(typeof template.typeRule.curve!=='boolean')return 23000;
          if(template.typeRule.curve)count++;
          if(count<=0){return 24000;}


          if(!Object.prototype.hasOwnProperty.call(template,'detailsRule'))return 30000;//detailsRule property check
          if(!Array.isArray(template.detailsRule))return 30100;
          len=template.detailsRule.length;
          arr=template.detailsRule;
          if(len<=0)return 30200;
          if(len>90)return 30300;
          if(!isObj(arr[0]))return 30400;
          if(!this.isNameDetails(arr[0]))return 30500;
          for(let i=1;i<len;i++){
            if(!isObj(arr[i])){
              return 31000+i+1;
            }else {
              if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 32000+i+1;
              if(typeof arr[i].set!=='boolean')return 32100+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'name'))return 33000+i+1;
              if(typeof arr[i].name!=='string')return 33100+i+1;
              if(arr[i].name==='')return 33200+i+1;
              if(arr[i].name.length>40)return 33300+i+1;
              if(names.includes(arr[i].name)){return 33400+i+1;}//检测重复属性
              else{names.push(arr[i].name);}

              if(!Object.prototype.hasOwnProperty.call(arr[i],'type'))return 35000+i+1;
              if(typeof arr[i].type!=='string')return 35100+i+1;
              if(!this.isDetailsType(arr[i].type))return 35200+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'default'))return 37000+i+1;
              if(!this.isAllowValueTypL(arr[i].type,arr[i].default))return 37100+i+1;
            }
          }


          if(!Object.prototype.hasOwnProperty.call(template,'colorRule'))return 40000;//colorRule property check
          if(!isObj(template.colorRule))return 40100;
          if(!Object.prototype.hasOwnProperty.call(template.colorRule,'basis'))return 40200;
          if(typeof template.colorRule.basis!=='string')return  40300;
          if(!Object.prototype.hasOwnProperty.call(template.colorRule,'type'))return 40400;
          if(typeof template.colorRule.type!=='string')return  40500;
          if(template.colorRule.basis!==''){
          if(!this.isAllowBasis(template.colorRule.basis,template.colorRule.type,template.detailsRule))return 40600;
          }

          if(!Object.prototype.hasOwnProperty.call(template.colorRule,'condition'))return 40700;
          if(!Array.isArray(template.colorRule.condition))return  40800;
          if(template.colorRule.basis===''){//rule(A)如果basis为空则type和condition必须为空，如果basis不为空则type不能为空
            if(template.colorRule.type!=='')return 40900;
            if(template.colorRule.condition.length!==0)return 41000;
          }else{
            if(template.colorRule.type==='')return 41100;
            if(!this.isDetailsType(template.colorRule.type))return 41200;
          }
          len=template.colorRule.condition.length;
          if(len>90)return 41300;//规则条例最多90条
          arr=template.colorRule.condition;
          cType=template.colorRule.type;
          for(let i=0;i<len;i++){
            if(!isObj(arr[i])){
              return 42000+i+1;
            }else {
              if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 42100+i+1;
              if(typeof arr[i].set!=='boolean')return 42200+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'color'))return 43000+i+1;
              if(typeof arr[i].color!=='string')return 43100+i+1;
              if(!this.isColor16(arr[i].color))return 43200+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'method'))return 44000+i+1;
              if(typeof arr[i].method!=='string')return 44100+i+1;
              if(!this.isAllowMethod(cType,arr[i].method))return 44200+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'value'))return 45000+i+1;
              if(!this.isAllowValueTyp(cType,arr[i].value))return 45100+i+1;
              if(typeof arr[i].value==='string'){//rule(E)value的数据类型要与type一致，如果value为字符串，则字符长度不能超过100
                if(arr[i].value.length>100)return 45200+i+1;
              }
            }
          }


          if(!Object.prototype.hasOwnProperty.call(template,'widthRule'))return 50000;//widthRule property check
          if(!isObj(template.widthRule))return 50100;
          if(!Object.prototype.hasOwnProperty.call(template.widthRule,'basis'))return 50200;
          if(typeof template.widthRule.basis!=='string')return  50300;
          if(!Object.prototype.hasOwnProperty.call(template.widthRule,'type'))return 50400;
          if(typeof template.widthRule.type!=='string')return  50500;
          if(template.widthRule.basis!==''){
          if(!this.isAllowBasis(template.widthRule.basis,template.widthRule.type,template.detailsRule))return 50600;
          }

          if(!Object.prototype.hasOwnProperty.call(template.widthRule,'condition'))return 50700;
          if(!Array.isArray(template.widthRule.condition))return  50800;
          if(template.widthRule.basis===''){//rule(A)
            if(template.widthRule.type!=='')return 50900;
            if(template.widthRule.condition.length!==0)return 51000;
          }else{
            if(template.widthRule.type==='')return 51100;
            if(!this.isDetailsType(template.widthRule.type))return 51200;
          }
          len=template.widthRule.condition.length;
          if(len>90)return 51300;//规则条例最多90条
          arr=template.widthRule.condition;
          wType=template.widthRule.type;
          for(let i=0;i<len;i++){
            if(!isObj(arr[i])){
              return 52000+i+1;
            }else {
              if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 52100+i+1;
              if(typeof arr[i].set!=='boolean')return 52200+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'width'))return 53000+i+1;
              if(typeof arr[i].width!=='number')return 53100+i+1;
              if(!this.isIntegerP(arr[i].width))return 53200+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'method'))return 54000+i+1;
              if(typeof arr[i].method!=='string')return 54100+i+1;
              if(!this.isAllowMethod(wType,arr[i].method))return 54200+i+1;

              if(!Object.prototype.hasOwnProperty.call(arr[i],'value'))return 55000+i+1;
              if(!this.isAllowValueTyp(wType,arr[i].value))return 55100+i+1;
              if(typeof arr[i].value==='string'){//rule(E)
                if(arr[i].value.length>100)return 55200+i+1;
              }
            }
          }
          return true;
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
      previewCurve:false,
      addNewLineEnd:false,
      addNewCurveEnd:false,
      addNewAreaEnd:false,
      allReinitialize:false,
      suppressPickSelect:false,
      opAdsorptionNode:false,
      unAdsorptionNode:false,
      opSoundEffect:false,
      unSoundEffect:false,
    },
    /**
     * Config:可读可写 read write
     * Data:可读 read
    **/
    templateConfig:{
      taskCode:1040,//任务ID
      taskEndCode:0,//执行结束的任务ID
      resultCode:0,//执行结束的返回状态 1 取消 2提交
      resultTemplate:null,//执行结束返回的新模板对象
      editTemplate:null,//提交需要编辑的模板对象
      editBackup:null,//编辑前的备份
      editName:null,//提交需要编辑的分组名
      templateShow:false,
      useTpId:'none',//正在使用中的模板
      useTpName:'none',
      useTpCreator:'none',
      useTpModify:'none',
      useTpExplain:'none',
      useTypeRule:{
        point:false,line:false,area:false,curve:false
      },
      useDetailsRule:[
        {set:false,name:'name',default:'unknown',type:'text'}
      ],
      useColorRule:{
        basis:'',
        type:'',
        condition:[]
      },
      useWidthRule:{
        basis:'',
        type:'',
        condition:[]
      }
    },
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
      },
      soundEffect:{//音效配置
        needPlay:'',//需要播放的音效名称
        playCount:0,//总播放次数
        permission:false,//播放权限-必须通过click事件获取此权限
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
    mapConfig:{//地图配置v5.8
      layer:0,
      oldLayer:null,
      zoomAdd:1,//k
      zoomSub:-1/(1+1),//-k/(1+k)
      drawing:false,
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
        defaultWidth:5,
        custom:{
          icon:null,
          tmpId:null,
        },
      },
      tempLine:{
        id:'tempLine',
        type:'line',
        points:[],
        point:{x:0,y:0},
        color: '000000',
        width: 2,
        child_relations: null,
        father_relation: null,
        child_nodes: null,
        father_node: null,
        details:[],
        defaultWidth:2,
        showPos:[],
        custom:{
          tmpId:null,
        },
      },
      tempCurve:{
        id:'tempCurve',
        type:'curve',
        points:[],
        point:{x:0,y:0},
        color: '000000',
        width: 2,
        child_relations: null,
        father_relation: null,
        child_nodes: null,
        father_node: null,
        details:[],
        defaultWidth:2,
        showPos:[],
        custom:{
          tmpId:null,
        },
      },
      tempArea:{
        id:'tempArea',
        type:'area',
        points:[],
        point:{x:0,y:0},
        color: 'ffffff',
        width: 2,
        child_relations: null,
        father_relation: null,
        child_nodes: null,
        father_node: null,
        details:[],
        defaultWidth:2,
        showPos:[],
        custom:{
          tmpId:null,
        },
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
        y:0,
        target:null
      },
      svgMouseDown:{
        x:0,
        y:0,
        target:null
      },
      svgMouseRUp:{
        x:0,
        y:0,
        target:null
      },
      svgMouseRDown:{
        x:0,
        y:0,
        target:null
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
      inputFocusStatus:false,//input聚焦状态
      adsorption:{
        x:null,//吸附节点的实际坐标
        y:null,
        vx:null,//吸附节点屏幕上的虚拟坐标
        vy:null,
      }
    },
    pageConfig:{//页面配置
      homeSeparateState:true,
      mapSeparateState:false,
      loadingTime:2000,//首次加载地图的等待时间
    },
    cameraConfig:{//相机配置
      windowChange:false,//窗口变化
      doNeedMoveMap:false,//是否需要移动地图
      frameTime:16,//帧时间
      maxZoom:32,//最大缩放layer
      minZoom:-20,//最小缩放layer
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
    baseMapConfig:{//底图配置v5
      enableBaseMap:true,
      baseMapType:'realistic',//realistic和fictitious
      baseMap:null,
      resolution:{
        width:1920,
        height:980
      },
      options:{
        minZoom:5,//最小zoom
        maxZoom:18,//最大zoom
        center:[0,0],//中心点坐标x,y
        zoom:13,//默认layer
        zoomControl:false,
        scrollWheelZoom:false,
        attributionControl:false,
        inertia:false,
        scaling:0.25,//缩放比例
      },
      baseLayer:"http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8",
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
      autoCheckServer:true,//自动搜索服务器状态
      adsorptionNode:true,//自动吸附节点
      enableSoundEffect:true,//启用全局音效
      openFpsMonitor:false,//fps监控开启
      openElementPanel:false,//是否开启元素面板
      openStepRecorder:false,//步骤记录器
      mouseSamplingRate:'medium',//调整移动采样率
      closeDefaultLayer:false,//默认关闭默认图层
      mixVisibleRange:'medium',//渲染范围
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
    elementPanelConfig:{//元素面板配置
      hiddenElements:[],//隐藏的元素
      createId:1,//创建图层-分组-子分组时的末尾防重复的递增ID
    },
    operationBoardConfig:{//元素右键操作面板的配置
      posX:null,
      posY:null,
      display:false
    },
    serverData:{//仅读
      socket:undefined,
      underlay:undefined,//2.底图背景数据
      userName:'未登录',
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
    templateData:{
      /**Read only data. If need to update, please renewal to a brand new object
       * 只读的数据,如果需要更新,请直接引用新的对象
       * 可用于检测模板id是否重复出现等用途
       * The following is an example of template object
       * 如下为模板对象示例
      'id123abc456':{
        id:'id123abc456',
        name:'template',
        creator:'name',
        modify:'2020-04-05T01:01:01',
        locked:false,
        explain:'none',
        typeRule:{
          point:true,
          line:true,
          area:true,
          curve:true
        },
        detailsRule:[
          {
            set:false,
            name:'name',
            default:'unknown',
            type:'text'
          }
        ],
        colorRule:{
          basis:'',
          type:'',
          condition:[]
        },
        widthRule:{
          basis:'',
          type:'',
          condition:[]
        }
      }
      **/
    }
  },
  getters: {

  },
  mutations: {
    suppressPickSelect(state,product){//禁用全体元素选中
      state.commits.suppressPickSelect=product;
    },
    clearTempCurveCache(state){//清空临时曲线的缓存
      state.mapConfig.tempArea={
        id:'tempCurve',
        type:'curve',
        points:[],
        point:{x:0,y:0},
        color: '000000',
        width: 2,
        child_relations: null,
        father_relation: null,
        child_nodes: null,
        father_node: null,
        details:[],
        defaultWidth:2,
        showPos:[],
        custom:{
          tmpId:null,
        },
      };
    },
    clearTempAreaCache(state){//清空临时区域的缓存
      state.mapConfig.tempArea={
        id:'tempArea',
        type:'area',
        points:[],
        point:{x:0,y:0},
        color: 'ffffff',
        width: 2,
        child_relations: null,
        father_relation: null,
        child_nodes: null,
        father_node: null,
        details:[],
        defaultWidth:2,
        showPos:[],
        custom:{
          tmpId:null,
        },
      };
    },
    clearTempLineCache(state){//清空临时线段的缓存
      state.mapConfig.tempLine={
        id:'tempLine',
        type:'line',
        points:[],
        point:{x:0,y:0},
        color: '000000',
        width: 2,
        child_relations: null,
        father_relation: null,
        child_nodes: null,
        father_node: null,
        details:[],
        defaultWidth:2,
        showPos:[],
        custom:{
          tmpId:null,
        },
      };
    },
    destroyInstructPipe(state){//销毁综合对象
      state.serverData.socket=undefined;
    },
    restoreMapConfig(state){//恢复默认地图配置
      state.mapConfig={//地图配置v5.8
        layer:0,
        oldLayer:null,
        zoomAdd:1,//k
        zoomSub:-1/(1+1),//-k/(1+k)
        drawing:false,
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
          defaultWidth:5,
          custom:{
            icon:null,
            tmpId:null,
          },
        },
        tempLine:{
          id:'tempLine',
          type:'line',
          points:[],
          point:{x:0,y:0},
          color: '000000',
          width: 2,
          child_relations: null,
          father_relation: null,
          child_nodes: null,
          father_node: null,
          details:[],
          defaultWidth:2,
          showPos:[],
          custom:{
            tmpId:null,
          },
        },
        tempArea:{
          id:'tempArea',
          type:'area',
          points:[],
          point:{x:0,y:0},
          color: '000000',
          width: 2,
          child_relations: null,
          father_relation: null,
          child_nodes: null,
          father_node: null,
          details:[],
          defaultWidth:2,
          showPos:[],
          custom:{
            tmpId:null,
          },
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
          y:0,
          target:null
        },
        svgMouseDown:{
          x:0,
          y:0,
          target:null
        },
        svgMouseRUp:{
          x:0,
          y:0,
          target:null
        },
        svgMouseRDown:{
          x:0,
          y:0,
          target:null
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
        inputFocusStatus:false,//input聚焦状态
        adsorption:{
          x:null,//吸附节点的实际坐标
          y:null,
          vx:null,//吸附节点屏幕上的虚拟坐标
          vy:null,
        }
      };
    },
    restoreBaseMapConfig(state){//恢复默认底图配置
      state.baseMapConfig={
        enableBaseMap:true,
        baseMapType:'realistic',
        baseMap:null,
        resolution:{
          width:1920,
          height:980
        },
        options:{
          minZoom:5,
          maxZoom:18,
          center:[0,0],
          zoom:13,
          zoomControl:false,
          scrollWheelZoom:false,
          attributionControl:false,
          inertia:false,
          scaling:0.25
        },
        baseLayer:'http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8',
      };
    },
    restoreCameraConfig(state){//恢复默认相机配置
      state.cameraConfig={
        windowChange:false,
        doNeedMoveMap:false,
        frameTime:16,
        maxZoom:32,
        minZoom:-20,
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
          state.elementPanelConfig.hiddenElements=merged.filter((value, index, self) => self.findIndex(item => item.id === value.id) === index);
          break;
        }
        case 'quit':{//集体退出
          let arr1=state.elementPanelConfig.hiddenElements;
          let arr2=product.data;
          let set=new Set(arr2.map(value=>value.id));
          state.elementPanelConfig.hiddenElements=arr1.filter(value => !set.has(value.id));
          break;
        }
        case 'byTypeJoin':{//按类型集体加入
          let arr1=state.elementPanelConfig.hiddenElements.filter(item=>item.type!==product.by);
          let arr2=product.data;
          state.elementPanelConfig.hiddenElements=arr1.concat(arr2);
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
      let formatDate=()=>{
        let date=new Date();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      };
      state.logConfig.message.text=product.text;
      state.logConfig.message.from=product.from;
      state.logConfig.message.type=product.type;
      state.logConfig.message.data=product.data;
      state.logConfig.message.time=formatDate();
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
    setCoEffectsSound(state,name){//name: sound effect name string
      state.effectsConfig.soundEffect.needPlay=name;
      state.effectsConfig.soundEffect.playCount+=1;
    },
    setCoEffectsSoundPermission(state,permission){//permission: true or false
      state.effectsConfig.soundEffect.permission=permission;
    },
    setCoEffectsSvgFlicker(state,product){//product:{svgType:'point'|'line'|'area',svgData:elementObject,duration:millisecond}
      state.effectsConfig.svgFlicker.svgType=product.svgType;
      state.effectsConfig.svgFlicker.svgData=product.svgData;
      state.effectsConfig.svgFlicker.duration=product.duration;
      state.effectsConfig.svgFlicker.changeCode+=1;
    },
    setCoTemplateShow(state,product){//product:true/false
      state.templateConfig.templateShow=product;
    },
    setCoTemplateEdit(state,product){//product:{ template : {}  , name : 'zoo' , code : number }
      state.templateConfig.editTemplate=JSON.parse(JSON.stringify(product.template));//拷贝模板对象
      state.templateConfig.editBackup=product.template;//备份模板对象
      state.templateConfig.editName=product.name;//分组名
      state.templateConfig.taskCode=product.code;//校验码
    },
    setCoTemplateCancel(state,code){//code (TaskNumber)
      state.templateConfig.resultTemplate=null;
      state.templateConfig.resultCode=1;
      state.templateConfig.taskEndCode=code;
      state.templateConfig.editTemplate=null;//还原为null
      state.templateConfig.editBackup=null;
      state.templateConfig.editName=null;
    },
    setCoTemplateSubmit(state,product){//product:{ template : {}  , code : TaskNumber }
      state.templateConfig.resultTemplate=product.template;
      state.templateConfig.resultCode=2;
      state.templateConfig.taskEndCode=product.code;
    },
    setCoTemplateUse(state,template){//template:{ ... }
      state.templateConfig.useTpId=template.id;
      state.templateConfig.useTpName=template.name;
      state.templateConfig.useTpCreator=template.creator;
      state.templateConfig.useTpModify=template.modify;
      state.templateConfig.useTpExplain=template.explain;

      state.templateConfig.useTypeRule=template.typeRule;
      state.templateConfig.useDetailsRule=template.detailsRule;
      state.templateConfig.useColorRule=template.colorRule;
      state.templateConfig.useWidthRule=template.widthRule;
    },
    setCoTemplateNotUse(state){
      state.templateConfig.useTpId='none';
      state.templateConfig.useTpName='none';
      state.templateConfig.useTpCreator='none';
      state.templateConfig.useTpModify='none';
      state.templateConfig.useTpExplain='none';

      state.templateConfig.useTypeRule={
        point:false,line:false,area:false,curve:false
      };
      state.templateConfig.useDetailsRule=[
        {set:false,name:'name',default:'unknown',type:'text'}
      ];
      state.templateConfig.useColorRule={
        basis:'',
        type:'',
        condition:[]
      };
      state.templateConfig.useWidthRule={
        basis:'',
        type:'',
        condition:[]
      };
    },
    setCoMapDrawing(state,bool){
      state.mapConfig.drawing=bool;
    },
    setCoAdsorption(state,product){//product {x,y,vx,vy}
      state.mapConfig.adsorption.x=product.x;
      state.mapConfig.adsorption.y=product.y;
      state.mapConfig.adsorption.vx=product.vx;
      state.mapConfig.adsorption.vy=product.vy;
    },
    setOpAdsorptionNode(state){
      state.commits.opAdsorptionNode=!state.commits.opAdsorptionNode;
    },
    setUnAdsorptionNode(state){
      state.commits.unAdsorptionNode=!state.commits.unAdsorptionNode;
    },
    setOpSoundEffect(state){
      state.commits.opSoundEffect=!state.commits.opSoundEffect;
    },
    setUnSoundEffect(state){
      state.commits.unSoundEffect=!state.commits.unSoundEffect;
    },
  },
  actions: {

  }
})
