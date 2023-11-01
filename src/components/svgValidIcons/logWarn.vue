<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="16px" height="16px">
    <path fill-rule="evenodd"  fill="rgb(233, 133, 62)"
          d="M8.000,-0.000 C12.418,-0.000 16.000,3.582 16.000,8.000 C16.000,12.418 12.418,16.000 8.000,16.000 C3.582,16.000 -0.000,12.418 -0.000,8.000 C-0.000,3.582 3.582,-0.000 8.000,-0.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
          d="M8.000,11.500 C8.828,11.500 9.500,12.172 9.500,13.000 C9.500,13.828 8.828,14.500 8.000,14.500 C7.172,14.500 6.500,13.828 6.500,13.000 C6.500,12.172 7.172,11.500 8.000,11.500 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
          d="M6.500,3.000 C6.500,2.177 7.177,1.500 8.000,1.500 C8.823,1.500 9.500,2.177 9.500,3.000 C9.233,5.333 8.967,7.667 8.700,10.000 C8.700,10.384 8.384,10.700 8.000,10.700 C7.616,10.700 7.300,10.384 7.300,10.000 C7.033,7.667 6.767,5.333 6.500,3.000 Z"/>
  </svg>
</template>

<script>
export default {
  name: "logWarn",
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
