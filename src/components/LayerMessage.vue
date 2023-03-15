<template>
<!--
职责：显示广播消息
权限：允许访问$store.state.serverData
-->
  <div class="messageLayer">
    消&nbsp;息&nbsp;层
    <!--消息分类进行显示，带有下拉选项-->
    <!--悬浮球-->
    <div class="">

    </div>
    <!--消息盒子-->
    <div>

    </div>
  </div>
</template>

<script>
export default {
  name: "LayerMessage",
  data(){
    return {

    }
  },
  methods:{

  },
  computed:{
    mapData(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.messages;
      }else {
        return [];
      }
    }
  },
  watch:{
    mapData:{
      handler(newValue){
        console.log(newValue);
      },
      deep:true
    }
  }
}
</script>

<style scoped>
.messageLayer{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  width: 250px;
  height: 500px;
  background: rgba(248,248,248,0.85);
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  right: 0px;
  bottom:0px;
  box-shadow: #c5c5c5 0px 0px 6px;
}
</style>
