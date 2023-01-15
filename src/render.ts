import Two from 'two.js'
import { Scene } from './elements'

export class Render {
  constructor(canvas: HTMLElement, scene: Scene) {
    this.two = new Two({
      domElement: canvas
    })
    this.scene = scene
    this.domElement = canvas
  }
  play() {
    const elements = this.scene.getRenderList(this.two)
    let clock = 0
    this.two.bind('update', () => {
      elements.map((element) => {
        element.render(
          element.duration === 0
            ? 0
            : element.delay === 0
            ? (clock % element.duration) / element.duration
            : clock <= element.delay
            ? 0
            : ((clock - element.delay) % element.duration) / element.duration
        )
      })
      clock += 60
    })
    this.two.play()
  }
  stop() {
    this.two.pause()
  }
  domElement: HTMLElement
  private two: Two
  private scene: Scene
}
