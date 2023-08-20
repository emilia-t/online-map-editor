<template>
  <div class="color-picker">
    <input @click="openInput()" @focusout="focusout($event)" class="colorInput" title="点击选择颜色" @input="CallBack" type="color" v-model:value="color">
  </div>
</template>

<script>
export default {
  name: "OrangeColorPalette",
  data(){
    return {
      color:null,
      open:false,
    }
  },
  props:{
    default:{
      type:String,
      default:'#ffffff',
      required:true,
    }
  },
  mounted(){
    this.color=this.default;
  },
  methods:{
    focusout(ev){
      if(this.open){
        this.open=false;
        this.$emit('OrangeColorPaletteFocusout',ev.target.value.substring(1));
      }
    },
    CallBack(){
      this.$emit('OrangeColorPaletteCall',this.color.substring(1));
    },
    openInput(){
      if(!this.open){
        this.open=true;
        this.$emit('OrangeColorPaletteMousedown','');
      }
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
    },
    default:{
      handler(newValue){
        this.color=newValue;
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
.colorInput{
  width: 40px;
  height: 20px;
  padding: 0px;
}
</style>
