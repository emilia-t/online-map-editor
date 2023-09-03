<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       width="20.875px" height="15.875px">
    <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.8" fill="none" d="M4.750,10.250 L4.750,8.000 L15.500,8.000 L15.500,10.250 "/>
    <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.659" fill="none" d="M1.375,14.625 L1.375,10.250 L8.250,10.250 L8.250,14.625 L1.375,14.625 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.6" fill="none" d="M12.000,14.625 L12.000,10.250 L18.875,10.250 L18.875,14.625 L12.000,14.625 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.902" fill="none" d="M10.750,5.875 L10.750,8.000 "/>
    <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" fill="none" d="M7.625,5.875 L7.625,1.500 L14.500,1.500 L14.500,5.875 L7.625,5.875 Z"/>
  </svg>
</template>

<script>
export default {
  name: "addNewGroup",
  props:{
    custom:{
      type:String,
      default:null,
      required:false,
    }
  }
}
</script>
