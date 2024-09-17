<!--弹窗-->
<template>
  <div class="PomeloFloatBox" v-if="visible">
    <div class="PomeloFloatTip" v-for="item in message">
      <span class="PomeloFloatSpan">{{item}}</span>
      <button @click="closeAlert">关闭</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PomeloFloatTip',
    data(){
      return{
        visible:false,
        text:'text'
      };
    },
    props:{
      message:{
        type:Array,
        default:[],
        required:false
      }
    },
    methods: {
      closeAlert(){
        this.visible=false;
        this.message.length=0;
      }
    },
   watch:{
     message:{
       handler(){
         this.visible=true;
       }
     }
   }
  }
</script>
