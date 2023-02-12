<template>
<!--点数据属性面板-->
  <div class="pointAttributeBoardLevel">
    <!--头部名称-->
    <textarea class="headName" contenteditable="true" v-model="name" rows="2" maxlength="30">

    </textarea>
    <!--属性列表-->
    <div class="centerList">
      <!--单列-->
      <div class="centerListItem">
        <!--左侧属性名-->
        <div class="leftAttribute">
          <!--名称-->
          <div>
            id
          </div>
        </div>
        <!--中间的分割线-->
        <div class="centerLine">

        </div>
        <!--右侧属性值-->
        <div class="rightValue">
          {{id}}
        </div>
        <!--不可勾选按钮-->
        <div class="doneTickButton">
          <div class="doneSleBtn"></div>
        </div>
      </div>
      <div class="centerListItem">
        <!--左侧属性名-->
        <div class="leftAttribute">
          <!--名称-->
          <div>
            坐标
          </div>
        </div>
        <!--中间的分割线-->
        <div class="centerLine">

        </div>
        <!--右侧属性值-->
        <div class="rightValue">
          x:{{point.x}},y:{{point.y}}
        </div>
        <!--勾选按钮-->
        <div class="doneTickButton">
          <div class="doneSleBtn"></div>
        </div>
      </div>
      <div class="centerListItem">
        <!--左侧属性名-->
        <div class="leftAttribute">
          <!--名称-->
          <div>
            颜色
          </div>
        </div>
        <!--中间的分割线-->
        <div class="centerLine">

        </div>
        <!--右侧属性值-->
        <textarea class="rightValue" contenteditable="true" v-model="color" rows="1" maxlength="7">

        </textarea>
        <!--勾选按钮-->
        <div class="doneTickButton">
          <div class="doneSleBtn"></div>
        </div>
      </div>
      <div class="centerListItem" v-for="detail in details">
        <!--左侧属性名-->
        <div class="leftAttribute">
          <!--名称-->
          <textarea contenteditable="true" v-model="detail.key" rows="2" maxlength="8">

          </textarea>
        </div>
        <!--中间的分割线-->
        <div class="centerLine">

        </div>
        <!--右侧属性值-->
        <textarea class="rightValue" contenteditable="true" v-model="detail.value" rows="3" maxlength="128">

        </textarea>
        <!--勾选按钮-->
        <div class="tickButton">
          <div class="sleBtn" ref="sleBtn" @click="selectList($event)" data-select-state="no"></div>
        </div>
      </div>
    </div>
    <!--底部按钮-->
    <div class="bottomButton">
      <button @click="insertRow($event)">插入列</button>
      <button @click="removeRow($event)">删除列</button>
      <button @click="cancelEdit($event)">取消</button>
      <button @click="submitEdit($event)">提交</button>
      <!--按钮逻辑-->
      <!--

      勾选框只能单选

      1.新增点：
      默认会有几个列：颜色、名字

      2.插入行：
      点击右侧的勾选框可以选择该行
      在左下角按钮可以点击“插入列”并在该选中行上方插入空列
      空列输入后可以点击右下角提交按钮
      如果不想插入了
      可以在右下角点击取消

      3.删除列
      点击右侧勾选框选择要删除的行
      在左下角按钮点击“删除列”

      4.数据保存
      编辑完成点数据后点击右下角提交上传数据库

      -->
    </div>
  </div>
</template>

<script>
export default {
  name: "pointAttributeBoardLevel",
  data(){
    return {
      name:"顺德一中",
      id:"p10001",
      color:"#ffffff",
      point:{x:0.00020001,y:-0.00002001},
      details:[
        {"key":"详细地址","value":"深圳市坪山区坑梓街道秀新社区锦绣中路聚龙山生态公园内"},
        {"key":"曾用名","value":"顺德县第一中学"},
        {"key":"类型","value":"学校"}
      ],
      theConfig:{
        selectNum:-1
      },
      cache:{
        name:"",
        color:"",
        details:[]
      }
    }
  },
  mounted() {
    // this.test();
    //20230205-写添加点(检查输入->上传->后端敏感检查->上传数据库->后端广播数据->前端接收数据)的功能，点属性面板已完成
    this.startSetting();
  },
  methods:{
    //初始设置
    startSetting(){
      //1.拷贝一份
      this.cache.name=this.name;
      this.cache.color=this.color;
      this.cache.details=JSON.parse(JSON.stringify(this.details));
    },
    //按钮动画
    buttonAnimation(ev){
      ev.target.classList.contains('animation')?ev.target.classList.toggle('animationB'):ev.target.classList.toggle('animation');
    },
    //提交-更新缓存-同时上传数据
    submitEdit(ev){
      this.cache.name=this.name;
      this.cache.color=this.color;
      this.cache.details=JSON.parse(JSON.stringify(this.details));
      this.buttonAnimation(ev)
    },
    //取消-从缓存中恢复源数据
    cancelEdit(ev){
      this.name=this.cache.name;
      this.color=this.cache.color;
      this.details=JSON.parse(JSON.stringify(this.cache.details));
      this.buttonAnimation(ev)
    },
    //选择列
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
      console.log(this.theConfig.selectNum)
    },
    //插入列
    insertRow(ev){
      //选中列：
      let nowSelList=this.theConfig.selectNum===-1?0:this.theConfig.selectNum;
      let temp={"key":"空值","value":"空值"};
      this.details.splice(nowSelList,0,temp);
      //重置样式
      let sleBtn=this.$refs.sleBtn;
      let leng=sleBtn.length;
      for(let i=0;i<leng;i++){
        sleBtn[i].setAttribute('data-select-state','no');
        sleBtn[i].classList.remove('sleBtnSelected');
      }
      //重置选择
      this.theConfig.selectNum=-1;
      console.log(this.theConfig.selectNum);
      this.buttonAnimation(ev)
    },
    //删除列
    removeRow(ev){
      //选中列：
      let nowSelList=this.theConfig.selectNum;
      if(nowSelList==-1){
        alert('请选择需要删除的列');
        return false;
      }
      this.details.splice(nowSelList,1);
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
    //测试
    test(){
      setInterval(
        ()=>{
          console.log(this.cache.name)
        }
      ,1000)
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
.pointAttributeBoardLevel{
  position: fixed;
  top: 400px;
  left: 100px;
  width: 300px;
  height: 400px;
  background: #fefefe;
  box-shadow: #f4f4f4 2px 2px 5px;
  border-radius: 10px;
  padding: 5px;
}
.headName{
  width: calc(100% - 10px);
  height: 35px;
  line-height: 34px;
  /*background: #97d4d9;*/
  background: #8fcfd1;
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  padding: 0px 5px;
  color: #fcffff;
}
.centerList{
  width: 100%;
  height: calc(100% - 35px - 25px);
  /*background: #34bdff;*/
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: left;
  flex-direction: column;
}
.centerListItem{
  min-width: 100%;
  margin: 3px 0px;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  /*overflow: hidden;*/
  background: #fafafa;
  border-radius: 5px;
}
.bottomButton{
  width: 100%;
  height: 25px;
  background: #e8eff5;
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}
button{
  background: white;
  border: none;
  border-radius: 3px;
  font-size: 13px;
  box-shadow: 1px 1px 1px #adadad;
}

.leftAttribute{
  width: 70px;
  min-height: 100%;
  /*background: #ffd35d;*/
  display: flex;
  flex-direction: column;
  justify-content: left;
  color: rgba(50, 50, 50, 0.8);
}
.leftAttribute div{
  margin: 3px 0px;
  padding: 2px 0px;
  font-size: 13px;
}
.centerLine{
  width: 2px;
  height: 100%;
  overflow: hidden;
  background: #fff1aa;
}
.rightValue{
  width: calc(100% - 70px - 2px - 8px - 20px - 4px);
  min-height: 100%;
  /*background: #8dffdf;*/
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 12px;
  padding:0px 4px;
  color: rgba(255, 77, 77, 0.8);
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
  background: #7b7b7b;
  overflow: hidden;
}
.sleBtn{
  width: 14px;
  height: 14px;
  border: 1px solid #a9a9a9;
  border-radius: 15px;
  background: #ffffff;
  overflow: hidden;
}
.sleBtnSelected{
  background: #3590ff;
}
textarea{
  border:none;
  outline: none;/*边线不显示*/
  resize: none;/*禁止拉伸*/
  background:#fafafa;
  appearance:none;
}
*::-webkit-scrollbar {
  width: 4px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0,0,0,0.2);
}
*::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}

</style>
