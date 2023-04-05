<template>
  <div class="LayerBackground">

  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LayerBackground",
  data(){
    return {imgUrl:null}
  },
  mounted() {

  },
  methods:{
    getPicture(){

    }
  }
}
</script>

<style scoped>
.LayerBackground{
  width: 100%;
  height: 100%;

  display: none;
}
</style>
