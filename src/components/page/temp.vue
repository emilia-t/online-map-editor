<template>
  <div class="elementPanelLayer">
    <div class="panelHead">
      <div class="headTitle">
        <span>坪山区测试地图</span>
        <svg :copyright="this.$root.Copyright" style="cursor:pointer;padding-left:10px"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="14px" height="20px">
          <path fill-rule="evenodd"  fill="rgb(92, 92, 92)" d="M2.500,4.500 C1.464,4.500 0.625,3.661 0.625,2.625 C0.625,1.589 1.464,0.750 2.500,0.750 C3.536,0.750 4.375,1.589 4.375,2.625 C4.375,3.661 3.536,4.500 2.500,4.500 ZM4.271,9.500 C4.271,10.536 3.431,11.375 2.396,11.375 C1.360,11.375 0.521,10.536 0.521,9.500 C0.521,8.464 1.360,7.625 2.396,7.625 C3.431,7.625 4.271,8.464 4.271,9.500 ZM2.396,14.500 C3.431,14.500 4.271,15.339 4.271,16.375 C4.271,17.411 3.431,18.250 2.396,18.250 C1.360,18.250 0.521,17.411 0.521,16.375 C0.521,15.339 1.360,14.500 2.396,14.500 Z"/>
        </svg>
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
        <div class="buttonBoxText">
          普通图层
        </div>
      </div>
      <div class="buttonBox">
        <svg :copyright="this.$root.Copyright"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="20.875px" height="15.875px">
          <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.8" fill="none" d="M4.750,10.250 L4.750,8.000 L15.500,8.000 L15.500,10.250 "/>
          <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.659" fill="none" d="M1.375,14.625 L1.375,10.250 L8.250,10.250 L8.250,14.625 L1.375,14.625 Z"/>
          <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.6" fill="none" d="M12.000,14.625 L12.000,10.250 L18.875,10.250 L18.875,14.625 L12.000,14.625 Z"/>
          <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.902" fill="none" d="M10.750,5.875 L10.750,8.000 "/>
          <path fill-rule="evenodd"  stroke="rgb(92, 92, 92)" stroke-width="1.25px" stroke-linecap="butt" stroke-linejoin="miter" fill="none" d="M7.625,5.875 L7.625,1.500 L14.500,1.500 L14.500,5.875 L7.625,5.875 Z"/>
        </svg>
        <div class="buttonBoxText">
          嵌套图层
        </div>
      </div>
      <div class="buttonBox">
        <svg :copyright="this.$root.Copyright"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="19px" height="15px">
          <path fill-rule="evenodd"  fill="rgb(114, 114, 114)" d="M0.750,7.500 C0.750,3.494 5.430,0.500 9.500,0.500 C13.570,0.500 18.250,3.494 18.250,7.500 C18.250,11.506 13.570,14.500 9.500,14.500 C5.430,14.500 0.750,11.506 0.750,7.500 Z"/>
          <path fill-rule="evenodd"  fill="rgb(255, 255, 255)" d="M9.500,3.750 C11.571,3.750 13.250,5.429 13.250,7.500 C13.250,9.571 11.571,11.250 9.500,11.250 C7.429,11.250 5.750,9.571 5.750,7.500 C5.750,5.429 7.429,3.750 9.500,3.750 Z"/>
          <path fill-rule="evenodd"  fill="rgb(114, 114, 114)" d="M9.500,5.500 C10.536,5.500 11.375,6.339 11.375,7.375 C11.375,8.411 10.536,9.250 9.500,9.250 C8.464,9.250 7.625,8.411 7.625,7.375 C7.625,6.339 8.464,5.500 9.500,5.500 Z"/>
        </svg>
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
export default {
  name: "temp",
  data(){
    return{
      components:{
        svgValidIcons
      },
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
