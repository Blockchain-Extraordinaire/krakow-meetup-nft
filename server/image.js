const images = require("images")

module.exports = class Image {
	constructor(imageBaseName = 'image') {
		this.imageBaseName = imageBaseName
    this.takenCoords = this.createCoordsArray(8)
	}

	getImage(amountOfPretzels) {
    let outputPath = `./output/${this.imageBaseName}-${amountOfPretzels}.png`
    let img = images('./img/background.png')
    const pretzelImagePath = `./img/pretzel.png`
    const pretzelReversedImagePath = `./img/pretzel-reversed.png`

    if (amountOfPretzels > 0) { // manage the pretzel number 0
      for (let index = 0; index < amountOfPretzels; index++) {
        let [x, y] = this.getNewCoords()
        let pretzelPath = pretzelImagePath
        let reversedChance = Math.floor((Math.random() * 8))
        if (reversedChance === 0 && amountOfPretzels > 1) { // first one always yellow
          pretzelPath = pretzelReversedImagePath
        }
        img.draw(images(pretzelPath), x * 200, y * 200) 
      }
    } else {
      img.draw(images(pretzelReversedImagePath), 700, 700)
    }

    img.save(outputPath)
    return outputPath
  }

  getNewCoords() {
    let x = Math.floor((Math.random() * 8))
    let y = Math.floor((Math.random() * 8))
    if (this.takenCoords[x][y] == 0) {
      this.takenCoords[x][y] = 1
    } else {
      [x, y] = this.getNewCoords()
    }
    return [x, y]
  }

  createCoordsArray(size) {
    let arr = []
    for (let i = 0; i < size; i++) {
      arr[i] = []
      for (let y = 0; y < size; y++) {
        arr[i][y] = 0
      }
    }
    return arr
  }
}