import Phaser from 'phaser'

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#74c7ae',
  physics: {
    default: 'matter',
    matter: { debug: false, gravity: { y: 3 } },
  },
  pixelArt: true,
  scale: {
    width: 1280,
    height: 960,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}
