<template>
  <!--添加、删除线段功能-先做；之后做编辑(节点)-->
  <div class="controlLayer" ref="controlLayer" style="pointer-events:auto" >
    <!--按钮-->
    <!--添加-->
    <banana-control-button ref="controlButton0" :color="Url0Color" :button-img-prop="Url0" :right-pos="'10px'" :top-pos="'100px'"></banana-control-button>
    <banana-control-button ref="controlButton1" :button-img-prop="Url1" :right-pos="'10px'" :top-pos="'180px'"></banana-control-button>
    <banana-control-button ref="controlButton2" :button-img-prop="Url2" :right-pos="'10px'" :top-pos="'260px'"></banana-control-button>
    <banana-control-button ref="controlButton3" :button-img-prop="Url3" :right-pos="'10px'" :top-pos="'340px'"></banana-control-button>
    <!--编辑属性面板-->
    <BananaPointAttributeBoard></BananaPointAttributeBoard>
  </div>
</template>

<script>
import BananaControlButton from "./BananaControlButton";
import BananaPointAttributeBoard from "./BananaPointAttributeBoard";
import interestPoint from '../../static/interestPoint.png';//关注点
import constructionPoint from '../../static/constructionPoint.png';//施工点
import lineImg from '../../static/line.png';//线段类型
import regionImg from '../../static/region.png';
//区域类型
//#e72323 红色
//
export default {
  name: "LayerControl",
  components:{BananaControlButton, BananaPointAttributeBoard},
  data(){
    return {
      MY_NAME:"LayerControl",
      Url0:interestPoint,
      Url0Color:'#fffb3d',//#e72323&#e72323
      Url1:constructionPoint,
      Url2:lineImg,
      Url3:regionImg,
      isAddPoint:false
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.KeyListen();//开启键盘监听
      this.$refs.controlButton0.$el.addEventListener('click',()=>this.addInterestPointStart());//添加关注点添加事件
    },
    //添加关注点
    addInterestPointStart(){
      if(!this.isAddPoint){
        this.isAddPoint=true;//更改添加点状态为“可用”
        this.Url0Color='#e72323';//更改背景色
        console.log("1")
      }else {
        this.isAddPoint=false;//更改添加点状态为“可用”
        this.Url0Color='#fffb3d';//更改背景色
      }
    },
    //禁用添加关注点
    addInterestPointDone(){
      this.isAddPoint=true;//更改添加点状态为“可用”
      this.Url0Color='#e72323';//更改背景色
    },
    //用于监听单个按键的
    KeyListen(){
      document.body.addEventListener('keyup',(e)=>{
        let KEY=e.key;
        switch (KEY){
          case 'F4':{
            this.F4Event();
          }
        }
      })
    },
    //F4的事件
    F4Event(){
      this.$root.sendInstruct('openF4DebugBord');
    }
  },
  computed:{

  }
}
</script>

<style scoped>
.controlLayer{
  width: auto;
  height: auto;
  /*background: red;*/
  /*display: flex;*/
  /*position: fixed;*/
  /*justify-content: center;*/
  /*left: calc((100% - (var(--panelWidth) + var(--panelLeft))) * var(--controlLeft));*/
  /*top: var(--controlTop);*/
  /*border-radius: var(--borderType02);*/
  /*box-shadow: var(--BottomShadowColor);*/
  /*background: var(--BottomBackgroundColor);*/
}
</style>
