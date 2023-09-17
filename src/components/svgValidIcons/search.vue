<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="24px" height="24px">
    <path fill-rule="evenodd"  stroke="rgb(255, 255, 255)" stroke-width="3.75px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M12.167,10.875 L19.542,17.375 "/>
    <path fill-rule="evenodd"  stroke="rgb(255, 255, 255)" stroke-width="2.5px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M8.250,2.000 C11.702,2.000 14.500,4.798 14.500,8.250 C14.500,11.702 11.702,14.500 8.250,14.500 C4.798,14.500 2.000,11.702 2.000,8.250 C2.000,4.798 4.798,2.000 8.250,2.000 Z"/>
  </svg>
</template>

<script>
export default {
  name: "search",
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
