<template>
  <!--显示我的A1，同时广播我的A1给其他人-->
  <g :elementId="elementId">
    <circle :cx="CX" :cy="CY" r="3"  stroke-width="1" :style="'fill:'+color"/>
    <text class="selectNone" :x="CX" :y="CY2" text-anchor="middle" :style="'fill:'+color">MyA1</text>
  </g>
</template>

<script>
export default {
  name: "svgA1Circle",
  data(){
    return {
      elementId:'A1',
      color:'#c49dec',
      A1Temp:null,
      obSever:null,
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0}//a1的缓存，用于每次移动时扣除上一次移动产生的A1距离
    }
  },
  mounted() {
    this.randomColor();
  },
  methods:{
    //随机颜色
    randomColor(){
      this.color=color16();
      function color16(){//十六进制颜色随机
        const r = Math.floor(Math.random()*256);
        const g = Math.floor(Math.random()*256);
        const b = Math.floor(Math.random()*256);
        const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
        return color;
      }
    },
    //移除广播
    removeBroadcast(){
      if(this.obSever!=null){
        clearInterval(this.obSever);
        this.obSever=null;
        this.A1Temp=null;
      }
    },
    //隔一段时间广播一次，避免占用网络资源
    addBroadcastTickA1(){
      if (this.obSever==null){
        this.obSever=setInterval(()=>{
          if(this.A1!==this.A1Temp){
            this.A1Temp=this.A1;//更新A1
            this.sendMyA1();
          }else {
            this.removeBroadcast();
          }
        },25)
      }
    },
    //发送我的A1
    sendMyA1(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.isLogin){
          try{
            let name=this.$store.state.serverData.socket.userData.user_name;
            this.$store.state.serverData.socket.broadcastMyA1(this.A1.x,this.A1.y,this.color,name);
          }catch (e) {
            console.log(e)
          }
        }
      }
    },
    scale(){
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      this.$store.state.mapConfig.A1Layer=layer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
      const MOX=this.mouse.x;
      const MOY=this.mouse.y;
      const pointPos=this.A1;
      const TRX=-pointPos.x;
      const TRY=pointPos.y;
      const axSize=MOX-TRX;
      const aySize=MOY-TRY;
      let newPos={x:null,y:null};
      newPos.x=-(TRX-((zoom*axSize)));
      newPos.y=TRY-((zoom*aySize));
      this.$store.state.mapConfig.A1.x=newPos.x;
      this.$store.state.mapConfig.A1.y=newPos.y;
    },
  },
  computed:{
    A1(){
      return this.$store.state.mapConfig.A1;
    },
    CX(){
      return -this.$store.state.mapConfig.A1.x;
    },
    CY(){
      return this.$store.state.mapConfig.A1.y;
    },
    CY2(){
      return this.$store.state.mapConfig.A1.y-10;
    },
    layer(){
      return this.$store.state.mapConfig.layer;
    },
    oldLayer(){
      return this.$store.state.mapConfig.oldLayer;
    },
    mouse(){
      return {x:this.$store.state.mapConfig.mousePoint.x,y:this.$store.state.mapConfig.mousePoint.y};
    }
  },
  watch:{
    A1:{
      handler(newValue){
        //1.发送新的位置
        this.addBroadcastTickA1();
      },
      deep:true
    },
    layer:{
      handler(newValue,oldValue){
        //this.scale();
        //由于a1缩放存在bug:缩放后导致要素移动不合理，所以暂时禁用
      }
    }
  }
}
</script>

<style scoped>
.selectNone{
  -webkit-touch-callout:none; /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
</style>
