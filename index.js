import { Piscina } from "piscina";
import pDefer from "p-defer";

const TRIES = 500000;
const LAST_BLOCK = 22575463;
let deferred;

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const pool = new Piscina({
  filename: new URL("./worker.js", import.meta.url).href,
  maxThreads: 8,
  maxQueue: "auto",
});

pool.on("drain", () => deferred?.resolve());

for (let tries = 0; tries < TRIES; tries++) {
  const blockNumber = randomBetween(0, LAST_BLOCK);

  if (pool.queueSize === pool.options.maxQueue) {
    deferred = pDefer();
    await deferred.promise;
  }

  pool.run(blockNumber).then(({ correct, calculated, expected }) => {
    if (!correct) {
      console.log(`${blockNumber}: ${calculated} !== ${expected}`);
    }

    if (tries % 1000 === 0) {
      console.log(`Done: ${Math.round((tries / TRIES) * 10000) / 100}%`);
    }
  });
}
