<template>
  <div class="LayerBackground" style="">

  </div>
</template>

<script>
//import bj from '../../../static/homepagebackground.png';
export default {
  name: "LayerBackground",
  data(){
    return {
      imgUrl:null,
      //bj
    }
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
  background-size: 100%;
  pointer-events: none;
  position: fixed;
  top:0px;
  left:0px;
}
</style>
