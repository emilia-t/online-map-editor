<!--音效组件-->
<template>
  <div class="LayerSoundEffect">
    <!--询问权限弹窗-->
    <div class="alert" ref="alert" v-if="!choice">
      <span class="row1">为您提供更好的体验</span>
      <span class="row2">是否启用音效</span>
      <button class="confirm-btn" @click="enableEffect()">是</button>
      <button class="cancel-btn" @click="disableEffect()">否</button>
    </div>
    <canvas class="canvasDj" ref="canvasDj" width="300px" height="150px" v-if="!choice"/>
    <!--轨道1-音效-->
    <audio ref="track1"
           @play="track1OnPlay()"
           @pause="track1OnPause()"
           @ended="track1Ended()">
      <source :src="track1" type="audio/mpeg">
    </audio>
    <!--轨道2-音效-->
    <audio ref="track2"
           @play="track2OnPlay()"
           @pause="track2OnPause()"
           @ended="track2Ended()">
      <source :src="track2" type="audio/mpeg">
    </audio>
    <!--轨道3-音效-->
    <audio ref="track3"
           @play="track3OnPlay()"
           @pause="track3OnPause()"
           @ended="track3Ended()">
      <source :src="track3" type="audio/mpeg">
    </audio>
    <!--轨道4-音效-->
    <audio ref="track4"
           @play="track4OnPlay()"
           @pause="track4OnPause()"
           @ended="track4Ended()">
      <source :src="track4" type="audio/mpeg">
    </audio>
    <!--轨道5-音效-->
    <audio ref="track5"
           @play="track5OnPlay()"
           @pause="track5OnPause()"
           @ended="track5Ended()">
      <source :src="track5" type="audio/mpeg">
    </audio>
    <!--轨道6-音效-->
    <audio ref="track6"
           @play="track6OnPlay()"
           @pause="track6OnPause()"
           @ended="track6Ended()">
      <source :src="track6" type="audio/mpeg">
    </audio>
    <!--轨道7-音效-->
    <audio ref="track7"
           @play="track7OnPlay()"
           @pause="track7OnPause()"
           @ended="track7Ended()">
      <source :src="track7" type="audio/mpeg">
    </audio>
    <!--轨道8-音效-->
    <audio ref="track8"
           @play="track8OnPlay()"
           @pause="track8OnPause()"
           @ended="track8Ended()">
      <source :src="track8" type="audio/mpeg">
    </audio>
    <!--轨道α‌-底音-->
    <audio ref="trackBottomSound" loop
           @play="trackBottomOnPlay"
           @pause="trackBottomOnPause"
           @ended="trackBottomEnded()">
      <source src="static/audio/bottomSound.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
  export default {
  name: "LayerSoundEffect",
  data(){
    return{
      choice:false,//选择了启用还是没启用
      track1:'',//各轨道使用的音效名称完播或被用户暂停后重置为空字符
      status1:false,//各轨道的使用状态为true的情况下不允许更改新的音效
      track2:'',
      status2:false,
      track3:'',
      status3:false,
      track4:'',
      status4:false,
      track5:'',
      status5:false,
      track6:'',
      status6:false,
      track7:'',
      status7:false,
      track8:'',
      status8:false,
      effectList:{//音效名称列表
        do_1:'static/audio/do_1.mp3',
      },
      audioList:{//预加载音效

      },
      ctx:undefined,
      circles:[],
      Circle:class Circle {
        constructor(ctx) {
          this.ctx=ctx;
          this.width=300;
          this.height=150;
          this.colors=['#ff1c6a', '#e200a3', '#fbdd49',
            '#4caf50', '#ff9202','#ff5722',
            '#29ff00','#f6e384','#acbf4c'];
          this.x = Math.random() * this.width;
          this.y = Math.random() * this.height;
          this.radius = Math.random() * 40;
          this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = (Math.random() - 0.5) * 2;
        }
        draw() {
          const offScreenCanvas = document.createElement('canvas');//创建的虚拟画布
          offScreenCanvas.width = this.width;
          offScreenCanvas.height = this.height;
          const offScreenCtx = offScreenCanvas.getContext('2d');
          offScreenCtx.filter = 'blur(10px)';//高斯模糊效果
          offScreenCtx.beginPath();
          offScreenCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          offScreenCtx.fillStyle = this.color;
          offScreenCtx.fill();
          this.ctx.drawImage(offScreenCanvas, 0, 0);
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if(this.x - this.radius < 0 || this.x + this.radius > this.width) {
            this.vx = -this.vx;
          }
          if(this.y - this.radius < 0 || this.y + this.radius > this.height) {
            this.vy = -this.vy;
          }
          this.draw();
        }
      }
    }
  },
  mounted(){
    this.renderCanvas();
    this.preloadAudio();
    this.autoPlay();
  },
  methods:{
    renderCanvas(){
      const canvas=this.$refs.canvasDj;
      this.ctx=canvas.getContext('2d');
      for(let i=0;i<35;i++){//创建圆球
        this.circles.push(new this.Circle(this.ctx));
      }
      this.animate();
    },
    animate(){
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.fillRect(0, 0, 300, 150);
      this.circles.forEach(circle => circle.update());
      requestAnimationFrame(this.animate);
    },
    enableEffect(){
      this.$store.commit('setCoLogMessage',{text:'已启用音效',from:'internal:LayerSoundEffect',type:'tip'});
      this.$store.commit('setCoEffectsSoundPermission',true);
      this.$refs.alert.classList.add('alertDown');
      this.$refs.canvasDj.classList.add('canvasDjDown');
      setTimeout(()=>this.choice=true,1000);
    },
    disableEffect(){
      this.$store.commit('setCoLogMessage',{text:'已禁用音效',from:'internal:LayerSoundEffect',type:'tip'});
      this.$store.commit('setCoEffectsSoundPermission',false);
      this.$refs.alert.classList.add('alertDown');
      this.$refs.canvasDj.classList.add('canvasDjDown');
      setTimeout(()=>this.choice=true,1000);
    },
    autoPlay(){
      document.body.addEventListener(
        'click',
        ()=>{
          if(this.$refs.trackBottomSound.paused){
            this.$refs.trackBottomSound.play();
          }
        });
    },
    preloadAudio(){//预加载音效文件
      const audioFiles = {
        do_1: 'static/audio/do_1.mp3',
      };
      for (const key in audioFiles) {
        const audio = new Audio(audioFiles[key]);
        audio.load(); // 预加载
        this.audioList[key] = audio;
      }
    },
    /**
     * 音效播放控制-start
     * 命名：play+音效名
     * 备注：音效文件空格使用下划线代替，首字母大写
     **/
    trackPlan(){//返回可以使用的轨道如果没有可用的轨道返回false
      if(!this.status1)return 'track1';
      if(!this.status2)return 'track2';
      if(!this.status3)return 'track3';
      if(!this.status4)return 'track4';
      if(!this.status5)return 'track5';
      if(!this.status6)return 'track6';
      if(!this.status7)return 'track7';
      if(!this.status8)return 'track8';
      return false;
    },
    playDo_1() {
      this.$nextTick(() =>{
        let track=this.trackPlan();
        if(track!==false){
          if(this.$refs[track].paused===false){return;}
          this[track]=this.effectList.do_1;
          this.$refs[track].load();// 重新加载音频文件
          this.$refs[track].play();// 播放音效
        }
      });
    },
    /**
     * 音效播放控制-end
     **/
    /**
     * 音效播放监听器-start
     **/
    track1OnPlay(){
      // console.log("轨道1已播放");
      this.status1=true;
    },
    track1OnPause(){
      // console.log("轨道1已暂停");
      this.track1='';
      this.status1=false;
    },
    track1Ended(){
      // console.log("轨道1已完播");
      this.track1='';
      this.status1=false;
    },
    track2OnPlay(){
      // console.log("轨道2已播放");
      this.status2=true;
    },
    track2OnPause(){
      // console.log("轨道2已暂停");
      this.track2='';
      this.status2=false;
    },
    track2Ended(){
      // console.log("轨道2已完播");
      this.track2='';
      this.status2=false;
    },
    track3OnPlay(){
      // console.log("轨道3已播放");
      this.status3=true;
    },
    track3OnPause(){
      // console.log("轨道3已暂停");
      this.track3='';
      this.status3=false;
    },
    track3Ended(){
      // console.log("轨道3已完播");
      this.track3='';
      this.status3=false;
    },
    track4OnPlay(){
      // console.log("轨道4已播放");
      this.status4=true;
    },
    track4OnPause(){
      // console.log("轨道4已暂停");
      this.track4='';
      this.status4=false;
    },
    track4Ended(){
      // console.log("轨道4已完播");
      this.track4='';
      this.status4=false;
    },
    track5OnPlay(){
      // console.log("轨道5已播放");
      this.status5=true;
    },
    track5OnPause(){
      // console.log("轨道5已暂停");
      this.track5='';
      this.status5=false;
    },
    track5Ended(){
      // console.log("轨道5已完播");
      this.track5='';
      this.status5=false;
    },
    track6OnPlay(){
      // console.log("轨道6已播放");
      this.status6=true;
    },
    track6OnPause(){
      // console.log("轨道6已暂停");
      this.track6='';
      this.status6=false;
    },
    track6Ended(){
      // console.log("轨道6已完播");
      this.track6='';
      this.status6=false;
    },
    track7OnPlay(){
      // console.log("轨道7已播放");
      this.status7=true;
    },
    track7OnPause(){
      // console.log("轨道7已暂停");
      this.track7='';
      this.status7=false;
    },
    track7Ended(){
      // console.log("轨道7已完播");
      this.track7='';
      this.status7=false;
    },
    track8OnPlay(){
      // console.log("轨道8已播放");
      this.status8=true;
    },
    track8OnPause(){
      // console.log("轨道8已暂停");
      this.track8='';
      this.status8=false;
    },
    track8Ended(){
      // console.log("轨道8已完播");
      this.track8='';
      this.status8=false;
    },
    trackBottomOnPlay(){
      // console.log("底音已播放");
    },
    trackBottomOnPause(){
      // console.log("底音已暂停");
    },
    trackBottomEnded(){
      // console.log("底音已完播");
    }
    /**
     * 音效播放监听器-end
     **/
  },
  computed:{
    permission(){
      return this.$store.state.effectsConfig.soundEffect.permission;
    },
    needPlay(){
      return this.$store.state.effectsConfig.soundEffect.needPlay;
    },
    playCount(){
      return this.$store.state.effectsConfig.soundEffect.playCount;
    }
  },
  watch:{
    playCount:{
      handler(){
        if(this.permission===false)return false;//没权限播放
        let name=this.needPlay;
        switch(name){
          case 'do_1':{
            this.playDo_1();break;
          }
          default:{
            break;
          }
        }
      }
    }
  }
}
</script>
<style scoped>
  .LayerSoundEffect {
    position: fixed;
    user-select: none;
    z-index: 750;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
  }
  .canvasDj{
    position: fixed;
    z-index: 690;
    left: calc(50% - 150px);
    bottom: 0;
    border-radius: 10px;
    overflow: hidden;
    animation: slide-up 1s ease forwards;
  }
  .canvasDjDown{
    animation: slide-down 1s ease forwards;
  }
  .alert {
    position: fixed;
    z-index: 750;
    width: 270px;
    height: 120px;
    padding: 15px;
    left: calc(50% - 150px);
    bottom: 0;
    text-align: center;
    color: white;
    font-family: Arial, sans-serif;
    border-radius: 10px;
    overflow: hidden;
    animation: slide-up 1s ease forwards;
    opacity: 1;
    box-shadow: 0 10px 30px rgba(255, 198, 245, 0.67);
    pointer-events: all;
  }
  .alertDown{
    animation: slide-down 1s ease forwards;
  }
  .row1 {
    display: block;
    font-size: 16px;
    margin-bottom: 10px;
    text-shadow:0 0 2px #333232;
  }
  .row2 {
    display: block;
    font-size: 17px;
    margin-bottom: 20px;
    text-shadow:0 0 2px #333232;
  }
  button {
    padding: 6px 12px;
    margin: 0 5px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }
  .confirm-btn {
    background-color: #28a745;
    color: white;
  }
  .confirm-btn:hover {
    background-color: #218838;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .cancel-btn {
    background-color: #dc3545;
    color: white;
  }
  .cancel-btn:hover {
    background-color: #c82333;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  /* 动画：从底部缓缓上升 */
  @keyframes slide-up {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  /* 动画：从底部缓缓下降 */
  @keyframes slide-down {
    0% {
      transform: translateY(0%);
      opacity: 1;
    }
    100% {
      transform: translateY(100%);
      opacity: 0;
    }
  }
</style>
