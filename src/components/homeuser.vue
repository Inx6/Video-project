<template>
    <div>
        <van-nav-bar
            title="用户详情"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            />

        <div style="width:100%" v-if="info.backimg">
            <img :src="info.backimg" alt="" width="100%" />
        </div>

        <div id="it" v-if="!info.backimg">
            <van-empty image="error" description="" />
        </div>

        <van-row type="flex" justify="space-around" >
            <van-col span="6" style="margin-top:-4rem;">
                <van-image
                    round
                    width="6rem"
                    height="6rem"
                    :src="info.avatar"
                    @click="img(info.avatar)"
                    style="box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                    />
                <p style='font-size:1.5rem;font-family: "Lucida Console", "Courier New", monospace;text-shadow: 2px 2px 5px;'>
                    {{info.user}}
                </p>
            </van-col>
            <van-col span="6"></van-col>
            <van-col span="6" v-if="attention === 0">
                <van-button @click="unlink()" style="margin-top:-5rem;text-shadow: 2px 2px 5px red;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" icon="plus" color="pink">
                    关注
                </van-button>
            </van-col>
            <van-col span="6" v-if="attention === 1">
                <van-button @click="unlink()" style="margin-top:-5rem;text-shadow: 2px 2px 5px red;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" icon="success" color="rgb(255, 177, 255)">
                    已关注
                </van-button>
            </van-col>
        </van-row>

        <p style='text-align:left;margin-left:1rem;font-size:1.5rem;font-family: "Lucida Console", "Courier New", monospace;text-shadow: 2px 2px 5px;'>
            <van-tag round color="pink">正式用户</van-tag>
            <van-tag round color="red" v-if="info.lv !== 0">行动队</van-tag>
            <van-tag round color="blue" v-if="info.certification!==0">官方认证</van-tag>
        </p>

        <p style="margin-top:1rem"></p>
        <van-row type="flex" justify="space-between" style='font-family: "Lucida Console", "Courier New", monospace;text-shadow: 2px 2px 5px;font-size:1rem'>
            <!-- 有时间再开放 注册时间-->
            <van-col span="10"></van-col>
            <van-col span="12">UID:{{info.uid}}</van-col>
            <van-col span="0.5"></van-col>
        </van-row>
        <p style="margin-top:1rem"></p>

        <p style='margin-left:1.5rem;text-align:left;font-family: "Lucida Console", "Courier New", monospace;text-shadow: 2px 2px 5px;'>简介: {{info.content}}</p>

        <van-divider content-position="right" :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">视频列表</van-divider>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <van-cell v-for="(item,index) in videos" :key="index" :title="item.title" @click="go(item.video_id,info.uid)"/>
        </van-list>

        <!-- 动画 -->
        <van-popup v-model="show2" position="top" :style="{ height: '100%' }">
            <!-- <van-image
            height="80%"
            src="https://tse1-mm.cn.bing.net/th/id/OIP-C.0gcNieZw_CR2Qpi6mQA8nQHaLJ?pid=ImgDet&rs=1"
            /> -->
            <van-empty description="这里空空如也" />
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue';
import { NavBar } from 'vant';
import axios from 'axios';
import {Toast} from 'vant'
import { Col, Row } from 'vant';
import { Image as VanImage } from 'vant';
import { Empty } from 'vant';
import { ImagePreview } from 'vant';
import { Button } from 'vant';
import { Tag } from 'vant';
import { List } from 'vant';
import { Divider } from 'vant';
import { Popup } from 'vant';

Vue.use(Popup);
Vue.use(Divider);
Vue.use(List);
Vue.use(Tag);
Vue.use(Button);
Vue.use(Empty);
Vue.use(VanImage);
Vue.use(Col);
Vue.use(Row);
Vue.use(NavBar);
export default {
    name: 'user',
    data(){
        return{
            info :'',
            videos: '',
            attention: 0,
            uids:'',
            loading: false,
            finished: false,
            show2: true
        }
    },
    methods:{
        onClickLeft(){
            // console.log(this.$router.history.current.meta);
            this.$router.go(-1);
        },
        img(i){
            // console.log(i)
            ImagePreview([i]);
        },
        unlink(){
            // console.log(this.uids)
            axios({
                method: 'GET',
                url: 'api/my/unlink',
                params:{
                    uid: localStorage.getItem('uid'),
                    attention: this.uids
                }
            }).then((res)=>{
                // console.log(res.data.status);
                switch(res.data.status){
                    case 202:
                        this.attention = 0;
                        // console.log(this.attention);
                        Toast.success('取消关注成功！')
                        break;
                    case 204:
                        this.attention = 1;
                        Toast.success('关注成功！')
                }
            })
        },
        onLoad() {
            this.finished = true;
            // 异步更新数据
            // axios
            // // setTimeout 仅做示例，真实场景中一般为 ajax 请求
            // setTimeout(() => {
            //     for (let i = 0; i < 10; i++) {
            //         this.list.push(this.list.length + 1);
            //     }

            //     // 加载状态结束
            //     this.loading = false;

            //     // 数据全部加载完成
            //     if (this.list.length >= 40) {
            //     this.finished = true;
            //     }
            // }, 1000);
        },
        go(ids,ud){
            this.$router.push({
                path: '/userknow',
                query:{
                    video_id: ids,
                    uid: ud,
                }
            })
        }
    },
    mounted(){
        setTimeout(()=>{
            this.show2 = false
        },1000)
        // console.log(this.$router.history.current.meta.keepAlive);
        // console.log(this.$route.params.uid);
        this.uids = this.$route.params.uid;

        // 用户信息
        axios({
            method: 'get',
            url: 'api/my/info',
            params:{
                uid: this.uids
            }
        }).then((res)=>{
            // console.log(res.data);
            if(res.data.status === 202){
                let data = res.data.data;
                this.info = data;
                // console.log('用户信息',this.info);
            }else{
                // Toast.fail('数据异常！');
                setTimeout(()=>{
                    this.$router.push({
                        name: 'guanzhu' 
                    })
                },1500)
            }
        })

        // 用户视频集合
        axios({
            method: 'GET',
            url: 'api/videos/searchid',
            headers:{
                Authorization: localStorage.getItem('token')
            },
            params:{
                id: this.uids
            }
        }).then((res)=>{
            // console.log(res.data);
            const info = res.data;
            switch(info.status){
                case 100:
                    Toast.fail('该用户没有上传视频！')
                    this.videos = '';
                    break;
                case 202:
                    this.videos = info.info;
                    // console.log('视频信息',this.videos);
                    break;
            }
        })

        // 查询用户是否关注该用户
        axios({
            method: 'GET',
            url: 'api/my/attentions',
            params:{
                id: localStorage.getItem('uid'),
                attention: this.uids
            }
        }).then((res)=>{
            // console.log(res.data.status)
            switch(res.data.status){
                case 202:
                    this.attention = 1;
                    // console.log(this.attention)
                    break;
                default:
                    Toast.fail('您并没有关注该用户！');
                    break;
            }
        })
    },
}
</script>
