<template>
  <!--用来登录、注册、切换账号的-->
<div class="loginBordLevel">
  <!--登录面板-->
  <div v-if="!isLogin" class="session">
    <div class="left">
      <svg @click="close()" t="1674626678243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1474" width="200" height="200"><path d="M617.92 516.096l272 272L788.096 889.92l-272-272-272 272L142.24 788.096l272-272-275.008-275.04L241.056 139.2l275.04 275.04 275.04-275.04L892.96 241.024l-275.04 275.04z" p-id="1475" data-spm-anchor-id="a313x.7781069.0.i0" class="selected" fill="#ffffff"></path></svg>
    </div>
    <div class="log-in" id="LinkPage">
      <h4>登录至 <span>Map.ATSW</span></h4>
      <p>欢迎回来，请输入您的账号以登录至 Map.ATSW</p>
      <div class="floating-label">
        <input placeholder="Email" type="email" name="email" id="email" autocomplete="off" v-model:value="email">
        <label for="email">Email:</label>
        <div class="icon">
          <svg t="1674466343070" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2744" width="200" height="200"><path d="M838.954667 234.666667H170.666667c-3.626667 0-7.168 0.448-10.56 1.322666l323.690666 323.669334a21.333333 21.333333 0 0 0 30.165334 0L838.954667 234.666667z m46.144 14.186666l-260.693334 260.693334 262.933334 262.912c5.44-7.168 8.661333-16.106667 8.661333-25.792V277.333333c0-10.944-4.117333-20.906667-10.88-28.48zM843.861333 789.333333l-249.6-249.621333-50.133333 50.133333a64 64 0 0 1-90.517333 0l-50.112-50.133333L156.373333 786.88c4.48 1.578667 9.28 2.453333 14.314667 2.453333h673.194667zM128.661333 754.218667L373.333333 509.525333 129.578667 265.813333A42.709333 42.709333 0 0 0 128 277.333333v469.333334c0 2.56 0.213333 5.098667 0.661333 7.552zM170.666667 192h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v469.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z" fill="#333333" p-id="2745"></path></svg>
        </div>
      </div>
      <div class="floating-label">
        <input placeholder="Password" type="password" name="password" id="password" autocomplete="off" v-model:value="password">
        <label for="password">Password:</label>
        <div class="icon">
          <svg t="1674466579161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4618" width="200" height="200"><path d="M511.61088 557.78816c-45.73696 0-82.944 37.21216-82.944 82.94912 0 18.18112 5.77536 35.45088 16.72192 49.92512 0.22528 0.31232 0.48128 0.60416 0.73216 0.91136 20.49024 23.87968 21.98016 40.92416 22.07232 42.48576l0 47.37536c0 23.94624 19.4816 43.4176 43.4176 43.4176 23.94624 0 43.42272-19.48672 43.42272-43.4176l0-48.26624c0-0.54272-0.01536-1.09056-0.07168-1.62816 0-0.03584 0.10752-0.00512 0.11264-0.04608 0.11264-1.09056 0.48128-3.42016 1.59232-6.78912 2.23232-6.76864 7.47008-17.87392 19.79904-32.29184 0.1792-0.20992 0.35328-0.43008 0.52736-0.64 11.49952-14.69952 17.57696-32.34816 17.57696-51.03616C594.57024 595.00032 557.35808 557.78816 511.61088 557.78816L511.61088 557.78816M547.65056 668.35968c-28.99968 34.0736-30.41792 58.47552-30.14656 65.30048l0 47.77984c0 3.24608-2.64704 5.88288-5.89312 5.88288s-5.88288-2.64192-5.88288-5.88288l0-47.60576c0-3.50208-0.96256-31.30368-30.70464-66.21184-5.77536-7.82336-8.82688-17.10592-8.82688-26.88512 0-25.04704 20.37248-45.42464 45.4144-45.42464 25.04704 0 45.42976 20.3776 45.42976 45.42464C557.04064 650.83904 553.79456 660.38272 547.65056 668.35968L547.65056 668.35968M547.65056 668.35968 547.65056 668.35968z" fill="#262536" p-id="4619"></path><path d="M827.392 399.05792l-2.36032 0 0-0.27648-43.6736 0L781.35808 278.4512c0-0.7936-0.05632-1.59232-0.14848-2.39104-8.20736-64.08192-39.47008-123.07456-88.03328-166.13888-48.99328-43.43296-112.08192-67.3536-177.60768-67.3536-71.54176 0-138.79808 27.85792-189.3888 78.4384-50.5856 50.5856-78.4384 117.84704-78.4384 189.38368l0 88.64256L196.608 399.05792c-35.33824 0-64.09216 28.75392-64.09216 64.09728l0 454.18496c0 35.33824 28.75392 64.09216 64.09216 64.09216l391.6032 0c0.55808 0 1.13152-0.0256 1.68448-0.08192l235.80672 0c0.55296 0.05632 1.12128 0.08192 1.6896 0.08192 35.33312 0 64.09216-28.7488 64.09216-64.09216L891.48416 463.1552C891.47904 427.81696 862.73024 399.05792 827.392 399.05792L827.392 399.05792M285.30176 310.38976c0-61.51168 23.95136-119.33184 67.44064-162.816 43.48416-43.4944 101.30944-67.44576 162.816-67.44576 56.34048 0 110.57152 20.56704 152.68352 57.90208 41.472 36.77184 68.27008 87.02464 75.54048 141.63456l0 119.12192-458.48064 0.27648L285.30176 310.38976 285.30176 310.38976M853.90848 917.34016c0 13.95712-10.8288 25.42592-24.5248 26.4448l-0.14848 0L196.608 943.86176c-14.62272 0-26.52672-11.89376-26.52672-26.5216L170.08128 463.1552c0-14.62784 11.89888-26.53184 26.52672-26.53184l69.91872-0.03584c0.95744 0 1.8944-0.09728 2.81088-0.2304 1.00864 0.15872 2.03776 0.27648 3.09248 0.27648l354.5856 0c0.34304 0.00512 0.8704 0.01536 1.55648 0.01536 1.47968 0 3.7376-0.03584 6.6304-0.18432l125.3376 0c0.77824 0.09728 1.57184 0.15872 2.37056 0.15872L827.392 436.62336c14.6176 0 26.5216 11.90912 26.5216 26.53184L853.9136 917.34016 853.90848 917.34016M853.90848 917.34016 853.90848 917.34016z" fill="#262536" p-id="4620"></path></svg>
        </div>
      </div>
      <button type="submit" @click="login()">Log in</button>
      <span class="loginBordLevelTips" v-text="bordTipsText"></span>
    </div>
  </div>
  <!--已登录面板-->
  <div v-if="isLogin" class="session">
    <div class="left">
      <svg @click="close()" t="1674626678243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1474" width="200" height="200"><path d="M617.92 516.096l272 272L788.096 889.92l-272-272-272 272L142.24 788.096l272-272-275.008-275.04L241.056 139.2l275.04 275.04 275.04-275.04L892.96 241.024l-275.04 275.04z" p-id="1475" data-spm-anchor-id="a313x.7781069.0.i0" class="selected" fill="#ffffff"></path></svg>
    </div>
    <div class="log-in" id="LinkPage">
      <h4>您已登录至 <span>Map.ATSW</span></h4>
      <p>不是我的账号？请输入您的账号以重新登录 Map.ATSW</p>
      <div class="floating-label">
        <input placeholder="Email" type="email" name="email" id="email" autocomplete="off" v-model:value="email">
        <label for="email">Email:</label>
        <div class="icon">
          <svg t="1674466343070" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2744" width="200" height="200"><path d="M838.954667 234.666667H170.666667c-3.626667 0-7.168 0.448-10.56 1.322666l323.690666 323.669334a21.333333 21.333333 0 0 0 30.165334 0L838.954667 234.666667z m46.144 14.186666l-260.693334 260.693334 262.933334 262.912c5.44-7.168 8.661333-16.106667 8.661333-25.792V277.333333c0-10.944-4.117333-20.906667-10.88-28.48zM843.861333 789.333333l-249.6-249.621333-50.133333 50.133333a64 64 0 0 1-90.517333 0l-50.112-50.133333L156.373333 786.88c4.48 1.578667 9.28 2.453333 14.314667 2.453333h673.194667zM128.661333 754.218667L373.333333 509.525333 129.578667 265.813333A42.709333 42.709333 0 0 0 128 277.333333v469.333334c0 2.56 0.213333 5.098667 0.661333 7.552zM170.666667 192h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333333v469.333334a85.333333 85.333333 0 0 1-85.333334 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333334-85.333333z" fill="#333333" p-id="2745"></path></svg>
        </div>
      </div>
      <div class="floating-label">
        <input placeholder="Password" type="password" name="password" id="password" autocomplete="off" v-model:value="password">
        <label for="password">Password:</label>
        <div class="icon">
          <svg t="1674466579161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4618" width="200" height="200"><path d="M511.61088 557.78816c-45.73696 0-82.944 37.21216-82.944 82.94912 0 18.18112 5.77536 35.45088 16.72192 49.92512 0.22528 0.31232 0.48128 0.60416 0.73216 0.91136 20.49024 23.87968 21.98016 40.92416 22.07232 42.48576l0 47.37536c0 23.94624 19.4816 43.4176 43.4176 43.4176 23.94624 0 43.42272-19.48672 43.42272-43.4176l0-48.26624c0-0.54272-0.01536-1.09056-0.07168-1.62816 0-0.03584 0.10752-0.00512 0.11264-0.04608 0.11264-1.09056 0.48128-3.42016 1.59232-6.78912 2.23232-6.76864 7.47008-17.87392 19.79904-32.29184 0.1792-0.20992 0.35328-0.43008 0.52736-0.64 11.49952-14.69952 17.57696-32.34816 17.57696-51.03616C594.57024 595.00032 557.35808 557.78816 511.61088 557.78816L511.61088 557.78816M547.65056 668.35968c-28.99968 34.0736-30.41792 58.47552-30.14656 65.30048l0 47.77984c0 3.24608-2.64704 5.88288-5.89312 5.88288s-5.88288-2.64192-5.88288-5.88288l0-47.60576c0-3.50208-0.96256-31.30368-30.70464-66.21184-5.77536-7.82336-8.82688-17.10592-8.82688-26.88512 0-25.04704 20.37248-45.42464 45.4144-45.42464 25.04704 0 45.42976 20.3776 45.42976 45.42464C557.04064 650.83904 553.79456 660.38272 547.65056 668.35968L547.65056 668.35968M547.65056 668.35968 547.65056 668.35968z" fill="#262536" p-id="4619"></path><path d="M827.392 399.05792l-2.36032 0 0-0.27648-43.6736 0L781.35808 278.4512c0-0.7936-0.05632-1.59232-0.14848-2.39104-8.20736-64.08192-39.47008-123.07456-88.03328-166.13888-48.99328-43.43296-112.08192-67.3536-177.60768-67.3536-71.54176 0-138.79808 27.85792-189.3888 78.4384-50.5856 50.5856-78.4384 117.84704-78.4384 189.38368l0 88.64256L196.608 399.05792c-35.33824 0-64.09216 28.75392-64.09216 64.09728l0 454.18496c0 35.33824 28.75392 64.09216 64.09216 64.09216l391.6032 0c0.55808 0 1.13152-0.0256 1.68448-0.08192l235.80672 0c0.55296 0.05632 1.12128 0.08192 1.6896 0.08192 35.33312 0 64.09216-28.7488 64.09216-64.09216L891.48416 463.1552C891.47904 427.81696 862.73024 399.05792 827.392 399.05792L827.392 399.05792M285.30176 310.38976c0-61.51168 23.95136-119.33184 67.44064-162.816 43.48416-43.4944 101.30944-67.44576 162.816-67.44576 56.34048 0 110.57152 20.56704 152.68352 57.90208 41.472 36.77184 68.27008 87.02464 75.54048 141.63456l0 119.12192-458.48064 0.27648L285.30176 310.38976 285.30176 310.38976M853.90848 917.34016c0 13.95712-10.8288 25.42592-24.5248 26.4448l-0.14848 0L196.608 943.86176c-14.62272 0-26.52672-11.89376-26.52672-26.5216L170.08128 463.1552c0-14.62784 11.89888-26.53184 26.52672-26.53184l69.91872-0.03584c0.95744 0 1.8944-0.09728 2.81088-0.2304 1.00864 0.15872 2.03776 0.27648 3.09248 0.27648l354.5856 0c0.34304 0.00512 0.8704 0.01536 1.55648 0.01536 1.47968 0 3.7376-0.03584 6.6304-0.18432l125.3376 0c0.77824 0.09728 1.57184 0.15872 2.37056 0.15872L827.392 436.62336c14.6176 0 26.5216 11.90912 26.5216 26.53184L853.9136 917.34016 853.90848 917.34016M853.90848 917.34016 853.90848 917.34016z" fill="#262536" p-id="4620"></path></svg>
        </div>
      </div>
      <div class="loginAndLogoutBut">
        <button type="submit" @click="logout()">Log out</button>
        <button type="submit" @click="login()">Log in</button>
      </div>
      <span class="loginBordLevelTips" v-text="bordTipsText"></span>
    </div>
  </div>
</div>
</template>

<script>
import {JSEncrypt} from "jsencrypt";

export default {
  name: "loginBordLevel",
  data(){
    return {
      email:'',//仅用于登录，并不是用户的名称
      saveEmail:'',//仅用于登录，并不是用户的名称
      password:'',//仅用于登录，并不是用户的名称
      savePassword:'',//仅用于登录，并不是用户的名称
      bordTipsText:'您只能输入数字、字母、下划线、@ . -'
    }
  },
  mounted() {
    this.startSetting();
  },
  methods:{
    //初始化
    startSetting(){
      //1.查询本地账号
      let em=this.handleLocalStorage('get','saveEmail');
      let pd=this.handleLocalStorage('get','savePassword');
      if(em!==false && pd!==false){
        //2.尝试进行登录
        setTimeout(()=>{
          try {
            if(this.$store.state.serverData.socket.isLink){
              //2.获取公钥
              this.$store.state.serverData.socket.getServerPublickey();
              //3.稍等一会
              setTimeout(()=>{
                //4.加密一下两个参数
                let encrypt=new JSEncrypt();
                //5.设置公钥
                encrypt.setPublicKey(this.$store.state.serverData.socket.publickey);
                //6.加密密码
                let newPwd=encrypt.encrypt(pd);
                //7.尝试进行登录
                this.$store.state.serverData.socket.login(em,newPwd);
              },60)
            }else {
              this.$root.general_script.alert_tips('自动登录失败');
            }
          }catch (e){

          }
        },100)
      }
    },
    //登录中
    login(){
      //0.检查是否存在连接
      if(this.$store.state.serverData.socket===undefined){
        return false;
      }
      //1.检查是否已连接服务器
      if(this.$store.state.serverData.socket.isLink){
        //2.获取公钥
        this.$store.state.serverData.socket.getServerPublickey();
        //3.稍等一会
        setTimeout(()=>{
          //4.加密一下两个参数
          let encrypt=new JSEncrypt();
          //5.设置公钥
          encrypt.setPublicKey(this.$store.state.serverData.socket.publickey);
          //6.加密密码
          let newPwd=encrypt.encrypt(this.password);
          //7.保存在本地
          this.savePassword=this.password;
          //8.保存账号名
          this.saveEmail=this.email;
          //9.尝试进行登录
          this.$store.state.serverData.socket.login(this.email,newPwd);
        },60)
      }else {
        this.$root.general_script.alert_tips('无法连接服务器，请检查网络连接');
      }
    },
    //登录成功后
    loginEd(){
      //1.保存账号及密码在localStage
      if(this.saveEmail!==''){
        this.handleLocalStorage('set','saveEmail',this.saveEmail);
        this.handleLocalStorage('set','savePassword',this.savePassword);
      }
      this.$store.state.serverData.socket.getUserData();
      this.$store.state.serverData.socket.getMapData();
      this.$root.general_script.alert_tips('登录成功');
    },
    //注销账号
    logout(){
      //0.清楚本地账号
      this.handleLocalStorage('remove','saveEmail');
      this.handleLocalStorage('remove','savePassword');
      //1.清除会话内的本地数据
      this.$store.state.serverData.socket.clearLocalData();
      //2.断开服务器连接
      this.$store.state.serverData.socket.closeLink();
      //3.重新连接服务器
      this.$store.state.serverData.socket.link();
    },
    //连接失败
    loginFail(){
      this.$root.general_script.alert_tips('登录失败，账号或密码错误')
      this.logout();
    },
    //关闭连接-注意并非注销账号
    closeLink(){
      this.$store.state.serverData.socket.closeLink();
    },
    //关闭面板
    close(){
      this.$parent.isOpenBord=false;
      this.password='';
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
    }
  },
  computed:{
    numberOfLoginAttempts(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.numberOfLoginAttempts;
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
    }
  },
  watch:{
    numberOfLoginAttempts:{
      handler(newValue,oldValue){
        if(oldValue!==null){
          if(this.isLogin===true){//表示连接登录成功
            this.loginEd();
          }else {//表示登录失败，或切换账号失败，将会注销当前账号
            this.loginFail();
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.loginAndLogoutBut{
  width: 322px;
  height: auto;
  display: flex;
  justify-content: center;
}
.loginBordLevelTips{
  width: 320px;
  height: 30px;
  font-size: 12px;
  display: flex;
  justify-content: right;
  align-items: center;
}
.loginBordLevel{
  position: fixed;
  width: 600px;height: auto;
  top:calc(50% - 220px);
  left:calc(50% - 300px);
}
* {
  font-family: -apple-system, BlinkMacSystemFont, "San Francisco", Helvetica,
  Arial, sans-serif;
  font-weight: 300;
  margin: 0;
}
$primary: #87c4f5;
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background: #f3f2f2;
}
h4 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  opacity: 0.85;
}
label {
  font-size: 12.5px;
  color: #000;
  opacity: 0.8;
  font-weight: 400;
}
#LinkPage {
  padding: 40px 30px 0px 30px;
  background: #fefefe;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 320px;
h4 {
  margin-bottom: 20px;
  color: rgba(#000, 0.5);
span {
  color: rgba(#000, 1);
  font-weight: 700;
}
}
p {
  line-height: 155%;
  margin-bottom: 5px;
  font-size: 14px;
  color: #000;
  opacity: 0.65;
  font-weight: 400;
  max-width: 200px;
  margin-bottom: 40px;
}
}
a.discrete {
  color: rgba(#000, 0.4);
  font-size: 14px;
  border-bottom: solid 1px rgba(#000, 0);
  padding-bottom: 4px;
  margin-left: auto;
  font-weight: 300;
  transition: all 0.3s ease;
  margin-top: 40px;
&:hover {
   border-bottom: solid 1px rgba(#000, 0.2);
 }
}
button {
  -webkit-appearance: none;
  width: auto;
  min-width: 100px;
  border-radius: 24px;
  text-align: center;
  padding: 15px 40px;
  margin-top: 5px;
  background-color: saturate($primary, 30%);
  color: #fff;
  font-size: 14px;
  margin-left: auto;
  font-weight: 500;
  box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.13);
  border: none;
  transition: all 0.3s ease;
  outline: 0;
&:hover {
   transform: translateY(-3px);
   box-shadow: 0 2px 6px -1px rgba($primary, 0.65);
&:active {
   transform: scale(0.99);
 }
}
}
input {
  font-size: 16px;
  padding: 20px 0px;
  height: 56px;
  border: none;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  background: #fff;
  width: 280px;
  box-sizing: border-box;
  transition: all 0.3s linear;
  color: #000;
  font-weight: 400;
  -webkit-appearance: none;
&:focus {
   border-bottom: solid 1px $primary;
   outline: 0;
   box-shadow: 0 2px 6px -8px rgba($primary, 0.45);
 }
}
.floating-label {
  position: relative;
  margin-bottom: 10px;
  width: 100%;
label {
  position: absolute;
  top: calc(50% - 7px);
  left: 0;
  opacity: 0;
  transition: all 0.3s ease;
  padding-left: 44px;
}
input {
  width: calc(100% - 44px);
  margin-left: auto;
  display: flex;
}
.icon {
  position: absolute;
  top: 0;
  left: 0;
  height: 56px;
  width: 44px;
  display: flex;
svg {
  height: 45px;
  width: 45px;
  margin: auto;
  opacity: 0.15;
  transition: all 0.3s ease;
path {
  transition: all 0.3s ease;
}
}
}
input:not(:placeholder-shown) {
  padding: 28px 0px 12px 0px;
}
input:not(:placeholder-shown) + label {
  transform: translateY(-10px);
  opacity: 0.7;
}
input:valid:not(:placeholder-shown) + label + .icon {
svg {
  opacity: 1;
path {
  fill: $primary;
}
}
}
input:not(:valid):not(:focus) + label + .icon {
  animation-name: shake-shake;
  animation-duration: 0.3s;
}
}
$displacement: 3px;
@keyframes shake-shake {
  0% {
    transform: translateX(-$displacement);
  }
  20% {
    transform: translateX($displacement);
  }
  40% {
    transform: translateX(-$displacement);
  }
  60% {
    transform: translateX($displacement);
  }
  80% {
    transform: translateX(-$displacement);
  }
  100% {
    transform: translateX(0px);
  }
}
.session {
  display: flex;
  flex-direction: row;
  width: auto;
  height: auto;
  margin: auto auto;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 6px 3px rgba(0, 0, 0, 0.12);
}
.left {
  width: 220px;
  height: auto;
  min-height: 100%;
  position: relative;
  background-image: url("../../static/logBordBj.jpg");
  background-size: cover;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
svg {
  height: 40px;
  width: auto;
  margin: 20px;
}
}

</style>
