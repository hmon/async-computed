type Handler<T> = (value: T) => Promise<any>

export default class PromiseQueue<T> {
  private list: Promise<T>[] = []
  private _pending = false

  constructor (private readonly handler: Handler<Promise<T>>) {}

  private async loop () {
    const head = this.list.shift()
    if (head === undefined) return

    try {
      await this.handler(head)
    } catch (e) {}

    return this.loop()
  }

  private async iterate () {
    if (this._pending) return
    this._pending = true
    await this.loop()
    this._pending = false
    return
  }

  public push (...items: Promise<T>[]) {
    this.list.push(...items)
    return this.iterate()
  }
}
