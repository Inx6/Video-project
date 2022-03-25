<template>
    <div>
        <van-search placeholder="输入搜索关键词" @click="go"/>
        <van-grid :column-num="2"  >
            <van-grid-item v-for="(item,index) in info" :key="index" @click="know(item.video_id)">
                <van-image v-if="item.img === null" :src="undefined1.img" />
                <van-image v-if="item.img !== null" :src="item.img" />
                <!-- <video width="100%" controls ref="videoRef"></video> -->
                <van-grid-item :text="item.title" />
            </van-grid-item>
        </van-grid>

        <van-pagination v-model="currentPage" :page-count="total" mode="simple" @change="list"/>

        <p style="margin-top:50px"></p>

        <van-overlay :show="show2" >
            <div class="block" >
                <img :src="src" alt="" width="100%">
                <van-loading type="spinner" color="#1989fa" />
            </div>
        </van-overlay>
    </div>
</template>

<script>
import Vue from 'vue';
import { Grid, GridItem, Toast } from 'vant';
import { Search } from 'vant';
import axios from 'axios';
import { Pagination } from 'vant';
import { Overlay } from 'vant';
import { Loading } from 'vant';

Vue.use(Loading);

Vue.use(Overlay);

Vue.use(Pagination);
// import Hls from 'hls.js';

Vue.use(Search);
Vue.use(Grid);
Vue.use(GridItem);

export default {
    name: 'home',
    data(){
        return{
            total: 1,
            currentPage: 1,
            uid: '',
            info: [],
            undefined1: {
                img: 'https://img01.yzcdn.cn/vant/apple-1.jpg'
            },
            show2: false,
            // 宣传位置
            src: ''
        }
    },
    methods:{
        go(){
            this.$router.push({
                name: 'search',
            })
        },
        know(key){
            this.show2 = true
            setTimeout(()=>{
                this.show2 = false;
            },499)
            setTimeout(()=>{
                this.$router.push({
                    path: '/know',
                    query: {
                        video_id: key,
                        // uid: this.uid
                    }
                })
            },500)
        },
        list(){
            // console.log(this.currentPage)
            axios({
                    method: 'GET',
                    url: 'api/videos/list',
                    headers:{
                        Authorization: localStorage.getItem('token')
                    },
                    params:{
                        page: this.currentPage
                    },
                }).then((res)=>{
                // console.log(res);
                if(res.data.status === 201){
                    this.info = res.data.data;
                    // console.log(this.info[0].img);
                }else{
                    Toast.fail('只有登录用户才能观看更多视频！');
                    setTimeout(()=>{
                        this.$router.push({
                            name: 'login'
                        })
                    },1500)
                }
            })
        }
    },
    mounted(){
        const token = localStorage.getItem('token');
        this.uid = localStorage.getItem('uid');
        axios.get('api/videos/list',{
            headers:{
                Authorization: token
            }
            }).then((res)=>{
            if(res.data.status === 201){
                this.info = res.data.data;
                this.total =  Math.ceil(res.data.total/6)+1;
                // console.log(this.info);
                if(this.info.length === 0){
                    Toast.fail('暂无数据，期待您的投稿！');
                }
            }else{
                Toast.fail('登录失效！');
                setTimeout(()=>{
                    this.$router.push({
                        name: 'login'
                    })
                },1500)
            }
        })
    },
}
</script>

<style>
.block {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>