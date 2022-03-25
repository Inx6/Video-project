<template>
    <div>
        <!-- right-text="按钮" -->
        <!-- @click-right="onClickRight" -->
        <!-- 视频播放器 -->
        <!-- :title="infos.title" -->
        <van-sticky>
            <van-nav-bar
            title="视频详情"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            />
        </van-sticky>
        <div>
            <video width="100%" style="border-radius: 10px;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" controls ref="videoRef"></video>
        </div>
        
        <van-tabs @click="onClick">
            <van-tab title="详情">
                <van-row type="flex">
                    <van-col span="6">
                        <van-image
                            round
                            width="5rem"
                            height="5rem"
                            :src="infos.img"
                            @click="go(infos.uid)"
                            />
                    </van-col>
                    <van-col span="13" style="text-align:left;margin-top:0.5rem">
                        <div>
                            <p style="line-height:35px;color:pink" v-if="infos.lv === 6">{{infos.username}}</p>
                            <p style="line-height:35px;" v-if="infos.lv !== 6">{{infos.username}}</p>
                            <van-tag color="pink" text-color="white">LV{{infos.lv}}</van-tag>
                            <van-tag color="pink" text-color="white" v-if="infos.live === 1">特别成员</van-tag>
                            <van-tag type="warning">关注度:{{infos.guan}}</van-tag>
                        </div>
                        <!-- <p style="font-size:5px;">
                            {{infos.upcontent}}
                        </p> -->
                    </van-col>
                    <van-col span="5" style="margin-top:1.5rem">
                        <van-button icon="plus" type="primary" color="pink" size="small" @click="guan(infos.uid,infos.img,infos.username,infos.upcontent)">关注</van-button>
                    </van-col>
                </van-row>

                <van-collapse v-model="activeNames" style="text-align:left">
                    <van-collapse-item :title="infos.title" name="1">视频简介：{{infos.content}}</van-collapse-item>
                </van-collapse>

                <van-row type="flex" justify="space-between" style="margin-top:15px">
                    <van-col span="1"></van-col>
                    <van-col span="11" style="font-size:5px;text-align:left">
                        上传时间:{{infos.time}}
                    </van-col>
                    <van-col span="11" style="font-size:5px;text-align:right">
                        id:{{vid}}
                    </van-col>
                    <van-col span="1">
                        <!-- <van-rate v-model="value" readonly /> -->
                    </van-col>
                </van-row>

                <van-row type="flex" style="margin-top:15px">
                    <van-col>
                        <!-- <van-tag type="primary">点赞:{{infos.zan}}</van-tag>
                        <van-tag type="danger">收藏:{{infos.shou}}</van-tag> -->
                    </van-col>
                </van-row>
            </van-tab>

            <van-tab :title="'评论数:'+num">
                <van-field
                    v-model="cons.content"
                    rows="2"
                    autosize
                    label="留言"
                    type="textarea"
                    placeholder="请输入留言"
                    show-word-limit

                    @click="submit"
                    />

                <!-- <van-button round type="info" size="normal" color="#1989fa" @click='submit'>提交</van-button> -->

                <!-- 一级评论 -->
                <div>
                    <van-skeleton title avatar :row="3" :loading="loading" v-for="(item,index) in text" :key="index" >
                        <div class="van-hairline--bottom" v-if="item.is_top === 1 && item.forid ===null && item.is_two === 0">
                            <van-row type="flex" >
                                <van-col span="5">
                                    <van-image
                                    round
                                    width="4rem"
                                    height="4rem"
                                    :src="item.img"
                                    />
                                </van-col>
                                <van-col span="19">
                                    <p style="display:flex;line-height:2.5rem;color:red;font-size:1.2rem" v-if="item.live === 1">{{item.username}}</p>
                                    <p style="display:flex;line-height:2.5rem;font-size:1.2rem" v-if="item.live !== 1">{{item.username}}</p>
                                    <van-col style="line-height:25px;font-size:1rem">{{item.content}}</van-col>
                                </van-col>
                            </van-row>
                            <van-row  style="font-size:1rem;">
                                <van-col span="4"></van-col>
                                <van-col span="19">
                                    <van-row>
                                        <van-col span="3" @click="zan(item.id,item.like,index)">
                                            <van-icon name="like-o" color="#ee0a24"/>
                                            <p>{{item.like}}</p>
                                        </van-col>
                                        <van-col span="4">
                                            <van-icon name="fire-o" color="#ee0a24" />
                                            <p>{{item.hot}}</p>
                                        </van-col>
                                        <van-col span="4">
                                            <van-icon name="flag-o" color="#ee0a24"/>
                                            <p>举报</p>
                                        </van-col>
                                        <van-col span="4" @click='submit0(item.uid,item.id)'>
                                            <van-icon name="comment-o" />
                                            <p>回复</p>
                                        </van-col>
                                    </van-row>
                                </van-col>
                                <!-- <van-col span="4">
                                    <van-button plain type="info">回复</van-button>
                                </van-col> -->
                            </van-row>
                        </div>

                        <!-- 二级评论 -->
                        <!-- 判断是否存在二级评论 -->
                        <div class="van-hairline--bottom" v-if="item.is_twoping=== 1">
                            <!-- 存在二级评论，开始遍历哪些评论属于其二级评论 -->
                            <van-row type="flex" justify="center" v-for="(inx,dec) in text" :key="dec">
                                <!-- 判断哪些评论是其二级评论 -->
                                <van-col span="22" style="background-color:rgba(242, 249, 255, 0.685);font-size:12.5px" v-if="inx.forid === item.uid && inx.forforid === ''">
                                    <van-row type="flex">
                                        <van-col span="4">
                                            <van-image
                                            round
                                            width="3rem"
                                            height="3rem"
                                            :src="inx.img"
                                            />
                                        </van-col>
                                        <van-col span="20">
                                            <!-- {{inx.username}} 回复给 {{item.username}} -->
                                            <p style="line-height:25px;display:flex" >{{inx.username}}</p>
                                            <van-col style="line-height:25px" v-for="(items,ins) in text" :key="ins">
                                                <p  v-if = "items.id === inx.id1">
                                                    {{inx.content}}
                                                </p>
                                            </van-col>
                                        </van-col>
                                    </van-row>

                                    <van-row type="flex">
                                        <van-col span="3"></van-col>
                                        <van-col span="15">
                                            <van-row>
                                                <!-- 点赞 -->
                                                <van-col span="5" @click="zan(inx.id,inx.like,dec)">
                                                    <van-icon name="like-o" color="#ee0a24"/>
                                                    <p>{{inx.like}}</p>
                                                </van-col>
                                                <!-- 热度 -->
                                                <van-col span="5">
                                                    <van-icon name="fire-o" color="#ee0a24" />
                                                    <p>{{inx.hot}}</p>
                                                </van-col>
                                                <!-- 举报 -->
                                                <van-col span="5">
                                                    <van-icon name="flag-o" color="green"/>
                                                    <p>举报</p>
                                                </van-col>
                                                <!-- 以后再开发 -->
                                                <!-- 不等了 -->
                                                <van-col span="5" @click='submit1(inx.uid,inx.forid,inx.id)'>
                                                    <van-icon name="comment-o" />
                                                    <p>回复</p>
                                                </van-col>
                                            </van-row>
                                        </van-col>  
                                    <!-- <van-col span="4">
                                        <van-button plain type="info">回复</van-button>
                                    </van-col> -->
                                    </van-row>
                                </van-col>

                                <!-- 判断哪些评论是三级评论 -->
                                <van-col span="22" style="background-color:rgba(242, 249, 255, 0.685);font-size:12.5px" v-if="inx.forid === item.uid && inx.forforid !== ''">
                                    <!-- 遍历所有评论 -->
                                    <!-- v-for="(as,ni) in text" :key="ni" -->
                                    <div  class="van-hairline--bottom">
                                        <!-- 查找三级评论 -->
                                        <!-- v-if="as.forforid === inx.uid " -->
                                        <div> 
                                            <van-row type="flex" >
                                                <van-col span="4">
                                                    <van-image
                                                    round
                                                    width="3rem"
                                                    height="3rem"
                                                    :src="inx.img"
                                                    />
                                                </van-col>
                                                <van-col span="20" >
                                                    <p style="line-height:25px;display:flex" >{{inx.username}} </p>
                                                    <van-col style="line-height:25px" v-for="(items,ins) in text" :key="ins">
                                                        <p  v-if = "items.id === inx.id1">
                                                            回复给 <b>{{items.username}}</b>：{{inx.content}}
                                                        </p>
                                                    </van-col>
                                                </van-col>
                                            </van-row>

                                            <van-row type="flex">
                                                <van-col span="3"></van-col>
                                                <van-col span="15">
                                                    <van-row>
                                                        <van-col span="5">
                                                            <van-icon name="like-o" @click="zan(inx.id,inx.like,dec)" color="#ee0a24"/>
                                                            <p>{{inx.like}}</p>
                                                        </van-col>
                                                        <van-col span="5">
                                                            <van-icon name="fire-o" color="#ee0a24" />
                                                            <p>{{inx.hot}}</p>
                                                        </van-col>
                                                        <van-col span="5">
                                                            <van-icon name="flag-o" color="green"/>
                                                            <p>举报</p>
                                                        </van-col>
                                                        <!-- 以后再开发 -->
                                                        <van-col span="5" @click='submit1(inx.uid,inx.forid,inx.id)'>
                                                            <van-icon name="comment-o" />
                                                            <p>回复</p>
                                                        </van-col>
                                                    </van-row>
                                                </van-col>  
                                            </van-row>
                                        </div>
                                    </div>
                                </van-col>

                            </van-row>
                        </div> 
                    </van-skeleton>
                </div>

                <van-row style="padding-top:50px;font-size:5px">
                    <van-col span="24">Produced with honors by hikonl©2022-2022</van-col>
                    <van-col span="24">荣誉出品</van-col>
                    <van-col span="24">©hikonl个人定制</van-col>
                </van-row>

            </van-tab>
        </van-tabs>

        <van-popup v-model="show" position="bottom" :style="{ height: '90%' }" closeable close-icon="close" round >
            <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }" content-position="left">
                回复
            </van-divider>
            <van-divider :style="{ color: 'black', borderColor: '#1989fa', padding: '0 16px' }" content-position="left">
                <div class="van-multi-ellipsis--l10">
                    {{cons.content}}
                </div>
            </van-divider>
            
            <van-field
                v-model="cons.content"
                name="回复"
                label="回复"
                placeholder="请输入内容"
                
            />
            <div style="margin: 16px;">
                <van-button round block type="info" @click="submit4">提交</van-button>
            </div>
        </van-popup>

        <!-- 动画 -->
        <van-overlay :show="show2" >
            <div class="block" >
                <img :src="src" alt="" width="100%">
            </div>
        </van-overlay>
    </div> 
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
import { NavBar } from 'vant';
import { Field } from 'vant';
import { Rate } from 'vant';
import { Col, Row } from 'vant';
import { Skeleton } from 'vant';
import { Image as VanImage } from 'vant';
import { Collapse, CollapseItem } from 'vant';
import { Badge } from 'vant';
import axios from 'axios';
import Hls from 'hls.js';
import { Divider } from 'vant';
import { Sticky } from 'vant';
import { Dialog } from 'vant';
import { Notify } from 'vant';
import { Empty } from 'vant';
import { Overlay } from 'vant';

Vue.use(Overlay);
Vue.use(Empty);
Vue.use(Sticky);
Vue.use(Toast);
Vue.use(Divider);
Vue.use(Badge);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(VanImage);
Vue.use(Skeleton);
Vue.use(Col);
Vue.use(Row);
Vue.use(Rate);
Vue.use(Field);
Vue.use(NavBar);
export default {
    name: 'konw',
    data(){
        return{
            show2: true,
            show: false,
            activeNames: ['1'],
            vid: '',
            infos: {
                uid: '',
                title: '', //视频标题
                video_id:'', //视频id
                src: '',
                lv: '',  //up等级
                username: '', //up名字
                upcontent: '', //up简介
                img:'', //头像
                time:'',
                zan:'',
                shou:'',
                guan:'',
                content:'', //视频简介
                live: 0 //会员
            },
            value: 4,
            message:'',
            num: 0,
            loading: true,
            text:[],
            cons:{
                video_id:'',    //参数：视频id
                uid:'',         //参数：用户id
                username:'',    //参数：用户名称
                img: '',        //参数：用户头像
                content:'',     //参数：用户评论
                is_top: '',
                is_two: '',
                forid: '',       //参数：评论回复区
                forforid:'',     //参数：评论回复人
                like: 0,
                hot: 0,
                is_twoping:0,
                id1: '',
                contentupdown: 0
            },
            //  宣传位置
            src: ''
        }
    },
    methods: {
        onClickLeft() {
            Toast('返回');
            this.$router.go(-1);
        },
        onClick(name, title) {
            // Toast(title);
        },

        // 留言栏
        submit(){
            this.show = true;
            this.cons.id1 = null;
            this.cons.video_id = this.infos.video_id;
            this.cons.forid = null;
            this.cons.forforid = null;
            this.cons.is_top = 1;
            this.cons.is_two = 0;
            this.cons.is_twoping = 1;
            // console.log(this.cons)
        },
        // 二级评论
        submit0(uid,id1){
            // console.log(uid);
            // console.log(id1);
            this.show = true;
            // 回复参数
            // console.log(id1)
            this.cons.id1 = id1;
            this.cons.forid = uid;
            this.cons.forforid = '';
            this.cons.video_id = this.infos.video_id;
            this.cons.is_top = 0;
            this.cons.is_two = 1;
            this.cons.is_twoping = 0;
            // console.log(this.cons);
        },
        // 三级评论
        submit1(uid,forid,id1){
            // console.log(uid);
            // console.log(forid);
            // console.log(id1);
            // if(uid === this.cons.uid){
            //     Toast('请不要自己回复自己')
            // }else{
                
            // }
            this.show = true;
            // 回复参数
            this.cons.id1 = id1;
            this.cons.forid = forid;
            this.cons.forforid = uid;
            this.cons.video_id = this.infos.video_id;
            this.cons.is_top = 0;
            this.cons.is_two = 1;
            this.cons.is_twoping = 0;
            // console.log(this.cons);
        },
        submit4() {
            // console.log(this.cons);
            let src = '';
            const token = localStorage.getItem('token');
            if(this.cons.is_top === 1){
                src = 'api/videos/upcontent';
                // console.log(src);
                if(this.cons.content === ''){
                    Toast.fail('请输入内容！');
                }else{
                    // console.log(this.cons);
                    axios({
                        method: 'post',
                        url: src,
                        headers:{
                            Authorization: token
                        },
                        data:{
                            info: this.cons
                        }
                    }).then((res)=>{
                        // console.log(res.data);
                        if(res.data.status !== 202){
                            // Toast.success('');
                            Dialog.alert({
                                message: '内容过多！',
                                theme: 'round-button',
                                }).then(() => {
                                // on close
                            });
                            this.cons.content = '';
                        }
                        if(res.data.status === 202){
                            Toast.success('回复成功！');
                            this.show = false;
                            this.cons.content = '';
                            axios({
                                method: 'get',
                                url: 'api/videos/content',
                                headers:{
                                    Authorization: token
                                },
                                params: {
                                    video_id: this.infos.video_id 
                                }
                            }).then((res)=>{
                                this.loading =false;
                                const info3 = res.data;
                                const info4 = info3.date;
                                this.text = info4;
                                this.num = this.text.length;
                            })
                        }
                    })
                }
            }
            if(this.cons.is_top !== 1){
                src = 'api/videos/upcontent1';
                // console.log(src);
                if(this.cons.content === ''){
                    Toast.fail('请输入内容！');
                }else{
                    axios({
                        method: 'post',
                        url: src,
                        headers:{
                            Authorization: token
                        },
                        data:{
                            info: this.cons
                        }
                    }).then((res)=>{
                        // console.log(res.data);
                        if(res.data.status !== 202){
                            // Toast.success('');
                            Dialog.alert({
                                message: '内容过多！',
                                theme: 'round-button',
                                }).then(() => {
                                // on close
                            });
                            this.cons.content = '';
                        }
                        if(res.data.status === 202){
                            Toast.success('回复成功！');
                            this.show = false;
                            this.cons.content = '';
                            axios({
                                method: 'get',
                                url: 'api/videos/content',
                                headers:{
                                    Authorization: token
                                },
                                params: {
                                    video_id: this.infos.video_id 
                                }
                            }).then((res)=>{
                                this.loading =false;
                                const info3 = res.data;
                                const info4 = info3.date;
                                this.text = info4;
                                this.num = this.text.length;
                            })
                        }
                    })
                }
            }
        },

        zan(key0,key1,id){
            const jia = this.text[id].like++;
            const token = localStorage.getItem('token');
            axios({
                method: 'get',
                url: 'api/videos/upzan',
                headers:{
                    Authorization: token
                },
                params:{
                    id: key0,
                    like: key1
                }
            }).then((res)=>{
                // console.log(res.data);
                const info = res.data;
                if(info.status===202){
                    Toast.success('点赞成功！')
                    this.text[id].like === jia;
                }
            })
        }, 

        guan(attention,avatar,username,content){
            // console.log(attention);
            const uid = this.cons.uid;
            const token = localStorage.getItem('token');
            // console.log(avatar);
            // console.log(content);
            axios.post('api/my/attention',{
                data:{
                    uid: uid,
                    attention: attention,
                    avatar: avatar,
                    content: content,
                    username: username,
                }
            },{
                headers:{
                    Authorization: token
                },
            }).then((res)=>{
                // console.log(res.data);
                if(res.data.status === 202){
                    Toast.success('关注成功！')
                }else if(res.data.status === 100){
                    Toast.success('您已经关注该用户！')
                }else if(res.data.status === 101){
                    Toast.fail('该用户状态异常')
                }
            })
        },
        go(value){
            this.$router.push({
                name: 'homeuser',
                params:{
                    uid: value
                }
            })
        },



    },
    mounted(){
        setTimeout(()=>{
            this.show2 = false
        },1000)

        // console.log(this.$route.query.uid);
        const token = localStorage.getItem('token');
        this.infos.video_id = this.$route.query.video_id;
        this.cons.uid = localStorage.getItem('uid');
        this.loading = true;

        // 视频详情信息
        axios({
            method: 'get',
            url: 'api/videos/sear',
            headers:{
                Authorization: token
            },
            params:{
                video_id: this.infos.video_id,
            }
        }).then((res)=>{
            // console.log(res.data.data[0])
            const info = res.data.data[0];
            // console.log(info);
            this.vid =info.video_id;
            this.infos.src = info.url;

            let hls = new Hls();
            hls.loadSource('api/'+this.infos.src);
            hls.attachMedia(this.$refs.videoRef);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                this.$refs.videoRef.play();
            });

            this.infos.title = info.title;
            this.infos.content = info.content;
            this.infos.time = info.time;
            this.infos.shou = info.shou;
            this.infos.zan = info.zan;
            this.infos.uid = info.uid;
            axios({
                method: 'get',
                url: 'api/my/info',
                params:{
                    uid: this.infos.uid
                }
            }).then((res)=>{
                const info2 = res.data.data
                // console.log(info2);
                this.infos.username = info2.user;
                this.infos.img = info2.avatar;
                this.infos.guan = info2.guan;
                this.infos.lv = info2.lv;
                this.infos.live = info2.live;
                this.infos.upcontent = info2.content;
            })
        })

        // 视频评论信息
        axios({
            method: 'get',
            url: 'api/videos/content',
            headers:{
                Authorization: token
            },
            params: {
                video_id: this.infos.video_id 
            }
        }).then((res)=>{
            // console.log(res.data)
            const info3 = res.data;
            if(info3.status === 203){
                setTimeout(()=>{
                    Notify({ type: 'primary', message: '暂无评论' });
                    this.loading = true;
                },1500);
            }
            if(info3.status === 202){
                setTimeout(()=>{
                    this.loading = false;
                },2050);
                const info4 = info3.date;
                this.text = info4;
                // console.log(info4)
                // console.log(this.text);
                this.num = this.text.length;
            }
        })

        // 用户信息
        axios({
            method: 'get',
            url: 'api/my/info',
            headers:{
                Authorization: token
            },
            params:{
                uid: this.cons.uid
            }
        }).then((res)=>{
            // console.log(res.data);
            if(res.data.status === 202){
                const info = res.data.data;
                // console.log(info);
                this.cons.username = info.user;
                this.cons.img = info.avatar;
            }
        })
    },
}
</script>
