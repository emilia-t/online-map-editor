<template>
  <div class="elementPanelLayer">
    <div class="panelHead">
      <div class="headTitle">
        <span>坪山区测试地图</span>
        <more custom="cursor:pointer"></more>
      </div>
      <div class="headText">
        浏览次数&nbsp;147&nbsp;&nbsp;&nbsp;提交次数&nbsp;2784
      </div>
      <div class="headText">
        上次修改时间&nbsp;&nbsp;&nbsp;2月22日&nbsp;&nbsp;&nbsp;已保存
      </div>
    </div>
    <div class="panelButton">
      <div class="buttonBox">
        <add-new-layer></add-new-layer>
        <div class="buttonBoxText">
          普通图层
        </div>
      </div>
      <div class="buttonBox">
        <add-new-group></add-new-group>
        <div class="buttonBoxText">
          嵌套图层
        </div>
      </div>
      <div class="buttonBox">
        <preview-eye></preview-eye>
        <div class="buttonBoxText">
          预览
        </div>
      </div>
    </div>
    <div class="panelContent">
      <div class="ordinaryLayersBox"><!--普通图层：可以应用样式依据功能、同时显示和同时隐藏图层内的元素，但会限制每个元素使用同样的details字段-->
        <div class="ordinaryLayer"><!--图层：[{layerName:'opppo',data:[{ke:'name',val:'xxx'},{key:'age',val:'12'}],[{ke:'name',val:'YYY'},{key:'age',val:'13'}]}]-->
          <div class="ordinaryLayerName">
            <div>
              <div>

              </div>
              <div>

              </div>
            </div>
            <div>

            </div>
          </div>
          <div class="ordinaryLayerCustom">

          </div>
        </div>
      </div>
      <div class="nestedLayersBox"><!--嵌套图层：可以嵌套的元素文件夹，将不同文件放入不同分组内，每个分组又可以包含其他分组，每个组别下的元素可以是各种各样的元素，不限制details字段是否一致-->
        <div><!--Nested layers：{'group1':{           group1_2:{           }  }}-->

        </div>
      </div>
    </div>
    <div class="panelSearch">

    </div>
  </div>
</template>

<script>
import AddNewLayer from "../svgValidIcons/addNewLayer";
import AddNewGroup from "../svgValidIcons/addNewGroup";
import PreviewEye from "../svgValidIcons/previewEye";
import More from "../svgValidIcons/more";
export default {
  name: "temp",
  components: {More,AddNewLayer,AddNewGroup,PreviewEye},
  data(){
    return{
      ordinaryLayers:{
        layerName:'layerName',
        data:[
          {
            "id": "81",
            "type": "point",
            "points": [
              {
                "x": 114.33697953948973,
                "y": 22.71735851227606
              }
            ],
            "point": {
              "x": 363,
              "y": -642
            },
            "color": "99cc33",
            "phase": "1",
            "width": "5",
            "child_relations": null,
            "father_relation": null,
            "child_nodes": null,
            "father_node": null,
            "details": [
              {
                "key": "名称",
                "value": "点-2"
              },
              {
                "key": "地址",
                "value": ""
              },
              {
                "key": "类型",
                "value": ""
              },
              {
                "key": "区域",
                "value": ""
              },
              {
                "key": "备注",
                "value": ""
              }
            ],
            "custom": {
              "color": "#99cc33",
              "icon": "usualIcon003.png",
              "width": null,
              "layerData":{
                "layerName":'普通路段'
              }
            }
          },
          {
            "id": "65",
            "type": "area",
            "points": [
              {
                "x": 930,
                "y": -300.9999962383881
              },
              {
                "x": 715,
                "y": -393.9995117848739
              },
              {
                "x": 739,
                "y": -215.0004443046637
              }
            ],
            "point": {
              "x": 930,
              "y": -300.9999962383881
            },
            "color": "000000",
            "phase": "1",
            "width": "2",
            "child_relations": null,
            "father_relation": null,
            "child_nodes": null,
            "father_node": null,
            "details": [
              {
                "key": "名称",
                "value": "公园"
              },
              {
                "key": "类型",
                "value": ""
              },
              {
                "key": "区域",
                "value": ""
              },
              {
                "key": "备注",
                "value": ""
              }
            ],
            "custom": null
          },
          {
            "id": "78",
            "type": "line",
            "points": [
              {
                "x": 480,
                "y": -466
              },
              {
                "x": 466,
                "y": -660.0000000004657
              },
              {
                "x": 621,
                "y": -730
              }
            ],
            "point": {
              "x": 480,
              "y": -466
            },
            "color": "000000",
            "phase": "1",
            "width": "7",
            "child_relations": null,
            "father_relation": null,
            "child_nodes": null,
            "father_node": null,
            "details": [
              {
                "key": "名称",
                "value": "线段"
              },
              {
                "key": "类型",
                "value": ""
              },
              {
                "key": "区域",
                "value": ""
              },
              {
                "key": "备注",
                "value": ""
              }
            ],
            "custom": null
          }
        ]
      },
      nestedLayers:[

      ],
    }
  },
  mounted() {
  },
  methods:{

  },
  computed:{

  },
  watch:{

  }
}
</script>

<style scoped>
.elementPanelLayer{
  width: calc(300px - 18px);
  height: calc(100% - 20px);
  position: fixed;
  z-index: 545;
  left: 20px;
  top: 10px;
  overflow: hidden;
  border-radius: 6px;
  padding: 0px 9px;
  background: white;
  box-shadow: #c5c5c5 0px 0px 6px;
}
.panelHead{
  width: 100%;
  height: 90px;
}
.panelButton{
  width: 100%;
  border-radius: 3px;
  height: 30px;
  background: #f3f3f3;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  overflow: hidden;
}
.panelContent{
  width: 100%;
  height: calc(100% - 90px - 30px - 40px);
}
.panelSearch{
  width: 100%;
  height: 40px;
  background: skyblue;
}
.headTitle{
  width:100%;
  height: 33px;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 7px;
}
.headText{
  width: 100%;
  height: 25px;
  font-size: 14px;
  font-weight: 100;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: end;
}
.buttonBoxText{
  font-size: 13.5px;
  font-weight: 200;
}
.buttonBox{
  width: 80px;
  height: 100%;
  font-size: 13px;
  font-weight: 100;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.buttonBox svg{
  margin: 0px 2px;
}
</style>
