<template>
<div class="BananaRecorderPanel" ref="BananaRecorderPanel">
  <div class="boxSet"><!--面板本体设置，面板透明度、关闭按钮-->
    <img src="../../static/smallSlider.png" draggable="false" ref="smallSlider" class="smallSlider" alt="smallSlider" title="拖拽面板">
    <img @click="waterDroplet()" src="../../static/waterDroplet.png" class="waterDroplet" draggable="false" ref="waterDroplet" alt="waterDroplet" title="透明化面板">
    <img ref="closeButton" src="../../static/close.png" class="closeIcon" draggable="false" alt="closeButton" title="关闭面板">
  </div>
  <div class="initialIntentBox">
    <div class="stepPileTitle">
      <span v-show="stepPileShow">
        {{reachIntent.length}}项更改
      </span>
      <span v-show="!stepPileShow">
        {{failIntent.length}}项失败
      </span>
    </div>
    <div class="leftPageSelect">
      <div class="leftPageSelectBt"><span class="BtSuccess" @click="stepPileShow=true">成功</span></div>
      <div class="leftPageSelectBt"><span class="BtFail" @click="stepPileShow=false">失败</span></div>
    </div>
    <div class="stepPileBox" v-show="stepPileShow">
      <div class="stepPile" v-for="step in reachIntent" :key="step.reachIntentSerial">
        <div class="stepContent" v-if="step.type==='updateElement'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepUpdate">已更新</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
            的
            <span class="changeNumber" @mousemove="showChangeDetails($event,step.changes)" @mouseout="hideChange()">{{step.changes.length}}</span>
            项内容
          </div>
        </div>
        <div class="stepContent" v-if="step.type==='updateNode'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepUpdate">已更新</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
            的 节点
          </div>
        </div>
        <div class="stepContent" v-if="step.type==='upload'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepCreated">已创建</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
          </div>
        </div>
        <div class="stepContent" v-if="step.type==='delete'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepDelete">已删除</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="stepPileBox" v-show="!stepPileShow">
      <div class="stepPile InvalidText" v-for="step in failIntent">
        <div class="stepContent" v-if="step.type==='updateElement'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepUpdate">更新</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
            的
            <span class="changeNumber" @mousemove="showChangeDetails($event,step.changes)" @mouseout="hideChange()">{{step.changes.length}}</span>
            项内容
          </div>
        </div>
        <div class="stepContent" v-if="step.type==='updateNode'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepUpdate">更新</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
            的 节点
          </div>
        </div>
        <div class="stepContent" v-if="step.type==='upload'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepCreated">创建</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
          </div>
        </div>
        <div class="stepContent" v-if="step.type==='delete'">
          <div class="stepContentImg">
            <point v-if="step.class==='point'"></point>
            <segment-line v-if="step.class==='line'"></segment-line>
            <region v-if="step.class==='area'"></region>
            <segment-curve v-if="step.class==='curve'"></segment-curve>
          </div>
          <div class="stepContentText">
            <span class="stepDelete">删除</span>
            <span class="changeType" @mousemove="showChangeId($event,step.id)" @mouseout="hideChange()">{{step.class}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="detailsBox" ref="detailsBox" :style="`top:${detailsBox.y}px;left:${detailsBox.x}px`" v-text="detailsBox.text">

  </div>
</div>
</template>

<script>
import Point from "./svgValidIcons/point";
import SegmentLine from "./svgValidIcons/segmentLine";
import Region from "./svgValidIcons/region";
import SegmentCurve from "./svgValidIcons/segmentCurve";
export default {
  name: 'BananaRecorderPanel',
  components:{Point,SegmentLine,Region,SegmentCurve},
  data(){
    return {
      stepPileShow:true,
      translucent:false,
      dragStatus:false,
      dragStartPt:{x:null,y:null},
      dragOffset:{x:null,y:null},
      dragArea:{maxX:null,maxY:null,minX:null,minY:null},
      detailsBox:{
        text:null,
        x:null,
        y:null,
      },
      reachIntentSerial:0,
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      if(this.openStepRecorder){
        this.show();
      }else {
        this.hidden();
      }
      this.dragStart();
      this.dragIng();
      this.dragEnd();
      this.closeButtonEvent();
    },
    showChangeId(ev,id){
      this.$refs.detailsBox.style.display='block';
      this.detailsBox.text='ID '+id;
      this.detailsBox.x=ev.x+15;
      this.detailsBox.y=ev.y+15;
    },
    showChangeDetails(ev,changes){
      let str='';
      for(let i=0;i<changes.length;i++){
        let type=changes[i];
        switch (type) {
          case 'color':{
            if(i===changes.length-1){str+='颜色';}else{str+='颜色、';}
            break;
          }
          case 'width':{
            if(i===changes.length-1){str+='宽度';}else{str+='宽度、';}
            break;
          }
          case 'details':{
            if(i===changes.length-1){str+='属性';}else{str+='属性、';}
            break;
          }
          case 'node':{
            if(i===changes.length-1){str+='节点';}else{str+='节点、';}
            break;
          }
          case 'custom':{
            if(i===changes.length-1){str+='图标';}else{str+='图标、';}
            break;
          }
        }
      }
      this.$refs.detailsBox.style.display='block';
      this.detailsBox.text=str;
      this.detailsBox.x=ev.x+15;
      this.detailsBox.y=ev.y+15;
    },
    hideChange(){
      this.$refs.detailsBox.style.display='none';
    },
    closeButtonEvent(){
      this.$refs.closeButton.addEventListener('click',()=>{
        let settingsObj=JSON.parse(this.$root.general_script.handleLocalStorage('get','settings'));//获取设置对象
        settingsObj.set_DS_OpenStepRecorder=false;
        this.$store.state.userSettingConfig.openStepRecorder=false;
        this.$root.general_script.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.hidden();
      });
    },
    hidden(){//隐藏面板
      this.$refs.BananaRecorderPanel.style.top='-340px';
      this.$store.state.recorderConfig.display=false;
    },
    show(){//隐藏面板
      this.$refs.BananaRecorderPanel.style.top='10px';
    },
    waterDroplet(){
      if(!this.translucent){
        this.$refs.BananaRecorderPanel.classList.toggle('transparent');
        this.translucent=true;
      }else {
        this.$refs.BananaRecorderPanel.classList.toggle('transparent');
        this.translucent=false;
      }
    },
    dragStart(){
      this.$refs.smallSlider.addEventListener('mousedown',(ev)=>{
        this.$refs.BananaRecorderPanel.style.transition='none';
        let rect=this.$refs.BananaRecorderPanel.getClientRects();
        let windowWidth=window.innerWidth;
        let windowHeight=window.innerHeight;
        this.dragStartPt.x=ev.x;
        this.dragStartPt.y=ev.y;
        this.dragOffset.x=rect[0].x-ev.x;
        this.dragOffset.y=rect[0].y-ev.y;
        this.dragArea.minX=ev.x-rect[0].left;
        this.dragArea.maxX=windowWidth-(rect[0].right-ev.x);
        this.dragArea.minY=ev.y-rect[0].y;
        this.dragArea.maxY=windowHeight-15;
        this.dragStatus=true;
      });
    },
    dragIng(){
      document.addEventListener('mousemove',(ev)=>{
        if(this.dragStatus){
          if(ev.x>=this.dragArea.minX && ev.x<=this.dragArea.maxX){
            this.$refs.BananaRecorderPanel.style.left=(ev.x+this.dragOffset.x)+'px';
          }
          if(ev.y>=this.dragArea.minY && ev.y<=this.dragArea.maxY){
            this.$refs.BananaRecorderPanel.style.top=(ev.y+this.dragOffset.y)+'px';
          }
        }
      });
    },
    dragEnd(){
      document.addEventListener('mouseup',(ev)=>{
        this.$refs.BananaRecorderPanel.style.transition='0.3s';
        this.dragStatus=false;
        this.dragStartPt={x:null,y:null};
        this.dragOffset={x:null,y:null};
        this.dragArea={maxX:null,maxY:null,minX:null,minY:null};
      });
    },
  },
  computed:{
    openStepRecorder(){
      return this.$store.state.userSettingConfig.openStepRecorder;
    },
    failIntent(){
      return this.$store.state.recorderConfig.failIntent;
    },
    reachIntent(){
      return this.$store.state.recorderConfig.reachIntent;
    },
    initialIntent(){
      return this.$store.state.recorderConfig.initialIntent;
    },
    corrects(){
      return this.$store.state.serverData.socket.corrects;
    },
    errors(){
      return this.$store.state.serverData.socket.errors;
    }
  },
  watch:{
    corrects:{
      handler(newValue){
        const Length=newValue.length;
        for(let i=0;i<Length;i++){
          let pickItem=newValue.shift();
          let type=pickItem.class;
          switch (type){
            case 'upload':{//新增元素
              let vid=pickItem.data.vid;
              let rid=pickItem.data.rid;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===vid){
                  this.$store.state.recorderConfig.reachIntent.unshift(//添入成功执行的更改列表中
                    {
                      id:rid,
                      type:'upload',
                      class:this.initialIntent[ii].class,
                      reachIntentSerial:this.reachIntentSerial++,
                    }
                  );
                  this.$store.state.recorderConfig.lastUploadId=rid;
                  this.$store.state.recorderConfig.lastUploadClass=this.initialIntent[ii].class;
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
            case 'updateElement':{
              let upId=pickItem.data.vid;
              let rid=pickItem.data.rid;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===upId){
                  this.$store.state.recorderConfig.reachIntent.unshift(//添入成功执行的更改列表中
                    {
                      id:rid,
                      type:'updateElement',//更新类型
                      class:this.initialIntent[ii].class,//元素类型
                      changes:this.initialIntent[ii].changes,//修改类型
                      oldValue:this.initialIntent[ii].oldValue,//旧数据
                      reachIntentSerial:this.reachIntentSerial++,
                    }
                  );
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
            case 'updateNode':{
              let upId=pickItem.data.vid;
              let rid=pickItem.data.rid;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===upId){
                  this.$store.state.recorderConfig.reachIntent.unshift(//添入成功执行的更改列表中
                    {
                      id:rid,
                      type:'updateNode',//更新类型
                      class:this.initialIntent[ii].class,//元素类型
                      changes:this.initialIntent[ii].changes,//修改类型
                      oldValue:this.initialIntent[ii].oldValue,//旧数据
                      reachIntentSerial:this.reachIntentSerial++,
                    }
                  );
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
            case 'delete':{
              let rid=pickItem.data.rid;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===rid){
                  this.$store.state.recorderConfig.reachIntent.unshift(//添入成功执行的更改列表中
                    {
                      id:rid,
                      type:'delete',
                      class:this.initialIntent[ii].class,
                    }
                  );
                  this.$store.state.recorderConfig.lastDeleteId=rid;
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
          }
        }
      },
      deep:true
    },
    errors:{
      handler(newValue){
        const Length=newValue.length;
        for(let i=0;i<Length;i++){
          let pickItem=newValue.shift();
          let type=pickItem.class;
          switch (type){
            case 'upload':{//新增元素
              let vid=pickItem.data.source.id;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===vid){
                  this.$store.state.recorderConfig.failIntent.unshift(//添入成功执行的更改列表中
                    {
                      id:vid,
                      type:'upload',
                      class:this.initialIntent[ii].class,
                      source:pickItem.data.source,
                      message:pickItem.data.message
                    }
                  );
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
            case 'updateElement':{
              let upId=pickItem.data.source.updateId;
              let rid=pickItem.data.source.id;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===upId){
                  this.$store.state.recorderConfig.failIntent.unshift(
                    {
                      id:rid,
                      type:'updateElement',
                      class:this.initialIntent[ii].class,
                      changes:this.initialIntent[ii].changes,
                      oldValue:this.initialIntent[ii].oldValue,
                    }
                  );
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
            case 'updateNode':{
              let upId=pickItem.data.source.updateId;
              let rid=pickItem.data.source.id;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===upId){
                  this.$store.state.recorderConfig.failIntent.unshift(
                    {
                      id:rid,
                      type:'updateNode',
                      class:this.initialIntent[ii].class,
                      changes:this.initialIntent[ii].changes,
                      oldValue:this.initialIntent[ii].oldValue,
                    }
                  );
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
            case 'delete':{
              let rid=pickItem.data.source.id;
              for(let ii=0;ii<this.initialIntent.length;ii++){
                if(this.initialIntent[ii].id===rid){
                  this.$store.state.recorderConfig.failIntent.unshift(//添入成功执行的更改列表中
                    {
                      id:rid,
                      type:'delete',
                      class:this.initialIntent[ii].class,
                      source:pickItem.data.source,
                      message:pickItem.data.message
                    }
                  );
                  this.$store.state.recorderConfig.initialIntent.splice(ii,1);
                }
              }
              break;
            }
          }
        }
      },
      deep:true
    },
    openStepRecorder:{
      handler(newValue){
        if(newValue){
          this.show();
        }else {
          this.hidden();
        }
      }
    },
  }
}
</script>

<style scoped>
.leftPageSelectBt{
  width: 100%;
  height: calc(50% - 1px);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.leftPageSelectBt:first-child{
  border-bottom:1px #787878 solid;
}
.leftPageSelectBt span{
  padding: 4px 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.4s;
}
.leftPageSelectBt span:hover{
  border: 1px #bfbfbf solid;
}
.BtSuccess{
  color: #70b6ff;
}
.BtFail{
  color: #ff6e6e;
}
.stepCreated{
  color: green;
}
.stepUpdate{
  color: blue;
}
.stepDelete{
  color: red;
}
.leftPageSelect{
  width: 18px;
  height: calc(100% - 24px);
  font-size: 15px;
}
.detailsBox{
  width:auto;
  height: 24px;
  padding: 5px;
  background: rgba(255,255,255,0.8);
  position: fixed;
  pointer-events: none;
  z-index: 555;
  border: 1px #d2d2d2 solid;
  border-radius: 4px;
  display: none;
}
.changeType{
  width: 48px;
  height: 26px;
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  font-weight: 600;
  cursor: pointer;
}
.changeNumber{
  width: 24px;
  height: 26px;
  display: flex;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
}
.stepContentText{
  width: calc(100% - 26px);
  height: inherit;
  display: flex;
  justify-content: flex-start;
  align-content: center;
}
.stepContentImg{
  width: 20px;
  height: 20px;
  margin: 0px 3px;
  display: flex;
  justify-content: center;
}
.stepContentImg img{
  width: 20px;
  height: 20px;
}
.stepContent{
  width: 100%;
  height: 26px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  font-size: 14px;
}
.stepPileTitle{
  font-size: 17px;
  font-weight: 800;
  width: 100%;
  height: 24px;
}
.InvalidText{
  text-decoration:line-through;
}
.stepPileBox{
  width: calc(100% - 18px);
  height: calc(100% - 24px);
  overflow-x: hidden;
  overflow-y: auto;
}
.BananaRecorderPanel{
  user-select: none;
  width: 235px;
  height: 320px;
  padding: 5px;
  min-height: 80px;
  background: #ffffff;
  display: block;
  position: fixed;
  transition: 0.3s;
  z-index: 550;
  top:-340px;
  left: 325px;
  border-radius: 5px 5px 6px 6px;
  box-shadow: #b1b1b1 2px 2px 10px;
}
.initialIntentBox{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.stepPile{
  width: 100%;
  height: 25px;
  display: inherit;
  justify-content: inherit;
  align-items: center;
  flex-direction: row;
  margin: 5px 0px 0px 0px;
}
.stepPile:first-child{
  margin-top: 20px;
}
.smallSlider{
  width: 60px;
  height: 20px;
  background: #e9e9e9;
  position: absolute;
  top: 0px;
  right:86px;
  transition: 0.4s;
  user-select: none;
}
.smallSlider:hover{
  background: #a3a3a3;
  cursor: grabbing;
}
.waterDroplet{
  width: 20px;
  height: 20px;
  margin: 0px 2px;
  transition: 0.4s;
}
.waterDroplet:hover{
  opacity: 0.4;
}
.closeIcon{
  width: 20px;
  height: 20px;
  margin: 0px 2px 0px 2px;
  transition: 0.4s;
}
.closeIcon:hover{
  transform: rotate(25deg);
}
.boxSet{
  user-select: none;
  position: absolute;
  z-index: 550;
  top: 5px;
  width: calc(100% - 10px);
  height: 20px;
  display: flex;
  justify-content: flex-end;
}
.transparent{
  opacity: 0.4;
}
</style>
