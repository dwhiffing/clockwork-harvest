import Phaser from 'phaser'

export default class Crop extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'crops', 0)
  }

  create() {}
}
