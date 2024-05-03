<template>
<!--
此组件适用于元素属性值编辑和显示(details value)
此组件会显示属性值并且在被更改后进行检测如果检测无误则返回一个数据对象
下面是数据对象的结构说明
data:
{
value : String | Boolean | Number, //新的值(如果为字符串则包含符号类型☍)
item : Object | Null, //可选的属性，props.item源对象，可用于传递要编辑的属性源对象
}
-->
<div class="PomeloInput" :style="'width:'+width+';height:'+height">
  <div class="PomeloInput-text" v-if="type==='text'">
    <input class="PomeloInput-input" type="text" :value="getStrValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
  </div>
  <div class="PomeloInput-text" v-if="type==='list'">
    <input class="PomeloInput-input" type="text" :value="getStrValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
  </div>
  <div class="PomeloInput-text" v-if="type==='number'">
    <input class="PomeloInput-input" type="number" :value="getNumValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
  </div>
  <div class="PomeloInput-bool" v-if="type==='bool'">
    <input type="checkbox" :checked="getCheckValue(value)" :disabled="disabled"
           @change="checkboxChange($event)"/>
  </div>
  <div class="PomeloInput-text" v-if="type==='percent'">
    <input class="PomeloInput-cent" type="number" :value="getPercentValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
    <div class="PomeloInput-per">%</div>
  </div>
  <div class="PomeloInput-text" v-if="type==='datetime'">
    <input class="PomeloInput-input" type="datetime-local" :value="getStrValue(value)" :disabled="disabled"
           @change="dateTimeChange($event)"/>
  </div>
  <div class="PomeloInput-text" v-if="type==='date'">
    <input class="PomeloInput-input" type="date" :value="getStrValue(value)" :disabled="disabled"
           @change="dateChange($event)"/>
  </div>
  <div class="PomeloInput-text" v-if="type==='time'">
    <input class="PomeloInput-input" type="time" :value="getStrValue(value)" :disabled="disabled"
           @change="timeChange($event)"/>
  </div>
</div>
</template>

<script>
export default {
  name: 'PomeloInput',
  data(){
    return{
      strType:'☍t',
      strTypeList:['☍t','☍l','☍p','☍e','☍d','☍m'],
      isChange:false,
    }
  },
  props:{
    value:{
      type:[String,Boolean,Number],
      default:'☍t',
      required:true
    },
    type:{
      type:String,
      default:'text',
      required:true
    },
    disabled:{
      type:Boolean,
      required:true
    },
    item:{//适用于模板编辑界面
      type:Object,
      default:null,
      required:false
    },
    width:{
      type:String,
      default:'100%',
      required:false
    },
    height:{
      type:String,
      default:'40px',
      required:false
    }
  },
  mounted() {

  },
  methods:{
    getPercentValue(str){
      let type=str.substring(0,2);
      let ref;
      if(type==='☍p'){
        ref=parseFloat(str.substr(2));
      }else{
        ref=parseFloat(str);
      }
      if(!isNaN(ref) && ref!==Infinity){
        return ref;
      }else {
        return null;
      }
    },
    getStrValue(str){
      let type=str.substring(0,2);
      if(this.strTypeList.includes(type)){//正常的字符串
        this.strType=type;
        return str.substr(2);
      }else {//异常的字符串
        this.strType='☍t';
        return str;
      }
    },
    getNumValue(number){
      return parseFloat(number)
    },
    getCheckValue(value){
      return value === true;
    },
    focus(){
      this.$store.state.mapConfig.inputFocusStatus=true;//聚焦模式
      this.isChange=false;
    },
    blur(ev){
      this.$store.state.mapConfig.inputFocusStatus=false;//非聚焦模式
      if(this.isChange){
        let value=ev.target.value;
        let type=this.type;
        let newValue;
        let lock=false;
        switch (type){
          case 'text':{
            if(value.length>=2000){
              lock=true;
            }else {
              newValue='☍t'+value;
            }
            break;
          }
          case 'list':{
            if(value.length>=2000){
              lock=true;
            }else {
              newValue='☍l'+value;
            }
            break;
          }
          case 'number':{
            newValue=parseFloat(value);
            if(isNaN(newValue) || newValue===Infinity){
              lock=true;
            }
            break;
          }
          case 'percent':{
            newValue=parseFloat(value);
            if(isNaN(newValue) || newValue===Infinity){
              lock=true;
            }else {
              newValue='☍p'+value+'%';
            }
            break;
          }
        }
        if(lock===false){
          this.$emit('inputChanged',{
            value:newValue,
            item:this.item
          });//返回新值(带类型符)
        }
      }
    },
    change(){
      this.isChange=true;
    },
    checkboxChange(ev){
      let newValue=ev.target.checked;
      this.$emit('inputChanged',{
        value:newValue,
        item:this.item
      });//返回新值
    },
    dateTimeChange(ev){
      let newValue = ev.target.value;
      this.$emit('inputChanged',{
        value:'☍e'+newValue,
        item:this.item
      });//返回新值
    },
    dateChange(ev){
      let newValue=ev.target.value;
      this.$emit('inputChanged',{
        value:'☍d'+newValue,
        item:this.item
      });//返回新值
    },
    timeChange(ev){
      let newValue=ev.target.value;
      this.$emit('inputChanged',{
        value:'☍m'+newValue,
        item:this.item
      });//返回新值
    },
  }
}
</script>
