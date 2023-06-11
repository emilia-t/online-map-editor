<template>
  <g :elementId="tempLine.id">
    <polyline :points="str.a+','+str.b+' '+str.c+','+str.d" v-for="str in dynamicPointsStr" :style="{fill:'rgba(255,255,255,0)',stroke:'#'+tempLine.color,strokeWidth:tempLine.width}"/>
    <polyline :points="previewLinePoints" v-if="previewLineShow" style="fill: rgba(10,10,10,0.2);stroke-width: 3px;stroke: rgba(10,10,10,0.2)"/><!--预览轨迹-->
    <circle v-show="!doNeedMoveMap" v-for="point in tempLine.showPos"  :cx="circleCX(point.x)" :cy="circleCY(point.y)" r="4px" stroke-width="1" style="pointer-events: fill;fill-opacity: 0.8;fill: #bbb"/>
  </g>
</template>
<script>
export default {
  name: "svgLineTemp",
  data(){
    return {
      dataSourcePoints:null,//数据源保存
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0}//a1的缓存
    }
  },
  methods:{
    startSetting(){
      this.dataSourcePoints=this.dynamicPointsStr;
      this.mouseEvent();
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
    },
    move(){//移动
      if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        let newArr=this.tempLine.showPos;
        for (let i=0;i<newArr.length;i++){
          this.tempLine.showPos[i].x=(newArr[i].x/this.unit1X-A1mvX)*this.unit1X;
          this.tempLine.showPos[i].y=((newArr[i].y/this.unit1Y)+A1mvY)*this.unit1Y;
        }
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.occurredMoveMap=false;
      }
      return true;
    },
    scale(){//缩放
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
      let newPosArr=[];
      for (let i=0;i<this.tempLine.showPos.length;i++){
        const MOX=this.mouse.x;
        const MOY=this.mouse.y;
        const pointPos=this.tempLine.showPos[i];
        const TRX=(pointPos.x/this.unit1X);
        const TRY=-(pointPos.y/this.unit1Y);
        const axSize=MOX-TRX;
        const aySize=MOY-TRY;
        let newPos={x:null,y:null};
        newPos.x=(TRX-((zoom*axSize)))*this.unit1X;
        newPos.y=-(TRY-((zoom*aySize)))*this.unit1Y;
        newPosArr.push(newPos);
      }
      this.tempLine.showPos=newPosArr;
    },
    mouseEvent(){//监听鼠标移动
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;//告知相机发生过移动行为
      })
    },
    circleCX(x){
      return x/this.unit1X;
    },
    circleCY(y){
      return -y/this.unit1Y;
    },
  },
  mounted:function (){
    this.startSetting();
  },
  computed:{
    browserX(){
      return this.$store.state.mapConfig.browser.width;
    },
    browserY(){
      return this.$store.state.mapConfig.browser.height;
    },
    unit1X(){
      return this.$store.state.cameraConfig.unit1X;
    },
    unit1Y(){
      return this.$store.state.cameraConfig.unit1Y;
    },
    offsetX(){
      return this.$store.state.cameraConfig.offsetX;
    },
    offsetY(){
      return this.$store.state.cameraConfig.offsetY;
    },
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
          let x = newArr[i].x/this.unit1X - A1mvX;
          let y = -(newArr[i].y/this.unit1Y + A1mvY);
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
          let x = (newArr[i].x/this.unit1X);
          let y = -(newArr[i].y/this.unit1Y);
          if(tempA!==null){
            refArr.push({a:tempA,b:tempB,c:x,d:y})
          }
          tempA=x;
          tempB=y;
        }
        return refArr;
      }
    },
    previewLinePoints(){//预览lane的坐标
      if(this.tempLine.points.length!==0){//preview line需要在窗口缩放时变化
        if(this.dynamicPointsStr.length!==0){
          let str='';
          str+=this.dynamicPointsStr[this.dynamicPointsStr.length-1].c+' '+this.dynamicPointsStr[this.dynamicPointsStr.length-1].d;
          str+=' ';
          str+=this.mouse.x+' '+this.mouse.y;
          return str;
        }else if(this.dynamicPointsStr.length===0){
          let str='';
          str+=(this.tempLine.showPos[0].x/this.unit1X)+' '+(-this.tempLine.showPos[0].y/this.unit1Y);
          str+=' ';
          str+=this.mouse.x+' '+this.mouse.y;
          return str;
        }else {
          return ''
        }
      }
    },
  },
  watch:{
    browserX:{
      handler(newValue,oldValue){
        let offset=(newValue-oldValue)/2;
        for(let i=0;i<this.tempLine.points.length;i++){
          this.tempLine.points[i].x+=offset*this.unit1X;
        }
        for(let i=0;i<this.tempLine.showPos.length;i++){
          this.tempLine.showPos[i].x+=offset*this.unit1X;
        }
      },
      deep:true
    },
    browserY:{
      handler(newValue,oldValue){
        let offset=(oldValue-newValue)/2;
        for(let i=0;i<this.tempLine.points.length;i++){
          this.tempLine.points[i].y+=offset*this.unit1Y;
        }
        for(let i=0;i<this.tempLine.showPos.length;i++){
          this.tempLine.showPos[i].y+=offset*this.unit1Y;
        }
      },
      deep:true
    },
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
