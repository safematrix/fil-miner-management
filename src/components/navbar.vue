<template>
  <div class="navbar">
    <div class="navbar_right">
      <dropdown
        className="lang_down"
        @listClick="langClick($event)"
        :items="langItems"
      >
        <template v-slot:icon>
          <span class="iconfont">&#xe60c;</span>
        </template>
        <template v-slot:text> {{ LANG.lang }} </template>
      </dropdown>
      <button-view
        className="navbar_button iconfont"
        @click="minerButtonClick()"
        >&#xe60b5;&nbsp;{{ LANG.minerManagement }}</button-view
      >
    </div>
  </div>
</template>

<script>
import ButtonView from "./button-view.vue";
import Dropdown from './drop-down.vue';
import { mapState } from "vuex";

export default {
  components: {
    Dropdown,
    ButtonView,
  },
  name: "navbar",
  data: function () {
    return {
      langItems: ["中文", "EN"],
    };
  },
  methods: {
    langClick(item) {
      let LANG;
      switch (item) {
        case "EN":
          LANG = require("../locale/enUS.json");
          break;

        default:
          LANG = require("../locale/zhCN.json");
          break;
      }
      localStorage.setItem("lang", item);
      this.$store.commit("clickLang", LANG);
    },
    minerButtonClick() {
      if (!this.isDialog) {
        this.$store.commit("clickDialog", true);
      }
    },
  },
  computed: {
    ...mapState({
      isDialog: (state) => state.isDialog,
      LANG: (state) => state.LANG,
    }),
  },
};
</script>

<style>
.navbar {
  width: 90%;
  height: 50px;
  margin: 0 5%;
  position: relative;
}
.navbar_right {
  display: inline-block;
  position: absolute;
  right: 0;
  bottom: 0;
}
.lang_down {
  color: #1890ff !important;
}
.navbar_button {
  margin-left: 10px;
  font-size: 18px !important;
}
</style>
