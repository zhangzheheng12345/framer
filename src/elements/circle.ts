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

export interface Circle extends BasicStyle {
  radius: number
}

const CompleteCircleStyle: ElementCompleteFunc<Circle> = (base) => {
  return MergeDefault(
    {
      ...defaultBasicStyle,
      radius: 50
    },
    base
  )
}

const TransitionCircle: ElementTransitionFunc<Circle> = (
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
    radius: TransitionValue(start.radius, end.radius, progress)
  }
}

export function createCircle(
  start: Partial<Circle>,
  animation?: PartialAnimation<Circle>
): ElementInitFunc {
  const completeStart = CompleteCircleStyle(start)
  const completeAnimation = animation
    ? CompleteAnimation(animation, completeStart, CompleteCircleStyle)
    : CompleteAnimation({}, completeStart, CompleteCircleStyle)
  return (twoCtx: Two): Element => {
    const circle = twoCtx.makeCircle(
      completeStart.position.x,
      completeStart.position.y,
      completeStart.radius
    )
    return {
      render: (progress: number) => {
        const transitionFrame = Transition(
          completeAnimation,
          progress,
          TransitionCircle
        )
        circle.fill = transitionFrame.fill
        circle.stroke = transitionFrame.stroke
        circle.position.set(
          transitionFrame.position.x,
          transitionFrame.position.y
        )
        circle.radius = transitionFrame.radius
        circle.scale = new Two.Vector(
          transitionFrame.scale.x,
          transitionFrame.scale.y
        )
      },
      duration: completeAnimation.duration,
      delay: completeAnimation.delay
    }
  }
}
