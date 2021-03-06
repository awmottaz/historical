import { Performance, DOMHighResTimeStamp } from 'w3c-hr-time'
import { StrictExtract } from './types'

const performance = new Performance()

/**
 * An HMapMutation is a record of data mutation in the HMap.
 */
export interface HMapMutation<K, V> {
  /** Records which action initiated the mutation. */
  action: StrictExtract<keyof Map<K, V>, 'set' | 'delete' | 'clear'>

  /**
   * The list of arguments passed to the mutation method. For example, after a call to
   * `set(key, value)`, the `args` of the latest mutation will be `[key, value]`.
   */
  args: unknown[]

  /**
   * A high-resolution timestamp of when the mutation occurred. Useful for merging the histories of
   * multiple data structures.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
   */
  timestamp: DOMHighResTimeStamp

  /** A frozen copy of the output to `entries()` before executing the mutation. */
  dataBefore: Readonly<Array<[K, V]>>

  /** A frozen copy of the output to `entries()` after executing the mutation. */
  dataAfter: Readonly<Array<[K, V]>>

  /** Additional information provided about the mutation. */
  remark: string | null
}

/**
 * HMap is a drop-in replacement for Map that additionally tracks all mutations to the data stored
 * in the HMap, accessible via the new `.history` instance property.
 */
export class HMap<K, V> extends Map<K, V> {
  /** Stores the history of mutations to the Map. */
  private readonly _history: Array<HMapMutation<K, V>> = []
  private _remark: string | null = null

  /** The current history of mutations to this `HMap` object. */
  get history (): Readonly<Array<HMapMutation<K, V>>> {
    return this._history.map((h) => Object.freeze(h))
  }

  /**
   * Adds a remark comment to the next mutation record in history.
   * @param comment the comment to include in the next history entry.
   * @returns this
   * @example
   * const s = new HMap<number, string>();
   * s.remark('hello world').set(1, 'one');
   * s.history[0].remark // "hello world"
   */
  remark (comment: string): this {
    this._remark = comment
    return this
  }

  /**
   * Sets the `value` for the `key` in the `HMap` object. Returns the `HMap` object.
   *
   * @param key The key of the element to add to the `HMap` object.
   * @param value The value of the element to add to the `HMap` object.
   * @param remark Add a comment to the history entry for this operation.
   * @returns The `HMap` object.
   */
  set (key: K, value: V): this {
    const dataBefore = Object.freeze(Array.from(this.entries()))
    Map.prototype.set.call(this, key, value)
    const dataAfter = Object.freeze(Array.from(this.entries()))

    this._history?.push({
      action: 'set',
      args: [key, value],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
      remark: this._remark
    })
    this._remark = null

    return this
  }

  /**
   * Returns `true` if an element in the `HMap` object existed and has been removed, or `false` if
   * the element does not exist. `HMap.prototype.has(key)` will return `false` afterwards.
   *
   * @param key The key of the element to remove from the `HMap` object.
   * @param remark Add a comment to the history entry for this operation.
   */
  delete (key: K): boolean {
    const dataBefore = Object.freeze(Array.from(this.entries()))
    const retVal = Map.prototype.delete.call(this, key)
    const dataAfter = Object.freeze(Array.from(this.entries()))

    this._history.push({
      action: 'delete',
      args: [key],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
      remark: this._remark
    })
    this._remark = null

    return retVal
  }

  /**
   * Removes all key-value pairs from the `HMap` object.
   *
   * @param remark Add a comment to the history entry for this operation.
   */
  clear (): void {
    const dataBefore = Object.freeze(Array.from(this.entries()))
    Map.prototype.clear.call(this)
    const dataAfter = Object.freeze(Array.from(this.entries()))

    this._history.push({
      action: 'clear',
      args: [],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
      remark: this._remark
    })
    this._remark = null
  }
}
