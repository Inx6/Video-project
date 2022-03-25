<template>
    <div>
        <div v-if="infos.uid !== ''">
            <van-row type="flex" class="top">
                <van-col span="24" v-for="item in 5" :key="item"></van-col>
                <van-col span="1"></van-col>
                <van-col span="6">
                    <van-image
                        round
                        width="5rem"
                        height="5rem"
                        fit="fill"
                        :src="infos.avatar"
                        @click="go(infos.avatar)"
                        style='box-shadow: 2px 2px 5px;'
                        />
                </van-col>
                <van-col span="17">
                    <p style="line-height:55px;font-size:1.5rem;">{{infos.user}}</p>
                    <p>{{infos.content}}</p>
                </van-col>
                <van-col span="1"></van-col>
                <van-col span="12">
                    <p style="color:white;text-align:center;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">UID:{{infos.uid}}</p>
                </van-col>
            </van-row>

            <van-row type="flex" style="text-align:left">
                <van-col span="24">
                    <div class="van-hairline--bottom">
                        <van-cell title="" icon="" />
                    </div>
                </van-col>
                <van-col span="24">
                    <div class="van-hairline--bottom" @click="go1">
                        <van-cell title="信息设置" icon="info-o" />
                    </div>
                </van-col>
                <van-col span="24">
                    <div class="van-hairline--bottom" @click="go2">
                        <van-cell title="上传视频" icon="add-o" />
                    </div>
                </van-col>
                <!-- <van-col span="24">
                    <div class="van-hairline--bottom">
                        <van-cell title="修改密码" icon="passed" />
                    </div>
                </van-col>
                <van-col span="24">
                    <div class="van-hairline--bottom">
                        <van-cell title="管理视频" icon="video-o" />
                    </div>
                </van-col>
                <van-col span="24">
                    <div class="van-hairline--bottom">
                        <van-cell title="我的会员" icon="vip-card-o" />
                    </div>
                </van-col> -->
                <van-col span="24">
                    <div class="van-hairline--bottom" @click="go6">
                        <van-cell title="退出" icon="edit" />
                    </div>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Col, Row } from 'vant';
import { Image as VanImage } from 'vant';
import { Icon } from 'vant';
import axios from 'axios';
import { ImagePreview } from 'vant';
import {Toast} from 'vant';
import { Dialog } from 'vant';

Vue.use(Icon);
Vue.use(VanImage);
Vue.use(Col);
Vue.use(Row);
export default {
    name: 'info',
    data(){
        return{
            id: 0,
            infos:{
                uid: '',
                avatar: '', // 头像
                user: '',   // 昵称
                content:'', // 简介
                backimg:'https://tse1-mm.cn.bing.net/th/id/R-C.eb83351c8c05f645a011bb41422cf2b6?rik=hiJgbCrHNPoA0A&riu=http%3a%2f%2fup.bizhitupian.com%2fpic%2f04%2f35%2fc2%2f0435c2d118f5511830593e9fe92d359b.jpg&ehk=bnLhbptacgcbBvy5JvFlFEDPUvALAF5fzTlV2bhXFuo%3d&risl=&pid=ImgRaw&r=0'  // 空间背景
            }        
        }
    },
    methods:{
        backimg(){
            document.querySelector('.top').style.backgroundImage = "url("+this.infos.backimg+")";
        },
        go(key){
            ImagePreview([key]);
        },
        go1(){
            this.$router.push({
                name: 'knowledge',
                params: {
                    id: this.infos
                }
            })
        },
        go2(){
            this.$router.push({
                name: 'upload',
                params: {
                    uid: this.infos.uid
                }
            })
        },
        go6(){
            localStorage.clear();
            Toast.success('退出登录成功！');
            setTimeout(()=>{
                this.$router.push({
                    path: '/login'
                })
            },2000)
        }
    },
    mounted(){
        // console.log(this.$route.params);
        if(this.$route.params.id === 1){
            Dialog.alert({
                title: '尊敬的用户，您好！',
                message: '新用户登录后请在--<b style="color:red">信息设置</b>--填写完整个人信息',
                theme: 'round-button',
            }).then(() => {
            // on close
            });
        }
        // console.log(this.$route.query);
        const uid = localStorage.getItem('uid');
        // console.log(uid);
        const token = localStorage.getItem('token');
        // console.log(token);
        this.infos.uid = uid;
        axios({
            method: 'get',
            url: 'api/my/info',
            params:{
                uid: this.infos.uid
            }
        }).then((res)=>{
            // console.log(res.data);
            if(res.data.status === 202){
                let data = res.data.data;
                this.infos.avatar = data.avatar;
                // console.log(data.backimg)
                if(data.backimg !== null){
                    this.infos.backimg = data.backimg;
                }
                this.backimg();
                this.infos.user = data.user;
                this.infos.content = data.content;
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

<style scoped>
.top{
    background-image: url('');
    background-repeat: no-repeat;
    background-size: cover;
    /* width: 100%; */
    height: 220px; 
    text-align:left;
    font-family: "Lucida Console", "Courier New", monospace;
    text-shadow: 2px 2px 5px;
    /* margin-top: 5rem; */
}
</style>

