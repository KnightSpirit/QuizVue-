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
    <div class="s_b_group">
      <mt-button type="primary" class="s_b" size="normal" v-on:click="startToQuest()">闯关答题</mt-button>
      <mt-button type="primary" class="s_b" size="normal" v-on:click="startToQuest(true)">排行榜</mt-button>
    </div>
  </div>
</template>

<script>
import {router} from '../index.js';
import axio from '../axio_instance';
import { MessageBox } from 'mint-ui';
export default {
  methods:{
    startToQuest(score = false){
      if (!window.id || !window.AuthCode) {
        MessageBox({
          title:'错误',
          message: '未登录',
          showConfirmButton: true
        }).then( res => {
          router.push({path: '/'});
        })
        return;
      }
      axio.axios_ins.defaults.headers.common['Authorization'] = `Bearer ${window.AuthCode}`
      if (score) {
        router.push({ name: 'selectQuestion', params: { where: 'score'}});
      } else {
        router.push('selectQuestion');
      }
    }
  }
}

</script>

