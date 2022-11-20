<template>
    <polyline :points="nowConfig.pointsStr" :id="nowConfig.id" :style="{fill:'rgba(255,255,255,0)',stroke:nowConfig.color,strokeWidth:nowConfig.width}"/>
</template>
<script>
export default {
  name: "svgLine",
  data(){
    return {
      nowConfig: {
        id:null,
        type:null,
        points:[],
        point:{x:null,y:null},
        color:null,
        length:null,
        width:null,
        size:null,
        childRelations:[],
        fatherRelation:null,
        childNodes:[],
        fatherNode:null,
        pointsStr:''
      }
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
    //将经纬度转化为虚拟数
    translateCoordinate(float){
      return float*10000000;
    },
    startSetting(){
      let newArr=[];
      let newStr='';
      this.nowConfig=this.polyLineConfig;
      newArr=this.polyLineConfig.points;
      console.log(newArr);
      //处理为字符串 x,y x,y ...
      for (let i=0;i<newArr.length;i++){
        let a=this.translateCoordinate(newArr[i].x);
        let b=this.translateCoordinate(newArr[i].y);
        newStr+=a+','+b+' ';
      }
      this.nowConfig.pointsStr=newStr;
      this.nowConfig.id=this.polyLineConfig.id;
      this.nowConfig.type=this.polyLineConfig.type;
      this.nowConfig.points=this.polyLineConfig.points;
      this.nowConfig.point=this.polyLineConfig.point;
      this.nowConfig.color=this.polyLineConfig.color;
      this.nowConfig.length=this.polyLineConfig.length;
      this.nowConfig.length=this.polyLineConfig.length;
      this.nowConfig.width=this.polyLineConfig.width;
      this.nowConfig.size=this.polyLineConfig.size;
      this.nowConfig.childRelations=this.polyLineConfig.childRelations;
      this.nowConfig.fatherRelation=this.polyLineConfig.fatherRelation;
      this.nowConfig.childNodes=this.polyLineConfig.childNodes;
      this.nowConfig.fatherNode=this.polyLineConfig.fatherNode;
    }
  },
  mounted:function (){
    this.startSetting();
  }
}
</script>

<style scoped>
polyline{transform: translate(0px, 0px) rotate(0deg) scale(1);overflow: hidden}
</style>
