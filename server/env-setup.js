const dotenv = require('dotenv')

if (process.env.DEV == 'true') {
  dotenv.config({path: __dirname + '/.env.dev'})
} else if (process.env.TESTNET == 'true')  {
  dotenv.config({path: __dirname + '/.env.testnet'})
} else {
  dotenv.config()
}

console.log(`Running in mode: ${process.env.MODE}`)
console.log(`RPC: ${process.env.RPC_ENDPOINT}`)