<template>
  <div class="LayerBackground">

  </div>
</template>

<script>
export default {
  name: "LayerBackground",
  data(){
    return {
      imgUrl:null,
    }
  },
  mounted() {

  },
  methods:{

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
