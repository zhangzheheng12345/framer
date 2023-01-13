import Two from 'two.js'

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
  }
  stop() {
    this.two.pause()
  }
  domElement: HTMLElement
  private two: Two
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

export interface BasicStyle {
  fill: string
  stroke: string
  position: {
    x: number
    y: number
  }
}

export interface Rect extends BasicStyle {
  width: number
  height: number
}

function CompleteRectStyle(base: Partial<Rect>): Rect {
  return {
    fill: base.fill ? base.fill : '#000',
    stroke: base.stroke ? base.stroke : '#fff',
    position: base.position ? base.position : { x: 0, y: 0 },
    width: base.width ? base.width : 100,
    height: base.height ? base.height : 100
  }
}

export function createRect(
  start: Partial<Rect>,
  animation: Animation
): ElementInitFunc {
  const completedStart = CompleteRectStyle(start)
  return (twoCtx: Two): Element => {
    const rect = twoCtx.makeRectangle(
      completedStart.position.x,
      completedStart.position.y,
      completedStart.width,
      completedStart.height
    )
    return {
      render: (clock: number) => {
        rect.fill = completedStart.fill
        rect.stroke = completedStart.stroke
        rect.position.set(completedStart.position.x, completedStart.position.y)
      },
      animation
    }
  }
}

interface Animation {
  duration: number // 0 => static
  delay: number
}
