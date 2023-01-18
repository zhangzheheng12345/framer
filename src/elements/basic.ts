import { ElementCompleteFunc } from "."
import { MergeDefault } from "../utils"

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

export const defaultBasicStyle: BasicStyle = {
  fill: '#000',
  stroke: '#000',
  position: { x: 0, y: 0 },
  scale: { x: 0, y: 0 }
}

export const CompleteBasicStyle: ElementCompleteFunc<BasicStyle> = (base) => { // For testing
  return MergeDefault(defaultBasicStyle, base)
}