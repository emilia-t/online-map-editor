<template>
  <div class="dataLayer" id="dataLayer" ref="dataLayer" >
    <svg class="polyLineData" id="polyLineData" ref="polyLineData" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" >
      <svg-line v-for="line in theData.polyLineData" :key="line.id" :poly-line-config="line"></svg-line>
    </svg>
  </div>
</template>

<script>
import SvgLine from "./svgLine";
export default {
  name: "dataLayer",
  components: {SvgLine},
  data(){
    return {
      MY_NAME:"dataLayer",
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
         可以空 | width://单位是px;形如线的宽度，默认为2
         可以空 | size:number//单位是m^2;仅使用在area数据类型上，且该值允许为空
         可以空 | childRelations:[‘r1544201’,'r5545122'...]//此数据类型下的子关系id，可以是多个也可以为空
         可以空 | fatherRelation:''//对于有关系类型的数据类型的上级关系id，可以为空
         可以空 | childNodes:[]//对于关系类型的数据类型的成员节点，节点可以是任意四种数据类型之一，可以为空
         可以空 | fatherNode:''//对于关系类型的数据类型的父节点，节点可以是任意四种数据类型之一，可以为空
        }
        **/
        polyLineData:[
          {
            id:'l3001',
            type:'line',
            points:[{x:0.0000621,y:0.0000302},{x:0.0000631,y:0.0000322},{x:0.0000661,y:0.0000352}],
            point:{x:0.0000621,y:-0.0000302},
            color:'#ff3030',
            width:2
          },
          {
            id:'l3002',
            type:'line',
            points:[{x:0.0000798,y:0.0000211},{x:0.0000991,y:0.0000601},{x:0.0000444,y:0.0000555}],
            point:{x:0.0000621,y:-0.0000302},
            color:'#7cffea',
            width:4
          },
          {
            id:'l3002',
            type:'line',
            points:[{x:0.0003798,y:0.0000211},{x:0.0003991,y:0.0000601},{x:0.0003444,y:0.0000555}],
            point:{x:0.0000621,y:-0.0000302},
            color:'#7cffea',
            width:4
          }
        ],
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
      //
      //测试
      //
      //
      //
      //测试
      //
      //添加一条测试line
      //this.createTestLine();
      //当前层级
      let nowLayer=this.$store.state.mapConfig.layer;
      //添加移动侦听
      this.mapMoveStart();
      this.mapMoveIng();
      this.mapMoveEnd();
      //初始化视角
      this.visualAngleMove();
    },
    //
    //
    setCp(){
      // import Vue from 'vue';
      // import line from './svgLine';
      // let ref=this.$refs.dataLayer;
      // console.log("aaa");
      // let LineComponent=Vue.extend(line);
      // console.log(LineComponent);

      // let line=document.querySelector('#line')
      // console.log(line.firstChild);
      // let clone=line.firstChild.cloneNode(true);
      // line.appendChild(clone);
    },
    //该函数用于缩放视角
    visualAngleScale(){

    },
    //该函数用于初始化或移动时,将创建的数据进行相对移动
    visualAngleMove(){
      //2022-11-20 20:45留，基于SVG的移动功能已经加入进去了，现在我希望把之前的旧的方式和代码进行删减，请完成这个工作，之后做缩放和编辑的功能(SVG)
      //2022-11-13 21:33留，可以使用模组重复使用svg，但是仙子啊问题是添加后不能正常显示，位置和box都正常出现了，但是就是不能显示，解决此问题，然后制作移动视角的功能SVG端
      //2022-10-23 19:10留，请开始缩放视角功能的开发,注意，本地图非高精地图，缩放不必在意小误差，
      //2022-11-06 21:15留，我认为单纯使用DIV+CSS无法合理的实现地图缩放的功能，所有我决定将重构此项目，改用SVG+JS的方式制作地图
      //https://segmentfault.com/a/1190000041018595?sort=newest  svg03——用 js
      // 创建svg，需要安装插件才能用
      // 2022-11-06 23:18 留 如何复用组件（在已经加载完毕页面后）？例如用户点击创建一条线，这时候再生成对应这条线的svg组件
      // 或者可以试试先加载一个基础的line dom
      //地图的各个要素都线封装为一个vue组件，然后在使用
      let elements=document.querySelectorAll('.element');
      let mouseMove={"x":null,"y":null};
      let A1=this.$store.state.mapConfig.A1;
      for (let i=0;i<elements.length;i++){
        let nowElement=elements[i];
        for(let c=0;c<nowElement.childNodes.length;c++){
          let DataX=nowElement.childNodes[c].getAttribute('data-r-x');//经度
          let DataY=nowElement.childNodes[c].getAttribute('data-r-y');//纬度
          let pos={x:DataX,y:DataY};
          let rep=this.positionTransformInt(pos);//转化后的
          let result={"x":rep.x-A1.x, "y":rep.y-A1.y};
          nowElement.childNodes[c].style.left=result.x+"px";
          nowElement.childNodes[c].style.top=((result.y)*-1)+"px";
        }
      }
      /**
       * 以下是关于SVG的移动功能
       **/
      let polyLineDataChildNodes=this.$refs.polyLineData.childNodes;
      for(let i=0;i<polyLineDataChildNodes.length;i++){
        polyLineDataChildNodes[i].style.transform='translate('+(A1.x)*-1+'px, '+A1.y+'px) rotate(0deg) scale(1)';
      }
      /**
       * 以上是关于SVG的移动功能
       **/
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
    /**
    一条line的基本属性如下：
     position：表示这条line的组成点的数组集合，且至少有两个点[{x:float,y:float},{x,y}...]
     angle：表示这条line的旋转角度，默认为0,一般不要设置
     length：表示这条line的长度，这里的长度是依据经纬度计算的，当然在平面上是被拉伸后的，所以这个参数并不代表这条line的显示长度
     color：表示这条line的显示颜色，仅支持16进制的rgb颜色
     width：表示这条line的线宽，这里是固定的px单位，默认为1px
    **/
    //创建一条测试用的Line
    createTestLine(){
      //0.box
      let box=this.$refs.dataLayer;
      //0.1lineBox
      let lineBox=document.createElement('DIV');
      //line
      lineBox.classList.add("element");
      lineBox.classList.add("line");
      //#.设定基本的参数
      let lineConfig={
        position:[{x:0.0000621,y:-0.0000302},{x:0.0000631,y:-0.0000322},{x:0.0000661,y:-0.0000352}],
        angle:0,//角度
        length:0,//长度
        color:'#de3838',//颜色
        width:2//宽度
      }
      //1.解析数据
      //基本实现方式
      //1转化为整数
      let linePosition=[];//line的生成起始点位置
      let lineAngle=[];//line的下一跳位置与上一点的角度关系
      let lineLength=[];//到下一跳的距离
      for (let i=0;i<lineConfig.position.length;i++){
        let sou={x:null,y:null};
        sou.x=lineConfig.position[i].x;
        sou.y=lineConfig.position[i].y;
        let obj=this.positionTransformInt(sou);
        linePosition.push(obj);
      }
      //2依次将两点进行角度计算
      for (let b=0;b<linePosition.length-1;b++){
        lineAngle.push(this.getAngle(linePosition[b],linePosition[b+1]))
      }
      //3依次将两点进行长度计算
      for (let c=0;c<linePosition.length-1;c++){
        lineLength.push(this.getLength(linePosition[c],linePosition[c+1]))
      }
      //3创建span
       for(let d=0;d<linePosition.length-1;d++){
         let newSpan=document.createElement('SPAN');
         newSpan.setAttribute('data-r-x',lineConfig.position[d].x);
         newSpan.setAttribute('data-r-y',lineConfig.position[d].y);
         newSpan.setAttribute('data-length',lineConfig.length);
         newSpan.setAttribute('data-width',lineConfig.width);
         newSpan.setAttribute('data-color',lineConfig.color);
         newSpan.setAttribute('data-angle',lineConfig.angle);
         newSpan.style.background=lineConfig.color;
         newSpan.style.left=linePosition[d].x+'px';
         newSpan.style.top=((linePosition[d].y)*-1)+'px';//渲染的时候需要取反
         newSpan.style.width=lineLength[d]+'px';
         newSpan.style.height=lineConfig.width+'px';
         newSpan.style.transformOrigin="left top";//固定属性
         newSpan.style.position="fixed";//固定属性
         newSpan.style.transform="rotate("+lineAngle[d]+"deg)";//角度
         lineBox.appendChild(newSpan);
         //202210091919留言生成的line似乎与实际不同，检查并修复此bug，然后做移动功能，然后做缩放功能，然后做编辑功能，然后做登录功能，然后做后端
       }
       box.appendChild(lineBox);
      //4如果还有下一点，则循环
      /**
      lineConfig.position=this.positionTransformInt(lineConfig.position);
      let newEle=document.createElement('SPAN');
      newEle.className='line';
      //绑定基本数据
      newEle.setAttribute('data-r-x',lineConfig.x);
      newEle.setAttribute('data-r-y',lineConfig.y);
      newEle.setAttribute('data-width',lineConfig.width);
      newEle.setAttribute('data-color',lineConfig.color);
      newEle.setAttribute('data-r-length',lineConfig.length);
      newEle.setAttribute('data-r-angle',lineConfig.angle);
      newEle.style.left=lineConfig.position.x+'px';
      newEle.style.top=lineConfig.position.y+'px';
      newEle.style.background=lineConfig.color;
      newEle.style.width=lineConfig.length+'px';
      newEle.style.height=lineConfig.width+'px';
      newEle.style.transform=lineConfig.angle;
      newEle.style.transformOrigin="left top";//固定属性
      newEle.style.position="fixed";//固定属性
      newEle.style.transform="rotate("+lineConfig.angle+"deg)";//角度
      box.appendChild(newEle);
      console.log(lineConfig);
      **/
    },
    //一条line应有的事件
    lineEvents(){


    },
    //dataLayer的鼠标移动监听-按下
    mapMoveStart(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousedown',(e)=>{
        this.$store.state.cameraConfig.doNeedMoveMap=true;
        let point={x:null,y:null};
        point.x=e.x;
        point.y=e.y;
        this.theData.moveStartPt=point;
      })
    },
    //dataLayer的鼠标移动监听-移动
    mapMoveIng(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousemove',(e)=>{
        if(this.$store.state.cameraConfig.doNeedMoveMap){
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveMovePt=point;
          //启用移动侦测器
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
      })
    },
    //dataLayer的鼠标移动监听-松开
    //设置移动侦测器
    setMoveObServer(){
      if(this.theData.moveObServer===null){//必须是在已经移除了前一个侦测器的情况下
        this.theData.moveObServer=setInterval(
          ()=>{
            try {
              let pt=this.theData.moveMovePt;
              let le=this.theData.moveObServerDt.length;
              switch (le){
                case 2:{//有两个
                  this.theData.moveObServerDt.shift();
                  this.theData.moveObServerDt.push(pt);
                  let A1=this.theData.moveObServerDt[0];
                  let A2=this.theData.moveObServerDt[1];
                  let xc3=((A2.x-A1.x)*-1);
                  let yc4=(A2.y-A1.y);
                  this.$store.state.mapConfig.A1.x+=xc3;
                  this.$store.state.mapConfig.A1.y+=yc4;
                  break;
                }
                case 0:{//空
                  this.theData.moveObServerDt.push(pt);
                  let Apt=this.theData.moveStartPt;
                  let xc,yc;
                  xc=(pt.x-Apt.x)*-1;
                  yc=(pt.y-Apt.y);
                  this.$store.state.mapConfig.A1.x+=xc;
                  this.$store.state.mapConfig.A1.y+=yc;
                  break;
                }
                case 1:{
                  this.theData.moveObServerDt.push(pt);
                  let Bpt=this.theData.moveObServerDt[0];
                  let xc2,yc2;
                  xc2=(pt.x-Bpt.x)*-1;
                  yc2=pt.y-Bpt.y;
                  this.$store.state.mapConfig.A1.x+=xc2;
                  this.$store.state.mapConfig.A1.y+=yc2;
                  break;
                }
                default:{
                  break;
                }
              }
            }catch (e) {
              console.log(e);
            }
          }
          ,11)
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

  },
  mounted:function(){
    this.startSetting()
  },
  computed:{
    commits() {
      return this.$store.state.commits;
    },
    anonymousInstruct() {
      return this.$store.state.anonymousInstruct;
    },
    A1() {
      return this.$store.state.mapConfig.A1;
    }
  },
  watch:{
    commits:{
      handler(newValue,oldValue){
        this.instruction(newValue,oldValue);
      },
      deep:true
    },
    anonymousInstruct:{
      handler(newValue,oldValue){
        this.instruction(newValue,oldValue);
      },
      deep:true
    },
    //监听移动
    A1:{
      handler(newValue,oldValue){
        this.visualAngleMove();
      },
      deep:true
    },
  }
}
</script>

<style scoped>

#dataLayer{
  width: 100%;
  height: 100%;
}
.line{position: fixed;}
.polyLineData{width: 100%;height: 100%;}
</style>
