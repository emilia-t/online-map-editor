<template>
  <div class="slider" :style="style">
    <input @mousedown="openInput($event)" @focusout="focusout($event)" @input="CallBack" type="range" :min="min" :max="max" v-model:value="number" :style="divStyle" class="slider-range">
  </div>
</template>

<script>
export default {
  name: "OrangeSlideBlock",
  data(){
    return {
      number:0,
      open:false,
    }
  },
  props:{
    max:{
      default:10,
      required:true
    },
    min:{
      default:0,
      required:true
    },
    default:{
      default:0,
      required:true
    },
    widths:{
      default:100
    },
    divStyle:{
      default:''
    }
  },
  mounted() {
    this.number=this.default;
  },
  methods:{
    focusout(ev){
      if(this.open){
        this.open=false;
        this.$emit('OrangeSlideBlockFocusout',ev.target.value);
      }
    },
    CallBack(){
      this.$emit('OrangeSlideBlockCall',this.number)
    },
    openInput(ev){
      if(ev.button!==0){
        return false;
      }
      if(!this.open){
        this.open=true;
        this.$emit('OrangeSlideBlockMousedown','');
      }
    }
  },
  computed:{
    style(){
      return {
        width: this.widths+'px'
      }
    }
  },
  watch:{
    default:{
      handler(newValue){
        this.number=newValue;
      }
    }
  }
}
</script>

<style scoped>
.slider {
  height: 35px;
  position: relative;
}
.slider input[type="range"] {
  position: absolute;
  top: 50%;
  left: 0;
  -webkit-appearance: none;
  background-color: #c6c6c6;
  height: 4px;
  border-radius: 2px;
  width: 100%;
  margin: 0;
  padding: 0;
  transform: translateY(-50%);
}
.slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background-color: #1296db;
  border-radius: 50%;
  cursor: pointer;
  margin-top: 0px;
}
</style>
