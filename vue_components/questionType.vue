<style lang="less" scoped>
</style>
<template>
  <div style="padding-top: 2rem">
    <h2 style="text-align:center;margin-bottom:30px;" >选择答题类型</h2>
    <ul>
      <li style="font-size:1.35rem; margin-bottom:1rem; padding-left:0.5rem" v-for="(type, ind) in qTypes" :key="type.index"  v-on:click="getQuestions(type.value)">
        <mt-badge size="normal" color="red">{{ind + 1}}</mt-badge>
        <span style="margin-left: 0.5rem">{{ type.value }}</span> 
      </li>
    </ul>
  </div>
</template>
<script>
import {router} from '../index.js';
import axio from '../axio_instance.js';
import Ed from '../util_dialog';
export default {
  data: () => {
    return {
      qTypes: [],
      where: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.where = to.params.where;
      axio.axios_ins
        .post('/api/services/app/exam/GetQuestionCategory', {})
        .then(res => {
          vm.qTypes = res.data.result.map((v, i) => ({index: i, value: v}));
        })
        .catch(err => {
          Ed.rStartDialog();
        });
    });
  },
  methods: {
    getQuestions(qType) {
      router.push({ name: 'mode', params: { type: qType, where: this.where, list: this.qTypes }})
    }
  }
}
</script>

