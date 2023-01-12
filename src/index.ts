import Two from 'two.js'
import Vector from 'two.js'


export type Vec = Vector

export class Render {
  constructor(canvas: HTMLElement, scene: Scene) {
    this.two = new Two({
      domElement: canvas
    })
    this.scene = scene
  }
  play(): Promise<() => void> {
    return new Promise(()=>{
      const elements = this.scene.getRenderList(this.two)
      let clock = 0
      this.two.bind('update', () => {
        elements.map((element) => element.render(element.duration === 0?0:clock%element.duration))
        clock += 60
      })
    })
  }
  stop() {
    this.two.pause()
  }
  private two: Two
  private scene: Scene
}

type ElementRenderFunc = (clock: number) => void
type ElementInitFunc = (twoCtx: Two) => Element

interface Element {
  render: ElementRenderFunc
  duration: number // 0 => static
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

export function Rect(x: number, y: number, width: number, height: number, duration: number): ElementInitFunc {
  return (twoCtx: Two): Element => {
    const rect = twoCtx.makeRectangle(x, y, width, height)
    return { render: (clock: number) => {
      rect.position.set(x, y)
    }, duration: duration}
  }
}