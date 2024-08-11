<!--用于节点自动吸附-->
<template>
  <g v-if="drawing && magnetic">
    <g v-for="L  in  LineData" v-if="isInside(L.point.x,L.point.y,L.points[L.points.length-1].x,L.points[L.points.length-1].y)" :key="L.id">
      <circle class="svgNode" r="10px" fill="transparent" :cx="L.points[0].x" :cy="L.points[0].y"
              @mouseenter="enter(L.points[0],L.basePoints[0])" @mouseleave="leave()"
              v-if="isEffective(L.points[0].x,L.points[0].y)"
      />
      <circle class="svgNode" r="10px" fill="transparent" :cx="L.points[L.points.length-1].x" :cy="L.points[L.points.length-1].y"
              @mouseenter="enter(L.points[L.points.length-1],L.basePoints[L.basePoints.length-1])" @mouseleave="leave()"
              v-if="isEffective(L.points[L.points.length-1].x,L.points[L.points.length-1].y)"
      />
    </g>
    <g v-for="C  in  curveData" v-if="isInside(C.point.x,C.point.y,C.points[C.points.length-1].x,C.points[C.points.length-1].y)" :key="C.id">
      <circle class="svgNode" r="10px" fill="transparent" :cx="C.points[0].x" :cy="C.points[0].y"
              @mouseenter="enter(C.points[0],C.basePoints[0])" @mouseleave="leave()"
              v-if="isEffective(C.points[0].x,C.points[0].y)"
      />
      <circle class="svgNode" r="10px" fill="transparent" :cx="C.points[C.points.length-1].x" :cy="C.points[C.points.length-1].y"
              @mouseenter="enter(C.points[C.points.length-1],C.basePoints[C.basePoints.length-1])" @mouseleave="leave()"
              v-if="isEffective(C.points[C.points.length-1].x,C.points[C.points.length-1].y)"
      />
    </g>
    <!--启用可以显示吸附范围-->
<!--    <rect :x="effectiveX1" :y="effectiveY1" width="100" height="100" fill="transparent" stroke="black" stroke-width="2"/>-->
  </g>
</template>

<script>
  export default {
    name: "svgNode",
    data(){
      return{
        magnetic:true,//是否启用自动吸附
        posX:null,//吸附点坐标?null则表示未吸附
        posY:null,
        viewX:null,//吸附点显示坐标?null表示未吸附
        viewY:null,
        effectiveX1:0,//有效范围x1 | 以鼠标为中心的100px × 100px 正方形范围内为有效范围
        effectiveY1:0,
        effectiveX2:0,
        effectiveY2:0
      }
    },
    mounted() {
      this.setMouseListen();
      if(this.adsorptionNode){
        this.magnetic=true;
      }else{
        this.magnetic=false;
      }
    },
    methods:{
      setMouseListen(){
        window.document.addEventListener(
          'mousemove',
          (ev)=>{
            this.effectiveX1=ev.x-50;
            this.effectiveY1=ev.y-50;
            this.effectiveX2=ev.x+50;
            this.effectiveY2=ev.y+50;
          }
        );
      },
      isEffective(px,py) {
        return px>=this.effectiveX1 && px<=this.effectiveX2 && py>=this.effectiveY1 && py<=this.effectiveY2;
      },
      isInside(x,y,x2,y2){
        return !((x <= 0 || y <= 0 || x >= window.innerWidth || y >= window.innerHeight) && (x2 <= 0 || y2 <= 0 || x2 >= window.innerWidth || y2 >= window.innerHeight));
      },
      enter(pt,pos){//pt view xy , pos pos xy
        if(!this.magnetic)return;
        this.$store.commit('setCoAdsorption',{x:pos.x,y:pos.y,vx:pt.x,vy:pt.y});
      },
      leave(){
        this.$store.commit('setCoAdsorption',{x:null,y:null,vx:null,vy:null});
      },
    },
    computed:{
      drawing(){
        return this.$store.state.mapConfig.drawing;
      },
      adsorptionNode(){
        return this.$store.state.userSettingConfig.adsorptionNode;
      },
      LineData(){
        if(this.$store.state.serverData.socket){
          return this.$store.state.serverData.socket.mapData.lines;
        }else {
          return [];
        }
      },
      curveData(){
        if(this.$store.state.serverData.socket){
          return this.$store.state.serverData.socket.mapData.curves;
        }else {
          return [];
        }
      }
    },
    watch:{
      adsorptionNode:{
        handler(value){
          if(value){
            this.magnetic=true;
          }else{
            this.$store.commit('setCoAdsorption',{x:null,y:null,vx:null,vy:null});
            this.magnetic=false;
          }
        }
      }
    }
  }
</script>
