<template>
  <!--
  职责：显示地图整体的简要属性、例如地图大小、以列表方式展示数据（类似于谷歌地图左侧的的面板）
  允许访问、修改、删除$store.state.serverData内的数据
  -->
  <div class="LayerElementPanel">
    <div class="title">
      Map title
    </div>
  </div>
</template>

<script>
export default {
  name: "LayerElementPanel",
  data(){
    return {
      MY_NAME:"LayerElementPanel"
    }
  }
}
</script>

<style scoped>
.LayerElementPanel{
  width: var(--panelWidth);
  height: var(--panelHight);
  display: flex;
  position: fixed;
  background: var(--BottomBackgroundColor);
  left: var(--panelLeft);
  top:var(--panelTop);
  border-radius: var(--borderType02);
  overflow: hidden;
  box-shadow: var(--BottomShadowColor);
}
.title{
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  background: var(--ProminentBackgroundColor);
  font-size: 24px;
  line-height:calc(24px * 2);
  color: rgba(255,255,255,0.8);
}
</style>
