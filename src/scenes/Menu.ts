import Phaser from 'phaser'

let prevScore: number | null = null
export default class Menu extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  init(opts: any) {
    prevScore = opts.score
  }

  create() {
    const w = this.cameras.main.width
    const h = this.cameras.main.height
    let helpTextIndex = 0

    this.cameras.main.fadeFrom(1000, 155, 212, 195)
    const music = this.sound.add('menu', { loop: true, volume: 0 })
    music.play()
    this.tweens.add({
      targets: music,
      volume: 0.4,
      duration: 1000,
    })

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

    let scoreText: Phaser.GameObjects.BitmapText
    if (typeof prevScore === 'number') {
      scoreText = this.add
        .bitmapText(w / 2, 580, 'gem', `Score: ${prevScore}`)
        .setOrigin(0.5)
        .setFontSize(64)
    }

    let started = false
    const onStart = () => {
      if (started) return
      this.sound.play('harvest', { rate: 0.4 })
      started = true
      this.tweens.add({ targets: music, volume: 0, duration: 1000 })
      this.cameras.main.fade(1000, 155, 212, 195, true, (_: any, b: number) => {
        if (b === 1) {
          music.stop()
          this.scene.start('GameScene')
        }
      })
    }

    const onClickTopButton = () => {
      onStart()
    }
    const onClickBottomButton = () => {
      if (scoreText) scoreText.destroy()
      if (helpTextIndex < HELP_TEXT.length) {
        playButton.text = ''
        helpButton.text = 'Next'
        helpText.text = HELP_TEXT[helpTextIndex++]
        this.sound.play('seed')
        if (helpTextIndex === HELP_TEXT.length) helpButton.text = 'Start'
      } else {
        onStart()
      }
    }

    const helpText = this.add
      .bitmapText(w / 2, h / 2 + 120, 'gem', '')
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
  `Plant crops as fast
as you can and harvest
when they are ripe.`,
  `Make sure you swing
hard enough to harvest,
but be careful!`,
  `You start with a
minute and gain 5 seconds
for every 1000 points.`,
  `You get a score
multiplier based on how
cleanly you harvest.`,
  `Good Luck!`,
  `Concept & Code: Dan Whiffing
Art: Cup Nooble
Music: purpleplanet.com`,
]
