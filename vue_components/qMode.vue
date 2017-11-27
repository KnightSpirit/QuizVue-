<style lang="less" scoped>
  .center{
    height:527px; 
    width: 100%;
    display:flex;
    justify-content: space-around; 
    flex-direction: column;
    text-align: center;
    align-items: center;
    .q_b {
      width: 50%;
    }
  }
</style>

<template>
  <div class="center">
    <div style="width:100%">
      <mt-button class="q_b" type="primary" size="normal" v-on:click="toNext(true)">限时闯关</mt-button>
      <div style="height:50px; width:10px;"></div>
      <mt-button class="q_b" type="primary" size="normal" v-on:click="toNext()">无限闯关</mt-button>
    </div>
  </div>  
</template>
<script>
import {router} from '../index.js';
export default {
  data: () => {
      return {
        type: '',
        where: '',
        types: []
      }
    },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.type = to.params.type;
      vm.where = to.params.where;
      vm.types = to.params.list;
    });
  },
  methods:{
    toNext(time = false) {
      if (this.where === 'score') {
        router.push({name: 'dashboard', params: { qType: this.type, time: time, types: this.types }});
      } else {
        router.push({
          name: 'level', 
          params: { 
            level: 0,
            qType: this.type, 
            time: time, 
            usedQuestions:[], 
            result:{
              totalPoints: 0, 
              totalTime: 0
            }
        }});
      }
    }
  }
}
</script>

