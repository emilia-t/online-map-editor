<template>
  <div>
    <div class="eyebrow">
      <div class="eyebrowLeft">
        <div class="previewEyeL">
          <preview-eye></preview-eye>
        </div>
        <div class="groupLayerNameBox">
          <span contenteditable="true" class="groupLayerName" v-text="layer.structure[0]"></span>
        </div>
      </div>
      <div class="eyebrowRight" @click.stop="switchLayerActions()">
        <more custom="cursor:pointer;transform:translate(3px,1px)"></more>
      </div>
      <div class="layerMoreActionsClose" @contextmenu.prevent="void 1" @click.stop="switchLayerActions()" v-show="layerActionsOpen">
      </div>
      <div class="layerMoreActions" v-show="layerActionsOpen">
        <div class="layerMoreAction" title="展开或收起此图层所有分组" @click.stop="switchAllExpand()">
          <span v-show="!allExpand">展开</span><span v-show="allExpand">收起</span>所有分组
        </div>
        <div class="layerMoreAction" title="警告！图层内数据会同步消失">
          删除图层
        </div>
      </div>
    </div>
    <div class="content">
      <orange-group-structure :layer="layer" :all-expand="allExpand" :level="1" :route="layer.structure[0]" :structure="layer.structure"></orange-group-structure>
    </div>
  </div>
</template>

<script>
import PreviewEye from "./svgValidIcons/previewEye";
import More from "./svgValidIcons/more";
import OrangeGroupStructure from "./OrangeGroupStructure";
export default {
  name: "BananaGroupLayer",
  data(){
    return{
      layerActionsOpen:false,
      allExpand:true,
    }
  },
  components:{PreviewEye,More,OrangeGroupStructure},
  props:{
    layer:{
      type:Object,
      default:{},
      required:true,
    }
  },
  methods:{
    switchLayerActions(){
      this.layerActionsOpen=!this.layerActionsOpen;
    },
    switchAllExpand(){
      this.allExpand=!this.allExpand;
    },
  }
}
</script>

<style scoped>
.groupLayerNameBox{
  width: calc(100% - 30px);
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.groupLayerName{
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  outline: none;
}
.layerMoreActions{
  width: 205px;
  height: auto;
  min-height: 60px;
  padding: 5px 0px;
  position: absolute;
  z-index: 551;
  background: white;
  box-shadow: #c5c5c5 0px 0px 6px;
  right: 10px;
  top: 40px;
}
.layerMoreAction{
  width: calc(100% - 30px);
  padding: 0px 15px;
  height: 30px;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  z-index: inherit;
  cursor: pointer;
}
.layerMoreAction:hover{
  background: #f1f1f1;
}
.layerMoreActionsClose{
  width: 100%;
  height: 100%;
  opacity: 0;
  position: fixed;
  z-index: 550;
  left: 0px;
  top: 0px;
}
.previewEyeL{
  width:25px;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.prohibit{
  cursor: no-drop;
}
.headTitle span{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.memberActivityInfo img{
  width: 21px;
  height: 21px;
  border-radius: 3px;
  margin: 0px 2px 0px 0px;
  overflow: hidden;
}
.memberKeyInfo:hover .memberRightEyeA{
  opacity: 1;
}
.memberTeamName:hover .memberRightEyeA{
  opacity: 1;
}
.content{
  width:100%;
  height: auto;
}
.eyebrow{
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}
.eyebrowLeft{
  width: calc(100% - 20px);
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.eyebrowLeft span{
  font-size: 15px;
  height: 20px;
}
.eyebrowRight{
  width: 20px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.buttonBox svg{
  margin: 0px 2px;
}
</style>
