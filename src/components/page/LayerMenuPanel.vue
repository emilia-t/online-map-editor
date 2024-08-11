<template>
<div class="menuPanelLayer" ref="menuPanelLayer"><!--起始页面左侧的菜单面板-->
  <div class="closeButtonBox" ref="closeButtonBox"><!--关闭按钮-->
    <div class="closeButton" ref="closeButton" @click="close()">
      <svg class="icon2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z"
          fill="currentColor"/></svg>
    </div>
  </div>
  <div class="listButtonBox selected" @click="MenuButtonHomePage()"><!--菜单按钮-->
    <home-page custom="margin:4px"/>
    <span class="iconSpan">主页</span>
  </div>
  <hr/>
  <div class="listButtonBox" @click="openSetting('a',$event)">
    <general-setting custom="margin:4px"/>
    <span class="iconSpan">常规</span>
  </div>
  <div class="listButtonBox" @click="openSetting('b',$event)">
    <monitor custom="margin:4px"/>
    <span class="iconSpan">显示</span>
  </div>
  <div class="listButtonBox" @click="openSetting('r',$event)">
    <split-o-m-r custom="margin:4px"/>
    <span class="iconSpan">路由</span>
  </div>
  <div class="listButtonBox" @click="openSetting('c',$event)">
    <user-account custom="margin:4px"/>
    <span class="iconSpan">账户</span>
  </div>
  <hr/>
  <div class="listButtonBox" @click="openSetting('o',$event)">
    <menu-about custom="margin:4px"/>
    <span class="iconSpan">关于</span>
  </div>
  <div class="listButtonBox" @click="openSetting('p',$event)">
    <menu-help custom="margin:4px 8px 4px 7px;transform:translateY(1px)"/>
    <span class="iconSpan">帮助</span>
  </div>
  <hr/>
  <div class="listButtonBox" @click="openToolbox($event)">
    <menu-tool custom="margin:4px"/>
    <span class="iconSpan">工具</span>
  </div>
  <div class="SettingsBox" ref="SettingsBox" v-show="settingShow" @click.stop="settingShow=false">
    <div class="Settings" ref="Settings" @click.stop="void 0"><!--具体的设置项目-->
      <div class="Setting" v-show="GeneralSettings"><!--常规设置-->
        <div class="SettingTitle">常规设置</div>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">启动时自动搜索服务器状态</span>
            <span class="spansB">这将有助于您选择地图服务器</span>
          </div>
          <div class="switchOut" ref="GS01" @click="GS01($event)"><div ref="GS01_1" class="circle"></div></div>
        </div>
        <hr class="style-one"/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">节点自动吸附(Alt)</span>
            <span class="spansB">启用后绘制线段或曲线时可以吸附节点</span>
          </div>
          <div class="switchOut" ref="GS02" @click="GS02($event)"><div ref="GS02_1" class="circle"></div></div>
        </div>
      </div>
      <div class="Setting" v-show="DisplaySettings"><!--显示设置-->
        <div class="SettingTitle">显示设置</div>
        <div class="settingGroupTitle">
          面板
        </div>
        <hr class="style-one"/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">显示元素与图层面板</span>
            <span class="spansB">开启后将会在左侧显示图层元素列表</span>
          </div>
          <div class="switchOut" ref="DS01" @click="DS01($event)"><div ref="DS01_1" class="circle"></div></div>
        </div>
        <hr class="style-one"/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">显示历史编辑记录面板</span>
            <span class="spansB">在浏览器左上角显示历史记录面板</span>
          </div>
          <div class="switchOut" ref="DS04" @click="DS04($event)"><div ref="DS04_1" class="circle"></div></div>
        </div>
        <hr class="style-one"/>
        <div class="settingGroupTitle">
          性能
        </div>
        <hr class="style-one"/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">调整移动采样率</span>
            <span class="spansB">修改后会影响移动时的每秒采样次数</span>
          </div>
          <div class="switchOut" ref="DS05" @click="DS05($event)"><div ref="DS05_1" class="circle"></div></div>
        </div>
        <hr class="style-one"/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">调整元素可视范围</span>
            <span class="spansB">修改后会影响元素显示的范围</span>
          </div>
          <div class="switchOut" ref="DS08" @click="DS08($event)"><div ref="DS08_1" class="circle"></div></div>
        </div>
      </div>
      <div class="Setting" v-show="RouteSettings"><!--显示设置-->
        <div class="SettingTitle">路由设置</div>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">自动向路由拉取数据</span>
            <span class="spansB">开启后将自动从路由获取服务器列表</span>
          </div>
          <div class="switchOut" ref="RS01" @click="RS01($event)"><div ref="RS01_1" class="circle"></div></div>
        </div>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">使用SSL加密传输</span>
            <span class="spansB">需要路由端支持SSL加密传输才能使用</span>
          </div>
          <div class="switchOut" ref="RS02" @click="RS02($event)"><div ref="RS02_1" class="circle"></div></div>
        </div>
        <div class="routeListTitle">
          <menu-about-c/>
          已保存{{routes.length}}条路由，至多保存20条路由
        </div>
        <div class="sheetList">
          <div class="row">
            <span class="rowSelect">✓</span>
            <span class="rowName">当前路由地址</span>
            <span class="rowC">操作</span>
          </div>
          <div class="row" v-for="route in this.routes">
            <span class="rowSelect" v-show="route.use">✓</span>
            <span class="rowSelect" v-show="!route.use">-</span>
            <span class="rowName" :title="route.address" v-text="getRouteName(route)"/>
            <span class="rowButton" @click="editRoute(route.address)">编辑</span>
            <span class="rowButton" @click="topRoute(route.address)">置顶</span>
            <span class="rowButton" @click="selectRoute(route.address)">选择</span>
          </div>
        </div>
        <div class="editRouteBox" v-show="editRouteShow">
            <div class="editRouteTitle">
              编辑路由
            </div>
            <div class="editRouteRow">
              <span>地址</span>
              <input type="text" :value="tempEditRoute.address" class="editRouteInput" disabled/>
            </div>
            <div class="editRouteRow">
              <span>端口</span>
              <input type="number" v-model="tempEditRoute.port" class="editRouteInput"  @focusin="onFocusMode()" @focusout="noFocusMode()"/>
            </div>
            <div class="editRouteRow">
              <span>名称</span>
              <input type="text" v-model="tempEditRoute.name" class="editRouteInput"  @focusin="onFocusMode()" @focusout="noFocusMode()"/>
            </div>
            <div class="editRouteSubmit">
              <button class="editRouteSubmitBt" @click="submitEditRoute()">确定</button>
              <button class="editRouteSubmitBt" @click="cancelEditRoute()">取消</button>
              <button class="editRouteSubmitBt2" @click="deleteRoute(tempEditRoute.address)">删除路由</button>
            </div>
        </div>
        <div class="addRName" v-show="!editRouteShow">
          <div class="addRInput" ref="addRInput" @focus="addRInputFocus()" contenteditable="true" @focusin="onFocusMode()" @focusout="noFocusMode()">
          </div>
          <button class="addRNameButton" @click="addRoute()">
            添加
          </button>
          <button class="addRNameButton" @click="resetRInput()">
            重置
          </button>
          <!-- <div class="addRSubmit" ref="addRSubmitA" @click="addRoute()">

          </div>
          <div class="addRSubmit" ref="addRSubmitB" @click="resetRInput()">
            重置
          </div> -->
        </div>
      </div>
      <div class="Setting" v-show="AccountSettings"><!--账号设置-->
        <div class="SettingTitle">账号设置</div>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">使用默认账号进行登录</span>
            <span class="spansB">开启后将使用默认账号登录所有服务器</span>
          </div>
          <div class="switchOut" ref="AS01" @click="AS01($event)"><div ref="AS01_1" class="circle"></div></div>
        </div>
        <hr class="style-one"/>
        <div class="sheetList">
          <div class="row">
            <span class="rowSelect">✓</span>
            <span class="rowName">当前默认账号</span>
            <span class="rowC">操作</span>
          </div>
          <div class="row" v-for="value in accounts" :key="value.A">
            <span class="rowSelect" v-if="value.default">✓</span>
            <span class="rowSelect" v-if="!value.default">-</span>
            <span class="rowName" :title="value.A" v-text="value.A"/>
            <span class="rowButton" @click="deleteAccount(value.A)">删除</span>
            <span class="rowButton" @click="editAccount(value.A)">修改</span>
            <span class="rowButton" @click="selectAccount(value.A)">选择</span>
          </div>
          <div class="row" v-if="Object.keys(this.accounts).length===0">
            <span class="rowSelect">-</span>
            <span class="rowName">本地没有账号</span>
          </div>
        </div>
        <br/>
        <div class="inputBox styleK" v-show="!editAccountView">
          <div class="addATitle">
            添加账号
          </div>
          <div class="addAccount">
            <div class="addAccountRow">
              <span>账号</span>
              <div class="addAInput" ref="addInputName" contenteditable="true" @focusin="onFocusMode()" @focusout="noFocusMode()">
              </div>
            </div>
            <div class="addAccountRow">
              <span>密码</span>
              <div class="addAInput" ref="addInputPass" contenteditable="true" @focusin="onFocusMode()" @focusout="noFocusMode()">
              </div>
            </div>
            <div class="addASubmitRow">
              <div class="addASubmit" @click="addAccount()">
                添加
              </div>
              <div class="addASubmit" @click="resetAInput()">
                重置
              </div>
            </div>
          </div>
        </div>
        <div class="inputBox styleL" v-show="editAccountView">
          <div class="addATitle">
            账号修改
          </div>
          <div class="addAccount">
            <div class="addAccountRow">
              <span>账号</span>
              <div class="addAInput" style="border-bottom:none" ref="editInputName">
              </div>
            </div>
            <div class="addAccountRow">
              <span>密码</span>
              <div class="addAInput" ref="editInputPass" contenteditable="true" @focusin="onFocusMode()" @focusout="noFocusMode()">
              </div>
            </div>
            <div class="addASubmitRow">
              <div class="addASubmit" @click="editedAccount()">
                修改
              </div>
              <div class="addASubmit" @click="returnAInput()">
                返回
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="Setting" v-show="AboutSettings"><!--关于界面-->
        <div class="AboutBox">
          <img alt="Map log" title="Map log" class="mapLog" src="../../../static/map-log.png"><!--图标-->
          <p class="Ap2">在线地图编辑器</p>
          <p class="Ap1">version{{$root.Version}}</p>
          <p class="Ap1"><a href="https://hitokoto.cn" target="_blank" style="color:blue">一言提供</a></p>
          <p class="Ap3" style="letter-spacing:1px">Power by</p>
          <p class="Ap1">Online map editor</p>
          <p class="Ap3" style="letter-spacing:1px">Copyright </p>
          <p class="Ap1">{{$root.Copyright}}</p>
          <p class="Ap3">鸣谢</p>
          <p class="Ap1">ALIMU（测试）</p>
          <p class="Ap3">一言</p>
          <p class="Ap1" v-cloak v-text="'『 '+classicQuote+' 』'"/>
        </div>
      </div>
      <div class="Setting" v-show="HelpSettings"><!--帮助界面-->
        <div class="SettingTitle">帮助</div>
        <hr/>
        <div class="explain">
          欢迎使用在线地图编辑器，您可以使用此编辑器连接上您的组织（或个人）的在线地图服务器，并和您的同事伙伴进行在线实时编辑，您能连接上的在线地图服务器（以下简称OMS）取决于您的组织（或个人）的服务器配置，<span class="dottedUnderline">本编辑器不提供OMS的连接信息，请自行配置或向您的组织（或个人）索要OMS配置信息。</span>
        </div>
        <div class="title2">
          添加一个在线地图服务器的方法：
        </div>
        <div class="explain">
          1.点击右上角的 +
          <br/>
          2.在弹出的窗口中填写服务器地址、用户名、密码
          <br/>
          3.点击窗口右下角的创建按钮
          <br>
          4.在服务器列表即可看到您所添加的服务器，点击即可连接
          <br>
          *注意*用户名为一般的电子邮箱格式(aZ0~9-@xxx.xxx)
          <br>
          *注意*密码不允许包含一些字符，
          <br>
          例如：中文字符、()、{}、\/、[]
          <br>
          目前这些特殊字符可以使用：_!@$%^&*-+?;:*
        </div>
        <div class="title2">
          常用的快捷键：
        </div>
        <div class="explain">
          <div class="shortcut">
            <span class="cutA">按键</span><span class="cutB">功能描述</span>
          </div>
          <div class="shortcut">
            <span class="cutA">1</span><span class="cutB">创建兴趣点</span>
          </div>
          <div class="shortcut">
            <span class="cutA">2</span><span class="cutB">创建路径</span>
          </div>
          <div class="shortcut">
            <span class="cutA">3</span><span class="cutB">创建区域</span>
          </div>
          <div class="shortcut">
            <span class="cutA">4</span><span class="cutB">创建曲线</span>
          </div>
          <div class="shortcut">
            <span class="cutA">空格</span><span class="cutB">暂停创建节点</span>
          </div>
          <div class="shortcut">
            <span class="cutA">Enter</span><span class="cutB">结束创建要素</span>
          </div>
          <div class="shortcut">
            <span class="cutA">Esc</span><span class="cutB">取消创建要素</span>
          </div>
          <div class="shortcut">
            <span class="cutA">Del</span><span class="cutB">删除节点或元素</span>
          </div>
          <div class="shortcut">
            <span class="cutA">L</span><span class="cutB">打开日志面板</span>
          </div>
          <div class="shortcutTypeB">
            <div class="shortcutText">
              <span class="cutA">Ctrl+Z</span><span class="cutC">撤回</span><span @click="doubtRevoke=!doubtRevoke" class="doubtIcon" title="点击显示更多信息">?</span>
            </div>
            <div v-show="doubtRevoke" class="doubtContent">
              撤回快捷键允许您将之前的操作撤销
              <br/><br/>
              以下列举了一些撤回的情景：
              <br/><br/>
              1.创建线段时误点击了鼠标，需要撤回刚才创建的节点，可以使用Ctrl+Z撤销本次添加的节点。
              <br/><br/>
              2.选中元素后误点击了Del按键，需要恢复刚才删除的元素，可以使用Ctrl+Z还原被删除的元素。
              <br/><br/>
              3.创建好一个新的元素后，坐标整体偏移，需要重新绘制，可以使用Ctrl+Z撤销本次添加的元素。
              <br/><br/>
              如果您不清楚您进行了哪些操作，您还可以在显示设置中打开历史编辑记录面板以查询您的历史操作。
            </div>
          </div>
        </div>
        <div class="title1">
          基本操作(Ctrl + F 可进行搜索)
        </div>
        <div class="title2">
          移动和缩放视图：
        </div>
        <div class="explain">
          1.鼠标左键按下并拖动鼠标以移动视图，松开左键以停止移动视图（移动）
          <br/>
          2.鼠标滚轮向内或向下滚动以缩小视图，向外或向上滚动以放大视图（缩放）
        </div>
        <div class="title2">
          选中和取消选中要素：
        </div>
        <div class="explain">
          1.鼠标置于任意要素上方并按下左键（选中）
          <br/>
          2.鼠标置于任意要素上方并按下右键（右键选中）
          <br/>
          3.鼠标置于空白区域并按下左键（取消选中）
        </div>
        <div class="title2">
          移动要素：
        </div>
        <div class="explain">
          1.鼠标左键（选中）任意要素
          <br/>
          2.（拖动）该要素使其跟随鼠标移动
          <br/>
          3.（松开）鼠标左键完成移动
        </div>
        <div class="title2">
          编辑要素：
        </div>
        <div class="explain">
          <span class="explainChild">1.鼠标右键键（右键选中）任意要素</span>
          <span class="explainChild">2.点击图标<img :src="editButton" alt="编辑图标" title="编辑图标" class="icon7"/>打开编辑面板</span>
          <span class="explainChild">3.在右侧的编辑面板对要素进行编辑</span>
          <span class="explainChild">4.点击右下角上传按钮将更改内容上传至OMS</span>
        </div>
        <div class="title2">
          删除要素：
        </div>
        <div class="explain">
          <span class="explainChild">1.鼠标右键键（右键选中）任意要素</span>
          <span class="explainChild">2.点击图标<img :src="deleteButton" alt="删除图标" title="删除图标" class="icon7"/>以删除要素</span>
        </div>
        <div class="title1">
          名词解释(Ctrl + F 可进行搜索)
        </div>
        <div class="explain">
          <div class="shortcut">
            <span class="cutA">视图</span><span class="cutB">用以承载和显现各种地图要素的基本结构</span>
          </div>
          <br/>
          <div class="shortcut">
            <span class="cutA">兴趣点</span><span class="cutB">用以承载实际或虚拟的地点、位置等信息并以点状显现于视图</span>
          </div>
          <br/>
          <div class="shortcut">
            <span class="cutA">路径线</span><span class="cutB">用以承载实际或虚拟的路线、轨迹等信息并以线条状显现于视图</span>
          </div>
          <br/>
          <div class="shortcut">
            <span class="cutA">区域面</span><span class="cutB">用以承载实际或虚拟的范围、区块等信息并以面状显现于视图</span>
          </div>
          <br/>
          <br/>
          <div class="shortcut">
            <span class="cutA">节点</span><span class="cutB">用以显现路径线、区域面的轨迹节点并以灰色点状显现于路径线或区域面之上</span>
          </div>
        </div>
        <br/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import menuTool from "../svgValidIcons/menuTool";
import menuHelp from "../svgValidIcons/menuHelp";
import menuAbout from "../svgValidIcons/menuAbout";
import menuAboutC from "../svgValidIcons/custom/menuAbout";
import userAccount from "../svgValidIcons/userAccount";
import monitor from "../svgValidIcons/monitor";
import homePage from "../svgValidIcons/homePage";
import generalSetting from "../svgValidIcons/generalSetting";
import deleteButton from '../../../static/delete.png';
import editButton from '../../../static/edit.png';
import orangeSlideBlock from '../OrangeSlideBlock';
import SplitOMR from "../svgValidIcons/splitOMR";
export default {
  name: "LayerMenuPanel",
  components:{
    SplitOMR, orangeSlideBlock,homePage,
    generalSetting,monitor,userAccount,menuAbout,menuAboutC,
    menuHelp,menuTool,},
  data(){
    return {
      editRouteShow:false,
      panelShow:true,
      settingShow:false,
      GeneralSettings:false,
      DisplaySettings:false,
      RouteSettings:false,
      AccountSettings:false,
      AboutSettings:false,
      HelpSettings:false,
      classicQuote:'Fly me to the moon',
      offsetY:-31,
      accounts:{},
      deleteButton,
      editButton,
      doubtRevoke:false,
      editAccountView:false,
      tempEditRoute:{
        address:null,
        name:null,
        port:null,
        use:null,
      },
    }
  },
  mounted() {
    this.startSetting();//初始设置
    this.getHiToKoTo();
  },
  methods:{
    startSetting(){//初始设置
      this.watchWindowSize();//监听窗口变化
      this.watchStorage();//开启storage监听
      this.findLocalSetConfig();//查找本地设置，若查找不到则设置一个默认的值
      this.findLocalRouteConfig();//查找本地路由，若查找不到则设置一个默认的值
      this.$refs.SettingsBox.style.width=window.innerWidth+'px';//设置SettingsBox的大小
      this.$refs.SettingsBox.style.height=window.innerHeight+'px';
      this.findLocalAccounts();//查找本地账号配置
      this.checkRouter();
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    isValidPassword(password){//检测密码合理性
      const pattern = new RegExp('^[a-zA-Z0-9_!@$%^&*-+?\;:]*$');
      return pattern.test(password);
    },
    isValidEmail(email){//检测邮箱合理性
      const pattern = new RegExp('^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9-]+)\\.([a-zA-Z]{2,})$');
      return pattern.test(email);
    },
    isValidDomain(str){
      const pattern1 = /-{2,}|^-|^\.|\.$/;//以-开头或.开头结尾或连续存在-则返回true
      const pattern2 = new RegExp('^([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$');//域名方面检测
      const pattern3 = new RegExp('^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\\.(?!$)|$)){4}$');//ip地址方面检测
      if(pattern1.test(str)){
        return false;
      }else {
        if(pattern2.test(str)){
          return true;
        }else {
          return pattern3.test(str);
        }
      }
    },
    selectRoute(address){//选用路由
      let Config=undefined;
      try {
        Config=JSON.parse(this.$root.general_script.handleLocalStorage('get','routes'));
      }catch(e){}
      if(Array.isArray(Config) && Config!==null){
        let index=Config.findIndex((val)=>{return val.address===address});
        if(index!==-1){
          let Len=Config.length;
          for(let i=0;i<Len;i++){
            Config[i].use=false;
          }
          Config[index].use=true;
          this.$root.general_script.handleLocalStorage('set','routes',JSON.stringify(Config));//写入storage
          this.$store.commit('setCoLogMessage',{text:'已选择路由 '+address,from:'internal:LayerMenuPanel',type:'tip'});
          this.findLocalRouteConfig();
        }
      }
    },
    topRoute(address){//置顶路由
      let Config=undefined;
      try {
        Config=JSON.parse(this.$root.general_script.handleLocalStorage('get','routes'));
      }catch(e){}
      if(Array.isArray(Config) && Config!==null){
        let index=Config.findIndex((val)=>{return val.address===address});
        if(index!==-1){
          let insert=Config[index];
          Config.splice(index,1);
          Config.unshift(insert);
          this.$root.general_script.handleLocalStorage('set','routes',JSON.stringify(Config));//写入storage
          this.$store.commit('setCoLogMessage',{text:'已置顶路由 '+address,from:'internal:LayerMenuPanel',type:'tip'});
          this.findLocalRouteConfig();
        }else{
          this.$store.commit('setCoLogMessage',{text:'无法查询此路由 '+address,from:'internal:LayerMenuPanel',type:'tip'});
        }
      }
    },
    getRouteName(routeObj){
      if(routeObj.name==='route'){
        return routeObj.address;
      }else{
        return routeObj.name;
      }
    },
    editRoute(address){//开始编辑路由
      this.editRouteShow=true;
      let Config=undefined;
      try {
        Config=JSON.parse(this.$root.general_script.handleLocalStorage('get','routes'));
      }catch(e){}
      if(Array.isArray(Config) && Config!==null){
        let index=Config.findIndex((val)=>{return val.address===address});
        if(index!==-1){
          this.tempEditRoute.address=Config[index].address;
          this.tempEditRoute.name=Config[index].name;
          this.tempEditRoute.port=Config[index].port;
          this.tempEditRoute.use=Config[index].use;
        }
      }
    },
    submitEditRoute(){//结束编辑路由
      let address=this.tempEditRoute.address;
      let name=this.tempEditRoute.name;
      let port=parseInt(this.tempEditRoute.port);
      if(port===NaN){
        this.$store.commit('setCoLogMessage',{text:'修改失败，请输入正确的端口号 '+address,from:'internal:LayerMenuPanel',type:'tip'});
        return false;
      }
      let Config=undefined;
      try {
        Config=JSON.parse(this.$root.general_script.handleLocalStorage('get','routes'));
      }catch(e){}
      if(Array.isArray(Config) && Config!==null){
        let index=Config.findIndex((val)=>{return val.address===address});
        if(index!==-1){
          Config[index].name=name;
          Config[index].port=port;
          this.$root.general_script.handleLocalStorage('set','routes',JSON.stringify(Config));//写入storage
          this.$store.commit('setCoLogMessage',{text:'已修改路由 '+address,from:'internal:LayerMenuPanel',type:'tip'});
          this.editRouteShow=false;
          this.findLocalRouteConfig();
        }else{
          this.editRouteShow=false;
          this.$store.commit('setCoLogMessage',{text:'无法查询此路由 '+address,from:'internal:LayerMenuPanel',type:'tip'});
        }
      }
    },
    deleteRoute(address){//删除路由
      let Config=undefined;
      try {
        Config=JSON.parse(this.$root.general_script.handleLocalStorage('get','routes'));
      }catch(e){}
      if(Array.isArray(Config) && Config!==null){
        let index=Config.findIndex((val)=>{return val.address===address});
        if(index!==-1){
          Config.splice(index,1);
          this.$root.general_script.handleLocalStorage('set','routes',JSON.stringify(Config));//写入storage
          this.$store.commit('setCoLogMessage',{text:'已删除路由 '+address,from:'internal:LayerMenuPanel',type:'tip'});
          this.findLocalRouteConfig();
        }else{
          this.$store.commit('setCoLogMessage',{text:'无法查询此路由 '+address,from:'internal:LayerMenuPanel',type:'tip'});
        }
      }
    },
    cancelEditRoute(){//取消编辑路由
      this.editRouteShow=false;
      this.tempEditRoute={
        address:null,
        name:null,
        port:null,
        use:null,
      };
    },
    addRoute(){//添加路由
      let address=this.$refs.addRInput.innerText.replace(/[\n\r\s]+/g, '');
      let Config=undefined;
      if(this.isValidDomain(address)){
        address=address.toLowerCase();
        try {
          Config=JSON.parse(this.$root.general_script.handleLocalStorage('get','routes'));
        }catch(e){}
        if(Array.isArray(Config) && Config!==null){
          if(Config.length>=20){
            this.$store.commit('setCoLogMessage',{text:'无法添加，请删除其余路由后重试',from:'internal:LayerMenuPanel',type:'tip'});
          }
          if(-1===Config.findIndex(val=>{return val.address===address})){//检查有没有重复的路由,没有就加入
            let use=Config.length===0;
            let route={
              name:'route',//自定义名称，默认为route
              address:address,//地址
              port:35553,//端口，默认35553
              use:use,//是否使用中，默认false，首次添加为true
            };
            Config.push(route);
            this.$root.general_script.handleLocalStorage('set','routes',JSON.stringify(Config));//写入storage
            this.findLocalRouteConfig();
            this.$store.commit('setCoLogMessage',{text:'路由添加成功！',from:'internal:LayerMenuPanel',type:'tip'});
          }else{
            this.$store.commit('setCoLogMessage',{text:'已存在同样的路由',from:'internal:LayerMenuPanel',type:'tip'});
          }
        }

      }else {
        this.$store.commit('setCoLogMessage',{text:'路由格式错误，请输入正确的英文域名或ip地址',from:'internal:LayerMenuPanel',type:'tip'});
        return false;
      }
    },
    addAccount(){//添加账号
      let account=this.$refs.addInputName.innerText.replace(/[\n\r\s]+/g, '');
      let password=this.$refs.addInputPass.innerText.replace(/[\n\r\s]+/g, '');
      if(!this.isValidEmail(account)){
        this.$store.commit('setCoLogMessage',{text:'账号格式错误，请参照帮助界面',from:'internal:LayerMenuPanel',type:'tip'});
        return false;
      }
      if(!this.isValidPassword(password)){
        this.$store.commit('setCoLogMessage',{text:'密码不合规，请参照帮助界面',from:'internal:LayerMenuPanel',type:'tip'});
        return false;
      }
      if(account!=='' && password!==''){
        let find=this.$root.general_script.handleLocalStorage('get','accounts');//1get
        let accountsConfig=undefined;
        if(!find){
          this.$root.general_script.handleLocalStorage('set','accounts','{}');//初始化
          accountsConfig={};
        }else {
          accountsConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','accounts'));
        }
        if(Object.prototype.toString.call(accountsConfig) === '[object Object]'){
          if(accountsConfig.hasOwnProperty(account)){//检查有没有重复的账号,没有就加入，有则修改密码
            accountsConfig[account].P=password;
          }else {
            let Default=Object.keys(accountsConfig).length===0;
            accountsConfig[account]={A:account,P:password,default:Default};
          }
          this.$root.general_script.handleLocalStorage('set','accounts',JSON.stringify(accountsConfig));//写入storage
        }
        this.$store.commit('setCoLogMessage',{text:'账号添加成功！',from:'internal:LayerMenuPanel',type:'tip'});
        this.findLocalAccounts();
      }
    },
    resetRInput(){//重置路由输入
      this.$refs.addRInput.innerHTML="输入ip地址或域名";
    },
    resetAInput(){//重置账号输入
      this.$refs.addInputName.innerHTML="";
      this.$refs.addInputPass.innerHTML="";
    },
    editAccount(name){//修改账号
      this.editAccountView=true;
      let accountsConfig=undefined;
      accountsConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','accounts'));
      if(Object.prototype.toString.call(accountsConfig) === '[object Object]'){
        if(accountsConfig.hasOwnProperty(name)){//检查有没有账号
          this.$refs.editInputName.innerText=accountsConfig[name].A;
          this.$refs.editInputPass.innerText=accountsConfig[name].P;
        }
      }
    },
    editedAccount(){
      let account=this.$refs.editInputName.innerText.replace(/[\n\r\s]+/g, '');
      let password=this.$refs.editInputPass.innerText.replace(/[\n\r\s]+/g, '');
      if(!this.isValidEmail(account)){
        this.$store.commit('setCoLogMessage',{text:'账号格式错误，请参照帮助界面',from:'internal:LayerMenuPanel',type:'tip'});
        return false;
      }
      if(!this.isValidPassword(password)){
        this.$store.commit('setCoLogMessage',{text:'密码不合规，请参照帮助界面',from:'internal:LayerMenuPanel',type:'tip'});
        return false;
      }
      if(account!=='' && password!==''){
        let accountsConfig=undefined;
        accountsConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','accounts'));
        if(Object.prototype.toString.call(accountsConfig) === '[object Object]'){
          if(accountsConfig.hasOwnProperty(account)){
            accountsConfig[account].P=password;
          }
          this.$root.general_script.handleLocalStorage('set','accounts',JSON.stringify(accountsConfig));//写入storage
        }
        this.$store.commit('setCoLogMessage',{text:'账号修改成功！',from:'internal:LayerMenuPanel',type:'tip'});
        this.findLocalAccounts();
      }
    },
    returnAInput(){//返回添加账号
      this.editAccountView=false;
    },
    selectAccount(name){
      let accountsConfig=undefined;
      accountsConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','accounts'));
      if(Object.prototype.toString.call(accountsConfig) === '[object Object]'){
        Object.keys(accountsConfig).forEach((key)=>{
          accountsConfig[key].default = key === name;
        });
        this.$root.general_script.handleLocalStorage('set','accounts',JSON.stringify(accountsConfig));//写入storage
      }
      this.findLocalAccounts();
    },
    addRInputFocus(){
      this.$refs.addRInput.innerHTML="&nbsp;";
    },
    openToolbox(e){
      this.$store.commit('setCoLogMessage',{text:'打开工具箱',from:'internal:LayerMenuPanel',type:'tip'});
      this.$store.commit('setCoToolboxShowPanel',true);
      this.$store.commit('setCoToolboxPosition',{x:e.x,y:e.y});
    },
    checkRouter(){
      let rex=/^\/m/;
      if(rex.test(this.$router.currentRoute.path)){
        this.panelShow=false;
      }
    },
    async getHiToKoTo(){
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://v1.hitokoto.cn/?c=a&c=b&c=d&c=i&max_length=18',true);
      xhr.onreadystatechange = ()=> {
        if (xhr.readyState === 4) {
          try {
            const data = JSON.parse(xhr.responseText);
            this.classicQuote=data.hitokoto;
          }catch (e) {

          }
        }
      };
      xhr.send();
    },
    deleteAccount(name){//删除账号
      let accounts=this.handleLocalStorage('get','accounts');//get
      if(accounts!==false){
        accounts=JSON.parse(accounts);
        delete accounts[name];
        this.handleLocalStorage('set','accounts',JSON.stringify(accounts));//更新account
        this.findLocalAccounts();//更新组件
      }
      let servers=this.handleLocalStorage('get','servers');
      if(servers!==false){
        servers=JSON.parse(servers);
        for(let key in servers){//逐一检查，如果与要删除的账号同样则修改为空字符串
          if(servers[key].account===name){
            servers[key].account='';
            servers[key].password='';
          }
        }
        this.handleLocalStorage('set','servers',JSON.stringify(servers));//更新servers
        this.$root.sendInstruct('reloadServers');//更新组件
      }
    },
    findLocalAccounts(){//查找本地账号配置
      let find=this.handleLocalStorage('get','accounts');
      if(find!==false){
        let accounts=JSON.parse(this.handleLocalStorage('get','accounts'));
        if(isObject(accounts)){//更新
          this.accounts=accounts;
        }
        function isObject(obj) {
          return obj != null && typeof obj === 'object' && Array.isArray(obj) === false;
        }
      }
    },
    findLocalRouteConfig(){//查找本地路由配置
      let nowLocalStorage=JSON.parse(this.handleLocalStorage('get','routes'));//格式化本地配置路由
      if(nowLocalStorage!==false && Array.isArray(nowLocalStorage)){
        this.$store.state.userRouteConfig.routes=nowLocalStorage;
        let leng=nowLocalStorage.length;
        for(let i=0;i<leng;i++){
          if(nowLocalStorage[i].use===true){
            this.$store.state.userRouteConfig.use=nowLocalStorage[i];
            break;
          }
        }
      }else {//初始化routes
        let SetArr=[];
        let SetStr=JSON.stringify(SetArr);//格式化对象
        this.handleLocalStorage('set','routes',SetStr);
      }
    },
    findLocalSetConfig(){//查找本地设置配置
      let hasLocalConfig=this.handleLocalStorage('get','setting');
      if(hasLocalConfig=='true'){
        let nowLocalStorage=JSON.parse(this.handleLocalStorage('get','settings'));//格式化本地配置设置
        let hasAutoCheckServerStatus=nowLocalStorage.hasOwnProperty('set_GS_AutoCheckServerStatus');
        let hasAutoAdsorptionNode=nowLocalStorage.hasOwnProperty('set_GS_AutoAdsorptionNode');
        let hasAutoGetRoute=nowLocalStorage.hasOwnProperty('set_RS_AutoGetRoute');
        let hasMouseSamplingRate=nowLocalStorage.hasOwnProperty('set_DS_MouseSamplingRate');
        let hasMixVisibleRange=nowLocalStorage.hasOwnProperty('set_DS_MixVisibleRange');
        if(!hasAutoCheckServerStatus){
          nowLocalStorage.set_GS_AutoCheckServerStatus=true;
          this.handleLocalStorage('set','settings',JSON.stringify(nowLocalStorage));
        }
        if(!hasAutoAdsorptionNode){
          nowLocalStorage.set_GS_AutoAdsorptionNode=true;
          this.handleLocalStorage('set','settings',JSON.stringify(nowLocalStorage));
        }
        if(!hasAutoGetRoute){
          nowLocalStorage.set_RS_AutoGetRoute=true;
          this.handleLocalStorage('set','settings',JSON.stringify(nowLocalStorage));
        }
        if(!hasMouseSamplingRate){
          nowLocalStorage.set_DS_MouseSamplingRate='medium';
          this.handleLocalStorage('set','settings',JSON.stringify(nowLocalStorage));
        }
        if(!hasMixVisibleRange){
          nowLocalStorage.set_DS_MixVisibleRange='medium';
          this.handleLocalStorage('set','settings',JSON.stringify(nowLocalStorage));
        }
        for(let key in nowLocalStorage){
          switch (key) {
            case 'set_DS_MouseSamplingRate':{
              let oldStatus=nowLocalStorage[key];
              switch (oldStatus) {
                case 'low':{
                  this.$refs.DS05.classList.add('switchOutLow');
                  this.$refs.DS05_1.classList.add('circleLow');
                  this.$store.state.userSettingConfig.mouseSamplingRate='low';
                  break;
                }
                case 'medium':{
                  this.$refs.DS05.classList.add('switchOutMedium');
                  this.$refs.DS05_1.classList.add('circleMedium');
                  this.$store.state.userSettingConfig.mouseSamplingRate='medium';
                  break;
                }
                case 'high':{
                  this.$refs.DS05.classList.add('switchOutHigh');
                  this.$refs.DS05_1.classList.add('circleHigh');
                  this.$store.state.userSettingConfig.mouseSamplingRate='high';
                  break;
                }
              }
              break;
            }
            case 'set_GS_AutoAdsorptionNode':{
              if(nowLocalStorage[key]==true){
                this.$store.state.userSettingConfig.adsorptionNode=true;
                this.$refs.GS02.classList.add('switchOutOn');//更新样式
                this.$refs.GS02_1.classList.add('circleOn');
              }else if(nowLocalStorage[key]==false){
                this.$store.state.userSettingConfig.adsorptionNode=false;
                this.$refs.GS02.classList.remove('switchOutOn');
                this.$refs.GS02_1.classList.remove('circleOn');
              }
              break;
            }
            case 'set_GS_AutoCheckServerStatus':{//设置启动时自动检查服务器状态
              if(nowLocalStorage[key]==true){
                this.$store.state.userSettingConfig.autoCheckServer=true;
                this.$refs.GS01.classList.add('switchOutOn');//更新样式
                this.$refs.GS01_1.classList.add('circleOn');
              }else if(nowLocalStorage[key]==false){
                this.$store.state.userSettingConfig.autoCheckServer=false;
                this.$refs.GS01.classList.remove('switchOutOn');
                this.$refs.GS01_1.classList.remove('circleOn');
              }
              break;
            }
            case 'set_DS_OpenElementPanel':{
              if(nowLocalStorage[key]==true){
                this.$refs.DS01.classList.add('switchOutOn');//更新样式
                this.$refs.DS01_1.classList.add('circleOn');
                this.$store.state.userSettingConfig.openElementPanel=true;//更新状态
              }else if(nowLocalStorage[key]==false){
                this.$refs.DS01.classList.remove('switchOutOn');
                this.$refs.DS01_1.classList.remove('circleOn');
                this.$store.state.userSettingConfig.openElementPanel=false;//更新状态
              }
              break;
            }
            case 'set_DS_OpenStepRecorder':{
              if(nowLocalStorage[key]==true){
                this.$refs.DS04.classList.add('switchOutOn');//更新样式
                this.$refs.DS04_1.classList.add('circleOn');
                this.$store.state.userSettingConfig.openStepRecorder=true;//更新状态
              }else if(nowLocalStorage[key]==false){
                this.$refs.DS04.classList.remove('switchOutOn');
                this.$refs.DS04_1.classList.remove('circleOn');
                this.$store.state.userSettingConfig.openStepRecorder=false;//更新状态
              }
              break;
            }
            case 'set_DS_MixVisibleRange':{
              let oldStatus=nowLocalStorage[key];
              switch (oldStatus) {
                case 'low':{
                  this.$refs.DS08.classList.add('switchOutLow');
                  this.$refs.DS08_1.classList.add('circleLow');
                  this.$store.state.userSettingConfig.mixVisibleRange='low';
                  break;
                }
                case 'medium':{
                  this.$refs.DS08.classList.add('switchOutMedium');
                  this.$refs.DS08_1.classList.add('circleMedium');
                  this.$store.state.userSettingConfig.mixVisibleRange='medium';
                  break;
                }
                case 'high':{
                  this.$refs.DS08.classList.add('switchOutHigh');
                  this.$refs.DS08_1.classList.add('circleHigh');
                  this.$store.state.userSettingConfig.mixVisibleRange='high';
                  break;
                }
              }
              break;
            }
            case 'set_RS_AutoGetRoute':{
              if(nowLocalStorage[key]==true){
                this.$refs.RS01.classList.add('switchOutOn');//更新样式
                this.$refs.RS01_1.classList.add('circleOn');
                this.$store.state.userSettingConfig.autoGetRoute=true;//更新状态
              }else if(nowLocalStorage[key]==false){
                this.$refs.RS01.classList.remove('switchOutOn');
                this.$refs.RS01_1.classList.remove('circleOn');
                this.$store.state.userSettingConfig.autoGetRoute=false;//更新状态
              }
              break;
            }
            case 'set_RS_EnableSSL':{
              if(nowLocalStorage[key]==true){
                this.$refs.RS02.classList.add('switchOutOn');//更新样式
                this.$refs.RS02_1.classList.add('circleOn');
                this.$store.state.userSettingConfig.enableSSL=true;//更新状态
              }else if(nowLocalStorage[key]==false){
                this.$refs.RS02.classList.remove('switchOutOn');
                this.$refs.RS02_1.classList.remove('circleOn');
                this.$store.state.userSettingConfig.enableSSL=false;//更新状态
              }
              break;
            }
            case 'set_AS_DefaultAccountLogin':{
              if(nowLocalStorage[key]==true){
                this.$refs.AS01.classList.add('switchOutOn');//更新样式
                this.$refs.AS01_1.classList.add('circleOn');
                this.$store.state.userSettingConfig.defaultAccountLogin=true;//更新状态
              }else if(nowLocalStorage[key]==false){
                this.$refs.AS01.classList.remove('switchOutOn');
                this.$refs.AS01_1.classList.remove('circleOn');
                this.$store.state.userSettingConfig.defaultAccountLogin=false;//更新状态
              }
              break;
            }
          }
        }
      }
      else {
        let SetObj={//创建设置对象
          'set_GS_AutoCheckServerStatus':true,
          'set_RS_AutoGetRoute':true,
          'set_DS_MouseSamplingRate':'medium',
          'set_DS_MixVisibleRange':'medium',
        };
        let SetStr=JSON.stringify(SetObj);//格式化对象
        this.handleLocalStorage('set','setting','true');//添加默认配置
        this.handleLocalStorage('set','settings',SetStr);
        this.handleLocalStorage('set','A_tips_cn','请勿在控制台修改本地配置');
        this.handleLocalStorage('set','A_tips_uk','Do not modify local configuration on the console');
        this.settingSwitch('set_GS_AutoCheckServerStatus',true);//按钮初始化
        this.settingSwitch('set_GS_AutoAdsorptionNode',true);//按钮初始化
        this.settingSwitch('set_RS_AutoGetRoute',true);//按钮初始化
        this.settingSwitch('set_DS_MouseSamplingRate','medium');//按钮初始化
        this.settingSwitch('set_DS_MixVisibleRange','medium');//按钮初始化
      }
    },
    MenuButtonHomePage(){//主页按钮
      let newUrl=getDomainAndPort();
      location.replace(newUrl);
      function getDomainAndPort(){
        let url=window.location.href;
        let arr=window.location.protocol.split(':');
        let protocol=arr[0];
        let domainAndPort;
        if (url.indexOf('http://')>-1){
          domainAndPort=url.split('http://')[1];
        } else if(url.indexOf('https://')>-1){
          domainAndPort=url.split('https://')[1];
        }
        arr=domainAndPort.split('/');
        let domain=arr[0];
        let port;
        if(domain.indexOf(':')>-1){
          let tmp=domain.split(':');
          domain=tmp[0];
          port=tmp[1];
        }else{
          if(protocol==='http'){
            port='80';
          }else if(protocol==='https'){
            port='443';
          }
        }
        if(port==='80' || port==='443'){
          return protocol+'://'+domain;
        }else{
          return protocol+'://'+domain+':'+port;
        }
      }
    },
    handleLocalStorage(method, key, value) {//本地存储接口
      switch (method){
        case 'get':{
          let temp = window.localStorage.getItem(key);
          if (temp) {
            return temp;
          } else {
            return false;
          }
        }
        case 'set':{
          window.localStorage.setItem(key, value);
          break;
        }
        case 'remove':{
          window.localStorage.removeItem(key);
          break;
        }
        default:{
          return false;
        }
      }
    },
    DS01(ev){//显示设置下的功能开关
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=settingsObj.set_DS_OpenElementPanel;
      if(oldStatus===true){//修改storage中的值
        settingsObj.set_DS_OpenElementPanel=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.DS01.classList.remove('switchOutOn');//更改样式
        this.$refs.DS01_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.openElementPanel=false;//更新状态
      }else {
        settingsObj.set_DS_OpenElementPanel=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.DS01.classList.add('switchOutOn');//更改样式
        this.$refs.DS01_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.openElementPanel=true;//更新状态
      }
    },
    DS04(ev){//显示设置下的历史面板开关
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=settingsObj.set_DS_OpenStepRecorder;
      if(oldStatus===true){//修改storage中的值
        settingsObj.set_DS_OpenStepRecorder=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.DS04.classList.remove('switchOutOn');//更改样式
        this.$refs.DS04_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.openStepRecorder=false;
      }else {
        settingsObj.set_DS_OpenStepRecorder=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.DS04.classList.add('switchOutOn');//更改样式
        this.$refs.DS04_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.openStepRecorder=true;
      }
    },
    DS05(ev){//采样率
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=null;
      if(settingsObj.hasOwnProperty('set_DS_MouseSamplingRate')){
        oldStatus=settingsObj.set_DS_MouseSamplingRate;
      }else{
        oldStatus='medium';
      }
      switch (oldStatus) {
        case 'low':{
          settingsObj.set_DS_MouseSamplingRate='medium';
          this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
          this.$refs.DS05.classList.remove('switchOutLow');//更改样式
          this.$refs.DS05.classList.add('switchOutMedium');
          this.$refs.DS05_1.classList.remove('circleLow');
          this.$refs.DS05_1.classList.add('circleMedium');
          this.$store.state.userSettingConfig.mouseSamplingRate='medium';
          break;
        }
        case 'medium':{
          settingsObj.set_DS_MouseSamplingRate='high';
          this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
          this.$refs.DS05.classList.remove('switchOutMedium');//更改样式
          this.$refs.DS05.classList.add('switchOutHigh');
          this.$refs.DS05_1.classList.remove('circleMedium');
          this.$refs.DS05_1.classList.add('circleHigh');
          this.$store.state.userSettingConfig.mouseSamplingRate='high';
          break;
        }
        case 'high':{
          settingsObj.set_DS_MouseSamplingRate='low';
          this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
          this.$refs.DS05.classList.remove('switchOutHigh');//更改样式
          this.$refs.DS05.classList.add('switchOutLow');
          this.$refs.DS05_1.classList.remove('circleHigh');
          this.$refs.DS05_1.classList.add('circleLow');
          this.$store.state.userSettingConfig.mouseSamplingRate='low';
          break;
        }
      }
    },
    DS08(ev){//调整元素可视范围
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=null;
      if(settingsObj.hasOwnProperty('set_DS_MixVisibleRange')){
        oldStatus=settingsObj.set_DS_MixVisibleRange;
      }else{
        oldStatus='medium';
      }
      switch (oldStatus) {
        case 'low':{
          settingsObj.set_DS_MixVisibleRange='medium';
          this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
          this.$refs.DS08.classList.remove('switchOutLow');//更改样式
          this.$refs.DS08.classList.add('switchOutMedium');
          this.$refs.DS08_1.classList.remove('circleLow');
          this.$refs.DS08_1.classList.add('circleMedium');
          this.$store.state.userSettingConfig.mixVisibleRange='medium';
          break;
        }
        case 'medium':{
          settingsObj.set_DS_MixVisibleRange='high';
          this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
          this.$refs.DS08.classList.remove('switchOutMedium');//更改样式
          this.$refs.DS08.classList.add('switchOutHigh');
          this.$refs.DS08_1.classList.remove('circleMedium');
          this.$refs.DS08_1.classList.add('circleHigh');
          this.$store.state.userSettingConfig.mixVisibleRange='high';
          break;
        }
        case 'high':{
          settingsObj.set_DS_MixVisibleRange='low';
          this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
          this.$refs.DS08.classList.remove('switchOutHigh');//更改样式
          this.$refs.DS08.classList.add('switchOutLow');
          this.$refs.DS08_1.classList.remove('circleHigh');
          this.$refs.DS08_1.classList.add('circleLow');
          this.$store.state.userSettingConfig.mixVisibleRange='low';
          break;
        }
      }
    },
    RS01(ev){//路由设置下的自动拉取开关
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=settingsObj.set_RS_AutoGetRoute;
      if(oldStatus===true){//修改storage中的值
        settingsObj.set_RS_AutoGetRoute=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.RS01.classList.remove('switchOutOn');//更改样式
        this.$refs.RS01_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.autoGetRoute=false;//更新状态
      }else {
        settingsObj.set_RS_AutoGetRoute=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.RS01.classList.add('switchOutOn');//更改样式
        this.$refs.RS01_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.autoGetRoute=true;//更新状态
      }
    },
    RS02(ev){//路由设置下的ssl开关
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=settingsObj.set_RS_EnableSSL;
      if(oldStatus===true){//修改storage中的值
        settingsObj.set_RS_EnableSSL=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.RS02.classList.remove('switchOutOn');//更改样式
        this.$refs.RS02_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.enableSSL=false;//更新状态
      }else {
        settingsObj.set_RS_EnableSSL=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.RS02.classList.add('switchOutOn');//更改样式
        this.$refs.RS02_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.enableSSL=true;//更新状态
      }
    },
    AS01(ev){//账号设置下的功能开关
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=settingsObj.set_AS_DefaultAccountLogin;
      if(oldStatus===true){//修改storage中的值
        settingsObj.set_AS_DefaultAccountLogin=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.AS01.classList.remove('switchOutOn');//更改样式
        this.$refs.AS01_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.autoGetRoute=false;//更新状态
      }else {
        settingsObj.set_AS_DefaultAccountLogin=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.AS01.classList.add('switchOutOn');//更改样式
        this.$refs.AS01_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.autoGetRoute=true;//更新状态
      }
    },
    GS01(ev){//常规设置（GS）下的自动搜索服务器状态
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=settingsObj.set_GS_AutoCheckServerStatus;
      if(oldStatus===true){//修改storage中的值
        settingsObj.set_GS_AutoCheckServerStatus=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.GS01.classList.remove('switchOutOn');//更改样式
        this.$refs.GS01_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.autoCheckServer=false;//更新状态
      }else {
        settingsObj.set_GS_AutoCheckServerStatus=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.GS01.classList.add('switchOutOn');//更改样式
        this.$refs.GS01_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.autoCheckServer=true;//更新状态
      }
    },
    GS02(ev){//常规设置（GS）下的节点吸附开关
      ev.stopPropagation();
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
      let oldStatus=settingsObj.set_GS_AutoAdsorptionNode;
      if(oldStatus===true){//修改storage中的值
        settingsObj.set_GS_AutoAdsorptionNode=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.GS02.classList.remove('switchOutOn');//更改样式
        this.$refs.GS02_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.adsorptionNode=false;//更新状态
      }else {
        settingsObj.set_GS_AutoAdsorptionNode=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.GS02.classList.add('switchOutOn');//更改样式
        this.$refs.GS02_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.adsorptionNode=false;//更新状态
      }
    },
    watchStorage(){//实时监听storage变化
      window.addEventListener('storage', (e)=>{
        switch (e.key) {
          case 'settings':{//设置变动
            let newObj=JSON.parse(e.newValue);//格式化
            let oldObj=JSON.parse(e.oldValue);
            if(this.storageCheck(newObj)){
              for(let key1 in newObj){//检查被改动的项
                let isNewO=true;//当前key是否为新增
                for(let key2 in oldObj){//判断是否在old中存在
                  if(key1===key2){
                    isNewO=false;//找到同属性
                    if(newObj[key1]!==oldObj[key2]){//检测是否有变化
                      this.settingSwitch(key1,newObj[key1]);
                    }
                  }
                }
                if(isNewO){//如果为新增属性
                  this.settingSwitch(key1,newObj[key1]);
                }
              }
            }
            break;
          }
          case 'accounts':{
            this.findLocalAccounts();
          }
        }
      });
    },
    settingSwitch(key,value){//处理设置项(来自其他页面的设置)
      switch (key){
        case 'set_DS_MouseSamplingRate':{
          switch (value) {
            case 'low':{
              this.$refs.DS05.classList.remove('switchOutHigh');//更改样式
              this.$refs.DS05.classList.add('switchOutLow');
              this.$refs.DS05_1.classList.remove('circleHigh');
              this.$refs.DS05_1.classList.add('circleLow');
              this.$store.state.userSettingConfig.mouseSamplingRate='low';
              break;
            }
            case 'medium':{
              this.$refs.DS05.classList.remove('switchOutLow');//更改样式
              this.$refs.DS05.classList.add('switchOutMedium');
              this.$refs.DS05_1.classList.remove('circleLow');
              this.$refs.DS05_1.classList.add('circleMedium');
              this.$store.state.userSettingConfig.mouseSamplingRate='medium';
              break;
            }
            case 'high':{
              this.$refs.DS05.classList.remove('switchOutMedium');//更改样式
              this.$refs.DS05.classList.add('switchOutHigh');
              this.$refs.DS05_1.classList.remove('circleMedium');
              this.$refs.DS05_1.classList.add('circleHigh');
              this.$store.state.userSettingConfig.mouseSamplingRate='high';
              break;
            }
          }
          break;
        }
        case 'set_GS_AutoAdsorptionNode':{
          if(value==true){
            this.$store.state.userSettingConfig.adsorptionNode=true;
            this.$refs.GS02.classList.add('switchOutOn');//更新样式
            this.$refs.GS02_1.classList.add('circleOn');
          }else if(value==false){
            this.$store.state.userSettingConfig.adsorptionNode=false;
            this.$refs.GS02.classList.remove('switchOutOn');
            this.$refs.GS02_1.classList.remove('circleOn');
          }
          break;
        }
        case 'set_GS_AutoCheckServerStatus':{
          if(value==true){
            this.$store.state.userSettingConfig.autoCheckServer=true;
            this.$refs.GS01.classList.add('switchOutOn');//更新样式
            this.$refs.GS01_1.classList.add('circleOn');
          }else if(value==false){
            this.$store.state.userSettingConfig.autoCheckServer=false;
            this.$refs.GS01.classList.remove('switchOutOn');
            this.$refs.GS01_1.classList.remove('circleOn');
          }
          break;
        }
        case 'set_DS_OpenElementPanel':{
          if(value==true){
            this.$store.state.userSettingConfig.openElementPanel=true;
            this.$refs.DS01.classList.add('switchOutOn');//更新样式
            this.$refs.DS01_1.classList.add('circleOn');
          }else if(value==false){
            this.$store.state.userSettingConfig.openElementPanel=false;
            this.$refs.DS01.classList.remove('switchOutOn');
            this.$refs.DS01_1.classList.remove('circleOn');
          }
          break;
        }
        case 'set_DS_OpenStepRecorder':{
          if(value==true){
            this.$store.state.userSettingConfig.openStepRecorder=true;
            this.$refs.DS04.classList.add('switchOutOn');//更新样式
            this.$refs.DS04_1.classList.add('circleOn');
          }else if(value==false){
            this.$store.state.userSettingConfig.openStepRecorder=false;
            this.$refs.DS04.classList.remove('switchOutOn');
            this.$refs.DS04_1.classList.remove('circleOn');
          }
          break;
        }
        case 'set_DS_MixVisibleRange':{
          switch (value) {
            case 'low':{
              this.$refs.DS08.classList.remove('switchOutHigh');//更改样式
              this.$refs.DS08.classList.add('switchOutLow');
              this.$refs.DS08_1.classList.remove('circleHigh');
              this.$refs.DS08_1.classList.add('circleLow');
              this.$store.state.userSettingConfig.mixVisibleRange='low';
              break;
            }
            case 'medium':{
              this.$refs.DS08.classList.remove('switchOutLow');//更改样式
              this.$refs.DS08.classList.add('switchOutMedium');
              this.$refs.DS08_1.classList.remove('circleLow');
              this.$refs.DS08_1.classList.add('circleMedium');
              this.$store.state.userSettingConfig.mixVisibleRange='medium';
              break;
            }
            case 'high':{
              this.$refs.DS08.classList.remove('switchOutMedium');//更改样式
              this.$refs.DS08.classList.add('switchOutHigh');
              this.$refs.DS08_1.classList.remove('circleMedium');
              this.$refs.DS08_1.classList.add('circleHigh');
              this.$store.state.userSettingConfig.mixVisibleRange='high';
              break;
            }
          }
          break;
        }
        case 'set_RS_AutoGetRoute':{
          if(value==true){
            this.$refs.RS01.classList.add('switchOutOn');//更新样式
            this.$refs.RS01_1.classList.add('circleOn');
            this.$store.state.userSettingConfig.autoGetRoute=true;//更新状态
          }else if(value==false){
            this.$refs.RS01.classList.remove('switchOutOn');
            this.$refs.RS01_1.classList.remove('circleOn');
            this.$store.state.userSettingConfig.autoGetRoute=false;//更新状态
          }
          break;
        }
        case 'set_RS_EnableSSL':{
          if(value==true){
            this.$refs.RS02.classList.add('switchOutOn');//更新样式
            this.$refs.RS02_1.classList.add('circleOn');
            this.$store.state.userSettingConfig.enableSSL=true;//更新状态
          }else if(value==false){
            this.$refs.RS02.classList.remove('switchOutOn');
            this.$refs.RS02_1.classList.remove('circleOn');
            this.$store.state.userSettingConfig.enableSSL=false;//更新状态
          }
          break;
        }
        case 'set_AS_DefaultAccountLogin':{
          if(value==true){
            this.$refs.AS01.classList.add('switchOutOn');//更新样式
            this.$refs.AS01_1.classList.add('circleOn');
            this.$store.state.userSettingConfig.defaultAccountLogin=true;//更新状态
          }else if(value==false){
            this.$refs.AS01.classList.remove('switchOutOn');
            this.$refs.AS01_1.classList.remove('circleOn');
            this.$store.state.userSettingConfig.defaultAccountLogin=false;//更新状态
          }
          break;
        }
      }
    },
    storageCheck(obj){
      return obj != null && typeof obj === 'object' && Array.isArray(obj) === false;
    },
    watchWindowSize(){//监听窗口变化
      window.addEventListener('resize',()=>{
        this.$refs.SettingsBox.style.width=window.innerWidth+'px';
        this.$refs.SettingsBox.style.height=window.innerHeight+'px';
      })
    },
    close(){//关闭
      this.panelShow=!this.panelShow;
    },
    openSetting(name,ev){
      switch (name){
        case 'a':{//常规设置
          this.settingShow=true;
          this.GeneralSettings=true;
          this.DisplaySettings=false;
          this.RouteSettings=false;
          this.AccountSettings=false;
          this.AboutSettings=false;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        case 'b':{//显示设置
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=true;
          this.RouteSettings=false;
          this.AccountSettings=false;
          this.AboutSettings=false;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        case 'c':{//账号设置
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=false;
          this.AccountSettings=true;
          this.RouteSettings=false;
          this.AboutSettings=false;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        case 'r':{//路由
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=false;
          this.AccountSettings=false;
          this.RouteSettings=true;
          this.AboutSettings=false;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        case 'o':{//关于
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=false;
          this.RouteSettings=false;
          this.AccountSettings=false;
          this.AboutSettings=true;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        case 'p':{//帮助
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=false;
          this.RouteSettings=false;
          this.AccountSettings=false;
          this.AboutSettings=false;
          this.HelpSettings=true;
          this.setSettingsTop(ev);
          break;
        }
      }
    },
    setSettingsTop(ev){
      setTimeout(()=>{
        let height=this.$refs.Settings.getBoundingClientRect().height;
        let setNum=ev.y+this.offsetY;
        if(height+setNum>window.innerHeight){
          setNum=window.innerHeight-(height+5);
        }
        this.$refs.Settings.style.top=setNum+'px';
      },2);
    }
  },
  computed:{
    routes(){
      return this.$store.state.userRouteConfig.routes;
    },
    menuPanelDisplay(){
      return this.$store.state.commits.menuPanelDisplay;
    },
    reloadAccounts(){
      return this.$store.state.commits.reloadAccounts;
    },
    maxZoom(){
      return this.$store.state.cameraConfig.maxZoom;
    },
    minZoom(){
      return this.$store.state.cameraConfig.minZoom;
    },
    openStepRecorder(){
      return this.$store.state.userSettingConfig.openStepRecorder;
    },
    mouseSamplingRate(){
      return this.$store.state.userSettingConfig.mouseSamplingRate;
    },
    opAdsorptionNode(){
      return this.$store.state.commits.opAdsorptionNode;
    },
    unAdsorptionNode(){
      return this.$store.state.commits.unAdsorptionNode;
    },
  },
  watch:{
    '$route'(to,from){
      const regex = /^\/m/;
      if (from.path === '/' && regex.test(to.path)) {
        this.panelShow=false;
      }
      if(regex.test(from.path) && to.path=== '/'){
        this.panelShow=true;
      }
    },
    menuPanelDisplay:{
      handler(newValue){
       this.panelShow=newValue;
      }
    },
    AboutSettings:{
      handler(){
        this.getHiToKoTo();
      }
    },
    panelShow:{
      handler(){
        this.$refs.menuPanelLayer.classList.toggle('HidePanel');
        this.$refs.closeButtonBox.classList.toggle('HideCloseBt');
        this.$refs.closeButton.classList.toggle('HideSvg');
        if(this.panelShow===false){
          this.settingShow=false;//关闭所有设置
          this.GeneralSettings=false;
          this.DisplaySettings=false;
          this.AccountSettings=false;
          this.AboutSettings=false;
          this.HelpSettings=false;
        }
      }
    },
    reloadAccounts:{
      handler(){
        this.findLocalAccounts();
      }
    },
    openStepRecorder:{
      handler(newValue){
        if(!newValue){
          this.$refs.DS04.classList.remove('switchOutOn');
          this.$refs.DS04_1.classList.remove('circleOn');
        }
      }
    },
    mouseSamplingRate:{
      handler(newValue){
        switch (newValue){
          case 'low':{
            this.$store.state.cameraConfig.frameTime=32;
            break;
          }
          case 'medium':{
            this.$store.state.cameraConfig.frameTime=16;
            break;
          }
          case 'high':{
            this.$store.state.cameraConfig.frameTime=8;
            break;
          }
        }
      }
    },
    opAdsorptionNode:{//启用自动吸附
      handler(){
        let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
        settingsObj.set_GS_AutoAdsorptionNode=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.GS02.classList.add('switchOutOn');//更改样式
        this.$refs.GS02_1.classList.add('circleOn');
        this.$store.state.userSettingConfig.adsorptionNode=true;//更新状态
      }
    },
    unAdsorptionNode:{//关闭自动吸附
      handler(){
        let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));//获取设置对象
        settingsObj.set_GS_AutoAdsorptionNode=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        this.$refs.GS02.classList.remove('switchOutOn');//更改样式
        this.$refs.GS02_1.classList.remove('circleOn');
        this.$store.state.userSettingConfig.adsorptionNode=false;//更新状态
      }
    },
  }
}
</script>

<style scoped>
.editRouteSubmitBt{
  width: 50px;
  font-size: 14px;
}
.editRouteSubmitBt2{
  width: 100px;
  font-size: 14px;
}
.editRouteSubmit{
  width:100%;
  height:35px;
  display:flex;
  justify-content: space-around;
  align-items: center;
}
.editRouteTitle{
  height:24px;
}
.editRouteBox{
  margin: 0px 0px 10px 0px;
  width: calc(100% - 12px);
  border-radius: 4px;
  padding:6px;
  height: 145px;
  box-shadow:0px 0px 1px #000000
}
.editRouteRow{
  width: 100%;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin:4px 0px;
}
.editRouteRow span{
  width: 40px;
  height: 24px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.editRouteInput{
  width: calc(100% - 52px);
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.editRouteRow label{
  width: 40px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.AnimationL{
  animation:buttonEffectsSd 0.2s forwards;
}
.AnimationK{
  animation:buttonEffectsSe 0.2s forwards;
}
.inputBox{
  width: calc(100% - 10px);
  height: 130px;
  padding: 0px 5px;
  margin:10px 0px 10px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
.styleK{
  box-shadow:0px 0px 1px #000000;
}
.styleL{
  box-shadow:0px 0px 5px #fce4ee;
}
.routeListTitle{
  width: 100%;
  height: 30px;
  background: #e3f2fd;
  font-size:12px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sheetList{
  width: 100%;
  min-height: 70px;
  height: auto;
  max-height: 150px;
  overflow-y: auto;
  margin: 0px 0px 10px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.row{
  width: 100%;
  height: 30px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.rowC{
  width: 100px;
  display: flex;
  justify-content: center;
}
.rowSelect{
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rowName{
  width: 146px;
  max-width:146px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rowButton{
  width: 38px;
  display: flex;
  justify-content: center;
}
.rowButton:hover{
  text-decoration: underline;
}
.addRName{
  width: 100%;
  height: 40px;
  margin-bottom:10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.addRNameButton{
 width:50px;
 height:30px;
 margin: 0px 5px;
 display: flex;
 justify-content: center;
 align-items: center;
}
.addRInput{
  width: calc(100% - 110px);
  padding: 0px 6px;
  margin: 0px 4px;
  height: 30px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  outline:1px solid #7f7a74;
  border-radius: 3px;
}
.addRInput:focus{
  outline:2px solid #7f7a74;
}
.addATitle{
  width: 100%;
  font-size: 16px;
  transition: 0.4s;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.addAccount{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.addASubmitRow{
  width: 100%;
  height: auto;
  display:flex;
  flex-direction:row;
  align-items: center;
  justify-content: center;
}
.addASubmit{
  width: 40%;
  height: 30px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.addASubmit:hover{
  text-decoration:underline;
}
.addAccountRow{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.addAInput{
  width: calc(100% - 80px);
  padding: 0px 6px;
  margin: 5px 4px;
  height: 25px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  outline:0px solid;
  border-bottom: 1px solid #c4c4c4;
}
.addAInput:focus{
  border-bottom: 1px solid #575757;
}
hr.style-one{
  width:270px;
  margin:0 auto;
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, #d5d3d3, #bfbebe, #b4b4d1);
}
.SpanTh{
  width: 100%;
  height:100%;
  cursor: default;
  transform: translateY(5px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
}
.settingGroupTitle{
  width: auto;
  height: 25px;
  font-size: 18px;
  font-weight: 200;
  margin: 20px 5px 5px 5px;
  color: rgba(0,0,0,0.20);
  text-shadow: 0px 0px 1px #000000;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-direction: column;
}
.doubtContent{
  width: calc(100% - 10px);
  padding: 4px;
  border-radius: 4px;
  border: 1px #909090 solid;
  height: auto;
}
.doubtIcon{
  width: 13px;
  height: 13px;
  display: block;
  border-radius: 13px;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  line-height: 13px;
  transform: translateY(1px);
  font-weight: 800;
  background: #8aaaff;
  color: #ffffff;
}
.explainChild{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  line-height: 20px;
}
.icon7{
  width: 20px;
  height: 20px;
}
.dottedUnderline {
  text-decoration: underline;
  text-decoration-style: wavy;
}
.shortcutTypeB{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.shortcutText{
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
.shortcut{
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.cutA{
  width: 50px;
}
.cutB{
  width: calc(100% - 50px);
}
.cutC{
  width:auto;
  margin-right:10px;
}
.title1{
  width: calc(100% - 20px);
  padding: 10px;
  height: auto;
  font-size: 15px;
  font-weight: 600;
}
.title2{
  width: calc(100% - 20px);
  padding: 10px;
  height: auto;
  font-size: 14px;
  font-weight: 400;
}
.explain{
  width: calc(100% - 20px);
  padding: 10px;
  height: auto;
  font-size: 13px;
  letter-spacing: 1px;
  font-weight: 200;
  line-height: 20px;
}
.Ap3{
  font-size: 13px;
  color: rgba(5,5,5,0.75);
  margin: 5px 0px;
  font-weight: 600;
  letter-spacing: 3px;
}
.Ap2{
  font-size: 14px;
  color: rgba(5,5,5,0.75);
  margin: 5px 0px;
  font-weight: 600;
  letter-spacing: 3px;
}
.Ap1{
  font-size: 12px;
  color: rgba(5,5,5,0.75);
  margin: 5px 0px;
}
.mapLog{
  width: 64px;
  height: 64px;
  margin: 5px;
}
.AboutBox{
  padding: 15px 5px;
  width: calc(100% - 10px);
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
a {
  color: rgba(0,0,0,0.8);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

a:link, a:visited {
  color: rgba(0,0,0,0.8);
}

a:hover, a:active {
  color: rgba(0,0,0,0.8);
  border-color: transparent;
}
.switchOutOn{
  background: #3590ff !important;
}
.circleOn{
  transform: translateX(22px) translateY(1px) !important;
}
.switchOutLow{
  background: #13c08e !important;
}
.circleLow{
  transform: translateX(0px) translateY(1px) !important;
}
.switchOutMedium{
  background: #3590ff !important;
}
.circleMedium{
  transform: translateX(11px) translateY(1px) !important;
}
.switchOutHigh{
  background: #a324ff !important;
}
.circleHigh{
  transform: translateX(22px) translateY(1px) !important;
}
.SettingsBox{
  position: absolute;
  top: 0px;
  left: 85px;
  z-index: 545;
}
.SettingTitle{
  font-weight: 600;
  font-size: 19px;
  margin: 10px 5px;
}
.SettingList{
  width: calc(100% - 10px);
  margin: 10px 0px;
  height: auto;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
}
.spans{
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  width: calc(100% - 65px);
}
.spansA{
  font-size: 16px;
  font-weight: 200;
  color: rgba(5,5,5,0.9);
}
.spansB{
  font-size: 12px;
  font-weight: 100;
  color: rgba(5,5,5,0.5);
}
.switchOut{
  transition: 0.4s;
  width: 44px;
  height: 23px;
  border-radius: 25px;
  display: flex;
  background: #cbccce;
}
.circle {
  transition: 0.4s;
  background: white;
  width: 17px;
  height: 17px;
  border-radius: 21px;
  margin: 2px;
  transform: translateX(0px) translateY(1px);
}
.Setting{
  padding:0px 10px;
}
.Settings{
  box-shadow:#c5c5c5 0px 0px 6px;
  z-index: 550;
  position: absolute;
  top: 50px;
  left: 0px;
  transition: 0.4s;
  width: 300px;
  height: auto;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(255,255,255,0.98);
  border-radius: 4px;
  border: 1px solid #e2e2e2;
}
.menuPanelLayer{
  user-select: none;
  width: 85px;
  height: 100%;
  background: rgb(255,255,255);
  box-shadow: #c5c5c5 0px 0px 6px;
  position: fixed;
  z-index: 700;
  left: 0px;
  top:0px;
  padding: 10px 0px;
  color: rgba(0,0,0,0.9);
  transition: 0.4s;
}
.HidePanel{
  left:-85px!important;
}
.HideCloseBt{
  left:85px!important;
}
.HideSvg{
  transform: rotate(0deg)!important;
}
.listButtonBox{
  cursor: pointer;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
}
.selected{
  background: rgb(240,240,240);
}
.icon{
  width: 20px;
  height: 20px;
  margin: 0px 0px 0px 9px
}
.iconSpan{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
}
.closeButtonBox{
  width: 20px;
  height: 20px;
  position: absolute;
  top:50%;
  left:75px;
  display: flex;
  justify-content: center;
  z-index: 560;
  transition:0.4s;
}
.closeButton{
  width: 20px;
  height: 20px;
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  transform: rotate(180deg);
  z-index: inherit;
  transition:0.4s;
}
.icon2{
  width: 15px;
  height: 15px;
  z-index: inherit;
  transition:0.4s;
}
[v-cloak]{display: none}
</style>
