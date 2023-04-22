<template>
  <!--
  职责：显示前端地图各项参数
  权限：允许访问$store.*
  -->
  <div class="consoleLayer" ref="consoleLayer" v-if="view">
    <h4 class="consoleTitle">F8 调试面板</h4>
    <div ref="consoleMap" class="consoleMap">
      浏览器尺寸：{{$store.state.mapConfig.browser.width}} x {{$store.state.mapConfig.browser.height}}
      <br>
      地图X轴大小：{{$store.state.mapConfig.mapSize.width.x1}} ~ {{$store.state.mapConfig.mapSize.width.x2}}
      <br>
      地图Y轴大小：{{$store.state.mapConfig.mapSize.height.y1}} ~ {{$store.state.mapConfig.mapSize.height.y2}}
      <br>
      A1相对坐标：{{$store.state.mapConfig.A1.x}} , {{$store.state.mapConfig.A1.y}}
      <br>
      P0相对坐标：{{$store.state.mapConfig.p0.point.x}} , {{$store.state.mapConfig.p0.point.y}}
      <br>
      鼠标位置：{{$store.state.mapConfig.mousePoint.x}} , {{$store.state.mapConfig.mousePoint.y}}
      <br>
      点击位置：{{$store.state.mapConfig.mouseClick.x}} , {{$store.state.mapConfig.mouseClick.y}}
      <br>
      双击位置：{{$store.state.mapConfig.svgDbClick.x}} , {{$store.state.mapConfig.svgDbClick.y}}
      <br>
      新层级：{{$store.state.mapConfig.layer}}
      <br>
      旧层级：{{$store.state.mapConfig.oldLayer}}
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayerConsole",
  data(){
    return {
      MY_NAME:"LayerConsole",
      view:false
    }
  },
  methods:{
    createTestLine() {
      this.$root.sendInstruct('createTestLine')
    },
    openF4DebugBord(){
      this.view=!this.view;
    }
  },
  computed:{
    commitsDebugBordHide() {
      return this.$store.state.commits.openF4DebugBord;
    }
  },
  watch:{
    commitsDebugBordHide:{
      handler(newValue,oldValue){
        this.openF4DebugBord();
      },
      deep:true
    },
  },
  destroyed(){
    //最后被销毁的地图组件，销毁地图主体
    setTimeout(()=>this.$store.commit('destroyComprehensive'),10)
  }
}
</script>

<style scoped>
.consoleTitle{
  padding: 0px;
  margin: 10px 0px;
}
.consoleLayer{
  width: 490px;
  height: 490px;
  background: rgba(170, 170, 170, 0.9);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  position: fixed;
  top:0px;
  left:0px;
  z-index: 99999;
  pointer-events:none;
  padding: 5px;
}
.consoleMap{
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 100;
  line-height: 22px;
}
.buttons{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-around;
}
.buttons button{height: 28px;margin: 5px}
</style>
