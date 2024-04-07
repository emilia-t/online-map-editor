<template>
  <div ref="memberTeamOut" :class="eachLevelClass">
    <div class="memberTeamName" @click="pickChildGroupRequest()" @contextmenu.stop.prevent="contextmenuHeadOpen($event)" @mouseup="confirmItemJoinGroup($event)">
      <div class="memberTeamNameL">
        <div class="expandMoreL" @click.stop="expandGroup()" v-show="!groupExpand">
          <expand-more custom="transform:translate(0px,-1px) rotate(180deg);cursor:pointer;"></expand-more>
        </div>
        <div class="expandMoreL" @click.stop="expandGroup()" v-show="groupExpand">
          <expand-more custom="transform:translate(0px,2px);cursor:pointer;"></expand-more>
        </div>
        <span class="groupListName" v-text="structure[0]"></span>
      </div>
      <div class="memberTeamNameR" title="隐藏操作仅对您可见" v-show="hasElementMember">
        <div class="memberRightEyeA" @click.stop="hiddenAllElements()" v-show="!groupMemberAllHide">
          <eye-visible custom="cursor:pointer"></eye-visible>
        </div>
        <div class="memberRightEyeB" @click.stop="unHiddenAllElements()" v-show="groupMemberAllHide">
          <eye-not-visible custom="cursor:pointer"></eye-not-visible>
        </div>
      </div>
    </div>
    <div class="memberTeamBox" ref="memberTeamBox" :key="index" v-for="(item,index) in extractLatter()" v-show="groupExpand">
      <div class="memberTeamContent" v-if="!isArray(item)">
        <div class="memberKeyInfo" :title="getItemName(layer.members[item])"
             @mouseenter="expandOrderCase($event,layer.members[item].id)"
             @mouseleave="restoreOrderCase($event)"
             @mouseup="confirmOrderCase($event,layer.members[item].id)">
          <div class="memberLeft" @click="clickMemberEvent(layer.members[item])" @mousedown.stop="grabLayerStart($event,index,layer.members[item].id,layer.members[item].type)">
            <point :custom="'fill:#'+layer.members[item].color+';transform:translate(-2px,0px)'" v-if="layer.members[item].type==='point'"></point>
            <segment-line :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'" v-if="layer.members[item].type==='line'"></segment-line>
            <region :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'" v-if="layer.members[item].type==='area'"></region>
            <span class="memberName" v-text="getItemName(layer.members[item])"></span>
          </div>
          <div :ref="'memberRightEye'+layer.members[item].id">
            <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenUnhiddenElement(layer.members[item].id,layer.members[item].type)">
              <eye-visible custom="cursor:pointer"></eye-visible>
            </div>
            <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenUnhiddenElement(layer.members[item].id,layer.members[item].type)">
              <eye-not-visible custom="cursor:pointer"></eye-not-visible>
            </div>
          </div>
        </div>
        <div class="memberActivityInfo">
          <div class="memberPick" v-if="false">
            <span class="memberSpanA" v-text="'emilia-text'"></span><span>编辑形状中</span>
          </div>
          <div class="memberSelect" v-if="false">
            <span class="memberSpanA" v-text="'emilia-text'"></span><span>编辑属性中</span>
          </div>
        </div>
      </div>
      <orange-group-structure :layer="layer" :all-expand="allExpand"
                              :level="level+1" :route="route+'⇉'+item[0]"
                              :structure="item"
                              :rename-response="renameApprovalResult"
                              :adjust-item-order-response="adjustItemOrderResponse"
                              :pick-child-group-response="pickChildGroupResponse"
                              @renameRequest="renameApproval"
                              @adjustItemOrderRequest="adjustItemOrderApproval"
                              @pickChildGroupRequest="pickChildGroupRelay"
                              v-if="isArray(item)">
      </orange-group-structure>
    </div>
    <div class="memberMenuClose" @contextmenu.prevent="void 1" @click.stop="contextmenuHeadClose()" v-show="memberHeadMenu.show"></div>
    <div class="memberMenu" :style="headContextmenuPos" v-show="memberHeadMenu.show">
      <div class="menuListBox">
        <div class="menuList" @click="createGroupAtTop()">
          在顶部新建分组
        </div>
        <div class="menuList" @click="createGroupAtBottom()">
          在底部新建分组
        </div>
        <div class="menuList" title="按颜色分组会删除所有子分组" @click="groupByColorType('color')">
          按颜色重新分组
        </div>
        <div class="menuList" title="按类型分组会删除所有子分组" @click="groupByColorType('type')">
          按类型重新分组
        </div>
        <div class="menuList" title="删除此分组会同时删除组内元素" @click="deleteGroup()" v-if="this.level!==1">
          删除分组与元素
        </div>
        <div class="menuList" title="点击打开模板设置界面" @click="openTemplate()">
          设置模板
        </div>
        <div class="menuList" @click="openRename()">
          重命名
        </div>
      </div>
    </div>
    <div class="renameClose" @click.stop="closeRename()" v-if="renameShow"></div>
    <div class="renameY" v-if="renameShow">
      <div class="renameRow">
        *新的分组名称不能与同级别分组名称重复*
      </div>
      <input ref="rename" type="text" maxlength="20" @focus="onFocusMode()" @blur="noFocusMode()">
      <div class="renameRow">
        <button @click.stop="closeRename()">取消</button>
        <button @click.stop="groupRename()">确定</button>
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
import ExpandMore from "./svgValidIcons/expandMore";
import EyeVisible from "./svgValidIcons/eyeVisible";
import EyeNotVisible from "./svgValidIcons/eyeNotVisible";
import OrangeGroupStructure from "./OrangeGroupStructure";
import Region from "./svgValidIcons/region";
import SegmentLine from "./svgValidIcons/segmentLine";
import Point from "./svgValidIcons/point";
import {mapState} from "vuex";
import PomeloConfirm from "./PomeloConfirm";
export default {
  name: "OrangeGroupStructure",
  components:{
    OrangeGroupStructure,EyeVisible,EyeNotVisible,ExpandMore,Region,
    SegmentLine,Point,PomeloConfirm,
  },
  data(){
    return {
      renameShow:false,
      grabStartY:0,//拖拽开始位置
      groupExpand:true,
      renameApprovalTemplate:{//重命名审批模板
        code:1,
        name:'',
      },
      renameApprovalResult:{
        agree:false,
        code:1,
        name:'',
      },
      memberHeadMenu:{
        x:0,
        y:0,
        show:false,
      },
      oldGroupName:'',
      grabItemPosOffsetY:0,
      grabItemPosOffsetX:0,
      grabItemState:false,
      grabItemId:-1,
      grabItemType:null,
      grabItemSeparate:false,//本图层是否脱离面板独立存在
      grabSeparateLeft:20,//拖动独立x轴的左侧条件
      grabSeparateRight:320,//拖动独立x轴的右侧条件
      grabIndex:-1,
      moveObServe:null,
      editTpTaskId:null,//编辑模板任务id
      firmView:false,//确认菜单
      firmPlan:{},
      firmMessage:'',
    }
  },
  props:{
    pickLayerId:{
      type:Number,
      default:-1,
      required:false
    },
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
    route:{
      type:String,
      default:'',
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
    renameResponse:{
      type:Object,
      default:function (){
        return{
          agree:false,
          code:1,
          name:'',
        }
      },
      required:false
    },
    adjustItemOrderResponse:{
      type:Object,
      default:function (){
        return{
          agree:false,
          code:null,
          stage:null,
          type:null,
          pattern:null,
          idA:-1,
          layerA:-1,
          idB:-1,
          layerB:-1,
        }
      },
      required:false
    },
    pickChildGroupResponse:{
      type:Object,
      default:function (){
        return {
          agree:false,
          code:null,
          route:''
        }
      },
      required:true
    }
  },
  mounted() {

  },
  created() {
    this.unwatch=this.$watch('pickLayerId',(newValue)=>{//设置第一个分组图层的行为
      if(newValue==this.layer.id){
        this.$refs.memberTeamOut.classList.add('memberTeamBoxPickA');
        let stu1=this.structure[1];
        if(typeof stu1==='object' && !Array.isArray(stu1)){
          if(Object.prototype.hasOwnProperty.call(stu1,'template')){
            if(this.tpCheck(stu1.template)){//通过安全检查后应用此模板
              this.$store.commit('setCoTemplateUse',this.structure[1].template);
            }else {
              this.$store.commit('setCoLogMessage',{text:'警告！当前选中分组存在异常，无法应用模板',from:'internal:OrangeGroupStructure',type:'warn'});
            }
          }
        }
      }
      this.unwatch();//仅执行一次
    });
  },
  methods:{
    openRename(){
      this.renameShow=true;
      this.memberHeadMenu.show=false;
    },
    closeRename(){
      this.renameShow=false;
    },
    reuseTemplate(){//用于更新当前使用的模板(与store同步)
      let stu1=this.structure[1];
      if(typeof stu1==='object' && !Array.isArray(stu1)){
        if(Object.prototype.hasOwnProperty.call(stu1,'template')){
          if(this.tpCheck(stu1.template)){//通过安全检查后应用此模板
            this.$store.commit('setCoTemplateUse',this.structure[1].template);
          }else {
            this.$store.commit('setCoLogMessage',{text:'警告！当前选中分组存在异常，无法应用模板',from:'internal:OrangeGroupStructure',type:'warn'});
          }
        }
      }
    },
    openTemplate(){
      function isObj(value){return typeof value==='object' && !Array.isArray(value) && value!==null;}
      let code=this.$store.state.templateConfig.taskCode+=2;
      let stu1=this.structure[1];
      let name = this.structure[0];
      if(!isObj(stu1)){
        this.resetStructure1();
        this.$store.commit('setCoLogMessage',{text:'此分组模板已重置，请稍后重试',from:'internal:OrangeGroupStructure',type:'warn'});
        return false;
      }
      if(!stu1.hasOwnProperty('template')){
        this.resetStructure1();
        this.$store.commit('setCoLogMessage',{text:'此分组模板已重置，请稍后重试',from:'internal:OrangeGroupStructure',type:'warn'});
        return false;
      }
      if(typeof stu1.template!=='object'){
        this.resetStructure1();
        this.$store.commit('setCoLogMessage',{text:'此分组模板已重置，请稍后重试',from:'internal:OrangeGroupStructure',type:'warn'});
        return false;
      }
      let template=stu1.template;
      let product={
        template , name  , code
      };
      this.$store.commit('setCoTemplateEdit',product);
      this.$store.commit('setCoTemplateShow',true);
      this.editTpTaskId=code;
      this.memberHeadMenu.show=false;
    },
    resetStructure1(){
      let old=this.structure;
      if(old.length>=2){
        if(typeof old[1] === 'number'){//如果第二个是元素id则插入
          old.splice(1,0,{template:null});
          let newStructure=this.structureChangeData(this.layer.structure,this.route.split('⇉'),old);
          this.$store.state.serverData.socket.broadcastUpdateLayerData({id:this.layer.id, structure:newStructure});
        }else if(Array.isArray(old[1])){//如果第二个元素是另一个分组则插入
          old.splice(1,0,{template:null});
          let newStructure=this.structureChangeData(this.layer.structure,this.route.split('⇉'),old);
          this.$store.state.serverData.socket.broadcastUpdateLayerData({id:this.layer.id, structure:newStructure});
        }else {//其他情况下更换第二个元素
          old[1]={template:null};
          let newStructure=this.structureChangeData(this.layer.structure,this.route.split('⇉'),old);
          this.$store.state.serverData.socket.broadcastUpdateLayerData({id:this.layer.id, structure:newStructure});
        }
      }else if(old.length===1){//结构缺失第二个参数
        old.push({template:null});
        let newStructure=this.structureChangeData(this.layer.structure,this.route.split('⇉'),old);
        this.$store.state.serverData.socket.broadcastUpdateLayerData({id:this.layer.id, structure:newStructure});
      }else {//空的数组
        this.$store.commit('setCoLogMessage',{text:'存在异常为空的分组',from:'internal:OrangeGroupStructure',type:'warn'});
        return false;
      }
    },
    alertTip(text){
      this.$store.commit('setCoLogMessage',{text:text,from:'internal:OrangeGroupStructure',type:'warn'});
    },
    groupByColorType(select){
      function dimensionReduce(arr){//降维数组
        return arr.reduce((result,value)=>{
          if (Array.isArray(value)){
            result.push(...dimensionReduce(value.slice(2)));
          }else{
            result.push(value);
          }
          return result;
        },[]);
      }
      function convertAndSort(groupObj) {//将图层对象转化为数组结构的图层并排序
        let colorArray=Object.entries(groupObj).map(([key,value])=>[key,{template:null},...value]);//先
        colorArray.sort((former,latter)=>{return latter.length-former.length});//前者大于后者则排在前
        return colorArray;
      }
      let oldStructure=JSON.parse(JSON.stringify(this.structure));
      let structure=dimensionReduce(oldStructure);
      let Len=structure.length;
      let groupObj={};//{"color[00ff00]":[id,id,...]} || {"type[point]":[id,id,...]}
      let newStructure=[];
      for(let i=2;i<Len;i++){
        let element=this.layer.members[structure[i]];
        let Name='all';
        if(select==='color'){
          Name='Color'+element.color;
        }else if(select==='type'){
          Name=element.type;
        }
        if(!groupObj.hasOwnProperty(Name)){
          groupObj[Name]=[];
          groupObj[Name].push(structure[i]);
        }else {
          groupObj[Name].push(structure[i]);
        }
      }
      newStructure=convertAndSort(groupObj);
      newStructure.unshift(oldStructure[0],oldStructure[1]);
      if(this.level===1){//在根节点操作则不用附加旧数据
        this.$store.state.serverData.socket.broadcastUpdateLayerData(
          {
            id:this.layer.id,
            structure:newStructure,
          }
        );
      }else {//附加旧数据
        newStructure=this.structureChangeData(this.layer.structure,this.route.split('⇉'),newStructure);
        this.$store.state.serverData.socket.broadcastUpdateLayerData(
          {
            id:this.layer.id,
            structure:newStructure,
          }
        );
      }
      this.memberHeadMenu.show=false;
    },
    pickChildGroupRequest(){
      this.$emit('pickChildGroupRequest',this.route);
    },
    pickChildGroupRelay(data){//转发
      this.$emit('pickChildGroupRequest',data);
    },
    expandOrderCase(ev,id){
      if(ev.target.className!=='memberKeyInfo'){
        return false;
      }
      if(this.adjustItemOrderResponse.idA!==-1 && this.adjustItemOrderResponse.idA!==id){
        ev.target.style.height='80px';
      }
    },
    restoreOrderCase(ev){
      if(ev.target.className!=='memberKeyInfo'){
        return false;
      }
      ev.target.style.height='25px';
    },
    randomNumber8() {
      const min = 10000000;
      const max = 99999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    confirmItemJoinGroup(ev){
      if(ev.button!==0){
        return false;
      }
      if(this.adjustItemOrderResponse.idA!==-1){
        let route=this.route;
        this.$emit('adjustItemOrderRequest',{
          code:this.randomNumber8(),
          stage:'confirm',
          pattern:'join',
          type:this.adjustItemOrderResponse.type,
          idA:this.adjustItemOrderResponse.idA,
          layerA:this.adjustItemOrderResponse.layerA,
          idB:route,
          layerB:this.layer.id,
        });
      }
    },
    confirmOrderCase(ev,id){
      if(this.adjustItemOrderResponse.idA!==-1 && this.adjustItemOrderResponse.idA!==id){
        let offsetY=ev.offsetY;
        if(offsetY<40){
          this.$emit('adjustItemOrderRequest',{
            code:this.randomNumber8(),
            stage:'confirm',
            pattern:'up',
            type:this.adjustItemOrderResponse.type,
            idA:this.adjustItemOrderResponse.idA,
            layerA:this.adjustItemOrderResponse.layerA,
            idB:id,
            layerB:this.layer.id,
          });
        }else if(offsetY>=40 && offsetY<=80){
          this.$emit('adjustItemOrderRequest',{
            code:this.randomNumber8(),
            stage:'confirm',
            pattern:'down',
            type:this.adjustItemOrderResponse.type,
            idA:this.adjustItemOrderResponse.idA,
            layerA:this.adjustItemOrderResponse.layerA,
            idB:id,
            layerB:this.layer.id,
          });
        }
      }
    },
    adjustItemOrderApproval(data){
      this.$emit('adjustItemOrderRequest',data);//转发申请
    },
    grabLayerStart(ev,index,id,type){//拖拽起步
      if(ev.button!==0){
        return false;
      }
      this.grabStartY=ev.y;
      let correct={x:0,y:0};
      let targetName=ev.target.nodeName;
      if(targetName==='SPAN'){
        correct.x=30;
        correct.y=3;
      }else if(targetName==='DIV'){
        correct.x=15;
        correct.y=0;
      }else{
        correct.x=14;
        correct.y=3;
      }
      this.grabIndex=index;
      this.grabItemId=id;
      this.grabItemType=type;
      this.$refs.memberTeamBox[index].style.userSelect='none';
      this.$refs.memberTeamBox[index].style.background='white';
      this.$refs.memberTeamBox[index].style.zIndex='666';
      this.grabItemPosOffsetY=ev.offsetY+correct.y;
      this.grabItemPosOffsetX=ev.offsetX+correct.x;
      this.grabItemState=true;
      this.grabItemMoveObserve();
    },
    grabItemMoveObserve(){//拖拽移动监听与事件处理
      if(this.moveObServe===null){
        this.moveObServe=true;
        document.addEventListener('mousemove',(event)=>{
          if(Math.abs(this.grabStartY-event.y)<=3)return false;//仅当拖拽幅度大于3px时才进行拖拽事件
          if(this.grabItemState){
            if(this.adjustItemOrderResponse.idA!==this.grabItemId){
              this.$emit('adjustItemOrderRequest',{
                code:this.randomNumber8(),
                stage:'ready',
                type:this.grabItemType,
                idA:this.grabItemId,
                layerA:this.layer.id,
              });//申请调序
            }
            if(event.x<this.grabSeparateLeft || event.x>this.grabSeparateRight){//拖出图层面板
              this.$refs.memberTeamBox[this.grabIndex].style.pointerEvents='none';
              this.$refs.memberTeamBox[this.grabIndex].style.position='fixed';
              this.$refs.memberTeamBox[this.grabIndex].style.zIndex='666';
              this.$refs.memberTeamBox[this.grabIndex].style.left=event.x-this.grabItemPosOffsetX+'px';
              this.$refs.memberTeamBox[this.grabIndex].style.top=event.y-this.grabItemPosOffsetY+'px';
              this.$refs.memberTeamBox[this.grabIndex].style.background='white';
              this.grabItemSeparate=false;
            }else {
              this.$refs.memberTeamBox[this.grabIndex].style.pointerEvents='none';
              this.$refs.memberTeamBox[this.grabIndex].style.position='fixed';
              this.$refs.memberTeamBox[this.grabIndex].style.left='';
              this.$refs.memberTeamBox[this.grabIndex].style.top=event.y-this.grabItemPosOffsetY+'px';
              this.$refs.memberTeamBox[this.grabIndex].style.background='white';
              this.grabItemSeparate=true;
            }
          }
        });
        document.addEventListener('mouseup',(event)=>{
          if(event.button!==0){
            return false;
          }
          if(this.grabItemState){
            this.$emit('adjustItemOrderRequest',{
              code:this.randomNumber8(),
              stage:'cancel',
            });//申请调序取消
            this.$refs.memberTeamBox[this.grabIndex].style.pointerEvents='auto';
            if(this.grabItemSeparate){
              this.$refs.memberTeamBox[this.grabIndex].style.position='relative';
              this.$refs.memberTeamBox[this.grabIndex].style.zIndex='';
              this.$refs.memberTeamBox[this.grabIndex].style.left='';
              this.$refs.memberTeamBox[this.grabIndex].style.top='';
              this.$refs.memberTeamBox[this.grabIndex].style.background='';
            }else{
              this.grabItemPosOffsetX=0;
              this.grabItemPosOffsetY=0;
              this.$refs.memberTeamBox[this.grabIndex].style.userSelect='auto';
              this.$refs.memberTeamBox[this.grabIndex].style.background=null;
              this.$refs.memberTeamBox[this.grabIndex].style.zIndex='';
            }
            this.grabItemState=false;
            this.grabIndex=-1;
            this.grabItemId=-1;
            this.grabItemType=null;
          }
        });
      }
    },
    renameApproval(data){//回应重命名请求
      let length=this.structure.length;
      let newName=data.name;
      let approvalCode=data.code;
      let lock=true;//默认通过
      for(let i=1;i<length;i++){
        if(Array.isArray(this.structure[i])){
          if(this.structure[i][0]===newName){
            lock=false;
          }
        }
      }
      if(lock){
        this.renameApprovalResult.code=approvalCode;
        this.renameApprovalResult.agree=true;
        this.renameApprovalResult.name=newName;
      }else {
        this.renameApprovalResult.code=approvalCode;
        this.renameApprovalResult.agree=false;
        this.renameApprovalResult.name=newName;
      }
    },
    groupNameRenameRequest(template){//检查名称是否重复
      this.$emit('renameRequest',template);
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    groupRename(){
      function clean(inputString){return inputString.replace(/⇉|\n/g, '').trim();}
      let newName=clean(this.$refs.rename.value);
      if(newName===''){
        this.$store.commit('setCoLogMessage',{text:'名称不能为空字符',from:'internal:OrangeGroupStructure',type:'tip'});
        return false;
      }
      if(newName===this.structure[0]){//与原名称一致
        this.$store.commit('setCoLogMessage',{text:'名称与原始名称一致',from:'internal:OrangeGroupStructure',type:'tip'});
        return false;
      }else{
        this.renameApprovalTemplate.code=this.randomNumber8();
        this.renameApprovalTemplate.name=newName;
        this.groupNameRenameRequest(this.renameApprovalTemplate);
      }
    },
    groupNameIllegal(value){//检查分组名称是否含有非法字符
        return value.includes('⇉');
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
        case 'deleteGroup':{//删除子分组及其元素(包含子分组的子分组)
          let routeArr=this.route.split('⇉');
          let StructureMembers=this.structureRemoveByGroup(this.layer.structure,routeArr);
          let newStructure=StructureMembers.structure;
          let removeMembers=StructureMembers.members;//[1,2,3,...]
          let newMembers=this.removeMembersByArray(removeMembers);
          newStructure=this.removeUndefined(newStructure);//删除子分组结构同时删除结构内的成员
          let groupLayerId=this.layer.id;
          this.$store.state.serverData.socket.broadcastUpdateLayerData({id:groupLayerId,members:newMembers,structure:newStructure});
          this.$store.state.serverData.socket.broadcastBatchDeleteElement(removeMembers);
          break;
        }
      }
    },
    deleteGroup(){//删除子分组及其元素(包含子分组的子分组)
      this.memberHeadMenu.show=false;//关闭右键菜单
      this.firmPlan={method:'deleteGroup',value:null};
      this.firmMessage='即将删除此分组及其包含的元素，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    getFormattedDate() {//获取模板时间
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date();
      const day = days[date.getDay()];
      const month = months[date.getMonth()];
      const dayOfMonth = date.getDate();
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const timeZoneOffset = -date.getTimezoneOffset();// 获取时区偏移量，转换为小时
      const offsetSign = timeZoneOffset >= 0 ? '+' : '-';
      const offsetHours = String(Math.floor(Math.abs(timeZoneOffset) / 60)).padStart(2, '0');
      const offsetMinutes = String(Math.abs(timeZoneOffset) % 60).padStart(2, '0');
      const timeZone = `GMT${offsetSign}${offsetHours}${offsetMinutes}`;
      return `${day} ${month} ${dayOfMonth.toString().padStart(2, '0')} ${year} ${hours}:${minutes}:${seconds} ${timeZone}`;
    },
    createTemplateId(){//创建模板ID
      const validChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const length = Math.floor(Math.random() * 7) + 8;//先生成一个[0,7)的随机数，然后加上8
      let array = new Uint8Array(length);//输出长度为随机的8-14位
      window.crypto.getRandomValues(array);
      let result = '';
      array.forEach((byte) => {
        result += validChars.charAt(byte % validChars.length);
      });
      return result;
    },
    createGroupAtTop(){//在此分组顶部新增子分组
      let groupLayerId=this.layer.id;
      let newGroupName='G'+this.randomNumber8();
      let time=this.getFormattedDate();
      let ID=this.createTemplateId();
      let creator=this.userName+'('+this.userEmail+')';
      let newGroup=[
        newGroupName,
        {
          template:{//初始给定空模板对象
            id:ID,
            name:'template',
            creator,
            modify:time,
            locked:false,
            explain:'none',
            typeRule:{point:true, line:true, area:true, curve:true},
            detailsRule:[{set:false, name:'name', default:'unknown', type:'text', length:100, empty:true}],
            colorRule:{basis:'', type:'', condition:[]},
            widthRule:{basis:'', type:'', condition:[]
            }
          }
        }
      ];
      let routeArr=this.route.split('⇉');
      let newStructure=this.structureUnshiftByItem(this.layer.structure,routeArr,newGroup);
      this.$store.state.serverData.socket.broadcastUpdateLayerData(
        {
          id:groupLayerId,
          structure:newStructure,
        }
      );
      this.memberHeadMenu.show=false;
    },
    createGroupAtBottom(){//在此分组底部新增子分组
      let groupLayerId=this.layer.id;
      let newGroupName='G'+this.randomNumber8();
      let time=this.getFormattedDate();
      let ID=this.createTemplateId();
      let creator=this.userName+'('+this.userEmail+')';
      let newGroup=[
        newGroupName,
        {
          template:{//初始给定空模板对象
            id:ID,
            name:'template',
            creator,
            modify:time,
            locked:false,
            explain:'none',
            typeRule:{point:true, line:true, area:true, curve:true},
            detailsRule:[{set:false, name:'name', default:'unknown', type:'text', length:100, empty:true}],
            colorRule:{basis:'', type:'', condition:[]},
            widthRule:{basis:'', type:'', condition:[]
            }
          }
        }
      ];
      let routeArr=this.route.split('⇉');
      let newStructure=this.structureInsertByItem(this.layer.structure,routeArr,newGroup);
      this.$store.state.serverData.socket.broadcastUpdateLayerData(
        {
          id:groupLayerId,
          structure:newStructure,
        }
      );
      this.memberHeadMenu.show=false;
    },
    /**依据成员数组删除多个成员
     * @return false|mixed
     * @param members
     */
    removeMembersByArray(members){
      const typeMapping={point:1,line:2,area:3,curve:4};
      let newMembers=Object.keys(this.layer.members).reduce((result,key)=>{
        result[key]=typeMapping[this.layer.members[key].type];
        return result;
      },{});
      let Len=members.length;
      for(let i=0;i<Len;i++){
        delete newMembers[members[i]];
      }
      return newMembers;
    },
    /**依据图层路由和图层结构插入值
     * @return false|mixed
     * @param structure | array
     * @param route | array
     * @param value | int
     */
    structureInsertByItem(structure,route,value){
      if (route.length===1){//路由的尽头
        structure.push(value);
        return structure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳
        let Len=structure.length;
        for (let i=0;i<Len;i++){//遍历此层结构数组
          if(Array.isArray(structure[i])){//查询此层子层
            if (structure[i][0]===nextRoute[0]){//此层子层的名称对应下一跳
              structure[i]=this.structureInsertByItem(structure[i],nextRoute,value);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return structure;
    },
    structureUnshiftByItem(structure,route,value){
      if (route.length===1){//路由的尽头
        structure.splice(2,0,value);
        return structure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳
        let Len=structure.length;
        for (let i=0;i<Len;i++){//遍历此层结构数组
          if(Array.isArray(structure[i])){//查询此层子层
            if (structure[i][0]===nextRoute[0]){//此层子层的名称对应下一跳
              structure[i]=this.structureUnshiftByItem(structure[i],nextRoute,value);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return structure;
    },
    /**移除图层的某个成员
     * @return false|mixed
     */
    removeLayerMember(){
      let layerId=this.layer.id;
      let targetId=this.memberItemMenu.target.id;
      const typeMapping={point:1,line:2,area:3,curve:4};
      let oldStructure=JSON.parse(JSON.stringify(this.layer.structure));
      let newMembers=Object.keys(this.layer.members).reduce((result,key)=>{
        result[key]=typeMapping[this.layer.members[key].type];
        return result;
      },{});
      delete newMembers[targetId];
      let route=this.route;
      let routeArr=route.split('⇉');
      routeArr=routeArr.filter((item)=>{return item!==''});
      let newStructure=this.structureRemoveByItem(oldStructure,routeArr,targetId);
      this.$store.state.serverData.socket.broadcastUpdateLayerData({
        id:layerId,
        members:newMembers,
        structure:newStructure
      });
      this.contextmenuItemClose();
    },
    /**依据图层路由和图层结构删除值
     * @return false|mixed
     * @param structure | array
     * @param route | array
     * @param value | int
     */
    structureRemoveByItem(structure,route,value){
      if (route.length===1){//路由的尽头
        structure.remove(value);
        return structure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳
        let Len=structure.length;
        for (let i=0;i<Len;i++){//遍历此层结构数组
          if(Array.isArray(structure[i])){//查询此层子层
            if (structure[i][0]===nextRoute[0]){//此层子层的名称对应下一跳
              structure[i]=this.structureRemoveByItem(structure[i],nextRoute,value);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return structure;
    },
    /**依据图层路由和图层结构更改图层数据
     * @return false|mixed
     * @param structure | array
     * @param route | array
     * @param newStructure | array
     */
    structureChangeData(structure,route,newStructure){
      if (route.length===1){//路由的尽头
        return newStructure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳
        let Len=structure.length;
        for (let i=0;i<Len;i++){//遍历此层结构数组
          if(Array.isArray(structure[i])){//查询此层子层
            if (structure[i][0]===nextRoute[0]){//此层子层的名称对应下一跳
              structure[i]=this.structureChangeData(structure[i],nextRoute,newStructure);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return structure;
    },
    /**依据图层路由和图层结构删除子分组并且返回被删除的子分组的成员以及新的图层结构
     * @return false|mixed
     * @param structure | array
     * @param route | array
     */
    structureRemoveByGroup(structure,route){
      var members=[];
      if(route.length===1){//到达路由的尽头
        members=this.getMembersByStructure(structure);
        structure=undefined;//删除此分组结构
        return structure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳名称
        let Len=structure.length;//当前层级分组的数组长度
        for (let i=0;i<Len;i++){//遍历此层分组的成员
          if(Array.isArray(structure[i])){//查询此层分组的子分组
            if (structure[i][0]===nextRoute[0]){//此子分组的名称与下一跳名称一致
              members=this.getMembersByStructure(structure[i]);
              structure[i]=this.structureRemoveByGroup(structure[i],nextRoute);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return {
        structure,
        members
      };
    },
    /**获取图层结构内的所有成员ID
     * @return false|mixed
     * @param structure | array
     */
    getMembersByStructure(structure){
      function extractNumbers(arr) {
        return arr.reduce((result, value) => {
          if (Array.isArray(value)) {
            result.push(...extractNumbers(value));
          } else if (typeof value === 'number') {
            result.push(value);
          }
          return result;
        }, []);
      }
      return extractNumbers(JSON.parse(JSON.stringify(structure)));
    },
    /**依据图层路由和图层结构更改分组名
     * @return false|mixed
     * @param structure | array
     * @param route | array
     * @param newName | string
     */
    structureRenameByGroup(structure,route,newName){
      if(route.length===1){//路由的尽头
        structure[0]=newName;
        return structure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳
        for (let i=0;i<structure.length;i++){//遍历此层结构数组
          if(Array.isArray(structure[i])){//查询此层子层
            if (structure[i][0]===nextRoute[0]){//此层子层的名称对应下一跳
              structure[i]=this.structureRenameByGroup(structure[i],nextRoute,newName);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return structure;
    },
    removeUndefined(arr){
      return arr.reduce((acc,val)=>{
        if(val!==undefined){
          if(Array.isArray(val)){
            acc.push(this.removeUndefined(val));
          }else{
            acc.push(val);
          }
        }
        return acc;
      },[]);
    },
    contextmenuHeadOpen(ev){//头部右键菜单
      this.memberHeadMenu.show=true;
      this.memberHeadMenu.x=ev.x;
      if(ev.y>=window.innerHeight-190){
        this.memberHeadMenu.y=window.innerHeight-190;
      }else {
        this.memberHeadMenu.y=ev.y-15;
      }
    },
    contextmenuHeadClose(){
      this.memberHeadMenu.show=false;
    },
    expandGroup(){//展开或收起分组
      this.groupExpand=!this.groupExpand;
    },
    isArray(any){
      let isArray=Array.isArray(any);
      if(isArray===true){
        return any.length !== 0;
      }
      return false;
    },
    extractLatter(){//提取除第1-2位,并去除未定义的引用id
      let member=this.structure.slice(2);
      let refMember=[];
      let length=member.length;
      for(let i=0;i<length;i++){
        if(typeof member[i]==='number'){
          if(this.layer.members.hasOwnProperty(member[i])){
            refMember.push(member[i]);
          }
        }
        if(Array.isArray(member[i])){
          if(member[i].length>=2){
            refMember.push(member[i])
          }
        }
      }
      return refMember;
    },
    extractNumber(){//提取除第1-2位外过滤子分组,并去除未定义的引用id
      let latter=this.structure.slice(2);
      let refLatter=[];
      let length=latter.length;
      for(let i=0;i<length;i++){
        if(typeof latter[i]==='number'){
          if(this.layer.members.hasOwnProperty(latter[i])){
            refLatter.push(latter[i]);
          }
        }
      }
      refLatter.filter(
        item=>{
          return !Array.isArray(item);
        }
      );
      return refLatter;
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
    clickMemberEvent(element){
      this.locateToElement(element);
      this.pickChildGroupRequest();
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
      let moveY=screenCenter.y-elementPosition.y;
      this.$store.state.mapConfig.A1.x-=moveX;
      this.$store.state.mapConfig.A1.y+=moveY;
      this.$store.state.baseMapConfig.baseMap.view.offsetX+=moveX;
      this.$store.state.baseMapConfig.baseMap.view.offsetY+=moveY;
      this.$store.state.baseMapConfig.baseMap.render();
      this.$store.state.cameraConfig.mixCanvasFlash=!this.$store.state.cameraConfig.mixCanvasFlash;
      this.allReinitialize();
      this.setElementFlicker(element,2000);
    },
    setElementFlicker(element,duration){
      let product={
        svgType:element.type,
        svgData:element,
        duration,
      };
      this.$store.commit('setCoEffectsSvgFlicker',product);
    },
    allReinitialize(){//触发全局定位重置
      this.$root.sendInstruct('allReinitialize');
    },
    hiddenUnhiddenElement(id,type){//隐藏某元素
      if(!this.inHiddenElements(id)){
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
      let joinArray=[];
      for(let i=0;i<length;i++){
        let id=this.layer.members[member[i]].id;
        let type=this.layer.members[member[i]].type;
        joinArray.push({id,type});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'join',data:joinArray});
    },
    unHiddenAllElements(){
      const member=this.extractNumber();
      const length=member.length;
      let quitArray=[];
      for(let i=0;i<length;i++){
        let id=this.layer.members[member[i]].id;
        let type=this.layer.members[member[i]].type;
        quitArray.push({id,type});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'quit',data:quitArray});
    },
    showTeamEyeA(id){
      return this.inHiddenElements(id);
    },
    inHiddenElements(id){
      return this.mapHiddenElements.has(id);
    },
    /**
     * tpCheck
     */
    isInteger(value){//判断一个数字是否为正整数
      return Number.isInteger(value) && value>0;
    },
    isColor16(color){//检测一个字符串是否是标准的16进制颜色-正确则返回true
      const regex=/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
      return regex.test(color);
    },
    isAllowValueTyp(type,value){//依据type检测value(或default)是否是正确的type类型-正确则返回true
      switch (type) {
        case 'text':{
          return typeof value==='string';
        }
        case 'long':{
          return typeof value==='string';
        }
        case 'number':{
          return typeof value === 'number';
        }
        case 'date':{
          return typeof value === 'string';
        }
        case 'bool':{
          return typeof value === 'boolean';
        }
        case 'list':{
          return typeof value === 'string';
        }
        case 'percent':{
          if(typeof value!=='string')return false;
          const reg=/^\d+(\.\d+)?%$/;
          return reg.test(value);
        }
        case 'score':{
          if(typeof value!=='number')return false;
        }
      }
    },
    isAllowMethod(type,method){//判断method是否为type允许使用的方法-正确则返回true
      switch (type){
        case 'long':{
          return false;
        }
        case 'score':{
          return ['equ','nequ','gre','greq','les','lesq','mod0','nmod0'].includes(method);
        }
        case 'number':{
          return ['equ','nequ','gre','greq','les','lesq','mod0','nmod0'].includes(method);
        }
        case 'percent':{
          return ['equ','nequ','gre','greq','les','lesq'].includes(method);
        }
        case 'date':{
          return ['equ','nequ','gre','greq','les','lesq'].includes(method);
        }
        case 'bool':{
          return ['equ','nequ'].includes(method);
        }
        case 'list':{
          return ['equ','nequ'].includes(method);
        }
        case 'text':{
          return ['equ','nequ'].includes(method);
        }
        default:{
          return false;
        }
      }
    },
    isAllowValueTypL(type,length,value){//依据type length检测value(或default)是否是type类型的数据以及长度是否合理-正确则返回true
      switch (type) {
        case 'text':{
          if(typeof value!=='string')return false;
          return value.length <= length;
        }
        case 'long':{
          if(typeof value!=='string')return false;
          return value.length <= length;
        }
        case 'number':{
          return typeof value === 'number';
        }
        case 'date':{
          return typeof value === 'string';
        }
        case 'bool':{
          return typeof value === 'boolean';
        }
        case 'list':{
          return typeof value === 'string';
        }
        case 'percent':{
          if(typeof value!=='string')return false;
          const reg=/^\d+(\.\d+)?%$/;
          return reg.test(value);
        }
        case 'score':{
          if(typeof value!=='number')return false;
          return value <= length;
        }
      }
    },
    isAllowTypeLen(type,num){//检测num是否超过type规定的最大长度-正确则返回true
      if(num<0)return false;
      switch (type) {
        case 'text':{
          return num <= 100;
        }
        case 'long':{
          return num <= 1000;
        }
        case 'score':{
          return num <= 10;
        }
        default:{
          return num === 0;
        }
      }
    },
    isDetailsType(str){//检测str是否为模板属性规定以内的类型-正确则返回true
      return ['text','long','number','date','bool','list','percent','score'].includes(str);
    },
    isNameDetails(obj){//检测是否obj是默认的name属性-正确则返回true
      let obj1={
        set:false,
        name:'name',
        default:'unknown',
        type:'text',
        length:100,
        empty:true
      };
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let key of keys1) {
        if (obj1[key] !== obj[key]) {
          return false;
        }
      }
      return true;
    },
    tpCheck(template){//模板检查,若正常则返回true，否则返回其他错误的代码
      if(template===null)return 500;
      let arr=[];
      let names=['name'];
      let len=0;
      let count=0;
      let cType='';
      let wType='';
      function isObj(value){return typeof value==='object' && !Array.isArray(value) && value!==null;}


      if(!isObj(template))return 1000;


      if(!Object.prototype.hasOwnProperty.call(template,'id'))return 2000;//A layer property check
      if(typeof template.id!=='string')return 2100;
      if(template.id==='')return 2200;

      if(!Object.prototype.hasOwnProperty.call(template,'name'))return 4000;
      if(typeof template.name!=='string')return 4100;
      if(template.name==='')return 4200;

      if(!Object.prototype.hasOwnProperty.call(template,'creator'))return 6000;
      if(typeof template.creator!=='string')return 6100;
      if(template.creator==='')return 6200;

      if(!Object.prototype.hasOwnProperty.call(template,'modify'))return 8000;
      if(typeof template.modify!=='string')return 8100;
      if(template.modify==='')return 8200;

      if(!Object.prototype.hasOwnProperty.call(template,'locked'))return 10000;
      if(typeof template.locked!=='boolean')return 10100;

      if(!Object.prototype.hasOwnProperty.call(template,'explain'))return 12000;
      if(typeof template.explain!=='string')return 12100;


      if(!Object.prototype.hasOwnProperty.call(template,'typeRule'))return 14000;//typeRule property check
      if(!isObj(template.typeRule))return 15000;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'point'))return 16000;
      if(typeof template.typeRule.point!=='boolean')return 17000;
      if(template.typeRule.point)count++;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'line'))return 18000;
      if(typeof template.typeRule.line!=='boolean')return 19000;
      if(template.typeRule.line)count++;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'area'))return 20000;
      if(typeof template.typeRule.area!=='boolean')return 21000;
      if(template.typeRule.area)count++;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'curve'))return 22000;
      if(typeof template.typeRule.curve!=='boolean')return 23000;
      if(template.typeRule.curve)count++;
      if(count<=0){return 24000;}


      if(!Object.prototype.hasOwnProperty.call(template,'detailsRule'))return 30000;//detailsRule property check
      if(!Array.isArray(template.detailsRule))return 30100;
      len=template.detailsRule.length;
      arr=template.detailsRule;
      if(len<=0)return 30200;
      if(len>90)return 30300;
      if(!isObj(arr[0]))return 30400;
      if(!this.isNameDetails(arr[0]))return 30500;
      for(let i=1;i<len;i++){
        if(!isObj(arr[i])){
          return 31000+i;
        }else {
          if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 32000+i;
          if(typeof arr[i].set!=='boolean')return 32100+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'name'))return 33000+i;
          if(typeof arr[i].name!=='string')return 33100+i;
          if(arr[i].name==='')return 33200+i;
          if(arr[i].name.length>40)return 33300+i;
          if(names.includes(arr[i].name)){return 33400+i}//检测重复属性
          else{names.push(arr[i].name);}

          if(!Object.prototype.hasOwnProperty.call(arr[i],'empty'))return 34000+i;
          if(typeof arr[i].empty!=='boolean')return 34100+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'type'))return 35000+i;
          if(typeof arr[i].type!=='string')return 35100+i;
          if(!this.isDetailsType(arr[i].type))return 35200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'length'))return 36000+i;
          if(typeof arr[i].length!=='number')return 36100+i;
          if(!this.isAllowTypeLen(arr[i].type,arr[i].length))return 36200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'default'))return 37000+i;
          if(!this.isAllowValueTypL(arr[i].type,arr[i].length,arr[i].default))return 37100+i;
        }
      }


      if(!Object.prototype.hasOwnProperty.call(template,'colorRule'))return 40000;//colorRule property check
      if(!isObj(template.colorRule))return 40100;
      if(!Object.prototype.hasOwnProperty.call(template.colorRule,'basis'))return 40200;
      if(typeof template.colorRule.basis!=='string')return  40300;
      if(!Object.prototype.hasOwnProperty.call(template.colorRule,'type'))return 40400;
      if(typeof template.colorRule.type!=='string')return  40500;
      if(!Object.prototype.hasOwnProperty.call(template.colorRule,'condition'))return 40600;
      if(!Array.isArray(template.colorRule.condition))return  40700;
      if(template.colorRule.basis===''){//rule(A)
        if(template.colorRule.type!=='')return 40800;
        if(template.colorRule.condition.length!==0)return 40900;
      }else{
        if(template.colorRule.type==='')return 41000;
        if(!this.isDetailsType(template.colorRule.type))return 41100;
      }
      len=template.colorRule.condition.length;
      if(len>90)return 41200;//规则条例最多90条
      arr=template.colorRule.condition;
      cType=template.colorRule.type;
      for(let i=0;i<len;i++){
        if(!isObj(arr[i])){
          return 42000+i;
        }else {
          if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 42100+i;
          if(typeof arr[i].set!=='boolean')return 42200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'color'))return 43000+i;
          if(typeof arr[i].color!=='string')return 43100+i;
          if(!this.isColor16(arr[i].color))return 43200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'method'))return 44000+i;
          if(typeof arr[i].method!=='string')return 44100+i;
          if(!this.isAllowMethod(cType,arr[i].method))return 44200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'value'))return 45000+i;
          if(!this.isAllowValueTyp(cType,arr[i].value))return 45100+i;
          if(typeof arr[i].value==='string'){//rule(E)
            if(arr[i].value.length>100)return 45200+i;
          }
        }
      }


      if(!Object.prototype.hasOwnProperty.call(template,'widthRule'))return 50000;//widthRule property check
      if(!isObj(template.widthRule))return 50100;
      if(!Object.prototype.hasOwnProperty.call(template.widthRule,'basis'))return 50200;
      if(typeof template.widthRule.basis!=='string')return  50300;
      if(!Object.prototype.hasOwnProperty.call(template.widthRule,'type'))return 50400;
      if(typeof template.widthRule.type!=='string')return  50500;
      if(!Object.prototype.hasOwnProperty.call(template.widthRule,'condition'))return 50600;
      if(!Array.isArray(template.widthRule.condition))return  50700;
      if(template.widthRule.basis===''){//rule(A)
        if(template.widthRule.type!=='')return 50800;
        if(template.widthRule.condition.length!==0)return 50900;
      }else{
        if(template.widthRule.type==='')return 51000;
        if(!this.isDetailsType(template.widthRule.type))return 51100;
      }
      len=template.widthRule.condition.length;
      if(len>90)return 51200;//规则条例最多90条
      arr=template.widthRule.condition;
      wType=template.widthRule.type;
      for(let i=0;i<len;i++){
        if(!isObj(arr[i])){
          return 52000+i;
        }else {
          if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 52100+i;
          if(typeof arr[i].set!=='boolean')return 52200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'width'))return 53000+i;
          if(typeof arr[i].width!=='number')return 53100+i;
          if(!this.isInteger(arr[i].width))return 53200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'method'))return 54000+i;
          if(typeof arr[i].method!=='string')return 54100+i;
          if(!this.isAllowMethod(wType,arr[i].method))return 54200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'value'))return 55000+i;
          if(!this.isAllowValueTyp(wType,arr[i].value))return 55100+i;
          if(typeof arr[i].value==='string'){//rule(E)
            if(arr[i].value.length>100)return 55200+i;
          }
        }
      }
      return true;
    },
    /**
     * tpCheck
     */
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
    userName(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.user_name;
        }else {
          return this.$store.state.serverData.userName
        }
      }else {
        return this.$store.state.serverData.userName;
      }
    },
    userEmail(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.user_email;
        }else {
          return this.$store.state.serverData.userEmail
        }
      }else {
        return this.$store.state.serverData.userEmail;
      }
    },
    templateId(){
      return this.$store.state.templateConfig.useTpId+this.$store.state.templateConfig.useTpName
    },
    mapHiddenElements(){
      let map=new Map();
      this.hiddenElements.forEach(value=>map.set(value.id,true));
      return map;
    },
    hasElementMember(){
      if(this.structure.length<3){
        return false;
      }
      let count=0;
      for (let i=2;i<this.structure.length;i++) {
        let me=this.structure[i];
        if (typeof me==='number' || (typeof me==='string' && !isNaN(parseInt(me)))) {
          count++;
        }
      }
      return count !== 0;
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
      const Member=this.extractNumber();
      const length=Member.length;
      for(let i=0;i<length;i++){
        let member=this.layer.members[Member[i]];
        if(member===undefined){continue;}
        if(map.has(member.id)){
          hideNum++;
        }
      }
      return hideNum === length;
    },
    eachLevelClass(){
      return this.level===1?'OrangeGroupStructureL1':'OrangeGroupStructure';
    },
    taskEndCode(){
      return this.$store.state.templateConfig.taskEndCode;
    },
    resultCode(){
      return this.$store.state.templateConfig.resultCode;
    },
    resultTemplate(){
      return this.$store.state.templateConfig.resultTemplate;
    },
    modify(){
     try {return this.structure[1].template.modify;}
     catch (e) {return false;}
    }
  },
  watch:{
    modify:{
      handler(){//当本分组模板更新后更新使用中的模板
        let im='';
        try{im=this.structure[1].template.id+this.structure[1].template.name;}catch (e) {}
        if(this.templateId===im){
          this.reuseTemplate();
        }
      }
    },
    taskEndCode:{
      handler(newValue){
        if(newValue===this.editTpTaskId){//模板编辑任务回执
          if(this.resultCode===2){
            let newTem=this.resultTemplate;
            let route=this.route.split('⇉');
            let newStr=JSON.parse(JSON.stringify(this.structure));
            newStr[1]={template:newTem};
            let newStructure=this.structureChangeData(this.layer.structure,route,newStr);
            this.$store.state.serverData.socket.broadcastUpdateLayerData({id:this.layer.id, structure:newStructure});
          }
        }
      }
    },
    allExpand:{
      handler(newValue){
        this.groupExpand=newValue;
      }
    },
    renameResponse:{
      handler(newValue){
        if(newValue.code===this.renameApprovalTemplate.code){
          if(newValue.agree===true){
            let groupLayerId=this.layer.id;
            let routeArr=this.route.split('⇉');
            let newName=newValue.name;
            let newStructure=this.structureRenameByGroup(this.layer.structure,routeArr,newName);
            this.$store.state.serverData.socket.broadcastUpdateLayerData({id:groupLayerId, structure:newStructure});
            this.$store.commit('setCoLogMessage',{text:'已重命名分组',from:'internal:OrangeGroupStructure',type:'tip'});
            this.closeRename();
          }else{
            this.$store.commit('setCoLogMessage',{text:'同级别分组中不能存在同名分组',from:'internal:OrangeGroupStructure',type:'tip'});
          }
        }
      },
      deep:true
    },
    mapHiddenElements:{
      handler(newValue,oldValue){
        function compareMaps(newValue,oldValue) {
          let newKeys=Array.from(newValue.keys());
          let oldKeys=Array.from(oldValue.keys());
          let addedKeys=newKeys.filter(key=>!oldValue.has(key));
          let removedKeys=oldKeys.filter(key=>!newValue.has(key));
          return {addedKeys,removedKeys}
        }
        let difference=compareMaps(newValue,oldValue);
        let addLength=difference.addedKeys.length;
        let removeLength=difference.removedKeys.length;
        for(let i=0;i<addLength;i++){
          let member=this.$refs['memberRightEye'+difference.addedKeys[i]];
          if(member===undefined){continue;}
          let Member=member[0];
          Member.firstChild.style.display='none';
          Member.lastChild.style.display='flex';
        }
        for(let j=0;j<removeLength;j++){
          let member=this.$refs['memberRightEye'+difference.removedKeys[j]];
          if(member===undefined){continue;}
          let Member=member[0];
          Member.firstChild.style.display='flex';
          Member.lastChild.style.display='none';
        }
      }
    },
    pickChildGroupResponse:{
      handler(newValue){
        if(newValue.route===this.route){//此子分组被选中
          if(this.level===1) {this.$refs.memberTeamOut.classList.add('memberTeamBoxPickA');}
          else {this.$refs.memberTeamOut.classList.add('memberTeamBoxPickB');}
          let stu1=this.structure[1];
          if(typeof stu1==='object' && !Array.isArray(stu1)){
            if(Object.prototype.hasOwnProperty.call(stu1,'template')){
              if(this.tpCheck(stu1.template)){//通过安全检查后应用此模板
                this.$store.commit('setCoTemplateUse',this.structure[1].template);
              }else {
                this.$store.commit('setCoLogMessage',{text:'警告！当前选中分组存在异常，无法应用模板',from:'internal:OrangeGroupStructure',type:'warn'});
              }
            }
          }
        }else {
          if(this.level===1) {this.$refs.memberTeamOut.classList.remove('memberTeamBoxPickA');}
          else {this.$refs.memberTeamOut.classList.remove('memberTeamBoxPickB');}
        }
      },
      deep:true
    }
  }
}
</script>

<style scoped>
.renameClose{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 555;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.26);
}
.renameY{
  width: 400px;
  height: 150px;
  background: rgba(255, 255, 255, 0.84);
  position: fixed;
  z-index: 556;
  border-radius: 15px;
  left: calc(50% - 200px);
  top: calc(50% - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.renameY input{
  width: 300px;
  height: 30px;
  font-size: 15px;
  padding: 2px 4px;
  outline: none;
  border: none;
  border-bottom: 1px dashed #8e8e8e;
  transition: 0.3s;
  background: rgba(255, 255, 255, 0.84);
}
.renameY input:focus{
  border-bottom: 1px solid #292929;
}
.renameRow{
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  font-size: 16px;
}
button{
  cursor: pointer;
  -webkit-appearance: none;
  width: auto;
  min-width: 100px;
  border-radius: 24px;
  text-align: center;
  padding: 5px 20px;
  background-color: #7dc5ff;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  -webkit-box-shadow: 0 2px 6px -1px rgba(0,0,0,.13);
  box-shadow: 0 2px 6px -1px rgba(0,0,0,.13);
  border: none;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  outline: 0;
}
button:hover{
  background: #289ffe;
}
button:active{
  background: #ffffff;
  color: #000000;
}
.memberTeamContent{
  width: calc(100% - 19px);
  padding-left: 15px;
  height: auto;
  margin: 2px 2px;
}
.memberTeamContent:hover{
  box-shadow: 0px 0px 2px #0055ff;
}
.groupListName{
  outline: none;
  user-select: none;
}
.groupPicked{
  color:#4d90fe;
}
.menuListBox{
  user-select: none;
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
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.OrangeGroupStructure{
  width: calc(100% - 15px);
  padding-left: 15px;
  height: auto;
  min-height: 27px;
}
.OrangeGroupStructureL1{
  width: 100%;
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
  color: #000000;
}
.memberTeamName:hover .memberRightEyeA{
  opacity: 1;
}
.memberKeyInfo:hover .memberRightEyeA{
  opacity: 1;
}
.memberTeamBoxPickA{
  border-left: 2px solid #4d90fe;
  width: calc(100% - 2px);/*含2px边框和*/
}
.memberTeamBoxPickB{
  border-left: 2px solid #4d90fe;
  width: calc(100% - 17px);/*含2px边框和15px padding*/
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
  user-select: none;
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
  display: none;
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
  width: 100%;
  max-width: 246px;/*246px与拖拽计算点击位置绑定，不可修改*/
  height: auto;
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
  max-width: calc(100% - 21px);/*21px为左侧类型图标的宽度*/
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
