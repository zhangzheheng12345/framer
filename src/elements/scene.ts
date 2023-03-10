import Two from 'two.js'
import type { Element, ElementInitFunc } from '.'

export class Scene {
  constructor(elements?: Array<ElementInitFunc>) {
    this.elements = elements? elements: []
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
