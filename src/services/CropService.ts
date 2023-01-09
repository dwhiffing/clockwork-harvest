import { sample, shuffle } from 'lodash'
import { CROPS } from '../constants'
import { ICrop } from '../types'
import { MAP_DATA } from './UIService'

export default class CropService {
  scene: Phaser.Scene
  group?: Phaser.GameObjects.Group
  sprites?: any[]
  crops: ICrop[]
  seeds: string[]
  seedQueue: string[]
  seedBags: Phaser.GameObjects.Sprite[]
  cropMap: Phaser.Tilemaps.Tilemap
  wiltSound: Phaser.Sound.BaseSound
  ripeSound: Phaser.Sound.BaseSound
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager
  emitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.group = this.scene.add.group()

    this.particles = this.scene.add.particles('tiles')
    this.emitter = this.particles
      .createEmitter({
        x: 0,
        y: 0,
        frame: 85,
        speed: { min: -220, max: 220 },
        scale: { start: 4, end: 4 },
        alpha: { start: 1, end: 0 },
        rotate: { min: 0, max: 180 },
        lifespan: { min: 400, max: 800 },
      })
      .stop()

    this.particles.setDepth(20)

    this.seeds = []
    this.seedQueue = []

    this.wiltSound = this.scene.sound.add('wilt')
    this.ripeSound = this.scene.sound.add('ripe', { rate: 0.8, volume: 3 })

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
    let isPlaceable = false
    let placeableTiles: Phaser.Tilemaps.Tile[] = []

    let hoveredTile: Phaser.Tilemaps.Tile
    this.scene.input.on('pointermove', (p: any) => {
      seedMap.fill(11, 0, 0, 12, 10)
      const tile = seedMap.getTileAtWorldXY(p.x, p.y)
      if (!this.seeds[0]) return
      const cropData = CROPS[this.seeds[0] as keyof typeof CROPS]
      if (tile) {
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

    this.crops = cropMap.getTilesWithin(0, 0, 12, 10).map((t, i) => ({
      x: t.x,
      y: t.y,
      age: 0,
      ageRate: 1,
      index: i,
      maxAge: 5,
      timeMulti: 1,
      timeline: this.scene.tweens.createTimeline(),
      scoreMulti: 1,
      type: null,
      alive: false,
      tile: t,
    }))

    this.sprites = []
    for (let i = 0; i < 120; i++) {
      const sprite = this.scene.matter.add
        .sprite(0, 0, 'tiles', 11)
        .setScale(4)
        .setCircle(15, {
          isSensor: true,
          label: 'crop',
          isStatic: true,
          circleRadius: 15,
        })

      this.sprites.push(sprite)
    }

    this.crops.forEach((c, i) => {
      const x = c.tile.getCenterX()
      const y = c.tile.getCenterY()
      if (!this.sprites) return
      this.sprites[i].setPosition(x, y)
    })

    this.scene.time.addEvent({
      repeat: -1,
      delay: 100,
      callback: () => {
        this.crops
          .filter((c) => c.alive)
          .forEach((c) => {
            const cropData = CROPS[c.type as keyof typeof CROPS]
            c.age += 1 / c.ageRate / 10

            if (c.age >= c.maxAge) {
              this.killCrop(c)
            } else {
              if (c.age < 4) {
                c.tile.index = Math.floor(cropData.frame + Math.min(4, c.age))
              }
              if (c.age >= 4) {
                const sprite = this.sprites?.[c.index]
                if (c.tile.index !== 11) {
                  if (!this.ripeSound.isPlaying) this.ripeSound.play()
                  sprite.setFrame(cropData.frame + 4)
                  const targets = [sprite]
                  const s1 = 'Sine.easeOut'
                  const s2 = 'Sine.easeIn'
                  c.timeline = this.scene.tweens.createTimeline()
                  c.timeline.add({
                    targets,
                    angle: 20,
                    duration: 250,
                    ease: s1,
                  })
                  c.timeline.add({ targets, angle: 0, duration: 250, ease: s2 })
                  c.timeline.add({
                    targets,
                    angle: -20,
                    duration: 250,
                    ease: s1,
                  })
                  c.timeline.add({ targets, angle: 0, duration: 250, ease: s2 })
                  c.timeline.loop = -1
                  c.timeline.play()
                  c.tile.index = 11
                } else {
                  const rate = 1 + ((c.age - 4) / (c.maxAge - 5)) * 4
                  c.timeline.setTimeScale(rate)
                }
              }
            }
          })
      },
    })

    const w = this.scene.cameras.main.width / 2 - 120
    const h = this.scene.cameras.main.height - 100
    const seedBags = new Array(5).fill(null).map((_, i) => {
      return this.scene.add.sprite(i * 64 + w, h, 'tiles', 72).setScale(4)
    })
    this.seedBags = seedBags

    this.getNextSeed()

    this.scene.input.on('pointerdown', (p: any) => {
      if (hoveredTile && this.seeds[0]) {
        let seed: string | undefined
        if (isPlaceable) {
          seed = this.seeds.shift()
          this.refreshSeeds()
          this.scene.sound.play('plant', { volume: 1 })
        } else {
          this.scene.sound.play('error', { volume: 2 })
        }
        placeableTiles.forEach((t) => {
          const cropTile = cropMap.getTileAt(t.x, t.y)
          if (cropTile && isPlaceable) {
            const crop = this.crops.find(
              (c) => c.x === cropTile.x && c.y === cropTile.y,
            )
            this.getNextSeed()

            if (crop) {
              const cropData = CROPS[seed as keyof typeof CROPS]
              crop.alive = true
              crop.age = 0
              crop.ageRate = cropData.ageRate
              crop.maxAge = cropData.maxAge
              crop.timeMulti = cropData.timeMulti
              crop.scoreMulti = cropData.scoreMulti
              crop.type = cropData.type
              cropTile.index = cropData.frame
            }
          }
        })
      }
    })
  }

  getNextSeed() {
    while (this.seeds.length < 8) {
      if (this.seedQueue.length === 0) {
        this.seedQueue = shuffle(
          Object.keys(CROPS).slice(0, 3 + this.scene.data.get('level') * 2),
        )
      }
      this.seeds.push(this.seedQueue.shift()!)
    }
    this.refreshSeeds()
  }

  hitCrop(x: number, y: number) {
    const crop = this.cropMap.getTileAtWorldXY(x, y)
    if (crop) {
      const _crop = this.crops.find((c) => c.x === crop.x && c.y == crop.y)
      if ((_crop?.age || 0) > 1) this.killCrop(_crop)
    }
  }

  killCrop(crop?: ICrop) {
    if (crop?.alive) {
      crop.alive = false
      crop.tile.index = 11
      const amount = crop.age >= 4 && crop.age < crop.maxAge ? 1 : 0
      // @ts-ignore
      const text = this.scene.ui.textGroup.getFirstDead()
      const m = this.scene.data.get('multi')
      const change = amount * crop.scoreMulti * Math.floor(m)

      const cropData = CROPS[crop.type as keyof typeof CROPS]

      const sprite = this.sprites?.[crop.index]
      sprite.setFrame(11)
      if (change > 0) {
        this.scene.sound.play('harvest', { volume: 1.5, rate: 0.3 + m / 5 })
        if (m < 5) {
          // num harvests for base multi level
          const baseMulti = 8
          let d = 1 / baseMulti
          if (m >= 2) d /= 2
          if (m > 3) d /= 2
          if (m > 4) d /= 2
          if (m > 5) d /= 2
          this.scene.data.inc('multi', d)
        }
      } else {
        this.scene.data.inc('time', -cropData.timeMulti)
        const frame = cropData.frame
        this.emitter.setFrame(frame)
        this.emitter.explode(6, sprite.x, sprite.y)
        if (crop.age >= 4) {
          if (!this.wiltSound.isPlaying) this.wiltSound.play()
        } else {
          this.scene.sound.play('cut')
        }
        this.scene.cameras.main.shake(100, 0.01)
        this.scene.data.set('multi', 1)
      }
      if (text) {
        text.setTint(change > 0 ? 0xffffff : 0xff0000)
        text.x = crop.tile.getCenterX()
        text.y = crop.tile.getCenterY()
        crop.timeline.stop()
        sprite.angle = 0
        text.setActive(true)
        text.alpha = 1
        text.setText(change > 0 ? `${change}` : `-${cropData.timeMulti}`)
        this.scene.tweens.add({
          targets: text,
          alpha: 0,
          y: text.y - 40,
          duration: 2000,
          onComplete: () => {
            text.setActive(false)
          },
        })
      }
      this.scene.data.inc('score', change)
    }
  }

  refreshSeeds() {
    this.seedBags.forEach((bag, i) => {
      const seed = this.seeds[i]
      if (seed) {
        const cropData = CROPS[seed as keyof typeof CROPS]
        bag.setFrame(cropData.frame - 1)
      } else {
        bag.setFrame(72)
      }
    })
  }
}
