<template>
    <div :class="isDialog ? 'miner_dialog miner_dialog_open' : 'miner_dialog'">
        <div class="miner_dialog_windowe">
          <div class="windowe_head">
            <span>{{ LANG.minerManagement }}</span>
            <div class="close" @click="closeDialog">×</div>
          </div>
          <div class="windowe_body">
            <div class="body_tilt">
              <ul>
                <li
                  v-for="title in bodyTitle"
                  :key="title.id"
                  :class="'li_' + title.id"
                >
                  {{ title.title }}
                </li>
              </ul>
            </div>
            <div class="body_content">
              <transition-group name="list" tag="ul">
                <li
                  v-for="(miner, index) in minerList"
                  v-bind:key="miner.minerID"
                >
                  <div class="li_1">{{ index }}</div>
                  <div class="li_2">{{ miner.minerID }}</div>
                  <div class="li_3">
                    <input
                      v-model="editName"
                      v-if="isEdit && editKey === index"
                      type="text"
                      autofocus
                    />
                    <span v-else>{{ miner.name }}</span>
                  </div>
                  <div class="li_4">
                    <button
                      @click="editButton(index, miner.name)"
                      :style="isEdit && editKey === index ? 'color: #1890ff' : ''"
                      :disabled="isEdit && editKey !== index ? true : false"
                      :class="isEdit && editKey !== index ? 'no_button' : ''"
                    >
                      {{ isEdit && editKey === index ? LANG.done : LANG.edit }}
                    </button>
                    <button
                      @click="removeMiner(index)"
                      :class="isEdit ? 'no_button del_button' : 'del_button'"
                      :disabled="isEdit ? true : false"
                    >
                      {{ LANG.delete }}
                    </button>
                    <button
                      :style="index === 0 ? 'opacity: 0.5' : ''"
                      :disabled="index === 0 || isEdit ? true : false"
                      @click="moveMiner(index, 'up')"
                      :class="isEdit ? 'no_button' : ''"
                    >
                      <div class="iconfont span_up">&#xe60b;</div>
                    </button>
                    <button
                      :style="
                        index === minerList.length - 1 ? 'opacity: 0.5' : ''
                      "
                      :disabled="
                        index === minerList.length - 1 || isEdit ? true : false
                      "
                      @click="moveMiner(index, 'down')"
                      :class="isEdit ? 'no_button' : ''"
                    >
                      <span class="iconfont">&#xe60b;</span>
                    </button>
                  </div>
                </li>
              </transition-group>
            </div>
            <div class="body_bottom">
              <div class="body_bottom_from">
                <input v-model="minerID" :placeholder="LANG.inputId" />
                <input v-model="name" :placeholder="LANG.inputName" />
                <button-view
                  :disabled="!isInputFlag"
                  @click="addMiner"
                  :className="isInputFlag ? '' : 'no_button'"
                  >{{ LANG.add }}</button-view
                >
              </div>
            </div>
          </div>
          <div class="windowe_footer">
            <div class="footer_right">
              <button-view :className="'footer_button'" @click="closeDialog">{{
                LANG.cancel
              }}</button-view>
              <button-view :className="'footer_button'" @click="doneClick">{{
                LANG.done
              }}</button-view>
            </div>
            <div class="footer_left">
              <button-view
                :className="'footer_button'"
                @click="importMinerList"
                >{{ LANG.import }}</button-view
              >
              <button-view
                :className="'footer_button'"
                @click="exportMinerList()"
                >{{ LANG.export }}</button-view
              >
            </div>
          </div>
        </div>
    </div>
  </template>
  <script>
  import buttonView from "./button-view.vue";
  import { mapState } from "vuex";
  import copy from "copy-to-clipboard";
  import Message from "./message";
  
  export default {
    components: { buttonView },
    name: "miner-dialog",
    props: {},
    data: function () {
      return {
        minerList: [],
        minerID: "",
        name: "",
        isInputFlag: false,
        isEdit: false,
        editKey: "",
        editName: "",
      };
    },
    methods: {
      isInput() {
        this.isInputFlag = Boolean(this.minerID && this.name);
      },
      addMiner() {
        let minerID = trimString(this.minerID);
        let name = trimString(this.name);
        if (this.minerList.find((miner) => miner.minerID === minerID)) {
          Message(this.LANG.addMessage);
          this.minerID = "";
          this.name = "";
          return;
        }
  
        this.$store.commit("addMiner", { minerID, name });
        this.minerList.unshift({ minerID, name });
        this.minerID = "";
        this.name = "";
        localStorage.setItem("minerList", JSON.stringify(this.minerList));
  
        Message(this.LANG.addDone);
      },
      importMinerList() {
        let importList = [];
  
        try {
          importList = JSON.parse(prompt("请输入需要导入的节点...", ""));
        } catch {
          Message(this.LANG.importErrer);
          return;
        }
  
        let minerList = this.minerList.concat();
  
        for (let index in this.minerList) {
          let minerID = this.minerList[index].minerID;
          let miner = importList.find((miner) => miner.minerID === minerID);
  
          if (miner) {
            let minerKey = minerList.findIndex(
              (miner) => miner.minerID === minerID
            );
            minerList.splice(minerKey, 1);
          }
        }
        let newMinerList = [].concat(importList, minerList);
  
        this.minerList = newMinerList.concat();
        this.$store.commit("updataMinerList", newMinerList);
  
        localStorage.setItem("minerList", JSON.stringify(newMinerList));
        Message(this.LANG.importDone);
      },
      exportMinerList() {
        let minerList = localStorage.getItem("minerList");
  
        copy(minerList);
        Message(this.LANG.exportDone);
      },
      closeDialog() {
        this.minerList = this.stateMinerList.concat();
        this.$store.commit("clickDialog", false);
        this.editKey = "";
        this.isEdit = false;
        this.minerID = "";
        this.name = "";
      },
      removeMiner(index) {
        this.minerList.splice(index, 1);
      },
      moveMiner(index, type) {
        let minerList = this.minerList.concat();
  
        switch (type) {
          case "up":
            minerList[index] = this.minerList[index - 1];
            minerList[index - 1] = this.minerList[index];
            break;
          case "down":
            minerList[index] = this.minerList[index + 1];
            minerList[index + 1] = this.minerList[index];
            break;
          default:
            break;
        }
        this.minerList = minerList;
      },
      editButton(index, name) {
        if (!this.isEdit) {
          this.editKey = index;
          this.editName = name;
        } else {
          let name = this.editName;
          let minerID = this.minerList[index].minerID;
          let minerList = this.minerList.concat();
          minerList[index] = { minerID, name };
          this.minerList = minerList;
          this.editKey = "";
          this.editName = "";
        }
        // console.log(this.editName);
        this.isEdit = !this.isEdit;
      },
      doneClick() {
        this.editKey = "";
        this.isEdit = false;
        this.$store.commit("clickDialog", false);
        this.$store.commit("updataMinerList", this.minerList.concat());
        localStorage.setItem("minerList", JSON.stringify(this.minerList));
        this.minerID = "";
        this.name = "";
        Message(this.LANG.done + "...");
      },
    },
    computed: {
      ...mapState({
        stateMinerList: (state) => state.minerList,
        isDialog: (state) => state.isDialog,
        LANG: (state) => state.LANG,
      }),
      bodyTitle: function () {
        return [
          { id: 1, title: this.LANG.index },
          { id: 2, title: this.LANG.minerId },
          { id: 3, title: this.LANG.name },
          { id: 4, title: this.LANG.action },
        ];
      },
    },
    created: function () {
      // console.log("dialog: created");
      this.minerList = this.stateMinerList.concat();
    },
    watch: {
      minerID: function () {
        this.isInput();
      },
      name: function () {
        this.isInput();
      },
    },
    mounted: function(){
      // console.log("dialog: mounted")
    }
  };
  
  function trimString(str) {
    let s = "";
    for (let i of str) {
      if (i === " ") {
        continue;
      }
      s += i;
    }
    return s;
  }
  </script>
  
  <style>
  @media screen and (max-height: 600px) {
    .miner_dialog_windowe {
      top: 3% !important;
      max-height: 90%;
    }
  }
  .windowe-enter {
    top: 0;
    margin: 0;
    right: 0;
    height: 0;
    position: absolute;
    width: 0;
    transition: 0.5s;
  }
  
  .list-leave-active {
    position: absolute;
  }
  .list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }
  .list-enter {
    opacity: 0;
    transform: translateX(30px);
  }
  .list-move {
    transition: transform 1s;
  }
  
  .del_button {
    color: rgba(5, 4, 4, 0.719) !important;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 32px;
    display: flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #666565;
    transition: 0.3s;
  }
  .close:hover {
    opacity: 0.7;
    font-size: 33px;
  }
  
  .miner_dialog_open {
    display: block !important;
  }
  
  .miner_dialog {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: rgba(121, 118, 118, 0.541);
    z-index: 10;
    display: none;
  }
  .miner_dialog_windowe {
    width: 90%;
    max-width: 600px;
    height: 400px;
    background-color: white;
    margin: 0 auto;
    position: relative;
    top: 10%;
    text-align: center;
    box-shadow: 0 0 10px 0 #bbb9b9;
    border-radius: 10px;
  }
  .windowe_head {
    width: 100%;
    height: 10%;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
  }
  .windowe_body {
    width: 100%;
    height: 70%;
    border-top: 2px solid #e5e5e5;
    border-bottom: 2px solid #e5e5e5;
    position: relative;
  }
  .windowe_footer {
    width: 100%;
    height: 19%;
    position: relative;
  }
  .footer_right {
    position: absolute;
    right: 0;
    bottom: 10%;
    margin-right: 10px;
  }
  .footer_button {
    margin-left: 10px;
  }
  .footer_left {
    position: absolute;
    left: 0;
    bottom: 10%;
  }
  .footer_left .footer_button {
    background-color: white !important;
    padding: 0 8px;
    color: rgba(14, 13, 13, 0.568);
    border: 1px solid #666565;
  }
  .body_tilt,
  .body_content,
  .body_bottom {
    width: 90%;
    margin: 0 auto;
  }
  .body_tilt {
    height: 10%;
  }
  .body_content {
    height: 70%;
    border: 1px solid #e5e5e5;
  }
  .body_bottom {
    height: 20%;
    overflow: hidden;
    position: relative;
  }
  .body_tilt ul {
    justify-content: center;
    display: flex;
    overflow: hidden;
    align-items: center;
    white-space: nowrap;
    font-size: 13px;
    height: 100%;
  }
  .body_tilt li {
    opacity: 0.8;
    vertical-align: sub;
  }
  .body_content {
    overflow: auto;
  }
  .body_content ul li {
    display: flex;
    padding: 1px 0;
    border-bottom: 1px solid #e5e5e5;
    font-size: 14px;
    transition: 0.3s;
  }
  .body_content .li_1,
  .body_content .li_2,
  .body_content .li_3,
  .body_content .li_4 {
    white-space: nowrap;
    overflow: hidden;
    min-height: 20px;
  }
  .body_bottom_from {
    position: absolute;
    bottom: 15%;
    right: 0;
    white-space: nowrap;
    overflow: hidden;
  }
  .body_bottom_from input {
    /* float: left; */
    margin-right: 4%;
    padding: 2px 5px;
    width: 30%;
    height: 20px;
    border: 1px solid #adabab7c;
    border-radius: 5px;
    outline: none;
    font-size: 12px;
  }
  .body_bottom_from button {
    float: right;
  }
  .li_1 {
    width: 10%;
  }
  .li_2 {
    width: 20%;
  }
  .li_3 {
    width: 30%;
  }
  .li_4 {
    width: 40%;
  }
  .no_button,
  .no_button:hover {
    opacity: 0.5 !important;
  }
  .body_content .li_4 {
    display: flex;
    justify-content: space-around;
    font-size: 13px;
  }
  .body_content .li_4 button {
    font-size: 12px;
    width: 20%;
    cursor: pointer;
    background-color: white;
    border: 1px solid #adabab7c;
    border-radius: 5px;
    padding: 0;
    color: #080808c9;
  }
  .span_up {
    transform: rotate(180deg);
  }
  .li_3 input {
    width: 80%;
    border: 1px solid #adabab7c;
    border-radius: 5px;
    outline: none;
    text-align: center;
  }
  </style>