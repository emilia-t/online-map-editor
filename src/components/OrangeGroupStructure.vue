<template>
  <div :class="eachLevelClass">
    <div class="memberTeamName" @contextmenu.stop.prevent="contextmenuHeadOpen($event)">
      <div class="memberTeamNameL">
        <div class="expandMoreL" @click.stop="expandGroup()" v-show="!groupExpand">
          <expand-more custom="transform:translate(0px,-1px) rotate(180deg);cursor:pointer;"></expand-more>
        </div>
        <div class="expandMoreL" @click.stop="expandGroup()" v-show="groupExpand">
          <expand-more custom="transform:translate(0px,2px);cursor:pointer;"></expand-more>
        </div>
        <span>{{structure[0]}}</span>
      </div>
      <div class="memberTeamNameR" title="隐藏操作仅对您可见">
        <div class="memberRightEyeA" @click.stop="hiddenAllElements()" v-show="!groupMemberAllHide">
          <eye-visible custom="cursor:pointer"></eye-visible>
        </div>
        <div class="memberRightEyeB" @click.stop="unHiddenAllElements()" v-show="groupMemberAllHide">
          <eye-not-visible custom="cursor:pointer"></eye-not-visible>
        </div>
      </div>
    </div>
    <div class="memberTeamBox" v-for="(item,index) in extractLatter()" :key="index" v-show="groupExpand">
      <div class="memberKeyInfo" v-if="!isArray(item)" @contextmenu.stop.prevent="contextmenuItemOpen($event)">
        <div class="memberLeft" @click="locateToElement(layer.members[item])">
          <point v-if="layer.members[item].type==='point'" :custom="'fill:#'+layer.members[item].color+';transform:translate(-2px,0px)'"></point>
          <segment-line v-if="layer.members[item].type==='line'" :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'"></segment-line>
          <region v-if="layer.members[item].type==='area'" :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'"></region>
          <span class="memberName" v-text="getItemName(layer.members[item])"></span>
        </div>
        <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(layer.members[item].id,layer.members[item].type)" v-show="!hiddenElements.some((member)=>{return member.id===layer.members[item].id})">
          <eye-visible custom="cursor:pointer"></eye-visible>
        </div>
        <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(layer.members[item].id,layer.members[item].type)" v-show="hiddenElements.some((member)=>{return member.id===layer.members[item].id})">
          <eye-not-visible custom="cursor:pointer"></eye-not-visible>
        </div>
      </div>
      <div class="memberActivityInfo" v-if="!isArray(item)">
        <div class="memberPick" v-if="false">
          <span class="memberSpanA" v-text="'emilia-text'"></span><span>编辑形状中</span>
        </div>
        <div class="memberSelect" v-if="false">
          <span class="memberSpanA" v-text="'emilia-text'"></span><span>编辑属性中</span>
        </div>
      </div>
      <orange-group-structure v-if="isArray(item)" :layer="layer" :level="level+1" :all-expand="allExpand" :structure="item"></orange-group-structure>
    </div>
    <div class="memberMenuClose" @contextmenu.prevent="void 1" @click.stop="contextmenuHeadClose()" v-show="memberHeadMenu.show"></div>
    <div class="memberMenu" :style="headContextmenuPos" v-show="memberHeadMenu.show">
      <div class="menuListBox">
        <div class="menuList">
          在底部新建分组
        </div>
        <div class="menuList">
          删除此分组
        </div>
        <div class="menuList">
          添加元素
        </div>
      </div>
    </div>
    <div class="memberMenuClose" @contextmenu.prevent="void 1" @click.stop="contextmenuItemClose()" v-show="memberItemMenu.show"></div>
    <div class="memberMenu" :style="itemContextmenuPos" v-show="memberItemMenu.show">
      <div class="menuListBox">
        <div class="menuList">
          移动到其他分组
        </div>
        <div class="menuList" @click="">
          移除出此图层
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExpandMore from "./svgValidIcons/expandMore";
import EyeVisible from "./svgValidIcons/eyeVisible";
import EyeNotVisible from "./svgValidIcons/eyeNotVisible";
import OrangeGroupStructure from "./OrangeGroupStructure";
import Region from "./svgValidIcons/region";
import SegmentLine from "./svgValidIcons/segmentLine";
import Point from "./svgValidIcons/point";
import {mapState} from "vuex";
export default {
  name: "OrangeGroupStructure",
  components:{
    OrangeGroupStructure,EyeVisible,EyeNotVisible,ExpandMore,Region,
    SegmentLine,Point,
  },
  data(){
    return {
      groupExpand:true,
      memberHeadMenu:{
        x:0,
        y:0,
        show:false,
      },
      memberItemMenu:{
        x:0,
        y:0,
        show:false,
      },
    }
  },
  props:{
    layer:{//继承根图层数据
      type:Object,
      default:{},
      required:true,
    },
    level:{//分组层级
      type:Number,
      default:1,
      required:true,
    },
    structure:{//组织结构
      type:Array,
      default:[],
      required:true
    },
    allExpand:{//展开全部分组
      type:Boolean,
      default:true,
      required:false
    },
  },
  mounted() {

  },
  methods:{
    contextmenuHeadOpen(ev){//头部右键菜单
      this.memberHeadMenu.show=true;
      this.memberHeadMenu.x=ev.x;
      this.memberHeadMenu.y=ev.y;
    },
    contextmenuHeadClose(){
      this.memberHeadMenu.show=false;
    },
    contextmenuItemOpen(ev){//成员右键菜单
      this.memberItemMenu.show=true;
      this.memberItemMenu.x=ev.x;
      this.memberItemMenu.y=ev.y;
    },
    contextmenuItemClose(){
      this.memberItemMenu.show=false;
    },
    expandGroup(){//展开或收起分组
      this.groupExpand=!this.groupExpand;
    },
    isArray(any){
      return Array.isArray(any);
    },
    extractLatter(){//提取除第1-2位
      return this.structure.slice(2);
    },
    extractNumber(){//提取除第1-2位外过滤子分组
      let latter=this.structure.slice(2);
      return latter.filter(
        item=>{
          return !Array.isArray(item);
        }
      );
    },
    getCenterPoint(points){//获取元素中心点
      let x=0;
      let y=0;
      let n=points.length;
      for(let i=0;i<n;i++){
        x+=points[i].x;
        y+=points[i].y;
      }
      return{x:x/n,y:y/n};
    },
    getItemName(item){//获取元素名字
      const unknown='未命名元素';
      if(!item.hasOwnProperty('details')){
        return unknown;
      }
      for(let i=0;i<item.details.length;i++){
        if(item.details[i].key==='名称' || item.details[i].key==='name'){
          if(item.details[i].value===''){
            return unknown;
          }
          return item.details[i].value;
        }
      }
      return unknown;
    },
    locateToElement(element){//移动到目标元素的位置
      let elementPosition=null;
      if(element.type==='point'){
        elementPosition={x:element.point.x,y:element.point.y};
      }
      else {
        elementPosition=this.getCenterPoint(element.points);
      }
      let screenCenter={x:window.innerWidth/2,y:window.innerHeight/2};
      let moveX=screenCenter.x-elementPosition.x;
      let moveY=elementPosition.y+screenCenter.y;
      this.$store.state.mapConfig.A1.x+=moveX;
      this.$store.state.mapConfig.A1.y+=moveY;
      this.$store.state.baseMapConfig.baseMap.view.offsetX+=moveX;
      this.$store.state.baseMapConfig.baseMap.view.offsetY+=moveY;
      this.$store.state.baseMapConfig.baseMap.render();
      this.allReinitialize();
    },
    allReinitialize(){//触发全局定位重置
      this.$root.sendInstruct('allReinitialize');
    },
    hiddenElement(id,type){//隐藏某元素
      if(!this.hiddenElements.some((member)=>{return member.id===id})){
        this.$store.commit('arrCoElementPanelHiddenElements',
          {type:'push',data:{id,type}});
      }else {
        this.$store.commit('arrCoElementPanelHiddenElements',
          {type:'remove',data:{id,type}})
      }
    },
    hiddenAllElements(){
      const member=this.extractNumber();
      const length=member.length;
      for(let i=0;i<length;i++){
        let id=this.layer.members[member[i]].id;
        let type=this.layer.members[member[i]].type;
        if(!this.hiddenElements.some((member)=>{return member.id===id})){
          this.$store.commit('arrCoElementPanelHiddenElements',
            {type:'push',data:{id,type}});
        }
      }
    },
    unHiddenAllElements(){
      const member=this.extractNumber();
      const length=member.length;
      for(let i=0;i<length;i++){
        let id=this.layer.members[member[i]].id;
        let type=this.layer.members[member[i]].type;
        if(this.hiddenElements.some((member)=>{return member.id===id})){
          this.$store.commit('arrCoElementPanelHiddenElements',
            {type:'remove',data:{id,type}});
        }
      }
    },
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
    itemContextmenuPos(){
      return {
        left:this.memberItemMenu.x+'px',
        top:this.memberItemMenu.y+'px',
      }
    },
    headContextmenuPos(){
      return {
        left:this.memberHeadMenu.x+'px',
        top:this.memberHeadMenu.y+'px',
      }
    },
    groupMemberAllHide(){
      if(this.layer.members===[]){
        return false;
      }
      if(typeof this.layer.members[0]==='string'){
        return false;
      }
      let hideNum=0;
      const map=new Map(this.hiddenElements.map(item=>[item.id,item]));
      const member=this.extractNumber();
      const length=member.length;
      for(let i=0;i<length;i++){
        if(map.has(this.layer.members[member[i]].id)){
          hideNum++;
        }
      }
      return hideNum === length;
    },
    eachLevelClass(){
      return this.level===1?'OrangeGroupStructureL1':'OrangeGroupStructure';
    }
  },
  watch:{
    allExpand:{
      handler(newValue){
        this.groupExpand=newValue;
      }
    }
  }
}
</script>

<style scoped>
.menuListBox{
  width: 100%;
  height: auto;
  min-height: 60px;
  padding: 5px 0px;
  position: absolute;
  z-index: 551;
  background: white;
  -webkit-box-shadow: #c5c5c5 0px 0px 6px;
  box-shadow: #c5c5c5 0px 0px 6px;
}
.menuList{
  width: calc(100% - 30px);
  padding: 0px 15px;
  height: 30px;
  font-size: 14px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  z-index: inherit;
  cursor: pointer;
}
.menuList:hover{
  background: #f1f1f1;
}
.memberMenuClose{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 555;
  top: 0px;
  left: 0px;
}
.memberMenu{
  width: 180px;
  height: auto;
  min-height: 100px;
  position: fixed;
  z-index: 556;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.OrangeGroupStructure{
  width: 100%;
  height: auto;
  min-height: 27px;
}
.OrangeGroupStructureL1{
  width: calc(100%);
  height: auto;
  min-height: 27px;
  padding: 5px 0px 5px 0px;
}
.memberTeamName{
  width: 100%;
  height: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  color: #3a84df;
}
.memberTeamName:hover .memberRightEyeA{
  opacity: 1;
}
.memberKeyInfo:hover .memberRightEyeA{
  opacity: 1;
}
.memberTeamBox:hover{
  box-shadow: 0px 0px 2px #2577ff;
}
.memberTeamNameL{
  width: auto;
  height: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}
.memberTeamNameR{
  width: auto;
  height: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}
.expandMoreL{
  width: 25px;
  height: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.memberRightEyeA{
  width: 25px;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: 0.2s;
  transition: 0.2s;
  opacity: 0;
}
.memberRightEyeB{
  width: 25px;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: 0.2s;
  transition: 0.2s;
  opacity: 1;
}
.memberTeamBox{
  width: calc(100% - 15px);
  height: auto;
  padding-left: 15px;
  margin-bottom: 3px;
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.memberKeyInfo{
  width: 100%;
  height: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
}
.memberActivityInfo{
  width: calc(100% - 4px);
  height: auto;
  max-height: 50px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 200;
}
.memberLeft{
  width: calc(100% - 25px);
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.memberRightEyeA{
  width: 25px;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: 0.2s;
  transition: 0.2s;
  opacity: 0;
}
.memberRightEyeB{
  width: 25px;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: 0.2s;
  transition: 0.2s;
  opacity: 1;
}
.memberName{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.memberPick{
  width: 100%;
  height: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.memberSelect{
  width: 100%;
  height: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.memberSpanA{
  height: 25px;
  width: calc(100% - 70px - 23px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 24px;
}

</style>
