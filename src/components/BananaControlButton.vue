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
      default:'#009aa6'
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
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.controlLayerButtons img{
  width: 50px;
  height: 50px;
  border-radius: 5px;
  overflow: hidden;
  transition: 0.3s;
  box-shadow:#e1e0e0 2px 2px 4px 1px;
}
.selectNone{
  -webkit-touch-callout:none; /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
</style>
