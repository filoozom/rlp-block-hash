import { calculateBuggyHash, getBuggyHash } from "./lib.js";

export default async (blockNumber) => {
  const [calculated, expected] = await Promise.all([
    calculateBuggyHash(blockNumber),
    getBuggyHash(blockNumber),
  ]);

  return {
    correct: calculated === expected,
    calculated,
    expected,
  };
};
