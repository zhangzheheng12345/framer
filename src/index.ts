import Two from 'two.js'
import { Vector } from 'two.js/src/vector'
import { MergeDefault } from './utils'

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
            ? clock % element.duration
            : clock <= element.delay
            ? 0
            : (clock - element.delay) % element.duration
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

type ElementRenderFunc = (clock: number) => void
type ElementInitFunc = (twoCtx: Two) => Element

interface Element {
  render: ElementRenderFunc
  duration: number
  delay: number
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
  scale: {
    x: number
    y: number
  }
}

const defaultBasicStyle = {
  fill: '#000',
  stroke: '#000',
  position: { x: 0, y: 0 },
  scale: { x: 0, y: 0 }
}

export interface Rect extends BasicStyle {
  width: number
  height: number
}

function CompleteRectStyle(base: Partial<Rect>): Rect {
  return MergeDefault(
    {
      ...defaultBasicStyle,
      width: 100,
      height: 100
    },
    base
  )
}

export function createRect(
  start: Partial<Rect>,
  animation?: Partial<Animation<Rect>>
): ElementInitFunc {
  const completedStart = CompleteRectStyle(start)
  const completeAnimation = animation
    ? CompleteAnimation(animation)
    : CompleteAnimation({})
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
        rect.width = completedStart.width
        rect.height = completedStart.height
        rect.scale = new Vector(completedStart.scale.x, completedStart.scale.y)
      },
      duration: completeAnimation.duration,
      delay: completeAnimation.delay
    }
  }
}

interface Animation<T> {
  duration: number // 0 => static
  delay: number
  frames: Array<T>
}

function CompleteAnimation<T>(base: Partial<Animation<T>>): Animation<T> {
  return MergeDefault(
    {
      duration: 0,
      delay: 0,
      frames: []
    },
    base
  )
}
