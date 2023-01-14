import { createRect, Render, Scene } from '.'

const scene = new Scene().addElement(createRect({ width: 200, height: 200 }))

const render = new Render(
  document.getElementById('canvas') as HTMLElement,
  scene
)

render.play()
