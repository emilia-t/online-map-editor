<template>
  <div :class="eachLevelClass">
    <div class="memberTeamName" @contextmenu.stop.prevent="contextmenuHeadOpen($event)" @mouseup="confirmItemJoinGroup($event)">
      <div class="memberTeamNameL">
        <div class="expandMoreL" @click.stop="expandGroup()" v-show="!groupExpand">
          <expand-more custom="transform:translate(0px,-1px) rotate(180deg);cursor:pointer;"></expand-more>
        </div>
        <div class="expandMoreL" @click.stop="expandGroup()" v-show="groupExpand">
          <expand-more custom="transform:translate(0px,2px);cursor:pointer;"></expand-more>
        </div>
        <span contenteditable="true" class="groupListName" ref="groupListName" v-text="structure[0]" @focus="focusGroupName($event)" @blur="blurGroupName($event)"></span>
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
      <div class="memberKeyInfo" :title="'S'+index+' ID'+layer.members[item].id" @contextmenu.stop.prevent="contextmenuItemOpen($event,layer.members[item],item)" @mouseenter="expandOrderCase($event,layer.members[item].id)" @mouseleave="restoreOrderCase($event)" @mouseup="confirmOrderCase($event,layer.members[item].id)" v-if="!isArray(item)">
        <div class="memberLeft" @click="locateToElement(layer.members[item])" @mousedown.stop="grabLayerStart($event,index,layer.members[item].id,layer.members[item].type)">
          <point :custom="'fill:#'+layer.members[item].color+';transform:translate(-2px,0px)'" v-if="layer.members[item].type==='point'"></point>
          <segment-line :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'" v-if="layer.members[item].type==='line'"></segment-line>
          <region :custom="'fill:#'+layer.members[item].color+';transform:translateX(-5px);'" v-if="layer.members[item].type==='area'"></region>
          <span class="memberName" v-text="getItemName(layer.members[item])"></span>
        </div>
        <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(layer.members[item].id,layer.members[item].type)" v-show="!showTeamEyeA(item)">
          <eye-visible custom="cursor:pointer"></eye-visible>
        </div>
        <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(layer.members[item].id,layer.members[item].type)" v-show="showTeamEyeA(item)">
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
      <orange-group-structure :layer="layer" :level="level+1" :all-expand="allExpand" :route="route+'⇉'+item[0]" :structure="item" :rename-response="renameApprovalResult" :adjust-item-order-response="adjustItemOrderResponse" @renameRequest="renameApproval" @adjustItemOrderRequest="adjustItemOrderApproval" v-if="isArray(item)"></orange-group-structure>
    </div>
    <div class="memberMenuClose" @contextmenu.prevent="void 1" @click.stop="contextmenuHeadClose()" v-show="memberHeadMenu.show"></div>
    <div class="memberMenu" :style="headContextmenuPos" v-show="memberHeadMenu.show">
      <div class="menuListBox">
        <div class="menuList" @click="createGroupAtBottom()">
          在底部新建分组
        </div>
        <div class="menuList" @click="deleteGroup()" v-if="this.level!==1">
          删除此分组
        </div>
      </div>
    </div>
    <div class="memberMenuClose" @contextmenu.prevent="void 1" @click.stop="contextmenuItemClose()" v-show="memberItemMenu.show"></div>
    <div class="memberMenu" :style="itemContextmenuPos" v-show="memberItemMenu.show">
      <div class="menuListBox">
        <div class="menuList" @click="removeLayerMember()">
          移除出此分组图层
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
      memberItemMenu:{
        target:null,
        index:null,
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
  },
  mounted() {

  },
  methods:{
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
    confirmItemJoinGroup(ev){
      if(ev.button!==0){
        return false;
      }
      function randomNumber() {
        const min = 1000000;
        const max = 9999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      if(this.adjustItemOrderResponse.idA!==-1){
        let route=this.route;
        this.$emit('adjustItemOrderRequest',{
          code:randomNumber(),
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
      function randomNumber() {
        const min = 1000000;
        const max = 9999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      if(this.adjustItemOrderResponse.idA!==-1 && this.adjustItemOrderResponse.idA!==id){
        let offsetY=ev.offsetY;
        if(offsetY<40){
          this.$emit('adjustItemOrderRequest',{
            code:randomNumber(),
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
            code:randomNumber(),
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
          function randomNumber() {
            const min = 1000000;
            const max = 9999999;
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          if(this.grabItemState){
            if(this.adjustItemOrderResponse.idA!==this.grabItemId){
              this.$emit('adjustItemOrderRequest',{
                code:randomNumber(),
                stage:'ready',
                type:this.grabItemType,
                idA:this.grabItemId,
                layerA:this.layer.id,
              });//申请调序
            }
            if(event.x<this.grabSeparateLeft || event.x>this.grabSeparateRight){
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
          function randomNumber() {
            const min = 1000000;
            const max = 9999999;
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          if(this.grabItemState){
            this.$emit('adjustItemOrderRequest',{
              code:randomNumber(),
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
              this.$refs.memberTeamBox[this.grabIndex].style.background='white';
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
    focusGroupName(ev){
      this.oldGroupName=ev.target.innerText;
      this.onFocusMode();
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    blurGroupName(ev){
      let nowGroupName=ev.target.innerText;
      if(nowGroupName===''){
        this.$refs.groupListName.innerText=this.oldGroupName;
        this.$store.commit('setCoLogMessage',{text:'名称不能为空',from:'internal:OrangeGroupStructure',type:'tip'});
        return false;
      }
      this.noFocusMode();
      if(this.groupNameIllegal(nowGroupName)===true){
        this.$refs.groupListName.innerText=this.oldGroupName;
        this.$store.commit('setCoLogMessage',{text:'名称不能含有⇉符号',from:'internal:OrangeGroupStructure',type:'tip'});
        return false;
      }
      if(nowGroupName!==this.oldGroupName){
        function randomNumber() {
          const min = 1000000;
          const max = 9999999;
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        this.renameApprovalTemplate.code=randomNumber();
        this.renameApprovalTemplate.name=nowGroupName;
        this.groupNameRenameRequest(this.renameApprovalTemplate);
      }
    },
    groupNameIllegal(value){//检查分组名称是否含有非法字符
        return value.includes('⇉');
    },
    deleteGroup(){//删除此子分组 获取当前图层路由
      let routeArr=this.route.split('⇉');
      let newStructure=this.structureRemoveByGroup(this.layer.structure,routeArr);
      newStructure=this.removeUndefined(newStructure);
      let groupLayerId=this.layer.id;
      this.$store.state.serverData.socket.broadcastUpdateLayerData(
        {
          id:groupLayerId,
          structure:newStructure,
        }
      );
      this.memberHeadMenu.show=false;
    },
    createGroupAtBottom(){//在此分组底部新增子分组
      function randomNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      let groupLayerId=this.layer.id;
      let newGroupName='group-'+randomNumber();
      let newGroup=[
        newGroupName,
        {template:null}
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
        for (let i=0;i<structure.length;i++){//遍历此层结构数组
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
    /**移除图层的某个成员
     * @return false|mixed
     */
    removeLayerMember(){
      let layerId=this.layer.id;
      let targetId=this.memberItemMenu.target.id;
      let oldStructure=JSON.parse(JSON.stringify(this.layer.structure));
      let newMembers=JSON.parse(JSON.stringify(this.layer.members));
      delete newMembers[targetId];
      const typeMapping={point:1,line:2,area:3,curve:4};
      Object.keys(newMembers).forEach(item=>{
        newMembers[item]=typeMapping[newMembers[item].type]
        }
      );
      let route=this.route;
      let routeArr=route.split('⇉');
      routeArr=routeArr.filter((item)=>{return item!==''});
      let removeIndex=this.memberItemMenu.index;
      let newStructure=this.structureRemoveByItem(oldStructure,routeArr,removeIndex);
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
        for (let i=0;i<structure.length;i++){//遍历此层结构数组
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
    /**依据图层路由和图层结构删除分组
     * @return false|mixed
     * @param structure | array
     * @param route | array
     */
    structureRemoveByGroup(structure,route){
      if(route.length===1){//路由的尽头
        structure=undefined;
        return structure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳
        for (let i=0;i<structure.length;i++){//遍历此层结构数组
          if(Array.isArray(structure[i])){//查询此层子层
            if (structure[i][0]===nextRoute[0]){//此层子层的名称对应下一跳
              structure[i]=this.structureRemoveByGroup(structure[i],nextRoute);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return structure;
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
      this.memberHeadMenu.y=ev.y-15;
    },
    contextmenuHeadClose(){
      this.memberHeadMenu.show=false;
    },
    contextmenuItemOpen(ev,item,index){//成员右键菜单
      this.memberItemMenu.target=item;
      this.memberItemMenu.index=index;
      this.memberItemMenu.show=true;
      this.memberItemMenu.x=ev.x;
      this.memberItemMenu.y=ev.y-15;
    },
    contextmenuItemClose(){
      this.memberItemMenu.show=false;
      this.memberItemMenu.target=null;
      this.memberItemMenu.index=null;
      this.memberItemMenu.x=0;
      this.memberItemMenu.y=0;
    },
    expandGroup(){//展开或收起分组
      this.groupExpand=!this.groupExpand;
    },
    isArray(any){
      let isArray=Array.isArray(any);
      if(isArray===true){
        return any.length !== 0;
      }
    },
    extractLatter(){//提取除第1-2位,并去除未定义的引用id
      let member=this.structure.slice(2);
      let length=member.length;
      for(let i=0;i<length;i++){
        if(typeof member[i]==='number'){
          if(!this.layer.members.hasOwnProperty(member[i])){
            member.splice(i,1);
          }
        }
      }
      return member;
    },
    extractNumber(){//提取除第1-2位外过滤子分组,并去除未定义的引用id
      let latter=this.structure.slice(2);
      let length=latter.length;
      for(let i=0;i<length;i++){
        if(typeof latter[i]==='number'){
          if(!this.layer.members.hasOwnProperty(latter[i])){
            latter.splice(i,1);
          }
        }
      }
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
    showTeamEyeA(item){
      return this.hiddenElements.some((member)=>{return member.id===this.layer.members[item].id});
    },
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
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
    },
    renameResponse:{
      handler(newValue){
        if(newValue.code===this.renameApprovalTemplate.code){
          if(newValue.agree===true){
            let groupLayerId=this.layer.id;
            let routeArr=this.route.split('⇉');
            let newName=newValue.name;
            let newStructure=this.structureRenameByGroup(this.layer.structure,routeArr,newName);
            this.$store.state.serverData.socket.broadcastUpdateLayerData(
              {
                id:groupLayerId,
                structure:newStructure,
              }
            );
          }else{
            this.$refs.groupListName.innerText=this.oldGroupName;
            this.$store.commit('setCoLogMessage',{text:'同组同级分组中不能存在同名分组',from:'internal:OrangeGroupStructure',type:'tip'});
          }
        }
      },
      deep:true
    }
  }
}
</script>

<style scoped>
.groupListName{
  outline: none;
}
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
  max-width: 246px;/*246px与拖拽计算点击位置绑定，不可修改*/
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
