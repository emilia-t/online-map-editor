import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
//vuex3.0基本操作https://blog.csdn.net/qq_56989560/article/details/124706021
export default new Vuex.Store({
  //提供唯一的公共数据源，所有共享的数据统一放到store的state进行储存数据，相当于data
  state: {
    //匿名命令的临时缓存
    anonymousInstruct:{
      name:null,
      data:null
    },
    //命令的缓存
    commits:{
      createTestLine:null
    },
    //相机配置
    cameraConfig:{
      //是否需要移动地图
      doNeedMoveMap:false,
    },
    //地图配置
    mapConfig:{
      layer:0,
      browser:{
        width:null,
        height:null
      },
      mapSize:{
        width: {
          x1:-1799999999,
          x2:1800000000
        },
        height:{
          y1:900000000,
          y2:-900000000
        }
      },
      startDefaultPoint:{
        x:0,
        y:0
      },
      A1:{
        x:0,
        y:0
      },
      centerPoint:{
        x:0,
        y:0
      }
    },
    //地图数据
    mapData:{

    },
    //用户数据
    userData:{

    }
  },
  //类似于vue中的computed，进行缓存，对于Store中的数据进行加工处理形成新的数据
  getters: {

  },
  //里面定义方法，操作state方发
  //Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。
  mutations: {
    /**经纬度坐标系转化为整数坐标
    1.功能：用于将带有负号，小数点符号的经纬度转化为纯整数的数字坐标
    2.传参：point,必要的,默认为{0,0},代表经纬度的x,y值;check,可选的,默认为false,若check传入true则表示需要对此经纬度的格式进行检查
    3.返参：obj,{x:int,y:int},返回一个含有x,y值的对象
    **/
    // longitudeLatitudeToInt(point,check){
    //   let mapW=this.state.mapConfig.mapSize.width;
    //   let mapH=this.state.mapConfig.mapSize.height;
    //   //1.将经纬度转化为整数
    //   let x=point.x || 0;
    //   let y=point.y || 0;
    //   let checkOut=check || false;
    //   let obj={x,y};
    //   if(checkOut){
    //     if(x>180 || y>90){
    //       return obj;
    //     }
    //   }
    //   obj.x=((mapW/2)+(Math.round(obj.x*10000000)));
    //   obj.y=((mapH/2)-(Math.round(obj.y*10000000)));
    //   return obj;
    // }
  },
  // 操作异步操作mutation
  actions: {

  }
})
