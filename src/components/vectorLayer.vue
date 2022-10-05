<template>
  <!--z-40~60-->
<div class="vectorLayer">
  <!--
  现在，创建一个坪山区大小的地图底图
  宽度为(x)20km
  长度为(y)20km
  设 地图总共为5层，每层放大一倍
  注意！px并非绝对单位，但他是相较于电子地图而言的绝对单位，即，10px并不等于现实中的1m，但对于电子地图而言,10px等于1m
  第1层：10px = 1m 可得总共20,0000px  X  20,0000px
  第2层：5px = 1m 可得总共10,0000px  X  10,0000px
  第3层：2.5px = 1m 可得总共5,0000px  X  5,0000px
  第4层：1px = 1m 可得总共2,0000px  X  2,0000px
  第5层：0.5px = 1m 可得总共1,0000px  X 1,0000px
  第5层：0.2px = 1m  可得总共4000px  X  4000px
  第5层：0.1px = 1m 可得总共2000px  X  2000px

  /**/
  底图背景设定
  由100px * 100px组成的黑灰线段，并且不会随着图层的放大而放大
  /**/
  坐标系设定
  默认坐标在中间
  /**/
  -->
  <!--一组线段所组成的一条路径-->
  <div class="lines">
    <!--
    一条laneSegment 可以理解为一个具有长度、方向、平面坐标的矢量值
    -->
    <span class="lineSegment"></span>
    <span class="lineSegment"></span>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: "vectorLayer"
}
</script>

<style scoped>
  .vectorLayer{
    width: 100%;height: 100%;
  }
  .lines .lineSegment{
    /*宽度*/
    height: 2px;
    /*颜色*/
    background: #e81356;
    /**/
    position: fixed;
  }
  .lineSegment:nth-child(1){
    /*长度*/
    width: 100px;
    /*平面坐标*/
    top:100px;
    left: 90px;
    /*角度*/
    transform: rotate(0deg);
    transform-origin: left top;
  }
  .lineSegment:nth-child(2){
    width: 100px;
    top:100px;
    left: 190px;
    transform: rotate(45deg);
    transform-origin: left top;
  }
</style>
