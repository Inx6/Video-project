<template>
  <div id="app">
    <van-sticky>
      <van-nav-bar :title="title" id="title"></van-nav-bar>
    </van-sticky>

    <keep-alive>
      <router-view v-if="this.$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!this.$route.meta.keepAlive"/>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">
        <router-link to="/home">首页</router-link>
      </van-tabbar-item>
      <van-tabbar-item icon="search">
        <router-link to="/search">搜素</router-link>
      </van-tabbar-item>
      <van-tabbar-item icon="friends-o">
        <router-link to="/guanzhu">关注</router-link>
      </van-tabbar-item>
      <van-tabbar-item icon="setting-o">
        <router-link to="/info">我的</router-link>
      </van-tabbar-item>
    </van-tabbar>

    <!-- 动画 -->
    <van-popup v-model="show2" position="top" :style="{ height: '100%',width:'100%' }">
        <van-image
        width="100%"
        :src="src"
        />
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';
import { NavBar } from 'vant';
import { Sticky } from 'vant';
import axios from 'axios';

Vue.use(Sticky);
Vue.use(NavBar);
Vue.use(Tabbar);
Vue.use(TabbarItem);

export default {
  name: 'App',
  data(){
    return {
      active: 0,
      title: '',
      show2: true,
      // 宣传位置
      src: 'https://picb5.photophoto.cn/39/854/39854745_1.jpg'
    }
  },
  mounted(){
    setTimeout(()=>{
        this.show2 = false
    },1000);
    // axios({
    //   method: 'GET',
    //   url: '',

    // })
  }

}
</script>

<style>
*{
  margin:0;
  padding:0
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#title {
  background-color: rgb(25, 137, 250);
  color: rgb(255, 255, 255);
}
</style>
