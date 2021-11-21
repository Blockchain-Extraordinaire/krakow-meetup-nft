const emitter = require('events').EventEmitter
const em = new emitter()

const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")

const contractData = require('./contracts/KrakowMeetup.json')
const ABI = contractData['abi']
const contractAddressData = require('./contracts/KrakowMeetupAddress.json')
const contractAddress = contractAddressData.contractAddress

const rpcNetwork = process.env.RPC_ENDPOINT
const wssNetwork = process.env.WSS_ENDPOINT
const walletAddress = process.env.WALLET_ADDRESS
const privateKey = process.env.WALLET_PRIVATE_KEY

const connectionOptions = {
  // Enable auto reconnection
  reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false
  }
}

const web3 = new Web3(new Web3.providers.WebsocketProvider(wssNetwork), connectionOptions)

module.exports = class Contract {

  async getOperatorBalance() {
    web3.eth.getBalance(walletAddress, async (err, result) => {
      if (err) {
          console.log(err)
          return
      }
      let balance = web3.utils.fromWei(result, "ether");
      console.info(`Operator wallet ${walletAddress} balance: ${balance}`)
    })
  }

  initializeContract() {
    this.myContract = new web3.eth.Contract(ABI, contractAddress)

    this.myContract.events.RequestedTokenURI()
    .on('changed', changed => console.log({changed}))
    .on('error', err => console.log({err}))
    .on('connected', connected => console.log({'Connected, subscription ID': web3.utils.hexToNumber(connected)}))
    .on('data', data => em.emit('RequestedTokenURI', data))

    return em
  }

  // Returns tokenUri
  async setTokenURI(tokenId, tokenURI) {

    // Make sure we don't have saved URI
    const tokenURIData = await this.getTokenURI(tokenId)
    if (tokenURIData) {
      console.info(`URI already set!`)
      return false
    }

    const provider = new HDWalletProvider(privateKey, rpcNetwork)
    let web3ForSigning = new Web3(provider)
    const contract = new web3ForSigning.eth.Contract(ABI, contractAddress)
    contract.setProvider(provider)

    const transactionObject = {
      from: process.env.WALLET_ADDRESS,
      gas: process.env.GAS_LIMIT
    }

    try {
      const result = await contract.methods.setTokenURI(tokenId, tokenURI).send(transactionObject)
      console.info(`Set token URI Contract call: ${result.status}`)
      provider.engine.stop()
      if (result.status) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log({error})
      provider.engine.stop()
      return false
    }
  }

  async getTokenURI(tokenId) {
    const provider = new HDWalletProvider(privateKey, rpcNetwork)
    let web3ForSigning = new Web3(provider)
    const contract = new web3ForSigning.eth.Contract(ABI, contractAddress)
    contract.setProvider(provider)

    try {
      const result = await contract.methods.tokenURI(tokenId).call()
      console.info(`Get token URI Contract result: ${result}`)
      provider.engine.stop()
      if (result) {
        return result
      } else {
        return false
      }
    } catch (error) {
      console.info('URI not set')
      provider.engine.stop()
      return false
    }
  }

  async getTotalMint() {
    const provider = new HDWalletProvider(privateKey, rpcNetwork)
    let web3ForSigning = new Web3(provider)
    const contract = new web3ForSigning.eth.Contract(ABI, contractAddress)
    contract.setProvider(provider)

    try {
      const result = await contract.methods.totalMint().call()
      console.info(`Get total mint result: ${result}`)
      provider.engine.stop()
      if (result) {
        return result
      } else {
        return false
      }
    } catch (error) {
      console.info('URI not set')
      provider.engine.stop()
      return false
    }
  }

}