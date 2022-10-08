<template>
  <div class="consoleLayer">
    <h4>~控制台</h4>
    <div class="buttons">
     <button @click="createTestLine()">添加一条测试lane</button>
    </div>
    <div ref="consoleMap" class="consoleMap">
      浏览器宽度：{{$store.state.mapConfig.browser.width}}
      <br>
      浏览器高度：{{$store.state.mapConfig.browser.height}}
      <br>
      地图X轴大小：{{$store.state.mapConfig.mapSize.width.x1}} ~ {{$store.state.mapConfig.mapSize.width.x2}}
      <br>
      地图Y轴大小：{{$store.state.mapConfig.mapSize.height.y1}} ~ {{$store.state.mapConfig.mapSize.height.y2}}
      <br>
      默认坐标：{{$store.state.mapConfig.startDefaultPoint.x}} , {{$store.state.mapConfig.startDefaultPoint.y}}
      <br>
      当前坐标：
      <br>
      commits：createTestLine:{{$store.state.commits.createTestLine}}
    </div>
  </div>
</template>

<script>
export default {
  name: "consoleLayer",
  data(){
    return {
      MY_NAME:"consoleLayer"
    }
  },
  methods:{
    createTestLine() {
      this.$root.sendInstruct('createTestLine')
    }
  }
}
</script>

<style scoped>
.consoleLayer{
  width: 400px;
  height: 400px;
  background: rgba(88, 88, 88, 0.9);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  position: fixed;
  top:70px;
  left:15px;
  z-index: 99999;
}
.consoleMap{
  display: flex;
  flex-direction: column;
  font-size: 14px;
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
