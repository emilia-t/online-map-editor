<template>
  <div id="logLayer">
    <div class="logRollerBox">
      <div class="logList" v-for="log in logShowList" :key="log.code" :data-log-code="log.code" :ref="'logItem'+log.code">
        <div class="logBar">
          <div class="logIcon" v-if="log.type==='notice'">
            <log-notice/>
          </div>
          <div class="logIcon" v-if="log.type==='error'">
            <log-error/>
          </div>
          <div class="logIcon" v-if="log.type==='warn'">
            <log-warn/>
          </div>
          <div class="logIcon" v-if="log.type==='tip'">
            <log-tip/>
          </div>
          <span v-text="log.text">

          </span>
        </div>
      </div>
    </div>
    <div class="logHistoryBox" ref="logHistoryBox" @click.stop="closeHistoryPanel()" v-show="showHistoryPanel">
      <div class="logHistory" @click.stop="void 0">
        <div class="logHistoryFilter"><!--顶部筛选区域-->
          <div class="logHistoryButton">
            <div class="ButtonA colourA" title="重置过滤器" @click="restoreFilter()">重置过滤器</div>
            <div class="ButtonA colourB" title="仅保存日志类型和主要来源部位" @click="saveFilter()">保存过滤器</div>
            <div class="ButtonA colourB" title="关闭日志面板" @click="closeHistoryPanel()">关闭日志面板</div>
          </div>
          <div class="logHistorySelect">
            <div class="list">
              <div class="listName">
                日志类型
              </div>
              <div class="listContent">
                <input type="checkbox" name="logType" id="logTypeError" ref="logTypeError" checked="checked">
                <label for="logTypeError" @click="filterByType('error')">错误</label>
                <input type="checkbox" name="logType" id="logTypeWarn" ref="logTypeWarn" checked="checked">
                <label for="logTypeWarn" @click="filterByType('warn')">警告</label>
                <input type="checkbox" name="logType" id="logTypeTip" ref="logTypeTip" checked="checked">
                <label for="logTypeTip" @click="filterByType('tip')">提示</label>
                <input type="checkbox" name="logType" id="logTypeNotice" ref="logTypeNotice" checked="checked">
                <label for="logTypeNotice" @click="filterByType('notice')">通知</label>
              </div>
            </div>
            <div class="list">
              <div class="listName">
                主要来源部位
              </div>
              <div class="listContent">
                <input type="checkbox" name="mainFrom" id="mainFromInternal" ref="mainFromInternal" checked="checked">
                <label for="mainFromInternal" @click="filterByMainFrom('internal')">内部</label>
                <input type="checkbox" name="mainFrom" id="mainFromExternal" ref="mainFromExternal" checked="checked">
                <label for="mainFromExternal" @click="filterByMainFrom('external')">外部</label>
              </div>
            </div>
            <div class="list">
              <div class="listName">
                次要来源位置
              </div>
              <div class="listContent" ref="nextFromAllItem">
                <div class="listContentInner" v-for="item in internalFromList" :key="item">
                  <input type="checkbox" name="nextFrom" checked="checked" :id="'nextFrom'+item" :ref="'nextFrom'+item">
                  <label :for="'nextFrom'+item" @click="filterByNextFrom(item)"><span v-text="item" class="fromListSpan"/></label>
                </div>
                <div class="listContentInner" v-for="item in externalFromList" :key="item">
                  <input type="checkbox" name="nextFrom" checked="checked" :id="'nextFrom'+item" :ref="'nextFrom'+item">
                  <label :for="'nextFrom'+item" @click="filterByNextFrom(item)"><span v-text="item" class="fromListSpan"/></label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="logHistoryContent"><!--主体内容-->
          <div class="logHistoryList" @click="showLogAllData(log)" v-for="log in saveLog" :key="log.code" v-show="log.show">
            <div class="logIcon" v-if="log.type==='notice'">
              <log-notice/>
            </div>
            <div class="logIcon" v-if="log.type==='error'">
              <log-error/>
            </div>
            <div class="logIcon" v-if="log.type==='warn'">
              <log-warn/>
            </div>
            <div class="logIcon" v-if="log.type==='tip'">
              <log-tip/>
            </div>
            <div class="logFrom" v-text="log.time.split(' ')[1]">

            </div>
            <div class="logText" v-html="'&nbsp;'+log.text">

            </div>
          </div>
        </div>
        <div class="logHistoryDataBox">
          <div class="logHistoryData" v-if="logData.code!==null">
            <div class="logHistoryDataIcon" v-if="logData.type==='tip'">
              <log-tip-x120/>
            </div>
            <div class="logHistoryDataIcon" v-if="logData.type==='warn'">
              <log-warn-x120/>
            </div>
            <div class="logHistoryDataIcon" v-if="logData.type==='error'">
              <log-error-x120/>
            </div>
            <div class="logHistoryDataIcon" v-if="logData.type==='notice'">
              <log-notice-x120/>
            </div>
            <div class="logHistoryDetail">
              <div class="logDetailTitle">日志类型</div>
              <div class="logDetailText capitalize textA" v-text="logData.type"></div>
            </div>
            <div class="logHistoryDetail">
              <div class="logDetailTitle">日志来源顺序</div>
              <div class="logDetailText capitalize" v-for="(From,index) in logData.from">
                <div class="textA" v-text="From">
                </div>
                <div v-html="'&nbsp;'+String.fromCharCode(8595)" v-if="index!==logData.from.length-1">
                </div>
              </div>
            </div>
            <div class="logHistoryDetail">
              <div class="logDetailTitle">接收日志时间</div>
              <div class="logDetailText textA" v-text="logData.time"></div>
            </div>
            <div class="logHistoryDetail">
              <div class="logDetailTitle">日志详细信息</div>
              <div class="logDetailText textA" v-text="logData.text"></div>
            </div>
            <div class="logHistoryDetail">
              <div class="logDetailTitle">日志携带数据</div>
              <div class="logDetailText textA" v-text="logData.data"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clearLog" v-show="logShowList.length>=10" @click="closeAllShowLog()">
      清空弹窗
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import logNotice from "../svgValidIcons/logNotice";
import logError from "../svgValidIcons/logError";
import logWarn from "../svgValidIcons/logWarn";
import logTip from "../svgValidIcons/logTip";
import logTipX120 from "../svgValidIcons/120X/logTip";
import logWarnX120 from "../svgValidIcons/120X/logWarn";
import logErrorX120 from "../svgValidIcons/120X/logError";
import logNoticeX120 from "../svgValidIcons/120X/logNotice";
window.logConfig={
  message:{
    code:-1,
    time:'',
    text:'',
    from:'',
    type:'',
    data:undefined,
  },
};
Vue.observable(window.logConfig);
export default {
  name: "LayerLog",
  components:{logError,logTip,logWarn,logNotice,
    logTipX120,logWarnX120,logErrorX120,logNoticeX120
  },
  data(){
    return{
      externalLastCode:1,
      internalLastCode:1,
      showLogTime:4000,
      cleaningWorker:false,
      logData:{
        code:null,
        from:null,
        text:null,
        time:null,
        type:null,
        data:null,
      },
      filter:{
        type:{//第一层
          error:true,
          warn:true,
          tip:true,
          notice:true,
        },
        mainFrom:{//第二层
          internal:true,
          external:true,
        },
        nextFrom:[//第三层(加入X后携带X的from会被过滤)

        ],
      },
      saveLog:[

      ],
      logShowList:[

      ],
      logWaitingList:[

      ],
      externalFromList:[

      ],
      internalFromList:[

      ],
    }
  },
  mounted(){
    setTimeout(()=>this.keyboardListen(),10);
    this.startSetting();
    this.findLocalLogFilter();
  },
  methods:{
    startSetting(){
      setInterval(
        ()=>{
          if(this.logWaitingList.length>0){
            this.performLog();
          }
        }
      ,425);
    },
    findLocalLogFilter(){
      let localFilter=this.handleLocalStorage('get','localLogFilter');
      if(localFilter!==false){
        localFilter=JSON.parse(localFilter);
        if(!this.isObject(localFilter)){//check
          this.clearLocalLogFilter();
          return false;
        }
        if(!localFilter.hasOwnProperty('type')
        || !localFilter.hasOwnProperty('mainFrom')){
          this.clearLocalLogFilter();
          return false;
        }
        if(!this.isObject(localFilter.type)
        || !this.isObject(localFilter.mainFrom)){
          this.clearLocalLogFilter();
          return false;
        }
        if(!localFilter.type.hasOwnProperty('error') || !localFilter.type.hasOwnProperty('warn')
        || !localFilter.type.hasOwnProperty('tip') || !localFilter.type.hasOwnProperty('notice')){
          this.clearLocalLogFilter();
          return false;
        }
        if(!localFilter.mainFrom.hasOwnProperty('internal')
        || !localFilter.mainFrom.hasOwnProperty('external')){
          this.clearLocalLogFilter();
          return false;
        }
        if(localFilter.type.error===true){
          this.filter.type.error=true;
          this.$refs.logTypeError.checked=true;
        }else {
          this.filter.type.error=false;
          this.$refs.logTypeError.checked=false;
        }
        if(localFilter.type.warn===true){
          this.filter.type.warn=true;
          this.$refs.logTypeWarn.checked=true;
        }else {
          this.filter.type.warn=false;
          this.$refs.logTypeWarn.checked=false;
        }
        if(localFilter.type.tip===true){
          this.filter.type.tip=true;
          this.$refs.logTypeTip.checked=true;
        }else {
          this.filter.type.tip=false;
          this.$refs.logTypeTip.checked=false;
        }
        if(localFilter.type.notice===true){
          this.filter.type.notice=true;
          this.$refs.logTypeNotice.checked=true;
        }else {
          this.filter.type.notice=false;
          this.$refs.logTypeNotice.checked=false;
        }
        if(localFilter.mainFrom.internal===true){
          this.filter.mainFrom.internal=true;
          this.$refs.mainFromInternal.checked=true;
        }else {
          this.filter.mainFrom.internal=false;
          this.$refs.mainFromInternal.checked=false;
        }
        if(localFilter.mainFrom.external===true){
          this.filter.mainFrom.external=true;
          this.$refs.mainFromExternal.checked=true;
        }else {
          this.filter.mainFrom.external=false;
          this.$refs.mainFromExternal.checked=false;
        }
      }
    },
    clearLocalLogFilter(){
      this.handleLocalStorage('remove','localLogFilter');
    },
    isObject(obj) {
      return obj !== null && typeof obj === 'object';
    },
    handleLocalStorage(method, key, value) {
      try {
        switch (method) {
          case 'get' : {
            let temp = window.localStorage.getItem(key);
            if (temp!==null) {
              return temp
            } else {
              return false
            }
          }
          case 'set' : {
            window.localStorage.setItem(key, value);
            break
          }
          case 'remove': {
            window.localStorage.removeItem(key);
            break
          }
          default : {
            return false
          }
        }
      }catch (e){
        this.$store.commit('setCoLogMessage',{text:'获取本地存储失败',from:'internal:LayerLog',type:'error',data:e});
      }
    },
    keyboardListen(){
      document.body.addEventListener('keyup',(e)=>{
        if(this.$store.state.mapConfig.inputFocusStatus){//在聚焦模式下拒绝操作
          return false;
        }
        let KEY=e.key;
        switch (KEY){
          case 'l':{
            this.$store.state.logConfig.showPanel=!this.$store.state.logConfig.showPanel;
            break;
          }
        }
      });
    },
    saveFilter(){//保存除次要来源位置的过滤器
      let Filter={
        type:this.filter.type,
        mainFrom:this.filter.mainFrom,
      };
      let jsonFilter=JSON.stringify(Filter);
      this.handleLocalStorage('set','localLogFilter',jsonFilter);
      this.$store.commit('setCoLogMessage',{text:'已保存日志类型和主要来源过滤器',from:'internal:LayerLog',type:'tip'});
    },
    restoreFilter(){//重置过滤器
      this.filter.type.error=true;
      this.filter.type.warn=true;
      this.filter.type.tip=true;
      this.filter.type.notice=true;
      this.filter.mainFrom.internal=true;
      this.filter.mainFrom.external=true;
      this.filter.nextFrom=[];
      this.$refs.logTypeError.checked=true;
      this.$refs.logTypeWarn.checked=true;
      this.$refs.logTypeTip.checked=true;
      this.$refs.logTypeNotice.checked=true;
      this.$refs.mainFromInternal.checked=true;
      this.$refs.mainFromExternal.checked=true;
      let nextFromAllItem=this.$refs.nextFromAllItem.children;
      if(nextFromAllItem.length!==0){
        for(let i=0;i<nextFromAllItem.length;i++){
          nextFromAllItem[i].firstChild.checked=true;
        }
      }
      this.filterByAll();
    },
    filterByAll(){//进行一次整体过滤
      const CopyFilter=JSON.parse(JSON.stringify(this.filter));
      const LogLength=this.saveLog.length;
      const nextLength=CopyFilter.nextFrom.length;
      for(let i=0;i<LogLength;i++){
        if(CopyFilter.type[this.saveLog[i].type]===false){
          Vue.set(this.saveLog[i],'show',false);
          continue;
        }else {
          Vue.set(this.saveLog[i],'show',true);
        }
        if(CopyFilter.mainFrom[this.saveLog[i].from[0]]===false){
          Vue.set(this.saveLog[i],'show',false);
          continue;
        }else {
          Vue.set(this.saveLog[i],'show',true);
        }
        for(let j=0;j<nextLength;j++){
          let status=this.saveLog[i].from.find(item=>item===CopyFilter.nextFrom[j]);
          if(status!==undefined){
            Vue.set(this.saveLog[i],'show',false);
            break;
          }else {
            Vue.set(this.saveLog[i],'show',true);
          }
        }
      }
      this.saveLog.push({code:' ',time:' ',text:' ',from:[],type:' ',show:false,});
      this.saveLog.pop();
    },
    filterByItem(logData){//在performLog时过滤单一log
      const CopyFilter=JSON.parse(JSON.stringify(this.filter));
      const nextLength=CopyFilter.nextFrom.length;
      if(CopyFilter.type[logData.type]===false){
        logData.show=false;
        return logData;
      }else {
        logData.show=true;
      }
      if(CopyFilter.mainFrom[logData.from[0]]===false){
        logData.show=false;
        return logData;
      }else {
        logData.show=true;
      }
      for(let j=0;j<nextLength;j++){
        let status=logData.form.find(item=>item===CopyFilter.nextFrom[j]);
        if(status!==undefined){
          logData.show=false;
          break;
        }else {
          logData.show=true;
        }
      }
      return logData;
    },
    filterByType(type){//过滤类型
      if(type==='error'){
        this.filter.type.error=!this.$refs.logTypeError.checked;
      }else if(type==='warn'){
        this.filter.type.warn=!this.$refs.logTypeWarn.checked;
      }else if(type==='tip'){
        this.filter.type.tip=!this.$refs.logTypeTip.checked;
      }else if(type==='notice'){
        this.filter.type.notice=!this.$refs.logTypeNotice.checked;
      }
      this.filterByAll();
    },
    filterByMainFrom(type){//过滤主来源
      if(type==='internal'){
        this.filter.mainFrom.internal=!this.$refs.mainFromInternal.checked;
      }else if(type==='external'){
        this.filter.mainFrom.external=!this.$refs.mainFromExternal.checked;
      }
      this.filterByAll();
    },
    filterByNextFrom(name){//过滤次来源
      let refName='nextFrom'+name;
      let status=this.$refs[refName][0].checked;
      if(status){//附加此项
        this.filter.nextFrom.push(name);
      }else {
        this.filter.nextFrom.remove(name);
      }
      this.filterByAll();
    },
    closeHistoryPanel(){//关闭面板
      this.$store.commit('setCoLogShowPanel',false);
    },
    closeAllShowLog(){//清空弹窗
      this.logShowList=[];
    },
    performLog(){//间断推送日志
      let turnLog=this.logWaitingList.shift();
      turnLog.show=true;
      turnLog=this.filterByItem(turnLog);
      this.saveLog.unshift(turnLog);
      let logCode=turnLog.code;
      if(logCode===undefined){return false;}
      let type=turnLog.type;
      let color='';
      switch (type) {
        case 'tip':{color='#165dff';break;}
        case 'warn':{color='#e9853e';break;}
        case 'error':{color='#cf2e2e';break;}
        case 'notice':{color='#0b5aea';break;}
        default:{color='#000000'}
      }
      this.logShowList.push(turnLog);
      setTimeout(
        ()=>{
          let nowLog=this.$refs['logItem'+logCode][0];
          let nowRect=nowLog.getClientRects()[0];
          let leftOffset=nowRect.width/2;
          nowLog.style.left='calc(50% - '+leftOffset+'px)';
          nowLog.style.color=color;
          nowLog.animate(
            [
              {top:0+'px',
               transform:'scale(0)',opacity:'0'},
              {top:10+(this.logShowList.length-1)*35+'px',
               transform:'scale(1)',opacity:'1'}
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
      ,0);
      if(this.cleaningWorker===false){
        setTimeout(
          ()=> {
          this.cleaningWorker=true;
          this.clearShowLog()
        },
        this.showLogTime);
      }
    },
    clearShowLog(){//间断清理日志
      setTimeout(
        ()=>{
          for(let i=0;i<this.logShowList.length;i++){
            let nowLog=this.$refs['logItem'+this.logShowList[i].code][0];
            let nowRect=nowLog.getClientRects()[0];
            let nowTop=nowRect.top;
            let afterTop=nowTop-35;
            if(i===0){
              nowLog.animate(
                [
                  {top:nowTop+'px',
                    transform:'scale(1)',opacity:'1'},
                  {top:afterTop+'px',
                    transform:'scale(0)',opacity:'0'},
                ],
                {
                  duration:400,
                  iterations:1,
                  fill:'forwards',
                  delay:0,
                  easing:'ease',
                }
              );
            }else {
              nowLog.animate(
                [
                  {top:nowTop+'px'},
                  {top:afterTop+'px'},
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
          if(this.logShowList.length>0){
            setTimeout(
              ()=>{
                this.logShowList.shift();
                this.clearShowLog()
              },
              400);
          }else {
            this.cleaningWorker=false;
          }
        }
      ,this.showLogTime);
    },
    showLogAllData(logData){//点击显示log数据
      this.logData.code=logData.code;
      this.logData.type=logData.type;
      this.logData.from=logData.from;
      this.logData.time=logData.time;
      this.logData.text=logData.text;
      this.logData.data=logData.data;
    },
    appendInternalFromList(name){//附加次要来源
      if(!this.internalFromList.includes(name)){
        this.internalFromList.push(name);
      }
    },
    appendExternalFromList(name){//附加次要来源
      if(!this.externalFromList.includes(name)){
        this.externalFromList.push(name);
      }
    },
    playSoundEffect(name){
      this.$store.commit('setCoEffectsSound',name);
    }
  },
  computed:{
    message(){
      return this.$store.state.logConfig.message;
    },
    windowMessage(){
      try {
        return window.logConfig.message;
      }catch (e) {
        return {
          code:-999999999,
          data:undefined,
          from:'internal:LayerLog',
          text:'windowMessage异常重置',
          time:'',
          type:'error'
        }
      }
    },
    showHistoryPanel(){
      return this.$store.state.logConfig.showPanel;
    },
  },
  watch:{
    showHistoryPanel:{
      handler(newValue){
        if(newValue){
          this.playSoundEffect('fly_in');
          this.$refs.logHistoryBox.animate(
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
        }else{
          this.playSoundEffect('fly_out');
        }
      }
    },
    message:{
      handler(newValue){
        if(this.internalLastCode!==newValue.code && newValue.text!==''){
          let Copy=JSON.parse(JSON.stringify(newValue));
          this.internalLastCode=Copy.code;
          let fromArray=Copy.from.split(':');
          if(fromArray.length<2){
            fromArray.push('unknown');
          }
          this.appendInternalFromList(fromArray[1]);
          Copy.from=fromArray;
          this.logWaitingList.push(Copy);
        }
      },
      deep:true,
      sync:true,
    },
    windowMessage:{
      handler(newValue){
        if(this.externalLastCode!==newValue.code && newValue.text!==''){
          function formatDate(date) {
            let y=date.getFullYear();
            let m=date.getMonth()+1;
            let d=date.getDate();
            let h=date.getHours();
            let u=date.getMinutes();
            let s=date.getSeconds();
            return `${y}-${m}-${d} ${h}:${u}:${s}`;
          }
          let Copy=JSON.parse(JSON.stringify(newValue));
          this.externalLastCode=Copy.code;
          let fromArray=Copy.from.split(':');
          if(fromArray.length<2){
            fromArray.push('unknown');
          }
          this.appendExternalFromList(fromArray[1]);
          Copy.from=fromArray;
          Copy.time=formatDate(new Date());
          this.logWaitingList.push(Copy);
        }
      },
      deep:true,
    }
  }
}
</script>

<style scoped>
input[type="checkbox"]{
  display: none;
}
label{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 5px;
  user-select: none;
  transition: background 0.2s ease;
  margin: 5px 0px;
  font-size: 15px;
  color: #464646;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
label::before{
  content: '';
  width: 12px;
  height: 12px;
  color: #3980ff;
  border: 2px solid #3980ff;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
  font-size: 10px;
}
input[type="checkbox"]:checked+label::before{
  content: '\2713';
  transform: scale(1.2);
  color: #fff;
  border-color: #fff;
  background: #3980ff;
}
.textA{
  font-weight: 400;
  font-size: 15px;
  color: #464646;
}
.capitalize{
  text-transform: capitalize;
}
.logDetailText{
  width: auto;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: start;
  flex-direction: column;
}
.logHistoryDetail{
  width: calc(100% - 30px);
  height: auto;
  min-height: 80px;
  margin: 15px 15px;
}
.logDetailTitle{
  width: 100%;
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #2d73f1;
  font-size: 16px;
  font-weight: 600;
}
.logHistoryDataIcon{
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fromListSpan{
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: capitalize;
}
.clearLog{
  width: 100px;
  height: 35px;
  background: #3980ff;
  position: fixed;
  z-index: 600;
  left: calc(50% - 50px);
  top: calc(50% - 17px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: white;
  border-radius: 6px;
  box-shadow: #c5c5c5 0px 0px 6px;
  cursor: pointer;
  letter-spacing: 2px;
}
.list{
  width: calc(100% - 20px);
  padding: 10px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.listContent{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.listName{
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #2d73f1;
}
.logHistoryButton{
  width: 100%;
  height: auto;
  padding: 10px 0px 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logHistorySelect{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.ButtonA{
  width: 206px;
  height: 30px;
  margin: 5px;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: #c5c5c5  0px 0px 6px;
  border-radius: 5px;
  cursor: pointer;
}
.colourA{
  background: #2d73f1;
  color: #ffffff;
}
.colourB{
  background: #cbcbcb;
  color: #333232;
}
.logText{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logHistoryList{
  width: calc(100% - 10px);
  height: auto;
  min-height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 5px;
  margin: 10px 0px;
  box-shadow: #c5c5c5 0px 0px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.logHistory{
  width: 1200px;
  height: 100%;
  background: rgba(255,255,255,0.85);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
}
.logHistoryBox{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.2);
  position: fixed;
  z-index: 620;
  left:0px;
  top:0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.logHistoryDataBox{
  width: 20%;
  height: 100%;
  padding: 10px;
}
.logHistoryData{
  width: 100%;
  height: auto;
  max-height: calc(100% - 20px);
  overflow-y: auto;
  overflow-x: hidden;
}
.logHistoryFilter{
  width: 20%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  flex-wrap: nowrap;
}
.logHistoryContent{
  width: 60%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
}
.logIcon{
  width: 30px;
  height: 30px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
#logLayer{
  width: auto;
  height: auto;
  position: fixed;
  left:0px;
  top:0px;
  z-index: 600;
}
.logRollerBox{
  user-select: none;
  pointer-events: none;
  width: auto;
  height: auto;
  max-height: 160px;
  background: transparent;
  position: fixed;
  z-index: inherit;
  left: 0px;
  top: 10px;
}
.logList{
  width: auto;
  height: auto;
  max-height: inherit;
  display: flex;
  opacity: 0;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: 50%;
}
.logBar{
  width: auto;
  height: 25px;
  font-size: 14px;
  box-shadow: 0px 0px 4px #c5c5c5;
  background: white;
  margin: 10px 0px;
  padding: 0px 10px;
  display: flex;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
