<template>
  <div id="app">
    <navbar></navbar>
    <app-content></app-content>
    <miner-dialog></miner-dialog>
  </div>
</template>

<script>
import AppContent from './components/app-content.vue';
import MinerDialog from './components/miner-dialog.vue';
import Navbar from './components/navbar.vue';

export default {
  name: "App",
  components: {
    Navbar,
    AppContent,
    MinerDialog,
  },
  mounted: function(){
     window.scrollTo(0,0);
   } 
};
</script>
<style >
@import url("./css/app.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
