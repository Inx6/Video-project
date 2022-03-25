<template>
    <div>
        <van-nav-bar title="登录" right-text="注册" @click-right="onClickRight"/>
        <van-form @submit="onSubmit">
            <van-field
                v-model="username"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { NavBar } from 'vant';
import {Toast} from "vant";
import axios from 'axios';

Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
export default {
    name: 'login',
    data(){
        return {
            username: '',
            password: '',
        };
    },
    methods:{
        onSubmit(values) {
            // console.log(values.用户名);
            axios({
                method: 'GET',
                url: 'api/my/login',
                params:{
                    user: values.用户名,
                    password: values.密码
                }
            }).then((res)=>{
                // console.log(res.data);
                if(res.data.status === 202){
                    Toast.success('登录成功！');
                    // console.log(res.data.info.uid);
                    // console.log(res.data.token);
                    localStorage.setItem('uid',res.data.info.uid);
                    localStorage.setItem('token',res.data.token);
                    this.$router.push({
                        name: 'info',
                        params:{
                            id: 1
                        }
                    })
                }else{
                    Toast.fail('密码错误！')
                }
            })
        },
        onClickRight(){
            Toast('注册');
            setTimeout(()=>{
                this.$router.push({
                    path: '/register'
                })
            },1000)
        }
    }
}
</script>