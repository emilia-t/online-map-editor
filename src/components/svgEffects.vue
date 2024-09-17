<template>
  <g data-svg-effects class="svgEffects">
    <g data-svg-flicker v-if="svgFlickerShow"><!--元素闪烁效果-->
      <g data-svg-flicker-point v-show="svgFlicker.svgType==='point'">
        <circle class="svgFlickerPoint" ref="svgFlickerPoint" :cx="pointCx()" :cy="pointCy()" r="25px"/>
      </g>
      <g data-svg-flicker-line v-show="svgFlicker.svgType==='line' || svgFlicker.svgType==='area'">
        <path class="svgFlickerLine" ref="svgFlickerLine" :d="pointsD(svgFlicker.svgType)"/>
      </g>
      <g data-svg-flicker-line v-show="svgFlicker.svgType==='curve'">
        <path class="svgFlickerLine" ref="svgFlickerCurve" :d="pointsC()"/>
      </g>
    </g>
  </g>
</template>

<script>
export default {
  name: "svgEffects",
  data(){
    return{
      svgFlickerShow:false,
      svgFlickerTimer:null,
      svgFlickerMaxTime:6000,
    }
  },
  mounted() {

  },
  methods:{
    onSvgFlicker(type){
      try {
        this.svgFlickerTimer=new Date().getTime();
        switch (type) {
          case 'point':{
            this.$refs.svgFlickerPoint.animate(
              [
                {opacity:1},
                {opacity:0},
              ],{
                duration:this.svgFlicker.duration/4,
                iterations:4,
                fill:"forwards",
              }
            );
            break;
          }
          case 'line':{
            this.$refs.svgFlickerLine.animate(
              [
                {opacity:1},
                {opacity:0},
              ],{
                duration:this.svgFlicker.duration/4,
                iterations:4,
                fill:"forwards",
              }
            );
            break;
          }
          case 'area':{
            this.$refs.svgFlickerLine.animate(
              [
                {opacity:1},
                {opacity:0},
              ],{
                duration:this.svgFlicker.duration/4,
                iterations:4,
                fill:"forwards",
              }
            );
            break;
          }
          case 'curve':{
            this.$refs.svgFlickerCurve.animate(
              [
                {opacity:1},
                {opacity:0},
              ],{
                duration:this.svgFlicker.duration/4,
                iterations:4,
                fill:"forwards",
              }
            );
            break;
          }
        }
      }catch (e) {

      }
    },
    pointCx(){
      let svgData=this.svgFlicker.svgData;
      if(svgData===null){
        return 0;
      }
      let ref=svgData.point.x/this.unit1X;
      return isNaN(ref)?0:ref;
    },
    pointCy(){
      let svgData=this.svgFlicker.svgData;
      if(svgData===null){
        return 0;
      }
      let ref=svgData.point.y/this.unit1X;
      return isNaN(ref)?0:ref;
    },
    pointsD(type){
      let newArr = [];
      let refStr = '';
      newArr = this.svgFlicker.svgData.points;
      if(type==='line'){
        if(newArr.length<2){return '';}
      }else{
        if(newArr.length<3){return '';}
      }
      for (let i = 0; i < newArr.length; i++) {
        if(i===0){
          let x = newArr[i].x/this.unit1X;
          let y = newArr[i].y/this.unit1Y;
          refStr+='M'+x+','+y+' ';
        }else {
          let x = newArr[i].x/this.unit1X;
          let y = newArr[i].y/this.unit1Y;
          refStr+='L'+x+','+y+' ';
        }
      }
      if(type==='area'){
        refStr+='Z'
      }
      return refStr;
    },
    pointsC(){
      let newArr = [];
      let refStr = '';
      newArr = this.svgFlicker.svgData.points;
      if(newArr.length<3){return '';}
      for (let i = 0; i < newArr.length-2; i++) {
        if(i===0){
          let x = newArr[i].x/this.unit1X;
          let y = newArr[i].y/this.unit1Y;
          refStr+='M'+x+','+y+' ';
        }else {
          let x = newArr[i].x/this.unit1X;
          let y = newArr[i].y/this.unit1Y;
          let x2= (newArr[i].x / this.unit1X + newArr[i + 1].x / this.unit1X) / 2;
          let y2 = (newArr[i].y / this.unit1Y + newArr[i + 1].y / this.unit1Y) / 2;
          refStr+='Q'+x+','+y+' '+ x2 + ',' + y2 + ' ';
        }
      }
      refStr += `T${newArr[newArr.length - 1].x / this.unit1X},${newArr[newArr.length - 1].y / this.unit1Y}`;// 处理最后一个点
      return refStr;
    }
  },
  computed:{
    unit1X(){
      return this.$store.state.cameraConfig.unit1X;
    },
    unit1Y(){
      return this.$store.state.cameraConfig.unit1Y;
    },
    svgFlicker(){
      return this.$store.state.effectsConfig.svgFlicker;
    },
    svgFlickerChange(){
      return this.$store.state.effectsConfig.svgFlicker.changeCode;
    },
  },
  watch:{
    svgFlickerChange:{
      handler(){
        this.svgFlickerShow=true;
        setTimeout(()=>this.onSvgFlicker(this.svgFlicker.svgType),0);
      }
    },
    svgFlickerTimer:{
      handler(newValue){
        setTimeout(
          ()=>{//定时移除效果
            if(newValue!==this.svgFlickerTimer)return false;
            this.svgFlickerShow=false;
          }
        ,this.svgFlickerMaxTime);
      }
    }
  }
}
</script>

<style scoped>
.svgEffects{
  pointer-events: none;
  user-select: none;
}
.svgFlickerLine{
  stroke-width: 15px;
  stroke: #1bc0ff;
  fill:rgba(0,0,0,0);
  opacity: 1;
}
.svgFlickerPoint{
  fill:#1bc0ff;
  opacity: 1;
}
</style>
