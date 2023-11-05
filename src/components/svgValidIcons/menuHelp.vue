<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="12.415px" height="18.61px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.61px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M0.820,6.350 C0.828,6.316 0.927,5.349 0.935,5.315 C1.480,3.099 3.160,1.536 5.305,1.405 C7.880,1.248 10.019,3.214 10.480,5.430 C11.006,7.963 9.404,10.167 7.753,10.643 C7.318,10.768 6.722,10.970 6.110,11.180 C5.994,11.220 5.880,11.373 5.765,11.410 C5.673,11.556 5.596,11.710 5.535,11.870 C5.231,12.674 5.478,13.919 5.880,14.745 "/>
    <path fill-rule="evenodd"  fill="rgb(0, 0, 0)"
          d="M5.305,16.125 C5.750,16.125 6.110,16.485 6.110,16.930 C6.110,17.375 5.750,17.735 5.305,17.735 C4.860,17.735 4.500,17.375 4.500,16.930 C4.500,16.485 4.860,16.125 5.305,16.125 Z"/>
  </svg>
</template>

<script>
export default {
  name: "menuHelp",
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
