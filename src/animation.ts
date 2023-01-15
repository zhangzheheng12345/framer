import { MergeDefault, LastItemInMap } from './utils'
import type { ElementCompleteFunc, ElementTransitionFunc } from './elements'

export interface Animation<T> {
  duration: number // 0 => static
  delay: number
  frames: Map<number, T>
  speedCurve: (origin: number) => number
}

export interface PartialAnimation<T> {
  duration?: number
  delay?: number
  frames?: Map<number, Partial<T>>
  speedCurve?: (origin: number) => number
}

export function CompleteAnimation<T>(
  base: PartialAnimation<T>,
  startFrame: T,
  elementCompleteFunc: ElementCompleteFunc<T>
): Animation<T> {
  let mid = MergeDefault(
    {
      duration: 0,
      delay: 0,
      frames: new Map(),
      speedCurve: (origin: number) => origin // linear
    },
    base
  )
  mid.frames.forEach((key, value) => {
    mid.frames.set(key, elementCompleteFunc(value))
  })
  // add default 0 & 1 frame if there's no defined
  if (!mid.frames.has(0)) mid.frames.set(0, startFrame)
  if (!mid.frames.has(1)) {
    mid.frames.set(1, mid.frames.get(LastItemInMap(mid.frames, 1)))
  }
  return mid
}

export function Transition<T>(
  animation: Animation<T>,
  progress: number,
  elementTrasitionFunc: ElementTransitionFunc<T>
): T {
  let nextFrame = animation.frames.get(1) as T
  let nextKey = 1
  for (let key of animation.frames.keys()) {
    if (key > progress) {
      nextKey = key
      nextFrame = animation.frames.get(key) as T
      break
    }
  }
  const lastKey = LastItemInMap(animation.frames, nextKey)
  const lastFrame = animation.frames.get(lastKey) as T
  return elementTrasitionFunc(
    lastFrame,
    nextFrame,
    animation.speedCurve((progress - lastKey) / (nextKey - lastKey))
  )
}
