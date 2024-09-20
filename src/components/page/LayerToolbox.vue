<template>
  <div class="toolboxLayerBox" ref="toolboxLayer" @click.stop="closePanel()" @mousedown.stop="playSoundEffect('unconfirm_1')">
    <div class="toolboxLayer" @click.stop="void 0">
      <div class="toolList">
        <div class="toolBox" @click="openKmlToOmd()" @mousedown.stop="playSoundEffect('confirm_1')">
          <kml-to-omd custom="background:white;cursor:pointer;"/>
          <span class="spanL">kml2omd</span>
        </div>
        <div class="toolBox">
          <draft-icon custom="background:white;cursor:pointer;"/>
          <span class="spanL">画板</span>
        </div>
        <div class="toolBox">
          <span class="spanG">更多APP</span>
          <span class="spanG">开发之中</span>
        </div>
      </div>
    </div>
    <div class="toolApp" @click.stop="void 0" @mousedown.stop="void 0">
      <banana-kml-to-omd :showResponse="toolShow.kmlToOmd" @kmlToOmdCloseRequest="kmlToOmdCloseApproval"/>
    </div>
  </div>
</template>

<script>
import draftIcon from "../svgValidIcons/draftIcon";
import BananaKmlToOmd from "./BananaKmlToOmd";
import kmlToOmd from "../svgValidIcons/kmlToOmd";
export default {
  name: "LayerToolbox",
  components:{kmlToOmd,BananaKmlToOmd,draftIcon,},
  data(){
    return {
      toolShow:{
        kmlToOmd:false,
      }
    }
  },
  methods:{
    playSoundEffect(name){
      this.$store.commit('setCoEffectsSound',name);
    },
    closePanel(){
      this.$store.commit('setCoToolboxShowPanel',false);
    },
    openKmlToOmd(){
      this.toolShow.kmlToOmd=true;
    },
    kmlToOmdCloseApproval(data){
      this.toolShow.kmlToOmd = data !== true;
    },
  },
  computed:{
    posX(){
      return this.$store.state.toolboxConfig.position.x;
    },
    posY(){
      return this.$store.state.toolboxConfig.position.y;
    },
    show(){
      return this.$store.state.toolboxConfig.showPanel;
    },
  },
  watch:{
    show:{
      handler(newValue){
        if(newValue){
          this.$refs.toolboxLayer.animate(
            [
              {left:-315+'px',top:(this.posY-40)+'px'},
              {left:0+'px',top:(this.posY-40)+'px'},
            ]
            ,
            {
              duration:400,
              iterations:1,
              fill:'forwards',
              delay:0,
              easing:'ease',
            }
          );
        }else {
          this.$refs.toolboxLayer.animate(
            [
              {left:0+'px',top:(this.posY-40)+'px'},
              {left:-315+'px',top:(this.posY-40)+'px'},
            ]
            ,
            {
              duration:400,
              iterations:1,
              fill:'forwards',
              delay:0,
              easing:'ease',
            }
          );
        }
      }
    }
  }
}
</script>

<style scoped>
.toolApp{
  width: auto;
  height: auto;
}
.toolBox{
  cursor: default;
  width: 65px;
  height: 65px;
  margin: 0px 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 100;
}
.spanL{
  width: 100%;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.spanG{
  width: 55px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toolList{
  cursor: default;
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 6px;
}
.toolboxLayerBox{
  user-select: none;
  cursor: pointer;
  width: calc(300px + 10px);
  height: calc(80px + 10px);
  background: url("../../../static/LayerToolboxBackground.png");
  border-radius: 4px;
  box-shadow: #c5c5c5 0px 0px 6px;
  position: fixed;
  z-index: 701;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  left: -315px;
}
.toolboxLayer{
  width: 300px;
  height: 80px;
  background: rgba(255,255,255,0.8);
}
</style>
