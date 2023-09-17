<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="23px" height="13px">
    <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.9px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M3.185,1.650 L11.450,9.250 L19.715,1.650 "/>
  </svg>
</template>

<script>
export default {
  name: "expandMore",
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
