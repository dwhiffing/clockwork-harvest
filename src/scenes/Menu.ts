import Phaser from 'phaser'

export default class Menu extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const w = this.cameras.main.width
    const h = this.cameras.main.height
    let helpTextIndex = 0

    this.add
      .text(w / 2, 150, 'LD 52')
      .setOrigin(0.5)
      .setFontSize(100)
    this.add
      .text(w / 2, 250, 'By Dan Whiffing')
      .setOrigin(0.5)
      .setFontSize(32)

    const onStart = () => this.scene.start('GameScene')

    const onClickTopButton = () => {
      onStart()
    }
    const onClickBottomButton = () => {
      if (helpTextIndex < HELP_TEXT.length) {
        playButton.text = ''
        helpButton.text = 'Next'
        helpText.text = HELP_TEXT[helpTextIndex++]
        if (helpTextIndex === HELP_TEXT.length) onStart()
      }
    }

    const helpText = this.add
      .text(w / 2, h / 2, '')
      .setOrigin(0.5)
      .setFontSize(60)
      .setAlign('center')
      .setLineSpacing(10)

    const playButton = this.add
      .text(w / 2, h - 250, 'Play')
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
      .text(w / 2, h - 150, 'Help')
      .setOrigin(0.5)
      .setFontSize(64)
      .setInteractive()
      .on('pointerdown', onClickBottomButton)
    // this.scene.start('GameScene')
  }
}

const HELP_TEXT = [`Instructions will go here`, `Now you play`]
