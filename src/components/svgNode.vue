<!--用于节点自动吸附-->
<template>
  <g>
    <g v-for="L  in  LineData">
      <circle class="svgNode" r="5px" fill="transparent" :cx="L.points[0].x" :cy="L.points[0].y"
              @mouseenter="enter(L.points[0],L.basePoints[0])" @mouseleave="leave()" v-if="mightShow(L.points[0])"/>
      <circle class="svgNode" r="5px" fill="transparent" :cx="L.points[L.points.length-1].x" :cy="L.points[L.points.length-1].y"
              @mouseenter="enter(L.points[L.points.length-1],L.basePoints[L.basePoints.length-1])" @mouseleave="leave()" v-if="mightShow(L.points[L.points.length-1])"/>
    </g>
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
        renderX1:0,//渲染的矩形范围 | 吸附节点有效的范围
        renderY1:0,
        renderX2:0,//渲染的矩形范围 | 吸附节点有效的范围
        renderY2:0,
      }
    },
    mounted() {
      this.setRender();
    },
    methods:{
      setRender(){
        if(this.mixVisibleRange==='high'){
          this.renderX1=-window.innerWidth;
          this.renderX2=window.innerWidth*2;
          this.renderY1=-window.innerHeight;
          this.renderY2=window.innerHeight*2;
        }else if(this.mixVisibleRange==='medium'){
          this.renderX1=-window.innerWidth*0.5;
          this.renderX2=window.innerWidth*1.5;
          this.renderY1=-window.innerHeight*0.5;
          this.renderY2=window.innerHeight*1.5;
        }else if(this.mixVisibleRange==='low'){
          this.renderX1=0;
          this.renderX2=window.innerWidth;
          this.renderY1=0;
          this.renderY2=window.innerHeight;
        }
      },
      enter(pt,pos){//pt view xy , pos pos xy
        if(!this.magnetic)return;
        console.log(pos.x);
        console.log(pt.x);
        console.log({
          x1:this.renderX1,
          x2:this.renderX2,
          y1:this.renderY1,
          y2:this.renderY2,
        })
      },
      leave(){
        this.posX=null;
        this.posY=null;
        this.viewX=null;
        this.viewY=null;
      },
      mightShow(pt){//pt屏幕上的虚拟坐标点
        return pt.x >= this.renderX1 && pt.x <= this.renderX2 &&
                  pt.y >= this.renderY1 && pt.y <= this.renderY2;
      }
    },
    computed:{
      LineData(){
        if(this.$store.state.serverData.socket){
          return this.$store.state.serverData.socket.mapData.lines;
        }else {
          return [];
        }
      },
      mixVisibleRange(){
        return this.$store.state.userSettingConfig.mixVisibleRange;
      }
    },
    watch:{
      mixVisibleRange:{
        handler(){
          this.setRender();
        }
      }
    }
  }
</script>
