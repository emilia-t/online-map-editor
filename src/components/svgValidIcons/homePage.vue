<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="20.725px" height="20.725px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M0.875,10.075 L10.075,0.875 L19.275,10.075 L16.975,10.075 L16.975,19.275 L12.375,19.275 L12.375,12.375 L7.775,12.375 L7.775,19.275 L3.175,19.275 L3.175,10.075 L0.875,10.075 Z"/>
  </svg>
</template>

<script>
export default {
  name: "homePage",
  props:{
    custom:{
      type:String,
      default:null,
      required:false,
    }
  }
}
</script>

<style scoped>

</style>
