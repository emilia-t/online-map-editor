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
下面是自定义事件
@inputFocus //用于向父组件传递输入框已被选中的消息，此事件不携带参数
@inputChanged //用于向父组件传递输入框变动的消息，此事件携带data参数
-->
<div class="PomeloInput" :style="'width:'+width+';height:'+height">
  <div class="PomeloInput-universal" v-if="type==='text'">
    <input class="PomeloInput-input" type="text" :value="getStrValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
  </div>
  <div class="PomeloInput-universal" v-if="type==='list'">
    <input class="PomeloInput-input" type="text" :value="getStrValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
  </div>
  <div class="PomeloInput-universal" v-if="type==='listEdit'"><!--额外的列表编辑模式-->
    <div class="PomeloInput-input-list" type="list" @click="switchSelect()" v-text="getStrValueByList(value)"/>
    <div class="PomeloInput-input-select" ref="_select_">
      <div v-for="select in getSelectByList(value)" :title="select" v-text="select" @click="changeSelect(select,value)"/>
      <div v-text="'返回'" @click="switchSelect()"/>
    </div>
  </div>
  <div class="PomeloInput-universal" v-if="type==='number'">
    <input class="PomeloInput-input" type="number" ref="numberInput" :value="getNumValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
  </div>
  <div class="PomeloInput-bool" v-if="type==='bool'">
    <input type="checkbox" :checked="getCheckValue(value)" :disabled="disabled"
           @mousedown="inputFocus()" @change="checkboxChange($event)"/>
  </div>
  <div class="PomeloInput-universal" v-if="type==='percent'">
    <input class="PomeloInput-cent" type="number" :value="getPercentValue(value)" :disabled="disabled"
           @focus="focus()" @change="change()" @blur="blur($event)"/>
    <div class="PomeloInput-per">%</div>
  </div>
  <div class="PomeloInput-universal" v-if="type==='datetime'">
    <input class="PomeloInput-input" type="datetime-local" :value="getStrValue(value)" :disabled="disabled"
           @mousedown="inputFocus()" @change="dateTimeChange($event)"/>
  </div>
  <div class="PomeloInput-universal" v-if="type==='date'">
    <input class="PomeloInput-input" type="date" :value="getStrValue(value)" :disabled="disabled"
           @mousedown="inputFocus()" @change="dateChange($event)"/>
  </div>
  <div class="PomeloInput-universal" v-if="type==='time'">
    <input class="PomeloInput-input" type="time" :value="getStrValue(value)" :disabled="disabled"
           @mousedown="inputFocus()" @change="timeChange($event)"/>
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
    value:{//注意：value是原始的包含类型符号☍?的字符串或数字或布尔或null
      validator(value){//自定义的验证器允许string boolean number null传入参数
        return value===null || typeof value==='string' || typeof value==='boolean' || typeof value==='number';
      },
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
      default:false,
      required:false
    },
    ruleMethod:{//在规则设置中需要传入方法类型
      type:String,
      default:'equ',
      required:false
    },
    /**
     * 引用源数据
     * 会在inputChanged事件中返回源引用数据
     * PomeloInput不会修改此项
     **/
    item:{
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
  methods:{
    mod0InputChanged(){
      let value=Math.ceil(this.$refs.numberInput.value);
      if(isNaN(value))value=0;
      this.$emit('inputChanged',{
        value:value,
        item:this.item
      });
    },
    changeSelect(select,value){
      let arr=value.substr(2).split(',');
      arr.remove(select);
      arr.unshift(select);
      this.switchSelect();
      this.$emit('inputChanged',{
        value:'☍l'+arr.toString(),
        item:this.item
      });
      return true;
    },
    switchSelect(){
      this.$refs._select_.classList.toggle('PomeloInput-input-select-open');
    },
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
    getSelectByList(str){
      let type=str.substring(0,2);
      if(this.strTypeList.includes(type)){//正常的字符串
        return str.substr(2).split(',').splice(1);
      }else {//异常的字符串
        return [];
      }
    },
    getStrValueByList(str){
      let type=str.substring(0,2);
      if(this.strTypeList.includes(type)){//正常的字符串
        this.strType=type;
        return str.substr(2).split(',')[0];
      }else {//异常的字符串
        this.strType='☍t';
        return str;
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
      if(number===null)return null;
      return parseFloat(number)
    },
    getCheckValue(value){
      return value === true;
    },
    inputFocus(){
      this.$emit('inputFocus','');
    },
    focus(){
      this.$store.state.mapConfig.inputFocusStatus=true;//聚焦模式
      this.isChange=false;
      this.inputFocus();
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
            if(this.ruleMethod==='mod0' || this.ruleMethod==='nmod0'){//模等于0和模不等于0需要转化为整数
              newValue=Math.ceil(newValue);
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
  },
  watch:{
    ruleMethod:{
      handler(newValue){//监听在切换到mod方法时将原本的value转化为整数
        if(newValue==='mod0' || newValue==='nmod0'){
          if(this.$refs.numberInput===undefined){//等待dom同步
            setTimeout(()=>this.mod0InputChanged(),1);
          }else{
            this.mod0InputChanged();
          }
        }
      }
    }
  }
}
</script>
