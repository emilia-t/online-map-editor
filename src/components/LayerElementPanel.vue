<template>
  <div class="elementPanelLayer" v-show="this.$store.state.userSettingConfig.elementPanelLayerShow">
    <div class="panelHead">
      <div class="headTitle">
        <span style="" v-text="this.$store.state.serverData.socket.config.name"></span>
        <more custom="cursor:pointer"></more>
      </div>
      <div class="headText">
        Test Mode
      </div>
      <div class="headText">
        上次修改时间&nbsp;&nbsp;&nbsp;<span v-text="this.$store.state.serverData.socket.lastEdit"></span>
      </div>
    </div>
    <div class="panelButton">
      <div class="buttonBox">
        <add-new-layer></add-new-layer>
        <div class="buttonBoxText">
          普通图层
        </div>
      </div>
      <div class="buttonBox">
        <add-new-group></add-new-group>
        <div class="buttonBoxText">
          嵌套图层
        </div>
      </div>
      <div class="buttonBox">
        <preview-eye></preview-eye>
        <div class="buttonBoxText">
          预览
        </div>
      </div>
    </div>
    <div class="panelContent">
      <div class="ungroupedBox selectedLayer"><!--默认-->
        <div class="eyebrow">
          <div class="eyebrowLeft">
            <preview-eye></preview-eye>
            <span>默认图层</span>
          </div>
          <div class="eyebrowRight">
            <more custom="cursor:pointer;transform:translate(3px,1px)"></more>
          </div>
        </div>
        <div class="content">
          <div class="memberTeamName">
            <div class="memberTeamNameL">
              <expand-more custom="transform:translate(-2px,1px)"></expand-more>
              <span>Point</span>
            </div>
            <div class="memberTeamNameR" title="隐藏操作仅对您可见">
              <div class="memberRightEyeA" @click.stop="hiddenAllPoint()" v-show="!allPointHideState">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeB" @click.stop="unhiddenAllPoint()" v-show="allPointHideState">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
          </div>
          <div class="memberTeamBox" v-for="item in PointData" @click="locateToElement(item)">
            <div class="memberKeyInfo">
              <div class="memberLeft">
                <point :custom="'fill:#'+item.color+';transform:translate(-2px,0px)'"></point>
                <span class="memberName" v-text="getItemName(item)"></span>
              </div>
              <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)" v-show="!hiddenElements.some((member)=>{return member.id===item.id})">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)" v-show="hiddenElements.some((member)=>{return member.id===item.id})">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
            <div class="memberActivityInfo">
              <div class="memberPick" v-if="pickElements.has(item.id)">
                <span class="memberSpanA" v-text="pickElements.get(item.id).user"></span><span>正在编辑形状</span>
              </div>
              <div class="memberSelect" v-if="selectElements.has(item.id)">
                <span class="memberSpanA" v-text="selectElements.get(item.id).user"></span><span>正在编辑属性</span>
              </div>
            </div>
          </div>
          <div class="memberTeamName">
            <div class="memberTeamNameL">
              <expand-more custom="transform:translate(-2px,1px)"></expand-more>
              <span>Line</span>
            </div>
            <div class="memberTeamNameR" title="隐藏操作仅对您可见">
              <div class="memberRightEyeA" @click.stop="hiddenAllLine()" v-show="!allLineHideState">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeB" @click.stop="unhiddenAllLine()" v-show="allLineHideState">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
          </div>
          <div class="memberTeamBox" v-for="item in PolyLineData">
            <div class="memberKeyInfo">
              <div class="memberLeft" @click="locateToElement(item)">
                <segment-line :custom="'fill:#'+item.color+';transform:translateX(-5px);'"></segment-line>
                <span class="memberName" v-text="getItemName(item)"></span>
              </div>
              <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)" v-show="!hiddenElements.some((member)=>{return member.id===item.id})">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)" v-show="hiddenElements.some((member)=>{return member.id===item.id})">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
            <div class="memberActivityInfo">
              <div class="memberPick" v-if="pickElements.has(item.id)">
                <span class="memberSpanA" v-text="pickElements.get(item.id).user"></span><span>正在编辑形状</span>
              </div>
              <div class="memberSelect" v-if="selectElements.has(item.id)">
                <span class="memberSpanA" v-text="selectElements.get(item.id).user"></span><span>正在编辑属性</span>
              </div>
            </div>
          </div>
          <div class="memberTeamName">
            <div class="memberTeamNameL">
              <expand-more custom="transform:translate(-2px,1px)"></expand-more>
              <span>Area</span>
            </div>
            <div class="memberTeamNameR" title="隐藏操作仅对您可见">
              <div class="memberRightEyeA" @click.stop="hiddenAllArea()" v-show="!allAreaHideState">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeB" @click.stop="unhiddenAllArea()" v-show="allAreaHideState">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
          </div>
          <div class="memberTeamBox" v-for="item in AreaData">
            <div class="memberKeyInfo">
              <div class="memberLeft" @click="locateToElement(item)">
                <region :custom="'fill:#'+item.color+';transform:translateX(-5px);'"></region>
                <span class="memberName" v-text="getItemName(item)"></span>
              </div>
              <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)" v-show="!hiddenElements.some((member)=>{return member.id===item.id})">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)" v-show="hiddenElements.some((member)=>{return member.id===item.id})">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
            <div class="memberActivityInfo">
              <div class="memberPick" v-if="pickElements.has(item.id)">
                <span class="memberSpanA" v-text="pickElements.get(item.id).user"></span><span>正在编辑形状</span>
              </div>
              <div class="memberSelect" v-if="selectElements.has(item.id)">
                <span class="memberSpanA" v-text="selectElements.get(item.id).user"></span><span>正在编辑属性</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ordinaryLayersBox"><!--普通图层：可以应用样式依据功能、同时显示和同时隐藏图层内的元素，但会限制每个元素使用同样的details字段-->
        <div class="ordinaryLayer"><!--图层：[{layerName:'opppo',data:[{ke:'name',val:'xxx'},{key:'age',val:'12'}],[{ke:'name',val:'YYY'},{key:'age',val:'13'}]}]-->
          <div class="ordinaryLayerName">
            <div>
              <div>

              </div>
              <div>

              </div>
            </div>
            <div>

            </div>
          </div>
          <div class="ordinaryLayerCustom">

          </div>
        </div>
      </div>
      <div class="nestedLayersBox"><!--嵌套图层：可以嵌套的元素文件夹，将不同文件放入不同分组内，每个分组又可以包含其他分组，每个组别下的元素可以是各种各样的元素，不限制details字段是否一致-->
        <div><!--Nested layers：{'group1':{           group1_2:{           }  }}-->

        </div>
      </div>
    </div>
    <div class="panelSearch">
      <div class="searchContent" contenteditable="true">
        丽江古城
      </div>
      <search custom="transform:translate(-4px,2px);cursor:pointer;"></search>
    </div>
  </div>
</template>
<script>
import ExpandMore from "./svgValidIcons/expandMore";
import Region from "./svgValidIcons/region";
import SegmentLine from "./svgValidIcons/segmentLine";
import Point from "./svgValidIcons/point";
import AddNewLayer from "./svgValidIcons/addNewLayer";
import AddNewGroup from "./svgValidIcons/addNewGroup";
import PreviewEye from "./svgValidIcons/previewEye";
import More from "./svgValidIcons/more";
import Search from "./svgValidIcons/search";
import EyeVisible from "./svgValidIcons/eyeVisible";
import EyeNotVisible from "./svgValidIcons/eyeNotVisible";
import SegmentCurve from "./svgValidIcons/segmentCurve";
import {mapState} from "vuex";
export default {
  name: "temp",
  components: {
    SegmentCurve,
    More,AddNewLayer,AddNewGroup,PreviewEye,Point,SegmentLine,Region,ExpandMore,Search,
    EyeVisible,EyeNotVisible
  },
  data(){
    return{
      ordinaryLayers:[

      ],
      nestedLayers:[

      ],
      allPointHideState:false,
      allLineHideState:false,
      allAreaHideState:false,
      allCurveHideState:false,
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){

    },
    hiddenAllPoint(){//隐藏所有点
      this.PointData.map(member=>{
          this.$store.state.elementPanelConfig.hiddenElements.push
          ({id:member.id,type:'point',});
        }
      );
    },
    unhiddenAllPoint(){//取消隐藏所有点
      this.$store.state.elementPanelConfig.hiddenElements=
        this.$store.state.elementPanelConfig.hiddenElements.filter(item=>item.type!=='point');
    },
    hiddenAllLine(){
      this.PolyLineData.map(member=>{
          this.$store.state.elementPanelConfig.hiddenElements.push
          ({id:member.id,type:'line',});
        }
      );
    },
    unhiddenAllLine(){
      this.$store.state.elementPanelConfig.hiddenElements=
        this.$store.state.elementPanelConfig.hiddenElements.filter(item=>item.type!=='line');
    },
    hiddenAllArea(){
      this.AreaData.map(member=>{
          this.$store.state.elementPanelConfig.hiddenElements.push
          ({id:member.id,type:'area',});
        }
      );
    },
    unhiddenAllArea(){
      this.$store.state.elementPanelConfig.hiddenElements=
        this.$store.state.elementPanelConfig.hiddenElements.filter(item=>item.type!=='area');
    },
    hiddenAllCurve(){
      this.CurveData.map(member=>{
          this.$store.state.elementPanelConfig.hiddenElements.push
          ({id:member.id,type:'curve',});
        }
      );
    },
    unhiddenAllCurve(){
      this.$store.state.elementPanelConfig.hiddenElements=
        this.$store.state.elementPanelConfig.hiddenElements.filter(item=>item.type!=='curve');
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
    allReinitialize(){//触发全局定位重置
      this.$root.sendInstruct('allReinitialize');
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
    getMapLayer(){
      this.$store.state.serverData.socket.getMapLayer();
    }
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
    pointsNumber(){
      if(this.$store.state.serverData.socket!==undefined){
        return this.$store.state.serverData.socket.mapData.points.length;
      }else {
        return 0;
      }
    },
    linesNumber(){
      if(this.$store.state.serverData.socket!==undefined){
        return this.$store.state.serverData.socket.mapData.lines.length;
      }else {
        return 0;
      }
    },
    areasNumber(){
      if(this.$store.state.serverData.socket!==undefined){
        return this.$store.state.serverData.socket.mapData.areas.length;
      }else {
        return 0;
      }
    },
    curvesNumber(){
      if(this.$store.state.serverData.socket!==undefined){
        return this.$store.state.serverData.socket.mapData.curves.length;
      }else {
        return 0;
      }
    },
    hideTypeNumbers(){
      let hides=this.hiddenElements.length
      let point=0;
      let line=0;
      let area=0;
      let curve=0;
      if(hides===0){
        return {point,line,area,curve};
      }
      for(let i=0;i<hides;i++){
        try {
          let type=this.hiddenElements[i].type;
          switch (type) {
            case 'point':{
              point++;
              break;
            }
            case 'line':{
              line++;
              break;
            }
            case 'area':{
              area++;
              break;
            }
            case 'curve':{
              curve++;
              break;
            }
          }
        }catch (Exception) {
          this.$store.state.monitorConfig.tryErrorTarget.push('LayerElementPanel->computed->hideTypeNumbers');
          this.$store.state.monitorConfig.tryErrorException.push(Exception);
        }
      }
      return {point,line,area,curve};
    },
    pickElements(){
      if(this.$store.state.serverData.socket!==undefined){
        return new Map(this.$store.state.serverData.socket.pickElements.map(item=>[item.id,item]));
      }else {
        return new Map();
      }
    },
    selectElements(){
      if(this.$store.state.serverData.socket!==undefined){
        return new Map(this.$store.state.serverData.socket.selectElements.map(item=>[item.id,item]));
      }else {
        return new Map();
      }
    },
    CurveData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.curves;
      }else {
        return [];
      }
    },
    AreaData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.areas;
      }else {
        return [];
      }
    },
    PolyLineData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.lines;
      }else {
        return [];
      }
    },
    PointData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData.points;
      }else {
        return [];
      }
    },
    isLogin(){
      return this.$store.state.serverData.socket.isLogin;
    },
    mapLayer(){
      return this.$store.state.serverData.socket.mapLayer;
    }
  },
  watch:{
    isLogin:{
      handler(newValue){
        if(newValue===true){
          this.getMapLayer();
        }
      }
    },
    hideTypeNumbers:{
      handler(newValue){
        this.allPointHideState = newValue.point === this.pointsNumber;
        this.allLineHideState = newValue.line === this.linesNumber;
        this.allAreaHideState = newValue.area === this.areasNumber;
        this.allCurveHideState = newValue.curve === this.curvesNumber;
      }
    }
  }
}
</script>

<style scoped>
.headTitle span{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.memberPick{
  width: 100%;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.memberSelect{
  width: 100%;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.memberActivityInfo img{
  width: 21px;
  height: 21px;
  border-radius: 3px;
  margin: 0px 2px 0px 0px;
  overflow: hidden;
}
.memberSpanA{
  height: 25px;
  width: calc(100% - 90px - 23px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 24px;
}
.memberActivityInfo{
  width: calc(100% - 4px);
  height: auto;
  max-height: 50px;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 200;
}
.memberKeyInfo{
  width: 100%;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
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
.memberName{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.memberTeamName{
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  color: #3a84df;
}
.memberTeamNameL{
  width: auto;
  height: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.memberTeamNameR{
  width: auto;
  height: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.memberTeamBox{
  width: calc(100% - 10px);
  height: auto;
  padding-left: 10px;
  margin-bottom: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.memberTeamBox:hover{
  width: calc(100% - 10px - 2px);
  border: 1px solid #4d90fe;
  border-radius: 3px;
}
.memberRightEyeA{
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  opacity: 0;
}
.memberRightEyeB{
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  opacity: 1;
}
.memberLeft{
  width: calc(100% - 25px);
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.ungroupedBox{
  font-size: 14px;
  font-weight: 400;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e5e5;
}
.selectedLayer{
  border-left:2px solid #4d90fe;
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
  margin: 4px;
}
.eyebrowRight{
  width: 20px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.elementPanelLayer{
  width: calc(300px - 18px);
  height: calc(100% - 20px);
  position: fixed;
  z-index: 545;
  left: 20px;
  top: 10px;
  overflow: hidden;
  border-radius: 6px;
  padding: 0px 9px;
  background: white;
  box-shadow: #c5c5c5 0px 0px 6px;
}
.panelHead{
  width: 100%;
  height: 90px;
  margin-top: 7px;
}
.panelButton{
  width: 100%;
  border-radius: 3px;
  height: 30px;
  background: #f3f3f3;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  overflow: hidden;
}
.panelContent{
  width: calc(100% - 4px);
  height: calc(100% - 97px - 30px - 35px);
  padding: 0px 2px;
  overflow-x: hidden;
  overflow-y: auto;
}
.panelSearch{
  width: calc(100% - 2px);
  height: 33px;
  background: #4d90fe;
  border: 1px solid #4d90fe;
  border-radius: 3px;
  overflow: hidden;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}
.headTitle{
  width:100%;
  height: 33px;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.headText{
  width: 100%;
  height: 25px;
  font-size: 14px;
  font-weight: 100;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: end;
}
.buttonBoxText{
  font-size: 13.5px;
  font-weight: 200;
}
.buttonBox{
  width: 80px;
  height: 100%;
  font-size: 13px;
  font-weight: 100;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.buttonBox svg{
  margin: 0px 2px;
}
.searchContent{
  width: calc(100% - 35px - 10px);
  height: calc(100% - 10px);
  background: white;
  padding: 5px;
  overflow: hidden;
  white-space: nowrap;
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}
.searchContent:focus {
  outline: none;
}
</style>
