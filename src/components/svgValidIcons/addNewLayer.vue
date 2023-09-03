<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="18px" height="16px">
    <path fill-rule="evenodd"  opacity="0.6" fill="rgb(92, 92, 92)"
          d="M9.000,15.700 L0.200,10.970 L9.000,6.240 L17.800,10.970 L9.000,15.700 Z"/>
    <path fill-rule="evenodd"  fill="rgb(92, 92, 92)"
          d="M9.000,9.760 L0.200,5.030 L9.000,0.300 L17.800,5.030 L9.000,9.760 Z"/>
  </svg>
</template>

<script>
export default {
  name: "addNewLayer.vue",
  props:{
    custom:{
      type:String,
      default:null,
      required:false,
    }
  }
}
</script>
