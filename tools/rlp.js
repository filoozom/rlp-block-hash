import rlp from "rlp";
import { getRawBlock } from "../lib.js";

const blockNumber = process.argv[2];
const raw = await getRawBlock(blockNumber);

console.log(raw);
console.log(Buffer.from(rlp.encode(raw)).toString("hex"));
