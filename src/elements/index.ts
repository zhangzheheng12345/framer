import Two from 'two.js'

export interface Element {
  render: ElementRenderFunc
  duration: number
  delay: number
}

export type ElementRenderFunc = (clock: number) => void
export type ElementInitFunc = (twoCtx: Two) => Element

export type ElementCompleteFunc<T> = (base: Partial<T>) => T
export type ElementTransitionFunc<T> = (start: T, end: T, progress: number) => T

export { Scene } from './scene'
export type {BasicStyle} from './basic'
export { createRect } from './rect'
export { createRoundedRect } from './roundedRect'
export { createCircle } from './circle'
