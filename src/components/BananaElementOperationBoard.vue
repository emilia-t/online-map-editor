<template>
  <div class="BananaElementOperationBoard" v-show="this.$store.state.elementOperationBoardConfig.display" :style="style">
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
      button1Color:"rgba(255,255,255,0.8)",
      button2Color:"rgba(255,255,255,0.8)",
    }
  },
  methods:{
    deleteElement(){
      //select id
      let id=this.$store.state.mapConfig.operated.id;
      this.$store.state.serverData.socket.broadcastDeleteElement(id);
      //关闭 element operation board
      this.$store.state.elementOperationBoardConfig.display=false;
    }
  },
  computed:{
    style(){
      let x=this.$store.state.elementOperationBoardConfig.posX+30;
      let y=this.$store.state.elementOperationBoardConfig.posY+30;
      return 'left:'+x+'px;top:'+y+'px'
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
  background: rgba(255,255,255,0.85);
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
