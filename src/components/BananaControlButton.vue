<template>
  <div class="controlLayerButtons selectNone" ref="controlLayerButton">
    <img draggable="false" alt="按钮" :src="buttonImgProp" :style="'background:'+this.color"/>
  </div>
</template>

<script>
export default {
  name: "BananaControlButton",
  data(){
    return {
      MY_NAME:"BananaControlButton",
      theData:{
      }
    }
  },
  props:{
    "buttonImgProp":{
      type:String,
      default:''
    },
    "color":{
      type:String,
      default:'#ffffff'
    }
  },
  methods:{
    startSetting(){

    }
  },
  computed:{

  },
  mounted() {
    this.startSetting();
  }
}
</script>

<style scoped>
.controlLayerButtons{
  padding: 10px 10px 4px 10px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.controlLayerButtons img{
  width: 40px;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
  transition: 0.3s;
}
.selectNone{
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>
