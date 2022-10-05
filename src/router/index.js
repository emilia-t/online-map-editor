import Vue from 'vue'
import VueRouter from 'vue-router'
import mapBox from "../components/mapBox";
import linkPage from "../components/linkPage";

Vue.use(VueRouter);

const routes=[
    {
      path: '/mapBox',
      name: 'mapBox',
      component: mapBox
    }
    ,
    {
      path: '/linkPage/:dis',
      name: 'linkPage',
      component: linkPage,
      props:true
    },
    //{
      //redirect:重定向

    //}
  ]
const router = new VueRouter({
  routes,
  mode:"history"//history模式
});
export default router
