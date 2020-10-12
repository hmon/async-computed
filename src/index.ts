import { computed, Ref, ref, watch } from 'vue-demi'

export interface Option<T, U> {
  get: AsyncGetter<T>
  default?: U
  onError?: (error: any) => any
}
export type AsyncGetter<T> = () => Promise<T>
export type AsyncComputedRef<T, U> = Ref<T | U>

function asyncComputed<T> (getter: AsyncGetter<T>): AsyncComputedRef<T, null>
function asyncComputed<T = any, U = null> (option: Option<T, U>): AsyncComputedRef<T, U>
function asyncComputed<T = any, U = null> (getterOrOption: AsyncGetter<T> | Option<T, U>): AsyncComputedRef<T, U> {
  let getter: AsyncGetter<T>
  let defaultValue: U
  let onError = (error) => {}

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

  const state = ref(defaultValue) as AsyncComputedRef<T, U>

  // Make handler Computed to track dependencies
  const computedRef = computed(getter)

  // Watch for dependency changes or immediate value
  watch(computedRef, (promise) => {
    promise
      .then((value) => {
        state.value = value
      })
      .catch(onError)
  }, {
    immediate: true
  })

  return state
}

export default asyncComputed
