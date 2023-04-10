<template>
<!--底部锚-->
  <div class="bottomAnchorLayer">
    <div class="bottomAnchorLayerBox">
      @2023 Online map for&nbsp;<a target="_blank" href="https://www.atsw.top">ATSW</a>&nbsp;&nbsp;
      <img alt="图标" src="static/batb.d0289dc0.png" class="batb-d0289dc0"/>
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=53062602000121">滇公网安备 53062602000121号</a>&nbsp;&nbsp;
      <a target="_blank" href="https://beian.miit.gov.cn/">滇ICP备20002587号-2</a>&nbsp;&nbsp;
      版本 0.2&nbsp;&nbsp;
      著作权归站长所有&nbsp;&nbsp;
      测试版本仅供参考&nbsp;&nbsp;
      仅为项目学习演示&nbsp;&nbsp;
      所有内容均为虚拟内容&nbsp;&nbsp;
    </div>
  </div>
</template>

<script>
export default {
  name: "LayerBottomAnchor"
}
</script>

<style scoped>
.bottomAnchorLayer{
  position: fixed;
  cursor: default;
  white-space: nowrap;
  text-align: right;
  z-index: 560;
  bottom:0px;
  right: 0px;
}
.bottomAnchorLayerBox{
  display: flex;
  align-items: center;
  background: rgba(255,255,255,.6);
  padding: 0 7px 0 20px;
  line-height: 22px;
  height: 20px;
  font-size:14px;
  font-weight: 400;
  color:rgba(0,0,0,0.8)
}
.batb-d0289dc0{
  width: 16px;
  height: 16px;
}
a {
  color: rgba(0,0,0,0.8);
  text-decoration: none;
  transition: all .2s ease-in-out;
}

a:hover {
  color: rgba(0,0,0,0.8);
  text-decoration: underline;
}

</style>
