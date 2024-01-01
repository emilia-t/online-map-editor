<template>
  <div class="consoleLayer" ref="consoleLayer" v-if="view">
    <h4 class="consoleTitle">F8 监控面板 (启用影响性能)</h4>
    <h5 class="consoleTitle">Online map editor [版本 {{$root.Version}}] (c) {{$root.Copyright}}，保留所有权利。</h5>
    <div ref="consoleMap" class="consoleMap">
      <div class="consoleMapSplitA">
        <hr/>
        运行参数
        <br>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            浏览器&nbsp;&nbsp;尺寸：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.browser.width}} x {{$store.state.mapConfig.browser.height}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            地图X轴大小：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.mapSize.width.max}} ~ {{$store.state.mapConfig.mapSize.width.min}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            地图Y轴大小：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.mapSize.height.max}} ~ {{$store.state.mapConfig.mapSize.height.min}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            A1相对坐标：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.A1.x}} , {{$store.state.mapConfig.A1.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            移动距离：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.movingDistance.x}} , {{$store.state.mapConfig.movingDistance.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            P0x坐标：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.p0.point.x}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            P0y坐标：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.p0.point.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            鼠标位置：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.mousePoint.x}} , {{$store.state.mapConfig.mousePoint.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            点击位置：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.mouseClick.x}} , {{$store.state.mapConfig.mouseClick.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            双击位置：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.svgDbClick.x}} , {{$store.state.mapConfig.svgDbClick.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">

          </div>
          <div class="consoleMapItemR">

          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            左键按下：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.svgMouseDown.x}} , {{$store.state.mapConfig.svgMouseDown.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            左键松开：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.svgMouseUp.x}} , {{$store.state.mapConfig.svgMouseUp.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            右键按下：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.svgMouseRDown.x}} , {{$store.state.mapConfig.svgMouseRDown.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            右键松开：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.svgMouseRUp.x}} , {{$store.state.mapConfig.svgMouseRUp.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            清空点击：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.clearClick.x}} , {{$store.state.mapConfig.clearClick.y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            R-Target：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.operated.id}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            L-Target：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.detailsPanelConfig.target}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            新旧层级：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.oldLayer}}->{{$store.state.mapConfig.layer}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            窗口更新：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.cameraConfig.windowChange}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            Add Sub：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.mapConfig.zoomAdd}} : {{$store.state.mapConfig.zoomSub}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            unit1X&Y：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.cameraConfig.unit1X}} : {{$store.state.cameraConfig.unit1Y}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            启用底图：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.baseMapConfig.enableBaseMap}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            底图类型：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.baseMapConfig.baseMapType}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            启用FPS：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.userSettingConfig.openFpsMonitor}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL">
            当前FPS：
          </div>
          <div class="consoleMapItemR">
            {{$store.state.monitorConfig.fps}}
          </div>
        </div>
        <hr/>
      </div>
      <div class="consoleMapSplitB">
        <hr/>
        指令状态
        <br>
        <div class="consoleMapItem">
          <div class="consoleMapItemL1">
            disableMove：
          </div>
          <div class="consoleMapItemR1">
            {{$store.state.commits.disableMove}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL1">
            disableZoomAndMove：
          </div>
          <div class="consoleMapItemR1">
            {{$store.state.commits.disableZoomAndMove}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL1">
            openF4DebugBord：
          </div>
          <div class="consoleMapItemR1">
            {{$store.state.commits.openF4DebugBord}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL1">
            reloadAccounts：
          </div>
          <div class="consoleMapItemR1">
            {{$store.state.commits.reloadAccounts}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL1">
            reloadServers：
          </div>
          <div class="consoleMapItemR1">
            {{$store.state.commits.reloadServers}}
          </div>
        </div>
        <div class="consoleMapItem">
          <div class="consoleMapItemL1">
            previewLine：
          </div>
          <div class="consoleMapItemR1">
            {{$store.state.commits.previewLine}}
          </div>
        </div>
        <hr/>
        相机状态
        <br>
        <div class="consoleMapItem">
          <div class="consoleMapItemL1">
             采样率：
          </div>
          <div class="consoleMapItemR1">
            {{$store.state.cameraConfig.frameTime}}
          </div>
        </div>
      </div>
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
.consoleMapItemL1{
  width: 180px;
}
.consoleMapItemR1{
  width: calc(100% - 180px);
}
.consoleMapItemL{
  width: 110px;
}
.consoleMapItemR{
  width: calc(100% - 110px);
}
.consoleMapItem{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content:center;
  align-items: center;
}
.consoleMapSplitA{
  width: 290px;
}
.consoleMapSplitB{
  width: 250px;
}
.consoleTitle{
  padding: 0px;
  margin: 5px 0px;
}
.consoleLayer{
  width: 540px;
  height: auto;
  background: rgba(170, 170, 170, 0.65);
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
  flex-direction: row;
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
