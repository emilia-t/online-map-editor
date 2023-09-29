<template>
  <div class="listDiv">
    <ul class="listUL">
      <li v-for="(group,index) in structure" :key="index" class="listLI" @mouseenter.stop="showChild(index)" @mouseleave.stop="hideChild()" @click.stop="selectedGroupA(group[0])" ref="GroupName">
        {{group[0]}}
        <orange-group-list v-if="group.length>1" v-show="showNode&&index===showNodeIndex" :father="group[0]" :level="level+1" :structure="group.slice(1)" @OrangeGroupListCall="selectedGroupA"></orange-group-list>
      </li>
    </ul>
  </div>
</template>

<script>
import OrangeGroupList from "./OrangeGroupList";
export default {
  name: "OrangeGroupList",
  components:{
    OrangeGroupList
  },
  props:{
    level:{//分组层级
      type:Number,
      default:1,
      required:true,
    },
    structure:{//图层分组结构
      type:Array,
      default:[],
      required:true,
    },
    father:{
      type:String,
      default:'',
      required:false
    }
  },
  data(){
    return {
      showNode:false,
      showNodeIndex:-1,
    }
  },
  mounted() {

  },
  methods:{
    showChild(index){
      this.showNodeIndex=index;
      this.showNode=true;
    },
    hideChild(){
      this.showNodeIndex=-1;
      this.showNode=false;
    },
    selectedGroupA(data){
      data+='⇉'+this.father;
      this.$emit('OrangeGroupListCall',data);
    }
  }
}
</script>

<style scoped>

.listLI{
  width: calc(100% - 30px);
  height: 20px;
  padding: 8px 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.listLI:hover{
  background: #f1f1f1;
}
.listUL{
  width: 180px;
  height: auto;
  min-height: 100px;
  position: absolute;
  left: 180px;
  top: 0px;
  z-index: 550;
  background: white;
  box-shadow: #c5c5c5 0px 0px 6px;
  margin: 0px;
  padding: 0px;
}
.listDiv{
  position: absolute;
  top:0px;
  left: 0px;
}
</style>
