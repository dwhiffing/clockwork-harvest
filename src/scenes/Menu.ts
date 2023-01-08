import Phaser from 'phaser'

let prevScore: number | null = null
export default class Menu extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  init(opts: any) {
    prevScore = 1000
  }

  create() {
    const w = this.cameras.main.width
    const h = this.cameras.main.height
    let helpTextIndex = 0

    let i = 12 * 5 + 6
    const water = this.add.tileSprite(0, 0, 1000, 1000, 'tiles', i).setScale(4)
    this.time.addEvent({
      callback: () => {
        water.setFrame(i++)
        if (i >= 12 * 5 + 10) i = 12 * 5 + 6
      },
      repeat: -1,
      delay: 200,
    })
    this.add.image(w / 2, 200, 'title').setOrigin(0.5)
    this.add
      .bitmapText(w / 2, 400, 'gem', 'By Dan Whiffing')
      .setOrigin(0.5)
      .setFontSize(32)

    let scoreText: Phaser.GameObjects.BitmapText
    if (typeof prevScore === 'number') {
      scoreText = this.add
        .bitmapText(w / 2, 600, 'gem', `Score: ${prevScore}`)
        .setOrigin(0.5)
        .setFontSize(64)
    }

    const onStart = () => this.scene.start('GameScene')

    const onClickTopButton = () => {
      onStart()
    }
    const onClickBottomButton = () => {
      if (scoreText) scoreText.destroy()
      if (helpTextIndex < HELP_TEXT.length) {
        playButton.text = ''
        helpButton.text = 'Next'
        helpText.text = HELP_TEXT[helpTextIndex++]
        if (helpTextIndex === HELP_TEXT.length) helpButton.text = 'Start'
      } else {
        onStart()
      }
    }

    const helpText = this.add
      .bitmapText(w / 2, h / 2 + 150, 'gem', '')
      .setOrigin(0.5)
      .setFontSize(60)
      .setCenterAlign()

    const playButton = this.add
      .bitmapText(w / 2, h - 160, 'gem', 'Play')
      .setOrigin(0.5)
      .setFontSize(64)
      .setInteractive()
      .on('pointerdown', onClickTopButton)

    const muteButton = this.add
      .sprite(w, h, 'icons', 1)
      .setOrigin(1.2, 1.2)
      .setInteractive()
      .on('pointerdown', () => {
        this.sound.mute = !this.sound.mute
        muteButton.setFrame(this.sound.mute ? 1 : 0)
      })

    const helpButton = this.add
      .bitmapText(w / 2, h - 80, 'gem', 'Help')
      .setOrigin(0.5)
      .setFontSize(64)
      .setInteractive()
      .on('pointerdown', onClickBottomButton)
    // this.scene.start('GameScene')
  }
}

const HELP_TEXT = [
  `Welcome to the island farm.
Harvest as fast as you can!`,
  `Seeds appear at the bottom
of the screen.  Keep your bag
from overflowing or you lose!`,
  `Crops will shake when they
are ready. Be careful not to
harvest too early or late!`,
  `The catch is your scythe
won't stop spinning.
Good luck!`,
]
