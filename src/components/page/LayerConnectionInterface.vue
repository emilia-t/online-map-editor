<template>
<div class="connectionInterfaceLayer">
  <div class="strip">

  </div>
  <div class="content" ref="content"><!--主内容-->
    <div class="InterfaceHead"><!--顶部-->
      <div class="HeadLeft"><!--标题-->
        <svg t="1681041457556" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27339" width="200" height="200"><path d="M0 0" fill="" p-id="27340"></path><path d="M128 608h768v192H128v-192z m0-256h768v192H128v-192z m32-140.8h704l28.8 73.6H131.2L160 211.2zM131.2 160L64 284.8V864h896V284.8L896 160H131.2z" fill="" p-id="27341"></path><path d="M768 416h64v64h-64zM768 672h64v64h-64z" fill="" p-id="27342"></path></svg>
        <span class="InterfaceHeadTitle">在线地图</span>
      </div>
      <svg ref="addNewConnectButton" t="1681030518295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26321" width="200" height="200"><path d="M546.133333 479.662933h360.533334a32 32 0 1 1 0 64H546.133333v364.8a32 32 0 1 1-64 0v-364.8H117.333333a32 32 0 1 1 0-64H482.133333v-360.533333a32 32 0 0 1 64 0v360.533333z" fill="#333333" p-id="26322"></path></svg><!--创建新链接按钮-->
    </div>
    <hr/>
    <div class="connectionInterfaceBox"><!--连接盒子-->
      <banana-connection-box v-for="value in serverLocalConfig" :key="value.serverAddress" :account="value.account" :password="value.password" :default-x="value.defaultX" :default-y="value.defaultY" :img-time="value.imgTime" :max-height="value.maxHeight" :online-number="value.onlineNumber" :max-online-user="value.maxOnlineUser" :max-width="value.maxWidth" :server-address="value.serverAddress" :server-img="value.serverImg" :server-key="value.serverKey" :server-name="value.serverName" @ancBoxChange="handlerCnBox"></banana-connection-box>
    </div>
  </div>
<!--  <div class="content">&lt;!&ndash;主内容&ndash;&gt;-->
<!--    <div class="InterfaceHead">&lt;!&ndash;顶部&ndash;&gt;-->
<!--      <div class="HeadLeft">&lt;!&ndash;标题&ndash;&gt;-->
<!--        <svg t="1681041457556" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27339" width="200" height="200"><path d="M0 0" fill="" p-id="27340"></path><path d="M128 608h768v192H128v-192z m0-256h768v192H128v-192z m32-140.8h704l28.8 73.6H131.2L160 211.2zM131.2 160L64 284.8V864h896V284.8L896 160H131.2z" fill="" p-id="27341"></path><path d="M768 416h64v64h-64zM768 672h64v64h-64z" fill="" p-id="27342"></path></svg>-->
<!--        <span class="InterfaceHeadTitle">本地地图</span>-->
<!--      </div>-->
<!--      <svg ref="addNewLocalMap" t="1681030518295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26321" width="200" height="200"><path d="M546.133333 479.662933h360.533334a32 32 0 1 1 0 64H546.133333v364.8a32 32 0 1 1-64 0v-364.8H117.333333a32 32 0 1 1 0-64H482.133333v-360.533333a32 32 0 0 1 64 0v360.533333z" fill="#333333" p-id="26322"></path></svg>&lt;!&ndash;创建新链接按钮&ndash;&gt;-->
<!--    </div>-->
<!--    <hr/>-->
<!--    <div class="connectionInterfaceBox">&lt;!&ndash;连接盒子&ndash;&gt;-->
<!--      <banana-local-map-box v-for="value in localMapConfig" :key="value.serverAddress" :config="value"></banana-local-map-box>-->
<!--    </div>-->
<!--  </div>-->
  <div class="addNewConnectBox" ref="addNewConnectBox" v-show="AncShow" @contextmenu="stopDefaultEvent($event)"><!--添加连接的面板-->
    <div class="addNewConnectBoard" ref="addNewConnectBoard"><!--中间的实际面板-->
      <div class="AncTitle"><!--标题-->
        <div class="AncTlIcon">
          <svg t="1682428340789" class="icon5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1042" width="200" height="200"><path d="M896 864h-256a32 32 0 0 1 0-64h256a32 32 0 0 1 0 64z" fill="#4D4D4D" p-id="1043"></path><path d="M768 992a32 32 0 0 1-32-32v-256a32 32 0 0 1 64 0v256a32 32 0 0 1-32 32zM896 320H128a32 32 0 0 1-32-32v-192A32 32 0 0 1 128 64h768a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32zM160 256h704V128h-704zM896 640H128a32 32 0 0 1-32-32v-192A32 32 0 0 1 128 384h768a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32zM160 576h704V448h-704zM544 960H128a32 32 0 0 1-32-32v-192A32 32 0 0 1 128 704h416a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32z m-384-64H512v-128H160z" fill="#4D4D4D" p-id="1044"></path></svg>
        </div>
        <div class="AncTlText">
          添加服务器
        </div>
      </div>
      <hr/>
      <div class="AncContent"><!--内容-->
        <div class="AncList AncList1"><!--单条目-->
          <div class="AncIcon"><!--图标-->
            <svg t="1682151206242" class="icon4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2978" width="200" height="200"><path d="M848.622334 56.531995a192.72271 192.72271 0 0 0-272.381431 0L303.859473 328.913425a192.72271 192.72271 0 0 0 272.38143 272.381431l48.180678-48.180678a32.120452 32.120452 0 0 0 0-45.611041 32.120452 32.120452 0 0 0-44.968632 0l-48.823087 48.823086a128.481807 128.481807 0 0 1-181.159348-181.801756l272.381431-272.381431a128.481807 128.481807 0 1 1 181.801756 181.159348l-55.247177 55.889586a31.478043 31.478043 0 1 0 44.968633 44.968632l55.247177-55.247177a192.72271 192.72271 0 0 0 0-272.38143z" p-id="2979"></path><path d="M447.759097 422.705144l-64.240904 64.240904a32.120452 32.120452 0 1 0 45.611042 45.611041l64.240903-64.240903a128.481807 128.481807 0 1 1 181.801757 181.159347l-273.02384 273.02384a128.481807 128.481807 0 1 1-181.159347-181.801757l46.895859-46.895859a32.762861 32.762861 0 0 0 0-45.611042 32.120452 32.120452 0 0 0-45.611041 0l-46.89586 46.89586a192.72271 192.72271 0 0 0 272.381431 272.38143l272.38143-272.38143a192.72271 192.72271 0 1 0-272.38143-272.381431z" p-id="2980"></path></svg>
          </div>
          <div class="AncInput"><!--输入框-->
            <input ref="UrlInput" placeholder="" type="url" name="url" id="AncUrl" autocomplete="off"/>
            <label ref="UrlLabel" for="AncUrl">Url</label>
          </div>
        </div>
        <div class="AncList AncList2"><!--单条目-->
          <div class="AncIcon"><!--图标-->
            <svg t="1682600352224" class="icon5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3477" width="200" height="200"><path d="M609.6 521.664c157.12 33.056 263.872 150.464 317.28 347.776a32 32 0 1 1-61.76 16.736C808.448 676.896 692.416 576 512 576s-296.448 100.864-353.12 310.176a32 32 0 1 1-61.76-16.736c53.44-197.312 160.16-314.72 317.28-347.776a224 224 0 1 1 195.2 0zM512 480a160 160 0 1 0 0-320 160 160 0 0 0 0 320z" fill="#515151" p-id="3478"></path></svg>
          </div>
          <div class="AncInput"><!--输入框-->
            <input ref="AccountInput" placeholder="" type="text" name="account" id="account" autocomplete="off"/>
            <label ref="AccountLabel" for="AncUrl">账户</label>
          </div>
        </div>
        <div class="AncList AncList3"><!--单条目-->
          <div class="AncIcon"><!--图标-->
            <svg t="1682516289750" class="icon5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2114" width="200" height="200"><path d="M288 384v-74.666667c0-123.722667 100.266667-224 224-224s224 100.224 224 224v74.666667h10.677333C811.445333 384 864 436.597333 864 501.333333v320c0 64.821333-52.469333 117.333333-117.322667 117.333334H277.333333C212.554667 938.666667 160 886.069333 160 821.333333V501.333333c0-64.821333 52.469333-117.333333 117.322667-117.333333H288z m64 0h320v-74.666667c0-88.426667-71.605333-160-160-160-88.384 0-160 71.626667-160 160v74.666667zM224 501.333333v320c0 29.397333 23.914667 53.333333 53.322667 53.333334H746.666667A53.269333 53.269333 0 0 0 800 821.333333V501.333333c0-29.397333-23.914667-53.333333-53.322667-53.333333H277.333333A53.269333 53.269333 0 0 0 224 501.333333z" fill="#515151" p-id="2115"></path></svg>
          </div>
          <div class="AncInput"><!--输入框-->
            <input ref="PasswordInput" placeholder="" type="password" name="password" autocomplete="off" maxlength="20"/>
            <svg v-show="!PasswordHide" @click="showPassword()" class="icon6" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-8f158982="" fill-rule="evenodd" clip-rule="evenodd" d="M2.11069 9.43732C3.21647 7.77542 5.87904 4.58331 9.89458 4.58331C13.8801 4.58331 16.6483 7.72502 17.8345 9.4049C18.0905 9.76747 18.0905 10.2325 17.8345 10.5951C16.6483 12.2749 13.8801 15.4166 9.89458 15.4166C5.87904 15.4166 3.21647 12.2245 2.11069 10.5626C1.88009 10.2161 1.88009 9.7839 2.11069 9.43732ZM9.89458 3.33331C5.19832 3.33331 2.20919 7.03277 1.07001 8.74489C0.560324 9.51091 0.560323 10.4891 1.07001 11.2551C2.20919 12.9672 5.19832 16.6666 9.89458 16.6666C14.5412 16.6666 17.6368 13.0422 18.8556 11.3161C19.4168 10.5213 19.4168 9.4787 18.8556 8.68391C17.6368 6.95774 14.5412 3.33331 9.89458 3.33331ZM7.29165 9.99998C7.29165 8.50421 8.50421 7.29165 9.99998 7.29165C11.4958 7.29165 12.7083 8.50421 12.7083 9.99998C12.7083 11.4958 11.4958 12.7083 9.99998 12.7083C8.50421 12.7083 7.29165 11.4958 7.29165 9.99998ZM9.99998 6.04165C7.81385 6.04165 6.04165 7.81385 6.04165 9.99998C6.04165 12.1861 7.81385 13.9583 9.99998 13.9583C12.1861 13.9583 13.9583 12.1861 13.9583 9.99998C13.9583 7.81385 12.1861 6.04165 9.99998 6.04165Z" fill="#9499A0"></path></svg>
            <svg v-show="PasswordHide" @click="showPassword()" class="icon6" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-8f158982="" fill-rule="evenodd" clip-rule="evenodd" d="M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z" fill="#9499A0"></path></svg>
            <label ref="PasswordLabel" for="AncUrl">密码</label>
          </div>
        </div>
        <div class="Tips"><!--提示信息-->

        </div>
      </div>
      <div class="AncButton"><!--提交按钮-->
        <button @click="resetInput()">重置</button>
        <button @click="createServer()">创建</button>
      </div>
    </div>
  </div>
  <div class="addNewConnectBox" ref="newLocalMap" v-show="lmShow" @contextmenu="stopDefaultEvent($event)">
    <div class="newLocalMapBoard">
      <div>
        地图类型：
        <div>现实的</div>
        <div>虚拟的</div>
      </div>
      <div>
        中心点经度
        <input type="text"/>
      </div>
      <div>
        中心点纬度
        <input type="text"/>
      </div>
      <div>
        中心点X值
        <input type="text"/>
      </div>
      <div>
        中心点Y值
        <input type="text"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import BananaConnectionBox from "./BananaConnectionBox";
import BananaLocalMapBox from "./BananaLocalMapBox";
export default {
  name: "LayerConnectionInterface",
  data(){
    return {
      AncShow:false,
      lmShow:false,
      PasswordHide:true,
      isNewAddServer:true,
      serverLocalConfig:null,
      localMapConfig:null
    }
  },
  components:{
    BananaConnectionBox,BananaLocalMapBox
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    startSetting(){
      this.AncAnimationAppend();
      this.appendCloseAnc();
      this.appendOpenAnc();
      this.stopBubble();
      this.getLocalServerConfig();//获取本地服务器配置
      this.watchStorage();//监听本地配置变动
      this.getLocalMapConfig();
      this.setDropEvent();
    },
    setDropEvent(){
      function isValidJson(fileContent) {
        try {
          JSON.parse(fileContent);
          return true;
        } catch (e) {
          return false;
        }
      }
      // 为box添加拖拽事件
      this.$refs.content.addEventListener('dragover', (e) => {
        e.preventDefault(); // 阻止默认行为
      });
      this.$refs.content.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();// 读取文件内容
        reader.onload = (e) => {
          const fileContent = e.target.result;
          const status=isValidJson(fileContent);
          if(status){
            let OMS=JSON.parse(fileContent);
            if(OMS.hasOwnProperty('oms') && OMS.hasOwnProperty('version')){
              let version=OMS.version;
              switch (version){
                case '1.0':{
                  this.createServerThroughFile(OMS);
                  break;
                }
              }
            }
          }
        };
        reader.readAsText(file);
      });
    },
    handlerCnBox(message){//接收来自Box的消息
      if(message=='reload'){
        this.getLocalServerConfig();
      }
    },
    getLocalMapConfig(){
      let localConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','localMaps'));
      if(!localConfig){
        this.$root.general_script.handleLocalStorage('set','localMaps','{}')
        this.localMapConfig={};
      }else {
        this.localMapConfig=localConfig;
      }
    },
    getLocalServerConfig(){//获取本地服务器配置
      let localConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));
      if(localConfig==false || localConfig==null || localConfig==''){
        this.serverLocalConfig={};
      }else {
        this.serverLocalConfig=localConfig;
      }
    },
    showPassword(){//显示和隐藏密码
      if(this.PasswordHide){
        this.$refs.PasswordInput.setAttribute('type','text');
      }else {
        this.$refs.PasswordInput.setAttribute('type','password');
      }
      this.PasswordHide=!this.PasswordHide;
    },
    AncAnimationAppend(){//添加服务器面板的相关动效
      this.$refs.UrlInput.addEventListener('input',(ev)=>{
        let Va=ev.target.value;//当用户点击输入框并且输入了文字后lab上移和显示//当用户清空输入框后lab下移并隐藏
        if(Va!==''){
          this.$refs.UrlLabel.style.top='-20px';
        }else {
          this.$refs.UrlLabel.style.top='0px';
        }
      });
      this.$refs.AccountInput.addEventListener('input',(ev)=>{
        let Va=ev.target.value;//当用户点击输入框并且输入了文字后lab上移和显示//当用户清空输入框后lab下移并隐藏
        if(Va!==''){
          this.$refs.AccountLabel.style.top='-20px';
        }else {
          this.$refs.AccountLabel.style.top='0px';
        }
      });
      this.$refs.PasswordInput.addEventListener('input',(ev)=>{
        let Va=ev.target.value;
        if(Va!==''){
          this.$refs.PasswordLabel.style.top='-20px';
        }else {
          this.$refs.PasswordLabel.style.top='0px';
        }
      });
    },
    createServer(){//创建服务器
      let url=this.$refs.UrlInput.value;//1收集信息
      let account=this.$refs.AccountInput.value;
      let password=this.$refs.PasswordInput.value;
      if(!this.isValidUrl(url)){//2.检测URL合理性
        this.$store.commit('setCoLogMessage',{text:'Url格式错误，请参照帮助界面',from:'internal:LayerConnectionInterface',type:'tip'});
        return false;
      }
      if(account!==''){//3.检测账号（电子邮箱）合理性
        if(!this.isValidEmail(account)){
          this.$store.commit('setCoLogMessage',{text:'账号格式错误，请参照帮助界面',from:'internal:LayerConnectionInterface',type:'tip'});
          return false;
        }
      }
      if(password!==''){//4.检测密码合理性
        if(!this.isValidPassword(password)){
          this.$store.commit('setCoLogMessage',{text:'密码含有非法字符，请参照帮助界面',from:'internal:LayerConnectionInterface',type:'tip'});
          return false;
        }
      }
      this.saveLocalServerConfig({url,account,password});//5.保存至本地
    },
    createServerThroughFile(OMS){//创建服务器
      let url=OMS.serverAddress;//1收集信息
      let account=OMS.account;
      let password=OMS.password;
      if(!this.isValidUrl(url)){//2.检测URL合理性
        this.$store.commit('setCoLogMessage',{text:'Url格式错误，请参照帮助界面',from:'internal:LayerConnectionInterface',type:'tip'});
        return false;
      }
      if(account!==''){//3.检测账号（电子邮箱）合理性
        if(!this.isValidEmail(account)){
          this.$store.commit('setCoLogMessage',{text:'账号格式错误，请参照帮助界面',from:'internal:LayerConnectionInterface',type:'tip'});
          return false;
        }
      }
      if(password!==''){//4.检测密码合理性
        if(!this.isValidPassword(password)){
          this.$store.commit('setCoLogMessage',{text:'密码含有非法字符，请参照帮助界面',from:'internal:LayerConnectionInterface',type:'tip'});
          return false;
        }
      }
      this.saveLocalServerConfig({url,account,password});//5.保存至本地
    },
    resetInput(){//重置输入框
      this.$refs.UrlInput.value='';
      this.$refs.UrlLabel.style.top='0px';
      this.$refs.AccountInput.value='';
      this.$refs.AccountLabel.style.top='0px';
      this.$refs.PasswordInput.value='';
      this.$refs.PasswordLabel.style.top='0px';
    },
    saveLocalServerConfig(obj){//在本地存储一个服务器配置
      if(obj.account!=='' && obj.password!=='' && obj.account!==null && obj.password!==null){//如果包含了账号名和密码的信息还需要另存在accounts中
        let find=this.$root.general_script.handleLocalStorage('get','accounts');//1get
        let accountsConfig=undefined;
        if(!find){
          this.$root.general_script.handleLocalStorage('set','accounts','{}');//初始化
          accountsConfig={};
        }else {
          accountsConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','accounts'));
        }
        if(Object.prototype.toString.call(accountsConfig) === '[object Object]'){
          if(accountsConfig.hasOwnProperty(obj.account)){//检查有没有重复的账号,没有就加入，有则修改密码
            accountsConfig[obj.account].P=obj.password;
          }else {
            accountsConfig[obj.account]={A:obj.account,P:obj.password};
          }
          this.$root.general_script.handleLocalStorage('set','accounts',JSON.stringify(accountsConfig));//写入storage
        }
      }
      let configObj={//构造服务器配置对象
        account:'',
        password:'',
        defaultX:'',
        defaultY:'',
        imgTime:'',
        maxHeight:'',
        onlineNumber:'',
        maxOnlineUser:'',
        maxWidth:'',
        serverAddress:'',
        serverImg:'',
        serverKey:'',
        serverName:''
      }
      let isAdd=true;//决定添加的状态值
      let localConfig=this.$root.general_script.handleLocalStorage('get','servers');//1获取本地配置
      if(localConfig===false || localConfig==='' || localConfig===undefined){
        this.$root.general_script.handleLocalStorage('set','servers','{}');//添加一个空对象
        localConfig={};
      }else {
        localConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','servers'));
      }
      if(localConfig.hasOwnProperty(obj.url)){//2.在本地配置中查找
        isAdd=false;
        this.$store.commit('setCoLogMessage',{text:'已经存在同样的服务器',from:'internal:LayerConnectionInterface',type:'tip'});
        return false;
      }
      configObj.account=obj.account;//3.添加配置(预)
      configObj.password=obj.password;
      configObj.serverAddress=obj.url;
      localConfig[obj.url]=configObj;
      this.$root.general_script.handleLocalStorage('set','servers',JSON.stringify(localConfig));//3.添加入localstorage
      this.isNewAddServer=!this.isNewAddServer;//4.更新状态以使box更新
    },
    isValidPassword(password){//检测密码合理性
      const pattern = new RegExp('^[a-zA-Z0-9_!@$%^&*-+?\;:]*$');
      return pattern.test(password);
    },
    isValidEmail(email){//检测邮箱合理性
      const pattern = new RegExp('^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})$');
      return pattern.test(email);
    },
    isValidUrl(url){//检测URL合理性
      const pattern = new RegExp('^((wss?:\\/\\/)?|ws:\\/\\/)?'+ //协议
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ //域名
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ //或为ipv4地址
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //端口和地址
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ //查询字符串
        '(\\#[-a-z\\d_]*)?$','i');
      return pattern.test(url);
    },
    openANC(){//1打开新增连接界面
      this.AncShow=true;
    },
    closeANC(){//关闭新增连接界面
      this.AncShow=false;
    },
    stopDefaultEvent(ev){//关闭默认事件
      ev.preventDefault();
    },
    appendCloseAnc(){//为空白处添加关闭ANC的功能
      this.$refs.addNewConnectBox.addEventListener('click',()=>{
        this.closeANC();
      })
    },
    appendOpenAnc(){//为按钮添加开启ANC功能
      this.$refs.addNewConnectButton.addEventListener('click',()=>{
        this.openANC();
      })
    },
    stopBubble(){//阻止面板冒泡
      this.$refs.addNewConnectBoard.addEventListener('click',(ev)=>{
        ev.stopPropagation();
      })
    },
    watchStorage(){//实时监听storage变化,这是为了用户多页面多操作考虑
      window.addEventListener('storage', (e)=>{
        switch (e.key) {
          case 'servers':{//设置变动
            let newObj=JSON.parse(e.newValue);//格式化
            if(this.storageCheck(newObj)){//检查格式后的数据是否正常,如果不正常则删除配置（防篡改）
              this.getLocalServerConfig();//更新localConfig
            }else {
              this.$store.commit('setCoLogMessage',{text:'本地服务器配置已失效',from:'internal:LayerConnectionInterface',type:'warn'});
              window.localStorage.removeItem('servers');
            }
          }
        }
      });
    },
    storageCheck(Obj){//用于检测本地存储是否正常的，如果不正常则返回false，否则返回true
      if(isObject(Obj)){//1.检测是否为对象
        let vLock=true;
        for(let key in Obj){//2.检测每个值是否为对象
          if(!isObject(Obj[key])){
            vLock=false;
          }
        }
        return vLock;
      }else {
        return false;
      }
      function isObject(obj) {
        return obj != null && typeof obj === 'object' && Array.isArray(obj) === false;
      }
    }
  },
  computed:{
    reloadServers(){
      return this.$store.state.commits.reloadServers;
    }
  },
  watch:{
    isNewAddServer:{
      handler(){
        this.getLocalServerConfig();//查找本地配置
      }
    },
    reloadServers:{
      handler(){
        this.getLocalServerConfig();//查找本地配置
      }
    }
  }
}
</script>

<style scoped>
.newLocalMapBoard{
  width: 400px;
  height: auto;
}
.Tips{
  position: absolute;
  bottom:45px;
  left: 0px;
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 12px;
  font-weight: 100;
}
.icon6{
  position: absolute;
  right: 20px;
  top: 10px;
}
.AncInput input{
  color: #4e4e4e;
  width: calc(100%);
  height: calc(100% - 1px);
  font-size: 15px;
  position: absolute;
  padding: 0px;
  border-bottom:1px solid #c4c4c4;
  border-left:0px;
  border-right:0px;
  border-top:0px;
  outline: none;
  transition: 0.4s;
}
input:focus{
  border-bottom:1px solid #444444;
}
.AncInput label{
  color: #4e4e4e;
  width: 50px;
  height: 100%;
  font-size: 15px;
  position: absolute;
  display: flex;
  align-items: center;

  top:0px;
  transition: 0.4s;
}
.AncInput{
  width: 310px;
  height: 100%;
  position: absolute;
  left: 60px;
}
.AncList{
  background: inherit;
  position: absolute;
  width: calc(100%);
  margin: 10px 0px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.AncList1{
  top: 60px;
}
.AncList2{
  top: 120px;
}
.AncList3{
  top: 180px;
}
.AncIcon{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
  position: absolute;
  left: 15px;
}
.icon4{
  width: 30px;
  height: 30px;
}
.AncButton{
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.AncButton button{
  width: 100px;
  height: 26px;
  background: white;
  color: #535353;
  border: 1px solid #404040;
  border-radius: 3px;
}
.AncContent{
  width: 100%;
  height: calc(100% - 32px - 32px);
}
.icon5{
  width: 30px;
  height: 30px;
}
.AncTlIcon{
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.AncTlText{
  letter-spacing: 3px;
  width: 120px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.AncTitle{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 24px);
  padding-left: 18px;
  padding-top:10px;
  height: 40px;
  font-weight: 400;
  font-size: 18px;
  color: rgba(5,5,5,0.9);
}
.addNewConnectBoard{
  box-shadow: 0px 0px 6px #c1c1c1;
  width: 400px;
  height: 300px;
  background: #fefefe;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  position: fixed;
  top: calc(50% - 150px);
  left: calc(50% - 200px);
}
.strip{
  width: 100%;
  height: 8px;
}
.content{
  user-select: none;
  width: calc(100% - 100px - 2px - 16px);
  height: calc(100% - 8px - 16px - 2px);
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0px 8px 8px 108px;
  border-radius: 4px;
  border: 1px solid rgb(220,220,220);
}
.addNewConnectBox{
  width: 100%;
  height: 100%;
  animation-name: gradualEntry;
  animation-duration: 0.6s;
  animation-iteration-count: 1;
  animation-direction: normal;
  background: rgba(255,255,255,0.8);
  position: fixed;
  top:0px;
  left: 0px;
  z-index: 570;
}
@keyframes gradualEntry {
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
}
.connectionInterfaceLayer{
  width: 100%;
  height:100%;
}
.InterfaceHead{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon{
  width: 30px;
  height: 30px;
  padding: 0px 10px 0px 0px;
}
.InterfaceHeadTitle{
  font-size: 20px;
  font-weight: 400;
  letter-spacing:2px
}
.HeadLeft{
  width: 200px;
  display: flex;
  justify-content: center;
  align-content: center;
}
.connectionInterfaceBox{
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
