<template>
  <!--
  职责：显示地图整体的简要属性、例如地图大小、以列表方式展示数据（类似于谷歌地图左侧的的面板）
  允许访问、修改、删除$store.state.serverData内的数据elementPanelLayer
  -->
  <div class="elementPanelLayer">
    <div class="title">
      地图元素面板
    </div>
    <!--遍历-->
    <div class="content">
      <div class="listBox" v-for="element in theMapData">
        <div class="listId">
          {{element.id}}
        </div>
        <div class="listValue" v-text="searchNameKey(element)">

        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LayerElementPanel",
  data(){
    return {
      MY_NAME:"LayerElementPanel",
      theMapData:[],
      exampleMapData:[
        {
          "id": "11",
          "type": "point",
          "points": [
            {
              "x": -0.0001218,
              "y": 0.0000285
            }
          ],
          "point": {
            "x": -0.0001218,
            "y": 0.0000285
          },
          "color": "ccddcc",
          "length": null,
          "width": "10",
          "size": null,
          "child_relations": null,
          "father_relation": null,
          "child_nodes": null,
          "father_node": null,
          "details": [
            {
              "key": "自定义列",
              "value": "自定义列值"
            },
            {
              "key": "名称",
              "value": "测试名称"
            },
            {
              "key": "地址",
              "value": "中华人民共和国广东省"
            },
            {
              "key": "类型",
              "value": "基础"
            },
            {
              "key": "备注",
              "value": "备注信息"
            },
            {
              "key": "区域",
              "value": "中国"
            }
          ]
        },
        {
          "id": "12",
          "type": "point",
          "points": [
            {
              "x": -0.0000662,
              "y": 0.0000392
            }
          ],
          "point": {
            "x": -0.0000662,
            "y": 0.0000392
          },
          "color": "000000",
          "length": null,
          "width": "10",
          "size": null,
          "child_relations": null,
          "father_relation": null,
          "child_nodes": null,
          "father_node": null,
          "details": [
            {
              "key": "名称",
              "value": "贝多芬音乐馆"
            },
            {
              "key": "地址",
              "value": "中华人民共和国广西省"
            },
            {
              "key": "类型",
              "value": "音乐馆"
            },
            {
              "key": "备注",
              "value": "没有备注"
            },
            {
              "key": "区域",
              "value": "中国"
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){

    },
    //查找名称details并返回，如果没有找到则返回空值
    searchNameKey(ele){
      try {
        let details=ele.details;
        for (let i=0;i<details.length;i++){
          if(details[i].key==='名称'){
            return details[i].value;
          }
        }
      }catch (e) {
        return "未命名";
      }
    }
  },
  computed:{
    mapData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.mapData;
      }else {
        return [];
      }
    }
  },
  watch:{
    mapData(newValue){
      if(newValue.length!==0){
        this.theMapData=newValue;
      }
    }
  }
}
</script>

<style scoped>

.content{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.listBox{
  width: calc(100% - 6px - 2px);
  padding: 5px 0px;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 3px;
  border-radius: 3px;
  border: 1px dashed #d2d2d2;
  box-shadow: 0px 0px 4px #d2d2d2;
}
.listId{
  width: 60px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  /*background: rebeccapurple;*/
}
.listValue{
  width: calc(100% - 60px);
  font-weight: 400;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  /*background: #b5a4c9;*/
}
.elementPanelLayer{
  width: var(--panelWidth);
  height: var(--panelHight);
  display: flex;
  flex-direction: column;
  position: fixed;
  background: var(--BottomBackgroundColor);
  left: var(--panelLeft);
  top:var(--panelTop);
  border-radius: var(--borderType03);
  overflow: hidden;
  box-shadow: var(--BottomShadowColor);
}
.title{
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  border-bottom: 2px dashed #e7e1e5;
  background: #ffffff;
  font-size: 24px;
  line-height:calc(24px * 2);
  color: rgba(50, 50, 50, 0.85);
}
</style>
