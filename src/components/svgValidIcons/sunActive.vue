<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="18px" height="18px">
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M6.000,9.000 C6.000,7.354 7.354,6.000 9.000,6.000 C10.646,6.000 12.000,7.354 12.000,9.000 C12.000,10.646 10.646,12.000 9.000,12.000 C7.354,12.000 6.000,10.646 6.000,9.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M-0.000,9.300 L5.000,9.300 L5.000,8.700 L-0.000,8.700 L-0.000,9.300 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M8.700,5.000 L9.300,5.000 L9.300,-0.000 L8.700,-0.000 L8.700,5.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M13.000,8.700 L18.000,8.700 L18.000,9.300 L13.000,9.300 L13.000,8.700 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M8.700,13.000 L9.300,13.000 L9.300,18.000 L8.700,18.000 L8.700,13.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M2.300,2.900 L2.900,2.300 L6.300,5.700 L5.700,6.300 L2.300,2.900 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M11.700,5.700 L15.100,2.300 L15.700,2.900 L12.300,6.300 L11.700,5.700 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M12.300,11.700 L15.700,15.100 L15.100,15.700 L11.700,12.300 L12.300,11.700 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)"
          d="M2.900,15.700 L2.300,15.100 L5.700,11.700 L6.300,12.300 L2.900,15.700 Z"/>
  </svg>
</template>

<script>
export default {
  name: "sunActive",
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
