<template>
  <div ref="memberTeamOut" :class="eachLevelClass">
    <div class="memberTeamName"
         @click="pickChildGroupRequest()"
         @contextmenu.stop.prevent="contextmenuHeadOpen($event)"
         @mouseup="confirmItemJoinGroup($event)">
      <div class="memberTeamNameL">
        <div class="expandMoreL" @click.stop="expandGroup()" @mousedown.stop="playSoundEffect('confirm_1')" v-show="!groupExpand">
          <expand-more custom="transform:translate(0px,-1px) rotate(180deg);cursor:pointer;"/>
        </div>
        <div class="expandMoreL" @click.stop="expandGroup()" @mousedown.stop="playSoundEffect('unconfirm_1')" v-show="groupExpand">
          <expand-more custom="transform:translate(0px,2px);cursor:pointer;"/>
        </div>
        <span class="groupListName" v-text="structure[0]"/>
      </div>
      <div class="memberTeamNameR" title="隐藏操作仅对您可见" v-show="hasElementMember">
        <div class="memberRightEyeA" @click.stop="hiddenAllElements()" v-show="!groupMemberAllHide">
          <eye-visible custom="cursor:pointer"/>
        </div>
        <div class="memberRightEyeB" @click.stop="unHiddenAllElements()" v-show="groupMemberAllHide">
          <eye-not-visible custom="cursor:pointer"/>
        </div>
      </div>
    </div>
    <!--虚拟列表 hasRuleCW -->
    <div class="VirtualTeamZone" v-if="hasRuleCW">
      <div class="VirtualTeamPart" v-for="(team,teamKey) in virtualTeam" :key="teamKey" v-if="Object.keys(team.members).length!==0">
        <div class="memberTeamHead">
          <div class="memberTeamNameL">
            <div class="expandMoreL" @click="expandVirtualTeam(teamKey)">
              <expand-more custom="transform:translate(0px,-1px);cursor:pointer;"/>
            </div>
            <span class="groupListName" v-text="team.name"/>
          </div>
          <div class="memberTeamNameR" title="隐藏操作仅对您可见">
            <div class="memberRightEyeA" @click.stop="hiddenTeamElements(teamKey)" v-show="!teamHiddenStatus(teamKey)">
              <eye-visible custom="cursor:pointer"/>
            </div>
            <div class="memberRightEyeB" @click.stop="unHiddenTeamElements(teamKey)" v-show="teamHiddenStatus(teamKey)">
              <eye-not-visible custom="cursor:pointer"/>
            </div>
          </div>
        </div>
        <div class="memberTeamVS" :ref="'VS'+teamKey" data-s="false">
          <div class="memberTeamBox" ref="memberTeamBox" :key="index" v-for="(item,index) in team.members" v-show="groupExpand">
            <div class="memberTeamContent" v-if="!isArray(item)">
              <div class="memberKeyInfo" :title="getItemName(item)">
                <div class="memberLeft" @click="clickMemberEvent(item)">
                  <point :custom="'fill:#'+item.color+';transform:translate(-2px,0px)'" v-if="item.type==='point'"/>
                  <segment-line :custom="'fill:#'+item.color+';transform:translateX(-5px);'" v-if="item.type==='line'"/>
                  <curve :custom="'fill:#'+item.color+';transform:translateX(-5px);'" v-if="item.type==='curve'"/>
                  <region :custom="'fill:#'+item.color+';transform:translateX(-5px);'" v-if="item.type==='area'"/>
                  <span class="memberName" v-text="getItemName(item)"/>
                </div>
                <div :ref="'memberRightEye'+item.id">
                  <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenUnhiddenElement(item.id,item.type)">
                    <eye-visible custom="cursor:pointer"/>
                  </div>
                  <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenUnhiddenElement(item.id,item.type)">
                    <eye-not-visible custom="cursor:pointer"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--虚拟列表 hasRuleCW -->
    <!--实际列表 hasRuleCW -->
    <div class="memberTeamZone" v-if="!hasRuleCW">
      <div class="memberTeamPage" v-if="itemCount>=50">
        <div :class="pageCount<7?'memberTeamPageRA':'memberTeamPageRB'">
          <div class="memberTeamPageBt" @click="pageBtUp()">上-页</div>
          <div :class="pageBtClass(num)"  v-for="num in pageList" v-text="num" @click="pageBtClick(num)"/>
          <div class="memberTeamPageBt" @click="pageBtDown()">下-页</div>
        </div>
      </div>
      <div class="memberTeamVS">
        <div class="memberTeamBox" ref="memberTeamBox" :key="index" v-for="(item,index) in extractLatter()" v-show="groupExpand">
          <div class="memberTeamContent" v-if="!isArray(item)">
            <div class="memberKeyInfo" :title="getItemName(layer.members[item])"
                 @mouseenter="expandOrderCase($event,layer.members[item].id)"
                 @mouseleave="restoreOrderCase($event)"
                 @mouseup="confirmOrderCase($event,layer.members[item].id)">
              <div class="memberLeft" @click="clickMemberEvent(layer.members[item])" @mousedown.stop="grabLayerStart($event,index,layer.members[item].id,layer.members[item].custom.tmpId)">
                <point :custom="'fill:#'+layer.members[item].color+';transform:translate(-2px,0px)'" v-if="layer.members[item].type==='point'"/>
                <segment-line :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'" v-if="layer.members[item].type==='line'"/>
                <curve :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'" v-if="layer.members[item].type==='curve'"/>
                <region :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'" v-if="layer.members[item].type==='area'"/>
                <span class="memberName" v-text="getItemName(layer.members[item])"/>
              </div>
              <div :ref="'memberRightEye'+layer.members[item].id">
                <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenUnhiddenElement(layer.members[item].id,layer.members[item].type)">
                  <eye-visible custom="cursor:pointer"/>
                </div>
                <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenUnhiddenElement(layer.members[item].id,layer.members[item].type)">
                  <eye-not-visible custom="cursor:pointer"/>
                </div>
              </div>
            </div>
            <div class="memberActivityInfo">
              <div class="memberPick" v-if="false">
                <span class="memberSpanA" v-text="'emilia-text'"/><span>编辑形状中</span>
              </div>
              <div class="memberSelect" v-if="false">
                <span class="memberSpanA" v-text="'emilia-text'"/><span>编辑属性中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--实际列表 hasRuleCW -->
    <div class="memberMenuClose" @contextmenu.prevent="void 1" @click.stop="contextmenuHeadClose()" v-show="memberHeadMenu.show"></div>
    <div class="memberMenu" :style="headContextmenuPos" v-show="memberHeadMenu.show">
      <div class="menuListBox">
        <div class="menuList" title="点击打开模板设置界面" @click="openTemplate()" @mousedown.stop="playSoundEffect('confirm_1')">
          设置模板
        </div>
        <div class="menuList" @click="openRename()" @mousedown.stop="playSoundEffect('confirm_1')">
          重命名
        </div>
      </div>
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
import ExpandMore from "./svgValidIcons/expandMore";
import EyeVisible from "./svgValidIcons/eyeVisible";
import EyeNotVisible from "./svgValidIcons/eyeNotVisible";
import OrangeGroupStructure from "./OrangeGroupStructure";
import Region from "./svgValidIcons/region";
import SegmentLine from "./svgValidIcons/segmentLine";
import Curve from "./svgValidIcons/curve";
import Point from "./svgValidIcons/point";
import {mapState} from "vuex";
import PomeloConfirm from "./PomeloConfirm";
export default {
  name: "OrangeGroupStructure",
  components:{
    OrangeGroupStructure,EyeVisible,EyeNotVisible,ExpandMore,Region,
    SegmentLine,Point,PomeloConfirm,Curve,
  },
  data(){
    return {
      hasRuleCW:false,//是否该分组含有color和width rule
      tmpId:null,
      page:1,//当前页
      itemCount:0,//成员总数
      pageCount:1,//一共有多少页
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
      grabItemTmpId:null,
      grabItemSeparate:false,//本图层是否脱离面板独立存在
      grabSeparateLeft:20,//拖动独立x轴的左侧条件
      grabSeparateRight:320,//拖动独立x轴的右侧条件
      grabIndex:-1,
      moveObServe:null,
      editTpTaskId:null,//编辑模板任务id
      firmView:false,//确认菜单
      firmPlan:{},
      firmMessage:'',
      tmpProof:null,
      sticky:false,//置顶图层头部
      virtualTeamType:'none',//color and width and none
      virtualTeam:{
        unFiled:{
          name:'未归类',
          show:true,
          members:{}
        }
        // color:{//如果是颜色虚拟列表则属性名为颜色字符串(例如#123456)，如果是宽度虚拟列表则属性名为整数
        //   name:"",//名称
        //   show:"",//是否全展示
        //   members:{},//分组成员，用于显示哪些元素是显示此颜色的
        //   rules:[]//规则条列，用于展示哪些规则是分配此颜色的通常只有一条规则
        // }
      },
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
          pattern:null,
          elementA:-1,
          templateA:-1,
          elementB:-1,
          templateB:-1,
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
    this.startSetting();
  },
  created() {
    this.unwatch=this.$watch('pickLayerId',(newValue)=>{//设置第一个分组图层的行为
      if(newValue==this.layer.id){
        this.$refs.memberTeamOut.classList.add('memberTeamBoxPickA');
        let stu1=this.structure[1];
        if(typeof stu1==='object' && !Array.isArray(stu1)){
          if(Object.prototype.hasOwnProperty.call(stu1,'template')){
            if(this.tmpProof.tpCheck(stu1.template)){//通过安全检查后应用此模板
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
    startSetting(){
      this.tmpProof=new this.$store.state.classList.tmpProof('chinese');
      let state=this.setHasRuleCW();
      if(state){
        this.buildVirtualTeam();//构建虚拟分组
        this.classifyMembers();//对成员进行分类
      }
      this.bindTemplate();
      this.tmpId=this.structure[1].template.id;
    },
    playSoundEffect(name){
      this.$store.commit('setCoEffectsSound',name);
    },
    pageBtUp(){//上一页
      if(this.page<=1)return;
      this.page--;
    },
    pageBtDown(){//下一页
      if(this.page>=this.pageCount)return;
      this.page++;
    },
    pageBtClass(num){//页数的class
      if(num==='···')return 'memberTeamPageEl';
      if(num===this.page)return 'memberTeamPageBtSe';
      return 'memberTeamPageBt';
    },
    pageBtClick(num){//切换页数
      if(typeof num!=='number')return;
      this.page=num;
    },
    bindTemplate(){//挂载模板数据到store
      let stu1=this.structure[1];
      let temp;
      let id;
      if(typeof stu1==='object' && !Array.isArray(stu1) && stu1!==null){
        temp=JSON.parse(JSON.stringify(stu1.template));
        if(typeof temp==='object' && !Array.isArray(temp) && temp!==null){
          if(this.tmpProof.tpCheck(temp)){
            id=temp.id;
            this.$store.state.templateData[id]=temp;
          }
        }
      }
    },
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
          if(this.tmpProof.tpCheck(stu1.template)){//通过安全检查后应用此模板
            this.$store.commit('setCoTemplateUse',this.structure[1].template);
          }else {
            this.$store.commit('setCoLogMessage',{text:'警告！当前选中分组存在异常，无法应用模板',from:'internal:OrangeGroupStructure',type:'warn'});
          }
        }
      }
    },
    openTemplate(){//打开模板
      function isObj(value){return typeof value==='object' && !Array.isArray(value) && value!==null;}
      let code=this.$store.state.templateConfig.taskCode+=2;
      let stu1=this.structure[1];
      let name = this.structure[0];
      if(!isObj(stu1)){
        this.$store.commit('setCoLogMessage',{text:'此分组模板(group'+this.layer.id+')存在异常，请联系管理员修复',from:'internal:OrangeGroupStructure',type:'error'});
        return false;
      }
      if(!stu1.hasOwnProperty('template')){
        this.$store.commit('setCoLogMessage',{text:'此分组模板(group'+this.layer.id+')存在异常，请联系管理员修复',from:'internal:OrangeGroupStructure',type:'error'});
        return false;
      }
      if(typeof stu1.template!=='object'){
        this.$store.commit('setCoLogMessage',{text:'此分组模板(group'+this.layer.id+')存在异常，请联系管理员修复',from:'internal:OrangeGroupStructure',type:'error'});
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
    alertTip(text){
      this.$store.commit('setCoLogMessage',{text:text,from:'internal:OrangeGroupStructure',type:'warn'});
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
      if(this.adjustItemOrderResponse.elementA!==-1 && this.adjustItemOrderResponse.elementA!==id){
        ev.target.style.height='80px';
      }
    },
    restoreOrderCase(ev){
      if(ev.target.className!=='memberKeyInfo'){
        return false;
      }
      ev.target.style.height='25px';
    },
    randomNumber8(){
      const min = 10000000;
      const max = 99999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    confirmItemJoinGroup(ev){
      if(ev.button!==0){
        return false;
      }
      if(this.adjustItemOrderResponse.elementA!==-1){
        this.$emit('adjustItemOrderRequest',{
          code:this.randomNumber8(),
          stage:'confirm',
          pattern:'join',
          elementA:this.adjustItemOrderResponse.elementA,
          templateA:this.adjustItemOrderResponse.templateA,
          elementB:null,
          templateB:this.tmpId
        });
      }
    },
    confirmOrderCase(ev,id){
      if(this.adjustItemOrderResponse.elementA!==-1 && this.adjustItemOrderResponse.elementA!==id){
        let offsetY=ev.offsetY;
        if(offsetY<40){
          this.$emit('adjustItemOrderRequest',{
            code:this.randomNumber8(),
            stage:'confirm',
            pattern:'up',
            elementA:this.adjustItemOrderResponse.elementA,
            templateA:this.adjustItemOrderResponse.templateA,
            elementB:id,
            templateB:this.tmpId,
          });
        }else if(offsetY>=40 && offsetY<=80){
          this.$emit('adjustItemOrderRequest',{
            code:this.randomNumber8(),
            stage:'confirm',
            pattern:'down',
            elementA:this.adjustItemOrderResponse.elementA,
            templateA:this.adjustItemOrderResponse.templateA,
            elementB:id,
            templateB:this.tmpId,
          });
        }
      }
    },
    adjustItemOrderApproval(data){
      this.$emit('adjustItemOrderRequest',data);//转发申请
    },
    grabLayerStart(ev,index,id,tmpId){//拖拽起步点击
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
      this.grabItemTmpId=tmpId;
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
          if(this.grabItemState){
            if(Math.abs(this.grabStartY-event.y)<=3)return false;//仅当拖拽幅度大于3px时才进行拖拽事件
            if(this.adjustItemOrderResponse.elementA!==this.grabItemId){
              this.$emit('adjustItemOrderRequest',{
                code:this.randomNumber8(),
                stage:'ready',
                elementA:this.grabItemId,
                templateA:this.grabItemTmpId,
              });//申请调序
            }
            if(event.x<this.grabSeparateLeft || event.x>this.grabSeparateRight){//拖出图层面板
              this.$refs.memberTeamBox[this.grabIndex].style.pointerEvents='none';
              this.$refs.memberTeamBox[this.grabIndex].style.position='fixed';
              this.$refs.memberTeamBox[this.grabIndex].style.zIndex='666';
              this.$refs.memberTeamBox[this.grabIndex].style.left=event.x-this.grabItemPosOffsetX+'px';
              this.$refs.memberTeamBox[this.grabIndex].style.top=event.y-this.grabItemPosOffsetY+'px';
              this.$refs.memberTeamBox[this.grabIndex].style.background='rgba(255,255,255,0.5)';
              this.grabItemSeparate=false;
            }else {
              this.$refs.memberTeamBox[this.grabIndex].style.pointerEvents='none';
              this.$refs.memberTeamBox[this.grabIndex].style.position='fixed';
              this.$refs.memberTeamBox[this.grabIndex].style.left='';
              this.$refs.memberTeamBox[this.grabIndex].style.top=event.y-this.grabItemPosOffsetY+'px';
              this.$refs.memberTeamBox[this.grabIndex].style.background='rgba(255,255,255,0.5)';
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
      if(newName===this.structure[0]){//与原名称一致
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
        this.$store.commit('setCoLogMessage',{text:'名称不能为空字符',from:'internal:OrangeGroupStructure',type:'tip'});
        return false;
      }
      if(newName===this.structure[0]){//与原名称一致
        this.$store.commit('setCoLogMessage',{text:'名称与原始名称一致',from:'internal:OrangeGroupStructure',type:'tip'});
        return false;
      }else{
        this.renameApprovalTemplate.code=this.randomNumber8();
        this.renameApprovalTemplate.name=newName;
        this.$emit('renameRequest',this.renameApprovalTemplate);
      }
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

      }
    },
    getFormattedDate() {//获取模板时间
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
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
      }
      this.itemCount=refMember.length;
      this.pageCount=Math.ceil(refMember.length/50);
      refMember=refMember.splice((this.page-1)*50,50);
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
      if(!Array.isArray(item.details)){
        return unknown;
      }
      for(let i=0;i<item.details.length;i++){
        if(item.details[i].key==='name'){
          let value=item.details[i].value+'';
          let content=value.substr(2);
          if(content===''){
            return unknown;
          }else {
            return content;
          }
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
    setElementFlicker(element,duration){//闪烁特效
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
    inHiddenElements(id){
      return this.mapHiddenElements.has(id);
    },
    setHasRuleCW(){//是否该分组含有color和width rule
      if(typeof this.structure[1]!=='object'){return false;}
      if(!('template' in this.structure[1])){return false;}
      if(typeof this.structure[1].template!=='object'){return false;}
      if(this.structure[1].template.colorRule.condition.length>0){
        this.hasRuleCW=true;
        return true;
      }
      if(this.structure[1].template.widthRule.condition.length>0){
        this.hasRuleCW=true;
        return true;
      }
      this.hasRuleCW=false;
      return false;
    },
    getTeamName(rule,language){//依据规则返回虚拟分组名称(string)，如果出现异常则返回false
      let value=rule.value;
      let type='';//值的数据类型
      let str='';//字符串类型数据的前缀
      let str2='';//后面的字符串
      let method='';
      if(typeof value === 'number'){
        type='number';
      }
      else if(typeof value === 'boolean'){
        type='bool'
      }
      else if(typeof value === 'string'){
        str=value.substring(0,2);
        str2=value.substring(2,value.length);
        switch(str){
          case '☍t':{
            type='text';
            break;
          }
          case '☍l':{
            type='list';
            break;
          }
          case '☍p':{
            type='percent';
            break;
          }
          case '☍e':{
            type='datetime';
            break;
          }
          case '☍d':{
            type='date';
            break;
          }
          case '☍m':{
            type='time';
            break;
          }
        }
      }
      else{
        return false;
      }
      switch(rule.method){
        case 'equ':{
          method=language==='english'?'equal to ':'等于';
          break;
        }
        case 'nequ':{
          method=language==='english'?'not equal to ':'不等于';
          break;
        }
        case 'gre':{
          method=language==='english'?'greater than ':'大于';
          break;
        }
        case 'greq':{
          method=language==='english'?'greater than or equal ':'大于等于';
          break;
        }
        case 'les':{
          method=language==='english'?'less than ':'小于';
          break;
        }
        case 'lesq':{
          method=language==='english'?'less than or equal ':'小于等于';
          break;
        }
        case 'mod0':{
          method=language==='english'?'mod0 ':'模等于0 ';
          break;
        }
        case 'nmod0':{
          method=language==='english'?'not mod0 ':'模不等于0 ';
          break;
        }
      }
      switch(type){
        case 'number':{
          return method+value;
        }
        case 'bool':{
          return value===true?method+'true':method+'false';
        }
        case 'text':{
          return method+str2;
        }
        case 'list':{
          return method+str2;
        }
        case 'percent':{
          return method+str2;
        }
        case 'datetime':{
          return method+str2;
        }
        case 'date':{
          return method+str2;
        }
        case 'time':{
          return method+str2;
        }
      }
      return language==='english'?'AbnormalGroup':'异常的分组';
    },
    buildVirtualTeam(){//构建虚拟分组
      for(let key in this.virtualTeam){
        if(key==='unFiled')continue;
        if(Object.hasOwnProperty.call(this.virtualTeam,key)){
          delete this.virtualTeam[key];//重置分组
        }
      }
      if(typeof this.structure[1]!=='object'){return false;}
      if(!('template' in this.structure[1])){return false;}
      if(typeof this.structure[1].template!=='object'){return false;}
      if(this.structure[1].template.colorRule.condition.length>0){//按颜色分组(优先)
        this.virtualTeamType='color';
        let length=this.structure[1].template.colorRule.condition.length;
        let reg=/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
        for(let i=0;i<length;i++){
          let color=this.structure[1].template.colorRule.condition[i].color;
          if(typeof color!=='string'){continue;}//不是字符串
          if(reg.test(color)===false){continue;}//不是正确的颜色字符串
          let teamName=this.getTeamName(this.structure[1].template.colorRule.condition[i]);
          this.virtualTeam[color]={
            name:teamName,
            members:{},
            show:true,
            rules:[this.structure[1].template.colorRule.condition[i]]
          }
        }
        return true;
      }
      if(this.structure[1].template.widthRule.condition.length>0){//按宽度分组
        this.virtualTeamType='width';
        let length=this.structure[1].template.widthRule.condition.length;
        for(let i=0;i<length;i++){
          let width=this.structure[1].template.widthRule.condition[i].width;
          if(typeof width!=='number'){continue;}//不是数字
          let teamName=this.getTeamName(this.structure[1].template.widthRule.condition[i]);
          this.virtualTeam[width]={
            name:teamName,
            members:{},
            show:true,
            rules:[this.structure[1].template.widthRule.condition[i]]
          }
        }
        return true;
      }
    },
    classifyMembers(){//对成员进行分类
      for(let key in this.virtualTeam.unFiled.members){
        if(Object.hasOwnProperty.call(this.virtualTeam.unFiled.members,key)){
          delete this.virtualTeam.unFiled.members[key];//重置未分组组别
        }
      }
      let arr=Object.keys.call([],this.layer.members);
      if(arr.length===0){return false;}
      Object.keys(this.layer.members).forEach(
        id=>{
          if(typeof this.layer.members[id]!=='object'){//等待图层成员构建完毕
            setTimeout(()=>this.classifyMembers,1);
            return false;
          }
          if(this.virtualTeamType==='color'){
            let color='#'+this.layer.members[id].color;
            if(Object.hasOwnProperty.call(this.virtualTeam,color)){
              this.virtualTeam[color].members[id]=this.layer.members[id];
            }
            else{
              this.virtualTeam.unFiled.members[id]=this.layer.members[id];
            }
          }
          else if(this.virtualTeamType==='width'){
            let width=this.layer.members[id].width;
            if(Object.hasOwnProperty.call(this.virtualTeam,width)){
              this.virtualTeam[width].members[id]=this.layer.members[id];
            }
            else{
              this.virtualTeam.unFiled.members[id]=this.layer.members[id];
            }
          }
          else{
            return true;
          }
        }
      );
    },
    expandVirtualTeam(teamKey){//展开或关闭虚拟分组
      let dom=null;
      try{
        dom=this.$refs['VS'+teamKey][0];
      }catch(e){}
      if(dom!==null){
        let height=dom.clientHeight;
        let status=dom.getAttribute('data-s');
        let animation=null;
        if(status==='false'){
          animation=[
            {
              height: height+'px',
              opacity:1
            },
            {
              height: '0px',
              opacity:0
            }
          ];
          dom.setAttribute('data-s','true');
        }else{
          animation=[
            {
              height: height+'px',
              opacity:0
            },
            {
              height: 'auto',
              opacity:1
            }
          ];
          dom.setAttribute('data-s','false');
        }
        dom.animate(
          animation,
          {
            duration: 400, // 动画时间0.4秒
            easing: 'ease', // 平滑过渡
            iterations: 1,   // 执行1次
            fill: 'forwards' // 动画结束后保持在终点
          }
        );
        if(status==='false'){//动画结束后隐藏虚拟分组图层
          setTimeout(
            ()=>{
              dom.style.display='none';
            },400
          );
        }else{
          dom.style.display='block';
        }
      }
    },
    teamHiddenStatus(teamKey){//返回虚拟分组成员是否处于全部隐藏状态
      if(this.layer.members===[]){
        return false;
      }
      if(typeof this.layer.members[0]==='string'){
        return false;
      }
      let hideNum=0;
      const map=new Map(this.hiddenElements.map(item=>[item.id,item]));
      const Members=Object.keys(this.virtualTeam[teamKey].members);
      const length=Members.length;
      for(let i=0;i<length;i++){
        if(map.has(parseInt(Members[i]))){
          hideNum++;
        }
      }
      return hideNum === length;
    },
    hiddenTeamElements(teamKey){
      const member=Object.keys(this.virtualTeam[teamKey].members);//[id...]
      const length=member.length;
      let joinArray=[];
      for(let i=0;i<length;i++){
        let id=parseInt(member[i]);
        let type=this.layer.members[member[i]].type;
        joinArray.push({id,type});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'join',data:joinArray});
    },
    unHiddenTeamElements(teamKey){
      const member=Object.keys(this.virtualTeam[teamKey].members);//[id...]
      const length=member.length;
      let quitArray=[];
      for(let i=0;i<length;i++){
        let id=parseInt(member[i]);
        let type=this.layer.members[member[i]].type;
        quitArray.push({id,type});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'quit',data:quitArray});
    }
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
    membersKeys(){
      return Object.keys(this.layer.members);
    },
    structureCustom(){
      return this.layer.structure[1];
    },
    pageList(){
      if(this.pageCount<=1){
        return [];
      }else if(this.pageCount>1 && this.pageCount<=7){
        return Array.from({ length: this.pageCount }, (_, i) => i + 1);
      }else{
        if(this.page<=3){
          return [1, 2 , 3 , 4 , 5 ,'···',this.pageCount];
        }
        if(this.page>=this.pageCount-5){
          return [this.pageCount-5, this.pageCount-4 , this.pageCount-3 , this.pageCount-2 , this.pageCount-1 ,this.pageCount];
        }
        return [this.page-2, this.page-1, this.page,this.page+1,this.page+2,'···',this.pageCount];
      }
    },
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
      return this.$store.state.templateConfig.useTpId;
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
    },
    lastUpdateTmpId(){
      if(this.$store.state.serverData.socket!==undefined){
        return this.$store.state.serverData.socket.lastUpdateTmpId;
      }else{
        return 'id:0';
      }
    },
    updateCount(){
      if(this.$store.state.serverData.socket!==undefined){
        return this.$store.state.serverData.socket.updateCount;
      }else{
        return 0;
      }
    },
    lastUpdateId(){
      if(this.$store.state.serverData.socket!==undefined){
        return this.$store.state.serverData.socket.lastUpdateId;
      }else{
        return -1;
      }
    }
  },
  watch:{
    membersKeys:{
      handler(){//主要针对图层元素的新增和删除场景
        this.buildVirtualTeam();//构建虚拟分组
        this.classifyMembers();//对成员进行分类
      }
    },
    structureCustom:{
      handler(){//主要针对图层模板规则变动的场景
        this.buildVirtualTeam();//构建虚拟分组
        this.classifyMembers();//对成员进行分类
      }
    },
    modify:{
      handler(){//当本分组模板更新后执行的操作1.更新使用中的模板2.更新hasRuleCW
        let im='';
        try{im=this.structure[1].template.id;}catch (e) {}
        if(this.templateId===im){
          this.reuseTemplate();
          this.setHasRuleCW();
        }
      }
    },
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
            let newName=newValue.name;
            this.$store.state.serverData.socket.broadcastRenameLayer(groupLayerId,newName);
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
          try{
            Member.firstChild.style.display='none';
            Member.lastChild.style.display='flex';
          }catch(e){}
        }
        for(let j=0;j<removeLength;j++){
          let member=this.$refs['memberRightEye'+difference.removedKeys[j]];
          if(member===undefined){continue;}
          let Member=member[0];
          try{
            Member.firstChild.style.display='flex';
            Member.lastChild.style.display='none';
          }catch(e){}
        }
      }
    },
    lastUpdateTmpId:{
      handler(newValue){
        let tmpId=newValue.split(':')[0];
        if(tmpId===this.tmpId){//重新应用模板
          this.$store.commit('setCoTemplateUse',this.structure[1].template);
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
              if(this.tmpProof.tpCheck(stu1.template)){//通过安全检查后应用此模板
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
    },
    updateCount:{
      handler(){
        let lastUpdateId=this.lastUpdateId;
        if(!Object.hasOwnProperty.call(this.layer.members,lastUpdateId)){
          return void 0;//被更新的元素不属于此图层
        }
        let elementId=-1;//需要变动的元素id
        let newColor='';//迁移的颜色图层
        let newWidth=-1;//迁移的宽度图层
        if(this.virtualTeamType==='color'){
          let keys=Object.keys(this.virtualTeam);
          let length=keys.length;
          let find=false;
          for(let i=0;i<length;i++){//遍历所有虚拟分组
            let color=keys[i];
            if(color==='unFiled'){continue;}
            let members=Object.keys(this.virtualTeam[color].members);
            let LENGTH=members.length;
            for(let p=0;p<LENGTH;p++){//遍历该虚拟分组的成员
              let eid=members[p];
              if(eid==lastUpdateId){
                let nowColor='#'+this.virtualTeam[color].members[eid].color;
                if(nowColor!==color){//颜色变动
                  elementId=lastUpdateId;
                  newColor=nowColor;
                  delete this.virtualTeam[color].members[eid];//移除此元素
                }
                find=true;
                break;
              }
            }
            if(find){break;}
          }
          if(elementId!==-1 && newColor!==''){
            let added=false;
            for(let i=0;i<length;i++){//遍历所有虚拟分组
              let color=keys[i];
              if(color===newColor){
                this.virtualTeam[color].members[elementId]=this.layer.members[elementId];//添加至另一个虚拟分组
                added=true;
                break;
              }
            }
            if(added===false){//无法分类
              this.virtualTeam.unFiled.members[elementId]=this.layer.members[elementId];//添加至未分类组
            }
          }
        }
        if(this.virtualTeamType==='width'){
          let keys=Object.keys(this.virtualTeam);
          let length=keys.length;
          let find=false;
          for(let i=0;i<length;i++){//遍历所有虚拟分组
            let width=keys[i];
            if(width==='unFiled'){continue;}
            let members=Object.keys(this.virtualTeam[width].members);
            let LENGTH=members.length;
            for(let p=0;p<LENGTH;p++){//遍历该虚拟分组的成员
              let eid=members[p];
              if(eid==lastUpdateId){
                let nowWidth=this.virtualTeam[width].members[eid].width;
                if(nowWidth!==width){//宽度变动
                  elementId=lastUpdateId;
                  newWidth=nowWidth;
                  delete this.virtualTeam[width].members[eid];//移除此元素
                }
                find=true;
                break;
              }
            }
            if(find){break;}
          }
          if(elementId!==-1 && newWidth!==-1){
            let added=false;
            for(let i=0;i<length;i++){//遍历所有虚拟分组
              let width=keys[i];
              if(width==newWidth){
                this.virtualTeam[width].members[elementId]=this.layer.members[elementId];//添加至另一个虚拟分组
                added=true;
                break;
              }
            }
            if(added===false){//无法分类
              this.virtualTeam.unFiled.members[elementId]=this.layer.members[elementId];//添加至未分类组
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.VirtualTeamZone{
  width: 100%;
  height: auto;
}
.memberTeamZone{
  width: 100%;
  height: auto;
}
.VirtualTeamPart{
  width: 100%;
  height: auto;
}
.memberTeamHead{
  width: calc(100% - 7px);
  height: 25px;
  padding-left: 7px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.memberTeamVS{
  width: 100%;
  height: auto;
}
.stickyTop{
  position: fixed;
  top:150px;
  left: 50px;
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
  height: 26px;
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
}
.memberTeamPageEl{/*省略符号*/
  user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 25px;
  color: #494c50;
  cursor: default;
}
.memberTeamPageBt{/*普通的页面按钮*/
  user-select: none;
  min-width: calc(20px - 2px);
  height: calc(20px - 2px);
  font-size: 12px;
  font-weight: 400;
  background: #ffffff;
  color: #494c50;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px #d7dde4 solid;
  margin: 0px 2px;
  cursor: pointer;
}
.memberTeamPageBtSe{/*当前选中的页面按钮*/
  user-select: none;
  min-width: calc(20px - 2px);
  height: calc(20px - 2px);
  font-size: 12px;
  font-weight: 400;
  background: #00a1d6;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px #d7dde4 solid;
  margin: 0px 2px;
  cursor: pointer;
}
.memberTeamPageRB{
  width: calc(100%);
  font-weight: 100;
  font-size: 14px;
  color: #191919;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.memberTeamPageRA{
  width: calc(100%);
  font-weight: 100;
  font-size: 14px;
  color: #191919;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.memberTeamPage{
  width: calc(100%);
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
.memberTeamName{
  width: calc(100% - 2px);
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
.memberTeamHead:hover .memberRightEyeA{
  opacity: 1;
}
.memberTeamHead .memberRightEyeA{
  transform: translateX(-2px);
}
.memberTeamHead .memberRightEyeB{
  transform: translateX(-2px);
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
  user-select: none;
  opacity: 1;
}
.memberTeamBox{
  width: 100%;
  max-width: 250px;/*250px与拖拽计算点击位置绑定，不可修改*/
  height: auto;
  margin-bottom: 0;
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
  user-select: none;
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
