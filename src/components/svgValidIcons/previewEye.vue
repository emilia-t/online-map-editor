<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       width="19px" height="15px">
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)" d="M0.750,7.500 C0.750,3.494 5.430,0.500 9.500,0.500 C13.570,0.500 18.250,3.494 18.250,7.500 C18.250,11.506 13.570,14.500 9.500,14.500 C5.430,14.500 0.750,11.506 0.750,7.500 Z"/>
    <path fill-rule="evenodd"  fill="rgb(255, 255, 255)" d="M9.500,3.750 C11.571,3.750 13.250,5.429 13.250,7.500 C13.250,9.571 11.571,11.250 9.500,11.250 C7.429,11.250 5.750,9.571 5.750,7.500 C5.750,5.429 7.429,3.750 9.500,3.750 Z"/>
    <path fill-rule="evenodd"  fill="rgb(114, 114, 114)" d="M9.500,5.500 C10.536,5.500 11.375,6.339 11.375,7.375 C11.375,8.411 10.536,9.250 9.500,9.250 C8.464,9.250 7.625,8.411 7.625,7.375 C7.625,6.339 8.464,5.500 9.500,5.500 Z"/>
  </svg>
</template>

<script>
export default {
  name: "previewEye",
  props:{
    custom:{
      type:String,
      default:null,
      required:false,
    }
  }
}
</script>
