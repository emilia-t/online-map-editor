<template>
    <div class="pomeloLD" ref="pomeloLD" v-if="show">
      <div class="pomeloLDA">
        <loading-page-earth :custom="emoji"/>
      </div>
      <div class="pomeloLDT">
        <span data-s="1" class="pomeloLD1">正</span>
        <span data-s="2" class="pomeloLD1">在</span>
        <span data-s="3" class="pomeloLD1">加</span>
        <span data-s="4" class="pomeloLD1">载</span>
        <span data-s="5" class="pomeloLD1">请</span>
        <span data-s="6" class="pomeloLD1">稍</span>
        <span data-s="7" class="pomeloLD1">后</span>
        <span data-s="8" class="pomeloLD2">.</span>
        <span data-s="9" class="pomeloLD2">.</span>
        <span data-s="10" class="pomeloLD2">.</span>
        <span data-s="11" class="pomeloLD2">.</span>
        <span data-s="12" class="pomeloLD2">.</span>
        <span data-s="13" class="pomeloLD2">.</span>
      </div>
    </div>
</template>
<script>
import loadingPageEarth from "./svgValidIcons/custom/loadingPageEarth";
export default {
name:'PomeloLoading',
components:{loadingPageEarth},
props:{view:{type:Boolean,required:true}},
data(){
  return{
    emoji:'( \'- \' )',
    Emoji:['( \'- \' )','☆_☆','^ω^','♡♡♡','(||๐_๐)'],
    count:0,
    show:true,
  }
},
mounted(){
  setInterval(()=>{
    if(this.count===this.Emoji.length)this.count=0;
    this.emoji=this.Emoji[this.count++];
    },2000);
},
watch:{
  view:{
    handler(value){
      if(value){
        this.show=true;//打开加载界面
      }else{
        this.$refs.pomeloLD.classList.add('pomeloLD-end');//添加渐隐动画
        setTimeout(()=>this.show=false,500);//关闭加载中界面
      }
    }
  }
}
}
</script>
