<!--旧的版本-位于APP根组件的次级组件-->
<template>
<div class="mapBox">
  <data-map></data-map>
</div>
</template>

<script>
import mapBrow from "./mapBrow";
import VectorLayer from "./vectorLayer";
import dataMap from "./dataMap";
export default {
  name: "mapBox",
  /*props 支持的几种数据类型
  * 1.String
  * 2.Number
  * 3.Boolean
  * 4.Array
  * 5.Object
  * 6.Date
  * 7.Function
  * 8.Symbol
  * */
  props: {
    app_data_map_box: {
      type:Number,
      default:1,
      required:false//表示该参数为必须传递参数
    }
  },
  components: {
    VectorLayer,
    mapBrow,
    dataMap,
  },
  data(){
    return {

    }
  }
}
</script>

<style scoped>
  .mapBox{width: 100%;height: 100%;}
</style>
