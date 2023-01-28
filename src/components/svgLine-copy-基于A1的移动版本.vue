<template>
    <polyline :points="dynamicPointsStr" :id="polyLineConfig.id" :data-source-points="dataSourcePoints" :style="{fill:'rgba(255,255,255,0)',stroke:polyLineConfig.color,strokeWidth:polyLineConfig.width}"/>
</template>
<script>
export default {
  name: "svgLine",
  data(){
    return {
      dataSourcePoints:null,//数据源保存
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0}//a1的缓存，用于每次移动时扣除上一次移动产生的A1距离
    }
  },
  props:{
    "polyLineConfig":{
      type:Object,
      default: {
        id:'p0000',
        type:'point',
        points:[{x:0.0000001,y:-0.0000001}],
        point:{x:0.0000001,y:-0.0000001},
        color:'#ec3232'
      }
    }
  },
  methods:{
    //初始化配置
    startSetting(){
      this.dataSourcePoints=this.dynamicPointsStr;
      this.mouseEvent();
    },
    //转化坐标
    translateCoordinate(float){
      return float*10000000;
    },
    //逆向转化坐标
    reTranslateCoordinate(float){
      return float/10000000;
    },
    //移动（移动结束后固定数据）
    move(){
      if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1.y-this.A1Cache.y;
        let newArr=this.polyLineConfig.points;
        for (let i=0;i<newArr.length;i++){
          this.polyLineConfig.points[i].x=this.reTranslateCoordinate(this.translateCoordinate(newArr[i].x)-A1mvX);
          this.polyLineConfig.points[i].y=this.reTranslateCoordinate(this.translateCoordinate(newArr[i].y)+A1mvY);
        }
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.$store.state.cameraConfig.occurredMoveMap=false;//告知已经处理本次移动过程
      }
      return true;
    },
    //缩放（直接修改数据）
    scale(){
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
      let newPosArr=[];
      for (let i=0;i<this.polyLineConfig.points.length;i++){
        const MOX=this.mouse.x;
        const MOY=this.mouse.y;
        const pointPos=this.polyLineConfig.points[i];
        const TRX=this.translateCoordinate(pointPos.x);
        const TRY=this.translateCoordinate(pointPos.y);
        const axSize=MOX-TRX;
        const aySize=MOY-TRY;
        let newPos={x:null,y:null};
        newPos.x=this.reTranslateCoordinate(TRX-((zoom*axSize)));
        newPos.y=this.reTranslateCoordinate(TRY-((zoom*aySize)));
        newPosArr.push(newPos);
      }
      this.polyLineConfig.points=newPosArr;
      //2023-1-17 留言：请再svgLine.vue内实现缩放和移动，将dataLayer.vue内的缩放和移动功能移除，转为只负责更新A1和layer
    },
    //监听鼠标移动
    mouseEvent(){
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;//告知相机发生过移动行为
      })
    }
  },
  mounted:function (){
    this.startSetting();
    //this.scale();
    //this.move();
  },
  computed:{
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    A1(){
      return this.$store.state.mapConfig.A1;
    },
    layer(){
      return this.$store.state.mapConfig.layer;
    },
    oldLayer(){
      return this.$store.state.mapConfig.oldLayer;
    },
    mouse(){
      return {x:this.$store.state.mapConfig.mousePoint.x,y:this.$store.state.mapConfig.mousePoint.y};
    },
    dynamicPointsStr() {
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let newArr = [];
        let newStr = '';
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1.y-this.A1Cache.y;
        newArr = this.polyLineConfig.points;
        for (let i = 0; i < newArr.length; i++) {
          let a = this.translateCoordinate(newArr[i].x) - A1mvX;
          let b = this.translateCoordinate(newArr[i].y) + A1mvY;
          if (i === newArr.length - 1) {
            newStr += a + ',' + b;
          } else {
            newStr += a + ',' + b + ' ';
          }
        }
          return newStr
      }else {
        let newArr = [];
        let newStr = '';
        newArr = this.polyLineConfig.points;
        for (let i = 0; i < newArr.length; i++) {
          let a = this.translateCoordinate(newArr[i].x);
          let b = this.translateCoordinate(newArr[i].y);
          if (i === newArr.length - 1) {
            newStr += a + ',' + b;
          } else {
            newStr += a + ',' + b + ' ';
          }
        }
        return newStr;
      }
    }
  },
  //移动过程中使用动态坐标，移动结束后修改源数据
  watch:{
    layer:{
      handler(newValue,oldValue){
        this.scale();
      }
    },
    doNeedMoveMap:{
      handler(newValue,oldValue){
        this.move();
      }
    }
  }
}
</script>
