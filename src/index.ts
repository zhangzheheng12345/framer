import Two from 'two.js'
import Vector from 'two.js'

export class Render {
  constructor(canvas: HTMLElement, scene: Scene) {
    this.two = new Two({
      domElement: canvas
    })
    this.scene = scene
  }
  play(): Promise<() => void> {
    return new Promise(() => {
      const elements = this.scene.getRenderList(this.two)
      let clock = 0
      this.two.bind('update', () => {
        elements.map((element) =>
          element.render(
            element.animation.duration === 0
              ? 0 // static
              : element.animation.delay === 0
              ? clock % element.animation.duration
              : clock <= element.animation.delay
              ? 0
              : (clock - element.animation.delay) % element.animation.duration
          )
        )
        clock += 60
      })
      this.two.play()
    })
  }
  stop() {
    this.two.pause()
  }
  two: Two
  private scene: Scene
}

type ElementRenderFunc = (clock: number) => void
type ElementInitFunc = (twoCtx: Two) => Element

interface Element {
  render: ElementRenderFunc
  animation: Animation
}

export class Scene {
  constructor() {
    this.elements = []
  }
  addElement(element: ElementInitFunc): Scene {
    this.elements.push(element)
    return this // Support chain
  }
  getRenderList(twoCtx: Two): Array<Element> {
    return this.elements.map((element) => element(twoCtx))
  }
  private elements: Array<ElementInitFunc>
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function createRect(base: Rect, animation: Animation): ElementInitFunc {
  return (twoCtx: Two): Element => {
    const rect = twoCtx.makeRectangle(base.x, base.y, base.width, base.height)
    return {
      render: (clock: number) => {
        rect.fill = '#000'
        rect.position.set(base.x, base.y)
      },
      animation
    }
  }
}

interface Animation {
  duration: number // 0 => static
  delay: number
}
