<template>
<!--滑动块-->
  <!--接收：max,min,default，返回number-->
  <!--不要使用vuex-->
  <div>
    <div class="slider" :style="style">
      <input @input="CallBack" type="range" :min="min" :max="max" v-model:value="number" class="slider-range">
    </div>
  </div>
</template>

<script>
export default {
  name: "OrangeSlideBlock",
  data(){
    return {
      //这是滑动块的数值
      number:0
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
    }
  },
  methods:{
    CallBack(){
      this.$emit('OrangeSlideBlockCall',this.number)
    },
  },
  computed:{
    style(){
      return {
        width: this.widths+'px'
      }
    }
  },
  mounted() {
    this.number=this.default;
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
