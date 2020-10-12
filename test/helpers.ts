export function resolveAfter<T> (value: T, ms: number) {
  return () => new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(value)
    }, ms)
  })
}
