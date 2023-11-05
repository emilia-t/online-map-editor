<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="20.725px" height="20.725px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M10.075,0.875 C15.156,0.875 19.275,4.994 19.275,10.075 C19.275,15.156 15.156,19.275 10.075,19.275 C4.994,19.275 0.875,15.156 0.875,10.075 C0.875,4.994 4.994,0.875 10.075,0.875 Z"/>
    <path fill-rule="evenodd"  fill="rgb(0, 0, 0)"
          d="M9.500,8.465 L10.650,8.465 L10.650,15.480 L9.500,15.480 L9.500,8.465 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M9.500,5.475 C9.553,5.346 9.631,5.229 9.730,5.130 C9.829,5.031 9.946,4.953 10.075,4.900 C10.204,4.953 10.321,5.031 10.420,5.130 C10.519,5.229 10.597,5.346 10.650,5.475 C10.597,5.604 10.519,5.721 10.420,5.820 C10.321,5.919 10.204,5.997 10.075,6.050 C9.946,5.997 9.829,5.919 9.730,5.820 C9.631,5.721 9.553,5.604 9.500,5.475 Z"/>
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
