<!---除作者以外的人如果需要修改此文件，请备注原因！If anyone other than the author needs to modify this file, please indicate the reason!--->
<template>
  <div class="bottomAnchorLayer" v-show="showAnchor">
    <div class="bottomAnchorLayerBox">
      <span @mousedown="hideBottomAnchor()">▼</span>
      <span class="bottomAnchorSpan">PowerBy</span><a href="https://github.com/emilia-t/online-map-editor" target="_blank">online-map-editor</a>
      <span class="bottomAnchorSpan">©</span><a target="_blank">{{$root.Copyright}}</a>
      <span class="bottomAnchorSpan">Ver</span><a target="_blank">{{$root.Version}}</a>
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
      batb:require('../../static/batb.png'),
      showAnchor:true
    }
  },
  methods:{
    hideBottomAnchor(){
      this.showAnchor=false;
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
.bottomAnchorSpan{
  margin:0  5px  0  10px;
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
