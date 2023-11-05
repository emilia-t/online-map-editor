<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="15.863px" height="19.863px">
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="0.575px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M3.072,7.487 C1.694,6.824 0.843,5.418 0.888,3.923 C0.930,2.506 1.771,1.213 3.072,0.588 L3.647,0.588 L3.647,3.923 L5.488,3.923 L5.488,0.588 L6.063,0.588 C7.364,1.213 8.205,2.506 8.247,3.923 C8.292,5.418 7.441,6.824 6.063,7.487 L6.063,18.987 L3.072,18.987 L3.072,7.487 Z"/>
    <path fill-rule="evenodd"  stroke="rgb(0, 0, 0)" stroke-width="0.575px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"
          d="M11.582,11.628 L11.582,2.888 L11.122,2.888 L11.582,0.588 L13.078,0.588 L13.538,2.888 L13.078,2.888 L13.078,11.628 L14.803,11.628 L14.803,16.687 C14.699,17.964 13.640,18.959 12.388,18.987 C11.093,19.017 9.966,18.007 9.857,16.687 L9.857,11.628 L11.582,11.628 Z"/>
  </svg>
</template>

<script>
export default {
  name: "menuTool",
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
