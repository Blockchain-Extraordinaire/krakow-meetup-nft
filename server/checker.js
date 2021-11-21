const JSONFileStorage = require('node-json-file-storage')
const storage = new JSONFileStorage('./storage.json')
const Contract = require('./contract')
const contract = new Contract()

module.exports = class Checker {

  initTokenTracker(tokenId) {
    storage.put({ 
      id: +tokenId, 
      uri: null
    })
  }
  
  updateTokenTracker(tokenId, tokenURI) {
    storage.put({ 
      id: +tokenId, 
      uri: tokenURI
    })
  }

  async checkTokensMissingUris() {
    const tokens = storage.all()
    const tokenKeys = Object.keys(tokens)
    let missingURITokenIds = []
    if (tokenKeys) {
      tokenKeys.forEach(element => {
        const id = tokens[element]['id']
        const uri = tokens[element]['uri']
        if (!uri) {
          missingURITokenIds.push(id)
        }
      })
    }
    return missingURITokenIds
  }

  /* 
  This is in case the event was not received
  And to create an empty placeholder in the storage
  */
  async checkMintedAgainstStorage() {

    const howManyMinted = await contract.getTotalMint()

    const tokens = storage.all()
    // const tokenKeys = Object.keys(tokens)

    let missingData = []

    for (let index = 0; index < howManyMinted; index++) {
      if (!tokens[index]) {
        this.initTokenTracker(index)
        missingData.push(index)
      }
    }

    if (missingData.length) {
      console.log(`Found missing token id in storage, records created`)
      console.log({missingData})
    }
  }
  
  /* 
  Will return an array of token ids that need
  tokenURI to be set
  */
  async check() {
    await this.checkMintedAgainstStorage()
    const missingURITokenIds = this.checkTokensMissingUris()
    return missingURITokenIds
  }
}