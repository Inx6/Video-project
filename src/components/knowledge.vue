<template>
    <div>
        <van-nav-bar
            :title="namer"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            />

        <van-cell-group inset>
            <van-cell style="text-align:left" title="昵称" :value="info.user" label="一个好的昵称更容易吸引人的关注" />
            <van-cell style="text-align:left" title="头像" :value="info.avatar" @click="go(info.avatar)" label="头像代表了不同的气质，仔细选择" />
            <van-cell style="text-align:left" title="背景" :value="info.backimg" @click="go(info.backimg)" label="每个人都有每个人的形象，展现你的风采" />
            <van-cell style="text-align:left" title="简介" :value="info.content" label="平凡的人生也是一场故事，描述一下你的电影" />
            <van-cell style="text-align:left" title="修改资料" @click="showPopup" />
        </van-cell-group>

        <van-popup v-model="show" round position="bottom" :style="{ height: '90%' }" closeable close-icon-position="top-right">
            <van-row type="flex">
                <van-col span="24">
                    <van-nav-bar title="修改资料"/>
                </van-col>
                <van-col span="24">
                    <van-field v-model="info_new.user" label="昵称" placeholder="请输入需要修改的昵称"/>
                </van-col>
                <van-col span="24">
                    <van-field v-model="info_new.content" label="简介" placeholder="请输入需要修改的简介"/>
                </van-col>
                <van-col span="24">
                    <van-field label="头像" :placeholder="aq" />
                    <van-uploader :after-read="afterRead" :max-count="1" :max-size="1920 * 1080" :disabled="isture"/>
                </van-col>
            </van-row>
            <van-button type="primary" block @click="fix">提交</van-button>
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue';
import { Cell, CellGroup } from 'vant';
import { ImagePreview } from 'vant';
import { NavBar } from 'vant';
import { Popup } from 'vant';
import { Col, Row } from 'vant';
import { Uploader } from 'vant';
import { Button } from 'vant';
import axios from 'axios';
import { Toast } from 'vant';

Vue.use(Button);
Vue.use(Uploader);
Vue.use(Col);
Vue.use(Row);
Vue.use(Popup);
Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
export default {
    name: 'knowledge',
    data(){
        return{
            isture: false,
            show: false,
            aq:'请选择要上传的头像',
            namer: '信息设置',
            info:{
                uid: '',
                avatar: '', // 头像
                user: '',   // 昵称
                content:'', // 简介
                backimg: ''  // 空间背景
            },
            info_new:{
                uid: '',
                user: '',   // 昵称
                content: '' // 简介
            },
        }
    },
    methods:{
        go(key){
            ImagePreview([key]);
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        showPopup() {
            this.show = true;
        },
        afterRead(file) {
            // 此时可以自行将文件上传至服务器
            // console.log(file.content);
            const token = localStorage.getItem('token');
            let formData = new FormData();
            formData.append('file',file.content);
            formData.append('uid',this.info.uid);
            // console.log(formData.get('uid'));
            axios({
                method: 'post',
                url: 'api/my/fixavatar',
                headers:{
                    Authorization: token
                },
                data: formData
            }).then((res)=>{
                // console.log(res.data);
                if(res.data.status === 202){
                    Toast('头像上传成功！');
                    this.isture = true;
                    this.aq = '头像修改成功，禁止重复上传！'
                }
            })
        },
        fix(){
            axios({
                method: 'post',
                url: 'api/my/fix',
                headers:{
                    Authorization: localStorage.getItem('token')
                },
                // processData: false,
                // contentType: false,
                data:{
                    info: this.info_new
                }
            }).then((res)=>{
                // console.log(res.data)
                if(res.data.status === 202){
                    Toast('信息修改成功！');
                    this.$router.push({
                        path: '/info',
                        query:{
                            uid: this.info.uid
                        }
                    })
                }
                if(res.data.status === 10){
                    Toast('昵称或简介不能为空！');
                }
            })
        }
    },
    mounted(){
        // console.log(this.$route.params.id);
        let data = this.$route.params.id;
        this.info.uid = data.uid;
        this.info_new.uid = this.info.uid;
        this.info.avatar = data.avatar;
        this.info.user = data.user;
        this.info.backimg = data.backimg;
        this.info.content = data.content;
        // console.log(this.info_new.id)
    }
}
</script>