require('dotenv').config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const web3 = createAlchemyWeb3(API_URL)

const contract = require('../artifacts/contracts/Umano.sol/Umano.json')
const contractAddress = '0x5b581112A000e0Cc7056469f80c8753c5E5036ab'
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest') //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (
        err,
        hash,
      ) {
        if (!err) {
          console.log(
            'The hash of your transaction is: ',
            hash,
            "\nCheck Alchemy's Mempool to view the status of your transaction!",
          )
        } else {
          console.log(
            'Something went wrong when submitting your transaction:',
            err,
          )
        }
      })
    })
    .catch((err) => {
      console.log(' Promise failed:', err)
    })
}

mintNFT(
  'https://gateway.pinata.cloud/ipfs/Qmbd6EL3mhWicE2x3hx8WdN3nLJWgEewUURQbc3kuNwEvG/umano3-metadata.json',
)
