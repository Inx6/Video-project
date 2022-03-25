<template>
    <div>
        <van-nav-bar title="注册" right-text="登录" @click-right="onClickRight"/>
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
                method: 'post',
                url: 'api/my/newuser',
                data:{
                    user: values.用户名,
                    password: values.密码
                }
            }).then((res)=>{
                // console.log(res.data);
                if(res.data.status === 202){
                    Toast.success('注册成功！');
                    this.$router.push({
                        path: '/login'
                    })
                }else if(res.data.status === 100){
                    Toast.fail('用户名(密码)不能为空！')
                }else if(res.data.status === 101||res.data.status === 200){
                    Toast.fail('用户名已存在！')
                }
            })
        },
        onClickRight(){
            Toast('登录');
            setTimeout(()=>{
                this.$router.push({
                    path: '/login'
                })
            },1000)
        }
    }
}
</script>