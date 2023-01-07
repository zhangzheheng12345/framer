import type {Options} from 'tsup'

export const tsup: Options = {
  entry: ['src/index.ts'],
  dts: true,
  splitting: true,
  clean: true
}