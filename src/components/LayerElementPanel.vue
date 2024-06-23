<template>
  <div class="elementPanelLayer" v-show="showPanel">
    <div class="panelHead">
      <div class="headTitle">
        <span v-text="this.$store.state.serverData.socket.config.name"/>
        <div class="headTitleMore" @click.stop="switchMapMoreActions()">
          <more/>
        </div>
        <div class="mapMoreActionsClose" @contextmenu.prevent="void 1" @click.stop="switchMapMoreActions()" v-show="mapMoreActionsOpen">
        </div>
        <div class="mapMoreActions" v-show="mapMoreActionsOpen">
          <div class="mapMoreAction" @click.stop="importData()" title="可以导入其他在线地图的数据">
            导入 OMD 地图数据
          </div>
          <div class="mapMoreAction" @click.stop="exportData()" title="可以导出此地图数据至本地">
            导出地图数据为 OMD
          </div>
        </div>
      </div>
      <div class="headText">
        Test Mode
      </div>
      <div class="headText">
        上次修改时间&nbsp;&nbsp;&nbsp;<span v-text="this.$store.state.serverData.socket.lastEdit"/>
      </div>
    </div>
    <div class="panelButton">
      <div class="buttonBox">
        <add-new-group/>
        <div class="buttonBoxText" @click="createGroupLayer()">
          新建分组图层
        </div>
      </div>
      <div class="buttonBox">
        <sun-active/>
        <div class="buttonBoxText">
          活动图层
        </div>
      </div>
    </div>
    <div class="panelContent" ref="panelContent" @contextmenu.prevent="void 1">
      <banana-group-layer v-for="layerId in mapLayerOrder" :key="layerId"
        :layer="groupLayers[layerId]" :group-layers="groupLayers"
        :adjust-order-response="adjustOrderTemplate"
        :adjust-item-order-response="adjustItemOrderTemplate"
        :pick-layer-response="pickLayerTemplate"
        @pickLayerRequest="pickLayerApproval"
        @adjustOrderRequest="adjustOrderApproval"
        @adjustItemOrderRequest="adjustItemOrderApproval">
      </banana-group-layer>
    </div>
    <div class="panelSearch">
      <div class="searchViewClose" v-show="searchResult.length!==0" @click.stop="openSearchView()">
        <img alt="下拉按钮" :src="dropPng" ref="searchViewClose" title="点击隐藏" draggable="false"/>
      </div>
      <div class="searchViewBox" v-show="searchShowView">
        <div class="searchView" v-show="searchFind">
          <div class="searchItem" @click="locateToElement(item)" v-for="item in searchResult" :title="'ID'+item.id">
            <point :custom="'fill:#'+item.color+';margin:0px 4px'" v-if="item.type==='point'"/>
            <segment-line :custom="'fill:#'+item.color+';margin:0px 4px'" v-if="item.type==='line'"/>
            <region :custom="'fill:#'+item.color+';margin:0px 4px'" v-if="item.type==='area'"/>
            <span class="memberName" v-text="getItemName(item)"/>
          </div>
        </div>
        <div class="searchView" v-show="!searchFind">
          <span class="searchItemName">暂无结果</span>
        </div>
      </div>
      <div class="searchContentBox">
        <div class="searchContent" contenteditable="true" ref="searchInput" @keydown.enter="search()" @focus="onFocusMode()" @blur="noFocusMode()">

        </div>
        <div class="searchIcon" @click="resetSearch()">
          <reset-refresh custom="transform:translate(2px,0px);"/>
        </div>
        <div class="searchIcon" @click="search()">
          <search custom="transform:translate(1px,2px);"/>
        </div>
      </div>
    </div>
    <banana-template-edit/>
  </div>
</template>
<script>
import BananaTemplateEdit from "./BananaTemplateEdit";
import dropPng from '../../static/dropDown.png';
import ResetRefresh from "./svgValidIcons/resetRefresh";
import ExpandMore from "./svgValidIcons/expandMore";
import Region from "./svgValidIcons/region";
import SegmentLine from "./svgValidIcons/segmentLine";
import Point from "./svgValidIcons/point";
import AddNewLayer from "./svgValidIcons/addNewLayer";
import AddNewGroup from "./svgValidIcons/addNewGroup";
import More from "./svgValidIcons/more";
import Search from "./svgValidIcons/search";
import EyeVisible from "./svgValidIcons/eyeVisible";
import EyeNotVisible from "./svgValidIcons/eyeNotVisible";
import SegmentCurve from "./svgValidIcons/segmentCurve";
import BananaGroupLayer from "./BananaGroupLayer";
import OrangeGroupList from "./OrangeGroupList";
import {mapState} from "vuex";
import SunActive from "./svgValidIcons/sunActive";

export default {
  name: "LayerElementPanel",
  components: {
    BananaTemplateEdit,
    SunActive,
    SegmentCurve,
    More,AddNewLayer,AddNewGroup,Point,SegmentLine,Region,ExpandMore,Search,
    EyeVisible,EyeNotVisible,BananaGroupLayer,OrangeGroupList,ResetRefresh
  },
  data(){
    return{
      dropPng,
      showPanel:true,
      searchResult:[],//{element}
      searchShowView:false,
      searchFind:false,
      groupLayers:{},
      mapMoreActionsOpen:false,//元素面板顶部更多按钮
      adjustOrderTemplate:{
        agree:false,
        code:null,
        id:-1,
      },
      adjustItemOrderTemplate:{
        agree:false,//通过与否
        code:null,//校验码
        stage:null,//提交阶段
        pattern:null,//插入的模式 up | down | join
        elementA:-1,//活动id
        templateA:-1,//活动a的所属模板id
        elementB:-1,//被动id
        templateB:-1,//被动b的所属模板id
      },
      pickLayerTemplate:{
        agree:false,
        code:null,
        id:-1,
      },
    }
  },
  created(){
    this.unwatch=this.$watch('mapLayerOrder',(newValue)=>{
      if(newValue.length>0){//自动选中第一个图层
        setTimeout(()=>{
          this.pickLayerTemplate.id=newValue[0];
        },5);
      }
      this.unwatch();//仅执行一次
    });
    this.unwatch2=this.$watch('mapLayerData',(newValue)=>{
      let num=newValue.length;
      for(let i=0;i<num;i++){
        let type=newValue[i].type;
        switch (type) {
          case 'group':{
            if(this.groupLayers.hasOwnProperty(newValue[i].id)){//重复则更新
              this.groupLayers[newValue[i].id].members=this.deconstructMembers(newValue[i].members);
              this.groupLayers[newValue[i].id].structure=newValue[i].structure;
            }else {//新增则加入
              let members=this.deconstructMembers(newValue[i].members);
              let layerId=newValue[i].id;
              let layerDataObj={
                id:layerId,
                type:newValue[i].type,
                members:members,
                structure:newValue[i].structure
              };
              this.$set(this.groupLayers,layerId,layerDataObj);
            }
            break;
          }
        }
      }
      this.unwatch2();//仅执行一次
    });
  },
  mounted(){
    this.startSetting();
  },
  methods:{
    startSetting(){
      setTimeout(
        ()=>{
          this.showPanel=this.openElementPanel;
        }
        ,this.$store.state.pageConfig.loadingTime+2
      );
    },
    openSearchView(){
      let sta=this.searchShowView;
      this.searchShowView=!sta;
      if(sta){
        this.$refs.searchViewClose.style.transform='rotate(180deg)';
      }else {
        this.$refs.searchViewClose.style.transform='rotate(0deg)';
      }
    },
    resetSearch(){
      this.searchShowView=false;
      this.searchFind=false;
      this.searchResult.length=0;
      this.$refs.searchInput.innerText='';
      this.$refs.searchViewClose.style.transform='rotate(0deg)';
    },
    search(){
      if(this.$store.state.serverData.socket===undefined){
        return false;
      }
      if(this.$store.state.serverData.socket.isLogin===false){
        this.$store.commit('setCoLogMessage',{text:'请登录后进行搜索',from:'internal:LayerElementPanel',type:'tip'});
        return false;
      }
      let inputValue=this.$refs.searchInput.textContent;
      if(inputValue.length===0){
        this.$store.commit('setCoLogMessage',{text:'请输入关键字',from:'internal:LayerElementPanel',type:'tip'});
        return false;
      }
      let ref=[];
      const Points=this.$store.state.serverData.socket.mapData.points;
      const Lines=this.$store.state.serverData.socket.mapData.lines;
      const Curves=this.$store.state.serverData.socket.mapData.curves;
      const Areas=this.$store.state.serverData.socket.mapData.areas;
      const LengthP=Points.length;
      const LengthL=Lines.length;
      const LengthC=Curves.length;
      const LengthA=Areas.length;
      for(let i=0;i<LengthP;i++){
        if(this.getItemName(Points[i]).includes(inputValue)){
          ref.push(Points[i]);
        }
      }
      for(let j=0;j<LengthL;j++){
        if(this.getItemName(Lines[j]).includes(inputValue)){
          ref.push(Lines[j]);
        }
      }
      for(let x=0;x<LengthC;x++){
        if(this.getItemName(Curves[x]).includes(inputValue)){
          ref.push(Curves[x]);
        }
      }
      for(let x=0;x<LengthA;x++){
        if(this.getItemName(Areas[x]).includes(inputValue)){
          ref.push(Areas[x]);
        }
      }
      if(ref.length===0){
        this.searchShowView=true;
        this.searchFind=false;
        this.searchResult.length=0;
      }else {
        this.searchShowView=true;
        this.searchFind=true;
        this.searchResult=ref;
      }
    },
    adjustItemOrderApproval(template){//审批成员排序
      let stage=template.stage;
      switch (stage) {
        case 'ready':{
          this.adjustItemOrderTemplate.agree=false;
          this.adjustItemOrderTemplate.code=template.code;
          this.adjustItemOrderTemplate.stage=template.stage;
          this.adjustItemOrderTemplate.elementA=template.elementA;
          this.adjustItemOrderTemplate.templateA=template.templateA;
          break;
        }
        case 'confirm':{
          this.adjustItemOrderTemplate.agree=true;
          this.adjustItemOrderTemplate.code=template.code;
          this.adjustItemOrderTemplate.stage=template.stage;
          this.adjustItemOrderTemplate.pattern=template.pattern;
          this.adjustItemOrderTemplate.elementA=template.elementA;
          this.adjustItemOrderTemplate.templateA=template.templateA;
          this.adjustItemOrderTemplate.elementB=template.elementB;
          this.adjustItemOrderTemplate.templateB=template.templateB;
          break;
        }
        case 'cancel':{
          this.adjustItemOrderTemplate.agree=false;
          this.adjustItemOrderTemplate.code=template.code;
          this.adjustItemOrderTemplate.stage=template.stage;
          this.adjustItemOrderTemplate.pattern=null;
          this.adjustItemOrderTemplate.elementA=-1;
          this.adjustItemOrderTemplate.templateA=-1;
          this.adjustItemOrderTemplate.elementB=-1;
          this.adjustItemOrderTemplate.templateB=-1;
          break;
        }
      }
    },
    pickLayerApproval(template){
      this.pickLayerTemplate.agree=true;
      this.pickLayerTemplate.code=template.code;
      this.pickLayerTemplate.id=template.id;
    },
    adjustOrderApproval(template){//审批图层排序
      this.adjustOrderTemplate.agree=true;
      this.adjustOrderTemplate.code=template.code;
      this.adjustOrderTemplate.id=template.id;
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
    createGroupLayer(){//添加新的分组图层
      this.$store.state.serverData.socket.broadcastCreateGroupLayer();
    },
    exportData(){//导出图层和地图数据
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.isLogin===true){
          let serverName=this.$store.state.serverData.socket.config.name;
          let serverAddress=this.$store.state.serverData.socket.url;
          let layerData=JSON.parse(JSON.stringify(this.mapLayerData));
          let orderData={
            id:this.$store.state.serverData.socket.mapLayerOrderId,
            type:'order',
            members:JSON.parse(JSON.stringify(this.mapLayerOrder)),
            structure:'',
            phase:1
          };
          if(Array.isArray(layerData)){
            layerData.unshift(orderData);
          }
          let mapData={
            points:JSON.parse(JSON.stringify(this.PointData)),
            lines:JSON.parse(JSON.stringify(this.PolyLineData)),
            areas:JSON.parse(JSON.stringify(this.AreaData)),
            curves:JSON.parse(JSON.stringify(this.CurveData))
          };
          let lenArea=mapData.areas.length;
          let lenLines=mapData.lines.length;
          let lenCurve=mapData.curves.length;
          let lenPoint=mapData.points.length;
          let lenLayer=layerData.length;
          for(let i=0;i<lenArea;i++){
            mapData.areas[i].point=mapData.areas[i].basePoint;
            mapData.areas[i].points=mapData.areas[i].basePoints;
            mapData.areas[i].phase=parseInt(mapData.areas[i].phase);
            mapData.areas[i].width=parseInt(mapData.areas[i].width);
            delete mapData.areas[i].basePoint;
            delete mapData.areas[i].basePoints;
          }
          for(let i=0;i<lenLines;i++){
            mapData.lines[i].point=mapData.lines[i].basePoint;
            mapData.lines[i].points=mapData.lines[i].basePoints;
            mapData.lines[i].phase=parseInt(mapData.lines[i].phase);
            mapData.lines[i].width=parseInt(mapData.lines[i].width);
            delete mapData.lines[i].basePoint;
            delete mapData.lines[i].basePoints;
          }
          for(let i=0;i<lenCurve;i++){
            mapData.curves[i].point=mapData.curves[i].basePoint;
            mapData.curves[i].points=mapData.curves[i].basePoints;
            mapData.curves[i].phase=parseInt(mapData.curves[i].phase);
            mapData.curves[i].width=parseInt(mapData.curves[i].width);
            delete mapData.curves[i].basePoint;
            delete mapData.curves[i].basePoints;
          }
          for(let i=0;i<lenPoint;i++){
            mapData.points[i].point=mapData.points[i].basePoint;
            mapData.points[i].points=mapData.points[i].basePoints;
            mapData.points[i].phase=parseInt(mapData.points[i].phase);
            mapData.points[i].width=parseInt(mapData.points[i].width);
            delete mapData.points[i].basePoint;
            delete mapData.points[i].basePoints;
          }
          for(let i=0;i<lenLayer;i++){
            layerData[i].phase=parseInt(layerData[i].phase);
            delete layerData[i].hasChange;
          }
          let OMD={
            omd:'omd',
            type:'All',
            version:'1.0',
            serverName,
            serverAddress,
            layerData,
            mapData
          };
          const file=new Blob([JSON.stringify(OMD)], {type: 'application/json'});
          const a = document.createElement('a');
          a.href = URL.createObjectURL(file);
          a.download = serverName+'.omd';
          a.click();
          this.$store.commit('setCoLogMessage',{text:'导出成功',from:'internal:LayerElementPanel',type:'tip'});
        }
      }
      this.switchMapMoreActions();
    },
    importData(){//导入数据
      this.$store.commit('setCoLogMessage',{text:'暂不支持',from:'internal:LayerElementPanel',type:'tip'});
      this.switchMapMoreActions();
    },
    switchMapMoreActions(){
      this.mapMoreActionsOpen=!this.mapMoreActionsOpen;
    },
    hiddenElement(id,type){//隐藏某元素
      if(!this.mapHiddenElements.has(id)){
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
      let moveY=screenCenter.y-elementPosition.y;
      this.$store.state.mapConfig.A1.x-=moveX;
      this.$store.state.mapConfig.A1.y+=moveY;
      this.$store.state.baseMapConfig.baseMap.view.offsetX+=moveX;
      this.$store.state.baseMapConfig.baseMap.view.offsetY+=moveY;
      this.$store.state.baseMapConfig.baseMap.render();
      this.$store.state.cameraConfig.mixCanvasFlash=!this.$store.state.cameraConfig.mixCanvasFlash
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
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
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
    getMapLayer(){
      this.$store.state.serverData.socket.getMapLayer();
    },
    /**成员映射 图层解析 Member resolution
     *  由{id:num}
     *  变为{id:{element object}}
     **/
    deconstructMembers(members){
      let ref={
        //'23':{...}//element id => element data
      };
      let pointsMap=new Map(this.PointData.map(it=>[it.id,it]));
      let linesMap=new Map(this.PolyLineData.map(it=>[it.id,it]));
      let areasMap=new Map(this.AreaData.map(it=>[it.id,it]));
      let curvesMap=new Map(this.CurveData.map(it=>[it.id,it]));
      Object.keys(members).forEach(
        (item)=>{
          let element=[members[item]+'',item];//[类型数字,ID]
          let ID=parseInt(element[1]);
          switch(element[0]){
            case '1':{ref[item]=pointsMap.get(ID);break;}
            case '2':{ref[item]=linesMap.get(ID);break;}
            case '3':{ref[item]=areasMap.get(ID);break;}
            case '4':{ref[item]=curvesMap.get(ID);break;}
          }
        }
      );
      return ref;
    }
  },
  computed:{
    ...mapState({
      hiddenElements:state=>state.elementPanelConfig.hiddenElements
    }),
    updateLayerIds(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.updateLayerIds;
      }else{
        return [];
      }
    },
    createLayerId(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.createLayerId;
      }else{
        return -1;
      }
    },
    lastPSEndId(){//array element id list
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastPSEndId;
      }else{
        return [];
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
    mapHiddenElements(){
      let map=new Map();
      this.hiddenElements.forEach(value=>map.set(value.id,true));
      return map;
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
    mapLayerData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapLayerData;
      }else{
        return [];
      }
    },
    mapLayerOrder(){
      return this.$store.state.serverData.socket.mapLayerOrder;
    },
    deleteLayerId(){
      return this.$store.state.serverData.socket.deleteLayerId;
    },
    openElementPanel(){
      return this.$store.state.userSettingConfig.openElementPanel;
    }
  },
  watch:{
    openElementPanel:{
      handler(newValue){
        this.showPanel=newValue;
      }
    },
    lastPSEndId:{
      handler(newValue){
        if(newValue.includes(this.$store.state.detailsPanelConfig.target)){//如果当前编辑的元素在被清除选中要素列表中则清除属性面板
          this.$store.state.detailsPanelConfig.target=-1;
          this.$store.state.detailsPanelConfig.data={point:{x:null,y:null}};
        }
      }
    },
    pickElements:{
      handler(newValue,oldValue){
        function compareMaps(newValue,oldValue) {
          let newKeys=Array.from(newValue.keys());
          let oldKeys=Array.from(oldValue.keys());
          let addedKeys=newKeys.filter(key=>!oldValue.has(key));
          let removedKeys=oldKeys.filter(key=>!newValue.has(key));
          return {addedKeys,removedKeys}
        }
        try {
          let difference=compareMaps(newValue,oldValue);
          let addLength=difference.addedKeys.length;
          let removeLength=difference.removedKeys.length;
          for(let i=0;i<addLength;i++){
            let pickMember=this.$refs['memberActivity'+difference.addedKeys[i]][0];
            pickMember.firstChild.style.display='flex';
            pickMember.firstChild.firstChild.innerText=newValue.get(difference.addedKeys[i]).user;
          }
          for(let j=0;j<removeLength;j++){
            let pickMember=this.$refs['memberActivity'+difference.removedKeys[j]][0];
            pickMember.firstChild.style.display='none';
            pickMember.firstChild.firstChild.innerText='';
          }
        }catch (e) {

        }
      }
    },
    selectElements:{
      handler(newValue,oldValue){
        function compareMaps(newValue,oldValue) {
          let newKeys=Array.from(newValue.keys());
          let oldKeys=Array.from(oldValue.keys());
          let addedKeys=newKeys.filter(key=>!oldValue.has(key));
          let removedKeys=oldKeys.filter(key=>!newValue.has(key));
          return {addedKeys,removedKeys}
        }
        try {
          let difference=compareMaps(newValue,oldValue);
          let addLength=difference.addedKeys.length;
          let removeLength=difference.removedKeys.length;
          for(let i=0;i<addLength;i++){
            let pickMember=this.$refs['memberActivity'+difference.addedKeys[i]][0];
            pickMember.lastChild.style.display='flex';
            pickMember.lastChild.firstChild.innerText=newValue.get(difference.addedKeys[i]).user;
          }
          for(let j=0;j<removeLength;j++){
            let pickMember=this.$refs['memberActivity'+difference.removedKeys[j]][0];
            pickMember.lastChild.style.display='none';
            pickMember.lastChild.firstChild.innerText='';
          }
        }catch (e) {

        }
      }
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
          let Member=this.$refs['memberRightEye'+difference.addedKeys[i]][0];
          Member.firstChild.style.display='none';
          Member.lastChild.style.display='flex';
        }
        for(let j=0;j<removeLength;j++){
          let Member=this.$refs['memberRightEye'+difference.removedKeys[j]][0];
          Member.firstChild.style.display='flex';
          Member.lastChild.style.display='none';
        }
      }
    },
    updateLayerIds:{//图层更新监听
      handler(newValue){
        for(let k=0;k<newValue.length;k++){
          let id=newValue[k];
          if(!this.groupLayers.hasOwnProperty(id))return;//不存在的图层更新跳过
          let num=this.mapLayerData.length;
          for(let i=0;i<num;i++){
            if(this.mapLayerData[i].id!=id){continue;}
            this.groupLayers[id].members=this.deconstructMembers(this.mapLayerData[i].members);
            this.groupLayers[id].structure=this.mapLayerData[i].structure;
            break;
          }
        }
        this.$store.state.serverData.socket.updateLayerIds.length=0;//清空需要更新的id
      }
    },
    deleteLayerId:{//图层删除监听
      handler(deleteId){
        if(this.groupLayers.hasOwnProperty(deleteId)){
          delete this.groupLayers[deleteId];
        }
      }
    },
    createLayerId:{//图层新增监听
      handler(ID){
        if(this.groupLayers.hasOwnProperty(ID))return;//非新增图层
        let num=this.mapLayerData.length;
        for(let i=0;i<num;i++){
          if(this.mapLayerData[i].id!=ID){continue;}
          let members=this.deconstructMembers(this.mapLayerData[i].members);
          let layerId=this.mapLayerData[i].id;
          let layerDataObj={
            id:layerId,
            type:this.mapLayerData[i].type,
            members:members,
            structure:this.mapLayerData[i].structure
          };
          this.$set(this.groupLayers,layerId,layerDataObj);
          break;
        }
      },
      deep:true
    },
    isLogin:{
      handler(newValue){
        if(newValue===true){
          setTimeout(()=>this.getMapLayer(),500);
        }
      }
    },
  }
}
</script>

<style scoped>
.searchIcon{
  width: 33px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #4d90fe;
  cursor:pointer;
}
.searchItemName{
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.searchItem{
  width: 100%;
  height: 25px;
  margin: 4px 0px;
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
.searchItem:hover{
  -webkit-box-shadow: 0px 0px 2px #2577ff;
  box-shadow: 0px 0px 2px #2577ff;
}
.searchViewClose{
  width: 60px;
  height: 18px;
  background: #f1f1f1;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.searchView{
  width: calc(100% - 8px - 10px);
  height: auto;
  max-height:calc(100% - 10px);
  min-height: 40px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fbfbfb;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  box-shadow:0px 0px 1px #000000;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.headTitleMore{
  cursor: pointer;
  height:100%;
  width: 25px;
  display:flex;
  justify-content:center;
  align-items:center
}
.mapMoreActions{
  width: 220px;
  height: auto;
  min-height: 70px;
  padding: 10px 0px;
  position: absolute;
  z-index: 551;
  background: white;
  box-shadow: #c5c5c5 0px 0px 6px;
  right: 10px;
  top: 40px;
}
.mapMoreActionsClose{
  width: 100%;
  height: 100%;
  opacity: 0;
  position: fixed;
  z-index: 550;
  left: 0px;
  top: 0px;
}
.mapMoreAction{
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
.mapMoreAction:hover{
  background: #f1f1f1;
}
.headTitle span{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.memberName{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.elementPanelLayer{
  width: calc(300px - 18px);
  height: calc(100% - 20px);
  min-height: 740px;
  position: fixed;
  z-index: 555;
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
  background: #ffffff;
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
  position: relative;
}
.panelSearch{
  position: absolute;
  z-index: 550;
  left: 1px;
  bottom: 1px;
  width: calc(100% - 2px);
  height: auto;
  max-height: 50%;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
}
.searchViewBox{
  width: 100%;
  height: auto;
  max-height:100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
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
  width: 110px;
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
.searchContentBox{
  height: 33px;
  width: calc(100% - 8px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 2px 4px 4px 4px;
  box-shadow: 0px 0px 2px #b2b2b2;
}
.searchContent{
  width: calc(100% - 33px - 33px - 10px);
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
