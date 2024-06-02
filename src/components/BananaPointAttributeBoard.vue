<template>
  <div class="boxOut" v-bind:style="BoardPos" v-show="show" ref="BananaAttributeBoard"><!--点数据属性面板-->
    <div class="BananaAttributeBoard">
      <div class="headName mouseType1" contenteditable="false">编辑元素</div>
      <div class="boxSet"><!--面板本体设置，面板透明度、关闭按钮-->
        <img src="../../static/waterDroplet.png" ref="waterDroplet" class="icon15" alt="waterDroplet" title="透明化面板">
      </div>
      <div class="item iStyle"><!--样式设置，修改颜色、宽度、透明度-->
        <div class="iTitle"><!--标题-->
          样式设置
        </div>
        <div class="iStyContent"><!--内容-->
          <div class="iStyP">
            <div class="iStyName">选择图标</div>
            <div class="iStyWidth" title="当前图标">
              <img src="../../static/icons/usualIcon000.png" alt=""/>
            </div>
          </div>
          <div class="iStySlide">
            <orange-icons-custom @OrangeIconsCustomCall="iconsHandle"/>
          </div>
          <div class="iStyP">
            <div class="iStyName">挑选颜色</div>
            <div class="iStyView" title="当前颜色" :style="styleColor"></div>
            <div class="iStyName">自选颜色</div>
            <orange-color-palette @OrangeColorPaletteCall="paletteHandle" class="iStyInput" :default="'#'+color"/>
          </div>
          <div class="iStyColors"><!--选择区域-->
            <div class="iStyColor" v-for="color in colors" :style="'background:#'+color" @click="paletteHandle(color)"></div>
          </div>
          <div class="iStyP">
            <div class="iStyName">设置宽度</div>
            <div class="iStyWidth" title="当前宽度">{{width}}</div>
          </div>
          <div class="iStySlide">
            <orange-slide-block @OrangeSlideBlockCall="sliderHandle" :div-style="'width:267px;left:-92px;top:34%'"
                                max="15" min="2" :default="width"/>
          </div>
        </div>
      </div>
      <div class="item iAttribute"><!--属性编辑，区域、名称、类型....-->
        <div class="iTitle">
          属性编辑
        </div>
        <div class="iAttContent"><!--内容-->
          <div class="iAttItem" v-for="detail in details">
            <div class="leftProperty">
              {{detail.key}}
            </div>
            <div class="rightValue">
              <img src="../../static/keyToValue.png" class="keyToValue" alt="keyToValue"/>
              <pomelo-input :value="getContent(detail.value)" :type="getType(detail.value)" :item="detail" @inputChanged="detailsChanged"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomButtons mouseType1"><!--底部按钮-->
      <div class="bottomButton" @click="cancelEdit($event)">取消</div>
      <div class="bottomButton" @click="submitEdit($event)">上传</div>
    </div>
  </div>
</template>

<script>
import OrangeIconsCustom from "./OrangeIconsCustom";
import OrangeColorPalette from "./OrangeColorPalette";
import OrangeSlideBlock from "./OrangeSlideBlock";
import PomeloInput from "./PomeloInput";
export default {
  name: "BananaPointAttributeBoard",
  components:{OrangeSlideBlock,OrangeColorPalette,OrangeIconsCustom,PomeloInput},
  data(){
    return {
      id:"-1",
      color:"000000",
      width:5,
      point:{x:0,y:0},
      details:[],
      custom:{icon:null,tmpId:null},
      show:false,
      colors:['cc0066','ff6666','ff6600','ffcc33','ffff00','99cc33','66cc33','009966','009999','0099cc','333399','993399','666633',
        '993300','ff6600','ffcc00','996600','669933','006633','006699','333366','6633cc','cccccc','666666','333333','000000'],
      tmpProof:null,
    }
  },
  props:{
    StyleTop:{
      type:Number,
      default:0
    },
    StyleLeft:{
      type:Number,
      default:-400
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){//初始设置
      this.tmpProof=new this.$store.state.classList.tmpProof('chinese');
      this.waterDropletEvent();
    },
    detailsChanged(data){
      data.item.value=data.value;
    },
    getContent(value){
      if(this.tmpProof===null)return '';
      return value;
    },
    getType(value){
      if(this.tmpProof===null)return 'text';
      let v=this.tmpProof.GetType(value);
      return v==='list'?'listEdit':v;
    },
    waterDropletEvent(){
      this.$refs.waterDroplet.addEventListener('click',(ev)=>{
        if(!this.translucent){
          this.$refs.BananaAttributeBoard.classList.toggle('transparent');
          this.translucent=true;
        }else {
          this.$refs.BananaAttributeBoard.classList.toggle('transparent');
          this.translucent=false;
        }
      });
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    paletteHandle(data){
      this.color=data;
    },
    sliderHandle(data){
      this.width=data;
    },
    iconsHandle(data){
      this.custom.icon=data;
    },
    submitEdit(){//提交-更新缓存-同时上传数据
      /**
       * name check
       **/
      let name='';
      for(let i=0;i<this.details.length;i++){
        if(this.details[i].key==='name'){
          name=this.details[i].value;break;
        }
      }
      if(name==='' || name==='☍t'){
        this.$store.commit('setCoLogMessage',{text:'名称不能为空，请输入名称',from:'internal:BananaPointAttributeBoard',type:'tip'});
        return false;
      }
      /**
       * name check end
       **/
      let localId=this.$store.state.serverData.socket.localId--;
      let obj={
        id:localId,
        class:'point',
        point:{x:this.$store.state.mapConfig.tempPoint.point.x,y:this.$store.state.mapConfig.tempPoint.point.y},
        color:this.color,
        width:this.width,
        details:this.details,
        custom:{
          icon:null,
          tmpId:null,
        },
      };
      if(typeof this.custom.icon==='string'){//icon添加
        obj.custom.icon=this.custom.icon;
      }else {
        obj.custom.icon=null;
      }
      if(this.$store.state.templateData.hasOwnProperty(this.useTpId)){//检查是否存在此模板
        obj.custom.tmpId=this.useTpId;
      }else{
        this.$store.commit('setCoLogMessage',{text:'添加失败，因为对应的模板'+this.useTpId+'不存在，请联系管理员',from:'internal:BananaPointAttributeBoard',type:'error'});
        return false;
      }
      /**
       * updating
       **/
      let recordObj={
        type:'upload',
        class:'point',
        id:localId,
        tmpId:obj.custom.tmpId
      };
      this.$store.state.recorderConfig.initialIntent.push(recordObj);
      this.$store.state.serverData.socket.broadcastSendPoint(obj);
      this.show=false;
      this.$root.sendInstruct('addNewPointEnd');
      this.resetDetails();
    },
    cancelEdit(){//取消
      this.width=5;
      this.resetCustom();
      this.resetDetails();
      this.$root.sendInstruct('addNewPointEnd');
    },
    resetCustom(){
      this.custom={
        icon:null,
        tmpId:null,
      };
    },
    resetDetails(){
      let newValue=this.useDetailsRule;
      let len=newValue.length;
      let Details=[];//key=>value
      for(let i=0;i<len;i++){
        let key=newValue[i].name;
        let value=newValue[i].default;
        let obj={
          "key":key,
          "value":value
        };
        Details.push(obj);
      }
      this.details=Details;
    },
  },
  computed:{
    useDetailsRule(){
      return this.$store.state.templateConfig.useDetailsRule;
    },
    useTpId(){
      return this.$store.state.templateConfig.useTpId;
    },
    styleColor(){
      if(this.color){
        return 'background:#'+this.color;
      }else {
        return 'background:#ff0000';
      }
    },
    browserSize(){
      return this.$store.state.mapConfig.browser;
    },
    /**
     * @return {string}
     */
    BoardPos(){
      let [Sl,St]=[this.StyleLeft,this.StyleTop];
      if(Sl>this.browserSize.width-325){
        Sl=this.browserSize.width-335;
      }
      if(St>this.browserSize.height-425){
        St=this.browserSize.height-435;
      }
      return "left:"+Sl+"px;top:"+St+"px";
    },
  },
  watch:{
    useDetailsRule:{
      handler(newValue){
        let len=newValue.length;
        let Details=[];//key=>value
        for(let i=0;i<len;i++){
          let key=newValue[i].name;
          let value=newValue[i].default;
          let obj={
            "key":key,
            "value":value
          };
          Details.push(obj);
        }
        this.details=Details;
      },
      deep:true
    },
    BoardPos:{//被移动位置时触发
      handler(newValue){
        this.show=true;
      }
    },
    color:{
      handler(newValue,oldValue){//检测颜色格式是否正确
        let Exp=/^[0-9A-F]{6}$/i;
        if(Exp.test(newValue)===false){
          this.color=oldValue;
        }else {
          this.$store.state.mapConfig.tempPoint.color=newValue;
        }
      }
    },
    width:{
      handler(newValue,oldValue){//检测宽度格式是否正确
        let Exp=/^(6[0-4]|[1-5]\d|\d)$/;
        if(Exp.test(newValue)===false){
          if(newValue!==''){
            this.width=oldValue;
          }
        }else {
          this.$store.state.mapConfig.tempPoint.width=newValue;
        }
      }
    },
    custom:{
      handler(newValue){
        this.$store.state.mapConfig.tempPoint.custom=newValue;
      },
      deep:true
    }
  }
}
</script>

<style scoped>
.headName{
  width: calc(100% - 10px);
  height: 35px;
  line-height: 34px;
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  border-radius: 5px;
  padding: 0px 5px;
  color: #5e5e5e;
  position: relative;
  z-index: 400;
}
.mouseType1{
  cursor: default;
}
.bottomButtons{
  user-select: none;
  position: absolute;
  bottom:0px;
  width: 100%;
  height: 26px;
  border-radius: 3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 1px 0px 4px #c1c1c1;
  z-index: 400;
  background: white;
}
.bottomButton{
  background: #ffffff;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  color: #282828;
  transition: 0.4s;
}
.bottomButton:first-child:hover{
  background: #ffacac;
}
.bottomButton:last-child:hover{
  background: #69cfff;
}
.BananaAttributeBoard{
  position: absolute;
  width: 300px;
  height: 394px;
  overflow-y: auto;
  background: white;
  box-shadow: #b1b1b1 2px 2px 10px;
  border-radius: 5px;
  padding: 5px;
}
.transparent{
  opacity: 0.4;
}
.boxSet{
  position: absolute;
  z-index: 550;
  top: 8px;
  width: calc(100% - 10px);
  height: 20px;
  display: flex;
  justify-content: flex-end;
}
.iAttItem{
  width: 100%;
  height: auto;
  padding: 10px 0px;
}
.leftProperty input{
  font-size: 13px;
  font-weight: 200;
  width: 194px;
}
.leftProperty{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.rightValue{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.rightValue textarea{
  font-size: 13px;
  font-weight: 200;
  min-width: calc(90% - 17px);
  max-width: calc(90% - 17px);
  width: calc(90% - 17px);
  padding: 2px 4px;
  min-height: 19px;
  max-height: 300px;
  height: auto;
  margin: 4px 0px 0px 0px;
}
.keyToValue{
  width: 20px;
  height: 20px;
}
.icon15{
  width: 20px;
  height: 20px;
  margin: 0px 2px;
}
.boxOut{
  position: fixed;
  z-index: 550;
  top: 0px;
  left: 40px;
  width: 310px;
  height: 420px;
  box-shadow: #b1b1b1 2px 2px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 6px;
}
.item{
  width: calc(100% - 10px);
  height: auto;
  background: #ffffff;
  padding: 5px;
  margin: 0px 0px 5px 0px;
}
.iTitle{
  width: 100%;
  height: 30px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
}
.iStyContent{
  width: 100%;
  height: 170px;
}
.iStyP{
  width: 100%;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.iStyName{
  font-weight: 400;
  font-size: 14px;
}
.iStyView{
  width: 15px;
  height: 15px;
  background: red;
  margin: 0px 60px 0px 20px;
}
.iStyWidth{
  margin: 0px 50px 0px 20px;
  font-size: 14px;
  font-weight: 400;
}
.iStyInput{
  margin: 0px 0px 0px 20px;
  height: 20px!important;
}
.iStyColors{
  width: 280px;
  height: 46px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px 0px 5px 0px;
}
.iStyColor{
  width: 15px;
  height: 15px;
  margin: 3px;
}
.iStySlide{
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.iAttContent{
  width: 100%;
  height: auto;
}
</style>
