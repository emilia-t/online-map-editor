<template>
  <div class="PomeloDelay">
    <wifi-signal :custom="color" :custom2="color2"/>
    <div :style="'color:'+color+';text-shadow: 0px 0px 1px '+color2" v-text="time+'ms'"/>
  </div>
</template>

<script>
import wifiSignal from "./svgValidIcons/wifiSignal";
export default {
  name: "PomeloDelay",
  components: {wifiSignal},
  comments:{wifiSignal},
  data(){
    return{
      time:1,
      color:'#0BFF05',
      color2:'#09A004',
    }
  },
  computed:{
    ping(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastPing;
      }else {
        return 0;
      }
    },
    pong(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.lastPong;
      }else {
        return 0;
      }
    }
  },
  watch:{
    pong:{
      handler(pong){
        this.time=Math.abs(pong-this.ping);
        if(this.time<=40){
          this.color='#0BFF05';
          this.color2='#09A004';
        }else if(this.time>40 && this.time<=120){
          this.color='#ffd400';
          this.color2='#daca00';
        }else if(this.time>120){
          this.color='#ff4e61';
          this.color2='#ac1d00';
        }
      }
    }
  }
}
</script>
