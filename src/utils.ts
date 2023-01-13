export function MergeDefault<T>(default_: T, user: Partial<T>): T {
  return {...default_, ...user}
}
