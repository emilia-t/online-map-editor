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
      default: '#ff0000',
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
  }
}
</script>

<style scoped>
.color-picker{
  display: inline-block;
  position: relative;
  width: 45px;
  height: 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
