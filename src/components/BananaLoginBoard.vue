<template>
<div class="BananaLoginBoard">
  <div class="BananaLoginBoardBox"><!--匿名登录面板-->
    <div v-if="anonymousLogin===true && isLogin===false" class="anonymousBox">
      <div class="anonymousHead">
        此OMS已启用匿名登录
      </div>
      <div class="anonymousInput">
        <span class="anonymousAt">输入您的名称:</span>
        <input class="anonymousTp" type="text" maxlength="16" placeholder="怎么称呼您 ?" ref="anonymousTp" @focus="onFocusMode()" @blur="noFocusMode()"/>
        <button class="buttonMini" @click="anyLogin()" @mousedown.stop="playSoundEffect('confirm_1')">Submit</button>
      </div>
    </div>
    <div v-if="!isLogin" class="session"><!--登录面板-->
      <div class="left">
        <svg @click="close()" @mousedown.stop="playSoundEffect('unconfirm_1')" t="1674626678243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1474" width="200" height="200"><path d="M617.92 516.096l272 272L788.096 889.92l-272-272-272 272L142.24 788.096l272-272-275.008-275.04L241.056 139.2l275.04 275.04 275.04-275.04L892.96 241.024l-275.04 275.04z" p-id="1475" data-spm-anchor-id="a313x.7781069.0.i0" class="selected" fill="#ffffff"></path></svg>
      </div>
      <div class="log-in LoginPage">
        <h4>登录至此 <span>OMS</span></h4>
        <p>欢迎回来，请输入您的账号以登录此 OMS</p>
        <div class="floating-label">
          <input @focus="onFocusMode()" @blur="noFocusMode()" placeholder="Email" type="email" name="email" id="email" autocomplete="on" v-model:value="email">
          <label for="email">Email:</label>
          <div class="icon">
            <svg t="1674466343070" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2744" width="200" height="200"><path d="M838.954667 234.666667H170.666667c-3.626667 0-7.168 0.448-10.56 1.322666l323.690666 323.669334a21.333333 21.333333 0 0 0 30.165334 0L838.954667 234.666667z m46.144 14.186666l-260.693334 260.693334 262.933334 262.912c5.44-7.168 8.661333-16.106667 8.661333-25.792V277.333333c0-10.944-4.117333-20.906667-10.88-28.48zM843.861333 789.333333l-249.6-249.621333-50.133333 50.133333a64 64 0 0 1-90.517333 0l-50.112-50.133333L156.373333 786.88c4.48 1.578667 9.28 2.453333 14.314667 2.453333h673.194667zM128.661333 754.218667L373.333333 509.525333 129.578667 265.813333A42.709333 42.709333 0 0 0 128 277.333333v469.333334c0 2.56 0.213333 5.098667 0.661333 7.552zM170.666667 192h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v469.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z" fill="#333333" p-id="2745"></path></svg>
          </div>
        </div>
        <div class="floating-label">
          <form><input @focus="onFocusMode()" @blur="noFocusMode()" placeholder="Password" type="password" name="password" id="password1" autocomplete="on" v-model:value="password"></form>
          <label for="password1">Password:</label>
          <div class="icon">
            <svg t="1674466579161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4618" width="200" height="200"><path d="M511.61088 557.78816c-45.73696 0-82.944 37.21216-82.944 82.94912 0 18.18112 5.77536 35.45088 16.72192 49.92512 0.22528 0.31232 0.48128 0.60416 0.73216 0.91136 20.49024 23.87968 21.98016 40.92416 22.07232 42.48576l0 47.37536c0 23.94624 19.4816 43.4176 43.4176 43.4176 23.94624 0 43.42272-19.48672 43.42272-43.4176l0-48.26624c0-0.54272-0.01536-1.09056-0.07168-1.62816 0-0.03584 0.10752-0.00512 0.11264-0.04608 0.11264-1.09056 0.48128-3.42016 1.59232-6.78912 2.23232-6.76864 7.47008-17.87392 19.79904-32.29184 0.1792-0.20992 0.35328-0.43008 0.52736-0.64 11.49952-14.69952 17.57696-32.34816 17.57696-51.03616C594.57024 595.00032 557.35808 557.78816 511.61088 557.78816L511.61088 557.78816M547.65056 668.35968c-28.99968 34.0736-30.41792 58.47552-30.14656 65.30048l0 47.77984c0 3.24608-2.64704 5.88288-5.89312 5.88288s-5.88288-2.64192-5.88288-5.88288l0-47.60576c0-3.50208-0.96256-31.30368-30.70464-66.21184-5.77536-7.82336-8.82688-17.10592-8.82688-26.88512 0-25.04704 20.37248-45.42464 45.4144-45.42464 25.04704 0 45.42976 20.3776 45.42976 45.42464C557.04064 650.83904 553.79456 660.38272 547.65056 668.35968L547.65056 668.35968M547.65056 668.35968 547.65056 668.35968z" fill="#262536" p-id="4619"></path><path d="M827.392 399.05792l-2.36032 0 0-0.27648-43.6736 0L781.35808 278.4512c0-0.7936-0.05632-1.59232-0.14848-2.39104-8.20736-64.08192-39.47008-123.07456-88.03328-166.13888-48.99328-43.43296-112.08192-67.3536-177.60768-67.3536-71.54176 0-138.79808 27.85792-189.3888 78.4384-50.5856 50.5856-78.4384 117.84704-78.4384 189.38368l0 88.64256L196.608 399.05792c-35.33824 0-64.09216 28.75392-64.09216 64.09728l0 454.18496c0 35.33824 28.75392 64.09216 64.09216 64.09216l391.6032 0c0.55808 0 1.13152-0.0256 1.68448-0.08192l235.80672 0c0.55296 0.05632 1.12128 0.08192 1.6896 0.08192 35.33312 0 64.09216-28.7488 64.09216-64.09216L891.48416 463.1552C891.47904 427.81696 862.73024 399.05792 827.392 399.05792L827.392 399.05792M285.30176 310.38976c0-61.51168 23.95136-119.33184 67.44064-162.816 43.48416-43.4944 101.30944-67.44576 162.816-67.44576 56.34048 0 110.57152 20.56704 152.68352 57.90208 41.472 36.77184 68.27008 87.02464 75.54048 141.63456l0 119.12192-458.48064 0.27648L285.30176 310.38976 285.30176 310.38976M853.90848 917.34016c0 13.95712-10.8288 25.42592-24.5248 26.4448l-0.14848 0L196.608 943.86176c-14.62272 0-26.52672-11.89376-26.52672-26.5216L170.08128 463.1552c0-14.62784 11.89888-26.53184 26.52672-26.53184l69.91872-0.03584c0.95744 0 1.8944-0.09728 2.81088-0.2304 1.00864 0.15872 2.03776 0.27648 3.09248 0.27648l354.5856 0c0.34304 0.00512 0.8704 0.01536 1.55648 0.01536 1.47968 0 3.7376-0.03584 6.6304-0.18432l125.3376 0c0.77824 0.09728 1.57184 0.15872 2.37056 0.15872L827.392 436.62336c14.6176 0 26.5216 11.90912 26.5216 26.53184L853.9136 917.34016 853.90848 917.34016M853.90848 917.34016 853.90848 917.34016z" fill="#262536" p-id="4620"></path></svg>
          </div>
        </div>
        <button type="submit" @click="login()" @mousedown.stop="playSoundEffect('confirm_1')">Log in</button>
        <span class="loginBordLevelTips" v-text="bordTipsText"/>
      </div>
    </div>
    <div v-if="isLogin" class="session"><!--已登录面板-->
      <div class="left">
        <svg @click="close()" @mousedown.stop="playSoundEffect('unconfirm_1')"  t="1674626678243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1474" width="200" height="200"><path d="M617.92 516.096l272 272L788.096 889.92l-272-272-272 272L142.24 788.096l272-272-275.008-275.04L241.056 139.2l275.04 275.04 275.04-275.04L892.96 241.024l-275.04 275.04z" p-id="1475" data-spm-anchor-id="a313x.7781069.0.i0" class="selected" fill="#ffffff"></path></svg>
      </div>
      <div class="log-in LoginPage">
        <h4>您已登录此 <span>OMS</span></h4>
        <p>不是我的账号？请输入您的账号以重新登录此 OMS</p>
        <div class="floating-label">
          <input @focus="onFocusMode()" @blur="noFocusMode()" placeholder="Email" type="email" name="email" id="email2" autocomplete="on" v-model:value="email">
          <label for="email2">Email:</label>
          <div class="icon">
            <svg t="1674466343070" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2744" width="200" height="200"><path d="M838.954667 234.666667H170.666667c-3.626667 0-7.168 0.448-10.56 1.322666l323.690666 323.669334a21.333333 21.333333 0 0 0 30.165334 0L838.954667 234.666667z m46.144 14.186666l-260.693334 260.693334 262.933334 262.912c5.44-7.168 8.661333-16.106667 8.661333-25.792V277.333333c0-10.944-4.117333-20.906667-10.88-28.48zM843.861333 789.333333l-249.6-249.621333-50.133333 50.133333a64 64 0 0 1-90.517333 0l-50.112-50.133333L156.373333 786.88c4.48 1.578667 9.28 2.453333 14.314667 2.453333h673.194667zM128.661333 754.218667L373.333333 509.525333 129.578667 265.813333A42.709333 42.709333 0 0 0 128 277.333333v469.333334c0 2.56 0.213333 5.098667 0.661333 7.552zM170.666667 192h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v469.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z" fill="#333333" p-id="2745"></path></svg>
          </div>
        </div>
        <div class="floating-label">
          <form><input @focus="onFocusMode()" @blur="noFocusMode()" placeholder="Password" type="password" name="password" id="password2" autocomplete="on" v-model:value="password"></form>
          <label for="password2">Password:</label>
          <div class="icon">
            <svg t="1674466579161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4618" width="200" height="200"><path d="M511.61088 557.78816c-45.73696 0-82.944 37.21216-82.944 82.94912 0 18.18112 5.77536 35.45088 16.72192 49.92512 0.22528 0.31232 0.48128 0.60416 0.73216 0.91136 20.49024 23.87968 21.98016 40.92416 22.07232 42.48576l0 47.37536c0 23.94624 19.4816 43.4176 43.4176 43.4176 23.94624 0 43.42272-19.48672 43.42272-43.4176l0-48.26624c0-0.54272-0.01536-1.09056-0.07168-1.62816 0-0.03584 0.10752-0.00512 0.11264-0.04608 0.11264-1.09056 0.48128-3.42016 1.59232-6.78912 2.23232-6.76864 7.47008-17.87392 19.79904-32.29184 0.1792-0.20992 0.35328-0.43008 0.52736-0.64 11.49952-14.69952 17.57696-32.34816 17.57696-51.03616C594.57024 595.00032 557.35808 557.78816 511.61088 557.78816L511.61088 557.78816M547.65056 668.35968c-28.99968 34.0736-30.41792 58.47552-30.14656 65.30048l0 47.77984c0 3.24608-2.64704 5.88288-5.89312 5.88288s-5.88288-2.64192-5.88288-5.88288l0-47.60576c0-3.50208-0.96256-31.30368-30.70464-66.21184-5.77536-7.82336-8.82688-17.10592-8.82688-26.88512 0-25.04704 20.37248-45.42464 45.4144-45.42464 25.04704 0 45.42976 20.3776 45.42976 45.42464C557.04064 650.83904 553.79456 660.38272 547.65056 668.35968L547.65056 668.35968M547.65056 668.35968 547.65056 668.35968z" fill="#262536" p-id="4619"></path><path d="M827.392 399.05792l-2.36032 0 0-0.27648-43.6736 0L781.35808 278.4512c0-0.7936-0.05632-1.59232-0.14848-2.39104-8.20736-64.08192-39.47008-123.07456-88.03328-166.13888-48.99328-43.43296-112.08192-67.3536-177.60768-67.3536-71.54176 0-138.79808 27.85792-189.3888 78.4384-50.5856 50.5856-78.4384 117.84704-78.4384 189.38368l0 88.64256L196.608 399.05792c-35.33824 0-64.09216 28.75392-64.09216 64.09728l0 454.18496c0 35.33824 28.75392 64.09216 64.09216 64.09216l391.6032 0c0.55808 0 1.13152-0.0256 1.68448-0.08192l235.80672 0c0.55296 0.05632 1.12128 0.08192 1.6896 0.08192 35.33312 0 64.09216-28.7488 64.09216-64.09216L891.48416 463.1552C891.47904 427.81696 862.73024 399.05792 827.392 399.05792L827.392 399.05792M285.30176 310.38976c0-61.51168 23.95136-119.33184 67.44064-162.816 43.48416-43.4944 101.30944-67.44576 162.816-67.44576 56.34048 0 110.57152 20.56704 152.68352 57.90208 41.472 36.77184 68.27008 87.02464 75.54048 141.63456l0 119.12192-458.48064 0.27648L285.30176 310.38976 285.30176 310.38976M853.90848 917.34016c0 13.95712-10.8288 25.42592-24.5248 26.4448l-0.14848 0L196.608 943.86176c-14.62272 0-26.52672-11.89376-26.52672-26.5216L170.08128 463.1552c0-14.62784 11.89888-26.53184 26.52672-26.53184l69.91872-0.03584c0.95744 0 1.8944-0.09728 2.81088-0.2304 1.00864 0.15872 2.03776 0.27648 3.09248 0.27648l354.5856 0c0.34304 0.00512 0.8704 0.01536 1.55648 0.01536 1.47968 0 3.7376-0.03584 6.6304-0.18432l125.3376 0c0.77824 0.09728 1.57184 0.15872 2.37056 0.15872L827.392 436.62336c14.6176 0 26.5216 11.90912 26.5216 26.53184L853.9136 917.34016 853.90848 917.34016M853.90848 917.34016 853.90848 917.34016z" fill="#262536" p-id="4620"></path></svg>
          </div>
        </div>
        <div class="loginAndLogoutBut">
          <button type="submit" @click="logout()" @mousedown.stop="playSoundEffect('unconfirm_1')">Log out</button>
          <button type="submit" @click="login()" @mousedown.stop="playSoundEffect('confirm_1')">Log in</button>
        </div>
        <span class="loginBordLevelTips" v-text="bordTipsText"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {JSEncrypt} from "jsencrypt";

export default {
  name: "BananaLoginBoard",
  data(){
    return {
      email:'',//仅用于登录，并不是用户的名称
      saveEmail:'',//仅用于登录，并不是用户的名称
      password:'',//仅用于登录，并不是用户的名称
      savePassword:'',//仅用于登录，并不是用户的名称
      bordTipsText:'您只能输入数字、字母、下划线、减号、点号和@',
      em:null,//自动登录的账号
      pd:null,//自动登录的密码
      automaticLoginCount:0,//自动登录次数
    }
  },
  mounted() {
    this.startSetting();
  },
  props:{
    serverKey:{
      type:String,
      required:true
    }
  },
  methods:{
    startSetting(){//初始化
      let em=false;//邮箱
      let pd=false;//密码
      let Ser=this.$root.general_script.handleLocalStorage('get','servers');//获取服务器配置
      let Acc=this.$root.general_script.handleLocalStorage('get','accounts');
      let DAL=this.$store.state.userSettingConfig.defaultAccountLogin;
      let getDA=this.getDefaultAccount();
      if(DAL===true && getDA!==false){//若设置了使用默认账号登录并且存在默认账号则使用默认账号登录
        em=getDA.A;
        pd=getDA.P;
      }
      else{
        if(Ser!==false && Acc!==false){
          Ser=JSON.parse(Ser);
          Acc=JSON.parse(Acc);
          for(let key in Ser){//查找与该key相同的服务器
            if(Ser[key].serverKey===this.serverKey){
              if(Ser[key].hasOwnProperty('account')){
                em=Ser[key].account;//获取账号名
                break;
              }
            }
          }
          if(em!==false){
            if(Object.prototype.toString.call(Acc) === '[object Object]'){
              if(Acc.hasOwnProperty(em)){
                pd=Acc[em].P;//获取密码
              }
            }
          }
        }
        else {
          em=false;
          pd=false;
        }
      }
      if(em!==false && pd!==false){
        this.em=em;
        this.pd=pd;
      }
    },
    playSoundEffect(name){
      this.$store.commit('setCoEffectsSound',name);
    },
    anyLogin(){
      let name=this.$refs.anonymousTp.value.replace(/[\n\r\s]+/g, '');
      if(name==='' || name===null){
        this.$store.commit('setCoLogMessage',{text:'名称不能为空！',from:'internal:BananaLoginBoard',type:'tip'});
        return false;
      }
      if(this.$store.state.serverData.socket){
        this.$store.state.serverData.socket.anonymousLogin(name);
      }else {
        return false;
      }
    },
    autoLoginServer(em,pd){//尝试进行登录
      try {
        if(this.$store.state.serverData.socket.isLink){
          setTimeout(()=>{
            let encrypt=new JSEncrypt();//加密
            encrypt.setPublicKey(this.$store.state.serverData.socket.publickey);
            if(this.$store.state.serverData.socket.publickey===''){
              this.$store.commit('setCoLogMessage',{text:'获取公钥失败，请尝试刷新浏览器',from:'internal:BananaLoginBoard',type:'tip'});
              return false;
            }
            let newPwd=encrypt.encrypt(pd);
            this.$store.state.serverData.socket.login(em,newPwd);
          },100)
        }else {
          this.$store.commit('setCoLogMessage',{text:'自动登录失败，请点击右上角头像手动登录',from:'internal:BananaLoginBoard',type:'tip'});
        }
      }catch (e){

      }
    },
    getDefaultAccount(){//获取默认账号，失败则返回false
      let accountsConfig=undefined;
      let ref=false;
      accountsConfig=JSON.parse(this.$root.general_script.handleLocalStorage('get','accounts'));
      if (Object.prototype.toString.call(accountsConfig)==='[object Object]'){
        for(let key in accountsConfig){
          if(accountsConfig[key].default===true){
            ref=accountsConfig[key];
            break;
          }
        }
      }
      return ref;
    },
    login(){//登录中
      if(this.$store.state.serverData.socket===undefined){//检查是否存在连接
        return false;
      }
      if(this.$store.state.serverData.socket.isLink){//检查是否已连接服务器
        setTimeout(()=>{
          let encrypt=new JSEncrypt();//加密
          encrypt.setPublicKey(this.$store.state.serverData.socket.publickey);//设置公钥
          let newPwd=encrypt.encrypt(this.password);//加密后的密码
          this.savePassword=this.password;//保存在本地
          this.saveEmail=this.email;//保存账号名
          this.$store.state.serverData.socket.login(this.email,newPwd);//尝试进行登录
        },60);
      }else {
        this.$store.commit('setCoLogMessage',{text:'服务器已断开连接，请刷新后登录',from:'internal:BananaLoginBoard',type:'tip'});
      }
    },
    loginEd(){//登录成功后
      this.$store.state.serverData.socket.getUserData();
      this.$store.state.serverData.socket.getMapData();
      this.$store.state.serverData.socket.getActiveData();
      this.$store.commit('setCoLogMessage',{text:'登录成功',from:'internal:BananaLoginBoard',type:'tip'});
    },
    logout(){//注销账号
      try {
        this.$store.state.serverData.socket.clearLocalData();//清除会话内的本地数据
        this.$store.state.serverData.socket.closeLink();//断开服务器连接
        this.$store.state.serverData.socket.link();//重新连接服务器
      }catch (e) {

      }
    },
    loginFail(){//连接失败
      this.$store.commit('setCoLogMessage',{text:'登录失效，或账号密码错误',from:'internal:BananaLoginBoard',type:'tip'});
      this.logout();
    },
    closeLink(){//关闭连接
      this.$store.state.serverData.socket.closeLink();
    },
    close(){//关闭面板
      this.$parent.isOpenBord=false;
      this.password='';
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
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
    }
  },
  computed:{
    anonymousLogin(){
      if(this.$store.state.serverData.socket){
        if(this.$store.state.serverData.socket.config.hasOwnProperty('anonymous_login')){
          return this.$store.state.serverData.socket.config.anonymous_login;
        }else {
          return false;
        }
      }else {
        return false;
      }
    },
    numberOfLoginAttempts(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.numberOfLoginAttempts;
      }else {
        return null;
      }
    },
    numberOfLoginFailed(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.numberOfLoginFailed;
      }else {
        return null;
      }
    },
    isLogin(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.isLogin;
      }else {
        return null;
      }
    },
    isLink(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.isLink;
      }else {
        return null;
      }
    }
  },
  watch:{
    isLink:{
      handler(newValue){
        if(newValue){
          if(this.automaticLoginCount===0){
            this.autoLoginServer(this.em,this.pd);
            this.automaticLoginCount+=1;
          }
        }
      }
    },
    numberOfLoginAttempts:{
      handler(newValue,oldValue){
        if(oldValue!==null){
          if(this.isLogin===true){//连接登录成功
            this.loginEd();
          }else {
            this.loginFail();
          }
        }
      }
    },
    numberOfLoginFailed:{
      handler(newValue,oldValue){
        if(oldValue!==null){
          if(this.isLogin===true){//连接登录成功
            this.loginEd();
          }else {//登录失败
            this.loginFail();
          }
        }
      }
    }
  }
}
</script>

<style scoped>
@keyframes Rising {
  from{
    top: 0px;
  }
  to{
    top: -100px;
  }
}
.anonymousAt{
  font-size: 18px;
  font-weight: 400;
}
.anonymousTp{
  min-width: 180px;
  max-width: 220px;
  height: 40px;
  font-size: 18px;
  font-weight: 400;
  border-bottom: 2px solid #a1a1a1;
  padding: 0px 4px;
}
.buttonMini{
  width: 100px;
  height: 40px;
  font-size: 18px;
  padding: 0px;
  margin: 0px;
}
.anonymousInput{
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.anonymousHead{
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.anonymousBox{
  width: 560px;
  background: #ffffff;
  height: 110px;
  font-weight: 800;
  font-size: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  position: absolute;
  left:20px;
  top:-100px;
  z-index: 549;
  -webkit-box-shadow: 0 2px 6px 3px rgba(0,0,0,.12);
  box-shadow: 0 2px 6px 3px rgba(0,0,0,.12);
  animation: Rising 1s forwards;
}
.BananaLoginBoardBox{
  width: 600px;
  height: auto;
  background: white;
  position: relative;
  top: 0px;
  left: 0px;
  border-radius: 5px;
  box-shadow: 0 2px 6px 3px rgba(0,0,0,.12);
  z-index: 549;
}
.BananaLoginBoard{
  position: fixed;
  width: 600px;
  height: auto;
  top: calc(50% - 220px);
  left: calc(50% - 300px);
  font-family: -apple-system,BlinkMacSystemFont,San Francisco,Helvetica,Arial,sans-serif;
  font-weight: 300;
  margin: 0;
}
.session{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  width: auto;
  height: auto;
  margin: auto;
  background: #fff;
  overflow: hidden;
  border-radius: 5px;
  -webkit-box-shadow: 0 2px 6px 3px rgba(0,0,0,.12);
  box-shadow: 0 2px 6px 3px rgba(0,0,0,.12);
  position: absolute;
  z-index: 550;
}
.left{
  width: 220px;
  height: auto;
  min-height: 100%;
  position: relative;
  background-image: url("/static/logBordBj.jpg");
  background-size: cover;
  z-index: 550;
}
.LoginPage{
  padding: 40px 30px 0;
  background: #fefefe;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  width: 320px;
  z-index: 550;
}
.left svg{
  height: 40px;
  width: auto;
  margin: 20px;
}
.LoginPage h4{
  margin-bottom: 20px;
  color: rgba(0,0,0,.5);
}
h4{
  font-size: 24px;
  font-weight: 600;
  color: #000;
  opacity: .85;
}
.LoginPage h4 span{
  color: #000;
  font-weight: 700;
}
.LoginPage p{
  line-height: 155%;
  font-size: 14px;
  color: #000;
  opacity: .65;
  font-weight: 400;
  max-width: 200px;
  margin-bottom: 40px;
}
.floating-label{
  position: relative;
  margin-bottom: 10px;
  width: 100%;
}
.floating-label input{
  width: calc(100% - 44px);
  margin-left: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
input{
  font-size: 16px;
  padding: 20px 0;
  height: 56px;
  border: none;
  border-bottom: 1px solid rgba(0,0,0,.1);
  background: #fff;
  width: 280px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all .3s linear;
  transition: all .3s linear;
  color: #000;
  font-weight: 400;
  -webkit-appearance: none;
  outline: none;
}
.floating-label label{
  position: absolute;
  top: calc(50% - 7px);
  left: 0;
  opacity: 0;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  padding-left: 44px;
}
label{
  font-size: 12px;
  color: #000;
  opacity: .8;
  font-weight: 400;
}
.floating-label .icon{
  position: absolute;
  top: 0;
  left: 0;
  height: 56px;
  width: 44px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.floating-label .icon svg, .floating-label .icon svg path{
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
}
.floating-label .icon svg{
  height: 45px;
  width: 45px;
  margin: auto;
  opacity: .15;
}
.floating-label .icon{
  position: absolute;
  top: 0;
  left: 0;
  height: 56px;
  width: 44px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.loginAndLogoutBut{
  width: 322px;
  height: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
button{
  -webkit-appearance: none;
  width: auto;
  min-width: 100px;
  border-radius: 24px;
  text-align: center;
  padding: 15px 40px;
  margin-top: 5px;
  background-color: #7dc5ff;
  color: #fff;
  font-size: 14px;
  margin-left: auto;
  font-weight: 500;
  -webkit-box-shadow: 0 2px 6px -1px rgba(0,0,0,.13);
  box-shadow: 0 2px 6px -1px rgba(0,0,0,.13);
  border: none;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  outline: 0;
}
.loginBordLevelTips{
  width: 320px;
  height: 30px;
  font-size: 12px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: right;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
