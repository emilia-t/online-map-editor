<template>
  <div class="controlLayer">

  </div>
</template>

<script>
export default {
  name: "controlLayer",
  data(){
    return {
      MY_NAME:"controlLayer"
    }
  },
  methods:{
    startSetting(){
      this.KeyListen();//开启键盘监听
    },
    //用于监听单个按键的
    KeyListen(){
      document.body.addEventListener('keyup',(e)=>{
        let KEY=e.key;
        switch (KEY){
          case 'F4':{
            this.F4Event();
          }
        }
      })
    },
    //F4的事件
    F4Event(){
      this.$root.sendInstruct('openF4DebugBord');
    }
  },
  mounted() {
    this.startSetting();
  }
}
</script>

<style scoped>
.controlLayer{
  width: var(--controlWidth);
  height: var(--controlHeight);
  background: red;
  display: flex;
  position: fixed;
  justify-content: center;
  left: calc((100% - (var(--panelWidth) + var(--panelLeft))) * var(--controlLeft));
  top: var(--controlTop);
  border-radius: var(--borderType02);
  box-shadow: var(--BottomShadowColor);
  background: var(--BottomBackgroundColor);
}
</style>
