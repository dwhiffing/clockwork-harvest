import Phaser from 'phaser'
import PlayerService from '../services/PlayerService'

export default class Game extends Phaser.Scene {
  width: number
  height: number
  player: PlayerService

  constructor() {
    super('GameScene')
    this.width = 0
    this.height = 0
    this.player = new PlayerService(this)
  }

  init(opts: any) {}

  create() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    const muteButton = this.add
      .sprite(this.width, this.height, 'icons', this.sound.mute ? 0 : 1)
      .setOrigin(1.2, 1.2)
      .setInteractive()
      .on('pointerdown', () => {
        this.sound.mute = !this.sound.mute
        muteButton.setFrame(this.sound.mute ? 1 : 0)
      })

    this.input.keyboard.on('keydown-F', () => {
      this.scale.startFullscreen()
    })

    this.player = new PlayerService(this)
  }
}
