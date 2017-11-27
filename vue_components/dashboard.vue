<style lang="less" scoped>
  table thead tr th{
    text-align: left;
    font-size: 1.2rem;
  }
  table tbody tr td {
    font-size: 1rem;
    height: 2rem;
    padding: 0.9rem 0;
  }
  .myResult {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    background-color: brown
  }
</style>

<template>
  <div style="width:100%;" id="dashboard" >
    <h1 style="text-align:center;margin-bottom: 1rem">{{time ? '限时闯关': '无限闯关'}}排行榜</h1>  
    <h2 style="text-align:center;margin-bottom: 1rem;color:grey">{{ category }}</h2>
    <div style="display: flex; justify-content:center">
      <mt-button type="primary" size="normal" @click="selectCate" >切换</mt-button>
      <mt-button type="primary" size="normal" @click="startPage" >首页</mt-button>
    </div>
    <table style="width:98%">
      <thead style="margin-bottom: 1rem">
        <tr>
          <th></th>
          <th>姓名</th>
          <th>得分</th>
          <th>闯关数</th>
          <th v-if="time">时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, ind) in showResults" :key="r.name">
          <td>
            <mt-badge size="normal" v-if="ind <= 2" color="red">{{ind + 1}}</mt-badge>
            <mt-badge size="normal" v-if="ind > 2" color="black">{{ind + 1}}</mt-badge>
          </td>
          <td>{{r.name}}</td>
          <td>{{r.score}}</td>
          <td>{{r.levelCount}}</td>
          <td v-if="time">{{r.consumeTime}}</td>
        </tr>
      </tbody>
    </table>
    <div class="myResult">
      <span style="margin-left: 2%; font-weight: bold; ">{{userResult.name}}:</span>
      <span>得分:{{userResult.score}}</span>
      <span>闯关数:{{userResult.levelCount}}</span>
      <span v-if="time">总时间{{userResult.consumeTime}}</span>
    </div>
    <mt-popup
      v-model="typeChange"
      closeOnClickModal="false"
      position="bottom">
      <div style="width:100%">
        <mt-picker :slots="slots" @slotValueChange="changeType" ></mt-picker>
        <mt-button type="primary" size="large" @click="confirmCategory"  plain>选定</mt-button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import axio from '../axio_instance';
import {router} from '../index.js';
import { Indicator } from 'mint-ui';
export default {
  data: function(){
    return {
      time: false,
      timeExamScore: [],
      endlessExamScore: [],
      userEndlessExamScore: {},
      userTimeExamScore: {},
      showResults: [],
      userResult: {},
      typeChange: false,
      slots: [],
      category: '',
    }
  },

  methods: {
    selectCate () {
      this.typeChange = true;
    },

    startPage(){
      router.push({ path: '/'});
    },

    changeType(picker, values) {
      let pickerValue = picker.currentValue;
      if (!pickerValue) return;
      if (pickerValue.includes('闯关')) {
        switch(pickerValue){
          case '无限闯关':
            this.time = false;
            break;
          case '计时闯关':
            this.time = true;
        }
      } else{
        this.category = pickerValue;
      }
    },

    confirmCategory() {
      this.getResult();
      this.typeChange = false;
    },

    getResult(){
      Indicator.open();
      try {
        axio.axios_ins.post('/api/services/app/exam/GetRank', {
          categoryName: this.category
        })
        .then(async res => {
          let d = res.data.result;

          this.timeExamScore = d.timeExamScore || [];
          this.endlessExamScore = d.endlessExamScore || [];
          this.userEndlessExamScore = d.userEndlessExamScore || {};
          this.userTimeExamScore = d.userTimeExamScore || {};
          this.showResults = this.time ? this.timeExamScore : this.endlessExamScore;
          this.userResult = this.time ? this.userTimeExamScore : this.userEndlessExamScore;
          
          Indicator.close();
        })
      } catch (error) {
        
      }
    }
  },

  beforeRouteEnter(to, from, next){
    next(async vm => {
      document.getElementById('dashboard').style.minHeight = window.screen.availHeight + 'px';
      let { time, qType} = to.params;
      let types = await axio.axios_ins.post('/api/services/app/exam/GetQuestionCategory', {}) 
      vm.time = time;
      vm.category = qType;
      vm.typeChange = false,
      vm.slots = [
        {
          flex:1,
          values: ['无限闯关', '计时闯关'],
          textAlign: 'center',
        },
        {
          flex:1,
          values: types.data.result,
          textAlign: 'center',
        } 
      ];
      vm.getResult();
    })
  },
}
</script>

