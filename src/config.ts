import Phaser from 'phaser'

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#74c7ae',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  pixelArt: true,
  scale: {
    width: 1280,
    height: 960,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}
