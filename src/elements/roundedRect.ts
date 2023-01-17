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

export interface RoundedRect extends BasicStyle {
  width: number
  height: number
  radius: number
}

const CompleteRoundedRectStyle: ElementCompleteFunc<RoundedRect> = (base) => {
  return MergeDefault(
    {
      ...defaultBasicStyle,
      width: 100,
      height: 100,
      radius: 10
    },
    base
  )
}

const TransitionRoundedRect: ElementTransitionFunc<RoundedRect> = (
  start,
  end,
  progress
) => {
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
    height: TransitionValue(start.height, end.height, progress),
    radius: TransitionValue(start.radius, end.radius, progress)
  }
}

export function createRoundedRect(
  start: Partial<RoundedRect>,
  animation?: PartialAnimation<RoundedRect>
): ElementInitFunc {
  const completeStart = CompleteRoundedRectStyle(start)
  const completeAnimation = animation
    ? CompleteAnimation(animation, completeStart, CompleteRoundedRectStyle)
    : CompleteAnimation({}, completeStart, CompleteRoundedRectStyle)
  return (twoCtx: Two): Element => {
    const rect = twoCtx.makeRoundedRectangle(
      completeStart.position.x,
      completeStart.position.y,
      completeStart.width,
      completeStart.height,
      completeStart.radius
    )
    return {
      render: (progress: number) => {
        const transitionFrame = Transition(
          completeAnimation,
          progress,
          TransitionRoundedRect
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
        // rect.radius = transitionFrame.radius
      },
      duration: completeAnimation.duration,
      delay: completeAnimation.delay
    }
  }
}
