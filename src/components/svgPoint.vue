<template>
  <g :elementId="this.myId" @mousedown="shiftStart($event)" @mouseup="shiftEnd($event)">
    <circle ref="element" @click="showDetails()" :cx="-dynamicPointsX" :cy="dynamicPointsY" :r="pointConfig.width+'px'" stroke-width="1" :style="'pointer-events:fill;fill-opacity:0.8;fill:'+'#'+pointConfig.color" @contextmenu="rightClickOperation($event)"/>
    <!--动效-->
    <circle v-if="selectId===myId" ref="element" @contextmenu="rightClickOperation($event)" @click="showDetails()" :cx="-dynamicPointsX" :cy="dynamicPointsY" :r="dynamicStyle" stroke="#fa5454" stroke-width="2" :style="'pointer-events:fill;fill-opacity:0.8;fill:none'"/>
  </g>
</template>

<script>
export default {
  name: "svgPoint",
  data(){
    return {
      dataSourcePoint:{},//源点
      occurredMoveMap:false,//移动状态
      A1Cache:{x:0,y:0},
      myId:null,
      selectId:-1,//被选中的id
      radius:[1,2,3,4,5,6,5,4,3,2],
      shiftStatus:false,//挪动的状态，当元素被选中后再次左键按下则状态为true，表示可挪动节点，默认为false
      shiftStartPoint:{x:null,y:null},
      shiftStartMouse:{x:null,y:null},
    }
  },
  props:{
    "pointConfig":{
      type:Object,
      default: function (){
        return {
          id:'p0000',
          type:'point',
          points:[{x:-0.0000001,y:0.0000001}],
          point:{x:-0.0000001,y:0.0000001},
          color:'#ec3232',
          width:2
        }
      },
      required:true
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    //初始化配置
    startSetting(){
      //拷贝id
      this.myId=this.pointConfig.id;
      //拷贝源点数据
      Object.assign(this.dataSourcePoint,this.pointConfig.point);
      //监听鼠标移动
      this.mouseEvent();
      //初始化时就移动到相应的位置上,这一步不要提前否则影响源点的拷贝
      this.initializePosition();
      //简陋的动效
      setInterval(()=>{this.radius.push(this.radius.shift());},110)
      //初始化A1cache
      this.A1Cache.x=this.A1.x;
      this.A1Cache.y=this.A1.y;
    },
    //挪动节点
    shiftStart(ev){
      //保存当前元素坐标位置
      Object.assign(this.shiftStartPoint,this.pointConfig.point);
      //保存当前鼠标点击位置
      this.shiftStartMouse.x=ev.x;
      this.shiftStartMouse.y=ev.y;
      //必须按下的是鼠标左键
      if(ev.button!==0){
        return false;
      }
      //使挪动状态变更为true
      this.shiftStatus=true;
    },
    //鼠标在svg中、松开左键、固定节点位置
    shiftEnd(ev){
      //必须按下的是鼠标左键
      if(ev.button!==0){
        return false;
      }
      //使挪动状态变更为true
      this.shiftStatus=false;
    },
    //展示自身details
    showDetails(){
      //1.广播被选中id（myId）
      this.$store.state.detailsPanelConfig.target=this.myId;
      this.$store.state.detailsPanelConfig.data=this.pointConfig;
      this.$store.state.detailsPanelConfig.sourcePoint=this.dataSourcePoint;
    },
    //监听鼠标移动
    mouseEvent(){
      document.body.addEventListener('mousemove',(e)=>{
        this.occurredMoveMap=true;//告知相机发生过移动行为
      })
    },
    //初始化定位
    initializePosition(){
      try{
        //1.获取必要值 layer\pointPos\p0Pos
        let [layer,pointPos,p0Pos,refPos,tempPos]=[null,{x:null,y:null},{x:null,y:null},{x:null,y:null},{x:null,y:null}];
        layer=this.$store.state.mapConfig.layer;
        pointPos.x=this.pointConfig.point.x;pointPos.y=this.pointConfig.point.y;
        p0Pos.x=-this.$store.state.mapConfig.p0.point.x;
        p0Pos.y=-this.$store.state.mapConfig.p0.point.y;
        //2.开始计算
        //无缩放
        if(layer===0){
          //console.log(p0Pos.x)
          refPos.x=pointPos.x+p0Pos.x;//等于p0点加自生
          refPos.y=pointPos.y+p0Pos.y;
          this.pointConfig.point.x=refPos.x;
          this.pointConfig.point.y=refPos.y;
        }
        //有缩小
        if(layer>0){
          //1.计算缩小后-p0（0,0）与新点之间的距离
          for (let i=0;i<layer;i++){
            pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomSub);
            pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomSub);
          }
          //添加p0
          refPos.x=pointPos.x+p0Pos.x;
          refPos.y=pointPos.y+p0Pos.y;
          //修改p
          this.pointConfig.point.x=refPos.x;
          this.pointConfig.point.y=refPos.y;
          return true;
        }
        //放大
        if(layer<0){
          //1.计算缩小后-p0（0,0）与新点之间的距离
          for(let i=0;i>layer;i--){
            pointPos.x=pointPos.x+(pointPos.x*this.$store.state.mapConfig.zoomAdd);
            pointPos.y=pointPos.y+(pointPos.y*this.$store.state.mapConfig.zoomAdd);
          }
          //添加p0
          refPos.x=pointPos.x+p0Pos.x;
          refPos.y=pointPos.y+p0Pos.y;
          //修改p
          this.pointConfig.point.x=refPos.x;
          this.pointConfig.point.y=refPos.y;
          return true;
        }
        return true;
      }catch (e) {
        return false;
      }
    },
    //移动（移动结束后固定数据）
    move(){
      if(this.doNeedMoveMap===false && this.occurredMoveMap===true){
        //console.log(Date.now());
        //console.log(this.A1Cache);
        let A1mvX=this.A1Cache.x-this.A1.x;
        let A1mvY=this.A1Cache.y-this.A1.y;
        let newArr=this.pointConfig.point;
        this.pointConfig.point.x=newArr.x+(A1mvX*this.unit1X);
        this.pointConfig.point.y=newArr.y+(A1mvY*this.unit1Y);
        this.A1Cache.x=this.A1.x;
        this.A1Cache.y=this.A1.y;
        this.occurredMoveMap=false;//告知已经处理本次移动过程
      }
      return true;
    },
    //缩放（直接修改数据）
    scale(){
      //当前的缩放是基于zoomSub和Add进行缩放的，
      let layer=this.layer;
      let oldLayer=this.oldLayer;
      let zoom=(layer>oldLayer)?this.$store.state.mapConfig.zoomSub:this.$store.state.mapConfig.zoomAdd;
      let pointPos={};
      pointPos=JSON.parse(JSON.stringify(this.pointConfig.point));
      const MOX=this.mouse.x;//px
      const MOY=this.mouse.y;
      //这里的单位1需要改为缩放前的单位1
      const TRX=pointPos.x/this.unit1X;//缩放后出现问题500点从500x变为了1250x,此处单位1以及变小了
      const TRY=-pointPos.y/this.unit1Y;
      const axSize=MOX-TRX;
      const aySize=MOY-TRY;
      this.pointConfig.point.x=(TRX-((zoom*axSize)))*this.unit1X;
      this.pointConfig.point.y=-(TRY-((zoom*aySize)))*this.unit1Y;
    },
    rightClickOperation(mouseEvent){
      //阻止默认事件
      mouseEvent.preventDefault();
      //对右侧悬浮条的位置和显示状态操作
      this.$store.state.elementOperationBoardConfig.display=true;
      this.$store.state.elementOperationBoardConfig.posX=mouseEvent.x;
      this.$store.state.elementOperationBoardConfig.posY=mouseEvent.y;
      //设置operated
      this.$store.state.mapConfig.operated.id=this.myId;
      //同步该元素的数据
      this.$store.state.mapConfig.operated.data=this.pointConfig;
      return mouseEvent;
    }
  },
  computed:{
    browserX(){
      return this.$store.state.mapConfig.browser.width;
    },
    browserY(){
      return this.$store.state.mapConfig.browser.height;
    },
    unit1X(){
      return this.$store.state.cameraConfig.unit1X;
    },
    unit1Y(){
      return this.$store.state.cameraConfig.unit1Y;
    },
    offsetX(){
      return this.$store.state.cameraConfig.offsetX;
    },
    offsetY(){
      return this.$store.state.cameraConfig.offsetY;
    },
    //松开左键位置
    svgMouseUp(){
      return this.$store.state.mapConfig.svgMouseUp;
    },
    //简陋的选中动效样式
    dynamicStyle(){
      return ((this.pointConfig.width+0)/10+this.radius[0])+'px'
    },
    dynamicPointsX(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvX=this.A1Cache.x-this.A1.x;
        return -(this.pointConfig.point.x/this.unit1X) - A1mvX;//先转化为单位量，再相减
      }else {
        return -this.pointConfig.point.x/this.unit1X;//等于自生的坐标除以单位1
      }
    },
    dynamicPointsY(){
      if(this.doNeedMoveMap && this.occurredMoveMap===true){
        let A1mvY=this.A1Cache.y-this.A1.y;
        return -((this.pointConfig.point.y/this.unit1Y) + A1mvY);
      }else {
        return -this.pointConfig.point.y/this.unit1Y;
      }
    },
    doNeedMoveMap(){
      return this.$store.state.cameraConfig.doNeedMoveMap;
    },
    p0(){
      return this.$store.state.mapConfig.p0.point;
    },
    A1(){
      return this.$store.state.mapConfig.A1;
    },
    layer(){
      return this.$store.state.mapConfig.layer;
    },
    oldLayer(){
      return this.$store.state.mapConfig.oldLayer;
    },
    mouse(){
      return {x:this.$store.state.mapConfig.mousePoint.x,y:this.$store.state.mapConfig.mousePoint.y};
    },
    targetId(){
      return this.$store.state.detailsPanelConfig.target;
    },
    reinitializeElement(){
      return this.$store.state.serverData.socket.reinitializeElement;
    },
    reinitializeId(){
      return this.$store.state.serverData.socket.reinitializeId;
    }
  },
  watch:{
    browserX:{
      handler(newValue,oldValue){
        let offset=(newValue-oldValue)/2;
        this.pointConfig.point.x+=offset*this.unit1X;
      },
      deep:true
    },
    browserY:{
      handler(newValue,oldValue){
        let offset=(oldValue-newValue)/2;
        this.pointConfig.point.y+=offset*this.unit1Y;
      },
      deep:true
    },
    reinitializeElement:{
      handler(newValue){
        if(newValue!==0){
          if(this.reinitializeId==this.myId){
            this.initializePosition();
          }
        }
      }
    },
    shiftStatus:{
      handler(newValue){
        if(newValue){
          //发送指令-允许缩放、移动视图
          this.$root.sendSwitchInstruct('disableZoomAndMove',true);
        }else {
          //发送指令-禁止缩放、移动视图
          this.$root.sendSwitchInstruct('disableZoomAndMove',false);
        }
      }
    },
    mouse:{
      handler(newValue){
        if(this.shiftStatus===true){
        if(this.myId===this.selectId){
          //移动自身的视图(跟随鼠标)
          this.pointConfig.point.x=newValue.x;
          this.pointConfig.point.y=-newValue.y;
        }
        }
      }
    },
    layer:{
      handler(){
        this.scale();
      }
    },
    doNeedMoveMap:{
      handler(){
        this.move();
      }
    },
    targetId:{
      handler(newValue){
        this.selectId=newValue;
      }
    },
    svgMouseUp:{
      handler(newValue){
        this.shiftStatus=false;
        //检查是否于源点有区别
        // console.log(this.shiftStartPoint);
        // console.log(this.pointConfig.point);
        if(this.shiftStartPoint.x!==null && this.shiftStartPoint.y!==null){
          if(this.shiftStartPoint.x!==this.pointConfig.point.x || this.shiftStartPoint.y!==this.pointConfig.point.y){
            if(this.targetId===this.myId){
              //处理
              //1.计算新的位置
              let newPos=this.$root.computeMouseActualPos(newValue);
              console.log(newPos);
              //2.上传服务器(一共修改两项>point和points)
              let uObj={
                id:null,
                point:null,
                points:[]
              };
              uObj.id=this.myId;
              uObj.point=newPos;
              uObj.points.push(newPos);
              uObj.type='point';
              this.$store.state.serverData.socket.broadcastUpdateElementNode(uObj);
              //处理完毕后清空
              this.shiftStartPoint.x=null;
              this.shiftStartPoint.y=null;
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

</style>
