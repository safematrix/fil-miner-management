<template>
    <transition-group class="miner_table" name="list" tag="div">
      <miner-info
        v-for="miner in minerList"
        :key="miner.minerID"
        :miner="miner"
      ></miner-info>
    </transition-group>
  </template>
  
  <script>
  import MinerInfo from "./miner-info.vue";
  import { mapState } from "vuex";
  
  export default {
    components: { MinerInfo },
    name: "miner-table",
    data: function () {
      return {
        timer: undefined,
      };
    },
    methods: {},
    computed: {
      ...mapState({
        minerList: (state) => state.minerList,
      }),
    },
    mounted() {
      this.$store.dispatch("setTipsetKey");
      this.timer = setInterval(() => this.$store.dispatch("setTipsetKey"), 30000);
    },
    destroyed: function () {
      clearInterval(this.timer);
    },
  };
  </script>
  
  <style scoped>
  .miner_table {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  </style>