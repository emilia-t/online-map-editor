<template>
  <g>
    <path class="svgCurveTempMain" :style="mainStyle" :d="dynamicPointsStr"/><!--已确定的轨迹-->
    <path class="svgCurveTempPreview" :d="previewLinePoints" v-show="previewLineShow"/><!--预览轨迹-->
    <circle class="svgCurveTempCircle" :cx="circleCX(point.x)" :cy="circleCY(point.y)" r="4px" v-show="!doNeedMoveMap" v-for="point in tempCurve.showPos"/>
  </g>
</template>
<script>
  export default {
    name: "svgCurveTemp",
    data(){
      return {
        dataSourcePoints:null,//数据源保存
        A1Cache:{x:0,y:0}//a1的缓存
      }
    },
    methods:{
      startSetting(){
        this.dataSourcePoints=this.dynamicPointsStr;
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
      },
      move(){//移动
        let A1mvX=this.A1.x-this.A1Cache.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        let newArr=this.tempCurve.showPos;
        for (let i=0;i<newArr.length;i++){
          this.tempCurve.showPos[i].x=(newArr[i].x/this.unit1X-A1mvX)*this.unit1X;
          this.tempCurve.showPos[i].y=((newArr[i].y/this.unit1Y)+A1mvY)*this.unit1Y;
        }
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
      },
      scale(){//缩放
        let layer=this.layer;
        let oldLayer=this.oldLayer;
        let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
        let newPosArr=[];
        for (let i=0;i<this.tempCurve.showPos.length;i++){
          const MOX=this.mouse.x;
          const MOY=this.mouse.y;
          const pointPos=this.tempCurve.showPos[i];
          const TRX=(pointPos.x/this.unit1X);
          const TRY=-(pointPos.y/this.unit1Y);
          const axSize=MOX-TRX;
          const aySize=MOY-TRY;
          let newPos={x:null,y:null};
          newPos.x=(TRX-((zoom*axSize)))*this.unit1X;
          newPos.y=-(TRY-((zoom*aySize)))*this.unit1Y;
          newPosArr.push(newPos);
        }
        this.tempCurve.showPos=newPosArr;
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
      tempCurve(){
        return this.$store.state.mapConfig.tempCurve;
      },
      mainStyle(){
        return {
          stroke:'#'+this.tempCurve.color,
          strokeWidth:this.tempCurve.width,
        }
      },
      movingDistance(){
        return this.$store.state.mapConfig.movingDistance;
      },
      unit1X(){
        return this.$store.state.cameraConfig.unit1X;
      },
      unit1Y(){
        return this.$store.state.cameraConfig.unit1Y;
      },
      previewLineShow(){
        return this.tempCurve.points.length !== 0 && this.previewLine === true;
      },
      previewLine(){
        return this.$store.state.commits.previewLine;
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
      dynamicPointsStr(){
        let newArr=this.tempCurve.showPos;
        if(newArr.length<2)return '';
        if(newArr.length===3){
          let refStr = '';
          let x = newArr[0].x / this.unit1X;// 起始点
          let y = -(newArr[0].y / this.unit1Y);
          refStr += 'M' + x + ',' + y;
          let ctrlX = newArr[0].x / this.unit1X;
          let ctrlY = -(newArr[0].y / this.unit1Y);
          let endX = (newArr[0].x / this.unit1X + newArr[1].x / this.unit1X) / 2;
          let endY = -(newArr[0].y / this.unit1Y + newArr[1].y / this.unit1Y) / 2;
          refStr += ' Q' + ctrlX + ',' + ctrlY + ' ' + endX + ',' + endY;
          refStr += ` T${newArr[2].x / this.unit1X},${newArr[2].y / -this.unit1Y}`;// 处理最后一个点
          return refStr;
        }else {
          let refStr = '';
          let Len = newArr.length;
          let x = newArr[0].x / this.unit1X;// 起始点
          let y = -(newArr[0].y / this.unit1Y);
          refStr += 'M' + x + ',' + y;
          for (let i = 1; i < Len - 2; i++) {
            let ctrlX = newArr[i].x / this.unit1X;
            let ctrlY = -(newArr[i].y / this.unit1Y);
            let endX = (newArr[i].x / this.unit1X + newArr[i + 1].x / this.unit1X) / 2;
            let endY = -(newArr[i].y / this.unit1Y + newArr[i + 1].y / this.unit1Y) / 2;
            refStr += ' Q' + ctrlX + ',' + ctrlY + ' ' + endX + ',' + endY;
          }
          refStr += ` T${newArr[Len - 1].x / this.unit1X},${newArr[Len - 1].y / -this.unit1Y}`;// 处理最后一个点
          return refStr;
        }
      },
      previewLinePoints(){//预览lane的坐标
        let len=this.tempCurve.showPos.length;
        if(len>2){//预览曲线三个点
          let str='';
          let x1=this.tempCurve.showPos[0].x/this.unit1X;
          let y1=-this.tempCurve.showPos[0].y/this.unit1Y;
          str+='M'+x1+','+y1;
          for(let i=1;i<len-1;i++){
            let xa=this.tempCurve.showPos[i].x/this.unit1X;
            let ya=-this.tempCurve.showPos[i].y/this.unit1Y;
            let xb=this.tempCurve.showPos[i+1].x/this.unit1X;
            let yb=-this.tempCurve.showPos[i+1].y/this.unit1Y;
            str+=' Q'+xa+','+ya+' '+(xa+xb)/2+','+(ya+yb)/2;
          }
          let x3=this.mouse.x+this.movingDistance.x;
          let y3=this.mouse.y-this.movingDistance.y;
          str+=' T'+x3+','+y3;
          return str;
        }
        else if(len===2){
          let str='';
          let x1=this.tempCurve.showPos[0].x/this.unit1X;
          let y1=-this.tempCurve.showPos[0].y/this.unit1Y;
          str+='M'+x1+','+y1;
          let xa=this.tempCurve.showPos[0].x/this.unit1X;
          let ya=-this.tempCurve.showPos[0].y/this.unit1Y;
          let xb=this.tempCurve.showPos[1].x/this.unit1X;
          let yb=-this.tempCurve.showPos[1].y/this.unit1Y;
          str+=' Q'+xa+','+ya+' '+(xa+xb)/2+','+(ya+yb)/2;
          let x3=this.mouse.x+this.movingDistance.x;
          let y3=this.mouse.y-this.movingDistance.y;
          str+=' T'+x3+','+y3;
          return str;
        }
        else if(len===1){
          let str='';
          str+='M'+(this.tempCurve.showPos[0].x/this.unit1X)+','+(-this.tempCurve.showPos[0].y/this.unit1Y);
          str+=' L'+(this.mouse.x+this.movingDistance.x)+','+(this.mouse.y-this.movingDistance.y);
          return str;
        }
        else if(len===0){
          return '';
        }
      },
    },
    watch:{
      layer:{
        handler(){
          this.scale();
        }
      },
      doNeedMoveMap:{
        handler(newValue){
          if(newValue!==false){
            return false;
          }
          this.move();
        }
      }
    }
  }
</script>
