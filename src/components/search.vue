<template>
    <div>
        <div>
            <van-field
            v-model="value"
            center
            clearable
            left-icon="search"
            placeholder="请输入内容"
            >
            <template #button>
                <van-button @click="changes" size="small" color="rgb(255.255.255)" plain>搜索</van-button>
            </template>
            </van-field>

            <van-collapse v-model="activeName" style="text-align:left" accordion v-for="(item,index) in info" :key="index" >
                <div @click="know(item.video_id)" style="width:100%">
                    <van-collapse-item :title="item.title" name="index"></van-collapse-item>
                </div>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
import { Grid, GridItem } from 'vant';
import { Field } from 'vant';
import axios from 'axios';
import { Collapse, CollapseItem } from 'vant';
import { Popup } from 'vant';

Vue.use(Popup);

Vue.use(Collapse);
Vue.use(CollapseItem);

Vue.use(Field);
Vue.use(Grid);
Vue.use(GridItem);
export default {
    name: 'search',
    data(){
        return{
            show: false,
            activeName: '1',
            value: '',
            info: []
        }
    },
    mounted(){
        // console.log(this.$route.params.value);
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
            }
        })
        
    },
    methods:{
        onCancel() {
            Toast('取消');
        },
        know(key){
            // console.log(key);
            this.$router.push({
                path: 'know',
                query: {
                    video_id: key
                }
            })
        },
        changes(){
            const token = localStorage.getItem('token');
            axios.get('api/videos/search',{
                headers:{
                    Authorization: token
                },
                params:{
                    title: this.value
                }
            }).then((res)=>{
                // console.log(res.data)
                if(res.data.status === 202){
                    this.info = res.data.data;
                    Toast.success('搜索成功！');
                    this.value = '';
                    // console.log(this.info);
                }else{
                    Toast.fail('暂无信息');
                    this.info =[]
                }
            })
        }
    }
}
</script>