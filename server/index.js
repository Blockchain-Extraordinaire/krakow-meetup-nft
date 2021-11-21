require('./env-setup')

const howOftenCheckTokens = 5 * 60 // seconds, 5 * 60 = 5 minutes

const Ipfs = require('./ipfs')
const ipfs = new Ipfs()
const Image = require('./image')
const Contract = require('./contract')
const contract = new Contract()
const contractData = require('./contracts/KrakowMeetup.json')
const contractName = contractData['contractName']
const Checker = require('./checker')
const checker = new Checker()

contract.getOperatorBalance()

main()

async function main() {
  const ready = await ipfs.initIpfs()
  initializeContractListener()
  manageArguments()
}

function initializeContractListener() {
  console.log("initializeContractListener...")
  const contractInstance = contract.initializeContract()
  contractInstance.addListener('RequestedTokenURI', (data) => {
    eventData(data)
  })
}


function eventData(data) {
  const tokenId = data.returnValues.requestForTokenId
  console.info({requestForTokenId: tokenId})
  checker.initTokenTracker(tokenId) 
  handleSetTokenURI(tokenId)
}

async function handleSetTokenURI(tokenId) {
  const image = new Image(contractName)
  const imagePath = image.getImage(tokenId)
  const imageName = `${contractName}-${tokenId}.png`

  const tokenURI = await handleGetTokenURI(imageName, imagePath, tokenId)
  try {
    const result = await contract.setTokenURI(tokenId, tokenURI)
    console.log({result})
    if (result) {
      console.log('OK')
      checker.updateTokenTracker(tokenId, tokenURI) 
      return true
    }
  } catch (error) {
    console.error(`Problem setting token URI`)
    console.log(error)
    return false
  }
}


async function handleGetTokenURI(imageName, imagePath, tokenId) {
  const data = {
    "attributes": [
      {
        "trait_type": "Season",
        "value": 0
      }
    ],
    "description": "64 NFTs minted on the Meetup event",
    "image": null,
    "name": "Krakow Meetup #" + tokenId
  }
  
  jsonCid = await ipfs.generateTokenURI(imageName, imagePath, tokenId, data)

  tokenURI = `ipfs://${jsonCid}` 
  console.info({tokenURI})
  return tokenURI
}

function manageArguments() {
  var myArgs = process.argv.slice(2)

  if (myArgs.length) {
    switch (myArgs[0]) {
      case 'performCheck':
        performCheck().then(() => {
          console.log(`performCheck end`)
          process.exit(0)
        }).catch(err => {
          console.log(err)
          process.exit(0)
        })
        break
      
      case 'handleSetTokenURI':
        if (!myArgs[1]) {
          console.log(`Please provide tokenId`)
          process.exit(0)
        }
        handleSetTokenURI(myArgs[1]).then(() => process.exit(0)).catch(err => {
          console.log(err)
          process.exit(0)
        })
        break
    
      default:
        break
    }
  }
}

async function performCheck() {
  console.log(`Perform check for missing tokens...`)
  const missingURITokenIds = await checker.check()
  if (missingURITokenIds.length) {
    for (let element of missingURITokenIds) {
      console.log(`Generate URI for token ID ${element}`)
      const outcome = await handleSetTokenURI(element)
    }
  } else {
    console.log(`No missing token IDs / URIs found`)
  }
}

setTimeout(async () => {
  setInterval(async () => {
    await performCheck()
  }, howOftenCheckTokens * 1000)
}, 2 * 1000)