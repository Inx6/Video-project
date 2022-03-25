<template>
    <div>
        <!-- 左对齐 -->
        <div>
            <van-row type="flex" v-for="(item,index) in fri" :key="index">
            <van-col span="5">
                <van-image
                round
                width="4rem"
                height="4rem"
                :src="item.avatar"
                />
            </van-col>
            <van-col span="19" style="text-align:left">
                <div class="van-hairline--bottom" @click="go(item.attention)">
                    <p style="text-shadow: 2px 2px 5px;font-size:1.2rem;line-height:4rem;">{{item.username}}</p>
                    <!-- <p>{{item.content}}</p> -->
                </div>
            </van-col>
        </van-row>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Col, Row } from 'vant';
import { Toast } from 'vant';
import { Image as VanImage } from 'vant';
import axios from 'axios';

Vue.use(VanImage);
Vue.use(Col);
Vue.use(Row);
export default {
    name: 'guanzhu',
    data(){
        return{
            fri: [],
            info:{
                uid: localStorage.getItem('uid')
            },
        }
    },
    mounted(){
        axios({
            method: 'GET',
            url: 'api/videos/api',
            headers:{
                Authorization: localStorage.getItem('token')
            }
        }).then((res)=>{
            // console.log(res.data);
            if(res.data.status === 20 ||res.data.status === 10){
                Toast.fail('登录失效！');
                setTimeout(()=>{
                    this.$router.push({
                        name: 'login'
                    })
                },1500)
            }else{
                axios.get('api/my/attentionlist',{
                    headers:{
                        Authorization: localStorage.getItem('token')
                    },
                    params:{
                        uid: this.info.uid
                    }
                }).then((res)=>{
                    // console.log(res.data);
                    if(res.data.status === 202){
                        const infos = res.data.info;
                        this.fri = infos;
                        // console.log(this.fri)
                        if(this.fri.length === 0){
                            // console.log('null')
                            Toast.fail('您没有关注任何用户！')
                        }
                        // console.log(infos);
                    }
                })
            }
        })
        
    },
    methods:{
        go(key){
            // console.log(key);
            this.$router.push({
                name: 'user',
                params:{
                    uid: key
                }
            })
        }
    }
}
</script>