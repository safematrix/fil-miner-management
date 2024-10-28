<template>
  <div class="miner_info">
    <table cllPadding="5">
      <tr>
        <th colspan="4">
          <span>{{ miner.minerID }} ({{ miner.name }})</span>
          <div class="head_title_icon">
            <img :src="filfoxImg" @click="openFilfox" />
            <img :src="filscoutImg" @click="openFilscout" />
          </div>
        </th>
      </tr>
      <tr>
        <td>{{ LANG.adjustedPower }}</td>
        <td>
          <span>{{ power.qualityAdjPower }}</span>
        </td>
        <td>{{ LANG.rawPower }}</td>
        <td>
          <span>{{ power.rawBytePower }}</span>
        </td>
      </tr>
      <tr>
        <td>{{ LANG.totalSectors }}</td>
        <td>
          <span>{{ sector.Live }}</span>
        </td>
        <td>{{ LANG.activeSectors }}</td>
        <td>
          <span>{{ sector.Active }}</span>
        </td>
      </tr>
      <tr>
        <td>{{ LANG.faultySectors }}</td>
        <td>
          <span :style="sector.Faulty > 0 ? 'color: red' : ''">{{
            sector.Faulty
          }}</span>
        </td>
        <td>{{ LANG.minerAvailable }}</td>
        <td>
          <span>{{ minerBalance }}</span>
        </td>
      </tr>
      <tr>
        <td>{{ LANG.workerBalance }}</td>
        <td>
          <span>{{ workerBalance }}</span>
        </td>
        <td>{{ LANG.controlBalance }}</td>
        <td>
          <span>{{ controlBalance }}</span>
        </td>
      </tr>
      <tr>
        <th colspan="4" class="miner_info_bottom">
          {{ footerText }}
        </th>
      </tr>
    </table>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  getPower,
  getSector,
  getBalance,
  getMiner,
  getSectorNumber,
} from "../api/miner-data-api";

// let i =0;
export default {
  name: "miner-info",
  props: {
    miner: {
      type: Object,
    },
  },
  data: function () {
    return {
      power: {},
      sector: {},
      minerBalance: "",
      workerBalance: "",
      controlBalance: "",
      oldSector: {},
      poStProofType: "",
      filfoxImg: require("../assets/img/fil.png"),
      filscoutImg: require("../assets/img/filfox.png"),
    };
  },
  methods: {
    openFilfox: function () {
      window.open("https://www.filutils.com/en/miner/" + this.minerID);
    },
    openFilscout: function () {
      window.open("https://filfox.info/en/address/" + this.minerID);
    },
    getData: async function () {
      let val = this.tipsetKey;

      this.power = await getPower(this.minerID, val);
      this.sector = await getSector(this.minerID, val);
      let wcBalance = await getBalance(this.minerID, val);
      if (!wcBalance) {
        this.workerBalance = 0;
        this.controlBalance = 0;
      } else {
        this.workerBalance = wcBalance.workerBalance;
        this.controlBalance = wcBalance.controlBalance;
      }
      this.poStProofType = wcBalance.poStProofType;
      this.minerBalance = await getMiner(this.minerID, val);
      this.oldSector = await getSectorNumber(
        this.minerID,
        this.height,
        this.poStProofType,
        this.sector.Live
      );
    },
  },
  computed: {
    ...mapState({
      tipsetKey: (state) => state.tipsetKey,
      height: (state) => state.height,
      LANG: (state) => state.LANG,
    }),
    minerID: function () {
      return this.miner.minerID;
    },
    footerText: function () {
      let lang = this.LANG.lang;
      let text = "";
      switch (lang) {
        case "EN":
          text = `${this.oldSector.sectorPower} Sector and ${this.oldSector.sectorNumber} TiB increased in 24 hours`;
          break;

        default:
          text = `24h 增长 ${this.oldSector.sectorNumber} 个 Sector ${this.oldSector.sectorPower} TiB`;
          break;
      }

      return text;
    },
  },
  mounted: function () {
    // console.log("miner-info: mounted");
    // console.log(this.tipsetKey);
    if (this.tipsetKey) {
      // console.log("za")
      this.getData();
    }
  },
  watch: {
    height: function () {
      // console.log("miner-info: watch");
      this.getData();
      // console.log(this.sector);
    },
  },
};
</script>

<style>
@media screen and (max-width: 600px) {
  .miner_info td {
    width: 80px !important;
    max-width: 80px !important;
    font-size: 14px;
  }
  .miner_info td span {
    font-size: 12px !important;
    font-weight: 400 !important;
  }
}
.head_title_icon img {
  width: 25px;
  height: 25px;
  cursor: pointer;
  margin-left: 15px;
}
.head_title_icon {
  position: absolute;
  right: 10px;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  background-color: white;
}

.miner_info {
  margin: 20px 10px;
  padding: 20px;
  color: #2c3e50;
  /* min-width: 350px; */
  box-shadow: 0 1px 15px 0 #dcdada;
  border-radius: 10px;
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.miner_info table {
  width: 100%;
  position: relative;
  background-color: #e5e5e5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.miner_info tr {
  height: 30px;
  width: 100%;
  text-align: center;
  position: relative;
}
.miner_info td {
  width: 97px;
  max-width: 97px;
  font-weight: 500;
  font-size: 13px;
}
.miner_info td span {
  font-size: 14px;
  font-weight: 300;
}
.miner_info th {
  font-weight: 400;
  font-size: 16px;
  position: relative;
  overflow: hidden;
}
.miner_info td,
.miner_info th {
  background-color: white;
  white-space: nowrap;
  overflow: hidden;
}
.miner_info_bottom {
  font-weight: 400 !important;
  font-size: 15px !important;
}
</style>
