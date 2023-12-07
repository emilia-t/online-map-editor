<template>
  <div class="elementPanelLayer" v-show="this.$store.state.userSettingConfig.elementPanelLayerShow">
    <div class="panelHead">
      <div class="headTitle">
        <span v-text="this.$store.state.serverData.socket.config.name"></span>
        <div class="headTitleMore" @click.stop="switchMapMoreActions()">
          <more custom="cursor:pointer"></more>
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
          <div class="mapMoreAction" title="隐藏或显示默认图层" @click.stop="switchShowDefaultLayer()">
            <span v-show="showDefaultLayer">隐藏</span><span v-show="!showDefaultLayer">显示</span><span>默认图层</span>
          </div>
        </div>
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
        <add-new-group></add-new-group>
        <div class="buttonBoxText" @click="addNewGroupLayer()">
          新建分组图层
        </div>
      </div>
      <div class="buttonBox">
        <preview-eye></preview-eye>
        <div class="buttonBoxText">
          活动图层
        </div>
      </div>
    </div>
    <div class="panelContent" ref="panelContent" @contextmenu.prevent="void 1">
      <div class="defaultLayer" v-if="showDefaultLayer"><!--默认图层-->
        <div class="eyebrow">
          <div class="eyebrowLeft">
            <div class="previewEyeL">
              <preview-eye></preview-eye>
            </div>
            <span class="cursorDefault">默认图层-只读</span>
          </div>
          <div class="eyebrowRight" @click.stop="switchDefaultLayerActions()">
            <more custom="cursor:pointer;transform:translate(3px,1px)"></more>
          </div>
          <div class="layerMoreActionsClose" @contextmenu.prevent="void 1" @click.stop="switchDefaultLayerActions()" v-show="defaultLayerActionsOpen">
          </div>
          <div class="layerMoreActions" v-show="defaultLayerActionsOpen">
            <div class="layerMoreAction" title="展开或收起此图层所有分组" @click="expandAllDefaultGroup()">
              <span v-show="!expandAllDefaultState">展开</span><span v-show="expandAllDefaultState">收起</span>所有分组
            </div>
          </div>
        </div>
        <div class="content">
          <div class="memberTeamName" @contextmenu.prevent="void 1">
            <div class="memberTeamNameL">
              <div class="expandMoreL" @click.stop="expandDefaultPoint()" v-show="!defaultLayerPoint">
                <expand-more custom="transform:translate(0px,-1px) rotate(180deg);cursor:pointer;"></expand-more>
              </div>
              <div class="expandMoreL" @click.stop="expandDefaultPoint()" v-show="defaultLayerPoint">
                <expand-more custom="transform:translate(0px,2px);cursor:pointer;"></expand-more>
              </div>
              <span>Point</span>
            </div>
            <div class="memberTeamNameR" title="隐藏操作仅对您可见">
              <div class="memberRightEyeA" @click.stop="hiddenAllPoint()" v-show="!allPointHideState">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeC" @click.stop="unhiddenAllPoint()" v-show="allPointHideState">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
          </div>
          <div class="memberTeamBox" v-for="item in PointData" :key="item.id" v-show="defaultLayerPoint">
            <div class="memberKeyInfo" :title="'ID'+item.id" @contextmenu.prevent="itemContextmenuOpen($event,item)">
              <div class="memberLeft" @click="locateToElement(item)">
                <point :custom="'fill:#'+item.color+';transform:translate(-2px,0px)'"></point>
                <span class="memberName" v-text="getItemName(item)"></span>
              </div>
              <div :ref="'memberRightEye'+item.id">
                <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)">
                  <eye-visible custom="cursor:pointer"></eye-visible>
                </div>
                <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)">
                  <eye-not-visible custom="cursor:pointer"></eye-not-visible>
                </div>
              </div>
            </div>
            <div class="memberActivityInfo" :ref="'memberActivity'+item.id">
              <div class="memberPick">
                <span class="memberSpanA"></span><span>正在编辑形状</span>
              </div>
              <div class="memberSelect">
                <span class="memberSpanA"></span><span>正在编辑属性</span>
              </div>
            </div>
          </div>
          <div class="memberTeamName" @contextmenu.prevent="void 1">
            <div class="memberTeamNameL">
              <div class="expandMoreL" @click.stop="expandDefaultLine()" v-show="!defaultLayerLine">
                <expand-more custom="transform:translate(0px,-1px) rotate(180deg);cursor:pointer;"></expand-more>
              </div>
              <div class="expandMoreL" @click.stop="expandDefaultLine()" v-show="defaultLayerLine">
                <expand-more custom="transform:translate(0px,2px);cursor:pointer;"></expand-more>
              </div>
              <span>Line</span>
            </div>
            <div class="memberTeamNameR" title="隐藏操作仅对您可见">
              <div class="memberRightEyeA" @click.stop="hiddenAllLine()" v-show="!allLineHideState">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeC" @click.stop="unhiddenAllLine()" v-show="allLineHideState">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
          </div>
          <div class="memberTeamBox" v-for="item in PolyLineData" :key="item.id" v-show="defaultLayerLine">
            <div class="memberKeyInfo" :title="'ID'+item.id" @contextmenu.prevent="itemContextmenuOpen($event,item)">
              <div class="memberLeft" @click="locateToElement(item)">
                <segment-line :custom="'fill:#'+item.color+';transform:translateX(-5px);'"></segment-line>
                <span class="memberName" v-text="getItemName(item)"></span>
              </div>
              <div :ref="'memberRightEye'+item.id">
                <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)">
                  <eye-visible custom="cursor:pointer"></eye-visible>
                </div>
                <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)">
                  <eye-not-visible custom="cursor:pointer"></eye-not-visible>
                </div>
              </div>
            </div>
            <div class="memberActivityInfo" :ref="'memberActivity'+item.id">
              <div class="memberPick">
                <span class="memberSpanA"></span><span>正在编辑形状</span>
              </div>
              <div class="memberSelect">
                <span class="memberSpanA"></span><span>正在编辑属性</span>
              </div>
            </div>
          </div>
          <div class="memberTeamName" @contextmenu.prevent="void 1">
            <div class="memberTeamNameL">
              <div class="expandMoreL" @click.stop="expandDefaultArea()" v-show="!defaultLayerArea">
                <expand-more custom="transform:translate(0px,-1px) rotate(180deg);cursor:pointer;"></expand-more>
              </div>
              <div class="expandMoreL" @click.stop="expandDefaultArea()" v-show="defaultLayerArea">
                <expand-more custom="transform:translate(0px,2px);cursor:pointer;"></expand-more>
              </div>
              <span>Area</span>
            </div>
            <div class="memberTeamNameR" title="隐藏操作仅对您可见">
              <div class="memberRightEyeA" @click.stop="hiddenAllArea()" v-show="!allAreaHideState">
                <eye-visible custom="cursor:pointer"></eye-visible>
              </div>
              <div class="memberRightEyeC" @click.stop="unhiddenAllArea()" v-show="allAreaHideState">
                <eye-not-visible custom="cursor:pointer"></eye-not-visible>
              </div>
            </div>
          </div>
          <div class="memberTeamBox" v-for="item in AreaData" :key="item.id" v-show="defaultLayerArea">
            <div class="memberKeyInfo" :title="'ID'+item.id" @contextmenu.prevent="itemContextmenuOpen($event,item)">
              <div class="memberLeft" @click="locateToElement(item)">
                <region :custom="'fill:#'+item.color+';transform:translateX(-5px);'"></region>
                <span class="memberName" v-text="getItemName(item)"></span>
              </div>
              <div :ref="'memberRightEye'+item.id">
                <div class="memberRightEyeA" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)">
                  <eye-visible custom="cursor:pointer"></eye-visible>
                </div>
                <div class="memberRightEyeB" title="隐藏操作仅对您可见" @click.stop="hiddenElement(item.id,item.type)">
                  <eye-not-visible custom="cursor:pointer"></eye-not-visible>
                </div>
              </div>
            </div>
            <div class="memberActivityInfo" :ref="'memberActivity'+item.id">
              <div class="memberPick">
                <span class="memberSpanA"></span><span>编辑形状中</span>
              </div>
              <div class="memberSelect">
                <span class="memberSpanA"></span><span>编辑属性中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            <point :custom="'fill:#'+item.color+';margin:0px 4px'" v-if="item.type==='point'"></point>
            <segment-line :custom="'fill:#'+item.color+';margin:0px 4px'" v-if="item.type==='line'"></segment-line>
            <region :custom="'fill:#'+item.color+';margin:0px 4px'" v-if="item.type==='area'"></region>
            <span class="memberName" v-text="getItemName(item)"></span>
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
          <reset-refresh custom="transform:translate(2px,0px);"></reset-refresh>
        </div>
        <div class="searchIcon" @click="search()">
          <search custom="transform:translate(1px,2px);"></search>
        </div>
      </div>
    </div>
    <div class="rightClickMenuClose" @contextmenu.prevent="void 1" @click.stop="itemContextmenuClose()" v-show="itemMenuConfig.show"></div>
    <div class="rightClickMenu" :style="itemContextmenuPos" v-show="itemMenuConfig.show">
      <div class="menuListBox">
        <div class="menuList">
          添加到图层
        </div>
      </div>
      <div class="menuGroupListBox">
        <orange-group-list :level="1" :structure="groupLayerStructure"
                           @OrangeGroupListCall="addToGroupLayer">
        </orange-group-list>
      </div>
    </div>
  </div>
</template>
<script>
import dropPng from '../../static/dropDown.png';
import ResetRefresh from "./svgValidIcons/resetRefresh";
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
import BananaGroupLayer from "./BananaGroupLayer";
import OrangeGroupList from "./OrangeGroupList";
import {mapState} from "vuex";

export default {
  name: "LayerElementPanel",
  components: {
    SegmentCurve,
    More,AddNewLayer,AddNewGroup,PreviewEye,Point,SegmentLine,Region,ExpandMore,Search,
    EyeVisible,EyeNotVisible,BananaGroupLayer,OrangeGroupList,ResetRefresh
  },
  data(){
    return{
      dropPng,
      searchResult:[],//{element}
      searchShowView:false,
      searchFind:false,
      groupLayers:{},
      allPointHideState:false,//所有point元素均隐藏状态
      allLineHideState:false,
      allAreaHideState:false,
      allCurveHideState:false,
      showDefaultLayer:true,//显示默认图层
      mapMoreActionsOpen:false,//元素面板顶部更多按钮
      defaultLayerActionsOpen:false,//默认图层顶部更多按钮
      defaultLayerPoint:true,//默认图层中的point组展开状态
      defaultLayerLine:true,
      defaultLayerArea:true,
      itemMenuConfig:{
        target:null,
        show:false,
        x:null,
        y:null,
      },
      adjustOrderTemplate:{
        agree:false,
        code:null,
        id:-1,
      },
      adjustItemOrderTemplate:{
        agree:false,//通过与否
        code:null,//校验码
        stage:null,//提交阶段
        type:null,//插入元素的类型
        pattern:null,//插入的模式 up | down | join
        idA:-1,//活动id
        layerA:-1,//活动图层
        idB:-1,//被动id | join -> group route
        layerB:-1,//被动图层
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
      if(this.closeDefaultLayer===true){
        if(newValue.length>0){//当默认图层关闭的时候自动选中第一个图层
          setTimeout(()=>{this.pickLayerTemplate.id=newValue[0]},0);
        }
        this.unwatch();
      }
    });
  },
  mounted(){
    this.startSetting();
  },
  methods:{
    startSetting(){
      if(this.closeDefaultLayer===true){
        this.showDefaultLayer=false;
      }else {
        this.showDefaultLayer=true;
      }
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
      const Areas=this.$store.state.serverData.socket.mapData.areas;
      const LengthP=Points.length;
      const LengthL=Lines.length;
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
          this.adjustItemOrderTemplate.type=template.type;
          this.adjustItemOrderTemplate.stage=template.stage;
          this.adjustItemOrderTemplate.idA=template.idA;
          this.adjustItemOrderTemplate.layerA=template.layerA;
          break;
        }
        case 'confirm':{
          this.adjustItemOrderTemplate.agree=true;
          this.adjustItemOrderTemplate.code=template.code;
          this.adjustItemOrderTemplate.stage=template.stage;
          this.adjustItemOrderTemplate.type=template.type;
          this.adjustItemOrderTemplate.pattern=template.pattern;
          this.adjustItemOrderTemplate.idA=template.idA;
          this.adjustItemOrderTemplate.layerA=template.layerA;
          this.adjustItemOrderTemplate.idB=template.idB;
          this.adjustItemOrderTemplate.layerB=template.layerB;
          break;
        }
        case 'cancel':{
          this.adjustItemOrderTemplate.agree=false;
          this.adjustItemOrderTemplate.code=template.code;
          this.adjustItemOrderTemplate.type=template.type;
          this.adjustItemOrderTemplate.stage=template.stage;
          this.adjustItemOrderTemplate.idA=-1;
          this.adjustItemOrderTemplate.layerA=-1;
          this.adjustItemOrderTemplate.idB=-1;
          this.adjustItemOrderTemplate.layerB=-1;
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
    addNewGroupLayer(){//添加新的分组图层：1.构建基础结构，2：上传
      function randomNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      let newLayerName='layer-'+randomNumber();
      let defaultGroupLayer={
        members:{'0':0},//不能为空对象
        structure:[
          newLayerName,
          {template:null}
        ]
      };
      this.$store.state.serverData.socket.broadcastCreateGroupLayer(defaultGroupLayer);
    },
    addToGroupLayer(data){//从默认图层上添加元素到自定义图层中
      let addId=parseInt(this.itemMenuConfig.target.id);
      let routeArr=data.split('⇉');//要添加到具体哪个图层的路径
      routeArr=routeArr.filter((item)=>{return item!==''});
      routeArr.reverse();
      let groupLayerId=null;
      let oldStructure=null;
      let mixMembers=null;
      for(let key in this.groupLayers){
        if(this.groupLayers[key].structure[0]===routeArr[0]){
          if(this.groupLayers[key].members[addId]!==undefined){
            this.$store.commit('setCoLogMessage',{text:'此图层已存在此元素',from:'internal:LayerElementPanel',type:'tip'});
            return false;
          }else {
            groupLayerId=this.groupLayers[key].id;
            oldStructure=JSON.parse(JSON.stringify(this.groupLayers[key].structure));
            mixMembers=JSON.parse(JSON.stringify(this.groupLayers[key].members));
          }
          break;
        }
      }
      if(groupLayerId===null){
        this.$store.commit('setCoLogMessage',{text:'无法找到对应图层',from:'internal:LayerElementPanel',type:'tip'});
        return false;
      }
      if(oldStructure===undefined || oldStructure===null){
        this.$store.commit('setCoLogMessage',{text:'图层结构解析错误',from:'internal:LayerElementPanel',type:'tip'});
        return false;
      }
      if(mixMembers===undefined || mixMembers===null){
        this.$store.commit('setCoLogMessage',{text:'图层成员解析错误',from:'internal:LayerElementPanel',type:'tip'});
        return false;
      }
      const typeMapping={point:1,line:2,area:3,curve:4};
      Object.keys(mixMembers).forEach(item=>{
          mixMembers[item]=typeMapping[mixMembers[item].type]
        }
      );
      mixMembers[addId]=typeMapping[this.itemMenuConfig.target.type];
      let newStructure=this.structureInsertByItem(oldStructure,routeArr,addId);
      this.$store.state.serverData.socket.broadcastUpdateLayerData(
        {
          id:groupLayerId,
          structure:newStructure,
          members:mixMembers
        }
      );
      this.itemMenuConfig.show=false;
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
    /**依据图层路由和图层结构删除值
     * @return false|mixed
     * @param structure
     * @param route
     * @param value
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
    itemContextmenuClose(){//关闭元素右键添加至自定义图层菜单
      this.itemMenuConfig.show=false;
      this.itemMenuConfig.target=null;
      this.itemMenuConfig.x=null;
      this.itemMenuConfig.y=null;
    },
    itemContextmenuOpen(ev,item){//打开元素右键添加至自定义图层菜单
      this.itemMenuConfig.target=item;
      this.itemMenuConfig.show=true;
      this.itemMenuConfig.x=ev.x;
      this.itemMenuConfig.y=ev.y;
    },
    expandAllDefaultGroup(){//展开或关闭所有分组
      this.switchDefaultLayerActions();
      if(this.expandAllDefaultState){
        this.defaultLayerPoint=false;
        this.defaultLayerLine=false;
        this.defaultLayerArea=false;
      }else {
        this.defaultLayerPoint=true;
        this.defaultLayerLine=true;
        this.defaultLayerArea=true;
      }
    },
    expandDefaultPoint(){//展开默认图层中的point组
      this.defaultLayerPoint=!this.defaultLayerPoint;
    },
    expandDefaultLine(){//展开默认图层中的point组
      this.defaultLayerLine=!this.defaultLayerLine;
    },
    expandDefaultArea(){//展开默认图层中的point组
      this.defaultLayerArea=!this.defaultLayerArea;
    },
    exportData(){//导出图层和地图数据
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.isLogin===true){
          let serverName=this.$store.state.serverData.socket.config.name;
          let serverAddress=this.$store.state.serverData.socket.url;
          let layerData=this.mapLayerData;
          let mapData={points:this.PointData,lines:this.PolyLineData,areas:this.AreaData,curves:this.CurveData};
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
    switchDefaultLayerActions(){
      this.defaultLayerActionsOpen=!this.defaultLayerActionsOpen;
    },
    switchShowDefaultLayer(){
      this.showDefaultLayer=!this.showDefaultLayer;
      this.switchMapMoreActions();
    },
    hiddenAllPoint(){//隐藏所有点
      let length=this.PointData.length;
      let Arr=[];
      for(let i=0;i<length;i++){
        Arr.push({id:this.PointData[i].id,type:'point'});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeJoin',by:'point',data:Arr});
    },
    unhiddenAllPoint(){//取消隐藏所有点
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeQuit',by:'point'});
    },
    hiddenAllLine(){
      let length=this.PolyLineData.length;
      let Arr=[];
      for(let i=0;i<length;i++){
        Arr.push({id:this.PolyLineData[i].id,type:'line'});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeJoin',by:'line',data:Arr});
    },
    unhiddenAllLine(){
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeQuit',by:'line'});
    },
    hiddenAllArea(){
      let length=this.AreaData.length;
      let Arr=[];
      for(let i=0;i<length;i++){
        Arr.push({id:this.AreaData[i].id,type:'area'});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeJoin',by:'area',data:Arr});
    },
    unhiddenAllArea(){
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeQuit',by:'area'});
    },
    hiddenAllCurve(){
      let length=this.CurveData.length;
      let Arr=[];
      for(let i=0;i<length;i++){
        Arr.push({id:this.CurveData[i].id,type:'curve'});
      }
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeJoin',by:'curve',data:Arr});
    },
    unhiddenAllCurve(){
      this.$store.commit('arrCoElementPanelHiddenElements',
        {type:'byTypeQuit',by:'curve'});
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
      let moveY=elementPosition.y+screenCenter.y;
      this.$store.state.mapConfig.A1.x+=moveX;
      this.$store.state.mapConfig.A1.y+=moveY;
      this.$store.state.baseMapConfig.baseMap.view.offsetX+=moveX;
      this.$store.state.baseMapConfig.baseMap.view.offsetY+=moveY;
      this.$store.state.baseMapConfig.baseMap.render();
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
    },
    deconstructMembers(members){
      let ref={};
      Object.keys(members).forEach(item=>{
          let element=[members[item]+'',item];//转化为[类型,ID]
          switch (element[0]) {
            case '1':{
              let len=this.PointData.length;
              for(let i=0;i<len;i++){
                if(this.PointData[i].id==element[1]){
                  ref[item]=this.PointData[i];
                  break;
                }
              }
              break;
            }
            case '2':{
              let len=this.PolyLineData.length;
              for(let i=0;i<len;i++){
                if(this.PolyLineData[i].id==element[1]){
                  ref[item]=this.PolyLineData[i];
                  break;
                }
              }
              break;
            }
            case '3':{
              let len=this.AreaData.length;
              for(let i=0;i<len;i++){
                if(this.AreaData[i].id==element[1]){
                  ref[item]=this.AreaData[i];
                  break;
                }
              }
              break;
            }
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
    mapHiddenElements(){
      let map=new Map();
      this.hiddenElements.forEach(value=>map.set(value.id,true));
      return map;
    },
    groupLayerStructure(){//提取分组图层的每层的名称
      let ref=[];
      for(let key in this.groupLayers){
        ref.push(extractFirstName(this.groupLayers[key].structure));
      }
      function extractFirstName(arr){//提取每个分组的名字
        return arr.map(item=>{
          if (Array.isArray(item)){
            return extractFirstName(item);
          } else {
            return item;
          }
        }).filter((item,index)=>
          (
            index===0||Array.isArray(item)
          )
          &&!
            (
              Array.isArray(item)&&item.length===0
            )
        );
      }
      return ref;
    },
    itemContextmenuPos(){
      return {
        left:this.itemMenuConfig.x+'px',
        top:this.itemMenuConfig.y+'px',
      }
    },
    expandAllDefaultState(){
      return this.defaultLayerPoint === true && this.defaultLayerLine === true && this.defaultLayerArea === true;
    },
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
    mapLayerData(){
      return this.$store.state.serverData.socket.mapLayerData;
    },
    mapLayerOrder(){
      return this.$store.state.serverData.socket.mapLayerOrder;
    },
    deleteLayerId(){
      return this.$store.state.serverData.socket.deleteLayerId;
    },
    closeDefaultLayer(){
      return this.$store.state.userSettingConfig.closeDefaultLayer;
    }
  },
  watch:{
    pickElements:{
      handler(newValue,oldValue){
        if(!this.showDefaultLayer){return false;}
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
          let pickMember=this.$refs['memberActivity'+difference.addedKeys[i]][0];
          pickMember.firstChild.style.display='flex';
          pickMember.firstChild.firstChild.innerText=newValue.get(difference.addedKeys[i]).user;
        }
        for(let j=0;j<removeLength;j++){
          let pickMember=this.$refs['memberActivity'+difference.removedKeys[j]][0];
          pickMember.firstChild.style.display='none';
          pickMember.firstChild.firstChild.innerText='';
        }
      }
    },
    selectElements:{
      handler(newValue,oldValue){
        if(!this.showDefaultLayer){return false;}
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
          let pickMember=this.$refs['memberActivity'+difference.addedKeys[i]][0];
          pickMember.lastChild.style.display='flex';
          pickMember.lastChild.firstChild.innerText=newValue.get(difference.addedKeys[i]).user;
        }
        for(let j=0;j<removeLength;j++){
          let pickMember=this.$refs['memberActivity'+difference.removedKeys[j]][0];
          pickMember.lastChild.style.display='none';
          pickMember.lastChild.firstChild.innerText='';
        }
      }
    },
    mapHiddenElements:{
      handler(newValue,oldValue){
        if(!this.showDefaultLayer){return false;}
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
    closeDefaultLayer:{
      handler(newValue){
        this.showDefaultLayer=!newValue;
      }
    },
    deleteLayerId:{
      handler(deleteId){
        if(this.groupLayers.hasOwnProperty(deleteId)){
          delete this.groupLayers[deleteId];
        }
      }
    },
    mapLayerData:{
      handler(newValue){
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
.ButtonImg{
  width: 25px;
  height: 25px;
}
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
.menuGroupListBox{
  width: 180px;
  height: auto;
  position: absolute;
  z-index: 550;
  background: white;
  box-shadow: #c5c5c5 0px 0px 6px;
}
.menuListBox{
  width: 100%;
  height: auto;
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
.rightClickMenuClose{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 555;
  top: 0px;
  left: 0px;
}
.rightClickMenu{
  width: 180px;
  height: auto;
  position: fixed;
  z-index: 556;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.layerMoreActions{
  width: 180px;
  height: auto;
  min-height: 60px;
  padding: 5px 0px;
  position: absolute;
  z-index: 551;
  background: white;
  box-shadow: #c5c5c5 0px 0px 6px;
  right: 10px;
  top: 40px;
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
.expandMoreL{
  width:25px;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.headTitleMore{
  height:100%;
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
.prohibit{
  cursor: no-drop;
}
.cursorDefault{
  cursor: default;
}
.mapMoreAction:hover{
  background: #f1f1f1;
}
.headTitle span{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.memberPick{
  width: 100%;
  height: 25px;
  display: none;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.memberSelect{
  width: 100%;
  height: 25px;
  display: none;
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
  width: calc(100% - 70px - 23px);
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
  width: calc(100% - 25px);
  height: auto;
  padding-left: 25px;
  margin-bottom: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.memberTeamBox:hover{
  box-shadow: 0px 0px 2px #2577ff;
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
  display: none;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  opacity: 1;
}
.memberRightEyeC{
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
.defaultLayer{
  min-height: 105px;
  font-size: 14px;
  font-weight: 400;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
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
