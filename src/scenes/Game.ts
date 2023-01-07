import Phaser from 'phaser'
import CropService from '../services/CropService'
import PlayerService from '../services/PlayerService'
import UIService from '../services/UIService'

export default class Game extends Phaser.Scene {
  width: number
  height: number
  player?: PlayerService
  crops?: CropService
  ui?: UIService
  group?: Phaser.GameObjects.Group

  constructor() {
    super('GameScene')
    this.width = 0
    this.height = 0
  }

  init(opts: any) {}

  create() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    this.ui = new UIService(this)
    this.crops = new CropService(this)
    this.crops.spawn()

    this.player = new PlayerService(this)
    this.physics.add.overlap(this.player.group!, this.crops.group!, (a, b) => {
      b.destroy()
    })
  }
}
