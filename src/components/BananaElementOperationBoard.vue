<template>
  <div class="BananaElementOperationBoard" v-show="this.$store.state.operationBoardConfig.display" :style="style">
    <div class="panel"><!--右键菜单-->
      <div @click="deleteElement()" class="ButtonBox" ref="deleteButtonBox">
        <img title="删除元素"  class="ButtonImg" draggable="false" alt="按钮" src="../../static/delete.png"/>
      </div>
      <div @click="editElement()" class="ButtonBox" ref="editButtonBox">
        <img title="编辑元素" class="ButtonImg" draggable="false" alt="按钮" src="../../static/edit.png"/>
      </div>
      <div @click="hiddenElement(operated.id,operated.type)" class="ButtonBox" ref="hideElement" title="隐藏元素">
        <eye-not-visible/>
      </div>
      <div class="ButtonBox" ref="historyRecord">
        <img title="历史记录" @click="" class="ButtonImg" draggable="false" alt="按钮" src="../../static/historyRecord.png"/>
      </div>
<!--      <div class="ButtonBox" ref="moreButtonBox">-->
<!--        <img title="展开更多" class="ButtonImg" draggable="false" alt="按钮" src="../../static/more.png"/>-->
<!--      </div>-->
    </div>
    <div v-show="editPanelShow" class="boxOut" ref="BananaAttributeBoard" :style="boxOutStyle"><!--编辑面板-->
      <div class="BananaAttributeBoard">
        <div class="headName mouseType1" contenteditable="false">编辑元素</div>
        <div class="boxSet"><!--面板本体设置，面板透明度、关闭按钮-->
          <img src="../../static/waterDroplet.png" ref="waterDroplet" class="icon15" alt="waterDroplet" title="透明化面板">
          <img @click="editElement()" src="../../static/close.png" class="closeButton" alt="closeButton" title="关闭面板">
        </div>
        <div class="item iStyle"><!--样式设置，修改颜色、宽度、透明度-->
          <div class="iTitle"><!--标题-->
            样式设置
          </div>
          <div class="iTitleExp" v-if="viewColorSet===false || viewWidthSet===false"><!--解释文字-->
            此元素的样式由其所属的图层模板管理
          </div>
          <div class="iStyContent"><!--内容-->
            <div class="iStyP" v-if="this.operated.type==='point'">
              <div class="iStyName">选择图标</div>
            </div>
            <div class="iStySlide" v-if="this.operated.type==='point'">
              <orange-icons-custom @OrangeIconsCustomCall="instantChangeCustom"
                                   @OrangeIconsCustomMousedown="beforeChangeCustom"/>
            </div>
            <div class="iStyP" v-if="viewColorSet"><!--选中的元素具有颜色规则时限制编辑颜色-->
              <div class="iStyName">当前颜色</div>
              <div class="iStyView" title="当前颜色" :style="operatedColor"></div>
              <div class="iStyName">自选颜色</div>
              <orange-color-palette @OrangeColorPaletteFocusout="instantChangeColor"
                                    @OrangeColorPaletteCall="paletteHandle"
                                    @OrangeColorPaletteMousedown="beforeChangeColor()" class="iStyInput"
                                    :default="'#'+operated.color"/>
            </div>
            <div class="iStyColors" v-if="viewColorSet"><!--颜色推荐选择区域-->
              <div class="iStyColor" v-for="color in colors" :style="'background:#'+color" @mousedown="beforeChangeColor()" @click="instantChangeColor(color)"></div>
            </div>
            <div class="iStyP" v-if="this.operated.type!=='area' && viewWidthSet">
              <div class="iStyName">当前宽度</div>
              <div class="iStyWidth" title="当前宽度">{{this.operatedCache.width}}</div>
            </div>
            <div class="iStySlide" v-if="this.operated.type!=='area' && viewWidthSet">
              <orange-slide-block @OrangeSlideBlockFocusout="instantChangeWidth" @OrangeSlideBlockCall="sliderHandle"
                                  @OrangeSlideBlockMousedown="beforeChangeWidth()"
                                  :div-style="'width:267px;left:-92px;top:34%'" :max="15" :min="slideMin"
                                  :default="this.operated.width"/>
            </div>
          </div>
        </div>
        <div class="item iAttribute"><!--属性编辑，区域、名称、类型....-->
          <div class="iTitle">
            属性编辑
          </div>
          <div class="iAttContent"><!--内容-->
            <div class="iAttItem" v-for="detail in operated.details">
              <div class="leftProperty">
                {{detail.key}}
              </div>
              <div class="rightValue">
                <img src="../../static/keyToValue.png" class="keyToValue" alt="keyToValue"/>
                <pomelo-input :value="getContent(detail.value)" :type="getType(detail.value)" :item="detail" @inputFocus="beforeChangeDetail" @inputChanged="detailsChanged"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EyeNotVisible from "./svgValidIcons/eyeNotVisible";
import Lodash from 'lodash';
import OrangeColorPalette from './OrangeColorPalette';
import OrangeSlideBlock from './OrangeSlideBlock';
import OrangeIconsCustom from './OrangeIconsCustom';
import {mapState} from "vuex";
import PomeloInput from "./PomeloInput";

export default {
  name: "BananaElementOperationBoard",
  components:{OrangeColorPalette,OrangeSlideBlock,OrangeIconsCustom,EyeNotVisible,PomeloInput},
  data(){
    return {
      editPanelShow:false,
      operatedCache:{},
      oldColor:null,
      oldWidth:null,
      oldCustom:null,
      oldDetail:null,
      operatedBack:null,
      colors:['cc0066','ff6666','ff6600','ffcc33','ffff00','99cc33','66cc33','009966','009999','0099cc','333399','993399','666633',
        '993300','ff6600','ffcc00','996600','669933','006633','006699','333366','6633cc','cccccc','666666','333333','000000'],
      translucent:false,
      tmpProof:null,
      viewColorSet:false,
      viewWidthSet:false
    }
  },
  mounted() {
    this.tmpProof=new this.$store.state.classList.tmpProof('chinese');
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.waterDropletEvent();
    },
    detailsChanged(data){
      data.item.value=data.value;
      this.instantChangeDetail();
    },
    getContent(value){
      if(this.tmpProof===null)return '';
      return value;
    },
    getType(value){
      if(this.tmpProof===null)return 'text';
      let v=this.tmpProof.GetType(value);
      return v==='list'?'listEdit':v;
    },
    hiddenElement(id,type){
      if(!this.mapHiddenElements.has(id)){
        this.$store.commit('arrCoElementPanelHiddenElements',
          {type:'push',data:{id,type}});
        this.$store.commit('resCoMapOperated');
        this.$store.state.operationBoardConfig.display=false;
      }else {
        this.$store.commit('arrCoElementPanelHiddenElements',
          {type:'remove',data:{id,type}})
      }
    },
    waterDropletEvent(){
      this.$refs.waterDroplet.addEventListener('click',(ev)=>{
        if(!this.translucent){
          this.$refs.BananaAttributeBoard.classList.toggle('transparent');
          this.translucent=true;
        }else {
          this.$refs.BananaAttributeBoard.classList.toggle('transparent');
          this.translucent=false;
        }
      });
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    sliderHandle(data){//滑块
      try{
        this.operatedCache.width=data;
      }catch (e) {

      }
    },
    paletteHandle(data){//色块
      this.operatedCache.color=data;
    },
    beforeChangeDetail(){
      this.oldDetail=JSON.parse(JSON.stringify(this.operated.details));
    },
    instantChangeDetail(){
      if(JSON.stringify(this.oldDetail)===JSON.stringify(this.operated.details)){
        return false;
      }
      let updateId='up'+this.$store.state.serverData.socket.updateId++;
      let sendDataObj={
        id:this.operated.id,
        updateId:updateId,
        changes:{details:this.operated.details},
      };
      let recordObj=JSON.parse(JSON.stringify(
        {
          type:'updateElement',
          class:this.operated.type,
          id:this.operated.id,
          updateId:updateId,
          changes:['details'],
          oldValue:this.oldDetail,
        }
      ));
      this.$store.state.recorderConfig.initialIntent.push(recordObj);
      this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,this.operated.type);
    },
    beforeChangeWidth(){
      this.oldWidth=this.operated.width;
    },
    instantChangeWidth(data){
      if(data.toString()===this.oldWidth.toString()){
        return false;
      }
      let updateId='up'+this.$store.state.serverData.socket.updateId++;
      let sendDataObj={
        id:this.operated.id,
        updateId:updateId,
        changes:{width:data}
      };
      let recordObj=JSON.parse(JSON.stringify({
          type:'updateElement',
          class:this.operated.type,
          id:this.operated.id,
          updateId:updateId,
          changes:['width'],
          oldValue:this.oldWidth,
        }
      ));
      this.$store.state.recorderConfig.initialIntent.push(recordObj);
      this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,this.operated.type);
    },
    beforeChangeColor(){
      this.oldColor=this.operated.color;
    },
    instantChangeColor(data){
      if(data===this.oldColor){
        return false;
      }
      let updateId='up'+this.$store.state.serverData.socket.updateId++;
      let sendDataObj={
        id:this.operated.id,
        updateId:updateId,
        changes:{color:data}
      };
      let recordObj=JSON.parse(JSON.stringify({
          type:'updateElement',
          class:this.operated.type,
          id:this.operated.id,
          updateId:updateId,
          changes:['color'],
          oldValue:this.oldColor,
        }
      ));
      this.$store.state.recorderConfig.initialIntent.push(recordObj);
      this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,this.operated.type);
    },
    beforeChangeCustom(){
      this.oldCustom=JSON.parse(JSON.stringify(this.operated.custom));
    },
    instantChangeCustom(data){
      if(this.operated.custom===null){//异常情况
        this.$store.commit('setCoLogMessage',{text:'更新失败，因为元素'+this.operated.id+'.custom为空，请联系管理员',from:'internal:BananaElementOperationBoard',type:'error'});
        return false;
      }
      if(this.oldCustom!==null && typeof this.oldCustom==='object'){//新旧值一样的情况不更新
        if(data===this.oldCustom.icon){
          return false;
        }
      }
      let updateId='up'+this.$store.state.serverData.socket.updateId++;
      let sendDataObj={
        id:this.operated.id,
        updateId:updateId,
        changes:{custom:this.operated.custom},
      };
      let recordObj=JSON.parse(JSON.stringify({
          type:'updateElement',
          class:this.operated.type,
          id:this.operated.id,
          updateId:updateId,
          changes:['custom'],
          oldValue:this.oldCustom,
        }
      ));
      this.$store.state.recorderConfig.initialIntent.push(recordObj);
      this.operated.custom.icon=data;
      this.$store.state.serverData.socket.broadcastUpdateElement(sendDataObj,this.operated.type);
    },
    editElement(){//编辑操作
      this.editPanelShow=!this.editPanelShow;
    },
    deleteElement(){//删除操作
      let id=this.operated.id;//select id
      let tmpId=null;//template id
      try{tmpId=this.operated.custom.tmpId;}catch(e){}
      let recordObj=JSON.parse(JSON.stringify({
        type:'delete',
        class:this.operated.type,
        id:id,
        tmpId:tmpId
      }));
      this.$store.state.recorderConfig.initialIntent.push(recordObj);
      this.$store.state.serverData.socket.broadcastDeleteElement(id,tmpId);
      this.$store.state.operationBoardConfig.display=false;
    },
    checkHasRule(tmpId){//检查模板的规则是否有颜色规则或宽度规则
      let layers=this.$store.state.serverData.socket.mapLayerData;
      let viewColorSet=false;//默认不显示
      let viewWidthSet=false;
      for(let i=0;i<layers.length;i++){
        try{
          if(tmpId===layers[i].structure[1].template.id){
            viewColorSet = layers[i].structure[1].template.colorRule.basis === "";//检查颜色规则是否存在
            viewWidthSet = layers[i].structure[1].template.widthRule.basis === "";//检查宽度规则是否存在
            break;
          }
        }
        catch(e){}
      }
      this.viewColorSet=viewColorSet;
      this.viewWidthSet=viewWidthSet;
    }
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
    lastPSEndId(){//array element id list
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastPSEndId;
      }else{
        return [];
      }
    },
    slideMin(){
      if(this.operated.type==='point'){
        return 4;
      }else {
        return 2;
      }
    },
    mapHiddenElements(){
      let map=new Map();
      this.hiddenElements.forEach(value=>map.set(value.id,true));
      return map;
    },
    boxOutStyle(){
      let posX=this.$store.state.operationBoardConfig.posX;
      let posY=this.$store.state.operationBoardConfig.posY;
      let top=0;
      let left=35;
      if(posX+50+315>=this.maxWidth){
        left=-315;
      }
      if(posY+430>=this.maxHeight){
        top=-260;
      }
      return{
        top: top+'px',
        left: left+'px'
      };
    },
    maxWidth(){
      return this.$store.state.mapConfig.browser.width;
    },
    maxHeight(){
      return this.$store.state.mapConfig.browser.height;
    },
    operatedColor(){
      if(this.operated.color){
        return 'background:#'+this.operated.color;
      }else {
        return 'background:#ff0000';
      }
    },
    style(){
      let posX=this.$store.state.operationBoardConfig.posX;
      let posY=this.$store.state.operationBoardConfig.posY;
      if(posX+50>=this.maxWidth){
        posX=this.maxWidth-65;
      }
      if(posY+170>=this.maxHeight){
        posY=this.maxHeight-170;
      }
      let x=posX+14;
      let y=posY+5;
      return 'left:'+x+'px;top:'+y+'px';
    },
    operated() {
      if(this.$store.state.mapConfig.operated.data===null){
        return  {
          "id":"",
          "type":"",
          "points":[{"x":0,"y":0}],
          "point":{"x":0,"y":0},
          "color":"000000",
          "width":"5",
          "child_relations":null,
          "father_relation":null,
          "child_nodes":null,
          "father_node":null,
          "details":[{"key":"名称","value":""}],
          "custom":null
        };
      }else {
        return this.$store.state.mapConfig.operated.data;
      }
    }
  },
  watch:{
    lastPSEndId:{
      handler(newValue){
        if(newValue.includes(this.operated.id)){//如果当前编辑的元素在被清除选中要素列表中则取消编辑
          this.$store.state.mapConfig.operated.id=-1;
          this.$store.state.mapConfig.operated.data=null;
          this.$store.state.operationBoardConfig.display=false;//关闭element operation board
        }
      }
    },
    operated:{
      handler(newValue,oldValue){
        if(this.$store.state.mapConfig.operated.data!==null){
          this.checkHasRule(this.$store.state.mapConfig.operated.data.custom.tmpId);
        }
        this.operatedCache=newValue;
        if(this.operatedBack!==null){//备份
          if(this.operatedBack.id!==newValue.id){//出现选择了不同的id则更新备份
            this.operatedBack=Lodash.cloneDeep(newValue);
          }
        }
        else{
          this.operatedBack=Lodash.cloneDeep(newValue);
        }
      },
      deep:true
    },
  }
}
</script>

<style scoped>
.keyTips{
  position: relative;
  top:-10px;
  left: 4px;
  font-size: 13px;
  font-weight: 100;
  width: 100%;
  height: 10px;
  display: block;
}
.transparent{
  opacity: 0.4;
}
.BananaElementOperationBoard{
  position: fixed;
  z-index: 560;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.panel{
  user-select: none;
  position: absolute;
  z-index: 550;
  left: 0px;
  width: 30px;
  height: auto;
  min-height: 70px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  background: rgba(255,255,255,1);
}
.ButtonBox{
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px 0px;
  cursor: pointer;
  transition: 0.3s;
  background: rgba(255,255,255,0.8);
}
.ButtonBox:hover{
  background: rgba(220,220,220,0.8);
}
.ButtonImg{
  width: 25px;
  height: 25px;
}
.BananaAttributeBoard{
  position: absolute;
  width: 300px;
  height: 420px;
  background: white;
  box-shadow: #b1b1b1 2px 2px 10px;
  border-radius: 5px;
  padding: 5px;
}
.headName{
  width: calc(100% - 10px);
  height: 35px;
  line-height: 34px;
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  border-radius: 5px;
  padding: 0px 5px;
  color: #5e5e5e;
  position: relative;
  z-index: 400;
}
.mouseDefault{
  cursor:no-drop
}
.mouseType1{
  cursor: default;
}
.boxSet{
  position: absolute;
  z-index: 550;
  top: 8px;
  width: calc(100% - 10px);
  height: 20px;
  display: flex;
  justify-content: flex-end;
}
.iAttItem{
  width: 100%;
  height: auto;
  padding: 0px 0px;
}
.leftProperty{
  width: 100%;
  font-size: 13px;
  font-weight: 200;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.rightValue{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.rightValue textarea{
  font-size: 13px;
  font-weight: 200;
  min-width: calc(90% - 17px);
  max-width: calc(90% - 17px);
  width: calc(90% - 17px);
  padding: 2px 4px;
  min-height: 19px;
  max-height: 300px;
  height: auto;
  margin: 4px 0px 0px 0px;
}
.keyToValue{
  width: 20px;
  height: 20px;
}
.icon15{
  width: 20px;
  height: 20px;
  margin: 0px 2px;
}
.closeButton{
  width: 20px;
  height: 20px;
  margin: 0px 12px 0px 2px;
}
.boxOut{
  position: fixed;
  z-index: 550;
  width: 310px;
  height: 420px;
  box-shadow: #b1b1b1 2px 2px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 6px;
}
.item{
  width: calc(100% - 10px);
  height: auto;
  background: #ffffff;
  padding: 5px 5px 0px 5px;
  margin: 0px;
}
.iTitle{
  width: 100%;
  height: 30px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
}
.iTitleExp{
  width: 100%;
  height: 22px;
  font-size: 13px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-weight: 100;
}
.iStyContent{
  width: 100%;
  height: auto;
}
.iStyP{
  width: 100%;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.iStyName{
  font-weight: 400;
  font-size: 14px;
}
.iStyView{
  width: 15px;
  height: 15px;
  background: red;
  margin: 0px 60px 0px 20px;
}
.iStyWidth{
  margin: 0px 50px 0px 20px;
  font-size: 14px;
  font-weight: 400;
}
.iStyInput{
  margin: 0px 0px 0px 20px;
  height: 20px!important;
}
.iStyColors{
  width: 280px;
  height: 46px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px 0px 5px 0px;
}
.iStyColor{
  width: 15px;
  height: 15px;
  margin: 3px;
}
.iStySlide{
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.iAttContent{
  width: 100%;
  height: auto;
}
</style>
