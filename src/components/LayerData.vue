<template>
  <!--
  职责：
  1.显示（包括地图的移动、缩放）存储在socket.mapData内的数据
  2.编辑地图数据（包括修改点位置、删除点、删除地图要素）
  3.显示临时的地图数据
  权限：
  允许访问、修改、删除$store.state.mapConfig、$store.state.serverData内的数据
  -->
  <div class="dataLayer" id="dataLayer" ref="dataLayer" style="pointer-events: auto">
    <svg class="elementData" id="elementData" ref="elementData" @contextmenu="preventDefault($event)" @dblclick="elementDataDbClick($event)" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" :style="'cursor:'+cursor">
      <!--区域数据-->
      <svg-area v-for="area in MyAreaData" :key="area.id" :area-config="area"></svg-area>
      <!--线段数据-->
      <svg-line v-for="line in MyPolyLineData" :key="line.id" :poly-line-config="line"></svg-line>
      <!--点位数据-->
      <svg-point v-for="point in MyPointData" :key="point.id" :point-config="point"></svg-point>
      <!--p0位置-->
      <svg-point-p0 :point-config="this.$store.state.mapConfig.p0" ref="ElementP0"></svg-point-p0>
      <!--临时点数据-->
      <svg-point-temp></svg-point-temp>
      <!--临时线数据-->
      <svg-line-temp></svg-line-temp>
      <!--临时区域数据-->
      <svg-area-temp></svg-area-temp>
      <!--我的A1位置-->
<!--      <svg-a1-circle></svg-a1-circle>-->
      <!--其他人的A1位置-->
<!--      <svg-a1-circle-other></svg-a1-circle-other>-->
    </svg>
  </div>
</template>

<script>
import SvgLine from "./svgLine";
import SvgArea from "./svgArea";
import SvgA1Circle from "./svgA1Circle";
import SvgA1CircleOther from "./svgA1CircleOther";
import SvgPoint from "./svgPoint";
import SvgPointP0 from "./svgPointP0";
import SvgLineTemp from "./svgLineTemp";
import SvgAreaTemp from "./svgAreaTemp";
import SvgPointTemp from "./svgPointTemp";
export default {
  name: "LayerData",
  components: {SvgPoint,SvgLine,SvgPointP0,SvgA1Circle,SvgA1CircleOther,SvgLineTemp,SvgPointTemp,SvgArea,SvgAreaTemp},
  data(){
    return {
      MY_NAME:"LayerData",
      theData:{
        /**数据结构
        {
         不能空 | id:mini-type+number  ;字符串数据
         不能空 | type:四种：1.line 轨迹 缩写为l ;2.point 点 缩写为p ;3.area 区域 缩写为a; 4.relation 关系 缩写为r ;字符串数据
            细说四种数据：
            1.point 最基础的数据，由一个坐标点构成其物理形态，它可以承载兴趣点名称、地址、邮箱、经纬度坐标、电话、坐标等信息
            2.line 由两个及以上的点依照顺序进行连接构成其物理形态，它可以承载地铁、道路、航线、地平线、海岸线、经纬线、长度等信息
            3.area 由三个及以上的点依照顺序构造的多边形物理形态，它可以承载小区范围、政治管辖区范围、广场、学校、面积等信息
            4.relation 由一个及以上的任意数据类型所构成的数据集合或对象，它可以承载结构化的地理信息数据例如人行横道的区域area与人性横道的中心线line
         不能空 | points:[{x:number,y:number},{x:number,y:number}...]//对于特殊的关系数据类型，该值为第一个childNode的第一个point
         不能空 | point:{x:number,y:number}//点的坐标;对于line数据类型该值为起点，对与area改值为起点，用于区块渲染数据用；对于特殊的关系数据类型，该值为第一个childNode的第一个point
         可以空 | color:'#224466'//16进制的RGB颜色字符串,对于特殊的关系数据类型，该值为空
         可以空 | length:number//单位是m;线的长度，对于point数据类型而言该值为空，对于line数据类型而言该值为线长度，对于area而言该值为空；该值允许为空
         可以空 | width:number//单位是px;形如线的宽度，或者点圆的宽度，默认为2
         可以空 | size:number//单位是m^2;仅使用在area数据类型上，且该值允许为空
         可以空 | childRelations:[‘r1544201’,'r5545122'...]//此数据类型下的子关系id，可以是多个也可以为空
         可以空 | fatherRelation:''//对于有关系类型的数据类型的上级关系id，可以为空
         可以空 | childNodes:[]//对于关系类型的数据类型的成员节点，节点可以是任意四种数据类型之一，可以为空
         可以空 | fatherNode:''//对于关系类型的数据类型的父节点，节点可以是任意四种数据类型之一，可以为空
         可以空 | details:''//自定义的一些数据，可以是任何数据类型
        }
        **/

        /**数据结构
         {
          不能空 | id:mini-type+number  ;字符串数据
          不能空 | type:point ;字符串数据
          不能空 | points:[{x:number,y:number}] ;字符串数据，数组类型
          不能空 | point:{x:number,y:number} ;字符串数据，对象类型
          可以空 | color:'#fff' ;字符串数据，点的背景颜色，默认是红色
          可以空 | length:没用，空着
          可以空 | width:number;点圆的宽度，默认为2px，最大为64
          可以空 | size:没用，空着
          可以空 | childRelations:[‘r1544201’,'r5545122'...]//此数据类型下的子关系id，可以是多个也可以为空
          可以空 | fatherRelation:''//对于有关系类型的数据类型的上级关系id，可以为空
          可以空 | childNodes:[]//对于关系类型的数据类型的成员节点，节点可以是任意四种数据类型之一，可以为空
          可以空 | fatherNode:''//对于关系类型的数据类型的父节点，节点可以是任意四种数据类型之一，可以为空
          可以空 | details:[{key:value},{key:value}...]//自定义的一些数据，可以是任何数据类型，key=>value
         }
         **/

        moveStartPt:{
          x:null,
          y:null
        },
        moveMovePt:{
          x:null,
          y:null
        },
        moveEndPt:{
          x:null,
          y:null
        },
        //移动侦测器
        moveObServer:null,
        //移动过程中每隔11毫秒则监听1次鼠标位置会保存在此处,最大两个
        moveObServerDt:[]
      }
    }
  },
  methods:{
    //初始化设置
    startSetting(){
      //获取浏览器配置
      this.getBrowserConfig();
      //获取屏幕中心点
      this.getScreenCenter();
      //实时获取鼠标位置
      this.getMousePos();
      //添加移动侦听
      this.mapMoveStart();
      this.mapMoveIng();
      this.mapMoveEnd();
      //启用滚轮监听
      this.visualAngleScale();
      //启用点击空白处清除选中
      this.clearSelect();
      //启用鼠标点击监听
      this.getMouseClick();
      //实时获取svg点击位置
      this.elementDataClick();
      //检测浏览器窗口大小变化
      this.listenBrowserSize();
      //启用鼠标左键松开按下监听
      this.getMouseUpSvg();
      this.getMouseDownSvg();
    },
    //阻止右键选中
    preventDefault(mouseEvent){
      mouseEvent.preventDefault();
    },
    //检测浏览器窗口大小变化
    listenBrowserSize(){
      let resizeTimer;
      window.addEventListener('resize',()=>{
        clearTimeout(resizeTimer);
        resizeTimer=setTimeout(()=>
        {this.$store.state.cameraConfig.windowChange=false;},200);
        this.getBrowserConfig();
        this.$store.state.cameraConfig.windowChange=true;
      })
    },
    //获取鼠标左键松开的位置(svg)
    getMouseUpSvg(){
      this.$refs.elementData.addEventListener('mouseup',(e)=>{
        if(e.button===0){
          this.$store.state.mapConfig.svgMouseUp.x=e.x;this.$store.state.mapConfig.svgMouseUp.y=e.y;
        }
      }
      )
    },
    //获取鼠标左键按下的位置(svg)
    getMouseDownSvg(){
      this.$refs.elementData.addEventListener('mousedown',(e)=>{
          if(e.button===0){
            this.$store.state.mapConfig.svgMouseDown.x=e.x;this.$store.state.mapConfig.svgMouseDown.y=e.y;
          }
        }
      )
    },
    //获取鼠标点击位置
    getMouseClick(){
      document.addEventListener("click", (e)=>{this.$store.state.mapConfig.mouseClick.x=e.x;this.$store.state.mapConfig.mouseClick.y=e.y;})
    },
    //实时获取鼠标位置：
    getMousePos(){
      document.addEventListener("mousemove", (e)=>{this.$store.state.mapConfig.mousePoint.x=e.x;this.$store.state.mapConfig.mousePoint.y=e.y;})
    },
    //实时获取svg点击位置
    elementDataClick(){
      this.$refs.elementData.addEventListener("click",(e)=>{this.$store.state.mapConfig.svgClick.x=e.x;this.$store.state.mapConfig.svgClick.y=e.y;})
    },
    //双击svg事件
    elementDataDbClick(e){
      this.$store.state.mapConfig.svgDbClick.x=e.x;
      this.$store.state.mapConfig.svgDbClick.y=e.y;
    },
    /**
     根据经纬度计算距离，参数分别为第一点的经度，纬度；第二点的经度，纬度
     返回值的单位是km
     **/
    getDistances(x1, y1, x2, y2) {
      const R=6371;//地球平均半径(km)
      const {sin,cos,asin,PI,hypot} = Math;
      let getPt=(x,y)=>{
        x*=PI/180;
        y*=PI/180;
        return {x:cos(x)*cos(y),y:sin(x)*cos(y),z:sin(y)}
      }
      let p1=getPt(x1,y1);
      let p2=getPt(x2,y2);
      let a=hypot(p1.x-p2.x,p1.y-p2.y,p1.z-p2.z);
      return asin(a/2)*2*R;
    },
    //该函数用于缩放视角
    visualAngleScale(){
      let browserAgent=window.navigator.userAgent;
      let browser=null;
      if(browserAgent.indexOf('Firefox')!==-1){
        browser='firefox';
      } else if(browserAgent.indexOf('Chrome')!==-1){
        browser='chrome';
      }
      switch (browser){
        case 'firefox':{
          this.$refs.dataLayer.addEventListener('DOMMouseScroll',e=>Callback(e,'firefox'));
          break;
        }
        case 'chrome':{
          this.$refs.dataLayer.addEventListener('mousewheel',e=>Callback(e,'chrome'));
          break;
        }
        default:{
          this.$refs.dataLayer.addEventListener('mousewheel',e=>Callback(e,'chrome'));
        }
      }
      let Callback=(e,browser)=>{
        let tp=null;
        switch (browser){
          case 'chrome':{
            tp=e.wheelDelta;
            break;
          }
          case 'firefox':{
            tp=(e.detail)*-1;
            break;
          }
        }
        //在进行节点移动操作时禁用缩放
        if(this.$store.state.commits.disableZoomAndMove===false){
          //
          if(tp>0){//滚轮前进，放大
            if(this.$store.state.mapConfig.layer<=this.$store.state.cameraConfig.minZoom){
              return false;
            }
            this.$store.state.mapConfig.oldLayer=this.$store.state.mapConfig.layer;
            //this.$store.state.cameraConfig.unit1X=Math.abs(this.$store.state.cameraConfig.unit1X*this.$store.state.mapConfig.zoomSub);//单位缩小
            //this.$store.state.cameraConfig.unit1Y=Math.abs(this.$store.state.cameraConfig.unit1Y*this.$store.state.mapConfig.zoomSub);//单位缩小
            //设置pointer-events
            this.$store.state.mapConfig.layer-=1;//层级下调
          }else {//滚轮后退，缩放
            if(this.$store.state.mapConfig.layer>=this.$store.state.cameraConfig.maxZoom){
              return false;
            }
            this.$store.state.mapConfig.oldLayer=this.$store.state.mapConfig.layer;
            //this.$store.state.cameraConfig.unit1X=Math.abs(this.$store.state.cameraConfig.unit1X/this.$store.state.mapConfig.zoomSub);//单位放大
            //this.$store.state.cameraConfig.unit1Y=Math.abs(this.$store.state.cameraConfig.unit1Y/this.$store.state.mapConfig.zoomSub);//单位放大
            this.$store.state.mapConfig.layer+=1;//层级下调
          }
        }
      };
    },
    //获取浏览器高度和宽度
    getBrowserConfig(){
      this.$store.state.mapConfig.browser.width=window.innerWidth;
      this.$store.state.mapConfig.browser.height=window.innerHeight;
    },
    //获取屏幕中心点
    getScreenCenter(){
      this.$store.state.mapConfig.centerPoint.x=window.innerWidth/2;
      this.$store.state.mapConfig.centerPoint.y=window.innerHeight/2;
    },
    //创建一条测试用的Line
    createTestLine(){

    },
    //dataLayer的鼠标移动监听-按下
    mapMoveStart(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousedown',(e)=>{
        if(e.button===0){
          this.$store.state.cameraConfig.doNeedMoveMap=true;
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveStartPt=point;
        }
        //更改cursor
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='grabbing';
        }
      })
    },
    //dataLayer的鼠标移动监听-移动
    mapMoveIng(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousemove',(e)=>{
        if(this.$store.state.cameraConfig.doNeedMoveMap){
          this.theData.moveMovePt={x:e.x,y:e.y};
          if(this.theData.moveObServer===null){
            this.setMoveObServer();
          }
        }
      })
    },
    //移动结束
    mapMoveEnd(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mouseup',(e)=>{
        if(e.button===0){
          this.$store.state.cameraConfig.doNeedMoveMap=false;
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveEndPt=point;
          //停用移动侦测器
          if(this.theData.moveObServer!==null){
            this.removeMoveObServer();
          }
          //清空移动缓存
          this.clearMoveCache();
        }
        //更改cursor
        if(this.$store.state.mapConfig.cursorLock===false){
          this.$store.state.mapConfig.cursor='default';
        }
      });
    },
    //dataLayer的鼠标移动监听-松开
    //设置移动侦测器
    setMoveObServer(){
      if(this.theData.moveObServer===null){//必须是在已经移除了前一个侦测器的情况下
        this.theData.moveObServer=setInterval(
          ()=>{
            //如果有移动节点的操作会抑制更新
            if(this.$store.state.commits.disableZoomAndMove===false){
              try {
                let pt=this.theData.moveMovePt;
                let le=this.theData.moveObServerDt.length;
                switch (le){
                  case 2:{//有两个
                    this.theData.moveObServerDt.shift();
                    this.theData.moveObServerDt.push(pt);
                    let A1=this.theData.moveObServerDt[0];
                    let A2=this.theData.moveObServerDt[1];
                    let xc3=-(A2.x-A1.x);
                    let yc4=A2.y-A1.y;
                    this.$store.state.mapConfig.A1.x+=xc3;
                    this.$store.state.mapConfig.A1.y+=yc4;
                    break;
                  }
                  case 0:{//空
                    this.theData.moveObServerDt.push(pt);
                    let Apt=this.theData.moveStartPt;
                    let xc,yc;
                    xc=-(pt.x-Apt.x);
                    yc=pt.y-Apt.y;
                    this.$store.state.mapConfig.A1.x+=xc;
                    this.$store.state.mapConfig.A1.y+=yc;
                    break;
                  }
                  case 1:{
                    this.theData.moveObServerDt.push(pt);
                    let Bpt=this.theData.moveObServerDt[0];
                    let xc2,yc2;
                    xc2=-(pt.x-Bpt.x);
                    yc2=pt.y-Bpt.y;
                    this.$store.state.mapConfig.A1.x+=xc2;
                    this.$store.state.mapConfig.A1.y+=yc2;
                    break;
                  }
                  default:{
                    break;
                  }
                }
              }
              catch (e) {

              }
            }
          }
          ,this.frameTime)
      }
    },
    //移除移动侦测器
    removeMoveObServer(){
      if(this.theData.moveObServer!==null) {//必须是存在的情况下
        clearInterval(this.theData.moveObServer);
        this.theData.moveObServer=null;
      }
    },
    //清空移动缓存
    clearMoveCache(){
      this.theData.moveStartPt.x=null;
      this.theData.moveStartPt.y=null;
      this.theData.moveMovePt.x=null;
      this.theData.moveMovePt.y=null;
      this.theData.moveEndPt.x=null;
      this.theData.moveEndPt.y=null;
      this.theData.moveObServerDt.length=0;
    },
    /**
     获取两点的渲染距离
     1.p1传入坐标,默认00
     2.p2传入坐标,默认00
     返回angele角度制
     **/
    getLength(p1,p2){
      let {sqrt,pow,abs}=Math;
      //1邻边
      let x=p2.x-p1.x;
      //对边
      let y=p2.y-p1.y;
      //如果y轴一致：
      if(y===0){
        return abs(p1.x-p2.x);
      }
      //如果x轴一致：
      if(x===0){
        return abs(p1.y-p2.y);
      }
      //斜边
      return sqrt(pow(x,2)+pow(y,2));
    },
    /**
     获取两点的角度
     1.p1传入坐标,默认00
     2.p2传入坐标,默认00
     返回angele角度制
    **/
    getAngle(p1,p2){
      let {asin,PI,sqrt,pow,abs}=Math;
      //1邻边
      let x=p2.x-p1.x;
      //对边
      let y=p2.y-p1.y;
      //如果完全一致返回0
      if(x===0 && y===0){
        return 0;
      }
      //如果y轴一致：
      if(y===0){
        if(p1.x<=p2.x){
          return 0;
        }else {
          return 180;
        }
      }
      //如果x轴一致：
      if(x===0){
        if(p1.y<=p2.y){
          return 270;
        }else {
          return 90;
        }
      }
      //斜边
      let c=sqrt(pow(x,2)+pow(y,2));
      let rt=abs(asin(y/c) * (180/PI));
      //如果第二个点在自身的第三象限内
      if(p2.x<p1.x){//二三象限
        if(p2.y<p1.y){
          rt+=90;
        }else {
          rt+=180;
        }
      }else {//一象限
        if(p2.y>p1.y){
          rt+=270;
        }
      }
      return rt;
    },
    /**
     经纬度转化为整数
     1.pos传入经纬度对象,默认00
     2.check表示是否需要检查格式,默认true
     3.返回position{x,y}
    **/
    positionTransformInt(pos,check){
      let position,checkOut;
      position=pos || {x:0,y:0};
      checkOut=check || true;
      if(checkOut){
        if(position.x>180 || position.y>90){
          return {x:0,y:0};
        }
      }
      position.x=Math.round((position.x)*10000000);
      position.y=Math.round((position.y)*10000000);
      return position;
    },
    //命令接收器,每条命令需要有执行者参数，表示哪些组件需要执行
    instruction(newValue,oldValue){
      //1获取命令名
      let instructName=[];
      for (let key in newValue) {
        instructName.push(key)
      }
      for(let i=0;i<instructName.length;i++){
        let name = instructName[i];
        switch (name){
          case 'createTestLine':{
            this.createTestLine();
            break;
          }
        }
      }
    },
    //清除选中要素及选中要素数据
    clearSelect(){
      this.$refs.elementData.addEventListener('click',(ev)=>{
        //1.可以被选中的要素nodeName合集
        let nodeNames=['polyline','circle'];
        if(nodeNames.indexOf(ev.target.nodeName)===-1){
          this.$store.state.detailsPanelConfig.target=-1;
          this.$store.state.detailsPanelConfig.data={point:{x:null,y:null}};
          //更新点击空白处操作位置
          this.$store.state.mapConfig.clearClick.x=ev.x;
          this.$store.state.mapConfig.clearClick.y=ev.y;
        }
        //关闭element operation board
        this.$store.state.elementOperationBoardConfig.display=false;
      })
    }
  },
  mounted:function(){
    this.startSetting();
  },
  computed:{
    cursor(){
      return this.$store.state.mapConfig.cursor;
    },
    frameTime() {
      return this.$store.state.cameraConfig.frameTime;
    },
    commitsCreateTestLine() {
      return this.$store.state.commits.createTestLine;
    },
    anonymousInstruct() {
      return this.$store.state.anonymousInstruct;
    },
    A1() {
      return this.$store.state.mapConfig.A1;
    },
    MyAreaData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.areas;
      }else {
        return [];
      }
    },
    MyPolyLineData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.lines;
      }else {
        return [];
      }
    },
    MyPointData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.points;
      }else {
        return [];
      }
    }
  },
  watch:{
    commitsCreateTestLine:{
      handler(newValue,oldValue){
        this.createTestLine();
      },
      deep:true
    },
    anonymousInstruct:{
      handler(newValue,oldValue){
        this.instruction(newValue,oldValue);
      },
      deep:true
    }
  },
  destroyed(){
    //销毁连接及综合对象
    //this.$store.commit('destroyComprehensive');
    //console.log("layerData");
  }
}
</script>
<style scoped>
#dataLayer{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  z-index: 545;left: 0px;
  top:0px;
  pointer-events: none
}
.elementData{
  width: 100%;
  height: 100%;
  cursor: default;
  position: absolute;
  z-index: 545;
  left: 0px;
  top:0px;
}
</style>
