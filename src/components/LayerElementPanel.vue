<template>
  <div class="elementPanelLayer" v-show="this.$store.state.userSettingConfig.elementPanelLayerShow">
    <div class="title">
      元素列表
    </div>
    <div class="content"><!--遍历-->
      <div class="listBox" v-for="element in theMapData.areas">
        <div class="listId">
          {{element.id}}
        </div>
        <div class="listValue" v-text="searchNameKey(element)">

        </div>
      </div>
      <div class="listBox" v-for="element in theMapData.lines">
        <div class="listId">
          {{element.id}}
        </div>
        <div class="listValue" v-text="searchNameKey(element)">

        </div>
      </div>
      <div class="listBox" v-for="element in theMapData.points">
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
      theMapData:{points:[],lines:[],areas:[]},
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){

    },
    searchNameKey(ele){//查找名称details并返回，如果没有找到则返回空值
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
    mapData:{
      handler(newValue){
        if(newValue.length!==0){
          this.theMapData.lines=newValue.lines;
          this.theMapData.points=newValue.points;
          this.theMapData.areas=newValue.areas;
        }
      },
      deep:true
    }
  },
  destroyed(){

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
}
.listValue{
  width: calc(100% - 60px);
  font-weight: 400;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
}
.elementPanelLayer{
  width: 350px;
  height: calc(100% - 15px * 2 );
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 549;
  background: #fdfdfd;
  left: 25px;
  top:15px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 2px 2px 10px #d8d8d8;
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
