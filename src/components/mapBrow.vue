<template>
  <!--旧的版本-z-100~200-->
<div class="mapBrow">
  {{childrenTest}}
</div>
</template>

<script>
export default {
  name: "mapBrow",
  data(){
    return{
      childrenTest:this.$root.test
    }
  },
  methods:{

  },
  created() {
    this.$on("testChanged",(val)=>{this.childrenTest=val;console.log("已经收到通3知")})
  }
}
</script>

<style scoped>
  .mapBrow{display: flex;position: fixed;justify-content: center;align-items: center;width: 100%;height: 70px;
    background: #b1e8d6;
    top:0px;
    left: 0px;
    z-index: 100;
  }
</style>
