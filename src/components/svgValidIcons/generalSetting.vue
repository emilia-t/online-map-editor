<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="20.725px" height="20.725px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M1.795,18.125 C2.137,18.827 2.854,19.275 3.635,19.275 C4.416,19.275 5.133,18.827 5.475,18.125 C5.475,12.758 5.475,7.392 5.475,2.025 C5.133,1.323 4.416,0.875 3.635,0.875 C2.854,0.875 2.137,1.323 1.795,2.025 C1.795,7.392 1.795,12.758 1.795,18.125 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M8.350,18.125 C8.692,18.827 9.409,19.275 10.190,19.275 C10.971,19.275 11.688,18.827 12.030,18.125 C12.030,12.758 12.030,7.392 12.030,2.025 C11.688,1.323 10.971,0.875 10.190,0.875 C9.409,0.875 8.692,1.323 8.350,2.025 C8.350,7.392 8.350,12.758 8.350,18.125 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M14.790,18.125 C15.132,18.827 15.849,19.275 16.630,19.275 C17.411,19.275 18.128,18.827 18.470,18.125 C18.470,12.758 18.470,7.392 18.470,2.025 C18.128,1.323 17.411,0.875 16.630,0.875 C15.849,0.875 15.132,1.323 14.790,2.025 C14.790,7.392 14.790,12.758 14.790,18.125 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="rgb(255, 255, 255)"
          d="M3.635,3.865 C5.032,3.865 6.165,4.998 6.165,6.395 C6.165,7.792 5.032,8.925 3.635,8.925 C2.238,8.925 1.105,7.792 1.105,6.395 C1.105,4.998 2.238,3.865 3.635,3.865 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="rgb(255, 255, 255)"
          d="M10.190,11.225 C11.587,11.225 12.720,12.358 12.720,13.755 C12.720,15.152 11.587,16.285 10.190,16.285 C8.793,16.285 7.660,15.152 7.660,13.755 C7.660,12.358 8.793,11.225 10.190,11.225 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="1.15px" stroke-linecap="butt" stroke-linejoin="miter" fill="rgb(255, 255, 255)"
          d="M16.630,3.865 C18.027,3.865 19.160,4.998 19.160,6.395 C19.160,7.792 18.027,8.925 16.630,8.925 C15.233,8.925 14.100,7.792 14.100,6.395 C14.100,4.998 15.233,3.865 16.630,3.865 Z"/>
  </svg>
</template>

<script>
export default {
  name: "generalSetting",
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
