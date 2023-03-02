<template>
  <!--左侧的详细信息编辑面板-->
  <!--职责-监听需要编辑的要素id并展示被选中的要素id的各种属性，并提供编辑属性值功能-->
  <!--权限-允许访问store.state.mapconfig-->
  <div class="LayerDetailsPanel">
    <!--顶部标题-->
    <div class="top">
      元素信息
    </div>
    <!--内容-->
    <div class="content">

    </div>
  </div>
</template>

<script>
export default {
  name: "BananaDetailsPanel"
}
</script>

<style scoped>
.LayerDetailsPanel{
  width: 350px;
  height: 100%;
  background: #f8f8f8;
  position: fixed;
  top:0;
  left: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: #b8b8b8 3px 3px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.top{
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
}
</style>
