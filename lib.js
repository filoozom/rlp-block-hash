import { promisify } from "util";
import { execFile as execFileCallback } from "child_process";
import axios from "axios";
import { rlphash } from "ethereumjs-util";

const rpcUrl = process.env.RPC_URL || "https://rpc.gnosischain.com";

const toBuffer = (string) => {
  return Buffer.from(string.substring(2), "hex");
};

const execFile = promisify(execFileCallback);

export const getRawBlock = async (blockNumber) => {
  const { data } = await axios.post(rpcUrl, {
    jsonrpc: "2.0",
    id: "1",
    method: "eth_getBlockByNumber",
    params: [blockNumber, false],
  });

  const blockData = data.result;
  const raw = [
    toBuffer(blockData.parentHash),
    toBuffer(blockData.sha3Uncles),
    toBuffer(blockData.miner),
    toBuffer(blockData.stateRoot),
    toBuffer(blockData.transactionsRoot),
    toBuffer(blockData.receiptsRoot),
    toBuffer(blockData.logsBloom),
    toBuffer(blockData.difficulty),
    parseInt(blockData.number),
    parseInt(blockData.gasLimit),
    parseInt(blockData.gasUsed),
    parseInt(blockData.timestamp),
    toBuffer(blockData.extraData),
    Buffer.from(
      "0000000000000000000000000000000000000000000000000000000000000000",
      "hex"
    ),
    Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
  ];

  if (blockData.baseFeePerGas) {
    raw.push(parseInt(blockData.baseFeePerGas));
  }

  return raw;
};

export const calculateBuggyHash = async (blockNumber) => {
  const raw = await getRawBlock(blockNumber);
  return "0x" + rlphash(raw).toString("hex");
};

export const getBuggyHash = async (blockNumber) => {
  const { stdout: hash } = await execFile(
    "./buggy-hash",
    [blockNumber.toString()],
    { cwd: new URL("./go", import.meta.url).pathname }
  );

  return "0x" + hash;
};
