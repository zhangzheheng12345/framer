import { createRect, Render, Scene } from '.'

const scene = new Scene().addElement(
  createRect({ x: 0, y: 0, width: 100, height: 100 }, { duration: 0, delay: 0 })
)

const render = new Render(
  document.getElementById('canvas') as HTMLElement,
  scene
)

render.play()
