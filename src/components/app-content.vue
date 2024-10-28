<template>
    <div class="app_content">
      <miner-table></miner-table>
    </div>
  </template>
  <script>
  import MinerTable from "./miner-table.vue";
  
  export default {
    components: {MinerTable},
    name: "app-content",
    data: function () {
      return {};
    },
    methods: {},
    computed: {},
  };
  </script>
  
  <style scoped>
  </style>