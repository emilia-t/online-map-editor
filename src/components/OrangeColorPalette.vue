<template>
  <!--调色板-->
  <!--接收：default，返回16进制的颜色字符串-->
  <!--不要使用vuex-->
  <div class="color-picker">
    <input @input="CallBack" type="color" v-model:value="color">
  </div>
</template>

<script>
export default {
  name: "OrangeColorPalette",
  data(){
    return {
      //这是颜色值
      color:null
    }
  },
  props:{
    default:{
      type:String,
      required:true
    }
  },
  mounted(){
    this.color=this.default;
  },
  methods:{
    CallBack(){
      this.$emit('OrangeColorPaletteCall',this.color.substring(1))
    }
  },
  computed:{
    newColor(){
      if(this.$store.state.mapConfig.operated.data){
        return this.$store.state.mapConfig.operated.data;
      }else {
        return {}
      }
    }
  },
  watch:{
    newColor:{
      handler(newValue){
        if(newValue.color!==undefined){
          this.color='#'+newValue.color;
        }
      }
    }
  }
}
</script>

<style scoped>
.color-picker{
  position: relative;
  width: 45px;
  height: 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
