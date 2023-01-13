export function MergeDefault<T>(default_: T, user: Partial<T>): T {
  let res = default_
  let key: keyof T
  for (key in default_) {
    if (user[key]) res[key] = user[key] as T[keyof T]
  }
  return res
}
