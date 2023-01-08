import Phaser from 'phaser'
import CropService from '../services/CropService'
import PlayerService from '../services/PlayerService'
import UIService from '../services/UIService'

let music: Phaser.Sound.BaseSound
export default class Game extends Phaser.Scene {
  width: number
  height: number
  hasEnded: boolean
  player?: PlayerService
  crops?: CropService
  ui?: UIService
  group?: Phaser.GameObjects.Group

  constructor() {
    super('GameScene')
    this.width = 0
    this.hasEnded = false
    this.height = 0
  }

  init(opts: any) {}

  create() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.hasEnded = false

    this.cameras.main.fadeFrom(1000, 155, 212, 195)

    music = this.sound.add('game')
    music.play()
    this.data.set('score', 0)
    this.data.set('level', 1)
    this.data.set('multi', 1)
    this.time.addEvent({
      callback: () => {
        if (this.data.get('level') < 6) this.data.inc('level')
      },
      delay: 60000,
      repeat: -1,
    })

    this.ui = new UIService(this)
    this.crops = new CropService(this, this.gameover)
    this.player = new PlayerService(this)
    this.physics.add.overlap(this.player.group!, this.crops.group!, (a, b) => {
      this.crops!.hitCrop(b.body.x, b.body.y)
    })
  }

  gameover = () => {
    if (this.hasEnded) return
    this.hasEnded = true
    this.ui?.destroy()
    this.tweens.add({ targets: music, volume: 0, duration: 1000 })
    this.cameras.main.fade(1000, 155, 212, 195, true, (_: any, b: number) => {
      if (b === 1) {
        music.stop()
        this.scene.start('MenuScene', {
          score: this.data.get('score'),
        })
      }
    })
  }
}
