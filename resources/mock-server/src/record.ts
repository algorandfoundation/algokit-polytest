import { Algodv2 } from "algosdk";
import { record } from ".";

async function algosdkAlgodRequests() {
  const algod = new Algodv2("a".repeat(64), "http://localhost", 4001);
  await algod.status().do();
}

export async function recordAlgosdkRequests() {
  await record("algod", algosdkAlgodRequests);
}
