<template>
  <div class="consoleLayer">
    <h4>~控制台</h4>
    <div ref="consoleMap" class="consoleMap">
      浏览器宽度：{{$store.state.mapConfig.browser.width}}
      <br>
      浏览器高度：{{$store.state.mapConfig.browser.height}}
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "consoleLayer"
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
</style>
