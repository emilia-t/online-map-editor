<template>
  <div class="bottomAnchorLayer">
    <div class="bottomAnchorLayerBox">
      PowerBy&nbsp;<a target="_blank">Online map editor</a>&nbsp;&nbsp;
      ©&nbsp;<a target="_blank">{{$root.Copyright}}</a>&nbsp;&nbsp;
      V&nbsp;<a target="_blank">{{$root.Version}}</a>&nbsp;&nbsp;
<!--      <img alt="图标" :src="batb" class="batb-d0289dc0"/>-->
<!--      <a target="_blank" :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode='+this.$root.CONFIG.bottomAnchorTextC">{{this.$root.CONFIG.bottomAnchorTextA}}</a>&nbsp;&nbsp;-->
<!--      <a target="_blank" href="https://beian.miit.gov.cn/">{{this.$root.CONFIG.bottomAnchorTextB}}</a>&nbsp;&nbsp;-->
    </div>
  </div>
</template>

<script>
export default {
  name: "LayerBottomAnchor",
  data(){
    return {
      batb:require('../../static/batb.png')
    }
  }
}
</script>

<style scoped>
.bottomAnchorLayer{
  position: fixed;
  cursor: default;
  white-space: nowrap;
  text-align: right;
  z-index: 700;
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
