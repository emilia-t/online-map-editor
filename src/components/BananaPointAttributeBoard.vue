<template>
  <div class="BananaPointAttributeBoard" v-bind:style="BoardPos" v-show="show"><!--点数据属性面板-->
    <div class="headName mouseType1" contenteditable="false"><!--头部名称-->
      编辑新增点
    </div>
    <div class="centerList mouseDefault"><!--属性列表-->
      <div class="centerListItem">
        <div class="leftAttribute"><!--左侧属性名-->
          <div><!--名称-->
            颜色
          </div>
        </div>
        <div class="centerLine"><!--中间的分割线-->
        </div>
        <textarea @focus="onFocusMode()" @blur="noFocusMode()"  class="colorInput" contenteditable="true" v-model="color" rows="1" maxlength="7"></textarea><!--右侧属性值-->
        <orange-color-palette @OrangeColorPaletteCall="paletteHandle" :default="'#ff0000'"></orange-color-palette>
      </div>
      <div class="centerListItem">
        <div class="leftAttribute">
          <div>
            宽度
          </div>
        </div>
        <div class="centerLine">
        </div>
        <textarea @focus="onFocusMode()" @blur="noFocusMode()"  class="widthInput" contenteditable="true" v-model="width" maxlength="7"></textarea>
        <orange-slide-block @OrangeSlideBlockCall="sliderHandle" :max="64" :min="2" :default="5"></orange-slide-block>
      </div>
      <div class="centerListItem" v-for="detail in details">
        <div class="leftAttribute">
          <textarea @focus="onFocusMode()" @blur="noFocusMode()"  contenteditable="true" v-model="detail.key" rows="2" maxlength="8"></textarea>
        </div>
        <div class="centerLine">
        </div>
        <textarea @focus="onFocusMode()" @blur="noFocusMode()"  class="rightValue" contenteditable="true" v-model="detail.value" rows="3" maxlength="128"></textarea>
        <div class="tickButton">
          <div class="sleBtn" ref="sleBtn" @click="selectList($event)" data-select-state="no"></div>
        </div>
      </div>
    </div>
    <div class="bottomButton mouseType1"><!--底部按钮-->
      <button @click="insertRow($event)">插入列</button>
      <button @click="removeRow($event)">删除列</button>
      <button @click="cancelEdit($event)">重置</button>
      <button @click="submitEdit($event)">上传</button>
    </div>
  </div>
</template>

<script>
import OrangeColorPalette from "./OrangeColorPalette";
import OrangeSlideBlock from "./OrangeSlideBlock";
export default {
  name: "BananaPointAttributeBoard",
  components:{OrangeSlideBlock,OrangeColorPalette},
  data(){
    return {
      id:"-1",
      color:"000000",
      width:5,
      point:{x:0,y:0},
      details:[
        {"key":"名称","value":""},
        {"key":"地址","value":""},
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
      show:false
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
    buttonAnimation(ev){//按钮动画
      ev.target.classList.contains('animation')?ev.target.classList.toggle('animationB'):ev.target.classList.toggle('animation');
    },
    submitEdit(ev){//提交-更新缓存-同时上传数据
      this.cache.name=this.name;
      this.cache.color=this.color;
      this.cache.details=JSON.parse(JSON.stringify(this.details));
      this.buttonAnimation(ev);
      let obj={
        class:"point",
        point:this.point,
        color:this.color,
        width:this.width,
        details:this.details,
      };
      this.$store.state.serverData.socket.broadcastSendPoint(obj);
      this.show=false;
      this.$root.sendInstruct('addNewPointEnd');
    },
    cancelEdit(ev){//取消
      this.name=this.cache.name;
      this.color=this.cache.color;
      this.details=JSON.parse(JSON.stringify(this.cache.details));
      this.buttonAnimation(ev);
    },
    selectList(ev){//选择列
      let nowSle=ev.target;
      let sleBtn=this.$refs.sleBtn;
      let leng=sleBtn.length;
      for(let i=0;i<leng;i++){
        if(sleBtn[i]==nowSle){
          this.theConfig.selectNum=i;
          sleBtn[i].setAttribute('data-select-state','yes');
          sleBtn[i].classList.add('sleBtnSelected');
        }else {
          sleBtn[i].setAttribute('data-select-state','no');
          sleBtn[i].classList.remove('sleBtnSelected');
        }
      }
    },
    insertRow(ev){//插入列
      let nowSelList=this.theConfig.selectNum===-1?0:this.theConfig.selectNum;//选中列
      let temp={"key":"空值","value":"空值"};
      this.details.splice(nowSelList,0,temp);
      let sleBtn=this.$refs.sleBtn;//重置样式
      let leng=sleBtn.length;
      for(let i=0;i<leng;i++){
        sleBtn[i].setAttribute('data-select-state','no');
        sleBtn[i].classList.remove('sleBtnSelected');
      }
      this.theConfig.selectNum=-1;//重置选择
      this.buttonAnimation(ev);
    },
    removeRow(ev){//删除列
      let nowSelList=this.theConfig.selectNum;//选中列
      if(nowSelList==-1){
        alert('请选择需要删除的列');
        return false;
      }
      this.details.splice(nowSelList,1);
      let sleBtn=this.$refs.sleBtn;//重置样式
      let leng=sleBtn.length;
      for(let i=0;i<leng;i++){
        sleBtn[i].setAttribute('data-select-state','no');
        sleBtn[i].classList.remove('sleBtnSelected');
      }
      this.theConfig.selectNum=-1;//重置选择
      this.buttonAnimation(ev);
    }
  },
  computed:{
    browserSize(){
      return this.$store.state.mapConfig.browser;
    },
    BoardPos(){
      let [Sl,St]=[this.StyleLeft,this.StyleTop];
      if(Sl>this.browserSize.width-325){
        Sl=this.browserSize.width-335;
      }
      if(St>this.browserSize.height-425){
        St=this.browserSize.height-435;
      }
      return "left:"+Sl+"px;top:"+St+"px"
    },
    TempPoint(){
      return this.$store.state.mapConfig.tempPoint.point;
    }
  },
  watch:{
    TempPoint:{
      handler(newValue){
        this.point.x=newValue.x;
        this.point.y=newValue.y;
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
        function isNumber(input) {return /^\d+$/.test(input);}
        let Exp=/^(6[0-4]|[1-5]\d|\d)$/;
        if(Exp.test(newValue)===false){
          if(newValue!==''){
            this.width=oldValue;
          }
        }else {
          this.$store.state.mapConfig.tempPoint.width=newValue;
        }
      }
    }
  }
}
</script>

<style scoped>
@keyframes buttonAnimation {
  0%{
    background: #979797;
  }
  100%{
    background: white;
  }
}
@keyframes buttonAnimationB {
  0%{
    background: #979796;
  }
  100%{
    background: white;
  }
}
.animation{
  animation: buttonAnimation .5s forwards;
}
.animationB{
  animation: buttonAnimationB .5s forwards;
}
.BananaPointAttributeBoard{
  position: fixed;
  z-index: 550;
  width: 300px;
  height: 400px;
  background: rgba(255,255,255,0.85);
  box-shadow: #b1b1b1 2px 2px 5px;
  border-radius: 5px;
  padding: 5px;
}
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
.mouseDefault{
  cursor:no-drop
}
.mouseType1{
  cursor: default;
}
.centerList{
  width: 100%;
  height: calc(100% - 35px - 25px);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: left;
  flex-direction: column;
  position:relative;
  z-index: 200;
}
.centerListItem{
  min-width: calc(100% - 10px);
  margin: 3px 10px 3px 0px;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  background: white;
  border-radius: 3px;
  border:1px dashed #d8d8d8;
}
.bottomButton{
  width: 100%;
  height: 25px;
  border-radius: 3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 1px 0px 4px #c1c1c1;
  position:relative;
  z-index: 400;
}
button{
  background: white;
  border: none;
  border-radius: 3px;
  font-size: 13px;
  box-shadow: 0px 0px 1px #adadad;
}

.leftAttribute{
  width: 70px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  color: rgba(50, 50, 50, 0.8);
  font-weight: 400;
}
.leftAttribute textarea{
  font-weight: 400;
  font-size: 14px;
}
.leftAttribute div{
  margin: 3px 0px;
  padding: 2px 2px;
  font-size: 14px;
}
.centerLine{
  width: 2px;
  height: 100%;
  overflow: hidden;
  background: white;
}
.rightValue{
  width: calc(100% - 70px - 2px - 8px - 20px - 4px);
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 14px;
  padding:0px 4px;
  color: rgb(45, 45, 45);
  line-height: 18px;
}
.tickButton{
  width: 20px;
  height: 100%;
  margin-right: 4px;
  padding: 4px 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.sleBtn{
  width: 14px;
  height: 14px;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  background: #ffffff;
  overflow: hidden;
  cursor: pointer;
}
.sleBtnSelected{
  background: #4b9bfd;
}
textarea{
  border:none;
  outline: none;
  resize: none;
  background:white;
  appearance:none;
  cursor: text;
}
.widthInput{
  width: calc(100% - 2px - 70px - 100px - 4px);
  height: 35px;
  border: none;
  padding: 0px 0px 0px 4px;
  font-size: 14px;
  line-height: 35px;
}
.colorInput{
  width: calc(100% - 2px - 70px - 45px - 4px);
  height: 35px;
  border: none;
  padding: 0px 0px 0px 4px;
  font-size: 14px;
  line-height: 35px;
}
</style>
