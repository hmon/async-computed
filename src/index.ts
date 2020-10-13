import { computed, ref, ComputedRef } from 'vue-demi'
import PromiseQueue from 'src/PromiseQueue'
import { Ref, UnwrapRef } from '@vue/composition-api'

export interface Option<T, U> {
  get: AsyncGetter<T>
  default?: U
  onError?: (error: any) => any
}

export type AsyncGetter<T> = () => Promise<T>
export type AsyncComputedRef<T, U> = ComputedRef<T | U> & {
  retry?: () => void
}

function asyncComputed<T> (getter: AsyncGetter<T>): AsyncComputedRef<T, null>
function asyncComputed<T = any, U = null> (option: Option<T, U>): AsyncComputedRef<T, U>
function asyncComputed<T = any, U = null> (getterOrOption: AsyncGetter<T> | Option<T, U>): AsyncComputedRef<T, U> {
  let getter: AsyncGetter<T>
  let defaultValue: U
  let onError = (error) => {
    console.error(error)
  }

  if (typeof getterOrOption === 'function') {
    getter = getterOrOption
    defaultValue = null
  } else {
    getter = getterOrOption.get
    defaultValue = 'default' in getterOrOption
      ? getterOrOption.default
      : null
    onError = getterOrOption.onError || onError
  }

  const state = ref<any>(defaultValue)

  // Make handler Computed to track dependencies
  // It's also lazy
  const computedRef = computed(getter)

  // Use promise queue to execute in order
  const queue = new PromiseQueue<T>((promise) => {
    return promise
      .then((value) => {
        state.value = value
      })
      .catch(onError)
  })

  // Watch for dependency changes and leverage computed's lazy mechanism
  const comp: AsyncComputedRef<T, U> = computed(() => {
    queue.push(computedRef.value)
    return state.value
  })
  comp.retry = () => {
    queue.push(getter())
  }

  return comp
}

export default asyncComputed
