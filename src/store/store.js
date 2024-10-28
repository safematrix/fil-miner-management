import Vuex from 'vuex';
import Vue from 'vue';
// import axios from 'axios';
import { getHeight, getTipsetKey } from '../api/miner-data-api'

let minerList = JSON.parse(localStorage.getItem('minerList'));


if (!minerList || minerList.length === 0) {
    minerList = [
    ]
}

let lang = localStorage.getItem('lang');

if (!lang) {
    lang = 'EN';
}
let LANG
switch (lang) {
    case 'EN':
        LANG = require('../locale/enUS.json')
        break;
    default:
        LANG = require('../locale/zhCN.json')
}

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        minerList: minerList,
        isDialog: false,
        tipsetKey: '',
        height: '',
        LANG: LANG,
    },
    mutations: {
        addMiner(state, action) {
            state.minerList.unshift(action);
        },
        updataMinerList(state, action) {
            state.minerList = action;
        },
        clickDialog(state, action) {
            state.isDialog = action;
        },
        updataTipsetKey(state, action) {
            state.tipsetKey = action;
        },
        updataHeight(state, action) {
            state.height = action;
        },
        clickLang(state, action) {
            state.LANG = action;
        }
    },
    actions: {
        async setTipsetKey(cx) {

            let height = await getHeight();
            let tipsetKey = await getTipsetKey(height);

            cx.commit('updataTipsetKey', tipsetKey);
            cx.commit('updataHeight', height);
        }
    },
    getters: {

    }
});
