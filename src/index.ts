import Two from 'two.js'
import { Vector } from 'two.js/src/vector'
import { LastItemInMap, MergeDefault, TransitionValue } from './utils'

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

function TransitionRect(start: Rect, end: Rect, progress: number): Rect {
  return {
    fill: start.fill,
    stroke: start.stroke,
    position: {
      x: TransitionValue(start.position.x, end.position.x, progress),
      y: TransitionValue(start.position.y, end.position.y, progress)
    },
    scale: {
      x: TransitionValue(start.scale.x, end.scale.x, progress),
      y: TransitionValue(start.scale.y, end.scale.y, progress)
    },
    width: TransitionValue(start.width, end.width, progress),
    height: TransitionValue(start.height, end.height, progress)
  }
}

export function createRect(
  start: Partial<Rect>,
  animation?: Partial<Animation<Rect>>
): ElementInitFunc {
  const completeStart = CompleteRectStyle(start)
  const completeAnimation = animation
    ? CompleteAnimation(animation, completeStart)
    : CompleteAnimation({}, completeStart)
  return (twoCtx: Two): Element => {
    const rect = twoCtx.makeRectangle(
      completeStart.position.x,
      completeStart.position.y,
      completeStart.width,
      completeStart.height
    )
    return {
      render: (progress: number) => {
        let nextFrame = completeAnimation.frames.get(1) as Rect
        let nextKey = 1
        for (let key of completeAnimation.frames.keys()) {
          if (key > progress) {
            nextKey = key
            nextFrame = completeAnimation.frames.get(key) as Rect
            break
          }
        }
        const lastKey = LastItemInMap(completeAnimation.frames, nextKey)
        const lastFrame = completeAnimation.frames.get(lastKey) as Rect
        const transitionFrame = TransitionRect(
          lastFrame,
          nextFrame,
          completeAnimation.speedCurve(
            (progress - lastKey) / (nextKey - lastKey)
          )
        )
        rect.fill = transitionFrame.fill
        rect.stroke = transitionFrame.stroke
        rect.position.set(transitionFrame.position.x, transitionFrame.position.y)
        rect.width = transitionFrame.width
        rect.height = transitionFrame.height
        rect.scale = new Vector(
          transitionFrame.scale.x,
          transitionFrame.scale.y
        )
      },
      duration: completeAnimation.duration,
      delay: completeAnimation.delay
    }
  }
}

interface Animation<T> {
  duration: number // 0 => static
  delay: number
  frames: Map<number, T>
  speedCurve: (origin: number) => number
}

function CompleteAnimation<T>(base: Partial<Animation<T>>, startFrame: T): Animation<T> {
  let mid = MergeDefault(
    {
      duration: 0,
      delay: 0,
      frames: new Map(),
      speedCurve: (origin: number) => origin // linear
    },
    base
  )
  // add default 0 & 1 frame if there's no defined
  if (!mid.frames.has(0)) mid.frames.set(0, startFrame)
  if (!mid.frames.has(1)) {
    mid.frames.set(1, mid.frames.get(LastItemInMap(mid.frames, 1)))
  }
  return mid
}
