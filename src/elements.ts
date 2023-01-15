import Two from 'two.js'
import { MergeDefault, TransitionValue } from './utils'
import { CompleteAnimation, PartialAnimation, Transition } from './animation'
import type { Animation } from './animation'

export type ElementRenderFunc = (clock: number) => void
export type ElementInitFunc = (twoCtx: Two) => Element

export interface Element {
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

export type ElementCompleteFunc<T> = (base: Partial<T>) => T

const CompleteRectStyle: ElementCompleteFunc<Rect> = (base) => {
  return MergeDefault(
    {
      ...defaultBasicStyle,
      width: 100,
      height: 100
    },
    base
  )
}

export type ElementTransitionFunc<T> = (start: T, end: T, progress: number) => T

const TransitionRect: ElementTransitionFunc<Rect> = (start, end, progress) => {
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
  animation?: PartialAnimation<Rect>
): ElementInitFunc {
  const completeStart = CompleteRectStyle(start)
  const completeAnimation = animation
    ? CompleteAnimation(animation, completeStart, CompleteRectStyle)
    : CompleteAnimation({}, completeStart, CompleteRectStyle)
  return (twoCtx: Two): Element => {
    const rect = twoCtx.makeRectangle(
      completeStart.position.x,
      completeStart.position.y,
      completeStart.width,
      completeStart.height
    )
    return {
      render: (progress: number) => {
        const transitionFrame = Transition(
          completeAnimation,
          progress,
          TransitionRect
        )
        rect.fill = transitionFrame.fill
        rect.stroke = transitionFrame.stroke
        rect.position.set(
          transitionFrame.position.x,
          transitionFrame.position.y
        )
        rect.width = transitionFrame.width
        rect.height = transitionFrame.height
        rect.scale = new Two.Vector(
          transitionFrame.scale.x,
          transitionFrame.scale.y
        )
      },
      duration: completeAnimation.duration,
      delay: completeAnimation.delay
    }
  }
}
