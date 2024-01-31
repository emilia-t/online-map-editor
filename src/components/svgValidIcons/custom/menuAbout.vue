<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="17.35px" height="17.35px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="0.9px" stroke-linecap="butt" stroke-linejoin="miter" fill="none" d="M8.450,1.250 C12.426,1.250 15.650,4.474 15.650,8.450 C15.650,12.426 12.426,15.650 8.450,15.650 C4.474,15.650 1.250,12.426 1.250,8.450 C1.250,4.474 4.474,1.250 8.450,1.250 Z"/>
    <path fill-rule="evenodd"  fill="rgb(0, 0, 0)" d="M8.000,7.190 L8.900,7.190 L8.900,12.680 L8.000,12.680 L8.000,7.190 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="0.9px" stroke-linecap="butt" stroke-linejoin="miter" fill="none" d="M8.000,4.850 C8.042,4.749 8.103,4.657 8.180,4.580 C8.257,4.503 8.349,4.442 8.450,4.400 C8.551,4.442 8.643,4.503 8.720,4.580 C8.797,4.657 8.858,4.749 8.900,4.850 C8.858,4.951 8.797,5.043 8.720,5.120 C8.643,5.197 8.551,5.258 8.450,5.300 C8.349,5.258 8.257,5.197 8.180,5.120 C8.103,5.043 8.042,4.951 8.000,4.850 Z"/>
  </svg>
</template>

<script>
export default {
  name: "menuAbout",
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
