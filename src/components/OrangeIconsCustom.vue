<template>
<div class="OrangeIconsCustom">
  <div class="iconBox" v-for="icon in icons" :key="icon.serial" @click="callBack(icon)" @mousedown="selectStart($event)">
    <img v-if="selected!==icon.serial" class="icon" :src="'../../static/icons/'+icon.icon" alt="" :title="icon.name"/>
    <img v-if="selected===icon.serial" class="selected" :src="'../../static/icons/'+icon.icon" alt="" :title="icon.name"/>
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
          'name':'默认',
          'icon':'usualIcon000.png',
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
        }
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
    }
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
  border-radius: 11px;
  background: #757575;
}
.icon{
  width: inherit;
  height: inherit;
  border-radius: inherit;
  transition: 0.4s;
}
.icon:hover{
  background: #0288d1;
  transform: scale(1.25);
}
.selected{
  width: inherit;
  height: inherit;
  border-radius: inherit;
  transform: scale(1.25);
  background: #0288d1;
}
</style>
