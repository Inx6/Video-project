<template>
    <div>
        <van-nav-bar
        title="上传视频"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        />
        <div class="van-hairline--bottom" >
            <van-row type="flex">
                <!-- 上传公告栏 -->
                <van-col span="24">
                    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o" >
                        <van-swipe
                            vertical
                            class="notice-swipe"
                            :autoplay="3000"
                            :show-indicators="false"
                            >
                            <van-swipe-item v-for="(item,index) in msg" :key="index">
                                {{item.title}}
                            </van-swipe-item>
                        </van-swipe>
                    </van-notice-bar>
                </van-col>
                <!-- 背景 -->
                <!-- <van-col span="24">
                    <video width="100%" controls ref="videoRef" ></video>
                </van-col> -->
                <van-col span="24">
                    <!-- <van-cell is-link @click="showPopup">展示弹出层</van-cell> -->
                    <van-popup v-model="show" class="col">
                        <van-circle v-model="currentRate" :rate="100" size="150px" fill="#fff" :speed="100" :stroke-width="60" :color="gradientColor" :text="text" />
                    </van-popup>
                </van-col>
            </van-row>
        </div>
        <!-- 重要参数 -->
        <van-cell-group style="margin-top:10px">
            <van-field v-model="info.title" label="视频标题" placeholder="请输入视频标题" />
            <van-field v-model="info.content" label="视频简介" placeholder="请输入视频简介" />
            <van-field v-model="info.list" label="标签" placeholder="请输入标签，标签请使用分号隔开" />
        </van-cell-group>
        <div class="van-hairline--bottom">
            <van-row type="flex">
                <van-col span="1"></van-col>
                <van-col span="18" style="text-align:left">
                    <form enctype="multipart/form-data" name="fileinfo">
                        <input type="file" id="videos" @change="getfile($event)"/>
                    </form>
                </van-col>
                <van-col span="1"></van-col>
            </van-row>
        </div>

        <!-- 提交 -->
        <div class="van-hairline--bottom" style="margin-top:20px">
            <van-row type="flex">
                <van-col span="5"></van-col>
                <van-col span="14">
                    <van-button type="primary" round  size="normal" @click="upload">提交</van-button>
                </van-col>
                <van-col span="5"></van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Col, Row } from 'vant';
import { Button } from 'vant';
import { Field } from 'vant';
import { NoticeBar } from 'vant';
import { Toast } from 'vant';
import axios from 'axios';
import { Popup } from 'vant';
import { Circle } from 'vant';
import { Notify } from 'vant';
import { NavBar } from 'vant';
import Hls from 'hls.js';

Vue.use(NavBar);
Vue.use(Circle);
Vue.use(Popup);
Vue.use(NoticeBar);
Vue.use(Field);
Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
export default {
    name: 'upload',
    data(){
        return{
            video_id: 'HDab6a3458g2ab',
            file: '',
            info: {
                uid: '',        //投稿人uid
                title: '',      //视频名称
                content:'',     //视频简介
                video_id: '',   //视频id
                src: '',        //视频地址
                lv: '',         //投稿人等级
                user: '',       //投稿人名字
                upcontent: '',  //投稿人简介
                img:'',         //投稿人头像
                time:'',        //投稿时间
                zan:0,
                shou:0,
                guan:'',         //投稿人关注人数
                live: '' ,      //投稿人是否为会员
                list: ''        //视频标签
            },
            msg: [
                {
                    id: 1,
                    title: '禁止违反社区规定'
                },
                {
                    id: 2,
                    title: '请按照社区规范投递稿件'
                }
            ],
            show: false,
            currentRate: 0,
            gradientColor: {
                '0%': '#3fecff',
                '100%': '#6149f6',
            },
        }
    },
    methods:{
        getfile(event){
            this.file = event.target.files[0];
            // console.log(this.file);
            const fileMaxSize = 1024*1024*520;
            if(this.file>fileMaxSize){
                Toast('文件超出100M限制');
            }
            if(this.file.type !=='video/mp4'){
                this.file = '';
                Toast('只支持mp4文件，您的文件需要重新选择');
                // console.log(this.file);
            }
        },

        upload(){
            // let second = 360;
            let form = new FormData();
            form.append('title',this.info.title);
            form.append('content',this.info.content);
            form.append('lv',this.info.lv);
            form.append('user',this.info.user);
            form.append('upcontent',this.info.upcontent);
            form.append('img',this.info.img);
            form.append('uid',this.info.uid);
            form.append('list',this.info.list);
            form.append('live',this.info.live);
            form.append('time',this.info.time);
            form.append('video_id',this.info.video_id);
            form.append('zan',this.info.zan);
            form.append('shou',this.info.shou);
            form.append('file',this.file);

            axios({
                method: 'post',
                url: 'api/videos/uploads',
                headers:{
                    Authorization: localStorage.getItem('token')
                },
                data: form,
                // processData: false,  // 不处理数据
                // contentType: false,   // 不设置内容类型
                onUploadProgress: (progressEvent) => {
                    this.show = true;
                    let persent = (progressEvent.loaded / progressEvent.total * 100 | 0);		//上传进度百分比
                    this.currentRate = persent;
                    if(persent=== 100){
                        this.show = false;
                        // const toast = Toast.loading({
                        //     duration: 0, // 持续展示 toast
                        //     forbidClick: true,
                        //     message: '请耐心等待,后台性能有限，正在努力分析材料中...',
                        // });

                        // const timer = setInterval(() => {
                        //     second--;
                        //     if (second) {
                        //         toast.message = `请耐心等待,后台性能有限，正在努力分析材料中,倒计时 ${second} 秒...`;
                        //     }else{
                        //         clearInterval(timer);
                        //         // 手动清除 Toast
                        //         Toast.clear();
                        //     }
                        // }, 1000);
                    }
                },
            }).then((res)=>{
                // console.log(res.data);
                if(res.data.status === 202){
                    setTimeout(()=>{
                        Notify({ type: 'success', message: '上传成功！' });
                    },5000);
                    this.$router.push({
                        name: 'info',
                    });
                    // second = 1;
                }else{
                    Notify({ type: 'warning', message: '请不要遗漏信息' });
                    // second = 1;
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        onClickLeft(){
            this.$router.go(-1);
        }
    },
    computed: {
        text() {
            return this.currentRate.toFixed(0) + '%';
        },
    },
    mounted(){
        // console.log(this.$route.params.uid);
        this.info.uid = this.$route.params.uid;
        axios({
            method: 'get',
            url: 'api/my/info',
            params:{
                uid: this.info.uid,
            }
        }).then((res)=>{
            // console.log(res.data.data);
            this.info.user = res.data.data.user;
            this.info.upcontent = res.data.data.content;
            this.info.img = res.data.data.avatar;
            this.info.live = res.data.data.live; 
            this.info.guan = res.data.data.guan; 
            this.info.lv = res.data.data.lv; 
        })

        axios.get('api/videos/sear',{
            headers:{
                Authorization: localStorage.getItem('token')
            },
            params:{
                video_id:this.video_id
            }
        }).then((res)=>{
            // console.log(res.data.data[0].url);
            let src= 'api/'+res.data.data[0].url;
            // console.log(src);
            let hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(this.$refs.videoRef);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                this.$refs.videoRef.play();
            });
        })
    }
}
</script>

<style scoped>
  .notice-swipe {
    height: 40px;
    line-height: 40px;
    text-align: left;
  }
  .col{
      background-color: rgba(0,0,0,0);
      font-size: 15px;
  }
</style>