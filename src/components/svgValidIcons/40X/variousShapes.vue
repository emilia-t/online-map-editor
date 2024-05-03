<template>
  <svg class="Icon40X" :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="24px" height="24px">
    <path fill-rule="evenodd"  opacity="0.902" fill="rgb(41, 102, 255)"
          d="M15.600,15.600 L24.000,15.600 L24.000,24.000 L15.600,24.000 L15.600,15.600 Z"/>
    <path fill-rule="evenodd"  opacity="0.902" fill="rgb(41, 102, 255)"
          d="M5.400,15.600 L-0.000,24.000 L10.600,24.000 "/>
    <path fill-rule="evenodd"  fill="rgb(41, 102, 255)"
          d="M6.600,1.200 L18.400,1.200 L18.400,12.600 L6.600,12.600 L6.600,1.200 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
          d="M7.400,2.000 L17.600,2.000 L17.600,11.800 L7.400,11.800 L7.400,2.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(41, 102, 255)"
          d="M7.000,11.000 C7.884,11.000 8.600,11.716 8.600,12.600 C8.600,13.484 7.884,14.200 7.000,14.200 C6.116,14.200 5.400,13.484 5.400,12.600 C5.400,11.716 6.116,11.000 7.000,11.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(41, 102, 255)"
          d="M7.000,-0.000 C7.884,-0.000 8.600,0.716 8.600,1.600 C8.600,2.484 7.884,3.200 7.000,3.200 C6.116,3.200 5.400,2.484 5.400,1.600 C5.400,0.716 6.116,-0.000 7.000,-0.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(41, 102, 255)"
          d="M18.000,-0.000 C18.884,-0.000 19.600,0.716 19.600,1.600 C19.600,2.484 18.884,3.200 18.000,3.200 C17.116,3.200 16.400,2.484 16.400,1.600 C16.400,0.716 17.116,-0.000 18.000,-0.000 Z"/>
    <path fill-rule="evenodd"  fill="rgb(41, 102, 255)"
          d="M18.000,10.800 C18.884,10.800 19.600,11.516 19.600,12.400 C19.600,13.284 18.884,14.000 18.000,14.000 C17.116,14.000 16.400,13.284 16.400,12.400 C16.400,11.516 17.116,10.800 18.000,10.800 Z"/>
  </svg>
</template>

<script>
    export default {
      name: "variousShapes",
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
