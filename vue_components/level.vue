<template>
  <div style="min-height:667px">
      <div style="margin:0 1rem">
    <div v-if="timeMode" style="height: 3rem;font-size:1.5rem;font-weight: bold" >
      {{ timeStr }}
    </div>
    <h1 style="margin-bottom: 1rem">第{{this.totalLevel}}关</h1>
    <div v-for="(q, index) in current_level_info.Questions" :key="q.Q_No" style="margin-bottom: 1rem" >
        <h3>{{index + 1}}.<span style="color:red;margin-left:0.5rem">{{q.Q_Type === 'MultiAnswers'? '[多选]' : ''}}</span>{{q.Q_Note}}</h3>
        <mt-radio 
          v-if="q.Q_Type === 'OneAnswer'"
          v-model="userAnswers[index]"
          :options="q.Q_Answers">
        </mt-radio>
        <mt-checklist 
          v-if="q.Q_Type === 'MultiAnswers'"
          v-model="userAnswers[index]"
          :options="q.Q_Answers">
        </mt-checklist>
    </div>
    <mt-button type="primary" v-on:click="nextLevel()">下一关</mt-button>
  </div> 
      </div>
</template>
<script>
import axio from '../axio_instance.js';
import { Checklist, Radio, Button, MessageBox } from 'mint-ui';
import {router} from '../index.js';
import Ed from '../util_dialog';
export default {
  data: function() {
    return {
      current_level_info:{},
      userAnswers: [],
      time: -1,
      timeStr: '3分0秒',
      totalPoints: 0,
      totalTime: 0,
      totalLevel: 0,
      timeMode: false,
      usedQuestions: [],
      qType: '',
      inter: 0
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      let param = to.params;
      vm.initLevel(param);
      vm.getQuestions(param.qType, param.time, param.usedQuestions);
    });
  },

  beforeRouteUpdate (to, from, next) {
    let param = to.params;
    this.initLevel(param);
    this.getQuestions(param.qType, param.time, param.usedQuestions);
  },

  methods: {
    initLevel(param) {
      this.totalPoints = 0;
      this.totalTime = 0;
      this.timeMode = false;
      if (param.time) {
        this.time = 180;
        this.timeMode = true;
        this.timeStr = '3分0秒';
      }
      this.current_level_info = {};
      this.userAnswers = [];
      this.totalLevel = param.level + 1;
      this.usedQuestions = param.usedQuestions;
      this.totalPoints += param.result.totalPoints;
      this.totalTime += param.result.totalTime;
      this.qType = param.qType;
    },

    startTiming () {
      this.inter = setInterval(() => {
          if (--this.time === 0) {
              this.nextLevel();
              return;
          }
          let min = Math.floor(this.time / 60), sec = this.time % 60;
          this.timeStr = `${min === 0? '' : min + '分'}${sec}秒`;
      }, 1000);
    },

    endTiming() {
      if (this.inter){
        clearInterval(this.inter);
      }
    },

    getQuestions(qType, timeMode, usedQuestions) {
      axio.axios_ins.post('/api/services/app/exam/GetQuestionJson', {
          categoryName: qType,
          usedFiles: usedQuestions,
      })
      .then(res => {
        let qFileStr = res.data.result;
        if (!qFileStr) {
          MessageBox({
            confirmButtonText: '返回答题首页',
            message: '真棒，题目都答完了',
            showConfirmButton: true
          }).then (action => {
            router.push({path: '/'});
          });
          return;
        }
        this.current_level_info = JSON.parse(res.data.result);
        this.usedQuestions.push(`${this.current_level_info.FileName}.json`);
        if (timeMode) {
          this.startTiming();
        }
        this.current_level_info.Questions.forEach(v => {
          switch(v.Q_Type){
            case 'OneAnswer':
              this.userAnswers.push('');
              break;
            case 'MultiAnswers':
              this.userAnswers.push([]);
              break;
            default:
              break;
          }
        })
      })
      .catch(err => {
        Ed.rStartDialog();
      });
    },

    commitResult(score, costTime, levelFail = false) {
      axio.axios_ins.post('/api/services/app/exam/CommitExam', {
        userId: window.id,
        examMode: Number(!this.timeMode),
        categoryName: this.current_level_info.Q_Type,
        level: levelFail ? this.totalLevel - 1 : this.totalLevel,
        totalScore: this.totalPoints,
        score,
        consumeTime: costTime
      }).catch(rea => {
        MessageBox({
          title: '成绩提交失败',
          message: rea.error.message,
          showConfirmButton: true,
          confirmButtonText: '返回答题首页'
        }).then(res => {
          router.push({path: '/'});
        });
      })
    },

    nextLevel() {
      // FIXME: 此处因为判断答案正确与否做了个filter的闭包，导致有很多外部作用域的field一直存在，应该改善一下
      if (this.timeMode) this.endTiming();
      let uAnswers = this.userAnswers;
      let rightAnswerNo = this.current_level_info.Answers;
      let questions = this.current_level_info.Questions;
      let currentLevelPoint = 0, currentCostTime = 0;
      let rightQ = uAnswers.filter((v, i) => {
        if (questions[i].Q_Type === "OneAnswer") {
          return v === questions[i].Q_Answers[rightAnswerNo[i] - 1];
        } else {
          let rightAnsIndex = rightAnswerNo[i];
          let rightStr = JSON.stringify(rightAnswerNo[i].map(ind => questions[i].Q_Answers[ind - 1]));
          return JSON.stringify(v) === rightStr;
        }
      }) || [];

      // 当前关卡的成绩
      currentLevelPoint = rightQ.length * Math.round(100 / this.current_level_info.Questions.length);
      currentCostTime = 180 - this.time;
      
      this.totalPoints += currentLevelPoint;
      this.totalTime += currentCostTime;

      if (currentLevelPoint < this.current_level_info.PassPoint) {
        this.commitResult(currentLevelPoint, currentCostTime, true);
        MessageBox({
          title: '失败',
          confirmButtonText: '返回答题首页',
          message: '闯关失败',
          showConfirmButton: true
        }).then (action => {
          router.push({path: '/'});
        });
        return;
      }
      
      this.commitResult(currentLevelPoint, currentCostTime);
      let vm = this;
      if(this.totalLevel === 5){
        MessageBox({
          title:'真棒',
          message: '您已经通关了',
          showConfirmButton: true
        }).then( res => {
          router.push({name: 'dashboard', params: { qType: vm.qType, time: vm.timeMode}});
        })
        return;
      }
      router.push(
        {
          name: 'level', 
          params: { 
            level: this.totalLevel,
            usedQuestions: this.usedQuestions,
            qType: this.qType,
            time: this.timeMode,
            result: { 
              totalPoints: this.totalPoints, 
              totalTime: this.totalTime
            } 
          }
        }
      );
    }
  }
}
</script>

