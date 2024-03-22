<template>
  <svg :copyright="this.$root.Copyright" :style="custom" @mouseleave.stop="leave" @mouseenter.stop="hover"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="12px" height="14px">
    <path fill-rule="evenodd"  :fill="fill"
          d="M11.594,0.109 L5.981,13.703 L0.394,0.097 L5.992,2.903 L11.594,0.109 Z"/>
  </svg>
</template>

<script>
  export default {
    name: "arrowDown",
    props:{
      custom:{
        type:String,
        default:null,
        required:false,
      }
    },
    data(){
      return {
        fill:'rgb(100,100,100)'
      }
    },
    methods:{
      hover(){
        this.fill='rgb(30,30,30)';
      },
      leave(){
        this.fill='rgb(100,100,100)';
      }
    }
  }
</script>

<style scoped>

</style>
