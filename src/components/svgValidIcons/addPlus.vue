<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="16px" height="16px">
    <path fill-rule="evenodd"  fill="rgb(22, 22, 22)"
          d="M0.500,8.500 C0.226,8.500 -0.000,8.274 -0.000,8.000 C-0.000,7.726 0.226,7.500 0.500,7.500 C5.500,7.500 10.500,7.500 15.500,7.500 C15.774,7.500 15.1000,7.726 15.1000,8.000 C15.1000,8.274 15.774,8.500 15.500,8.500 C10.500,8.500 5.500,8.500 0.500,8.500 Z"/>
    <path fill-rule="evenodd"  fill="rgb(22, 22, 22)"
          d="M7.500,0.500 C7.500,0.226 7.726,-0.000 8.000,-0.000 C8.274,-0.000 8.500,0.226 8.500,0.500 C8.500,5.500 8.500,10.500 8.500,15.500 C8.500,15.774 8.274,15.1000 8.000,15.1000 C7.726,15.1000 7.500,15.774 7.500,15.500 C7.500,10.500 7.500,5.500 7.500,0.500 Z"/>
  </svg>
</template>

<script>
    export default {
      name: "addPlus",
      props:{
        custom:{
          type:String,
          default:null,
          required:false
        }
      }
    }
</script>
