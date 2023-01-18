import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    outputDiffMaxSize: 100000000
  }
})