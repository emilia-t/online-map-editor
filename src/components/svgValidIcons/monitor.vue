<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="20.725px" height="16.15px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M0.875,11.295 L0.875,0.945 L19.275,0.945 L19.275,11.295 L0.875,11.295 Z"/>
    <path fill-rule="evenodd"  fill="rgb(0, 0, 0)"
          d="M7.200,11.295 L7.200,14.055 L5.475,14.055 L5.475,15.205 L14.675,15.205 L14.675,14.055 L12.950,14.055 L12.950,11.295 L11.800,11.295 L11.800,14.055 L8.350,14.055 L8.350,11.295 L7.200,11.295 Z"/>
  </svg>
</template>

<script>
export default {
  name: "monitor",
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
