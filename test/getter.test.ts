import { ref } from 'vue'
import asyncComputed from '../src'
import { mount } from '@vue/test-utils'

test('increments after one second', async () => {
  const promise = jest.fn()

  // The component to test
  const TestingComponent = {
    template: '<p>{{ num }}</p>',
    setup () {
      // initial state
      const state = ref(0)

      // increment after one second
      const num = asyncComputed<number>(promise.mockImplementation(() => new Promise(resolve => {
        setTimeout(resolve, 1000, state.value + 1)
      })))

      return {
        num
      }
    }
  }
  // mount() returns a wrapped Vue component we can interact with
  const wrapper = mount(TestingComponent)

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('')

  // Async getter should be called once
  expect(promise).toBeCalledTimes(1)

  // Wait for promise to resolve
  await promise.mock.results[0].value

  // Wait for vue to render
  await new Promise(resolve => {
    wrapper.vm.$nextTick(() => {
      expect(wrapper.text()).toContain('1')
      resolve()
    })
  })
})


test('react to dependency change', async () => {
  // initial state
  const state = ref(0)

  const promise = jest.fn().mockImplementation(() => new Promise(resolve => {
    setTimeout(resolve, 1000, state.value + 1)
  }))

  // The component to test
  const TestingComponent = {
    template: '<p>{{ num }}</p>',
    setup () {
      // increment after one second
      const num = asyncComputed<number>(promise)

      return {
        num
      }
    }
  }
  // mount() returns a wrapped Vue component we can interact with
  const wrapper = mount(TestingComponent)

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('')

  // Async getter should be called once
  expect(promise).toBeCalledTimes(1)

  // Increment state
  state.value++

  // Async getter should be called again
  expect(promise).toBeCalledTimes(2)

  // Wait for promise to resolve
  await promise.mock.results[0].value

  // Wait for vue to render
  await new Promise(resolve => {
    wrapper.vm.$nextTick(() => {
      expect(wrapper.text()).toContain('1')
      resolve()
    })
  })
})
