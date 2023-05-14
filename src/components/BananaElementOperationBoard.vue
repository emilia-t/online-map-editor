<template>
  <div class="BananaElementOperationBoard" v-show="this.$store.state.elementOperationBoardConfig.display" :style="style">
    <!--右键菜单-->
    <div class="panel">
      <div class="ButtonBox" ref="deleteButtonBox">
        <img @click="deleteElement()" class="ButtonImg" draggable="false" alt="按钮" :src="deleteButton"/>
      </div>
      <div class="ButtonBox" ref="editButtonBox">
        <img @click="editElement()" class="ButtonImg" draggable="false" alt="按钮" :src="editButton"/>
      </div>
      <div class="ButtonBox" ref="moreButtonBox">
        <img class="ButtonImg" draggable="false" alt="按钮" :src="moreButton"/>
      </div>
    </div>
    <!--编辑面板-->
    <div v-show="editPanelShow" class="EditPanel">
      <div class="BananaPointAttributeBoard">
        <div class="headName mouseType1" contenteditable="false">编辑元素</div>
        <div class="centerList mouseDefault">
          <div class="centerListItem">
            <div class="leftAttribute"><div>颜色</div></div>
            <div class="centerLine"></div>
            <textarea @focus="onFocusMode()" @blur="noFocusMode()"  class="colorInput" contenteditable="true" v-model="operatedCache.color" rows="1" maxlength="7"></textarea>
            <orange-color-palette @OrangeColorPaletteCall="paletteHandle" :default="'#ffffff'"></orange-color-palette>
          </div>
          <div class="centerListItem">
            <div class="leftAttribute"><div>宽度</div></div>
            <div class="centerLine"></div>
            <textarea @focus="onFocusMode()" @blur="noFocusMode()"  class="widthInput" contenteditable="true" v-model="operatedCache.width" maxlength="7"></textarea>
            <orange-slide-block @OrangeSlideBlockCall="sliderHandle" :max="64" :min="2" :default="5"></orange-slide-block>
          </div>
          <div class="centerListItem" v-for="detail in operated.details">
            <div class="leftAttribute">
              <textarea @focus="onFocusMode()" @blur="noFocusMode()"  contenteditable="true" v-model="detail.key" rows="2" maxlength="8"></textarea>
            </div>
            <div class="centerLine"></div>
            <textarea @focus="onFocusMode()" @blur="noFocusMode()"  class="rightValue" contenteditable="true" v-model="detail.value" rows="3" maxlength="128"></textarea>
            <div class="tickButton">
              <div class="sleBtn" ref="sleBtn" @click="selectList($event)" data-select-state="no"></div>
            </div>
          </div>
        </div>
        <div class="bottomButton mouseType1">
          <button @click="insertRow($event)">插入列</button>
          <button @click="removeRow($event)">删除列</button>
          <button @click="submitEdit($event)">上传</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Lodash from 'lodash'
import deleteButton from '../../static/delete.png'
import moreButton from '../../static/more.png'
import editButton from '../../static/edit.png'
import orangeColorPalette from './OrangeColorPalette'
import orangeSlideBlock from './OrangeSlideBlock'
export default {
  name: "BananaElementOperationBoard",
  components:{orangeColorPalette,orangeSlideBlock},
  data(){
    return {
      deleteButton,
      moreButton,
      editButton,
      editPanelShow:false,
      theConfig:{
        selectNum:-1
      },
      operatedCache:{

      },
      operatedBack:null
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){

    },
    //聚焦模式
    onFocusMode(){
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    //非聚焦模式
    noFocusMode(){
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    //按钮动画
    buttonAnimation(ev){
      ev.target.classList.contains('animation')?ev.target.classList.toggle('animationB'):ev.target.classList.toggle('animation');
    },
    //提交-更新缓存-同时上传数据
    submitEdit(ev){
      this.buttonAnimation(ev);
      //检测两个对象的区别{isChange:true,changes:[['width','33'],['details',[{k:v}]]]}
      let changes=this.compareObjects(this.operatedBack,this.operatedCache)
      if(changes.isChange){
        changes.id=this.operatedCache.id;
        delete changes.isChange;
      }
      this.$store.state.serverData.socket.broadcastUpdateElement(changes);
    },
    compareObjects(obj1,obj2){
      const keys1=Object.keys(obj1);
      const keys2=Object.keys(obj2);
      const allKeys=Array.from(new Set(keys1.concat(keys2)));
      let changes={};
      // 遍历对象的每个属性
      for (let i=0;i<allKeys.length;i++) {
        const key=allKeys[i];
        // 如果属性值不相等，则将该属性添加到变更对象中
        if (!this.isEqual(obj1[key],obj2[key])){
          changes[key]=obj2[key];
        }
      }
      return {
        isChange: Object.keys(changes).length > 0,
        changes,
      }
    },
    // 判断两个值是否相等的工具函数
     isEqual(value,other){
      if (value===other){
        return true
      }
      if (typeof value==='object' && typeof other==='object') {
        return JSON.stringify(value)===JSON.stringify(other)
      }
      return false
    },
    //删除列
    removeRow(ev){
      //选中列：
      let nowSelList=this.theConfig.selectNum;
      if(nowSelList==-1){
        alert('请选择需要删除的列');
        return false;
      }
      this.operatedCache.details.splice(nowSelList,1);
      //重置样式
      let sleBtn=this.$refs.sleBtn;
      let leng=sleBtn.length;
      for(let i=0;i<leng;i++){
        sleBtn[i].setAttribute('data-select-state','no');
        sleBtn[i].classList.remove('sleBtnSelected');
      }
      //重置选择
      this.theConfig.selectNum=-1;
      this.buttonAnimation(ev)
    },
    //插入列
    insertRow(ev){
      //选中列：
      let nowSelList=this.theConfig.selectNum===-1?0:this.theConfig.selectNum;
      let temp={"key":"空值","value":"空值"};
      this.operatedCache.details.splice(nowSelList,0,temp);
      //重置样式
      let sleBtn=this.$refs.sleBtn;
      let leng=sleBtn.length;
      for(let i=0;i<leng;i++){
        sleBtn[i].setAttribute('data-select-state','no');
        sleBtn[i].classList.remove('sleBtnSelected');
      }
      //重置选择
      this.theConfig.selectNum=-1;
      this.buttonAnimation(ev)
    },
    //选中
    selectList(ev){
      //0.获取当前选中点
      let nowSle=ev.target;
      //1.查询该class属于第几个
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
    //滑块
    sliderHandle(data){
      try{
        this.operatedCache.width=data;
      }catch (e) {

      }
    },
    //色块
    paletteHandle(data){
      this.operatedCache.color=data;
    },
    //编辑操作
    editElement(){
      //展开编辑面板
      this.editPanelShow=!this.editPanelShow;
    },
    //删除操作
    deleteElement(){
      //select id
      let id=this.$store.state.mapConfig.operated.id;
      this.$store.state.serverData.socket.broadcastDeleteElement(id);
      //关闭 element operation board
      this.$store.state.elementOperationBoardConfig.display=false;
    }
  },
  computed:{
    style(){
      let x=this.$store.state.elementOperationBoardConfig.posX+14;
      let y=this.$store.state.elementOperationBoardConfig.posY+5;
      return 'left:'+x+'px;top:'+y+'px'
    },
    operated() {
      if(this.$store.state.mapConfig.operated.data===null){
        return  {
          "id":"",
          "type":"",
          "points":[{"x":0,"y":0}],
          "point":{"x":0,"y":0},
          "color":"000000",
          "length":null,
          "width":"5",
          "size":null,
          "child_relations":null,
          "father_relation":null,
          "child_nodes":null,
          "father_node":null,
          "details":[{"key":"名称","value":""}]
        }
      }else {
        return this.$store.state.mapConfig.operated.data;
      }
    }
  },
  watch:{
    operated:{
      handler(newValue,oldValue){
        this.operatedCache=newValue;
        //备份
        if(this.operatedBack!==null){
          //出现选择了不同的id则更新备份
          if(this.operatedBack.id!==newValue.id){
            this.operatedBack=Lodash.cloneDeep(newValue);
          }
        }else {
          this.operatedBack=Lodash.cloneDeep(newValue);
        }
      },
      deep:true
    },
  }
}
</script>

<style scoped>
.EditPanel{
  position: absolute;
  left: 40px;
}
.BananaElementOperationBoard{
  position: fixed;
  z-index: 560;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.panel{
  user-select: none;
  position: absolute;
  left: 0px;
  width: 30px;
  height: auto;
  min-height: 70px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  background: rgba(255,255,255,0.85);
}
.ButtonBox{
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin: 5px 0px;
  cursor: pointer;
  transition: 0.3s;
  background: rgba(255,255,255,0.8);
}
.ButtonBox:hover{
  background: rgba(220,220,220,0.8);
}
.ButtonImg{
  width: 25px;
  height: 25px;
}
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
  position: absolute;
  width: 300px;
  height: 400px;
  background: white;
  box-shadow: #b1b1b1 2px 2px 10px;
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
  /*overflow: hidden;*/
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
  /*background: #ffd35d;*/
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
  /*background: #8dffdf;*/
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 14px;
  padding:0px 4px;
  color: rgb(45, 45, 45);
  line-height: 18px;
}
.doneTickButton{
  width: 20px;
  height: 100%;
  margin-right: 4px;
  padding: 4px 0px;
  /*background: white;*/
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.tickButton{
  width: 20px;
  height: 100%;
  margin-right: 4px;
  padding: 4px 0px;
  /*background: white;*/
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.doneSleBtn{
  width: 14px;
  height: 14px;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  background: #aaaaaa;
  overflow: hidden;
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
  outline: none;/*边线不显示*/
  resize: none;/*禁止拉伸*/
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
  vertical-align:middle;
  line-height: 35px;
}
.colorInput{
  width: calc(100% - 2px - 70px - 45px - 4px);
  height: 35px;
  border: none;
  padding: 0px 0px 0px 4px;
  font-size: 14px;
  vertical-align:middle;
  line-height: 35px;
}
</style>
