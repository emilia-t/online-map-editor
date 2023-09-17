<template>
  <div class="consoleLayer" ref="consoleLayer" v-if="view">
    <h4 class="consoleTitle">F8 监控面板</h4>
    <div ref="consoleMap" class="consoleMap">
      运行参数
      <hr/>
      浏览器尺寸：{{$store.state.mapConfig.browser.width}} x {{$store.state.mapConfig.browser.height}}
      <br>
<!--      地图X轴大小：{{$store.state.mapConfig.mapSize.width.max}} ~ {{$store.state.mapConfig.mapSize.width.min}}-->
<!--      <br>-->
<!--      地图Y轴大小：{{$store.state.mapConfig.mapSize.height.max}} ~ {{$store.state.mapConfig.mapSize.height.min}}-->
<!--      <br>-->
      A1相对坐标：{{$store.state.mapConfig.A1.x}} , {{$store.state.mapConfig.A1.y}}
      <br>
      P0相对坐标：
      <br>
      {{$store.state.mapConfig.p0.point.x}} , {{$store.state.mapConfig.p0.point.y}}
      <br>
      鼠标位置：{{$store.state.mapConfig.mousePoint.x}} , {{$store.state.mapConfig.mousePoint.y}}
      <br>
      点击位置：{{$store.state.mapConfig.mouseClick.x}} , {{$store.state.mapConfig.mouseClick.y}}
      <br>
      双击位置：{{$store.state.mapConfig.svgDbClick.x}} , {{$store.state.mapConfig.svgDbClick.y}}
      <br>
      左键按下：{{$store.state.mapConfig.svgMouseDown.x}} , {{$store.state.mapConfig.svgMouseDown.y}}
      <br>
      左键松开：{{$store.state.mapConfig.svgMouseUp.x}} , {{$store.state.mapConfig.svgMouseUp.y}}
      <br>
      清空点击：{{$store.state.mapConfig.clearClick.x}} , {{$store.state.mapConfig.clearClick.y}}
      <br>
      R-Target：{{$store.state.mapConfig.operated.id}}
      <br>
      L-Target：{{$store.state.detailsPanelConfig.target}}
      <br>
      新旧层级：{{$store.state.mapConfig.oldLayer}}->{{$store.state.mapConfig.layer}}
      <br>
      窗口更新：{{$store.state.cameraConfig.windowChange}}
      <br>
      Add&Sub：{{$store.state.mapConfig.zoomAdd}} : {{$store.state.mapConfig.zoomSub}}
      <br>
      unit1X&Y：{{$store.state.cameraConfig.unit1X}} : {{$store.state.cameraConfig.unit1Y}}
      <br>
      启用额外的底图：{{$store.state.baseMapConfig.enableBaseMap}}
      <br>
      底图类型：{{$store.state.baseMapConfig.baseMapType}}
      <br>
      启用FPS监控：{{$store.state.userSettingConfig.openFpsMonitor}}
      <br>
      FPS：{{$store.state.monitorConfig.fps}}
      <hr/>
      指令状态
      <br>
      disableMove：{{$store.state.commits.disableMove}}
      <br>
      disableZoomAndMove：{{$store.state.commits.disableZoomAndMove}}
      <br>
      openF4DebugBord：{{$store.state.commits.openF4DebugBord}}
      <br>
      reloadAccounts：{{$store.state.commits.reloadAccounts}}
      <br>
      reloadServers：{{$store.state.commits.reloadServers}}
      <br>
      previewLine：{{$store.state.commits.previewLine}}
      <hr/>
      相机状态
      <br>
      采样率：{{$store.state.cameraConfig.frameTime}}
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
  destroyed(){//最后被销毁的地图组件，销毁地图主体
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
  width: 350px;
  height: auto;
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
