const MAP_DATA = [
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

export default class UIService {
  scene: Phaser.Scene
  group?: Phaser.GameObjects.Group

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
    soilMap.createLayer(0, soilTiles, 224, 128).setScale(4)
    soilMap.fill(-1, 0, 0, 20, 20)
    soilMap.fill(78, 0, 0, 13, 11)

    let grassMap = this.scene.make.tilemap({
      data: MAP_DATA,
      tileWidth: 16,
      tileHeight: 16,
    })
    let grassTiles = grassMap.addTilesetImage('tiles')
    grassMap.createLayer(0, grassTiles, 120, 40).setScale(4)

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
  }
}
