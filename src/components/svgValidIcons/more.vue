<template>
  <svg :copyright="this.$root.Copyright" :style="custom"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       width="14px" height="20px">
    <path fill-rule="evenodd"  fill="rgb(92, 92, 92)" d="M2.500,4.500 C1.464,4.500 0.625,3.661 0.625,2.625 C0.625,1.589 1.464,0.750 2.500,0.750 C3.536,0.750 4.375,1.589 4.375,2.625 C4.375,3.661 3.536,4.500 2.500,4.500 ZM4.271,9.500 C4.271,10.536 3.431,11.375 2.396,11.375 C1.360,11.375 0.521,10.536 0.521,9.500 C0.521,8.464 1.360,7.625 2.396,7.625 C3.431,7.625 4.271,8.464 4.271,9.500 ZM2.396,14.500 C3.431,14.500 4.271,15.339 4.271,16.375 C4.271,17.411 3.431,18.250 2.396,18.250 C1.360,18.250 0.521,17.411 0.521,16.375 C0.521,15.339 1.360,14.500 2.396,14.500 Z"/>
  </svg>
</template>

<script>
export default {
  name: "more",
  props:{
    custom:{
      type:String,
      default:null,
      required:false,
    }
  }
}
</script>
