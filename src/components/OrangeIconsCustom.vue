<template>
<div class="OrangeIconsCustom">
  <div class="iconBox" v-for="icon in icons" :key="icon.serial" @click="callBack(icon)" @mousedown="selectStart($event)">
    <img v-if="selected!==icon.serial" class="icon" :src="imgSrc(icon.icon)" alt="" :title="icon.name"/>
    <img v-if="selected===icon.serial" class="selected" :src="imgSrc(icon.icon)" alt="" :title="icon.name"/>
  </div>
</div>
</template>

<script>
export default {
  name: "OrangeIconsCustom",
  data(){
    return{
      icons:[
        {
          'name':'不使用',
          'icon':null,
          'serial':0
        },
        {
          'name':'施工',
          'icon':'usualIcon001.png',
          'serial':1
        },
        {
          'name':'错误',
          'icon':'usualIcon002.png',
          'serial':2
        },
        {
          'name':'正确',
          'icon':'usualIcon003.png',
          'serial':3
        },
        {
          'name':'兴趣点',
          'icon':'usualIcon004.png',
          'serial':4
        },
      ],
      selected:0,
    }
  },
  methods:{
    callBack(data){
      this.selected=data.serial;
      this.$emit('OrangeIconsCustomCall',data.icon);
    },
    selectStart(ev){
      if(ev.button!==0){
        return false;
      }
      this.$emit('OrangeIconsCustomMousedown','');
    },
    imgSrc(icon){
      if(icon===null){
        return '../../static/icons/usualIcon000.png';
      }else{
        return '../../static/icons/'+icon;
      }
    },
  }
}
</script>

<style scoped>
.OrangeIconsCustom{
  width: 310px;
  height: auto;
  min-height: 32px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.iconBox{
  width: 22px;
  height: 22px;
  margin: 4px;
  border-radius: 13px;
  background: #757575;
}
.icon{
  width: calc(100% + 2px);/*防溢出*/
  height: calc(100% + 2px);
  transform: translateX(-1px) translateY(-1px);
  border-radius: inherit;
  transition: 0.4s;
}
.icon:hover{
  box-shadow: 0px 0px 4px #0288d1;
}
.selected{
  width: calc(100% + 2px);/*防溢出*/
  height: calc(100% + 2px);
  transform: translateX(-1px) translateY(-1px);
  border-radius: inherit;
  box-shadow: 0px 0px 8px #0067ff;
}
</style>
