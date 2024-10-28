import axios from 'axios'

const url = "https://rpc-product.safematrix.io/json-rpc/http/filecoin";

export async function getHeight() {
  let height = await getData([], "Filecoin.ChainHead");
  height = height.data.result.Height;
  return height;
}

export async function getTipsetKey(height) {
  let tipsetKey = await getData([height, null], "Filecoin.ChainGetTipSetByHeight");
  tipsetKey = tipsetKey.data.result.Cids

  return tipsetKey;
}

export async function getPower(minerID, tipsetKey) {
  // console.log(minerID)
  const res = await getData([minerID, tipsetKey], "Filecoin.StateMinerPower");
  const result = res.data.result.MinerPower;

  let qualityAdjPower = calculatePower(result.QualityAdjPower) + " TiB";
  let rawBytePower = calculatePower(result.RawBytePower) + " TiB";
  let data = { qualityAdjPower, rawBytePower }

  return data;
}

export async function getSector(minerID, tipsetKey) {
  let sector = await getData([minerID, tipsetKey], "Filecoin.StateMinerSectorCount");
  sector = sector.data.result;

  return sector;
}

export async function getMiner(minerID, tipsetKey) {
  let res = await getData([minerID, tipsetKey], "Filecoin.StateMinerAvailableBalance")
  let value;
  const result = res.data.result;

  value = (result / 10 ** 18).toFixed(3) + " Fil";

  return value;
}

export async function getBalance(minerID, tipsetKey) {
  let res = await getData([minerID, tipsetKey], "Filecoin.StateMinerInfo")
  let workeraddress = 0;
  let controladdress = 0;
  let workerBalance = '';
  let controlBalance = '';

  const result = res.data.result;

  if (!result) {
    return;
  }

  let poStProofType = result.WindowPoStProofType;
  // getOldTipKey(minerID, live, value)

  if (result.Worker !== null) {
    workeraddress = result.Worker;

    if (workeraddress !== "") {
      // console.log(workeraddress)
      workerBalance = await getWorkerControl(workeraddress, 1, tipsetKey);
    } else {
      workerBalance = 0 + " Fil";
    }
  }

  if (result.ControlAddresses !== null) {
    controladdress = result.ControlAddresses[0];

    if (controladdress !== "") {

      controlBalance = await getWorkerControl(controladdress, 2, tipsetKey);
    } else {
      controlBalance = 0 + " Fil";
    }
  }

  return { workerBalance, controlBalance, poStProofType };
}
export async function getWorkerControl(e, i, tipsetKey) {
  // console.log(e)
  let res = await getData([e, tipsetKey], "Filecoin.StateGetActor")
  let value;
  const result = res.data.result.Balance / 10 ** 18;

  if (i === 1) {
    value = result.toFixed(3) + " Fil";

    return value;
  } else if (i === 2) {
    value = result.toFixed(3) + " Fil";

    return value;
  }
}

export async function getOldTipKey(height) {
  const oldHeight = await height - 24 * 60 * 60 / 30;
  let res = await getData([oldHeight, null], "Filecoin.ChainGetTipSetByHeight");
  let oldTipsetKey = res.data.result.Cids;
  return oldTipsetKey;
}

export async function getSectorNumber(minerID, height, sealProofType, live) {

  let oldTipsetKey = await getOldTipKey(height);
  let res = await getData([minerID, oldTipsetKey], "Filecoin.StateMinerSectorCount");

  let sectorNumber = 0;
  let sectorPower = 0;

  let objerror = !res.data.error;

  if (objerror) {
    const oldLive = res.data.result.Live;

    sectorNumber = (live - oldLive);
    switch (sealProofType) {
      case 0:
        sectorPower = sectorNumber * 2 / (1024 ** 3);
        break;
      case 1:
        sectorPower = sectorNumber * 8 / (1024 ** 2);
        break;
      case 2:
        sectorPower = sectorNumber * 512 / (1024 ** 2);
        break;
      case 3:
        sectorPower = sectorNumber * 32 / 1024;
        break;
      case 4:
        sectorPower = sectorNumber * 64 / 1024;
        break;
      case 5:
      case 10:
        sectorPower = sectorNumber * 2 / (1024 ** 3);
        break;
      case 6:
      case 11:
        sectorPower = sectorNumber * 8 / (1024 ** 2);
        break;
      case 7:
      case 12:
        sectorPower = sectorNumber * 512 / (1024 ** 2);
        break;
      case 8:
      case 13:
        sectorPower = sectorNumber * 32 / 1024;
        break;
      case 9:
      case 14:
        sectorPower = sectorNumber * 64 / 1024;
        break;
      default:
        break;
    }
  }

  return { sectorNumber, sectorPower };
}


function getData(params, method) {
  return axios.post(
    url,
    {
      "jsonrpc": "2.0",
      "method": method,
      "id": 1,
      "params": params,
    })
}

function calculatePower(e) {
  let power = e;
  let x = 1024 ** 4;

  return (power / x).toFixed(2);
}
