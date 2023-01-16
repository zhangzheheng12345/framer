import Two from 'two.js'
import { MergeDefault, TransitionValue } from '../utils'
import { Transition, CompleteAnimation } from '../animation'
import { BasicStyle, defaultBasicStyle } from './basic'
import type {
  Element,
  ElementInitFunc,
  ElementCompleteFunc,
  ElementTransitionFunc
} from '.'
import type { PartialAnimation } from '../animation'

export interface Rect extends BasicStyle {
  width: number
  height: number
}

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
