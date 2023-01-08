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
    this.load.bitmapFont('gem', 'assets/gem.png', 'assets/gem.xml')
    this.load.image('title', 'assets/harvest-title.png')
    this.load.audio('menu', 'assets/menu.mp3')
    this.load.audio('game', 'assets/game.mp3')
    this.load.audio('harvest', 'assets/harvest.wav')
    this.load.audio('cut', 'assets/cut.wav')
    this.load.audio('wilt', 'assets/wilt.wav')
    this.load.audio('plant', 'assets/plant.wav')
    this.load.audio('seed', 'assets/seed.wav')
    this.load.audio('error', 'assets/error.wav')
    this.load.audio('ripe', 'assets/ripe.wav')
    this.load.audio('lose', 'assets/lose.wav')

    this.load.spritesheet('scythe', 'assets/scythe.png', {
      frameHeight: 29,
      frameWidth: 24,
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
