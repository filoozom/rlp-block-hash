import { calculateBuggyHash } from "../lib.js";

const blockNumber = process.argv[2];
console.log(await calculateBuggyHash(blockNumber));
