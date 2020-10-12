import PromiseQueue from '../src/PromiseQueue'
import { resolveAfter } from './helpers'

test('should call handler once', async () => {
  const handler = jest.fn().mockImplementation(value => value)
  const promise = jest.fn()
    .mockResolvedValue(0)

  const queue = new PromiseQueue<number>(handler)
  await queue.push(promise())
  expect(handler).toBeCalledTimes(1)
  const returnedVal = await handler.mock.results[0].value
  expect(returnedVal).toEqual(0)
})

test('promise rejection', async () => {
  const handler = jest.fn().mockImplementation(value => value)
  const rejection = Promise.reject(new Error())
  const promise = jest.fn()
    .mockImplementation(() => rejection)

  const queue = new PromiseQueue<number>(handler)
  await queue.push(promise())
  expect(handler).toBeCalledTimes(1)
  expect(handler.mock.results[0].value).toEqual(rejection)
  try {
    await handler.mock.results[0].value
  } catch (e) {
    expect(e).toBeDefined()
  }
})

test('should resolve in order of execution', async () => {
  const handler = jest.fn().mockImplementation(value => value)
  const promise = jest.fn()
    .mockImplementationOnce(resolveAfter(0, 5))
    .mockImplementationOnce(resolveAfter(1, 1))
    .mockImplementationOnce(resolveAfter(2, 20))
    .mockImplementationOnce(resolveAfter(3, 6))
    .mockImplementationOnce(resolveAfter(4, 10))
    .mockImplementationOnce(resolveAfter(5, 50))

  const queue = new PromiseQueue<number>(handler)
  const wait = queue.push(promise())
  queue.push(promise())
  queue.push(promise())
  queue.push(promise())
  queue.push(promise())
  queue.push(promise())
  await wait

  expect(handler).toBeCalledTimes(6)
  for (const index in handler.mock.results) {
    if (Object.prototype.hasOwnProperty.call(handler.mock.results, index)) {
      expect(await handler.mock.results[index].value).toEqual(Number(index))
    }
  }
})
