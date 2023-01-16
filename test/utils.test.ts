import { test, expect } from 'vitest'

import { MergeDefault, TransitionValue } from '../src/utils'

test('Test MergeDefault', () => {
  const input = {
    a: 1,
    b: 1
  }
  const default_ = {
    a: 0,
    b: 0,
    c: 0
  }
  const expected = {
    a: 1,
    b: 1,
    c: 0
  }
  expect(MergeDefault(default_, input)).toEqual(expected)
})

test('Test TransitionValue', () => {
  expect(TransitionValue(1, 2, 0.8)).toBe(1.8)
})
