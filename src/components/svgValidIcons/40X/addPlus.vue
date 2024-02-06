<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="32px" height="32px">
    <path fill-rule="evenodd"  fill="rgb(22, 22, 22)"
          d="M1.000,17.000 C0.451,17.000 0.000,16.549 0.000,16.000 C0.000,15.451 0.451,15.000 1.000,15.000 C11.000,15.000 21.000,15.000 31.000,15.000 C31.549,15.000 32.000,15.451 32.000,16.000 C32.000,16.549 31.549,17.000 31.000,17.000 C21.000,17.000 11.000,17.000 1.000,17.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(22, 22, 22)"
          d="M15.000,1.000 C15.000,0.451 15.451,0.000 16.000,0.000 C16.549,0.000 17.000,0.451 17.000,1.000 C17.000,11.000 17.000,21.000 17.000,31.000 C17.000,31.549 16.549,32.000 16.000,32.000 C15.451,32.000 15.000,31.549 15.000,31.000 C15.000,21.000 15.000,11.000 15.000,1.000 Z"/>
  </svg>
</template>

<script>
export default {
  name: "addPlus",
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
