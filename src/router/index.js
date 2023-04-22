import Vue from 'vue'
import VueRouter from 'vue-router'
import SeparateMap from '../components/SeparateMap'
import App from "../App";
Vue.use(VueRouter);

const routes=[
    {
      path: '/m/:serverKey',
      name: 'mapBox',
      component: SeparateMap,
      props:true
    }
  ]
const router = new VueRouter({
  routes,
  mode:"history"//history模式
});
export default router
