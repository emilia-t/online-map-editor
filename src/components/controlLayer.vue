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
