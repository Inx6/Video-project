import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import info from '@/components/info'
import search from '@/components/search'
import know from '@/components/know'
import guanzhu from '@/components/guanzhu'
import knowledge from '@/components/knowledge'
import upload from '@/components/upload'
import login from '@/components/login'
import register from '@/components/register'
import user from '@/components/user'
import userknow from '@/components/userknow'
import homeuser from '@/components/homeuser'

Vue.use(Router)

export default new Router({
  routes: [
    // 页面缓存
    {
      path:'/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta:{
        keepAlive: true
      }
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta:{
        keepAlive:true
      }
    },

    // 页面不缓存
    {
      path: '/guanzhu',
      name: 'guanzhu',
      component: guanzhu,
      meta:{
        keepAlive: false
      }
    },
    {
      path:'/info',
      name: 'info',
      component: info,
      meta:{
        keepAlive: false
      }
    },
    {
      path:'/knowledge',
      name: 'knowledge',
      component: knowledge,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/know',
      component: know,
      meta:{
        keepAlive:false
      }
    },
    {
      path: '/upload',
      name: 'upload',
      component: upload,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/userknow',
      name: 'userknow',
      component: userknow,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/homeuser',
      name: 'homeuser',
      component: homeuser,
      meta:{
        keepAlive: false
      }
    }
  ]
})
