import { ref } from 'vue'
import asyncComputed from '../src'
import { mount } from '@vue/test-utils'
import { resolveAfter } from './helpers'
import { computed } from 'vue-demi'


test('increments after one second', async () => {
  // initial state
  const state = ref(0)

  const asyncGetter = jest.fn(resolveAfter(state.value + 1, 1000))

  const num = asyncComputed(asyncGetter)

  // Lazy
  expect(asyncGetter).not.toBeCalled()

  expect(num.value).toBe(null)

  expect(asyncGetter).toBeCalledTimes(1)

  // Wait for promise to resolve
  await asyncGetter.mock.results[0].value

  expect(num.value).toBe(1)

  expect(asyncGetter).toBeCalledTimes(1)
})


test('react to dependency change', async () => {
  // initial state
  const state = ref(0)

  const asyncGetter = jest.fn(
    () => {
      state.value
      return new Promise(resolve => {
        setTimeout(() => resolve(state.value + 1), 10)
      })
    }
  )

  const num = asyncComputed(asyncGetter)

  // Increment state
  state.value++

  expect(num.value).toBe(null)

  expect(asyncGetter).toBeCalledTimes(1)

  await new Promise(resolve => {
    setTimeout(() => {
      expect(num.value).toBe(2)
      resolve()
    }, 15)
  })

  //
  // // The component to test
  // const TestingComponent = {
  //   template: '<p>{{ num }}</p>',
  //   setup () {
  //     // increment after one second
  //     const num = asyncComputed<number>(asyncGetter)
  //
  //     return {
  //       num
  //     }
  //   }
  // }
  // // mount() returns a wrapped Vue component we can interact with
  // const wrapper = mount(TestingComponent)
  //
  // // Assert the rendered text of the component
  // expect(wrapper.text()).toContain('')
  //
  // // Async getter should be called once
  // expect(asyncGetter).toBeCalledTimes(1)
  //
  // /
  //
  // // Wait for vue to render
  // await new Promise(resolve => {
  //   wrapper.vm.$nextTick(() => {
  //     expect(wrapper.text()).toContain('1')
  //     resolve()
  //   })
  // })
  //
  // // Increment state
  // state.value++
  //
  // expect(asyncGetter).toBeCalledTimes(2)
  //
  // await new Promise(resolve => {
  //   wrapper.vm.$nextTick(() => {
  //     expect(wrapper.text()).toContain('2')
  //     resolve()
  //   })
  // })
})
