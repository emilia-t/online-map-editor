<template>
<div class="pomeloCM" v-if="view"><div class="pomeloCMA"><p class="pomeloCMP" v-text="message"></p><div class="pomeloCMD"><button class="pomeloCMB" @click.stop="confirm(true)">Yes</button><button class="pomeloCMB" @click.stop="confirm(false)">No</button></div></div></div>
</template>
<script>
export default{
name:'PomeloConfirm',
props:{view:{type:Boolean,required:true},message:{type:String,required:true},
plan:{type:Object,default:{method:'none',value:null},required:true}},//操作名称//携带参数
methods:{confirm(sta){let re=JSON.parse(JSON.stringify(this.plan));re.state=sta;this.$emit('confirm',re);}}
}
</script>
