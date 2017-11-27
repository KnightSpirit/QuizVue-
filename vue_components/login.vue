<style lang="less" scoped>
  .center{
    display: flex;
    position: absolute;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    width: 100%;
    .s_b_group{
      display: flex;
      justify-content: space-around;
      .s_b{
        width: 30%;
      }
    }
  }
</style>
<template>
  <div class="center">
    <div style="text-align:center;">
      <h1>闯关答题</h1>
    </div>
    <div style="text-align: center">
     <mt-field label="段名" placeholder="请输入段名" v-model="dev"></mt-field>
     <mt-field label="用户名" placeholder="请输入用户名" type="text" v-model="user"></mt-field>
     <mt-field label="密码" placeholder="请输入密码" type="password" v-model="pwd"></mt-field> 
     <mt-button type="primary" style="margin-top:1rem" size="normal" v-on:click="login()">开始闯关</mt-button>
    </div>
  </div>
</template>

<script>
import {router} from '../index.js';
import axio from '../axio_instance';
import { MessageBox, Indicator } from 'mint-ui';
export default {
  data:() => {
    return {
      dev: '',
      user: '',
      pwd:''
    }
  },
  methods:{
    login(){
      Indicator.open('登录中...');
      axio.axios_ins
        .post('/api/Account', {
          tenancyName: this.dev,
          usernameOrEmailAddress: this.user,
          password: this.pwd
        })
        .then(res => {
          window.AuthCode = res.data.result;
          axio.axios_ins.defaults.headers.common['Authorization'] = `Bearer ${window.AuthCode}`
          axio.axios_ins.post('/api/services/app/session/GetCurrentLoginInformations', {})
            .then(res => {
              window.id = res.data.result.user.id;
              router.push({name: 'start'});
              Indicator.close();
            })
        })
        .catch(err => {
          Indicator.close();
          MessageBox({
            title: '登录失败',
            message: `${err.response.data.error.details}`,
            showConfirmButton: true
          });
        });
    }
  }
}

</script>

