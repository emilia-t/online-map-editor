<template>
  <div class="dataLayer" id="dataLayer" ref="dataLayer">

  </div>
</template>

<script>
export default {
  name: "dataLayer",
  data(){
    return {
      MY_NAME:"dataLayer"
    }
  },
  methods:{
    //初始化设置
    startSetting(){
      //获取浏览器配置
      this.getBrowserConfig();
      //添加一条测试line
      this.createTestLine();
      //当前层级
      let nowLayer=this.$store.state.mapConfig.layer;
      //初始化视角
      this.visualAngleMove();
      //提娜佳移动侦听
      this.mapMoveStart();
      this.mapMoveIng();
      this.mapMoveEnd();
    },
    //该函数用于初始化或移动时,将创建的数据进行相对移动
    visualAngleMove(){
      let dataLayer=this.$refs.dataLayer;
      for(let child=0;child<dataLayer.length;child++){
        let theDataX=dataLayer.childNodes[child].getAttribute('data-r-x');//虚拟
        let theDataY=dataLayer.childNodes[child].getAttribute('data-r-y');//虚拟
        let A1=this.$store.state.mapConfig.A1;
        let result={"x":theDataX-A1.x, "y":theDataY-A1.y};
        dataLayer.childNodes[child].style.left=result.x+"px";
        dataLayer.childNodes[child].style.top=result.y+"px";
      }
    },
    //获取浏览器高度和宽度
    getBrowserConfig(){
      this.$store.state.mapConfig.browser.width=window.innerWidth;
      this.$store.state.mapConfig.browser.height=window.innerHeight;
    },
    //创建一条测试用的Line
    createTestLine(){
      //0.box
      let box=this.$refs.dataLayer;
      //1.设定基本的参数
      let lineConfig={
        position:{
          x:0.0000621,
          y:0.0000302
        },
        angle:45,//角度
        length:200,//长度这里1等于0.0000001经线长度
        color:'#de3838',//颜色
        width:2,//宽度，这里表示是2px固定
      }
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
    },
    //一条line应有的事件
    lineEvents(){


    },
    //dataLayer的鼠标移动监听
    mapMoveStart(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousedown',(e)=>{
        this.$store.state.cameraConfig.doNeedMoveMap=true;
        console.log(e)
      })
    },
    //dataLayer的鼠标移动监听
    mapMoveIng(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mousemove',(e)=>{
        if(this.$store.state.cameraConfig.doNeedMoveMap){
          console.log(e)
        }
      })
    },
    //dataLayer的鼠标移动监听
    mapMoveEnd(){
      let dataLayer=this.$refs.dataLayer;
      dataLayer.addEventListener('mouseup',(e)=>{
        this.$store.state.cameraConfig.doNeedMoveMap=false;
        console.log(e)
      })
    },
    /**
     经纬度转化为整数
     1.number传入经纬度对象,默认00
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
      console.log(instructName);
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
