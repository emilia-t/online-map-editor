<template>
  <div class="BananaKmlToOmd" ref="BananaKmlToOmd" v-show="showResponse" @click="closePanel()">
    <div class="KmlToOmdBox" @click.stop="void 0">
      <div class="filePutArea" ref="putAreaContent">
        <div class="AreaTitle">
          拖拽kml文件至此
        </div>
      </div>
      <div class="convertArrow">
        <div class="ArrowLeft">
          <div class="ArrowRect"></div>
        </div>
        <div class="ArrowRight">
          <div class="ArrowTriangle">

          </div>
        </div>
      </div>
      <div class="filePutArea">
        <div class="AreaTitle">
          等待转化
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BananaKmlToOmd",
  props:{
    showResponse:{
      type:Boolean,
      default:false,
      required:true,
    },
  },
  mounted() {
    this.setDropEvent();
  },
  methods:{
    closePanel(){
      this.$emit('kmlToOmdCloseRequest',true)
    },
    setDropEvent(){
      let [structure,reader,file,text,parser,folderName,kmlMapName]=[null,null,null,null,null,null,null];
      let [folders,placeMarks,mapData]=[[],[],[]];
      let kmlDataObj={
        mapName:null,
        mapFolders:[],
      };
      let kmlFolderObj=class kmlFolderObj {
        constructor(name) {
          this.name=name;
          this.placeMark=[];
        }
      }
      let kmlItemObj=class kmlItemObj{
        constructor() {
          this.name=null;
          this.type=null;
          this.coord=null;
          this.color=null;
          this.width=null;
          this.styleUrl=null;
          this.normalStyleId=null;
        }
      }
      let dataItemObj=class dataObj{
        constructor() {
          this.id=null;
          this.type=null;
          this.points=null;
          this.point=null;
          this.color=null;
          this.phase=null;
          this.width=null;
          this.details=null;
          this.custom=null;
        }
      };
      this.$refs.putAreaContent.addEventListener('dragover',(e)=>{e.preventDefault();});
      this.$refs.putAreaContent.addEventListener('drop',(e)=>{//放入文件后
        e.preventDefault();
        file=e.dataTransfer.files[0];
        reader=new FileReader();
        reader.readAsText(file);//按utf8读字符串
        reader.onload=function(e){//加载完成后
          text=e.target.result;
          parser=new DOMParser();//创建DOM树
          structure=parser.parseFromString(text,'application/xml');//解析text为dom树结构
          kmlMapName=structure.getElementsByTagName('name')[0].textContent;
          folders=structure.getElementsByTagName('Folder');
          for(let j=0;j<folders.length;j++){
            folderName=folders[j].getElementsByTagName('name')[0].textContent;
            placeMarks=folders[j].getElementsByTagName('Placemark');
            let newKmlFolderObj=new kmlFolderObj(folderName);
            for(let i=0;i<placeMarks.length;i++){
              let newKmlItemObj=new kmlItemObj();
              newKmlItemObj.name=placeMarks[i].querySelector('name').textContent;
              newKmlItemObj.coord=placeMarks[i].querySelector('coordinates').textContent;
              newKmlItemObj.styleUrl=placeMarks[i].querySelector('styleUrl').textContent;
              newKmlItemObj.normalStyleId=getNormalStyleId(newKmlItemObj.styleUrl,structure);
              newKmlItemObj.width=getNormalStyleWidth(newKmlItemObj.normalStyleId,structure);
              newKmlItemObj.color=getNormalStyleColor(newKmlItemObj.normalStyleId,structure);
              newKmlItemObj.coord=parseLocations(newKmlItemObj.coord);
              newKmlItemObj.type=transformType(newKmlItemObj.styleUrl);
              newKmlFolderObj.placeMark.push(newKmlItemObj);
            }
            kmlDataObj.mapName=kmlMapName;
            kmlDataObj.mapFolders.push(newKmlFolderObj);
          }
          console.log(kmlDataObj);
          //next 将转化好的kmlDataObj转化为omd
          function parseLocations(str){//解析行字符串的经纬度和高度
            let locations=[];
            let rows=str.trim().split('\n');//按行分割
            for (let row of rows) {
              let parts=row.trim().split(',');//按逗号分割
              let lng=parts[0];
              let lat=parts[1];
              let alt=parts[2];
              locations.push({
                lng:parseFloat(lng),
                lat:parseFloat(lat),
                alt:parseFloat(alt)
              });
            }
            return locations;
          }
          function transformType(styleUrl){//转化kml的元素type为omd类型,失败返回unknown
            const match=styleUrl.match(/#(\w+)-/);
            if(match){
              let kmlType=match[1];
              switch (kmlType) {
                case 'icon':{
                  return 'point';
                }
                case 'line':{
                  return 'line';
                }
                case 'poly':{
                  return 'area';
                }
                default:{
                  return 'unknown';
                }
              }
            }else{
              return 'unknown';
            }
          }
          function getNormalStyleId(styleUrl,structure){
            let styleMap=structure.getElementById(styleUrl.substring(1));
            let normalStyle=styleMap.getElementsByTagName('styleUrl')[0];
            return normalStyle.textContent.substring(1);
          }
          function getNormalStyleWidth(normalStyleId,structure){
            let normalStyle=structure.getElementById(normalStyleId);
            let arrayWidth=normalStyle.getElementsByTagName('width');
            if(arrayWidth.length!==0){
              let width=parseInt(arrayWidth[0].textContent);
              if(!isNaN(width)){
                return width;
              }else {
                return 5;
              }
            }else {
              return 5;
            }
          }
          function getNormalStyleColor(normalStyleId,structure){
            let normalStyle=structure.getElementById(normalStyleId);
            let arrayColor=normalStyle.getElementsByTagName('color');
            if(arrayColor.length!==0){
              let color=arrayColor[0].textContent.substring(0,6);
              let Exp=/^[0-9A-F]{6}$/i;
              if(Exp.test(color)===false){//错误的格式
                return '000000';
              }else{
                return color;
              }
            }else {
              return '000000';
            }
          }
        }
      });
    },
  },
  watch:{
    showResponse:{
      handler(newValue){
        if(newValue){
          this.$refs.BananaKmlToOmd.animate(
            [
              {opacity:0,transform:'scale(0.95)'},
              {opacity:1,transform:'scale(1.05)'},
              {opacity:1,transform:'scale(1)'},
            ],
            {
              duration:400,
              iterations:1,
              fill:'forwards',
              delay:0,
              easing:'ease',
            }
          );
        }
      }
    }
  }
}
</script>

<style scoped>
.AreaTitle{
  width: 100%;
  height: 40px;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.ArrowRect{
  width: 30px;
  height: 30px;
  background: #ffffff;
  box-shadow: #686868 0px 0px 6px;
}
.ArrowTriangle{
  width: 42px;
  height: 42px;
  transform: rotate(45deg) translateX(-12px) translateY(12px);
  background: #ffffff;
  box-shadow: #686868 0px 0px 6px;
}
.ArrowLeft{
  width: 30px;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.ArrowRight{
  width: 30px;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.convertArrow{
  width: 60px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.filePutArea{
  width: calc(50% - 50px);
  height: calc(100% - 20px);
  margin: 10px;
  z-index: inherit;
  box-shadow: #9ea7af 0px 0px 6px;
  background: white;
  transition: 0.4s;
  transform: scale(0.95);
}
.filePutArea:hover{
  box-shadow: #e6e8e8 0px 0px 8px;
  transform: scale(1);
}
.KmlToOmdBox{
  width: calc(1200px - 20px);
  height: calc(50% - 20px);
  padding: 10px;
  background: rgba(255,255,255,0.85);
  z-index: inherit;
  cursor: default;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.BananaKmlToOmd{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.2);
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 0px;
  top:0px;
  z-index: 595;
}
</style>
