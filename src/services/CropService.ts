export default class CropService {
  scene: Phaser.Scene
  group?: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.group = this.scene.physics.add.group({
      key: 'tiles',
      frameQuantity: 0,
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
