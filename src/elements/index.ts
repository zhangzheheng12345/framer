import Two from 'two.js'

export type ElementRenderFunc = (clock: number) => void
export type ElementInitFunc = (twoCtx: Two) => Element

export interface Element {
  render: ElementRenderFunc
  duration: number
  delay: number
}



export type ElementCompleteFunc<T> = (base: Partial<T>) => T
export type ElementTransitionFunc<T> = (start: T, end: T, progress: number) => T

export {Scene} from './scene'
export {createRect} from './rect'