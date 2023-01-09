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

    music = this.sound.add('game', { volume: 0, loop: true })
    this.tweens.add({ targets: music, volume: 0.4, duration: 1000 })
    music.play()
    this.data.set('score', 0)
    this.data.set('level', 1)
    this.data.set('time', 60)
    this.data.set('multi', 1)
    this.time.addEvent({
      callback: () => {
        if (this.data.get('level') < 3) this.data.inc('level')
      },
      delay: 60000,
      repeat: -1,
    })
    this.time.addEvent({
      callback: () => {
        if (this.data.get('time') > 0) {
          this.data.inc('time', -1)
        } else {
          if (this.data.values.multi < 2) {
            this.gameover()
          }
        }
      },
      delay: 1000,
      repeat: -1,
    })
    this.time.addEvent({
      callback: () => {
        if (this.data.values.multi > 1) {
          this.data.inc('multi', -0.01)
        } else {
          this.data.values.multi = 1
        }
      },
      delay: 100,
      repeat: -1,
    })

    this.input.activePointer.x = 400
    this.input.activePointer.y = 400

    this.ui = new UIService(this)
    this.crops = new CropService(this)
    this.player = new PlayerService(this)

    // TODO: use collision filters for better performance?
    this.matter.world.on('collisionstart', (event: any) => {
      let pairs = event.pairs

      for (let i = 0; i < pairs.length; i++) {
        let bodyA = pairs[i].bodyA
        let bodyB = pairs[i].bodyB
        if (
          bodyA.label === bodyB.label ||
          !['blade', 'crop'].includes(bodyA.label) ||
          !['blade', 'crop'].includes(bodyB.label)
        )
          continue
        let crop = bodyA.label === 'crop' ? bodyA : bodyB

        this.crops!.hitCrop(crop.position.x, crop.position.y)
      }
    })
  }

  gameover = () => {
    if (this.hasEnded) return
    this.hasEnded = true
    this.crops?.crops.forEach((crop) => {
      this.crops?.killCrop(crop)
    })
    this.sound.play('lose')
    this.tweens.add({ targets: music, volume: 0, duration: 1000 })
    this.time.delayedCall(2000, () => {
      this.ui?.destroy()
      this.cameras.main.fade(1000, 155, 212, 195, true, (_: any, b: number) => {
        if (b === 1) {
          music.stop()
          this.scene.start('MenuScene', {
            score: this.data.get('score'),
          })
        }
      })
    })
  }
}
