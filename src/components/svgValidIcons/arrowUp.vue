<template>
  <svg :copyright="this.$root.Copyright" :style="custom" @mouseleave.stop="leave" @mouseenter.stop="hover"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="12px" height="14px">
    <path fill-rule="evenodd"  :fill="fill"
          d="M0.395,13.796 L6.005,0.200 L11.595,13.804 L5.997,11.000 L0.395,13.796 Z"/>
  </svg>
</template>

<script>
export default {
  name: "arrowUp",
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
