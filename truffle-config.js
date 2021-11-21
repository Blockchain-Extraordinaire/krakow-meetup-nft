const dotenv = require('dotenv')
dotenv.config({path: __dirname + '/.secret'})

const HDWalletProvider = require('@truffle/hdwallet-provider');

// truffle migrate --network ganache

module.exports = {

  contracts_build_directory: './client/src/contracts',

  networks: {

    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: 5777,       // Any network (default: none)
    },

    ganache: {
     host: "localhost",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: 5777,       // Any network (default: none)
    },

    // ie. mumbai
    testnet: {
      // websocket: true, // Truffle doesn't seem to allow WebSockets
      provider: () => new HDWalletProvider(process.env.WALLET_PRIVATE_KEY_TESTNET, process.env.RPC_ENDPOINT_TESTNET),
      network_id: 80001,
      // gas: 30000000,
      // gasPrice: 30000000000,
      from: process.env.WALLET_ADDRESS_TESTNET,
      timeoutBlocks: 100, 
      // production: true
    },

    mainnet: {
      // websocket: true, // Truffle doesn't seem to allow WebSockets
      provider: () => new HDWalletProvider(process.env.WALLET_PRIVATE_KEY, process.env.RPC_ENDPOINT),
      network_id: 80001,
      gas: 30000000,
      gasPrice: 30000000000,
      from: process.env.WALLET_ADDRESS,
      timeoutBlocks: 100, 
      production: true
    },


  },


  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.6",
    }
  },
};
