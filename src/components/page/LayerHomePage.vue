<template>
  <div class="homePageLayer">
    <h3>输入您要连接的在线地图服务器地址</h3>
    <div>
      <input placeholder="wss://map.atsw.top" v-model:value="serverAddress"/>
      <button @click="CallBack">连接！</button>
    </div>
    <div>
      <span style="font-weight: 100;font-size: 10px">默认连接</span>
      <label class="checkbox-label" @click="defaultLogin">
        <input type="checkbox" class="checkbox-input">
        <span class="checkbox-icon"></span>
      </label>
    </div>


  </div>
</template>

<script>
export default {
  name: "LayerHomePage",
  data(){
    return {
      serverAddress:'wss://map.atsw.top:9998'
    }
  },
  methods:{
    CallBack(){
      this.$emit('pageLayerHomePageCall',this.serverAddress)
    },
    defaultLogin(){
      this.$emit('pageLayerHomePageCallDefault',this.serverAddress)
    }
  }
}
</script>

<style scoped>
.homePageLayer{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
input{
  padding: 2px 8px;
  width: 160px;
}
/* 勾选按钮样式 */
.checkbox-label {
  position: relative;
  padding-left: 30px;
  font-size: 16px;
  cursor: pointer;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-icon {
  position: absolute;
  top: 5px;
  left: 5px;
  height: 15px;
  width: 15px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.checkbox-icon:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 3px;
  width: 4px;
  height: 6px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:checked ~ .checkbox-icon {
  background-color: #2196F3;
  border-color: #2196F3;
}

.checkbox-input:checked ~ .checkbox-icon:after {
  display: block;
}

</style>
