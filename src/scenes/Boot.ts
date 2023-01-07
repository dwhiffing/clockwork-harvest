import Phaser from 'phaser'

export default class Boot extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const progress = this.add.graphics()
    const { width, height } = this.sys.game.config

    this.load.on('progress', (value: number) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(0, +height / 2, +width * value, 60)
    })

    this.load.spritesheet('scythe', 'assets/scythe.png', {
      frameHeight: 29,
      frameWidth: 22,
    })

    this.load.spritesheet('tiles', 'assets/tiles.png', {
      frameHeight: 16,
      frameWidth: 16,
    })

    this.load.spritesheet('icons', 'assets/icons.png', {
      frameHeight: 50,
      frameWidth: 49,
    })

    this.load.on('complete', () => {
      progress.destroy()

      this.scene.start('MenuScene')
    })
  }

  create() {}
}
