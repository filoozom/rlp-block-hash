const { Wallet } = require('@ethersproject/wallet')
const { JsonRpcProvider } = require('@ethersproject/providers')
const Web3 = require('web3');
const blockFromRpc = require('ethereumjs-block/from-rpc');
const utils = require('ethereumjs-util');

const RLPBlockHashJavascript = async () => {
    const blockNumber = parseInt(process.argv[2], 10)
    console.log({ blockNumber })
    const rpcUrl = process.env.RPC_URL || 'https://rpc.gnosischain.com'
    // const rpcUrl = 'https://mainnet.infura.io/v3/32abf08bd352448d9fa218791a4b296a'
    // const provider = new JsonRpcProvider({ url: rpcUrl, timeout: 1000 })
    const web3 = new Web3(rpcUrl)
    const blockData = await (new Promise(done =>
        web3.eth.getBlock(blockNumber, (err,res) => done(res))
    ));
    blockData.difficulty = parseInt(blockData.difficulty, 10);
    blockData.totalDifficulty = parseInt(blockData.totalDifficulty, 10);
    blockData.uncleHash = blockData.sha3Uncles;
    blockData.coinbase = blockData.miner;
    blockData.transactionTrie = blockData.transactionsRoot;
    blockData.receiptTrie = blockData.receiptsRoot;
    blockData.bloom = blockData.logsBloom;

    const block = blockFromRpc(blockData);
    console.log({ block, blockData });
    console.log({headerHash: '0x' + block.header.hash().toString('hex')})
    console.log({keccakPlusRLP: '0x' + utils.keccak256(utils.rlp.encode(block.header.raw)).toString('hex')});
    console.log({rlpHash: '0x' + utils.rlphash(block.header.raw).toString('hex')})
}

RLPBlockHashJavascript().catch(console.error)
