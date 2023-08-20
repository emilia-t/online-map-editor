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
            <div class="iStyName">当前颜色</div>
            <div class="iStyView" title="当前颜色" :style="styleColor"></div>
            <div class="iStyName">自选颜色</div>
            <orange-color-palette @OrangeColorPaletteCall="paletteHandle" class="iStyInput" :default="'#'+color"></orange-color-palette>
          </div>
          <div class="iStyColors"><!--选择区域-->
            <div class="iStyColor" v-for="color in colors" :style="'background:#'+color" @click="paletteHandle(color)"></div>
          </div>
          <div class="iStyP">
            <div class="iStyName">当前宽度</div>
            <div class="iStyWidth" title="当前宽度">{{width}}</div>
          </div>
          <div class="iStySlide">
            <orange-slide-block @OrangeSlideBlockCall="sliderHandle" :div-style="'width:267px;left:-92px;top:34%'" max="15" min="2" :default="width"></orange-slide-block>
          </div>
        </div>
      </div>
      <div class="item iAttribute"><!--属性编辑，区域、名称、类型....-->
        <div class="iTitle">
          属性编辑
        </div>
        <div class="iAttContent"><!--内容-->
          <div class="iAttItem" v-for="detail in details">
            <div class="keyTips">将在您上传后同步</div>
            <div class="leftProperty">
              <input @input="keyCheck($event)" @focus="onFocusMode()" @blur="noFocusMode()" contenteditable="true" v-model:value="detail.key" maxlength="12"/>
              <img src="../../static/downInsert.png" alt="downInsert" class="icon15" title="向下插入" @click="downInsertDetail(detail.key)">
              <img src="../../static/upInsert.png" alt="upInsert" class="icon15" title="向上插入" @click="upInsertDetail(detail.key)">
              <img src="../../static/delete.png" alt="deleteButton" class="icon15" title="删除此行" @click="deleteRow(detail.key)">
            </div>
            <div class="rightValue">
              <img src="../../static/keyToValue.png" class="keyToValue" alt="keyToValue"/>
              <textarea @focus="onFocusMode()" @blur="noFocusMode()" contenteditable="true" v-model:value="detail.value"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomButtons mouseType1"><!--底部按钮-->
      <div class="bottomButton" @click="cancelEdit($event)">重置</div>
      <div class="bottomButton" @click="submitEdit($event)">上传</div>
    </div>
  </div>
</template>

<script>
import OrangeColorPalette from "./OrangeColorPalette";
import OrangeSlideBlock from "./OrangeSlideBlock";
export default {
  name: "BananaAreaAttributeBoard",
  components:{OrangeSlideBlock,OrangeColorPalette},
  data(){
    return {
      id:"-1",
      color:"000000",
      width:2,
      point:{x:0,y:0},
      details:[
        {"key":"名称","value":""},
        {"key":"类型","value":""},
        {"key":"区域","value":""},
        {"key":"备注","value":""}
      ],
      theConfig:{
        selectNum:-1
      },
      cache:{
        name:"",
        color:"",
        details:[]
      },
      tempId:1,
      show:false,
      colors:['cc0066','ff6666','ff6600','ffcc33','ffff00','99cc33','66cc33','009966','009999','0099cc','333399','993399','666633',
        '993300','ff6600','ffcc00','996600','669933','006633','006699','333366','6633cc','cccccc','666666','333333','000000'],
      insertCount:1,
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
      this.cache.name=this.name;//拷贝
      this.cache.color=this.color;
      this.cache.details=JSON.parse(JSON.stringify(this.details));
      this.waterDropletEvent();
    },
    keyCheck(ev){
      let lock=false;
      let nowValue=ev.target.value;
      let count=0;
      if(nowValue===''){
        ev.target.parentElement.parentElement.firstChild.innerText='不能重复或为空';
        ev.target.parentElement.parentElement.firstChild.style.display='block';
        lock=true;
      }
      for(let i=0;i<this.details.length;i++){
        if(nowValue===this.details[i].key){
          count++;
          if(count>=2){
            setTimeout(()=>ev.target.value='',50);
            ev.target.parentElement.parentElement.firstChild.innerText='不能重复或为空';
            ev.target.parentElement.parentElement.firstChild.style.display='block';
            lock=true;
            break;
          }
        }
      }
      if(lock===false){
        ev.target.parentElement.parentElement.firstChild.innerText='';
        ev.target.parentElement.parentElement.firstChild.style.display='none';
      }
    },
    downInsertDetail(key){
      let index=-1;
      for(let i=0;i<this.details.length;i++){
        if(this.details[i].key==key){
          index=i+1;
          break;
        }
      }
      if(index!==-1){
        let newRow={'key':'名'+this.insertCount,'value':'值'};
        this.details.splice(index,0,newRow);
      }
      this.insertCount++;
    },
    upInsertDetail(key){
      let index=-1;
      for(let i=0;i<this.details.length;i++){
        if(this.details[i].key==key){
          index=i+1;
          break;
        }
      }
      if(index!==-1){
        let newRow={'key':'名'+this.insertCount,'value':'值'};
        this.details.splice(index-1,0,newRow);
      }
      this.insertCount++;
    },
    deleteRow(key){
      let index=-1;
      for(let i=0;i<this.details.length;i++){
        if(this.details[i].key==key){
          index=i+1;
          break;
        }
      }
      if(index!==-1){
        this.details.splice(index-1,1);
      }
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
    paletteHandle(data){//调色板的监听，接收来自调色板的值
      this.color=data;
    },
    sliderHandle(data){//滑块的监听，接收来自滑块的值
      this.width=data;
    },
    submitEdit(ev){//提交-更新缓存-同时上传数据
      this.cache.name=this.name;
      this.cache.color=this.color;
      this.cache.details=JSON.parse(JSON.stringify(this.details));
      let localId=this.$store.state.serverData.socket.localId--;
      let obj={//信息汇总
        childNodes:[],
        childRelations:[],
        color:this.color,
        class:'area',
        details:this.details,
        fatherNode:'',
        fatherRelation: '',
        id:localId,
        length:null,
        point:this.tempArea.point,
        points:this.tempArea.points,
        size:null,
        type:'area',
        width:this.width
      };
      let recordObj={
        type:'upload',
        class:'area',
        id:localId,
      };
      this.$store.state.recorderData.initialIntent.push(recordObj);
      this.$store.state.serverData.socket.broadcastSendLine(obj,'area');//上传到服务器
      this.$store.commit('clearTempAreaCache');//清空缓存
      this.show=false;//隐藏面板
      this.$root.sendInstruct('addNewAreaEnd');//结束添加区域
    },
    cancelEdit(ev){//取消-从缓存中恢复源数据
      this.name=this.cache.name;
      this.color=this.cache.color;
      this.details=JSON.parse(JSON.stringify(this.cache.details));
    },
  },
  computed:{
    styleColor(){
      if(this.color){
        return 'background:#'+this.color;
      }else {
        return 'background:#ff0000';
      }
    },
    tempArea(){
      return this.$store.state.mapConfig.tempArea;
    },
    browserSize(){
      return this.$store.state.mapConfig.browser;
    },
    BoardPos(){
      let [Sl,St]=[this.StyleLeft,this.StyleTop];
      if(Sl>this.browserSize.width-325){//判断y轴是否大于浏览器页面高度
        Sl=this.browserSize.width-335;
      }
      if(St>this.browserSize.height-425){
        St=this.browserSize.height-435;
      }
      return "left:"+Sl+"px;top:"+St+"px";
    }
  },
  watch:{
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
          this.$store.state.mapConfig.tempArea.color=newValue;
        }
      }
    },
    width:{
      handler(newValue,oldValue){//检测宽度格式是否正确
        function isNumber(input) {return /^\d+$/.test(input);}
        let Exp=/^(6[0-4]|[1-5]\d|\d)$/;
        if(Exp.test(newValue)===false){
          if(newValue!==''){
            this.width=oldValue;
          }
        }else {
          this.$store.state.mapConfig.tempArea.width=newValue;
        }
      }
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
/**/
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
.keyTips{
  position: relative;
  top:-10px;
  left: 4px;
  font-size: 13px;
  font-weight: 100;
  width: 100%;
  height: 10px;
  display: block;
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
  min-height: 38px;
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
  height: 110px;
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
