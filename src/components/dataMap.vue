<template>
  <!--旧的版本-基于全局平面坐标系的地图-->
<!--数据地图-->
<!--地图画布初始为20000米，若要重新创建一个画布，请考虑清楚初始地图实际大小，该实际大小不可二次修改-->
  <div class="dataMap" id="dataMap" ref="dataMap" @mousedown="mouseDown($event)" @mousemove="mouseMove($event)" @mouseup="mouseUp($event)">
    <!--参数及设置及编辑-->
    <div class="dataMapSetting" id="dataMapSetting" ref="dataMapSetting" data-z-index="100">
      Layer&nbsp;<input class="dataMapSettingInput" type="number" v-model="theConfig.layerConfig" :placeholder="theConfig.layerConfig">
      Speed&nbsp;<input class="dataMapSettingInput" type="number" v-model="theConfig.moveSpeed" :placeholder="theConfig.moveSpeed">
      <button class="dataMapSettingButton" style="background: #3590ff" @click="doCreateLine()" v-if="doNeedEditMap">新建</button>
      <button class="dataMapSettingButton" style="background: #ffffff" @click="doCreateLine()" v-if="!doNeedEditMap">新建</button>
      <span>|</span>
      <span>{{theConfig.username+"("+theConfig.userId+")"}}</span>
      <button class="dataMapSettingButton" style="background: #ffffff" @click="linkServer()" v-if="!doLinkServer">登入</button>
      <button class="dataMapSettingButton" style="background: #ffffff" @click="" v-if="doLinkServer">登出</button>
      <br/>
      A1Point&nbsp;X:|{{theConfig.fourPoint.a1.x}}|px&nbsp;&nbsp;&nbsp;&nbsp;Y:|{{theConfig.fourPoint.a1.y}}|px<br/>
      A2Point&nbsp;X:|{{theConfig.fourPoint.a2.x}}|px&nbsp;&nbsp;&nbsp;&nbsp;Y:|{{theConfig.fourPoint.a2.y}}|px<br/>
      A3Point&nbsp;X:|{{theConfig.fourPoint.a3.x}}|px&nbsp;&nbsp;&nbsp;&nbsp;Y:|{{theConfig.fourPoint.a3.y}}|px<br/>
      A4Point&nbsp;X:|{{theConfig.fourPoint.a4.x}}|px&nbsp;&nbsp;&nbsp;&nbsp;Y:|{{theConfig.fourPoint.a4.y}}|px<br/>
      CenterPoint&nbsp;X:|{{theConfig.centerPoint.x}}|px&nbsp;&nbsp;&nbsp;&nbsp;Y:|{{theConfig.centerPoint.y}}|px<br/>
      MousePoint&nbsp;X:{{theConfig.mousePointConfig.x}}px&nbsp;&nbsp;&nbsp;&nbsp;Y:{{theConfig.mousePointConfig.y}}px<br/>
      focusPoint&nbsp;X:{{theConfig.focusPoint.x}}px&nbsp;&nbsp;&nbsp;&nbsp;Y:{{theConfig.focusPoint.y}}px<br/>
      distanceA1ToCenter&nbsp;X:{{theConfig.distanceA1ToCenter.x}}px&nbsp;&nbsp;&nbsp;&nbsp;Y:{{theConfig.distanceA1ToCenter.y}}px<br/>
      ScreenWv&nbsp;{{theConfig.screenConfig.width}}px<br/>
      ScreenHv&nbsp;{{theConfig.screenConfig.height}}px<br/>
      widthForVirtual:|&nbsp;{{theConfig.screenConfig.widthForVirtual}}|px<br/>
      HeightForVirtual:|&nbsp;{{theConfig.screenConfig.heightForVirtual}}|px<br/>
      widthForReal&nbsp;{{theConfig.screenConfig.widthForReal}}米<br/>
      heightForReal&nbsp;{{theConfig.screenConfig.heightForReal}}米<br/>
      Layer&nbsp;{{theConfig.layerConfig}}<br/>
    </div>
    <!--数据展示及其编辑-->
    <div class="dataMapContent" id="dataMapContent" ref="dataMapContent" @click="mouseClickDown($event)" @mousemove="mouseClickMove($event)" @dblclick="mouseDblclick($event)">

    </div>
    <link-page ref="linkPage"></link-page>
  </div>
</template>

<script>
import LinkPage from "./linkPage";
export default {
  name: "dataMap",
  components: {LinkPage},
  data(){
    return{
      theConfig:{
          //当前鼠标坐标配置
          mousePointConfig:{
            x:null,
            y:null
          },
          //画布配置
          screenConfig:{
            //显示器屏幕的大小，单位:px
            width:null,
            height:null,
            //当前层级下地图的虚拟大小，单位:px
            widthForVirtual:null,
            heightForVirtual:null,
            //地图的实际大小，每1单位等于0.0000001经度或维度
            widthForReal:3600000000,
            heightForReal:1800000000,
          },
          //默认层级(一般用在第一次打开地图时)
          //放大与缩小幅度配置
          zoomAmplitudeConfig:{
            up:1.1,
            down:0.9
          },
          //移动速度
          moveSpeed:1,
          //层级配置
          layerConfig:0,
          //四点配置
          fourPoint: {
            a1:{x:0,y:0},
            a2:{x:0,y:0},
            a3:{x:0,y:0},
            a4:{x:0,y:0}
          },
          //中心点
          centerPoint:{
            x:0,
            y:0
          },
          //关注点
          focusPoint:{
            x:0,
            y:0
          },
          //上一次缩放时a1与centerPoint的差距
          distanceA1ToCenter:{
            x:null,
            y:null
          },
          username:"user",
          userId:0
        },
      //关注点鼠标监听器
      focusPointEvent:false,
      //是否需要编辑地图
      doNeedEditMap:false,
      //表示编辑器是否存在
      editExecutor:null,
      //是否需要移动地图
      doNeedMoveMap:false,
      //表示绘图器是否存在
      paintExecutor:null,
      //event新旧列表-创建line专用
      editEvent:[],
      //event新旧列表-鼠标中键拖动地图专用
      mouseEvents:[],
      //上一帧event数组列表-鼠标中键拖动地图专用
      oldMouseEvents:[],
      //登录
      doLinkServer:false
    }
  },
  methods:{
    //初始化配置
    "startSetting"(){
      //当前层级
      let nowLayer=this.theConfig.layerConfig;
      //当前地图真实大小
      let nowMapRealSize={"width":this.theConfig.screenConfig.widthForReal, "height":this.theConfig.screenConfig.heightForReal};
      //获取当前地图虚拟大小
      let nowVirtualSize=this.computeVirtualSize(nowLayer);
      //获取当前屏幕尺寸
      let nowScreenSize={"width":this.theConfig.screenConfig.width, "height":this.theConfig.screenConfig.height};
      //获取四角点
      let nowFourPoint=this.theConfig.fourPoint=this.computeDefaultVirtualFourPoint(nowVirtualSize,nowScreenSize);
      //获取屏幕中心点
      let screenCenterPoint=this.theConfig.centerPoint=this.getScreenCenterPoint(nowFourPoint);
      //设置更新关注点
      this.listenFocusPoint();
      //移动视角
      this.visualAngleMove();
      //缩放视角
      this.visualAngleScale();
      //打印当前屏幕尺寸
      //this.$root.general_script.alert_tips(nowScreenSize.width+"×"+nowScreenSize.height)
      //20220515 distanceA1ToCenter 实际上等同于使用(ScreenWv/2 , ScreenHv/2),当浏览器窗口进行缩放时，four point 出现错误，表现为长宽值不等于实际的ScreenWv、ScreenHv,请解决
    },
    //对相机相关的更新，用于窗口改变时
    cameraSetting(){
      //当前层级
      let nowLayer=this.theConfig.layerConfig;
      //获取当前地图虚拟大小
      let nowVirtualSize=this.computeVirtualSize(nowLayer);
      //获取当前屏幕尺寸
      let nowScreenSize={"width":this.theConfig.screenConfig.width, "height":this.theConfig.screenConfig.height};
      console.log(nowScreenSize);
      //获取四角点
      let nowFourPoint=this.theConfig.fourPoint=this.computeDefaultVirtualFourPoint(nowVirtualSize,nowScreenSize);
      //获取屏幕中心点
      let screenCenterPoint=this.theConfig.centerPoint=this.getScreenCenterPoint(nowFourPoint);
    },
    ////////登录////////
    linkServer(){
      if(!this.doLinkServer){

      }
      this.$refs.linkPage.openPage();
    },
    ////////登录////////
    ////////编辑////////
    //准备新建一条line
    "doCreateLine"(){
      //允许创建
      this.doNeedEditMap=!this.doNeedEditMap;
    },
    /*创建一条line
      注意事项：
      线段的长度属于真实长度，单位为M(米)
      必要参数：
      startPointConfig(Array(Object{x:Number,y:Number},...),minLength:1),
      lineLengthConfig(Array(Number,...),minLength:1)
      lineAngleConfig(Array(Number,...),minLength:1)
      可选参数：
      lineColor(String(#FFCCEE || Rgb(255,255,255,1) || red),default:black)
      lineWidth(Number(2),default:2,unit:px)
      lineAttribute(Object({
      name:"river Road,default:Road",
      describe:"that is so long,default:''",
      master:"sophie,default:'anybody'",
      viewer:Array("sophie",...,minLength:1,default:'anybody'),
      editor:Array("sophie",...,minLength:1,default:'anybody'),
      and it's DIV
      ...}))
    */
    "createLine"(startPointConfig, lineLengthConfig, lineAngleConfig, lineColor, lineWidth, lineAttribute){

    },
    ////////编辑////////
    ////////动作////////
    //鼠标按下
    "mouseClickDown"(e){
      if(this.doNeedEditMap){
        try {
          this.editEvent.push(e);
          //1.计算该点的真实坐标(A)单位为M
          let screenPointX=e.x;
          let screenPointY=e.y;
          let A1pintX=this.strFormulaToArray(this.theConfig.fourPoint.a1.x);
          let A1pintY=this.strFormulaToArray(this.theConfig.fourPoint.a1.y);
          console.log(A1pintX);
          let mouseMovePointX=null;
          let mouseMovePointY=null;
          A1pintX[4]+=screenPointX/Math.pow(1.1,this.theConfig.layerConfig);
          A1pintY[4]+=screenPointY/Math.pow(1.1,this.theConfig.layerConfig);
          let tempX=JSON.parse(JSON.stringify(A1pintX));
          let tempY=JSON.parse(JSON.stringify(A1pintY));
          console.log("计算前，A，用户点击point的虚拟坐标为：");
          console.log({"x":this.arrayFormulaToNumber(tempX), "y":this.arrayFormulaToNumber(tempY)});
          let ArealX=this.arrayFormulaToReal(A1pintX);
          let ArealY=this.arrayFormulaToReal(A1pintY);
          console.log("计算后，A，用户点击point的现实坐标为：");
          console.log({"x":ArealX, "y":ArealY});
        }catch (error){

        }
      }
    },
    //鼠标移动\编辑模式
    "mouseClickMove"(e){
      if(this.doNeedEditMap){
        try{
          this.theConfig.mousePointConfig.x=e.x;
          this.theConfig.mousePointConfig.y=e.y;
        }catch (error){

        }
      }
    },
    //鼠标双击结束\编辑模式
    "mouseDblclick"(e){
      if(this.doNeedEditMap){
        try{
          //1.计算该点的真实坐标(B)单位为M
          this.editEvent.pop();
          this.editEvent.pop();
          this.editEvent.push(e);

        }catch (error){

        }
      }
    },
    //鼠标按下\编辑模式
    "mouseDown"(e){
      if(e.button===1){
        this.doNeedMoveMap=true;
        this.mouseEvents.push(e);
      }
    },
    //鼠标移动\视角移动
    "mouseMove"(e){
      if(this.doNeedMoveMap){
        if(this.mouseEvents.length<4){//第一次，数组长度决定了精度
          this.mouseEvents.push(e);
        }else {//删除旧Event加入新event
          this.mouseEvents.shift();
          this.mouseEvents.push(e);
        }
      //添加绘图执行者，绘图执行者通过比较mouseEvent数组内的第一个Event和最后一个Event判断和改变A1
      if(this.paintExecutor==null){
        this.paintExecutor=setInterval(
        ()=>{
          try{
            let oldEvent=undefined;
            oldEvent=this.mouseEvents[0];
            let newEvent=undefined;
            newEvent=this.mouseEvents[this.mouseEvents.length-1];
            if(oldEvent.x!==newEvent.x && oldEvent.y!==newEvent.y){//仅限于前后两个事件出现变化时才改变A1
              if(this.oldMouseEvents[0]!==oldEvent && this.oldMouseEvents[1]!==newEvent){//仅限于前后两帧的Event不同，及鼠标移动时才改变A1
                let changeX=newEvent.x-oldEvent.x;
                let changeY=newEvent.y-oldEvent.y;
                //移动four point
                //x转化为数组
                let a1xArr=this.strFormulaToArray(this.theConfig.fourPoint.a1.x);
                let a2xArr=this.strFormulaToArray(this.theConfig.fourPoint.a2.x);
                let a3xArr=this.strFormulaToArray(this.theConfig.fourPoint.a3.x);
                let a4xArr=this.strFormulaToArray(this.theConfig.fourPoint.a4.x);
                a1xArr[4]-=(changeX*this.theConfig.moveSpeed);
                a2xArr[4]-=(changeX*this.theConfig.moveSpeed);
                a3xArr[4]-=(changeX*this.theConfig.moveSpeed);
                a4xArr[4]-=(changeX*this.theConfig.moveSpeed);
                this.theConfig.fourPoint.a1.x=this.arrayToStrFormula(a1xArr);
                this.theConfig.fourPoint.a2.x=this.arrayToStrFormula(a2xArr);
                this.theConfig.fourPoint.a3.x=this.arrayToStrFormula(a3xArr);
                this.theConfig.fourPoint.a4.x=this.arrayToStrFormula(a4xArr);
                //y转化为数组
                let a1yArr=this.strFormulaToArray(this.theConfig.fourPoint.a1.y);
                let a2yArr=this.strFormulaToArray(this.theConfig.fourPoint.a2.y);
                let a3yArr=this.strFormulaToArray(this.theConfig.fourPoint.a3.y);
                let a4yArr=this.strFormulaToArray(this.theConfig.fourPoint.a4.y);
                a1yArr[4]-=(changeY*this.theConfig.moveSpeed);
                a2yArr[4]-=(changeY*this.theConfig.moveSpeed);
                a3yArr[4]-=(changeY*this.theConfig.moveSpeed);
                a4yArr[4]-=(changeY*this.theConfig.moveSpeed);
                this.theConfig.fourPoint.a1.y=this.arrayToStrFormula(a1yArr);
                this.theConfig.fourPoint.a2.y=this.arrayToStrFormula(a2yArr);
                this.theConfig.fourPoint.a3.y=this.arrayToStrFormula(a3yArr);
                this.theConfig.fourPoint.a4.y=this.arrayToStrFormula(a4yArr);
                //移动center point
                //x
                let centerX=this.strFormulaToArray(this.theConfig.centerPoint.x);
                centerX[4]-=(changeX*this.theConfig.moveSpeed);
                this.theConfig.centerPoint.x=this.arrayToStrFormula(centerX);
                //y
                let centerY=this.strFormulaToArray(this.theConfig.centerPoint.y);
                centerY[4]-=(changeY*this.theConfig.moveSpeed);
                this.theConfig.centerPoint.y=this.arrayToStrFormula(centerY);
                this.oldMouseEvents=[];
              }
              this.oldMouseEvents.push(oldEvent,newEvent);
            }
          }catch (error){
          }
        }
      ,10)//每隔11毫秒修改一次A1
      }
      }
    },
    //鼠标松开\视角固定
    "mouseUp"(e){
      if(e.button===1){
        this.doNeedMoveMap=false;
        this.mouseEvents=[];
        clearInterval(this.paintExecutor);
        this.paintExecutor=null;
      }
    },
    ////////动作////////
    ////////formula////////
    /*用于将特定的一串数学计算公式字符串转化为数值
      formula 坐标系的重要知识:
      基本的方法:
      strFormulaToNumber()
      将一个formula转化为正常的数值，且默认取整

      strFormulaToArray()
      将一个formula转化为数组，以便于运算

      arrayToStrFormula()
      将一个数组转化为formula字符串

      在formula坐标系中，只能由formula str转化为number，不能由number转化为formula str
      formula坐标系中，所有的虚拟坐标均为formula类型
      formula坐标系可以解决地图中坐标精度的问题，因为formula坐标的xy数据存放方式是公式化存放坐标的，
      只有在移动、放大、缩小地图时，才会暂时将formula转化为具体的数值

      例子:
      "formula,20000,1.1,0,-960,0.5"

      Formula由以下部分构成:
      0：固定
      1：基数(多指现实世界中的公米)
      2：增幅率(指地图中进行单次放大或缩小时与基数之间的扩大倍率)
      3：增幅度(指地图中进行N次的增幅)
      4：平面偏移量(指坐标x或y在地图中进行的偏移量，一半用于调整地图中心位置)
      5：平面相对位置(指坐标x或y在地图中进行的特定增减量，一半用于初始化虚拟坐标与现实坐标的关系映射，
      也可以用于调整坐标在整个地图中的位置，数值在(0,1]之间，默认为1，即没有相对位置，当为0.5时即认为处于中央)
      */
    //formula的类型转换：
    "strFormulaToNumber"(str){
      let source=str;
      let Arr=this.strFormulaToArray(str);
      if(Arr.length!==6){
        return source;
      }else {
        if(Arr[0]!=="formula"){
          return {
            "type":'error',
            "value":false,
            "describe":'str is not a correct formula'
          }
        }else {
          try {
            return Math.round(((Arr[1]*Math.pow(Arr[2],Arr[3]))*Arr[5])+((Arr[4]*Math.pow(Arr[2],Arr[3])))*Arr[5]);
          }catch (error){
            return error
          }
        }
      }
    },
    //将一个arr formula转化为正常的数值，且默认取整
    "arrayFormulaToNumber"(Arr){
      if(Arr.length!==6){
        return Arr;
      }else {
        if(Arr[0]!=="formula"){
          return {
            "type":'error',
            "value":false,
            "describe":'str is not a correct formula'
          }
        }else {
          try {
            return Math.round(((Arr[1]*Math.pow(Arr[2],Arr[3]))*Arr[5])+((Arr[4]*Math.pow(Arr[2],Arr[3])))*Arr[5]);
          }catch (error){
            return error
          }
        }
      }
    },
    //用于将formula转化为真实的大小
    /*转化的原理：
      本质上是formulaToNumber的反函数
      比如对于：formula,20000,1.1,0,0,1
      它等同于现实世界的20000M,当发生缩放时，会变成
      formula,20000,1.1,1,0,1
      此时它并不等同于现实世界的20000*1.1，而是等于20000*1.1/1.1，即其基数
      不论后边的值如何变化其基数，永远不会变
      当我们创建一条lane时，需要将虚拟的转化为基数
      但A1本身就是一个formula数，那么直接套用它的基数显然是不行的

      例如：
      设第一个点A的屏幕位置x=150
      A1-x的formula为：formula,10000,1.1,0,-960,1
      则可得A-x的formula为：formula,10000,1.1,0,-810,1

      A1-X的现实长度为：9190M

      现在加入layer变量
      设第一个点A的屏幕位置X=150
      A1-x的formula为：formula,10000,1.1,1,-960,1
      则可达A-x的formula为：formula,10000,1.1,1,-810,1
      A1-X的现实长度为：((10000/1)/1.1^1)+(-810/1.1^1)
      * */
    "arrayFormulaToReal"(Arr){
      if(Arr.length!==6){
        return Arr;
      }else {
        if(Arr[0]!=="formula"){
          return {
            "type":'error',
            "value":false,
            "describe":'str is not a correct formula'
          }
        }else {
          try {
            return Math.round((Arr[1]/Math.pow(Arr[2],0))+(Arr[4]/Math.pow(Arr[2],0)));
          }catch (error){
            return error
          }
        }
      }
    },
    //用于将formula转化为可以计算的数组
    "strFormulaToArray"(formula){
      let Arr=formula.split(",");
      if (Arr.length!==6){
        return false;
      }else {
        for (let i=1;i<Arr.length;i++){
          Arr[i]=parseFloat(Arr[i]);
        }
      }
      return Arr;
    },
    //用于将数组转化为字符串,附带检查
    "arrayToStrFormula"(arr){
      if(arr[0]!=="formula"){
        console.log("virtual formula is wrong");
        return false;
      }else {
        return arr.toString();
      }
    },
    //formula的基础数学运算：
    /*这里正在计算center point ，然后利用center point和a1的距离差距，对缩放后的地图惊醒修正，使得看上去像是正中央放大或缩小的一样
    两个或多个formula的加法
    传入值:必须是一串formula字符串
    返回值:formula字符串
    最多可以传入60240个formula
    传入的formula必须满足以下条件
    即：两个或多个formula之间进行数学运算必须是处于同一个layer下，否则计算结果将会输出一个确切的数值，而非formula
    */
    "strFormulaAdd"(...formula){
      if(formula.length>60240){
        return false
      }
      //1转化第一个为数组格式的formula
      let args=this.strFormulaToArray(formula[0]);
      for (let i=1;i<formula.length;i++){
        let temp=this.strFormulaToArray(formula[i]);
        if(temp[3]!==args[3]){//检测到不同层级下的formula则报错
          this.$root.general_script.alert_tips("strFormulaAdd:formula layer is different");
          return false;
        }
        args[1]+=temp[1];
        args[4]+=temp[4];
      }
      return this.arrayToStrFormula(args);
    },
    /*formula除以整数
    传入值:必须是一串formula字符串
    返回值:formula字符串
    最多可以传入60240个formula
    */
    "strFormulaDivide"(formula,int){
      //转化为数组
      let args=this.strFormulaToArray(formula);
      args[1]=args[1]/int;
      args[4]=args[4]/int;
      return this.arrayToStrFormula(args);
    },
    ////////formula////////
    ////////测试////////
    //创建一条用于测试缩放的线段
    "createTestLine"(){
      //一条line最基本的要素为一个或多个StartPoint(x:M,y:M)
      //角度(度)
      //长度(M)
      //线条宽度(px)
      //设置配置文件
      let lineConfig={
        "startPointX":[1800000000],//单位为现实世界中的M
        "startPointY":[9000000000],//单位为现实世界中的M
        "angle":[45],//deg
        "lengths":[20000],//单位为现实世界中的M
        //不需要处理的选项
        "width":5,//虚拟的像素
        "background":"blue",//颜色
      };
      //依据配置创建
      let newLine=document.createElement("DIV");
      let dataMapContent=this.$refs.dataMapContent;
      let layer=this.theConfig.layerConfig;
      let virtualLineConfig={
        "startPointX":[],
        "startPointY":[],
        "lengths":[]
      }
      newLine.className="Line";

      //line的数据的初始化
      for(let xx=0;xx<lineConfig.startPointX.length;xx++){
        virtualLineConfig.startPointX[xx]=this.realChangeVirtual(lineConfig.startPointX[xx],layer);
      }
      for(let yy=0;yy<lineConfig.startPointX.length;yy++){
        virtualLineConfig.startPointY[yy]=this.realChangeVirtual(lineConfig.startPointY[yy],layer);
      }
      for(let ll=0;ll<lineConfig.lengths.length;ll++){
        virtualLineConfig.lengths[ll]=this.realChangeVirtual(lineConfig.lengths[ll],layer);
      }
      for(let i=0;i<lineConfig.angle.length;i++){
        let newSpan=document.createElement("SPAN");
        newSpan.style.height=lineConfig.width+"px";//虚拟,宽度
        newSpan.style.background=lineConfig.background;//颜色
        newSpan.style.transformOrigin="left top";//固定属性
        newSpan.style.transform="rotate("+lineConfig.angle[i]+"deg)";//角度
        newSpan.style.position="fixed";//固定属性
        newSpan.setAttribute("data-x",virtualLineConfig.startPointX[i]);//虚拟
        newSpan.setAttribute("data-y",virtualLineConfig.startPointY[i]);//虚拟
        newSpan.setAttribute("data-w",virtualLineConfig.lengths[i]);//虚拟
        newSpan.setAttribute("data-rotate",lineConfig.angle[i]);//角度
        newSpan.setAttribute("data-x-r",lineConfig.startPointX[i]);//实际
        newSpan.setAttribute("data-y-r",lineConfig.startPointY[i]);//实际
        newSpan.setAttribute("data-w-r",lineConfig.lengths[i]);//实际
        newLine.appendChild(newSpan);
      }
      dataMapContent.appendChild(newLine);
      //   let newLane=document.createElement("SPAN");
      //   newLane.style.width=this.theConfig.screenConfig.width+"px";
      //   newLane.style.height="1px";
      //   newLane.style.background='red';
      //   newLane.style.top=ry+"px";
      //   newLane.style.left=fourPoint.a1.x+"px";
      //   newLane.style.position="fixed";
      //   newLane.setAttribute("data-name","lane");
      //   newLane.setAttribute("data-x",fourPoint.a1.x);
      //   newLane.setAttribute("data-y",ry);
      //   newLane.setAttribute("data-w",this.theConfig.screenConfig.width);
      //   newLine.appendChild(newLane);
      //
      // dataMap.appendChild(newLine);
    },
    /*一个简单的Real=>Virtual(Formula),用于创建lane,
    参数:real,真实的real长度
    */
    ////////测试////////
    ////////相机////////
    "realChangeVirtual"(real, layer){
      return "formula,"+real+","+this.theConfig.zoomAmplitudeConfig.up+","+layer+",0,1"
      /*
      if(newLayer===oldLayer){return real;}
      let range=undefined;
      if(newLayer>=0){
        range=this.theConfig.zoomAmplitudeConfig.up;
        if(oldLayer<newLayer){
          return real*Math.pow(range,Math.abs(oldLayer-newLayer))
        }else {
          return real/Math.pow(range,Math.abs(oldLayer-newLayer))
        }
      }else {
        range=this.theConfig.zoomAmplitudeConfig.down;
        if(oldLayer===0){
          return real*Math.pow(range,Math.abs(oldLayer-newLayer))
        }
        if(oldLayer<newLayer){
          return real*Math.pow(range,Math.abs(oldLayer-newLayer))
        }else {
          return real/Math.pow(range,Math.abs(oldLayer-newLayer))
        }
      }
      */
      // let range=undefined;
      // if(lay>=0){range=this.theConfig.zoomAmplitudeConfig.up}
      // else {range=this.theConfig.zoomAmplitudeConfig.down}
      // lay=Math.abs(lay);
      // console.log("oldLayer");
      // console.log(oldLayer);
      // console.log("layer");
      // console.log(lay);
      // if(oldLayer>lay){
      //   return real/(Math.pow(range,Math.abs(oldLayer-lay)))
      // }else {
      //   return real*(Math.pow(range,Math.abs(oldLayer-lay)))
      // }
    },
    //用于鼠标滚轮与缩放绑定
    "mousewheelToScale"(e){
      let chromeE=e.wheelDelta;
      let firFoxE=e.detail;
      //console.log(chromeE);
      //console.log(firFoxE);
      if(chromeE%120===0){
        if(chromeE>0){
          this.theConfig.layerConfig++;
        }else {
          this.theConfig.layerConfig--;
        }
      }else if(firFoxE%3===0){
        this.theConfig.layerConfig++;
        if(firFoxE>0){
          this.theConfig.layerConfig++;
        }else {
          this.theConfig.layerConfig--;
        }
      }
    },
    //用于缩放地图数据，将已经创建的数据进行相对的缩放
    "visualAngleScale"(){
      let newLayer=this.theConfig.layerConfig;
      //更新缩放后的fourPoint\a1\wfv
      //x转化为数组
      let a1xArr=this.strFormulaToArray(this.theConfig.fourPoint.a1.x);
      let a2xArr=this.strFormulaToArray(this.theConfig.fourPoint.a2.x);
      let a3xArr=this.strFormulaToArray(this.theConfig.fourPoint.a3.x);
      let a4xArr=this.strFormulaToArray(this.theConfig.fourPoint.a4.x);
      a1xArr[3]=newLayer;
      a2xArr[3]=newLayer;
      a3xArr[3]=newLayer;
      a4xArr[3]=newLayer;
      this.theConfig.fourPoint.a1.x=this.arrayToStrFormula(a1xArr);
      this.theConfig.fourPoint.a2.x=this.arrayToStrFormula(a2xArr);
      this.theConfig.fourPoint.a3.x=this.arrayToStrFormula(a3xArr);
      this.theConfig.fourPoint.a4.x=this.arrayToStrFormula(a4xArr);
      //y转化为数组
      let a1yArr=this.strFormulaToArray(this.theConfig.fourPoint.a1.y);
      let a2yArr=this.strFormulaToArray(this.theConfig.fourPoint.a2.y);
      let a3yArr=this.strFormulaToArray(this.theConfig.fourPoint.a3.y);
      let a4yArr=this.strFormulaToArray(this.theConfig.fourPoint.a4.y);
      a1yArr[3]=newLayer;
      a2yArr[3]=newLayer;
      a3yArr[3]=newLayer;
      a4yArr[3]=newLayer;
      this.theConfig.fourPoint.a1.y=this.arrayToStrFormula(a1yArr);
      this.theConfig.fourPoint.a2.y=this.arrayToStrFormula(a2yArr);
      this.theConfig.fourPoint.a3.y=this.arrayToStrFormula(a3yArr);
      this.theConfig.fourPoint.a4.y=this.arrayToStrFormula(a4yArr);
      //widthForVirtual
      //转化为数组
      let scrWV=this.strFormulaToArray(this.theConfig.screenConfig.widthForVirtual);
      scrWV[3]=newLayer;
      this.theConfig.screenConfig.widthForVirtual=this.arrayToStrFormula(scrWV);
      //转化为数组
      let scrHV=this.strFormulaToArray(this.theConfig.screenConfig.heightForVirtual);
      scrHV[3]=newLayer;
      this.theConfig.screenConfig.heightForVirtual=this.arrayToStrFormula(scrHV);
      let dataMapContent=this.$refs.dataMapContent;
      //更新缩放后的centerPoint\wfv
      let centerPointX=this.strFormulaToArray(this.theConfig.centerPoint.x);
      let centerPointY=this.strFormulaToArray(this.theConfig.centerPoint.y);
      centerPointX[3]=newLayer;
      centerPointY[3]=newLayer;
      this.theConfig.centerPoint.x=this.arrayToStrFormula(centerPointX);
      this.theConfig.centerPoint.y=this.arrayToStrFormula(centerPointY);
      //移动a1使得视角始终居中
      //0.了解前一次的距离
      if(this.theConfig.distanceA1ToCenter.x===null){//
        //第一次
        //1.获取与中心点的x距离
        let nowCenterPointX=this.strFormulaToArray(this.theConfig.centerPoint.x);
        let nowCenterPointY=this.strFormulaToArray(this.theConfig.centerPoint.y);
        let nowA1X=this.strFormulaToArray(this.theConfig.fourPoint.a1.x);
        let nowA1Y=this.strFormulaToArray(this.theConfig.fourPoint.a1.y);
        let nowDistanceA1ToCenterX=this.theConfig.distanceA1ToCenter.x=this.arrayFormulaToNumber(nowCenterPointX)-this.arrayFormulaToNumber(nowA1X);
        let nowDistanceA1ToCenterY=this.theConfig.distanceA1ToCenter.y=this.arrayFormulaToNumber(nowCenterPointY)-this.arrayFormulaToNumber(nowA1Y);
      }else {
        //不是第一次
        let nowDistance={x:null,y:null};
        //1.获取与关注点的x距离
        let nowCenterPointX=this.strFormulaToArray(this.theConfig.centerPoint.x);
        //let nowFocusPointX=this.strFormulaToArray(this.theConfig.focusPoint.x);
        let nowCenterPointY=this.strFormulaToArray(this.theConfig.centerPoint.y);
        //let nowFocusPointY=this.strFormulaToArray(this.theConfig.focusPoint.y);
        let nowA1X=this.strFormulaToArray(this.theConfig.fourPoint.a1.x);
        let nowA1Y=this.strFormulaToArray(this.theConfig.fourPoint.a1.y);
        nowDistance.x=this.arrayFormulaToNumber(nowCenterPointX)-this.arrayFormulaToNumber(nowA1X);
        //nowDistance.x=this.arrayFormulaToNumber(nowFocusPointX)-this.arrayFormulaToNumber(nowA1X);
        nowDistance.y=this.arrayFormulaToNumber(nowCenterPointY)-this.arrayFormulaToNumber(nowA1Y);
        //nowDistance.y=this.arrayFormulaToNumber(nowFocusPointY)-this.arrayFormulaToNumber(nowA1Y);
        //2计算两次的偏差
        //2.1x的偏差
        let xOffset=nowDistance.x-this.theConfig.distanceA1ToCenter.x;
        //let xOffset=nowDistance.x-this.theConfig.distanceA1ToCenter.x;
        let yOffset=nowDistance.y-this.theConfig.distanceA1ToCenter.y;
        //let yOffset=nowDistance.y-this.theConfig.distanceA1ToCenter.y;
        //3偏移a1
        //3.1x
        let a1OffsetX=this.strFormulaToArray(this.theConfig.fourPoint.a1.x);
        a1OffsetX[4]+=Math.round(xOffset/(Math.pow(this.theConfig.zoomAmplitudeConfig.up,this.theConfig.layerConfig)));
        this.theConfig.fourPoint.a1.x=this.arrayToStrFormula(a1OffsetX);
        //3.1y
        let a1OffsetY=this.strFormulaToArray(this.theConfig.fourPoint.a1.y);
        a1OffsetY[4]+=Math.round(yOffset/(Math.pow(this.theConfig.zoomAmplitudeConfig.up,this.theConfig.layerConfig)));
        this.theConfig.fourPoint.a1.y=this.arrayToStrFormula(a1OffsetY);
        //更新Distance
        //this.theConfig.distanceA1ToCenter=nowDistance;
        console.log(this.theConfig.distanceA1ToCenter);
      }
      for(let child=0;child<dataMapContent.childNodes.length;child++){
        for(let span=0;span<dataMapContent.childNodes[child].childNodes.length;span++){//更新每段线的x\y\w
          //0.1获取data-x
          let dataXArr=this.strFormulaToArray(dataMapContent.childNodes[child].childNodes[span].getAttribute("data-x"));
          dataXArr[3]=newLayer;
          dataMapContent.childNodes[child].childNodes[span].setAttribute("data-x",this.arrayToStrFormula(dataXArr));
          //0.1获取data-y
          let dataYArr=this.strFormulaToArray(dataMapContent.childNodes[child].childNodes[span].getAttribute("data-y"));
          dataYArr[3]=newLayer;
          dataMapContent.childNodes[child].childNodes[span].setAttribute("data-y",this.arrayToStrFormula(dataYArr));
          //重置width
          //0.1获取data-w
          let dataWArr=this.strFormulaToArray(dataMapContent.childNodes[child].childNodes[span].getAttribute("data-w"));
          dataWArr[3]=newLayer;
          dataMapContent.childNodes[child].childNodes[span].setAttribute("data-w",dataWArr);

          dataMapContent.childNodes[child].childNodes[span].style.width=this.strFormulaToNumber(this.arrayToStrFormula(dataWArr))+"px";
        }
      }
    },
    //该函数用于初始化或移动时,将创建的数据进行相对移动
    "visualAngleMove"(){
      let dataMapContent=this.$refs.dataMapContent;
      for(let child=0;child<dataMapContent.childNodes.length;child++){
        for(let span=0;span<dataMapContent.childNodes[child].childNodes.length;span++){
          let theDataX=this.strFormulaToNumber(dataMapContent.childNodes[child].childNodes[span].getAttribute('data-x'));//虚拟
          let theDataY=this.strFormulaToNumber(dataMapContent.childNodes[child].childNodes[span].getAttribute('data-y'));//虚拟
          let A1=this.theConfig.fourPoint.a1;
          let result={"x":theDataX-this.strFormulaToNumber(A1.x), "y":theDataY-this.strFormulaToNumber(A1.y)};
          dataMapContent.childNodes[child].childNodes[span].style.left=result.x+"px";
          dataMapContent.childNodes[child].childNodes[span].style.top=result.y+"px";
        }
      }
    },
    "listenFocusPoint"(){
      this.$refs.dataMap.addEventListener("mousemove",(e)=>{
        //包含formula

        // let layer=this.theConfig.layerConfig;
        // let a1x=this.strFormulaToArray(this.theConfig.fourPoint.a1.x);
        // a1x[4]+=Math.round(e.x/Math.pow(this.theConfig.zoomAmplitudeConfig.up,layer));
        // let a1xF=this.arrayToStrFormula(a1x);
        // let a1y=this.strFormulaToArray(this.theConfig.fourPoint.a1.y);
        // a1y[4]+=Math.round(e.y/Math.pow(this.theConfig.zoomAmplitudeConfig.up,layer));
        // let a1yF=this.arrayToStrFormula(a1y);

        //直接数据
        //this.theConfig.distanceA1ToCenter.x=e.x;
        //this.theConfig.distanceA1ToCenter.y=e.y;
      })
    },
    ////////相机////////
    ////////屏幕硬件////////
    //监听屏幕变化
    "listenScreenChange"(){
      const that=this;
      window.addEventListener('resize',function (){
        that.getScreenSize();//重新获取屏幕高宽
        that.cameraSetting();//更新配置
      })
    },
    //获取屏幕高度和宽度
    "getScreenSize"(){
      this.theConfig.screenConfig.width=document.documentElement.clientWidth;
      this.theConfig.screenConfig.height=document.documentElement.clientHeight;
    },
    /*计算当前层级下的px尺寸
    层级规则：
    每层的增加或减少都是在上一层的基础上+10%或-10%的Virtual size
    默认层级为0层,即每1PX等价于1M
    例如：
    层级    虚拟宽度    真实宽度
    -2     16200px    20000M
    -1     18000px    20000M
    0      20000px    20000M
    1      22000px    20000M
    2      24200px    20000M
    参数：1，layer，层级，类型int；
    返回object({"width":Number(),"height":Number()})
    */
    "computeVirtualSize"(layer){
      try {
        //0.1获取画布的实际大小
        let mapRealWidth=this.theConfig.screenConfig.widthForReal;
        let mapRealHeight=this.theConfig.screenConfig.heightForReal;
        let range=this.theConfig.zoomAmplitudeConfig.up;
        let temp={
          //formula,20000,1.1,0,0
          "width":"formula,"+mapRealWidth+","+range+","+layer+",0,1",
          "height":"formula,"+mapRealHeight+","+range+","+layer+",0,1"
        }
        this.theConfig.screenConfig.widthForVirtual=temp.width;
        this.theConfig.screenConfig.heightForVirtual=temp.height;
        return temp
        //1得到当前的v screen

      } catch (error){

      }
    },
    /*计算当前层级下默认虚拟四角点
    参数：1，当前地图虚拟尺寸，单位px，类型obj；2，当前屏幕尺寸，单位px，类型obj
    返回参数详解
    {   a1:"左上角点"   a2:"右上角点"    a3:"右下叫点"    a4:"左下角点" }
    {   a1:{x:"x轴"     y: "y轴"    }  }
    */
    "computeDefaultVirtualFourPoint"(mapVirtualSize, screenSize){
      //1.x 轴计算
      //转化为数组
      let virtualSizeXArr=this.strFormulaToArray(mapVirtualSize.width);//地图的虚拟像素尺寸(公式)
      let screenSizeX=screenSize.width;//浏览器的真实像素尺寸
      let x1Arr=JSON.parse(JSON.stringify(virtualSizeXArr));
      let x2Arr=JSON.parse(JSON.stringify(virtualSizeXArr));
      x1Arr[1]=x1Arr[1]*0.5;
      x1Arr[4]=x1Arr[4]-(screenSizeX/2);
      x2Arr[1]=x2Arr[1]*0.5;
      x2Arr[4]=x2Arr[4]+(screenSizeX/2);
      let xValue={"x1":this.arrayToStrFormula(x1Arr), "x2":this.arrayToStrFormula(x2Arr)}
      //2.y 轴计算
      //转化为数组
      let virtualSizeYArr=this.strFormulaToArray(mapVirtualSize.height);//地图的虚拟像素尺寸(公式)
      let screenSizeY=screenSize.height;//浏览器的真实像素尺寸
      let y1Arr=JSON.parse(JSON.stringify(virtualSizeYArr));
      let y2Arr=JSON.parse(JSON.stringify(virtualSizeYArr));
      y1Arr[1]=y1Arr[1]*0.5;
      y1Arr[4]=y1Arr[4]-(screenSizeY/2);
      y2Arr[1]=y2Arr[1]*0.5;
      y2Arr[4]=y2Arr[4]+(screenSizeY/2);
      let yValue={"y1":this.arrayToStrFormula(y1Arr), "y2":this.arrayToStrFormula(y2Arr)}
      //输出对象
      return {
        "a1":{"x":xValue.x1, "y":yValue.y1},
        "a2":{"x":xValue.x2, "y":yValue.y1},
        "a3":{"x":xValue.x2, "y":yValue.y2},
        "a4":{"x":xValue.x1, "y":yValue.y2}
      }
    },
    //获取屏幕中心点
    "getScreenCenterPoint"(fourPoint){
      //获取fourpoint
      let center={x:null,y:null};
      center.x=this.strFormulaDivide(this.strFormulaAdd(fourPoint.a1.x,fourPoint.a3.x),2);
      center.y=this.strFormulaDivide(this.strFormulaAdd(fourPoint.a1.y,fourPoint.a3.y),2);
      return center;
    }
    ////////屏幕硬件////////
  },
  mounted() {
    //创建line的步骤应该在最前面
    //可以删除，测试用
    this.createTestLine();
    //慎重删除
    this.getScreenSize();
    this.listenScreenChange();
    this.startSetting();
    //绑定鼠标缩放
    try{
      this.$refs.dataMap.addEventListener("mousewheel",(e)=>{this.mousewheelToScale(e)});//chrome
    }catch (error){
      console.log(error);
    }
    try{
      this.$refs.dataMap.addEventListener("DOMMouseScroll",(e)=>{this.mousewheelToScale(e)});//firFox
    }catch (error){
      console.log(error);
    }
  },
  watch:{
    //监听a1，移动
    'theConfig.fourPoint.a1':{
      handler(newValue,oldValue){
        this.visualAngleMove();
      },
      deep:true,
      immediate:false
    },
    //监听layer，缩放
    'theConfig.layerConfig':{
      handler(newValue,oldValue){
        this.visualAngleScale();
      },
      deep:true,
      immediate:false
    }
  }
}
</script>

<style scoped>
.dataMap{
  background: #cdcdcd;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
/*setting*/
.dataMapSetting{
  width: 800px;
  height: auto;
  position: fixed;
  top:0px;
  left: 20px;
  font-size: 18px;
  color: rgba(14, 14, 14, 0.92);
  background: rgba(230, 240, 246, 0.2);
  z-index: 100;
}
.dataMapSettingInput{
  width: 35px;
  height: 18px;
}
.dataMapSettingButton{
  width: 60px;
  height: 24px;
}

/*content*/
.dataMapContent{
  width: 100%;
  height: 100%;
}
</style>
