<template>
  <div class="BananaElementOperationBoard">
    <div class="panel">
      <div class="deleteButtonBox selectNone" ref="deleteButtonBox">
        <img @click="deleteElement()" class="deleteButton" draggable="false" alt="按钮" :src="deleteButton" :style="'background:'+this.button1Color"/>
      </div>
      <div class="deleteButtonBox selectNone" ref="deleteButtonBox">
        <img class="deleteButton" draggable="false" alt="按钮" :src="moreButton" :style="'background:'+this.button2Color"/>
      </div>
    </div>
  </div>
</template>

<script>
import deleteButton from '../../static/delete.png'
import moreButton from '../../static/more.png'
export default {
  name: "BananaElementOperationBoard",
  data(){
    return {
      deleteButton,
      moreButton,
      button1Color:"#ffffff",
      button2Color:"#ffffff",
    }
  },
  methods:{
    deleteElement(){
      //select id
      let id=this.$store.state.mapConfig.operated.id;
      this.$store.state.serverData.socket.broadcastDeleteElement(id);
    }
  }
}
</script>

<style scoped>
.BananaElementOperationBoard{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.panel{
  width: 30px;
  height: auto;
  min-height: 70px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
}
.deleteButtonBox{
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin: 5px 0px;
}
.deleteButton{
  background-image: url("../../static/delete.png");
  width: 25px;
  height: 25px;
}
</style>
