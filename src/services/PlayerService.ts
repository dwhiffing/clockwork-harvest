export default class PlayerService {
  scene: Phaser.Scene
  sprite: Phaser.Physics.Arcade.Image
  sprite2: Phaser.Physics.Arcade.Image
  scythe: Phaser.GameObjects.Image
  group?: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.scythe = this.scene.add
      .image(0, 0, 'scythe')
      .setScale(6)
      .setOrigin(0, 1)

    this.sprite2 = this.scene.physics.add
      .image(0, 0, 'scythe')
      .setCircle(28)
      .setAlpha(0)

    this.sprite = this.scene.physics.add
      .image(0, 0, 'scythe')
      .setCircle(18)
      .setAlpha(0)

    this.group = this.scene.physics.add.group()

    this.group.add(this.sprite)
    this.group.add(this.sprite2)

    this.scene.time.addEvent({
      repeat: -1,
      delay: 10,
      callback: () => {
        // TODO: should improve performance by only setting scale/frame when multiplier changes
        const level = this.scene.data.get('level')
        const multi = Math.floor(this.scene.data.get('multi'))
        this.scythe.angle += 1 + multi / 2
        this.scythe.setFrame(Math.min(4, multi - 1))
        this.scythe.setScale(multi + 5)
        this.sprite.setCircle(18 + multi * 1.5)
        this.sprite2.setCircle(28 + multi * 1.5)
        Phaser.Actions.PlaceOnCircle(
          [this.sprite],
          new Phaser.Geom.Circle(
            this.scythe.x - 5,
            this.scythe.y - 5,
            135 + multi * 24,
          ),
          Phaser.Math.DegToRad(this.scythe.angle - 45),
        )
        Phaser.Actions.PlaceOnCircle(
          [this.sprite2],
          new Phaser.Geom.Circle(
            this.scythe.x - 15,
            this.scythe.y - 15,
            135 + multi * 24,
          ),
          Phaser.Math.DegToRad(this.scythe.angle - 60),
        )
      },
    })

    this.scene.input.on('pointermove', (pointer: any) => {
      this.scythe.setPosition(pointer.x, pointer.y)
    })
  }
}
