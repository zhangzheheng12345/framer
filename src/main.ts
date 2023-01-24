import { createRect, Render, Scene } from '.'

const scene = new Scene().addElement(
  createRect(
    { width: 200, height: 200 },
    { duration: 1000, frames: new Map([[1, { position: { x: 10, y: 10 } }]]) }
  )
)

const render = new Render(
  document.getElementById('canvas') as HTMLElement,
  scene,
  {
    fullscreen: true
  }
)

render.play()
