export interface ICrop {
  x: number
  y: number
  age: number
  scoreMulti: number
  ageRate: number
  timeline: Phaser.Tweens.Timeline
  index: number
  maxAge: number
  type: string | null
  alive: boolean
  tile: Phaser.Tilemaps.Tile
}
