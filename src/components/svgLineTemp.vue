<template>
  <g :elementId="tempLine.id">
    <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" v-for="str in dynamicPointsStr" :style="{fill:'rgba(255,255,255,0)',stroke:'#'+tempLine.color,strokeWidth:tempLine.width}"/>
    <!--下一行用于显示预览轨迹，仅当第一个点建立之后，且当结束绘制后关闭，第一个点为最后一个点，第二个点依据鼠标移动，第一个点跟随视图移动-->
    <polyline :points="previewLinePoints" v-if="previewLineShow" style="fill: rgba(10,10,10,0.2);stroke-width: 3px;stroke: rgba(10,10,10,0.2)"/>
    <circle v-show="!doNeedMoveMap" v-for="point in tempLine.showPos"  :cx="translateCoordinate(point.x)" :cy="-translateCoordinate(point.y)" r="4px" stroke-width="1" style="pointer-events: fill;fill-opacity: 0.8;fill: #bbb"/>
  </g>
</template>
<script>
export default {
  name: "svgLineTemp",
  data(){
    return {
      dataSourcePoints:null,//数据源保存
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0}//a1的缓存，用于每次移动时扣除上一次移动产生的A1距离
    }
  },
  methods:{
    //初始化配置
    startSetting(){
      this.dataSourcePoints=this.dynamicPointsStr;
      this.mouseEvent();
      //初始化A1cache
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
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
        let A1mvY=this.A1Cache.y-this.A1.y;
        let newArr=this.tempLine.showPos;
        for (let i=0;i<newArr.length;i++){
          this.tempLine.showPos[i].x=this.reTranslateCoordinate(this.translateCoordinate(newArr[i].x)-A1mvX);
          this.tempLine.showPos[i].y=this.reTranslateCoordinate(this.translateCoordinate(newArr[i].y)+A1mvY);
        }
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.occurredMoveMap=false;//告知已经处理本次移动过程
      }
      return true;
    },
    //缩放（直接修改数据）
    scale(){
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
      let newPosArr=[];
      for (let i=0;i<this.tempLine.showPos.length;i++){
        const MOX=this.mouse.x;
        const MOY=this.mouse.y;
        const pointPos=this.tempLine.showPos[i];
        const TRX=this.translateCoordinate(pointPos.x);
        const TRY=-this.translateCoordinate(pointPos.y);
        const axSize=MOX-TRX;
        const aySize=MOY-TRY;
        let newPos={x:null,y:null};
        newPos.x=this.reTranslateCoordinate(TRX-((zoom*axSize)));
        newPos.y=-this.reTranslateCoordinate(TRY-((zoom*aySize)));
        newPosArr.push(newPos);
      }
      this.tempLine.showPos=newPosArr;
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
  },
  computed:{
    previewLineShow(){
      return this.tempLine.points.length !== 0 && this.previewLine === true;
    },
    previewLine(){
      return this.$store.state.commits.previewLine;
    },
    tempLine(){
      return this.$store.state.mapConfig.tempLine;
    },
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
        let refArr = [];
        let tempA = null;
        let tempB = null;
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        newArr = this.tempLine.showPos;
        for (let i = 0; i < newArr.length; i++) {
          let x = this.translateCoordinate(newArr[i].x) - A1mvX;
          let y = -(this.translateCoordinate(newArr[i].y) + A1mvY);
          if(tempA!==null){
            refArr.push({a:tempA,b:tempB,c:x,d:y})
          }
          tempA=x;
          tempB=y;
        }
        return refArr
      }else {
        let newArr = [];
        let refArr = [];
        let tempA = null;
        let tempB = null;
        newArr = this.tempLine.showPos;
        for (let i = 0; i < newArr.length; i++) {
          let x = this.translateCoordinate(newArr[i].x);
          let y = -this.translateCoordinate(newArr[i].y);
          if(tempA!==null){
            refArr.push({a:tempA,b:tempB,c:x,d:y})
          }
          tempA=x;
          tempB=y;
        }
        return refArr;
      }
    },
    //预览lane的坐标
    previewLinePoints(){
      if(this.tempLine.points.length!==0){
        if(this.dynamicPointsStr.length!==0){
          let str='';
          str+=this.dynamicPointsStr[this.dynamicPointsStr.length-1].c+' '+this.dynamicPointsStr[this.dynamicPointsStr.length-1].d;
          str+=' ';
          str+=this.mouse.x+' '+this.mouse.y;
          return str;
        }else if(this.dynamicPointsStr.length===0){
          let str='';
          str+=this.translateCoordinate(this.tempLine.showPos[0].x)+' '+this.translateCoordinate(-this.tempLine.showPos[0].y);
          str+=' ';
          str+=this.mouse.x+' '+this.mouse.y;
          return str;
        }else {
          return ''
        }
      }
    },
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
