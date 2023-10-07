<template>
  <div class="groupLayersBox" ref="layerSeparate">
    <div class="eyebrow" ref="eyebrow">
      <div class="eyebrowLeft" @mousedown.stop="grabLayerStart($event)" @mouseup="grabLayerEnd($event)">
        <div class="previewEyeL">
          <preview-eye></preview-eye>
        </div>
        <div class="groupLayerNameBox">
          <span contenteditable="false" class="groupLayerName" v-text="groupLayerHeadText" :title="'layer'+layer.id"></span>
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
        <div class="layerMoreAction" title="检查并修复图层异常问题" @click.stop="repairLayer()">
          检查并修复此图层
        </div>
        <div class="layerMoreAction" title="删除图层，不会删除其中的元素" @click.stop="deleteLayer()">
          删除图层
        </div>
      </div>
    </div>
    <div class="content" ref="content">
      <orange-group-structure :layer="layer" :all-expand="allExpand" :level="1" :route="layer.structure[0]" :structure="layer.structure" :rename-response="renameApprovalResult" :adjust-item-order-response="adjustItemOrderResponse" @renameRequest="renameRequestCheck" @adjustItemOrderRequest="adjustItemOrderApproval"></orange-group-structure>
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
      groupLayerHeadText:'分组图层',
      layerActionsOpen:false,
      allExpand:true,
      renameApprovalResult:{
        agree:false,
        code:1,
        name:'',
      },
      grabLayerState:false,
      grabLayerPosOffsetY:0,
      grabLayerPosOffsetX:0,
      grabLayerSeparate:false,//本图层是否脱离面板独立存在
      grabSeparateLeft:20,//拖动独立x轴的左侧条件
      grabSeparateRight:320,//拖动独立x轴的右侧条件
      moveObServe:null,
    }
  },
  components:{PreviewEye,More,OrangeGroupStructure},
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
  },
  methods:{
    /**依据图层路由和图层结构在头部加入值
     * @return false|mixed
     * @param structure | array
     * @param route | array
     * @param value | int
     */
    structureJoinByItem(structure,route,value){
      if (route.length===1){//路由的尽头
        structure.splice(2,0,value);
        return structure;
      }else{//存在下一跳
        const nextRoute=route.slice(1);//下一跳
        for (let i=0;i<structure.length;i++){//遍历此层结构数组
          if(Array.isArray(structure[i])){//查询此层子层
            if (structure[i][0]===nextRoute[0]){//此层子层的名称对应下一跳
              structure[i]=this.structureJoinByItem(structure[i],nextRoute,value);//递归此子层及下一跳
              break;
            }
          }
        }
      }
      return structure;
    },
    adjustItemOrderApproval(data){
      this.$emit('adjustItemOrderRequest',data);//转发申请
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
      this.$refs.eyebrow.style.userSelect='none';
      this.$refs.eyebrow.style.background='white';
      this.$refs.eyebrow.style.zIndex='666';
      this.groupLayerHeadText='已选中';
      this.pickLayer();
      this.grabLayerPosOffsetY=ev.offsetY+correct.y;
      this.grabLayerPosOffsetX=ev.offsetX+correct.x;
      this.grabLayerState=true;
      this.grabLayerMoveObserve();
    },
    pickLayer(){
      if(this.pickLayerResponse.id==this.layer.id){
        return false;
      }
      function randomNumber() {
        const min = 1000000;
        const max = 9999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      this.$emit('pickLayerRequest',{
        code:randomNumber(),
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
          function randomNumber() {
            const min = 1000000;
            const max = 9999999;
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          if(this.grabLayerState){
            if(this.adjustOrderResponse.id!==this.layer.id){
              this.$emit('adjustOrderRequest',{
                code:randomNumber(),
                id:this.layer.id,
              });//申请调序
            }
            if(event.x<this.grabSeparateLeft || event.x>this.grabSeparateRight){
              this.groupLayerHeadText='拖至头部插入前面反之后面';
              this.$refs.layerSeparate.style.position='fixed';
              this.$refs.layerSeparate.style.zIndex='666';
              this.$refs.layerSeparate.style.left=event.x-this.grabLayerPosOffsetX+'px';
              this.$refs.layerSeparate.style.top=event.y-this.grabLayerPosOffsetY+'px';
              this.$refs.layerSeparate.style.background='white';
              this.grabLayerSeparate=false;
            }else {
              this.groupLayerHeadText='可拖动至面板之外或松开';
              this.$refs.layerSeparate.style.pointerEvents='none';
              this.$refs.layerSeparate.style.position='fixed';
              this.$refs.layerSeparate.style.left='';
              this.$refs.layerSeparate.style.top=event.y-this.grabLayerPosOffsetY+'px';
              this.$refs.layerSeparate.style.background='white';
              this.grabLayerSeparate=true;
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
          if(this.grabLayerState){
            this.$emit('adjustOrderRequest',{
              code:randomNumber(),
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
        if(this.groupLayers[key].structure[0]===newName){
          count++;
          break;
        }
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
    deleteLayer(){
      this.$store.state.serverData.socket.broadcastDeleteLayer(this.layer.id);
    },
    repairLayer(){
      let layerBasicCk=false;//图层基础属性检测
      let structureBasicCk=false;//结构基础检测
      let errorCount=0;
      let normalCount=0;
      layerBasicCk=this.layerBasicCheck();
      structureBasicCk=this.structureBasicCheck(this.layer.structure);
      if(layerBasicCk){
        normalCount++;
      }else {
        errorCount++;
      }
      if(layerBasicCk){
        normalCount++;
      }else {
        errorCount++;
      }
      this.$root.general_script.alert_tips('已完成'+(errorCount+normalCount)+'项检测，通过 '+normalCount+' 项');
      this.$root.general_script.alert_tips('已自动对齐成员结构');
      this.redundantAndUndefinedMemberCheck();
      this.switchLayerActions();
    },
    layerBasicCheck(){//图层属性基础检测
      try {
        if(!this.layer.hasOwnProperty('id')){
          this.$root.general_script.alert_tips('此图层缺失关键属性');
          return false;
        }
        if(!this.layer.hasOwnProperty('type')){
          this.$root.general_script.alert_tips('此图层缺失类型属性');
          return false;
        }
        if(!this.layer.hasOwnProperty('members')){
          this.$root.general_script.alert_tips('此图层缺失成员属性');
          return false;
        }
        if(!this.layer.hasOwnProperty('structure')){
          this.$root.general_script.alert_tips('此图层缺失结构属性');
          return false;
        }
        return true;
      }catch (e) {
        this.$root.general_script.alert_tips('检测图层结构时异常退出');
        return false;//检测异常
      }
    },
    structureBasicCheck(arr){//图层结构检测
      try{
        if (arr.length<2){//检查数组长度
          this.$root.general_script.alert_tips('结构中存在异常长度的图层结构');
          return false;
        }
        if (typeof arr[0]!=='string' || arr[0]===''){//检查第一位是否为非空字符串
          this.$root.general_script.alert_tips('结构中存在无效的图层名称');
          return false;
        }
        if (typeof arr[1]!=='object' || arr[1]===null || !arr[1].hasOwnProperty('template')){//检查第二位是否为包含template属性的对象
          this.$root.general_script.alert_tips('结构中缺失模板属性');
          return false;
        }
        for(let i=2;i<arr.length;i++){//检查剩余元素
          if(Array.isArray(arr[i])){
            if(!this.structureBasicCheck(arr[i]))return false;
          }else if(!Number.isInteger(arr[i])){
            this.$root.general_script.alert_tips('结构中存在错误引用的成员');
            return false;
          }
        }
        return true;//全部检查通过
      }catch(e){
        this.$root.general_script.alert_tips('检测结构时异常退出');
        return false;//检测异常
      }
    },
    redundantAndUndefinedMemberCheck(){//冗余和未定义id检测与修复
      try {
        function extractNumbers(arr){//提取结构中的元素id
          let result=[];
          arr.forEach(item=>{
            if(Array.isArray(item)){
              result=result.concat(extractNumbers(item));
            }else if(Number.isInteger(item)){
              result.push(item);
            }
          });
          return result;
        }
        function removeStructureItem(structure,removeMembers){//依据removeMembers|Array 移除structure中未定义的元素
          return structure.reduce((acc,val)=>{
            if(Array.isArray(val)){//是分组数组
              acc.push(removeStructureItem(val,removeMembers));
            }else if(typeof val==='number' && !removeMembers.includes(val)){//是数字且不在移除列表中
              acc.push(val);
            }else if(typeof val!=='number'){//是非元素id的元素
              acc.push(val);
            }
            return acc;
          },[]);
        }
        let groupLayerId=this.layer.id;
        let needUpdateMembers=false;
        let needUpdateStructure=false;
        let undefinedMembers=[];
        let newMembers={};
        let newStructure=undefined;
        const typeMapping={point:1,line:2,area:3,curve:4};
        const numbersInStructure=extractNumbers(this.layer.structure);
        const length=numbersInStructure.length;
        for(let nowMember in this.layer.members){//检测并移除冗余的id
          let lock=true;
          for(let i=0;i<length;i++){
            if(nowMember==numbersInStructure[i]){
             lock=false;
             break;
            }
          }
          if(lock){
            needUpdateMembers=true;
            delete this.layer.members[nowMember];
          }
        }
        for(let x=0;x<length;x++){//检测未定义的引用id
          if(!this.layer.members.hasOwnProperty(numbersInStructure[x])){//属于未定义元素id
            needUpdateStructure=true;
            undefinedMembers.push(numbersInStructure[x]);
          }
        }
        if(needUpdateStructure){
          newStructure=removeStructureItem(this.layer.structure,undefinedMembers);
        }
        if(needUpdateMembers){
          Object.keys(this.layer.members).forEach(item=>{
              newMembers[item]=typeMapping[this.layer.members[item].type]
            }
          );
        }
        if(needUpdateStructure && needUpdateMembers){
          this.$store.state.serverData.socket.broadcastUpdateLayerData(
            {id:groupLayerId,
              structure:newStructure,
              members:newMembers,}
          );
        }else if(!needUpdateStructure && needUpdateMembers){
          this.$store.state.serverData.socket.broadcastUpdateLayerData(
            {id:groupLayerId,
              members:newMembers,}
          );
        }else if(needUpdateStructure && !needUpdateMembers){
          this.$store.state.serverData.socket.broadcastUpdateLayerData(
            {id:groupLayerId,
              structure:newStructure,}
          );
        }
      }catch (e) {
        this.$root.general_script.alert_tips('检测重复和未定义成员时异常退出');
        return false;//检测异常
      }
    },
    insertItemInStructure(structure,idA,idB,type){
      function insertNumber(arr, insertNumA, insertNumB, insertType) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
          if (Array.isArray(arr[i])) {
            result.push(insertNumber(arr[i], insertNumA, insertNumB, insertType));
          } else {
            if (arr[i] === insertNumA) {
              if (insertType === 'up') {
                result.push(insertNumB, arr[i]);
              } else {
                result.push(arr[i], insertNumB);
              }
            } else {
              result.push(arr[i]);
            }
          }
        }
        return result;
      }
      return  insertNumber(structure,idB,idA,type);
    },
    deleteItemInStructure(deleteId){//删除结构中的元素并返回新结构
      function deleteNumber(arr, deleteNum) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
          if (Array.isArray(arr[i])) {
            result.push(deleteNumber(arr[i], deleteNum));
          } else if (arr[i] !== deleteNum) {
            result.push(arr[i]);
          }
        }
        return result;
      }
      return deleteNumber(this.layer.structure,deleteId);
    },
    deleteItemInMembers(deleteId){//删除成员并返回新成员对象
      let oldMembers=this.layer.members;
      delete oldMembers[deleteId];
      const typeMapping={point:1,line:2,area:3,curve:4};
      let newMembers={};
      Object.keys(oldMembers).forEach(item=>{
          newMembers[item]=typeMapping[oldMembers[item].type]
        }
      );
      return newMembers;
    },
    appendNewItemToMembers(newId,type){//向成员新增新元素
      newId=parseInt(newId)
      let oldMembers=this.layer.members;
      const typeMapping={point:1,line:2,area:3,curve:4};
      if(oldMembers.hasOwnProperty(newId)){
        return false;
      }
      if(typeMapping[type]===undefined){
        return false;
      }
      let mixMembers={};
      Object.keys(oldMembers).forEach(item=>{
          mixMembers[item]=typeMapping[oldMembers[item].type]
        }
      );
      mixMembers[newId]=typeMapping[type];
      return mixMembers;
    },
    appendNewItemToStructure(newId){//向首层附加新元素
      let mixStructure=JSON.parse(JSON.stringify(this.layer.structure));
      mixStructure.splice(2,0,newId);
      return mixStructure;
    }
  },
  computed:{
    lastDeleteId(){//用于检测删除的元素
      return this.$store.state.recorderConfig.lastDeleteId;
    },
    lastUploadId(){
      return this.$store.state.recorderConfig.lastUploadId;
    },
    lastUploadClass(){
      return this.$store.state.recorderConfig.lastUploadClass;
    },
  },
  watch:{
    pickLayerResponse:{
      handler(newValue){
        if(newValue.id==this.layer.id){
          this.$refs.layerSeparate.classList.add('selectedLayer');
        }else {
          this.$refs.layerSeparate.classList.remove('selectedLayer');
        }
      },
      deep:true
    },
    lastDeleteId:{
      handler(newValue){
        let ID=parseInt(newValue);
        if(this.layer.members.hasOwnProperty(ID)){
          let newStructure=this.deleteItemInStructure(ID);
          let newMembers=this.deleteItemInMembers(ID);
          this.$store.state.serverData.socket.broadcastUpdateLayerData(
            {id:this.layer.id,
              members:newMembers,
              structure:newStructure,
            }
          );
        }
      }
    },
    lastUploadId:{
      handler(newValue){
        if(this.pickLayerResponse.id!==this.layer.id){//未选中自身不做为
          return false;
        }
        let ID=parseInt(newValue);
        if(!this.layer.members.hasOwnProperty(ID)){
          let newMembers=this.appendNewItemToMembers(ID,this.lastUploadClass);
          let newStructure=null;
          if(newMembers!==false){
            newStructure=this.appendNewItemToStructure(ID);
          }
          this.$store.state.serverData.socket.broadcastUpdateLayerData({
            id:this.layer.id,
            members:newMembers,
            structure:newStructure,
          });
        }
      }
    },
    adjustItemOrderResponse:{
      handler(newValue){
        let stage=newValue.stage;
        if(stage==='confirm'){
          let layerIdA=parseInt(newValue.layerA);
          let layerIdB=parseInt(newValue.layerB);
          let idA=parseInt(newValue.idA);
          let idB=parseInt(newValue.idB);
          let type=newValue.pattern;
          let elementType=newValue.type;
          if(layerIdA==this.layer.id || layerIdB==this.layer.id){//与本图层有关系
            if(type!=='join'){
              if(layerIdA===layerIdB){//同组内调序
                let stepArrA=this.deleteItemInStructure(idA);//删除同组的idA
                let stepArrB=this.insertItemInStructure(stepArrA,idA,idB,type);//插入
                this.$store.state.serverData.socket.broadcastUpdateLayerData({
                  id:this.layer.id,
                  structure:stepArrB,
                });
              }else {//两组间交换
                let lock=true;
                let layerB=newValue.layerB;
                let idTemp=newValue.idA;
                for(let key in this.groupLayers){//检测idA在layerB中是否存在
                  if(this.groupLayers[key].id==layerB){
                    if(this.groupLayers[key].members.hasOwnProperty(idTemp)){
                      lock=false;
                    }
                    break;
                  }
                }
                if(lock){//通过检测
                  if(layerIdA==this.layer.id){//layerA方舍弃idA
                    let stepArrA=this.deleteItemInStructure(idA);//删除同组的idA
                    const typeMapping={point:1,line:2,area:3,curve:4};
                    delete this.layer.members[idA];//删除members
                    let newMembers={};
                    Object.keys(this.layer.members).forEach(item=>{
                        newMembers[item]=typeMapping[this.layer.members[item].type]
                      }
                    );
                    this.$store.state.serverData.socket.broadcastUpdateLayerData({
                      id:this.layer.id,
                      structure:stepArrA,
                      members:newMembers,
                    });
                  }else{//另一方新增插入idA
                    let stepArrB=this.insertItemInStructure(this.layer.structure,idA,idB,type);//插入
                    const typeMapping={point:1,line:2,area:3,curve:4};
                    let newMembers={};
                    Object.keys(this.layer.members).forEach(item=>{
                        newMembers[item]=typeMapping[this.layer.members[item].type]
                      }
                    );
                    newMembers[idA]=typeMapping[elementType];//add members
                    this.$store.state.serverData.socket.broadcastUpdateLayerData({
                      id:this.layer.id,
                      structure:stepArrB,
                      members:newMembers,
                    });
                  }
                }else {//未通过检测
                  this.$root.general_script.alert_tips('对方图层已存在此元素');
                }
              }
            }else if(type==='join'){//join idB = group route
              if(newValue.idA!==-1 && newValue.idB!==-1
              && newValue.layerA!==-1 && newValue.layerB!==-1
              && newValue.type!==null){
                let idA=parseInt(newValue.idA);
                let route=newValue.idB.split('⇉');
                let layerA=parseInt(newValue.layerA);
                let layerB=parseInt(newValue.layerB);
                let elementType=newValue.type;
                if(layerA===layerB){//同图层内部交换
                  let stepArrA=this.deleteItemInStructure(idA);
                  let stepArrB=this.structureJoinByItem(stepArrA,route,idA);
                  this.$store.state.serverData.socket.broadcastUpdateLayerData({
                    id:this.layer.id,
                    structure:stepArrB,
                  });
                }else {//两图层交换
                  let lock=true;
                  for(let key in this.groupLayers){//检测idA在layerB中是否存在
                    if(this.groupLayers[key].id==layerB){
                      if(this.groupLayers[key].members.hasOwnProperty(idA)){
                        lock=false;
                      }
                      break;
                    }
                  }
                  if(lock){
                    if(layerA==this.layer.id){//layerA方舍弃idA
                      let stepArrA=this.deleteItemInStructure(idA);//删除同组的idA
                      const typeMapping={point:1,line:2,area:3,curve:4};
                      delete this.layer.members[idA];//删除members
                      let newMembers={};
                      Object.keys(this.layer.members).forEach(item=>{
                          newMembers[item]=typeMapping[this.layer.members[item].type]
                        }
                      );
                      this.$store.state.serverData.socket.broadcastUpdateLayerData({
                        id:this.layer.id,
                        structure:stepArrA,
                        members:newMembers,
                      });
                    }else {//另一方添加成员和修改结构
                      let stepArrB=this.structureJoinByItem(this.layer.structure,route,idA);//插入
                      const typeMapping={point:1,line:2,area:3,curve:4};
                      let newMembers={};
                      Object.keys(this.layer.members).forEach(item=>{
                          newMembers[item]=typeMapping[this.layer.members[item].type]
                        }
                      );
                      newMembers[idA]=typeMapping[elementType];//add members
                      this.$store.state.serverData.socket.broadcastUpdateLayerData({
                        id:this.layer.id,
                        structure:stepArrB,
                        members:newMembers,
                      });
                    }
                  }else {
                    this.$root.general_script.alert_tips('对方图层已存在此元素');
                  }
                }
              }
            }
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
  border-left:2px solid #4d90fe;
}
.groupLayersBox{
  min-height: 120px;
  width: 246px;/*246px与拖拽计算点击位置绑定，不可修改*/
  font-size: 14px;
  font-weight: 400;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
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
