<template>
  <div class="controlLayerButtons selectNone" ref="controlLayerButton" v-bind:style="UserLayerTranslate">
    <img draggable="false" alt="按钮" :src="buttonImgProp" :style="'background:'+this.color"/>
  </div>
</template>

<script>
export default {
  name: "controlButtonLevel",
  data(){
    return {
      MY_NAME:"controlButtonLevel",
      A1:{x:0, y:0},
      doNeedMove:false,
      frameTime:8,
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
  props:{
    "buttonImgProp":{
      type:String,
      default:''
    },
    "rightPos":{
      type:String,
      default:'10px'
    },
    "topPos":{
      type:String,
      default:'100px'
    },
    "color":{
      type:String,
      default:'#fffb3d'
    }
  },
  methods:{
    startSetting(){
      this.mapMoveStart();
      this.mapMoveIng();
      this.mapMoveEnd();
    },
    mapMoveStart(){
      let handle=(e)=>{
        if(e.button===0){
          this.doNeedMove=true;
          let point={x:null,y:null};
          point.x=e.x;
          point.y=e.y;
          this.theData.moveStartPt=point;
        }
      }
      let controlLayerButton=this.$refs.controlLayerButton;
      controlLayerButton.addEventListener('mousedown',(e)=>handle(e));
    },
    //dataLayer的鼠标移动监听-移动
    mapMoveIng(){
      let handle=(e)=>{
        if(this.doNeedMove){
          this.theData.moveMovePt={x:e.x,y:e.y};
          if(this.theData.moveObServer===null){
            this.setMoveObServer();
          }
        }
      }
      let controlLayerButton=this.$refs.controlLayerButton;
      controlLayerButton.addEventListener('mousemove',(e)=>{handle(e)});
    },
    //移动结束
    mapMoveEnd(){
      let handle=(e)=>{
        if(e.button===0){
          this.doNeedMove=false;
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
      }
      let controlLayerButton=this.$refs.controlLayerButton;
      controlLayerButton.addEventListener('mouseup',(e)=>handle(e));
    },
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
                  this.A1.x+=xc3;
                  this.A1.y+=yc4;
                  break;
                }
                case 0:{//空
                  this.theData.moveObServerDt.push(pt);
                  let Apt=this.theData.moveStartPt;
                  let xc,yc;
                  xc=(pt.x-Apt.x)*-1;
                  yc=(pt.y-Apt.y);
                  this.A1.x+=xc;
                  this.A1.y+=yc;
                  break;
                }
                case 1:{
                  this.theData.moveObServerDt.push(pt);
                  let Bpt=this.theData.moveObServerDt[0];
                  let xc2,yc2;
                  xc2=(pt.x-Bpt.x)*-1;
                  yc2=pt.y-Bpt.y;
                  this.A1.x+=xc2;
                  this.A1.y+=yc2;
                  break;
                }
                default:{
                  break;
                }
              }
            }catch (e) {
              console.log('moveObServer bug');
              console.log(e);
            }
          }
          ,this.frameTime)
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
    //移除移动侦测器
    removeMoveObServer(){
      if(this.theData.moveObServer!==null) {//必须是存在的情况下
        clearInterval(this.theData.moveObServer);
        this.theData.moveObServer=null;
      }
    },
  },
  computed:{
    UserLayerTranslate(){
      return 'transform: translate('+(this.A1.x)*-1+'px,'+this.A1.y+'px);right:'+this.rightPos+';top:'+this.topPos;
    },
  },
  mounted() {
    this.startSetting();
  }
}
</script>

<style scoped>
.controlLayerButtons{
  padding: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top:20px;
}
.controlLayerButtons img{
  width: 50px;
  height: 50px;
  border-radius: 50px;
  overflow: hidden;
  transition: 0.3s;
  box-shadow:#e1e0e0 2px 2px 4px 1px;
}
.selectNone{
  -webkit-touch-callout:none; /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
</style>
