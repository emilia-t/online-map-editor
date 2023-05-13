<script src="../../../../../vue实例模板备份/vue/config/index.js"></script>
<template>
  <!--起始页面左侧的菜单面板-->
<div class="menuPanelLayer" ref="menuPanelLayer">
  <!--关闭按钮-->
  <div class="closeButtonBox" ref="closeButtonBox">
    <div class="closeButton" ref="closeButton" @click="close()">
      <svg class="icon2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z" fill="currentColor"></path></svg>
    </div>
  </div>
  <!--菜单按钮-->
  <div class="listButtonBox selected" ref="MenuButtonHomePage">
    <svg t="1681027976959" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5546" width="200" height="200"><path d="M853.376 930.688 646.016 930.688 646.016 585.6 376.832 585.6 376.832 930.688 170.368 930.688 170.368 504.576 113.024 504.576 113.024 988.032 434.176 988.032 434.176 643.072 588.672 643.072 588.672 988.032 910.72 988.032 910.72 504.576 853.376 504.576Z" p-id="5547"></path><path d="M511.872 28.288 27.904 443.008 27.904 518.528 511.872 103.808 996.096 518.784 996.096 443.136Z" p-id="5548"></path></svg>
    <span class="iconSpan">主页</span>
  </div>
  <hr/>
  <div class="listButtonBox" @click="openSetting('a',$event)">
    <svg t="1681028227906" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19805" width="200" height="200"><path d="M256 192.672V96c0-52.928-43.072-96-96-96S64 43.072 64 96v96.672C25.344 221.952 0 267.808 0 320s25.344 98.048 64 127.264V928c0 52.928 43.072 96 96 96s96-43.072 96-96V447.264c38.656-29.184 64-75.072 64-127.264s-25.344-98.048-64-127.328zM128 96a32 32 0 1 1 64 0v67.2a161.984 161.984 0 0 0-64 0V96z m64 832a32 32 0 1 1-64 0V476.736a157.312 157.312 0 0 0 64 0V928z m59.68-581.12c-0.512 1.696-0.96 3.36-1.568 5.056a94.208 94.208 0 0 1-12.096 23.552l-0.448 0.512a96.832 96.832 0 0 1-19.712 20.064l-0.32 0.256c-7.712 5.824-16.32 10.496-25.568 13.76-10.016 3.616-20.672 5.92-31.968 5.92s-21.952-2.304-32-5.952a94.784 94.784 0 0 1-25.568-13.76l-0.32-0.256a96.832 96.832 0 0 1-19.712-20.064l-0.448-0.512a95.328 95.328 0 0 1-12.096-23.552c-0.608-1.696-1.056-3.36-1.568-5.056A94.24 94.24 0 0 1 64 320c0-9.44 1.76-18.368 4.32-26.944 0.512-1.696 0.96-3.36 1.568-4.992 3.008-8.448 6.912-16.448 12.096-23.616l0.448-0.512c5.568-7.552 12.192-14.368 19.712-20.064l0.32-0.256c7.68-5.728 16.288-10.432 25.536-13.728C138.048 226.304 148.704 224 160 224s21.952 2.304 32 5.888c9.248 3.328 17.856 8 25.568 13.76l0.32 0.256c7.52 5.696 14.144 12.512 19.712 20.064l0.448 0.512a93.792 93.792 0 0 1 13.632 28.576c2.56 8.576 4.32 17.504 4.32 26.944 0 9.376-1.76 18.304-4.32 26.88zM960 192.672V96c0-52.928-43.072-96-96-96s-96 43.072-96 96v96.672c-38.688 29.28-64 75.136-64 127.328s25.312 98.048 64 127.264V928c0 52.928 43.072 96 96 96s96-43.072 96-96V447.264c38.624-29.184 64-75.072 64-127.264s-25.376-98.048-64-127.328zM832 96a32 32 0 1 1 64 0v67.2a162.464 162.464 0 0 0-64 0V96z m64 832a32 32 0 1 1-64 0V476.736a156.864 156.864 0 0 0 64 0V928z m59.68-581.12c-0.512 1.696-0.992 3.36-1.568 5.056a94.304 94.304 0 0 1-12.128 23.552l-0.448 0.512a97.472 97.472 0 0 1-19.68 20.064l-0.32 0.256c-7.744 5.824-16.32 10.496-25.568 13.76A93.824 93.824 0 0 1 864 416a93.12 93.12 0 0 1-32-5.952 94.304 94.304 0 0 1-25.888-14.016 96.192 96.192 0 0 1-19.744-20.064l-0.448-0.512a95.2 95.2 0 0 1-12.064-23.552c-0.64-1.696-1.056-3.36-1.568-5.056A94.24 94.24 0 0 1 768 320c0-9.44 1.76-18.368 4.32-26.944 0.512-1.696 0.928-3.36 1.568-4.992 3.008-8.448 6.944-16.448 12.064-23.616l0.448-0.512c5.568-7.552 12.192-14.368 19.744-20.064l0.32-0.256c7.68-5.76 16.32-10.432 25.568-13.76A95.04 95.04 0 0 1 864 224c11.264 0 21.952 2.304 32 5.888a98.976 98.976 0 0 1 25.888 14.016c7.488 5.696 14.112 12.512 19.68 20.064l0.448 0.512c5.184 7.2 9.056 15.2 12.128 23.616 0.576 1.632 1.056 3.328 1.568 4.992 2.528 8.544 4.288 17.472 4.288 26.912 0 9.376-1.76 18.304-4.32 26.88zM608 576.672V96c0-52.928-43.072-96-96-96s-96 43.072-96 96v480.672c-38.656 29.248-64 75.136-64 127.328s25.344 98.048 64 127.264V928c0 52.928 43.072 96 96 96s96-43.072 96-96v-96.736c38.624-29.184 64-75.072 64-127.264s-25.376-98.048-64-127.328zM480 96a32 32 0 1 1 64 0v451.2a161.984 161.984 0 0 0-64 0V96z m64 832a32 32 0 1 1-64 0v-67.264a157.312 157.312 0 0 0 64 0V928z m59.68-197.12c-0.512 1.696-0.992 3.36-1.568 5.056a94.304 94.304 0 0 1-12.128 23.552l-0.448 0.512a97.472 97.472 0 0 1-19.68 20.064l-0.32 0.256c-7.744 5.824-16.32 10.496-25.568 13.76A93.824 93.824 0 0 1 512 800c-11.296 0-21.952-2.304-32-5.952a94.784 94.784 0 0 1-25.568-13.76l-0.32-0.256a96.832 96.832 0 0 1-19.712-20.064l-0.448-0.512a95.328 95.328 0 0 1-12.096-23.552c-0.608-1.696-1.056-3.36-1.568-5.056A94.24 94.24 0 0 1 416 704c0-9.44 1.76-18.368 4.32-26.944 0.512-1.696 0.96-3.36 1.568-4.992 3.04-8.448 6.944-16.448 12.096-23.616l0.448-0.512c5.568-7.552 12.192-14.368 19.712-20.064l0.32-0.256c7.712-5.76 16.32-10.432 25.568-13.76 10.016-3.552 20.672-5.856 31.968-5.856 11.264 0 21.952 2.304 32 5.888a98.976 98.976 0 0 1 25.888 14.016c7.488 5.696 14.112 12.512 19.68 20.064l0.448 0.512c5.184 7.2 9.056 15.2 12.128 23.616 0.576 1.632 1.056 3.328 1.568 4.992 2.528 8.544 4.288 17.472 4.288 26.912 0 9.376-1.76 18.304-4.32 26.88z" fill="#333333" p-id="19806"></path></svg>
    <span class="iconSpan">常规</span>
  </div>
  <div class="listButtonBox" @click="openSetting('b',$event)">
    <svg t="1681028460143" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20800" width="200" height="200"><path d="M1024 736V160c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32v576c0 17.7 14.3 32 32 32h348c2.2 0 4 1.8 4 4v108H260c-2.2 0-4 1.8-4 4v40c0 2.2 1.8 4 4 4h504c2.2 0 4-1.8 4-4v-40c0-2.2-1.8-4-4-4H640V772c0-2.2 1.8-4 4-4h348c17.7 0 32-14.3 32-32zM576 880H448v-96c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96zM64 688V208c0-8.8 7.2-16 16-16h864c8.8 0 16 7.2 16 16v480c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16z" p-id="20801"></path></svg>
    <span class="iconSpan">显示</span>
  </div>
  <div class="listButtonBox" @click="openSetting('c',$event)">
    <svg t="1681028507647" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21819" width="200" height="200"><path d="M963.304273 982.126574c0 22.754101-18.255436 41.204869-40.78098 41.204869-22.52655 0-40.781987-18.450768-40.781987-41.204869l-0.358443-3.846217c0-1.630112 0.292997-3.194777 0.456109-4.792669-25.460549-180.860821-178.936705-313.768775-365.828637-315.853989-1.499219 0.03222-2.933999 0.228558-4.433219 0.228558s-2.935006-0.195331-4.400999-0.228558c-184.740265 2.086221-336.750428 132.025942-364.785526 309.757432 0.913225 3.488781 1.596885 7.107447 1.596885 10.888219l0.39167 3.878437c0 23.112544-18.549441 41.858323-41.433427 41.858323-22.852774 0-41.433427-18.744772-41.433427-41.858323l-0.03222-0.390663-0.782333 0c0.097666-1.206222 0.358443-2.380225 0.488329-3.586447 0-3.455554 0.521555-6.714771 1.303888-9.942774C83.710605 801.52653 194.319561 666.695467 344.830505 608.635708c-87.627303-56.721638-144.77283-156.964937-144.77283-271.486563 0-177.112269 136.232617-320.712104 311.551663-320.712104 175.286826 0 311.518436 143.599835 311.518436 320.712104 0 114.488399-57.081088 214.699479-144.676172 271.421117 149.467833 57.60365 259.555234 190.869041 281.984118 355.920096 1.532446 4.335553 2.54233 8.931883 2.54233 13.788991L963.304273 982.126574 963.304273 982.126574 963.304273 982.126574zM751.506574 337.246811c0-133.916832-107.447405-242.472793-239.99591-242.472793-132.548504 0-239.99591 108.588181-239.99591 242.472793 0 133.918845 107.447405 242.4738 239.99591 242.4738C644.025942 579.720611 751.506574 471.165657 751.506574 337.246811L751.506574 337.246811 751.506574 337.246811z" fill="#272636" p-id="21820"></path></svg>
    <span class="iconSpan">账户</span>
  </div>
  <hr/>
  <div class="listButtonBox" @click="openSetting('o',$event)">
    <svg t="1681028637315" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23290" width="200" height="200"><path d="M513.199766 0c-282.744776 0-511.90002 229.155243-511.90002 511.90002s229.155243 511.90002 511.90002 511.900019 511.90002-229.155243 511.900019-511.900019-229.155243-511.90002-511.900019-511.90002z m0 959.812537c-246.951767 0-447.912517-200.96075-447.912517-447.912517s200.96075-447.912517 447.912517-447.912518 447.912517 200.96075 447.912517 447.912518-200.96075 447.912517-447.912517 447.912517z" fill="#515151" p-id="23291" data-spm-anchor-id="a313x.7781069.0.i20" class="selected"></path><path d="M512.299941 319.937512m-31.993751 0a31.993751 31.993751 0 1 0 63.987503 0 31.993751 31.993751 0 1 0-63.987503 0Z" fill="#515151" p-id="23292" data-spm-anchor-id="a313x.7781069.0.i22" class="selected"></path><path d="M512.699863 419.418082c-17.596563 0-31.993751 14.397188-31.993751 31.993752v255.950009c0 17.596563 14.397188 31.993751 31.993751 31.993752s31.993751-14.397188 31.993752-31.993752v-255.950009c0-17.596563-14.397188-31.993751-31.993752-31.993752z" fill="#515151" p-id="23293" data-spm-anchor-id="a313x.7781069.0.i21" class="selected"></path></svg>
    <span class="iconSpan">关于</span>
  </div>
  <div class="listButtonBox" @click="openSetting('p',$event)">
    <svg t="1681028685627" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24482" width="200" height="200"><path d="M469.333333 810.453333c0-11.648 9.450667-21.12 21.546667-21.12h42.24c11.904 0 21.546667 9.621333 21.546667 21.12v85.76c0 11.648-9.450667 21.12-21.546667 21.12h-42.24c-11.904 0-21.546667-9.621333-21.546667-21.12v-85.76z m133.909334-209.984c-8.469333 3.285333-16.896 6.762667-25.002667 10.837334-15.488 7.786667-23.765333 20.437333-24.341333 38.016-0.234667 7.317333 0.085333 14.848-1.514667 21.909333-4.672 20.629333-24.341333 34.688-44.309333 32.554667-22.549333-2.410667-38.272-19.328-39.125334-41.6-2.304-60.096 22.698667-103.829333 77.205334-130.005334a243.626667 243.626667 0 0 1 22.549333-9.728c73.92-26.666667 120.213333-99.818667 112-177.28-8.234667-77.802667-69.504-141.141333-146.410667-151.210666-100.672-13.226667-189.845333 62.805333-193.173333 164.330666-0.170667 5.546667-0.426667 11.285333-1.92 16.576-5.610667 20.16-25.898667 33.365333-45.909333 30.4-22.016-3.285333-37.546667-20.757333-37.290667-43.434666 0.768-62.72 20.394667-119.061333 62.293333-165.76 68.8-76.693333 155.306667-105.770667 255.061334-80.512 100.714667 25.493333 163.114667 92.757333 187.434666 194.197333 4.138667 17.322667 4.906667 35.477333 7.210667 53.226667-2.261333 106.496-65.984 198.954667-164.757333 237.482666z" fill="#3D3D3D" p-id="24483"></path></svg>
    <span class="iconSpan">帮助</span>
  </div>
  <div class="SettingsBox" ref="SettingsBox" v-show="settingShow" @contextmenu="stopDefaultEvent($event)">
    <div class="Settings" ref="Settings">
      <!--具体的设置项目-->
      <!--常规设置-->
      <div class="Setting" v-show="GeneralSettings">
        <div class="SettingTitle">常规设置</div>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">启动时自动搜索服务器状态</span>
            <span class="spansB">这将有助于您选择地图服务器</span>
          </div>
          <!--switch式开关-->
          <div class="switchOut" ref="GS01" @click="GS01($event)"><div ref="GS01_1" class="circle"></div></div>
        </div>
        <hr/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">允许服务器修改本地配置</span>
            <span class="spansB">当地图服务器向您申请更新配置时，请开启此项</span>
          </div>
          <!--switch式开关-->
          <div class="switchOut"><div class="circle"></div></div>
        </div>
        <hr/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">断开连接时自动删除账号及密码</span>
            <span class="spansB">如果这不是您的设备请开启此项，以保障您的账户安全</span>
          </div>
          <!--switch式开关-->
          <div class="switchOut"><div class="circle"></div></div>
        </div>
      </div>
      <!--显示设置-->
      <div class="Setting" v-show="DisplaySettings">
        <div class="SettingTitle">显示设置</div>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">显示地图元素列表</span>
            <span class="spansB">开启后将会在左侧悬浮一个地图元素列表</span>
          </div>
          <!--switch式开关-->
          <div class="switchOut" ref="DS01" @click="DS01($event)"><div ref="DS01_1" class="circle"></div></div>
        </div>
        <hr/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">在上方显示地图标尺</span>
            <span class="spansB">在浏览器顶部显示标尺</span>
          </div>
          <!--switch式开关-->
          <div class="switchOut"><div class="circle"></div></div>
        </div>
        <hr/>
        <div class="SettingList">
          <div class="spans">
            <span class="spansA">在左侧显示地图标尺</span>
            <span class="spansB">在浏览器左侧显示标尺</span>
          </div>
          <!--switch式开关-->
          <div class="switchOut"><div class="circle"></div></div>
        </div>
      </div>
      <!--账号设置-->
      <div class="Setting" v-show="AccountSettings">
        <div class="SettingTitle">账号设置</div>
        <ul class="AccountSetUl">
          <li>
            <ol>
              <li class="AccountSetLi">
                账号
              </li>
              <li class="AccountSetLi">
                密码
              </li>
            </ol>
          </li>
          <li class="AccountSetLiA">
            操作
          </li>
        </ul>
        <hr/>
        <!--单个账号-->
        <ol class="AccountSetOl" v-for="value in accounts">
          <li class="AccountSetLiC">
            <ol>
              <li class="">
                {{value.A}}
              </li>
              <li class="">
                {{value.P}}
              </li>
            </ol>
          </li>
          <li class="AccountSetLiB" @click="deleteAccount(value.A)">
            删除
          </li>
        </ol>
      </div>
      <!--关于界面-->
      <div class="Setting" v-show="AboutSettings">
        <!--图标-->
        <div class="AboutBox">
          <img alt="Map log" title="Map log" class="mapLog" src="../../../static/map-log.png">
          <p class="Ap2">在线地图编辑器</p>
          <p class="Ap1">OME版本0.3.5</p>
          <p class="Ap1">Vue版本2.9.6</p>
          <p class="Ap1"><a href="https://github.com/emilia-t/map" target="_blank">开放源代码</a></p>
          <p class="Ap1">著作权归站长所有</p>
          <p class="Ap1">@2018~2023</p>
          <p class="Ap1">After The Stars Wither</p>
          <p class="Ap3">鸣谢</p>
          <p class="Ap1">Emilia</p>
          <p class="Ap1">ALIMU</p>
        </div>
      </div>
      <!--帮助界面-->
      <div class="Setting" v-show="HelpSettings">
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
        </div>
        <div class="title2">
          常用的快捷键：
        </div>
        <div class="explain">
          <div class="shortcut">
            <span class="cutA">按键</span><span class="cutB">功能描述</span>
          </div>
          <br/>
          <div class="shortcut">
            <span class="cutA">1</span><span class="cutB">创建点</span>
          </div>
          <br/>
          <div class="shortcut">
            <span class="cutA">2</span><span class="cutB">创建路径</span>
          </div>
          <br/>
          <div class="shortcut">
            <span class="cutA">3</span><span class="cutB">创建区域</span>
          </div>
          <br/>
          <div class="shortcut">
            <span class="cutA">空格</span><span class="cutB">移动视图</span>
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
          <span class="explainChild">3.在消息面板会主动发送一条删除要素的消息</span>
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
          <div class="shortcut">
            <span class="cutA">节点</span><span class="cutB">用以显现路径线、区域面的轨迹节点并以灰色点状显现于路径线或区域面之上</span>
          </div>
        </div>
        <br/>
      </div>
    </div>
  </div>
  <!--设置面板-->
</div>
</template>

<script>
import deleteButton from '../../../static/delete.png';
import editButton from '../../../static/edit.png';
export default {
  name: "LayerMenuPanel",
  data(){
    return {
      panelShow:true,
      settingShow:false,
      GeneralSettings:false,
      DisplaySettings:false,
      AccountSettings:false,
      AboutSettings:false,
      HelpSettings:false,
      offsetY:-31,
      accounts:{},
      deleteButton,
      editButton
    }
  },
  mounted() {
    //初始设置
    this.startSetting();
    //监听窗口变化
    this.watchWindowSize();
  },
  methods:{
    //初始设置
    startSetting(){
      //开启storage监听
      this.watchStorage();
      //查找本地配置（设置方面），若查找不到则设置一个默认的设置
      this.findLocalSetConfig();
      //设置主页按钮的功能
      this.$refs.MenuButtonHomePage.addEventListener('click',this.MenuButtonHomePage);
      //设置SettingsBox的大小
      this.$refs.SettingsBox.style.width=window.innerWidth+'px';
      this.$refs.SettingsBox.style.height=window.innerHeight+'px';
      //设置点击空白处关闭按钮
      this.$refs.SettingsBox.addEventListener('click',(ev)=>{
        ev.stopPropagation();
        //关闭所有设置
        this.settingShow=false;
        this.GeneralSettings=false;
        this.DisplaySettings=false;
        this.AccountSettings=false;
        this.AboutSettings=false;
        this.HelpSettings=false;
      });
      //阻止冒泡
      this.$refs.Settings.addEventListener('click',(ev)=>{
        ev.stopPropagation();
      });
      //查找本地账号配置
      this.findLocalAccounts();
    },
    //删除账号
    deleteAccount(name){
      //get
      let accounts=this.handleLocalStorage('get','accounts');
      if(accounts!==false){
        accounts=JSON.parse(accounts);
        delete accounts[name];
        //更新account
        this.handleLocalStorage('set','accounts',JSON.stringify(accounts));
        //更新组件
        this.findLocalAccounts();
      }
      //get
      let servers=this.handleLocalStorage('get','servers');
      if(servers!==false){
        servers=JSON.parse(servers);
        //逐一检查，如果与要删除的账号同样则修改为空字符串
        for(let key in servers){
          if(servers[key].account===name){
            servers[key].account='';
            servers[key].password='';
          }
        }
        //更新servers
        this.handleLocalStorage('set','servers',JSON.stringify(servers));
        //更新组件
        this.$root.sendInstruct('reloadServers');
      }
    },
    //关闭默认事件
    stopDefaultEvent(ev){
      ev.preventDefault();
    },
    //查找本地账号配置
    findLocalAccounts(){
      //1get
      let find=this.handleLocalStorage('get','accounts');
      if(find!==false){
        let accounts=JSON.parse(this.handleLocalStorage('get','accounts'));
        //更新
        if(isObject(accounts)){
          this.accounts=accounts;
        }
        function isObject(obj) {
          return obj != null && typeof obj === 'object' && Array.isArray(obj) === false;
        }
      }
    },
    //查找本地设置配置
    findLocalSetConfig(){
      let localConfig=null;
      let hasLocalConfig=this.handleLocalStorage('get','setting');
      if(hasLocalConfig=='true'){
        //格式化本地配置设置
        let nowLocalStorage=JSON.parse(this.handleLocalStorage('get','settings'));
        for(let key in nowLocalStorage){
          switch (key) {
            //设置启动时自动检查服务器状态
            case 'set_GS_AutoCheckServerStatus':{
              if(nowLocalStorage[key]==true){
                //更新样式
                this.$refs.GS01.classList.add('switchOutOn');
                this.$refs.GS01_1.classList.add('circleOn')
              }else if(nowLocalStorage[key]==false){
                this.$refs.GS01.classList.remove('switchOutOn');
                this.$refs.GS01_1.classList.remove('circleOn')
              }
              break;
            }
            case 'set_DS_OpenElementPanel':{
              if(nowLocalStorage[key]==true){
                //更新样式
                this.$refs.DS01.classList.add('switchOutOn');
                this.$refs.DS01_1.classList.add('circleOn');
                //更新状态
                this.$store.state.userSettingConfig.elementPanelLayerShow=true;
              }else if(nowLocalStorage[key]==false){
                this.$refs.DS01.classList.remove('switchOutOn');
                this.$refs.DS01_1.classList.remove('circleOn');
                //更新状态
                this.$store.state.userSettingConfig.elementPanelLayerShow=false;
              }
              break;
            }
          }
        }
      }else {
        //创建设置对象
        let SetObj={
          'set_GS_AutoCheckServerStatus':true
        };
        //格式化对象
        let SetStr=JSON.stringify(SetObj);
        //添加默认配置
        this.handleLocalStorage('set','setting','true');
        this.handleLocalStorage('set','settings',SetStr);
        this.handleLocalStorage('set','A_tips_cn','请勿在控制台修改本地配置');
        this.handleLocalStorage('set','A_tips_uk','Do not modify local configuration on the console');
        //按钮初始化
        this.settingSwitch('set_GS_AutoCheckServerStatus',true);
      }
    },
    //主页按钮
    MenuButtonHomePage(){
      let newUrl=getDomainAndPort();
      location.replace(newUrl);
      function getDomainAndPort() {
        let url = window.location.href;
        let arr = window.location.protocol.split(':');
        let protocol = arr[0];
        let domainAndPort;
        if (url.indexOf('http://') > -1) {
          domainAndPort = url.split('http://')[1];
        } else if (url.indexOf('https://') > -1) {
          domainAndPort = url.split('https://')[1];
        }
        arr = domainAndPort.split('/');
        let domain = arr[0];
        let port;
        if (domain.indexOf(':') > -1) {
          let tmp = domain.split(':');
          domain = tmp[0];
          port = tmp[1];
        } else {
          if (protocol === 'http') {
            port = '80';
          } else if (protocol === 'https') {
            port = '443';
          }
        }
        if (port === '80' || port === '443') {
          return protocol + '://' + domain;
        } else {
          return protocol + '://' + domain + ':' + port;
        }
      }
    },
    //本地存储接口
    handleLocalStorage(method, key, value) {
      switch (method) {
        case 'get' : {
          let temp = window.localStorage.getItem(key);
          if (temp) {
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
    },
    //显示设置（DS）下的功能开关
    DS01(ev){
      ev.stopPropagation();
      //获取设置对象  "set_DS_OpenElementPanel":"false"
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));
      let oldStatus=settingsObj.set_DS_OpenElementPanel;
      //修改storage中的值
      if(oldStatus==true){
        settingsObj.set_DS_OpenElementPanel=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        //更改样式
        this.$refs.DS01.classList.remove('switchOutOn');
        this.$refs.DS01_1.classList.remove('circleOn');
        //更新状态
        this.$store.state.userSettingConfig.elementPanelLayerShow=false;
      }else {
        settingsObj.set_DS_OpenElementPanel=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        //更改样式
        this.$refs.DS01.classList.add('switchOutOn');
        this.$refs.DS01_1.classList.add('circleOn');
        //更新状态
        this.$store.state.userSettingConfig.elementPanelLayerShow=true;
      }
    },
    //常规设置（GS）下的功能开关
    //01号开关
    GS01(ev){
      ev.stopPropagation();
      //获取设置对象
      let settingsObj=JSON.parse(this.handleLocalStorage('get','settings'));
      let oldStatus=settingsObj.set_GS_AutoCheckServerStatus;
      //修改storage中的值
      if(oldStatus==true){
        settingsObj.set_GS_AutoCheckServerStatus=false;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        //更改样式
        this.$refs.GS01.classList.remove('switchOutOn');
        this.$refs.GS01_1.classList.remove('circleOn')
      }else {
        settingsObj.set_GS_AutoCheckServerStatus=true;
        this.handleLocalStorage('set','settings',JSON.stringify(settingsObj));
        //更改样式
        this.$refs.GS01.classList.add('switchOutOn');
        this.$refs.GS01_1.classList.add('circleOn')
      }
    },
    //实时监听storage变化,这是为了用户多页面多操作考虑
    watchStorage(){
      window.addEventListener('storage', (e)=>{
        switch (e.key) {
          //设置变动
          case 'settings':{
            //格式化
            let newObj=JSON.parse(e.newValue);
            let oldObj=JSON.parse(e.oldValue);
            //检查格式后的数据是否正常,如果不正常则删除settings以此重置配置（防篡改）
            if(this.storageCheck(newObj)){
              //检查被改动的项（新增项和旧值有改动项）
              for(let key1 in newObj){
                //当前key
                //是否为新增
                let isNewO=true;
                //判断是否在old中存在
                for(let key2 in oldObj){
                  if(key1===key2){
                    //找到同属性
                    isNewO=false;
                    //检测是否有变化
                    if(newObj[key1]!==oldObj[key2]){
                      this.settingSwitch(key1,newObj[key1])
                    }
                  }
                }
                //如果为新增属性
                if(isNewO){
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
    //处理设置项(来自其他页面的设置)
    settingSwitch(key,value){
      switch (key){
        case 'set_GS_AutoCheckServerStatus':{
          if(value==true){
            //更新样式
            this.$refs.GS01.classList.add('switchOutOn');
            this.$refs.GS01_1.classList.add('circleOn')
          }else if(value==false){
            this.$refs.GS01.classList.remove('switchOutOn');
            this.$refs.GS01_1.classList.remove('circleOn')
          }
          break;
        }
        case 'set_DS_OpenElementPanel':{
          if(value==true){
            //更新样式
            this.$refs.DS01.classList.add('switchOutOn');
            this.$refs.DS01_1.classList.add('circleOn');
            //打开元素面板

          }else if(value==false){
            this.$refs.DS01.classList.remove('switchOutOn');
            this.$refs.DS01_1.classList.remove('circleOn');
          }
          break;
        }
      }
    },
    //用于检测本地存储是否正常的，如果不正常则返回false，否则返回true
    storageCheck(Obj){
      //1.检测Obj是否为对象
      if(isObject(Obj)){
        let sLock=true;
        //2.检测各项属性的值是否为布尔
        for(let key in Obj){
          if(!isBoolean(Obj[key])){
            sLock=false;
          }
        }
        return sLock;
      }else {
        return false;
      }
      function isBoolean(val) {
        return typeof val === 'boolean';
      }
      function isObject(obj) {
        return obj != null && typeof obj === 'object' && Array.isArray(obj) === false;
      }
    },
    //监听窗口变化
    watchWindowSize(){
      window.addEventListener('resize',()=>{
        //更新
        this.$refs.SettingsBox.style.width=window.innerWidth+'px';
        this.$refs.SettingsBox.style.height=window.innerHeight+'px';
      })
    },
    //关闭
    close(){
      this.panelShow=!this.panelShow;
    },
    openSetting(name,ev){
      switch (name){
        //常规设置
        case 'a':{
          this.settingShow=true;
          this.GeneralSettings=true;
          this.DisplaySettings=false;
          this.AccountSettings=false;
          this.AboutSettings=false;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        //显示设置
        case 'b':{
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=true;
          this.AccountSettings=false;
          this.AboutSettings=false;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        //账号设置
        case 'c':{
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=false;
          this.AccountSettings=true;
          this.AboutSettings=false;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        //关于
        case 'o':{
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=false;
          this.AccountSettings=false;
          this.AboutSettings=true;
          this.HelpSettings=false;
          this.setSettingsTop(ev);
          break;
        }
        //帮助
        case 'p':{
          this.settingShow=true;
          this.GeneralSettings=false;
          this.DisplaySettings=false;
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
    reloadAccounts(){
      return this.$store.state.commits.reloadAccounts;
    }
  },
  watch:{
    panelShow:{
      handler(newValue){
        this.$refs.menuPanelLayer.classList.toggle('HidePanel');
        this.$refs.closeButtonBox.classList.toggle('HideCloseBt');
        this.$refs.closeButton.classList.toggle('HideSvg');
      }
    },
    reloadAccounts:{
      handler(){
        this.findLocalAccounts();
      }
    }
  }
}
</script>

<style scoped>
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
.shortcut{
  width: 100%;
  height: 30px;
  /*background: red;*/
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
  font-weight: 200;
  line-height: 20px;
}
.Ap3{
  font-size: 13px;
  color: rgba(5,5,5,0.75);
  margin: 5px 0px;
  font-weight: 600;
}
.Ap2{
  font-size: 14px;
  color: rgba(5,5,5,0.75);
  margin: 5px 0px;
  font-weight: 600;
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
.AccountSetUl{
  width:calc(100% - 14px);
  height: 30px;
  margin: 10px 0px;
  padding: 7px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-flow: wrap;
  flex-wrap: wrap;
}
.AccountSetOl{
  width:calc(100% - 14px);
  height: 30px;
  margin: 10px 0px;
  padding: 7px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-flow: wrap;
  flex-wrap: wrap;
}
.AccountSetLi{
  width: auto;
  height: auto;
}
.AccountSetLiA{
  width: 36px;
}
.AccountSetLiB{
  width: 36px;
  border: 1px solid #afafaf;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.AccountSetLiC{
  width: calc(100% - 38px);
  height: 28px;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
}
ol,ul{
  list-style: none;
  margin: 0px;
  padding: 0px;
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
.SettingsBox{
  position: absolute;
  top: 0px;
  left: 100px;
  z-index: 545;
}
.whiteBack{
  width: 100%;
  height: 100%;
  position: absolute;
}
.SettingTitle{
  font-weight: 600;
  font-size: 19px;
  margin: 10px;
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
  width: calc(100% - 70px);
}
.spansA{
  font-size: 17px;
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
.switchOutOff{
  background: #3590ff !important;
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
.circleOff {
  transform: translateX(22px) translateY(1px) !important;
}
.Settings{
  box-shadow:2px 2px 5px rgb(220, 220, 220);
  z-index: 550;
  position: absolute;
  top: 50px;
  left: -14px;
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
  box-shadow: 2px 2px 5px rgb(220, 220, 220);
  position: fixed;
  left: 0px;
  top:0px;
  padding: 10px 0px;
  z-index: 550;
  color: rgba(0,0,0,0.9);
  transition: 0.4s;
}
.icon3{
  z-index: inherit;
  width: 40px;
  height: 40px;
  transform: rotate(180deg);
  position: absolute;
  left: -27px;
  top: 10px;
}
.HidePanel{
  left:-105px!important;
}
.HideCloseBt{
  left:100px!important;
}
.HideSvg{
  transform: rotate(0deg)!important;
}
.listButtonBox{
  cursor: pointer;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-around;
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
  margin: 0px 9px 0px 0px
}
.closeButtonBox{
  width: 20px;
  height: 20px;
  /*background: red;*/
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
</style>
