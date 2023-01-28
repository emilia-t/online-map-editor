<template>
<!--显示除我以外的A1位置-->
  <g>
    <circle v-for="A1 in otherA1"  :key="A1.email+'-cir'" :cx="-A1.x" :cy="A1.y" r="5" stroke-width="1" :style="'fill:'+A1.color"/>
    <text v-for="A1 in otherA1"  :key="A1.email+'-txt'" class="selectNone" :x="-A1.x" :y="A1.y-10" v-text="A1.name" text-anchor="middle" :style="'fill:'+A1.color"></text>
  </g>
</template>

<script>
export default {
  name: "svgOtherA1Circle",
  data(){
    return{

    }
  },
  mounted() {

  },
  methods:{
    //测试

  },
  computed:{
    otherA1(){
      if(this.$store.state.serverData.socket){
        return this.$store.state.serverData.socket.otherA1
      }else {
        return []
      }
    }
  }
}
</script>

<style scoped>
.selectNone{
  -webkit-touch-callout:none; /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
</style>
