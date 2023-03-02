<template>
  <!--左侧的详细信息编辑面板-->
  <!--职责-监听需要编辑的要素id并展示被选中的要素id的各种属性，并提供编辑属性值功能-->
  <!--权限-允许访问store.state.mapconfig-->
  <div class="LayerDetailsPanel">
    <!--顶部标题-->
    <div class="top">
      元素信息面板
    </div>
    <!--内容-->
    <div class="content">
      <!--id-->
      <div class="listBox">
        <div class="boxLeft">
          ID
        </div>
        <div class="boxRight">
          {{exampleConfig.id}}
        </div>
      </div>
      <!--type-->
      <div class="listBox">
        <div class="boxLeft">
          Type
        </div>
        <div class="boxRight">
          {{exampleConfig.type}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.color">
        <div class="boxLeft">
          Color
        </div>
        <div class="boxRight">
          {{exampleConfig.color}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.length">
        <div class="boxLeft">
          Length
        </div>
        <div class="boxRight">
          {{exampleConfig.length}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.width">
        <div class="boxLeft">
          Width
        </div>
        <div class="boxRight">
          {{exampleConfig.width}}
        </div>
      </div>
      <div class="listBox" v-show="exampleConfig.size">
        <div class="boxLeft">
          Size
        </div>
        <div class="boxRight">
          {{exampleConfig.size}}
        </div>
      </div>
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
        "id": "10",
        "type": "point",
        "points": [
          {
            "x": -0.0000632,
            "y": 0.0000335
          }
        ],
        "point": {
          "x": -0.0000632,
          "y": 0.0000335
        },
        "color": "c9ff6c",
        "length": null,
        "width": "10",
        "size": null,
        "child_relations": null,
        "father_relation": null,
        "child_nodes": null,
        "father_node": null,
        "details": [
          {
            "key": "详细地址",
            "value": "测试11111"
          },
          {
            "key": "曾用名",
            "value": "测试22222"
          },
          {
            "key": "类型",
            "value": "自定义类型"
          }
        ]
      }
    }
  },
  mounted() {
    //this.online();
  },
  methods:{
    online(){
      setTimeout(()=>{window.location.reload()},5000)
    }
  }
}
</script>

<style scoped>
.LayerDetailsPanel{
  width: 350px;
  height: 100%;
  background: #f8f8f8;
  position: fixed;
  top:0;
  left: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: #b8b8b8 3px 3px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.top{
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  background: #ecd2c5;
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
  width: calc(30% - 1px);
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
