const pinataSDK = require('@pinata/sdk')
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY)
const IPFS = require('ipfs-core')
const fs = require('fs')

module.exports = class Ipfs {

  constructor() {
    pinata.testAuthentication().then((result) => {
      console.info(`Pinata authenticated: ${result.authenticated}`)
    }).catch((err) => {
      console.log(err)
    })
  }

  async initIpfs() {
    console.info('🌱 initIpfs')
    this.ipfs = await IPFS.create()
  }

  async generateTokenURI(imageName, imagePath, tokenId, data) {
    if (!this.ipfs) {
      await this.initIpfs()
    }
    try {
      const imageCid = await this.saveFileToIpfs(imageName, imagePath, false)
      if (imageCid) {
        console.info({imageCid})
        data['image'] = `ipfs://${imageCid}`
        
        const jsonFileName = `${tokenId}.json`
        const jsonFilePath = `./output/${jsonFileName}`
        try {
          fs.writeFileSync(jsonFilePath, JSON.stringify(data))
        } catch (err) {
          console.error(err)
        }
        const jsonCid = await this.saveFileToIpfs(jsonFileName, jsonFilePath)

        console.info({jsonCid})
        return jsonCid
      } else {
        console.log('Could not upload image to IPFS or Pinata')
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async saveFileToIpfs(fileName, filePath, jsonData) {

    try {
      let addObject = {
        path: fileName,
        pin: true,

      }

      if (jsonData) {
        const dataStr = JSON.stringify(jsonData)
        addObject['content'] = dataStr
      } else {
        addObject['content'] = fs.readFileSync(filePath)
      }

      const result = await this.ipfs.add(addObject)
      const cid = (result.cid).toString()    

      const options = {
        pinataMetadata: {
          name: fileName
        }
      }
      // const pinnedCid = await pinata.pinByHash(cid, options)
      const readableStreamForFile = fs.createReadStream(filePath)
      const pinFile = await pinata.pinFileToIPFS(readableStreamForFile, options)

      // return pinFile.IpfsHash
      return cid
    } catch (error) {
      console.log(error)
      return false
    }
  }
}