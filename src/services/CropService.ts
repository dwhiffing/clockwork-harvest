import { MAP_DATA } from './UIService'

interface ICrop {
  x: number
  y: number
  age: number
  scoreMulti: number
  ageRate: number
  type: string | null
  alive: boolean
  tile: Phaser.Tilemaps.Tile
}

const CROPS = {
  corn: {
    type: 'corn',
    ageRate: 1,
    scoreMulti: 2,
    pattern: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
    frame: 85,
  },
  carrot: {
    type: 'carrot',
    ageRate: 0.5,
    scoreMulti: 1,
    pattern: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    frame: 97,
  },
}

export default class CropService {
  scene: Phaser.Scene
  group?: Phaser.GameObjects.Group
  crops: ICrop[]
  cropMap: Phaser.Tilemaps.Tilemap

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.group = this.scene.physics.add.group({
      key: 'tiles',
      frameQuantity: 0,
    })

    let cropMap = this.scene.make.tilemap({
      data: MAP_DATA,
      tileWidth: 16,
      tileHeight: 16,
    })
    this.cropMap = cropMap
    let cropTiles = cropMap.addTilesetImage('tiles')
    const cropLayer = cropMap.createLayer(0, cropTiles, 256, 150).setScale(4)
    cropMap.fill(-1, 0, 0, 20, 20)
    cropMap.fill(11, 0, 0, 12, 10)

    // map for highlighting seed placement
    let seedMap = this.scene.make.tilemap({
      data: MAP_DATA,
      tileWidth: 16,
      tileHeight: 16,
    })
    let seedTiles = seedMap.addTilesetImage('tiles')
    seedMap.createLayer(0, seedTiles, 256, 150).setScale(4).setAlpha(0.6)
    seedMap.fill(-1, 0, 0, 20, 20)
    seedMap.fill(11, 0, 0, 12, 10)
    // TODO: need to make one hidden sprite for each tile that does collision detection for that tile
    let isPlaceable = false
    let placeableTiles: Phaser.Tilemaps.Tile[] = []

    let hoveredTile: Phaser.Tilemaps.Tile
    this.scene.input.on('pointermove', (p: any) => {
      seedMap.fill(11, 0, 0, 12, 10)
      const tile = seedMap.getTileAtWorldXY(p.x, p.y)
      const cropData = CROPS.carrot
      if (tile) {
        tile.index = cropData.frame

        const tiles = seedMap.getTilesWithin(tile.x - 2, tile.y - 2, 5, 5)
        placeableTiles = []
        tiles.forEach((t, i) => {
          if (t.x > 11 || t.y > 9) return
          const x = 2 - (t.x - tile.x)
          const y = 2 - (t.y - tile.y)
          if (cropData.pattern[y][x]) {
            if (cropMap.getTileAt(t.x, t.y).index === 11) placeableTiles.push(t)
            t.index = cropData.frame
          }
        })
        isPlaceable =
          placeableTiles.length ===
          cropData.pattern.flat().filter((p) => p === 1).length

        tiles.forEach((t) => {
          t.tint = isPlaceable ? 0xffffff : 0xaa0000
        })
      }

      hoveredTile = tile
    })

    this.crops = cropMap.getTilesWithin(0, 0, 12, 10).map((t) => ({
      x: t.x,
      y: t.y,
      age: 0,
      ageRate: 1,
      scoreMulti: 1,
      type: null,
      alive: false,
      tile: t,
    }))

    const colliders = this.group!.createMultiple({
      quantity: 120,
      key: 'tiles',
      frame: 11,
      setScale: { x: 1, y: 1 },
    })

    this.crops.forEach((c, i) => {
      const x = c.tile.getCenterX()
      const y = c.tile.getCenterY()
      colliders[i].setPosition(x - 10, y + 4).setCircle(16)
    })

    this.scene.time.addEvent({
      repeat: -1,
      delay: 1000,
      callback: () => {
        this.crops
          .filter((c) => c.alive)
          .forEach((c) => {
            const cropData = CROPS[c.type as keyof typeof CROPS]
            c.age += c.ageRate
            if (c.age >= 5) {
              this.killCrop(c)
            } else {
              c.tile.index = Math.floor(cropData.frame + c.age)
            }
          })
      },
    })

    this.scene.input.on('pointerdown', (p: any) => {
      if (hoveredTile) {
        placeableTiles.forEach((t) => {
          const cropTile = cropMap.getTileAt(t.x, t.y)
          if (cropTile && isPlaceable) {
            const crop = this.crops.find(
              (c) => c.x === cropTile.x && c.y === cropTile.y,
            )
            if (crop) {
              const cropData = CROPS.carrot
              crop.alive = true
              crop.age = 0
              crop.ageRate = cropData.ageRate
              crop.scoreMulti = cropData.scoreMulti
              crop.type = cropData.type
              cropTile.index = cropData.frame
            }
          }
        })
      }
    })
  }

  hitCrop(x: number, y: number) {
    const crop = this.cropMap.getTileAtWorldXY(x, y)
    if (crop) {
      const _crop = this.crops.find((c) => c.x === crop.x && c.y == crop.y)
      this.killCrop(_crop)
    }
  }

  killCrop(crop?: ICrop) {
    if (crop?.alive) {
      crop.alive = false
      crop.tile.index = 11
      const amount = crop.age >= 4 && crop.age < 5 ? 1 : -1
      this.scene.data.inc('score', amount * crop.scoreMulti)
    }
  }
}
