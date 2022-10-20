<template>
  <div class="dataLayer" id="dataLayer" ref="dataLayer">

  </div>
</template>

<script>
export default {
  name: "dataLayer",
  data(){
    return {
      MY_NAME:"dataLayer",
      theData:{
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
      //添加一条测试line
      this.createTestLine();
      //当前层级
      let nowLayer=this.$store.state.mapConfig.layer;
      //初始化视角
      this.visualAngleMove();
      //添加移动侦听
      this.mapMoveStart();
      this.mapMoveIng();
      this.mapMoveEnd();
    },
    //该函数用于初始化或移动时,将创建的数据进行相对移动
    visualAngleMove(){
      //2022-10/20-21:00留，在添加了移动监听器后初始化时使得生成的Line错误，请修复此bug，之后则开始缩放的功能开发
      let elements=document.querySelectorAll('.element');
      for (let i=0;i<elements.length;i++){
        let nowElement=elements[i];
        for(let c=0;c<nowElement.childNodes.length;c++){
          let theDataX=nowElement.childNodes[c].getAttribute('data-r-x');//虚拟
          let theDataY=nowElement.childNodes[c].getAttribute('data-r-y');//虚拟
          let A1=this.$store.state.mapConfig.A1;
          let result={"x":A1.x-theDataX, "y":theDataY-A1.y};
          nowElement.childNodes[c].style.left=result.x+"px";
          nowElement.childNodes[c].style.top=result.y+"px";
        }
      }
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
      console.log(linePosition);
      console.log(lineAngle);
      console.log(lineLength);
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
                  let xc3=A2.x-A1.x;
                  let yc4=(A2.y-A1.y)*-1;
                  this.$store.state.mapConfig.A1.x+=xc3;
                  this.$store.state.mapConfig.A1.y+=yc4;
                  // console.log("==")
                  // console.log(this.$store.state.mapConfig.A1.x)
                  // console.log(this.$store.state.mapConfig.A1.y)
                  // console.log("??")
                  // console.log("---");
                  // console.log(this.theData.moveObServerDt);
                  // console.log("-+-");
                  break;
                }
                case 0:{//空
                  this.theData.moveObServerDt.push(pt);
                  let Apt=this.theData.moveStartPt;
                  let xc,yc;
                  xc=pt.x-Apt.x;
                  yc=(pt.y-Apt.y)*-1;
                  this.$store.state.mapConfig.A1.x+=xc;
                  this.$store.state.mapConfig.A1.y+=yc;
                  break;
                }
                case 1:{
                  this.theData.moveObServerDt.push(pt);
                  let Bpt=this.theData.moveObServerDt[0];
                  let xc2,yc2;
                  xc2=pt.x-Bpt.x;
                  yc2=(pt.y-Bpt.y)*-1;
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
    this.startSetting();
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
</style>
