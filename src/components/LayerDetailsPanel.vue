<template>
  <!--左侧的详细信息编辑面板-->
  <!--职责-监听需要编辑的要素id并展示被选中的要素id的各种属性，并提供编辑属性值功能-->
  <!--权限-允许访问store.state.mapconfig-->
  <div class="detailsPanelLayer" ref="LayerDetailsPanel">
    <!--顶部标题-->
    <div class="top">
      元素信息面板
    </div>
    <div>基本信息</div>
    <!--内容-->
    <div class="content">
      <!--id-->
      <div class="listBox">
        <div class="boxLeft">
          序列号
        </div>
        <div class="boxRight">
          {{exampleConfig.id}}
        </div>
      </div>
      <!--type-->
      <div class="listBox"  v-show="exampleConfig.type">
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
    <div>详细信息</div>
    <div class="content">
      <!--details-->
      <div v-show="exampleConfig.details" v-for="detail in exampleConfig.details">
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
    //隐藏面板
    hidden(){
      this.$refs.LayerDetailsPanel.style.left='-350px';
    },
    //显示面板
    show(){
      this.$refs.LayerDetailsPanel.style.left='0px';
    }
  },
  computed:{
    targetId(){
      return this.$store.state.detailsPanelConfig.target;
    }
  },
  watch:{
    targetId:{
      handler(newValue){
        if(newValue===-1){
          this.hidden();
        }else {
          this.show();
        }
        this.exampleConfig=this.$store.state.detailsPanelConfig.data;
        this.sourcePoint=this.$store.state.detailsPanelConfig.sourcePoint;
      }
    }
  }
}
</script>

<style scoped>
.detailsPanelLayer{
  width: 350px;
  height: 100%;
  background: #f8f8f8;
  position: fixed;
  top:0;
  left: -350px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: #b8b8b8 3px 3px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  transition: 0.4s;
  overflow-y: auto;
  overflow-x: hidden;
}
.top{
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  background: #ffffff;
  font-size: 24px;
  font-weight: 400;
  align-items: center;
  border-top-right-radius: 10px;
  border-bottom: 2px dashed #e7e1e5;
  color: rgba(50, 50, 50, 0.85);;
  /*ff4949*/
}
.content{
  width: 100%;
}
.listBox{
  width: calc(100% - 2px - 2px);
  margin:4px 0px;
  border: 1px dashed #c7c5c7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background: #f7f7f7;
  font-size: 17px;
}
.boxLeft{
  width: calc(24% - 1px);
  height: auto;
  padding: 10px;
  border-right: 1px dashed #c7c5c7;
  font-weight: 400;
  /*background: red;*/
}
.boxRight{
  width: 70%;
  height: auto;
  padding: 10px;
  font-weight: 100;
  /*background: #48caec;*/
}
</style>
