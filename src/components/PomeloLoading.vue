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
      <div class="pomeloLDC">地图数据&nbsp;&nbsp;<span v-if="!loadData">加载中</span><span v-if="loadData">加载完毕</span></div>
      <div class="pomeloLDC">图层数据&nbsp;&nbsp;<span v-if="!loadLayer">加载中</span><span v-if="loadLayer">加载完毕</span></div>
      <div class="pomeloLDR">长期处于加载中&nbsp;&nbsp;请刷新页面重试</div>
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
computed:{
  loadData(){return this.$store.state.serverData.socket.loadData},
  loadLayer(){return this.$store.state.serverData.socket.loadLayer}
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
