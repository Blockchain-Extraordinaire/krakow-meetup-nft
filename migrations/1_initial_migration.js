var KrakowMeetup = artifacts.require("./KrakowMeetup.sol");

const fs = require('fs')
const truffleConfig = require('../truffle-config')
const clientContractsPath = truffleConfig.contracts_build_directory
const serverContractsPath = './server/contracts'

module.exports = function(deployer) {
  deployer.deploy(KrakowMeetup).then((res) => {
    const contractName = "KrakowMeetup"
    makeCopyToServeFolder(contractName)
    createContractAddressInfo(contractName, res.address)
  })
}

function makeCopyToServeFolder(contractName) {
  const src = `${clientContractsPath}/${contractName}.json`
  const dest = `${serverContractsPath}/${contractName}.json`
  fs.copyFileSync(src, dest)
}

function createContractAddressInfo(contractName, address) {
  const obj = {
    contractAddress: address
  }
  var json = JSON.stringify(obj)
  const clientPath = `${clientContractsPath}/${contractName}Address.json`
  const servertPath = `${serverContractsPath}/${contractName}Address.json`
  fs.writeFileSync(clientPath, json, 'utf8')
  fs.writeFileSync(servertPath, json, 'utf8')
}