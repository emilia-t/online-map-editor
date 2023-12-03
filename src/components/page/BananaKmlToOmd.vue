<template>
  <div class="BananaKmlToOmd" ref="BananaKmlToOmd" v-show="showResponse" @click="closePanel()">
    <div class="KmlToOmdBox" @click.stop="void 0">
      <div class="filePutArea" ref="putAreaContent">
        <div class="AreaTitle">
          拖拽kml文件至此
        </div>
        <div class="AreaDescribe">
          *将转化为1.0版本且type为All类型的OMD文件*
        </div>
        <div class="AreaFillShow" v-show="receivedFile" v-text="'已获取到文件:'+receivedFileName">

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
          等待转化并下载OMD文件
        </div>
        <div class="AreaDescribe">
          *由于kml与omd结构差异，生成的omd中所有元素和图层id会按顺序生成*
        </div>
        <div class="KmlToOmdResult">
          <a id="KmlToOmdResult">转化完成，点击下载</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BananaKmlToOmd",
  data(){
    return {
      receivedFile:false,
      receivedFileName:null,
    }
  },
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
      const a = document.getElementById('KmlToOmdResult');
      a.style.display='none';
      this.$emit('kmlToOmdCloseRequest',true);
    },
    setDropEvent(){
      let [structure,reader,file,text,parser,folderName,kmlMapName]=[null,null,null,null,null,null,null];
      let [folders,placeMarks]=[[],[]];
      let [fileName,newOMD]=[null,null];
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
      this.$refs.putAreaContent.addEventListener('dragover',(e)=>{e.preventDefault();});
      this.$refs.putAreaContent.addEventListener('drop',(e)=> {//放入文件后
        e.preventDefault();
        file = e.dataTransfer.files[0];
        fileName=file.name;
        this.receivedFileName = fileName;
        if (!this.checkKmlFile(fileName)){
          this.$store.commit('setCoLogMessage',{
            text:'请放入正确的文件',
            from:'internal:BananaKmlToOmd',
            type:'warn',
          });
          return false;
        }
        reader = new FileReader();
        reader.readAsText(file);//按utf8读字符串
        reader.onload = function (e) {//加载完成后
          try{
            text = e.target.result;
            parser = new DOMParser();//创建DOM树
            structure = parser.parseFromString(text, 'application/xml');//解析text为dom树结构
            kmlMapName = structure.getElementsByTagName('name')[0].textContent;
            folders = structure.getElementsByTagName('Folder');
            for (let j = 0; j < folders.length; j++) {
             folderName = folders[j].getElementsByTagName('name')[0].textContent;
              placeMarks = folders[j].getElementsByTagName('Placemark');
              let newKmlFolderObj = new kmlFolderObj(folderName);
              for (let i = 0; i < placeMarks.length; i++) {
               let newKmlItemObj = new kmlItemObj();
                newKmlItemObj.name = placeMarks[i].querySelector('name').textContent;
                newKmlItemObj.coord = placeMarks[i].querySelector('coordinates').textContent;
                newKmlItemObj.styleUrl = placeMarks[i].querySelector('styleUrl').textContent;
                newKmlItemObj.normalStyleId = getNormalStyleId(newKmlItemObj.styleUrl, structure);
                newKmlItemObj.width = getNormalStyleWidth(newKmlItemObj.normalStyleId, structure);
                newKmlItemObj.coord = parseLocations(newKmlItemObj.coord);
                newKmlItemObj.type = transformType(newKmlItemObj.styleUrl);
                newKmlItemObj.color = getNormalStyleColor(newKmlItemObj.normalStyleId, structure ,newKmlItemObj.type);
                newKmlFolderObj.placeMark.push(newKmlItemObj);
              }
              kmlDataObj.mapName = kmlMapName;
              kmlDataObj.mapFolders.push(newKmlFolderObj);
            }
            newOMD=transformKmlToOmd(kmlDataObj);//转化完成后的OMD对象
            const file=new Blob([JSON.stringify(newOMD)], {type: 'application/json'});
            let A = document.getElementById('KmlToOmdResult');
            A.style.display='flex';
            A.href = URL.createObjectURL(file);
            A.download = 'KmlToOmd_result'+'.omd';
            function transformKmlToOmd(kmlDataObj) {
              let dataItemObj = class dataItemObj {
                constructor() {
                  this.id = null;
                  this.type = null;
                  this.points = null;
                  this.point = null;
                  this.color = null;
                  this.phase = null;
                  this.width = null;
                  this.details = null;
                  this.custom = null;
                }
              };
              let groupLayerObj = class groupLayerObj {
                constructor(id,name) {
                  this.id=id;
                  this.type='group';
                  this.members={};
                  this.structure=[name,{template:null}];
                  this.phase=1;
                }
              };
              let orderLayerObj = class orderLayerObj {
                constructor(id) {
                  this.id=id;
                  this.type='order';
                  this.members=[];
                  this.structure=null;
                  this.phase=1;
                }
              };
              let OMD = {
                omd: 'omd',
                type: 'All',
                version: '1.0',
                serverAddress:kmlDataObj.mapName,
                layerData:[],
                mapData:{
                  points:[],
                  lines:[],
                  areas:[],
                },
              };
              let itemId=1;
              let folderLength=kmlDataObj.mapFolders.length;
              let newOrderLayer=new orderLayerObj(1);//order图层默认为1
              const TypeMapping={point:1,line:2,area:3,curve:4};
              for(let i=0;i<folderLength;i++){
                let newLayer=new groupLayerObj(i+2,kmlDataObj.mapFolders[i].name);//第一个非order图层id为2
                newOrderLayer.members.push(newLayer.id);
                let placeMarkLength=kmlDataObj.mapFolders[i].placeMark.length;
                for(let j=0;j<placeMarkLength;j++){
                  let newDataItem=new dataItemObj();//元素相关
                  newDataItem.id=itemId++;
                  newDataItem.color=kmlDataObj.mapFolders[i].placeMark[j].color;
                  newDataItem.width=kmlDataObj.mapFolders[i].placeMark[j].width;
                  newDataItem.type=kmlDataObj.mapFolders[i].placeMark[j].type;
                  newDataItem.points=coordTransformOmdType(kmlDataObj.mapFolders[i].placeMark[j].coord);
                  newDataItem.point=newDataItem.points[0];
                  newDataItem.phase=1;
                  newDataItem.details=[{key:'name',value:kmlDataObj.mapFolders[i].placeMark[j].name}];
                  if(newDataItem.type==='point'){
                    OMD.mapData.points.push(newDataItem);
                  }else if(newDataItem.type==='line'){
                    OMD.mapData.lines.push(newDataItem);
                  }else if(newDataItem.type==='area'){
                    OMD.mapData.areas.push(newDataItem);
                  }
                  newLayer.members[newDataItem.id]=TypeMapping[newDataItem.type];//图层相关
                  newLayer.structure.push(newDataItem.id);
                }
                OMD.layerData.push(newLayer);
              }
              OMD.layerData.unshift(newOrderLayer);
              return OMD;
            }
          function coordTransformOmdType(coords){
              const length=coords.length;
              let ref=[];
              for(let i=0;i<length;i++){
                ref.push({
                  x:coords[i].lng,
                  y:coords[i].lat,
                });
              }
              return ref;
            }
          function parseLocations(str) {//解析行字符串的经纬度和高度
            let locations = [];
            let rows = str.trim().split('\n');//按行分割
            for (let row of rows) {
              let parts = row.trim().split(',');//按逗号分割
              let lng = parts[0];
              let lat = parts[1];
              let alt = parts[2];
              locations.push({
                lng: parseFloat(lng),
                lat: parseFloat(lat),
                alt: parseFloat(alt)
              });
            }
            return locations;
          }
          function transformType(styleUrl) {//转化kml的元素type为omd类型,失败返回unknown
            const match = styleUrl.match(/#(\w+)-/);
            if (match) {
              let kmlType = match[1];
              switch (kmlType) {
                case 'icon': {
                  return 'point';
                }
                case 'line': {
                  return 'line';
                }
                case 'poly': {
                  return 'area';
                }
                default: {
                  return 'unknown';
                }
              }
            } else {
              return 'unknown';
            }
          }
          function getNormalStyleId(styleUrl, structure) {
            let styleMap = structure.getElementById(styleUrl.substring(1));
            let normalStyle = styleMap.getElementsByTagName('styleUrl')[0];
            return normalStyle.textContent.substring(1);
          }
          function getNormalStyleWidth(normalStyleId, structure) {
            let normalStyle = structure.getElementById(normalStyleId);
            let arrayWidth = normalStyle.getElementsByTagName('width');
            if (arrayWidth.length !== 0) {
              let width = parseInt(arrayWidth[0].textContent);
              if (!isNaN(width)) {
                return width;
              } else {
                return 5;
              }
            } else {
              return 5;
            }
          }
          function getNormalStyleColor(normalStyleId, structure,elementType) {
            let normalStyle = structure.getElementById(normalStyleId);
            let arrayColor = normalStyle.getElementsByTagName('color');
            if (arrayColor.length !== 0) {
              let color = arrayColor[0].textContent.substring(0, 8);
              let rr=color.substr(6,2);
              let gg=color.substr(4,2);
              let bb=color.substr(2,2);
              color=rr+gg+bb;
              let Exp = /^[0-9A-F]{6}$/i;
              if (Exp.test(color) === false) {//错误的格式
                return '000000';
              } else {
                return color;
              }
            } else {
              return '000000';
            }
          }
          }
          catch (e)
          {
            window.logConfig.message.code-=1;
            window.logConfig.message.text='转化失败，无法解析文件';
            window.logConfig.message.from='internal:BananaKmlToOmd';
            window.logConfig.message.type='error';
            window.logConfig.message.data=e;
          }
        }
      });
    },
    checkKmlFile(fileName) {
    let pos = fileName.lastIndexOf('.');
    if(pos > -1) {
      let ext = fileName.substring(pos);
      if(ext.toLowerCase() === '.kml') {
        return true;
      }
    }
      return false;
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
.KmlToOmdResult{
  width: 100%;
  height: 60%;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
#KmlToOmdResult{
  display: none;
}
.AreaFillShow{
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  font-size: 18px;
}
.AreaDescribe{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-weight: 100;
  font-size: 13px;
}
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
