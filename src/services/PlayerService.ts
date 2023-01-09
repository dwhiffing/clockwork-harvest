export default class PlayerService {
  scene: Phaser.Scene
  scythe: Phaser.GameObjects.Image
  group?: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene) {
    const pointer = scene.input.activePointer
    this.scene = scene
    this.scythe = this.scene.matter.add
      .sprite(pointer.x, pointer.y - 40, 'scythe', 0, {
        isSensor: true,
        frictionAir: 0.01,
      })
      .setScale(6.5)

    let lastAngle: number
    this.scene.time.addEvent({
      repeat: -1,
      delay: 20,
      callback: () => {
        let angle = Phaser.Math.RadToDeg(
          Phaser.Math.Angle.Normalize(Phaser.Math.DegToRad(this.scythe.angle)),
        )
        if (lastAngle) {
          const diff = lastAngle - angle
          if (Math.abs(diff) > 20 && Math.abs(diff) < 30) {
            if (diff > 0) {
              blade1.label = '_blade'
              blade2.label = '_blade'
              blade3.label = 'blade'
              blade4.label = 'blade'
              this.scythe.setFlipX(true)
            } else {
              blade1.label = 'blade'
              blade2.label = 'blade'
              blade3.label = '_blade'
              blade4.label = '_blade'
              this.scythe.setFlipX(false)
            }
          }
        }
        lastAngle = angle
      },
    })

    const blade1 = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      15,
      { isSensor: true, label: 'blade' },
    )
    const blade2 = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      20,
      { isSensor: true, label: 'blade', mass: 50 },
    )

    const blade3 = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      20,
      { isSensor: true, label: 'blade', mass: 50 },
    )
    const blade4 = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      15,
      { isSensor: true, label: 'blade' },
    )
    const grabber = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      6,
      { isSensor: true, isStatic: true },
    )
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, grabber, 0, 1, {
      pointA: { x: -0, y: 90 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade2, 0, 1, {
      pointA: { x: 25, y: -70 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade1, 0, 1, {
      pointA: { x: 65, y: -55 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade3, 0, 1, {
      pointA: { x: -25, y: -70 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade4, 0, 1, {
      pointA: { x: -65, y: -55 },
    })

    this.scene.input.on('pointermove', (pointer: any) => {
      grabber.position.x = pointer.x
      grabber.position.y = pointer.y
    })
  }
}
