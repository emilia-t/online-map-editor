<template>
  <div class="detailsPanelLayer" ref="LayerDetailsPanel">
    <div class="boxSet"><!--面板本体设置，面板透明度、关闭按钮-->
      <img src="../../static/smallSlider.png" draggable="false" ref="smallSlider" class="smallSlider" alt="smallSlider" title="拖拽面板">
      <img src="../../static/nail.png" class="nail" alt="nail" draggable="false" ref="nail" title="钉在地图上">
      <img src="../../static/waterDroplet.png" class="waterDroplet" draggable="false" ref="waterDroplet" alt="waterDroplet" title="透明化面板">
      <img @click="hidden()" src="../../static/close.png" class="closeIcon" draggable="false" alt="closeButton" title="关闭面板">
    </div>
    <div class="items">
      <div class="item"><!--属性编辑，区域、名称、类型....-->
        <div class="iTitle">
          元素属性
        </div>
        <div class="iAttContent"><!--内容-->
          <div class="iAttItem" v-for="detail in exampleConfig.details">
            <div class="leftProperty">
              {{detail.key}}
            </div>
            <div class="rightValue">
              <img src="../../static/keyToValue.png" class="keyToValue" alt="keyToValue"/>
              <div class="rightValueText" v-text="getContent(detail.value)"></div>
            </div>
          </div>
          <div v-if="exampleConfig.id===undefined" class="iOtherText">
            等待选中
          </div>
        </div>
      </div>
      <div class="item">
        <div class="iTitle">
          其他属性
        </div>
        <div v-if="exampleConfig.id!==undefined && this.$store.state.baseMapConfig.baseMapType==='fictitious'" class="iOtherText">
          坐标<br/>{{exampleConfig.point.x}}<br/>{{exampleConfig.point.y}}
        </div>
        <div v-if="exampleConfig.id!==undefined && this.$store.state.baseMapConfig.baseMapType==='realistic'" class="iOtherText">
          经度<br/>{{this.$store.state.detailsPanelConfig.sourcePoint.x}}<br/>纬度<br/>{{this.$store.state.detailsPanelConfig.sourcePoint.y}}
        </div>
        <div v-if="exampleConfig.id!==undefined" class="iOtherText">
          元素ID<br/>{{exampleConfig.type+exampleConfig.id}}
        </div>
        <div v-if="exampleConfig.id!==undefined" class="iOtherText">
          模板ID<br/>{{tmpId}}
        </div>
        <div v-if="exampleConfig.id===undefined" class="iOtherText">
          等待选中
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayerDetailsPanel",
  data(){
    return {
      exampleConfig:{
        "id":"-1",
        "type":"",
        "points":[{"x":null,"y":null}],
        "point":{"x":null,"y":null},
        "color":null,
        "length":null,
        "width":null,
        "size":null,
        "child_relations":null,
        "father_relation":null,
        "child_nodes":null,
        "father_node":null,
        "details":[],
        "custom":{"tmpId":null},
      },
      sourcePoint:{
        x:null,
        y:null
      },
      dragStatus:false,
      dragStartPt:{x:null,y:null},
      dragOffset:{x:null,y:null},
      dragArea:{maxX:null,maxY:null,minX:null,minY:null},
      nailStatus:false,
      translucent:false,
      tmpProof:null,
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.tmpProof=new this.$store.state.classList.tmpProof('chinese');
      this.dragStart();
      this.dragIng();
      this.dragEnd();
      this.nailEvent();
      this.waterDropletEvent();
    },
    getContent(value){
      if(this.tmpProof===null)return '';
      if(value===null)return 'NULL';
      let t=this.tmpProof.GetType(value);
      if(t==='list'){//列表类型需要单独处理
        return value.substr(2).split(',')[0];
      }else{
        let v=this.tmpProof.GetContent(value);
        return v===''?'NULL':v;
      }
    },
    waterDropletEvent(){
      this.$refs.waterDroplet.addEventListener('click',(ev)=>{
        if(!this.translucent){
          this.$refs.LayerDetailsPanel.classList.toggle('transparent');
          this.translucent=true;
        }else {
          this.$refs.LayerDetailsPanel.classList.toggle('transparent');
          this.translucent=false;
        }
      });
    },
    nailEvent(){
      this.$refs.nail.addEventListener('click',(ev)=>{
        if(!this.nailStatus){
          let nowPos=this.$refs.LayerDetailsPanel.getClientRects()[0];
          this.$refs.LayerDetailsPanel.setAttribute('style','left:'+nowPos.x+'px!important;top:'+nowPos.y+'px!important;');
          this.$refs.nail.style.background='#ff0000';
          this.nailStatus=true;
        }else {
          if(this.targetId===-1){
            this.hidden();
          }
          this.$refs.nail.style.background='#7d7d7d';
          this.nailStatus=false;
        }
      });
    },
    dragStart(){
      this.$refs.smallSlider.addEventListener('mousedown',(ev)=>{
        this.$refs.LayerDetailsPanel.style.transition='none';
        let rect=this.$refs.LayerDetailsPanel.getClientRects();
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
            this.$refs.LayerDetailsPanel.style.left=(ev.x+this.dragOffset.x)+'px';
          }
          if(ev.y>=this.dragArea.minY && ev.y<=this.dragArea.maxY){
            this.$refs.LayerDetailsPanel.style.top=(ev.y+this.dragOffset.y)+'px';
          }
        }
      });
    },
    dragEnd(){
      document.addEventListener('mouseup',(ev)=>{
        // this.$refs.LayerDetailsPanel.style.transition='0.3s';
        this.dragStatus=false;
        this.dragStartPt={x:null,y:null};
        this.dragOffset={x:null,y:null};
        this.dragArea={maxX:null,maxY:null,minX:null,minY:null};
      });
    },
    setSelectionOn(){//文字选择
      this.$refs.LayerDetailsPanel.classList.remove('selectionNone');
    },
    setSelectionOff(){//禁止文字选择
      this.$refs.LayerDetailsPanel.classList.add('selectionNone');
    },
    hidden(){//隐藏面板
      if(this.nailStatus){
        this.$refs.nail.animate([
            {transform:'rotate(-45deg)'},{transform:'rotate(0deg)'},{transform:'rotate(-45deg)'},{transform:'rotate(0deg)'}],
          {duration:800,iterations:1,fill:'forwards',easing:'ease'})
      }
      if(!this.nailStatus){
        this.$refs.LayerDetailsPanel.style.left='-350px';
      }
    },
    show(){//显示面板
      if(!this.nailStatus){
        setTimeout(()=>{
          this.$refs.LayerDetailsPanel.style.left=(this.mouseClick.x-320)+'px';
          if(this.mouseClick.y+415>=window.innerHeight){//此处需要判断y是否已经大于页面高度如果大于则需要限制
            this.$refs.LayerDetailsPanel.style.top=(window.innerHeight-415)+'px';
          }else {
            this.$refs.LayerDetailsPanel.style.top=(this.mouseClick.y+5)+'px';
          }
        },15);
      }
    }
  },
  computed:{
    targetId(){
      return this.$store.state.detailsPanelConfig.target;
    },
    mouseClick(){
      return this.$store.state.mapConfig.mouseClick;
    },
    tmpId(){
      try{
        return this.exampleConfig.custom.tmpId;
      }catch(e){
        return null;
      }
    },
  },
  watch:{
    targetId:{
      handler(newValue){
        if(this.$store.state.commits.disableZoomAndMove){//如果有移动节点的操作会抑制更新
          return false;
        }
        if(newValue!==-1){
          this.show();
          this.setSelectionOn();
        }else {
          this.hidden();
          this.setSelectionOff();
        }
        this.exampleConfig=this.$store.state.detailsPanelConfig.data;
        this.sourcePoint=this.$store.state.detailsPanelConfig.sourcePoint;
      }
    }
  },
  destroyed(){

  }
}
</script>

<style scoped>
.selectionNone{
  user-select: none;
}
.transparent{
  opacity: 0.4;
}
.nail{
  transition: 0.4s;
  width: 20px;
  height: 20px;
  margin: 0px 2px;
  background: #7d7d7d;
}
.smallSlider{
  width: 80px;
  height: 20px;
  background: #e9e9e9;
  position: absolute;
  top: 0px;
  right: 117px;
  transition: 0.4s;
  user-select: none;
}
.smallSlider:hover{
  background: #a3a3a3;
  cursor: grabbing;
}
.boxSet{
  user-select: none;
  position: absolute;
  z-index: 550;
  top: 8px;
  width: calc(100% - 5px);
  height: 20px;
  display: flex;
  justify-content: flex-end;
}
.iAttItem{
  width: 100%;
  height: auto;
  padding: 5px 0px;
}
.leftProperty{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  font-size: 15px;
}
.iOtherText{
  font-weight: 100;
  font-size: 13px;
  margin: 4px 0px;
}
.rightValue{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.rightValueText{
  font-size: 15px;
  font-weight: 200;
  margin: 4px 0px 0px 4px;
  white-space: pre-wrap;
}
.keyToValue{
  width: 20px;
  height: 20px;
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
  margin: 0px 12px 0px 2px;
  transition: 0.4s;
}
.closeIcon:hover{
  transform: rotate(25deg);
}
.detailsPanelLayer{
  /*transition: 0.3s;*/
  position: fixed;
  z-index: 585;
  top:370px;
  left: -350px;
  width: 300px;
  height: 420px;
  padding: 5px;
  box-shadow: #b1b1b1 2px 2px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: hidden;
  background: #ffffff;
  border-radius: 6px;
}
.item{
  width: calc(100% - 10px);
  height: auto;
  background: #ffffff;
  padding: 0px 5px;
}
.items{
  position: absolute;
  width: calc(100% - 5px);
  height: calc(100% - 30px);
  top: 30px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iTitle{
  width: 100%;
  height: 25px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
}
.iAttContent{
  width: 100%;
  height: auto;
}
</style>
