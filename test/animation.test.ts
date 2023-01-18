import {test, expect} from 'vitest'

import {CompleteAnimation} from '../src/animation'
import type {Animation, PartialAnimation} from '../src/animation'

import { defaultBasicStyle, CompleteBasicStyle } from '../src/elements/basic'
import type {BasicStyle} from '../src/elements'

test('Test CompleteAnimation', () => {
  const input1: PartialAnimation<BasicStyle> = {}
  const expected1: Animation<BasicStyle> = {
    duration: 0,
    delay: 0,
    speedCurve: (origin: number) => origin,
    frames: new Map([
      [0, defaultBasicStyle],
      [1, defaultBasicStyle]
    ])
  }
  expect(CompleteAnimation(input1, defaultBasicStyle, CompleteBasicStyle)).toEqual(expected1)
})