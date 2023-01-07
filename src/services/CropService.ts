import { MAP_DATA } from './UIService'

export default class CropService {
  scene: Phaser.Scene
  group?: Phaser.GameObjects.Group

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
    let cropTiles = cropMap.addTilesetImage('tiles')
    cropMap.createLayer(0, cropTiles, 256, 150).setScale(4)
    cropMap.fill(-1, 0, 0, 20, 20)
    cropMap.fill(11, 0, 0, 12, 10)

    // map for highlighting seed placement
    let seedMap = this.scene.make.tilemap({
      data: MAP_DATA,
      tileWidth: 16,
      tileHeight: 16,
    })
    let seedTiles = seedMap.addTilesetImage('tiles')
    seedMap.createLayer(0, seedTiles, 256, 150).setScale(4).setAlpha(0.5)
    seedMap.fill(-1, 0, 0, 20, 20)
    seedMap.fill(11, 0, 0, 12, 10)
    // TODO: need to make one hidden sprite for each tile that does collision detection for that tile
    let isPlaceable = false
    let placeableTiles: Phaser.Tilemaps.Tile[] = []

    let hoveredTile: Phaser.Tilemaps.Tile
    this.scene.input.on('pointermove', (p: any) => {
      seedMap.fill(11, 0, 0, 12, 10)
      const tile = seedMap.getTileAtWorldXY(p.x, p.y)
      if (tile) {
        tile.index = 85
        const pattern = [
          [0, 0, 1, 0, 0],
          [0, 0, 1, 0, 0],
          [1, 1, 1, 1, 1],
          [0, 0, 1, 0, 0],
          [0, 0, 1, 0, 0],
        ]
        const tiles = seedMap.getTilesWithin(tile.x - 2, tile.y - 2, 5, 5)
        placeableTiles = []
        tiles.forEach((t, i) => {
          if (t.x > 11 || t.y > 9) return
          const x = 2 - (t.x - tile.x)
          const y = 2 - (t.y - tile.y)
          if (pattern[y][x] && cropMap.getTileAt(t.x, t.y).index === 11) {
            placeableTiles.push(t)
            t.index = 85
          }
        })
        isPlaceable =
          placeableTiles.length === pattern.flat().filter((p) => p === 1).length

        placeableTiles.forEach((t) => {
          t.tint = isPlaceable ? 0xffffff : 0xaa0000
        })
      }

      hoveredTile = tile
    })

    this.scene.input.on('pointerdown', (p: any) => {
      if (hoveredTile) {
        placeableTiles.forEach((t) => {
          const cropTile = cropMap.getTileAt(t.x, t.y)
          if (cropTile && isPlaceable) cropTile.index = 85
          // TODO: crops need to grow
        })
      }
    })
  }

  spawn() {
    const created = this.group!.createMultiple({
      quantity: 8,
      key: 'tiles',
      frame: 12 * 7 + 4,
      setScale: { x: 4, y: 4 },
    })
    const x = Phaser.Math.RND.between(50, this.scene.cameras.main.width - 50)
    const y = Phaser.Math.RND.between(50, this.scene.cameras.main.height - 50)
    const r = Phaser.Math.RND.between(80, 150)
    const circle = new Phaser.Geom.Circle(x, y, r)
    created.forEach((c) => {
      c.setCircle(8)
      const p = circle.getRandomPoint()
      c.setPosition(p.x, p.y)
    })

    Phaser.Actions.PlaceOnCircle(created, circle)
  }
}
