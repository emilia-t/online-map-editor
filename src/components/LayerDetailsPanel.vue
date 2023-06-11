<template>
  <div class="detailsPanelLayer" ref="LayerDetailsPanel">
    <div class="titleL"><!--顶部标题-->
      基本信息
      <div class="icon9" title="点击隐藏">
        <svg @click="hidden()" t="1683445656832" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5852" width="20" height="20"><path d="M516.5 96.3125c-230.25 0-417.65625001 187.3125-417.65625001 417.65625001 0 130.3125 59.15625001 250.78125001 162.37500002 330.56249998 73.6875 56.90625001 161.90625001 87 255.28124999 87.00000002 230.25 0 417.65625001-187.3125 417.65625001-417.65625001-0.09375001-230.15625001-187.40625001-417.5625-417.65625001-417.5625z m0 771c-78.9375 0-153.65625001-25.40625001-215.90625001-73.59375001-87.375-67.5-137.4375-169.5-137.43749998-279.74999998 0-194.8125 158.53125001-353.34375001 353.34374999-353.34375001 194.8125 0 353.34375001 158.53125001 353.34375001 353.34375001 0 194.8125-158.53125001 353.34375001-353.34375001 353.34374999z" fill="#666666" p-id="5853"></path><path d="M603.40625001 365.46874999c12.5625-12.5625 12.5625-32.90625001-2e-8-45.46874999-12.5625-12.5625-32.90625001-12.5625-45.46874999 0L413.84374999 464.28124999c-28.40625001 28.40625001-28.6875 74.4375-0.65624999 102.46875001l141.09375001 141.09375001c6.28125001 6.28125001 14.53125001 9.375 22.68749998 9.37499998s16.40625001-3.09375001 22.6875-9.375c12.5625-12.5625 12.5625-32.90625001 0-45.46874999L458.65624999 521.28125001c-3-3-2.8125-8.25 0.5625-11.62500002l144.18750002-144.18749998z" fill="#666666" p-id="5854"></path></svg>
      </div>
    </div>
    <div class="content"><!--内容-->
      <div class="listBox"><!--id-->
        <div class="boxLeft">
          序列号
        </div>
        <div class="boxRight">
          {{exampleConfig.id}}
        </div>
      </div>
      <div class="listBox"  v-show="exampleConfig.type"><!--type-->
        <div class="boxLeft">
          元素类型
        </div>
        <div class="boxRight">
          {{exampleConfig.type}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.color">
        <div class="boxLeft">
          显示颜色
        </div>
        <div class="boxRight">
          {{exampleConfig.color}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.length">
        <div class="boxLeft">
          长度
        </div>
        <div class="boxRight">
          {{exampleConfig.length}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.width">
        <div class="boxLeft">
          宽度
        </div>
        <div class="boxRight">
          {{exampleConfig.width}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.size">
        <div class="boxLeft">
          面积
        </div>
        <div class="boxRight">
          {{exampleConfig.size}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.point.x">
        <div class="boxLeft">
          坐标
        </div>
        <div class="boxRight">
          x:{{sourcePoint.x}}
          <br/>
          y:{{sourcePoint.y}}
        </div>
      </div>
    </div>
    <div class="titleL">详细信息</div>
    <div class="content">
      <div v-show="exampleConfig.details" v-for="detail in exampleConfig.details"><!--details-->
        <div class="listBox">
          <div class="boxLeft">
            {{detail.key}}
          </div>
          <div class="boxRight">
            {{ detail.value}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BananaDetailsPanel",
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
        "details":[]
      },
      sourcePoint:{
        x:null,
        y:null
      }
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){

    },
    setSelectionOn(){//文字选择
      this.$refs.LayerDetailsPanel.classList.remove('selectionNone');
    },
    setSelectionOff(){//禁止文字选择
      this.$refs.LayerDetailsPanel.classList.add('selectionNone');
    },
    hidden(){//隐藏面板
      this.$refs.LayerDetailsPanel.style.left='-350px';
    },
    show(){//显示面板
      setTimeout(()=>{
        this.$refs.LayerDetailsPanel.style.left=(this.mouseClick.x-320)+'px';
        if(this.mouseClick.y+415>=window.innerHeight){//此处需要判断y是否已经大于页面高度如果大于则需要限制
          this.$refs.LayerDetailsPanel.style.top=(window.innerHeight-415)+'px';
        }else {
          this.$refs.LayerDetailsPanel.style.top=(this.mouseClick.y+5)+'px';
        }
      },15)
    }
  },
  computed:{
    targetId(){
      return this.$store.state.detailsPanelConfig.target;
    },
    mouseClick(){
      return this.$store.state.mapConfig.mouseClick;
    }
  },
  watch:{
    targetId:{
      handler(newValue){
        if(newValue===-1){//设置-1等同于隐藏
          this.hidden();
          this.setSelectionOff();
        }
        if(this.$store.state.commits.disableZoomAndMove===false){//如果有移动节点的操作会抑制更新
          if(newValue===-1){
            this.hidden();
          }else {
            this.show();//显示
            this.setSelectionOn();
          }
          this.exampleConfig=this.$store.state.detailsPanelConfig.data;
          this.sourcePoint=this.$store.state.detailsPanelConfig.sourcePoint;
        }
      }
    }
  },
  destroyed(){

  }
}
</script>

<style scoped>
.titleL{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon9{
  width: 20px;
  height: 20px;
}
.detailsPanelLayer{
  width: 300px;
  height: 400px;
  padding: 5px;
  background: white;
  position: fixed;
  z-index: 550;
  top:0;
  left: -350px;
  border-radius: 5px;
  box-shadow: #b8b8b8 3px 3px 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  transition: 0.35s;
  overflow-y: auto;
  overflow-x: hidden;
}
.content{
  width: 100%;
}
.listBox{
  width: calc(100% - 2px - 2px);
  margin:4px 0px;
  border: 1px dashed #c7c5c7;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background: white;
  font-size: 14px;
}
.boxLeft{
  width: calc(24% - 1px);
  height: auto;
  padding: 8px;
  border-right: 1px dashed #c7c5c7;
  font-weight: 400;
}
.boxRight{
  width: 70%;
  height: auto;
  padding: 8px;
  font-weight: 100;
}
.selectionNone{
  user-select: none;
}
</style>
