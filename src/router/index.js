import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes=[
    // {
    //   path: '/mapBox',
    //   name: 'mapBox',
    //   component: mapBox
    // }
    //{
      //redirect:重定向

    //}
  ]
const router = new VueRouter({
  routes,
  mode:"history"//history模式
});
export default router
