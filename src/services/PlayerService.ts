export default class PlayerService {
  scene: Phaser.Scene
  scythe: Phaser.GameObjects.Image
  blade: any
  group?: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene) {
    const pointer = scene.input.activePointer
    this.scene = scene
    this.scythe = this.scene.matter.add
      .sprite(pointer.x, pointer.y - 40, 'scythe', 0, {
        isSensor: true,
        frictionAir: 0.015,
      })
      .setScale(5)

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
          if (Math.abs(diff) > 15 && Math.abs(diff) < 30) {
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
      10,
      { isSensor: true, label: 'blade' },
    )
    const blade2 = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      18,
      { isSensor: true, label: 'blade', mass: 5 },
    )

    const blade3 = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      18,
      { isSensor: true, label: 'blade', mass: 5 },
    )
    const blade4 = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      10,
      { isSensor: true, label: 'blade' },
    )
    const grabber = this.scene.matter.add.circle(
      this.scythe.x - 40,
      this.scythe.y + 80,
      6,
      { isSensor: true, isStatic: true },
    )
    this.blade = blade4
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, grabber, 0, 1, {
      pointA: { x: -0, y: 70 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade2, 0, 1, {
      pointA: { x: 30, y: -50 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade1, 0, 1, {
      pointA: { x: 60, y: -30 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade3, 0, 1, {
      pointA: { x: -30, y: -50 },
    })
    //@ts-ignore
    this.scene.matter.add.constraint(this.scythe.body, blade4, 0, 1, {
      pointA: { x: -60, y: -30 },
    })

    this.scene.input.on('pointermove', (pointer: any) => {
      const diff =
        (Math.abs(pointer.x - grabber.position.x) +
          Math.abs(pointer.y - grabber.position.y)) /
        5

      this.scene.tweens.add({
        targets: [grabber.position],
        x: pointer.x,
        y: pointer.y,
        duration: diff,
      })
    })
  }
}
