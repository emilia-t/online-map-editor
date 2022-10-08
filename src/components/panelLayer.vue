<template>
  <div class="panelLayer">
    <div class="title">
      Map title
    </div>
  </div>
</template>

<script>
export default {
  name: "panelLayer",
  data(){
    return {
      MY_NAME:"panelLayer"
    }
  }
}
</script>

<style scoped>
.panelLayer{
  width: var(--panelWidth);
  height: var(--panelHight);
  display: flex;
  position: fixed;
  background: var(--BottomBackgroundColor);
  left: var(--panelLeft);
  top:var(--panelTop);
  border-radius: var(--borderType01);
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
