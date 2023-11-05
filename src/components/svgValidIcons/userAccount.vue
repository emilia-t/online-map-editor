<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="22.15px" height="23.15px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M2.300,21.275 C2.530,17.020 6.539,12.305 11.500,12.305 C16.461,12.305 20.470,17.020 20.700,21.275 "/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M11.500,2.300 C14.358,2.300 16.675,4.617 16.675,7.475 C16.675,10.333 14.358,12.650 11.500,12.650 C8.642,12.650 6.325,10.333 6.325,7.475 C6.325,4.617 8.642,2.300 11.500,2.300 Z"/>
    <image  x="0px" y="0px" width="0px" height="0px"  xlink:href="data:img/png;base64," />
  </svg>
</template>

<script>
export default {
  name: "userAccount",
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
