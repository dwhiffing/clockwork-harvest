export const MAP_DATA = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [12, 17, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 18, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 14, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 14],
  [12, 29, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 30, 14],
  [24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26],
]

let scoreText: any
let multiText: any
let multiGraphics: Phaser.GameObjects.Graphics
let timeText: any
const earnedTimeBonuses = [0]

export default class UIService {
  scene: Phaser.Scene
  group?: Phaser.GameObjects.Group
  textGroup?: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.scene.input.keyboard.on('keydown-F', () => {
      this.scene.scale.startFullscreen()
    })

    let i = 12 * 5 + 6
    const water = this.scene.add
      .tileSprite(0, 0, 1000, 1000, 'tiles', i)
      .setScale(4)
    this.scene.time.addEvent({
      callback: () => {
        water.setFrame(i++)
        if (i >= 12 * 5 + 10) i = 12 * 5 + 6
      },
      repeat: -1,
      delay: 200,
    })

    let soilMap = this.scene.make.tilemap({
      data: MAP_DATA,
      tileWidth: 16,
      tileHeight: 16,
    })
    let soilTiles = soilMap.addTilesetImage('tiles')
    soilMap.createLayer(0, soilTiles, 226, 128).setScale(4)
    soilMap.fill(-1, 0, 0, 20, 20)
    soilMap.fill(78, 0, 0, 13, 11)

    let grassMap = this.scene.make.tilemap({
      data: MAP_DATA,
      tileWidth: 16,
      tileHeight: 16,
    })
    let grassTiles = grassMap.addTilesetImage('tiles')
    grassMap.createLayer(0, grassTiles, 126, 40).setScale(4)

    this.textGroup = this.scene.add.group()
    for (let i = 0; i < 50; i++) {
      const t = this.scene.add.bitmapText(20, 20, 'gem', '0')
      t.setActive(false).setFontSize(32)

      t.alpha = 0
      this.textGroup.add(t)
    }

    const muteButton = this.scene.add
      .sprite(
        this.scene.cameras.main.width,
        this.scene.cameras.main.height,
        'icons',
        this.scene.sound.mute ? 0 : 1,
      )
      .setOrigin(1.2, 1.2)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.sound.mute = !this.scene.sound.mute
        muteButton.setFrame(this.scene.sound.mute ? 1 : 0)
      })

    multiText = this.scene.add
      .bitmapText(this.scene.cameras.main.width - 290, 80, 'gem', 'x1')
      .setFontSize(32)

    multiGraphics = this.scene.add.graphics()

    timeText = this.scene.add
      .bitmapText(this.scene.cameras.main.width / 2, 64, 'gem', '60')
      .setFontSize(64)
      .setOrigin(0.5, 0)

    scoreText = this.scene.add
      .bitmapText(230, 70, 'gem', '0')
      .setFontSize(48)
      .setOrigin(0, 0)

    this.scene.data.events.addListener('changedata', this.scoreUpdate)
  }

  destroy() {
    this.scene.data.events.removeListener('changedata', this.scoreUpdate)
  }

  scoreUpdate = (_: any, key: string, value: number) => {
    if (key === 'time' && value > -1) {
      timeText?.setText(`${value}`)
    }
    if (key === 'score') {
      const mod = Math.floor(value / 500)
      if (!earnedTimeBonuses.includes(mod)) {
        earnedTimeBonuses.push(mod)
        this.scene.data.inc('time', 5)
      }
      scoreText?.setText(`${value}`)
    }
    if (key === 'multi') {
      multiText?.setText(`x${Math.floor(value)}`)
      // @ts-ignore
      this.scene.player.scythe.setFrame(Math.floor(value) - 1)
      const w = this.scene.cameras.main.width
      multiGraphics.clear()
      if (value >= 1) {
        multiGraphics.slice(
          w - 235,
          98,
          12,
          Phaser.Math.DegToRad(360 - (value % 1) * 360),
          Phaser.Math.DegToRad(360),
        )
        multiGraphics.fillStyle(0xffffff, 1)
        multiGraphics.fillPath()
      }
    }
  }
}
