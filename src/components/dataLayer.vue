<template>
  <div class="dataLayer">

  </div>
</template>

<script>
export default {
  name: "dataLayer",
  methods:{
    //获取浏览器高度和宽度
    getBrowserConfig(){
      this.$store.state.mapConfig.browser.width=window.innerWidth;
      this.$store.state.mapConfig.browser.height=window.innerHeight;
    }
  },
  mounted:function(){
    this.getBrowserConfig();
  }
}
</script>

<style scoped>

</style>
