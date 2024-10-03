<template>
  <div class="groupLayersBox" ref="layerSeparate">
    <div class="eyebrow" ref="eyebrow">
      <div class="eyebrowLeft" @mousedown.stop="grabLayerStart($event)" @mouseup="grabLayerEnd($event)">
        <div class="previewEyeL">
          <add-new-group v-show="layer.id!==pickLayerResponse.id"/>
          <sun-active v-show="layer.id===pickLayerResponse.id"/>
        </div>
        <div class="groupLayerNameBox">
          <span contenteditable="false" class="groupLayerName" v-text="groupLayerHeadText" :title="'layer'+layer.id+' count'+(layer.structure.length-2)"/>
        </div>
      </div>
      <div class="eyebrowRight" @click.stop="switchLayerActions()" @mousedown.stop="playSoundEffect('confirm_1')">
        <more custom="cursor:pointer;transform:translate(3px,1px)"/>
      </div>
      <div class="layerMoreActionsClose" @contextmenu.prevent="void 1" @click.stop="switchLayerActions()" @mousedown.stop="playSoundEffect('unconfirm_1')" v-show="layerActionsOpen"/>
      <div class="layerMoreActions" v-show="layerActionsOpen">
        <div class="layerMoreAction" title="展开或收起此分组" @click.stop="switchAllExpand()" @mousedown.stop="playSoundEffect('confirm_1')">
          <span v-show="!allExpand">展开</span><span v-show="allExpand">收起</span>所有分组
        </div>
        <div class="layerMoreAction" title="删除图层，并且删除其中的元素" @click.stop="deleteLayerAndElement()" @mousedown.stop="playSoundEffect('confirm_1')">
          删除图层与元素
        </div>
        <div class="layerMoreAction" title="点击打开图层模板设置" @click="openTemplate()" @mousedown.stop="playSoundEffect('confirm_1')">
          设置模板
        </div>
        <div class="layerMoreAction" title="重命名" @click="openRename()" @mousedown.stop="playSoundEffect('confirm_1')">
          重命名
        </div>
      </div>
    </div>
    <div class="content" ref="content">
      <orange-group-structure :layer="layer" :all-expand="allExpand"
                              :level="1" :route="layer.structure[0]"
                              :structure="layer.structure"
                              :rename-response="renameApprovalResult"
                              :adjust-item-order-response="adjustItemOrderResponse"
                              :pick-child-group-response="pickChildGroupResult"
                              :pick-layer-id="pickLayerResponse.id"
                              @renameRequest="renameRequestCheck"
                              @adjustItemOrderRequest="adjustItemOrderApproval"
                              @pickChildGroupRequest="pickChildGroupApproval">
      </orange-group-structure>
    </div>
    <div class="renameClose" @click.stop="closeRename()" @mousedown.stop="playSoundEffect('unconfirm_1')" v-if="renameShow"></div>
    <div class="renameY" v-if="renameShow">
      <div class="renameRow">
        *新的分组名称不能与同级别分组名称重复*
      </div>
      <input ref="rename" type="text" maxlength="20" @focus="onFocusMode()" @blur="noFocusMode()">
      <div class="renameRow">
        <button class="renameButton" @click.stop="closeRename()" @mousedown.stop="playSoundEffect('unconfirm_1')">取消</button>
        <button class="renameButton" @click.stop="groupRename()" @mousedown.stop="groupRenameSound()">确定</button>
      </div>
    </div>
    <pomelo-confirm
      :view="firmView"
      :plan="firmPlan"
      :message="firmMessage"
      @confirm="handleConfirm">
    </pomelo-confirm>
  </div>
</template>

<script>
import More from "./svgValidIcons/more";
import OrangeGroupStructure from "./OrangeGroupStructure";
import SunActive from "./svgValidIcons/sunActive";
import AddNewGroup from "./svgValidIcons/addNewGroup";
import PomeloConfirm from "./PomeloConfirm";
export default {
  name: "BananaGroupLayer",
  data(){
    return{
      tmpId:null,
      renameShow:false,
      groupLayerHeadText:'分组图层',
      layerActionsOpen:false,
      allExpand:true,
      renameApprovalResult:{
        agree:false,
        code:1,
        name:'',
      },
      pickChildGroupResult:{
        agree:false,
        code:null,
        route:'',
      },
      grabStartY:0,
      grabStartX:0,
      grabLayerState:false,
      grabLayerPosOffsetY:0,
      grabLayerPosOffsetX:0,
      grabLayerSeparate:false,//本图层是否脱离面板独立存在
      grabSeparateLeft:20,//拖动独立x轴的左侧条件
      grabSeparateRight:320,//拖动独立x轴的右侧条件
      moveObServe:null,
      firmView:false,//确认菜单
      firmPlan:{},
      firmMessage:'',
      tmpProof:null,
      editTpTaskId:null,//编辑模板任务id
    }
  },
  components:{AddNewGroup, SunActive,More,OrangeGroupStructure,PomeloConfirm},
  props:{
    layer:{
      type:Object,
      default:function (){
        return {}
      },
      required:true,
    },
    groupLayers:{
      type:Object,
      default:function (){
        return {}
      },
      required:true,
    },
    adjustOrderResponse:{
      type:Object,
      default:function (){
        return {
          agree:false,
          code:null,
          id:-1,
        }
      },
      required:false,
    },
    adjustItemOrderResponse:{
      type:Object,
      default:function (){
        return{
          agree:false,
          code:null,
          stage:null,
          pattern:null,
          elementA:-1,
          templateA:-1,
          elementB:-1,
          templateB:-1,
        }
      },
      required:false
    },
    pickLayerResponse:{
      type:Object,
      default:function (){
        return{
          agree:false,
          code:null,
          id:-1,
        }
      },
      required:false
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.$refs.eyebrow.addEventListener('mouseup',(ev)=>{
        if(ev.button!==0){
          return false;
        }
        if(this.adjustOrderResponse.id===-1){
          return false;
        }
        if(this.adjustOrderResponse.id!==this.layer.id){
          this.$store.state.serverData.socket.broadcastUpdateLayerOrder(this.layer.id,this.adjustOrderResponse.id,'up');
        }
      });
      this.$refs.content.addEventListener('mouseup',(ev)=>{
        if(ev.button!==0){
          return false;
        }
        if(this.adjustOrderResponse.id===-1){
          return false;
        }
        if(this.adjustOrderResponse.id!==this.layer.id){
          this.$store.state.serverData.socket.broadcastUpdateLayerOrder(this.layer.id,this.adjustOrderResponse.id,'down');
        }
      });
      this.tmpId=this.layer.structure[1].template.id;
      this.tmpProof=new this.$store.state.classList.tmpProof('chinese');
    },
    openTemplate(){//打开模板-顶层
      function isObj(value){return typeof value==='object' && !Array.isArray(value) && value!==null;}
      let code=this.$store.state.templateConfig.taskCode+=2;
      let stu1=this.layer.structure[1];
      let name = this.layer.structure[0];
      if(!isObj(stu1)){
        this.$store.commit('setCoLogMessage',{text:'此图层('+name+')结构异常，请联系管理员',from:'internal:BananaGroupLayer',type:'error'});
        return false;
      }
      if(!stu1.hasOwnProperty('template')){
        this.$store.commit('setCoLogMessage',{text:'此图层('+name+')缺失模板，请联系管理员',from:'internal:BananaGroupLayer',type:'error'});
        return false;
      }
      if(typeof stu1.template!=='object'){
        this.$store.commit('setCoLogMessage',{text:'此图层('+name+')模板异常，请联系管理员',from:'internal:BananaGroupLayer',type:'error'});
        return false;
      }
      let template=stu1.template;
      let product={
        template , name  , code
      };
      this.$store.commit('setCoTemplateEdit',product);
      this.$store.commit('setCoTemplateShow',true);
      this.editTpTaskId=code;
      this.switchLayerActions();
    },
    openRename(){
      this.renameShow=true;
      this.switchLayerActions();
    },
    closeRename(){
      this.renameShow=false;
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    groupRenameSound(){
      let clean=(inputString)=>{return inputString.replace(/⇉|\n/g, '').trim()};
      let newName=clean(this.$refs.rename.value);
      if(newName===''){
        this.playSoundEffect('unable_1');
        return false;
      }
      if(newName===this.layer.structure[0]){//与原名称一致
        this.playSoundEffect('unable_1');
        return false;
      }else{
        this.playSoundEffect('confirm_1');
      }
    },
    groupRename(){
      let clean=(inputString)=>{return inputString.replace(/⇉|\n/g, '').trim()};
      let newName=clean(this.$refs.rename.value);
      if(newName===''){
        this.$store.commit('setCoLogMessage',{text:'名称不能为空字符',from:'internal:BananaGroupLayer',type:'tip'});
        return false;
      }
      if(newName===this.layer.structure[0]){//与原名称一致
        this.$store.commit('setCoLogMessage',{text:'名称与原始名称一致',from:'internal:BananaGroupLayer',type:'tip'});
        return false;
      }else{
        let count=0;//重复次数
        for(let key in this.groupLayers){
          if(!Object.prototype.hasOwnProperty.call(this.groupLayers,key))continue;
          if(this.groupLayers[key].structure[0]===newName){count++;break;}
        }
        if(count<1){
          this.$store.state.serverData.socket.broadcastRenameLayer(this.layer.id,newName);
          this.$store.commit('setCoLogMessage',{text:'已重命名分组',from:'internal:BananaGroupLayer',type:'tip'});
          this.closeRename();
        }else{
          this.$store.commit('setCoLogMessage',{text:'同级别分组中不能存在同名分组',from:'internal:OrangeGroupStructure',type:'tip'});
        }
      }
    },
    randomNumber8() {
      const min = 10000000;
      const max = 99999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pickChildGroupApproval(data){
      this.pickChildGroupResult.agree=true;
      this.pickChildGroupResult.code+=1;
      this.pickChildGroupResult.route=data;
      this.pickLayer();
    },
    adjustItemOrderApproval(data){
      this.$emit('adjustItemOrderRequest',data);//转发申请到Layer层
    },
    pickFirstGroup(){
      this.pickChildGroupResult.agree=true;
      this.pickChildGroupResult.code+=1;
      this.pickChildGroupResult.route=this.layer.structure[0];
    },
    grabLayerStart(ev){//拖拽起步
      if(ev.button!==0){
        return false;
      }
      let correct={x:0,y:0};
      let targetName=ev.target.className;
      if(targetName==='groupLayerName'){
        correct.x=39;
        correct.y=15;
      }else if(targetName==='groupLayerNameBox'){
        correct.x=39;
        correct.y=11;
      }
      this.grabStartX=ev.x;
      this.grabStartY=ev.y;
      this.$refs.eyebrow.style.userSelect='none';
      this.$refs.eyebrow.style.zIndex='666';
      this.groupLayerHeadText='移动鼠标以拖拽';
      this.grabLayerPosOffsetY=ev.offsetY+correct.y;
      this.grabLayerPosOffsetX=ev.offsetX+correct.x;
      this.grabLayerState=true;
      this.grabLayerMoveObserve();
      this.pickLayer();
      this.pickFirstGroup();
    },
    pickLayer(){
      if(this.pickLayerResponse.id==this.layer.id){
        return false;
      }
      this.$emit('pickLayerRequest',{
        code:this.randomNumber8(),
        id:this.layer.id,
      });
    },
    grabLayerEnd(ev){//结束拖拽
      if(ev.button!==0){
        return false;
      }
      this.grabLayerPosOffsetY=0;
      this.grabLayerPosOffsetX=0;
      this.$refs.eyebrow.style.userSelect='auto';
      this.$refs.eyebrow.style.background='';
      this.$refs.eyebrow.style.zIndex='';
      this.groupLayerHeadText='分组图层';
    },
    grabLayerMoveObserve(){//拖拽移动监听与事件处理
      if(this.moveObServe===null){
        this.moveObServe=true;
        document.addEventListener('mousemove',(event)=>{
          if(this.grabLayerState){
            if(Math.abs(this.grabStartY-event.y)<=3 && Math.abs(this.grabStartX-event.x)<=3)return false;//仅当拖拽幅度大于3px时才进行拖拽事件
            if(this.adjustOrderResponse.id!==this.layer.id){
              this.$emit('adjustOrderRequest',{
                code:this.randomNumber8(),
                id:this.layer.id,
              });//申请调序
            }
            if(event.x<this.grabSeparateLeft || event.x>this.grabSeparateRight){
              this.groupLayerHeadText='拖到其他图层头部调整顺序';
              this.$refs.layerSeparate.style.position='fixed';
              this.$refs.layerSeparate.style.zIndex='666';
              this.$refs.layerSeparate.style.left=event.x-this.grabLayerPosOffsetX+'px';
              this.$refs.layerSeparate.style.top=event.y-this.grabLayerPosOffsetY+'px';
              this.$refs.layerSeparate.style.background='rgba(255,255,255,0.5)';
              this.$refs.layerSeparate.style.overflowY='auto';
              this.$refs.layerSeparate.style.maxHeight='80%';
              this.grabLayerSeparate=false;
            }else {
              this.groupLayerHeadText='拖到其他图层头部调整顺序';
              this.$refs.layerSeparate.style.pointerEvents='none';
              this.$refs.layerSeparate.style.position='fixed';
              this.$refs.layerSeparate.style.left='';
              this.$refs.layerSeparate.style.top=event.y-this.grabLayerPosOffsetY+'px';
              this.$refs.layerSeparate.style.background='rgba(255,255,255,0.5)';
              this.grabLayerSeparate=true;
            }
          }
        });
        document.addEventListener('mouseup',(event)=>{
          if(event.button!==0){
            return false;
          }
          if(this.grabLayerState){
            this.$emit('adjustOrderRequest',{
              code:this.randomNumber8(),
              id:-1,
            });//申请调序取消
            this.$refs.layerSeparate.style.pointerEvents='auto';
            if(this.grabLayerSeparate){
              this.groupLayerHeadText='分组图层';
              this.$refs.layerSeparate.style.position='relative';
              this.$refs.layerSeparate.style.zIndex='';
              this.$refs.eyebrow.style.zIndex='';
              this.$refs.layerSeparate.style.left='';
              this.$refs.layerSeparate.style.top='';
              this.$refs.layerSeparate.style.background='';
              this.$refs.layerSeparate.style.overflowY='';
              this.$refs.layerSeparate.style.maxHeight='';
              this.$refs.eyebrow.style.background='';
            }
            this.grabLayerState=false;
          }
        });
      }
    },
    renameRequestCheck(data){//回应重命名请求
      let newName=data.name;
      let approvalCode=data.code;
      let count=0;//重复次数
      for(let key in this.groupLayers){
        if(!Object.prototype.hasOwnProperty.call(this.groupLayers,key))continue;
        if(this.groupLayers[key].structure[0]===newName){count++;break;}
      }
      if(count<1){
        this.renameApprovalResult.code=approvalCode;
        this.renameApprovalResult.agree=true;
        this.renameApprovalResult.name=newName;
      }else {
        this.renameApprovalResult.code=approvalCode;
        this.renameApprovalResult.agree=false;
        this.renameApprovalResult.name=newName;
      }
    },
    switchLayerActions(){
      this.layerActionsOpen=!this.layerActionsOpen;
    },
    switchAllExpand(){
      this.allExpand=!this.allExpand;
      this.switchLayerActions();
    },
    handleConfirm(plan){//一些需要再次确认才能执行的操作
      if(!plan.state){//取消执行
        this.firmView=false;//关闭确认菜单
        return false;
      }
      this.firmView=false;//关闭确认菜单
      let method=plan.method;
      let value=plan.value;
      switch(method){
        case 'deleteLayerAndElement':{//删除此图层与其中的元素
          this.$store.state.serverData.socket.broadcastDeleteLayerAndMembers(this.layer.id);
          this.$store.commit('setCoTemplateNotUse');//需要用户重新选中其他图层
          break;
        }
      }
    },
    deleteLayerAndElement(){//删除此图层与其中的元素
      this.switchLayerActions();
      this.firmPlan={method:'deleteLayerAndElement',value:null};
      this.firmMessage='即将删除此图层及其包含的元素，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    playSoundEffect(name){
      this.$store.commit('setCoEffectsSound',name);
    },
  },
  computed:{
    taskEndCode(){
      return this.$store.state.templateConfig.taskEndCode;
    },
    resultCode(){
      return this.$store.state.templateConfig.resultCode;
    },
    resultTemplate(){
      return this.$store.state.templateConfig.resultTemplate;
    },
  },
  watch:{
    taskEndCode:{//模板编辑结束回执代码
      handler(newValue){
        if(newValue===this.editTpTaskId){//模板编辑任务回执
          if(this.resultCode===2){
            let newTemplate=this.resultTemplate;
            this.$store.state.serverData.socket.broadcastUpdateTemplateData(newTemplate);
            //删除了重复的检查tpCheck在BananaTemplateEdit的submitEdit阶段就已经进行了检查
          }
        }
      }
    },
    pickLayerResponse:{
      handler(newValue){
        if(newValue.id==this.layer.id){
          this.playSoundEffect('click_c');
          this.$refs.layerSeparate.classList.add('selectedLayer');
        }else {
          this.$refs.layerSeparate.classList.remove('selectedLayer');
          this.pickChildGroupResult.route='';
          this.pickChildGroupResult.code+=1;
        }
      },
      deep:true
    },
    adjustItemOrderResponse:{
      handler(newValue){
        let stage=newValue.stage;
        if(stage==='confirm'){
          let elementA=parseInt(newValue.elementA);
          let elementB=parseInt(newValue.elementB);
          let templateA=newValue.templateA;
          let templateB=newValue.templateB;
          let method=newValue.pattern;
          if(templateA===this.tmpId){//与本图层有关系
            this.$store.state.serverData.socket.broadcastAdjustElementOrder(elementA,elementB,templateA,templateB,method);
          }
        }
      },
      deep:true
    }
  }
}
</script>

<style scoped>
.selectedLayer{
  background: #f8f8f8;
  color: #4f4f4f;
  animation: selectedLayerAM 0.3s ease-in-out;
}
@keyframes selectedLayerAM {
  0%{
    transform: scale(1);
  }
  50%{
    transform: scale(0.95);
  }
  100%{
    transform: scale(1);
  }
}
.groupLayersBox{
  min-height: 100px;
  width: 250px;/*250px与拖拽计算点击位置绑定，不可修改*/
  font-size: 14px;
  font-weight: 400;
  padding: 10px 10px;
  /*border-bottom: 1px solid #f4f4f4;*/
  /*border-top: 1px solid #f4f4f4;*/
  position: relative;
}
.groupLayerNameBox{
  width: calc(100% - 30px);
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.groupLayerName{
  user-select: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  outline: none;
  cursor: default;
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
  top: 10px;
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
.content{
  width:100%;
  height: auto;
}
.eyebrow{
  user-select: none;
  width: 100%;
  height: 30px;
  display: flex;
  position: relative;
  top: 0px;
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
