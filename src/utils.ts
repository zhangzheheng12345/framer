export function MergeDefault<T>(default_: T, user: Partial<T>): T {
  return { ...default_, ...user }
}

export function TransitionValue(
  start: number,
  end: number,
  progress: number
): number {
  return start + (end - start) * progress
}

export function LastItemInMap<T>(map: Map<number, T>, up: number): number {
  let last = 0
  for (let [key, _] of map) {
    if (key > last && key < up) last = key
  }
  return last
}
