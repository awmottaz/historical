import { Performance, DOMHighResTimeStamp } from "w3c-hr-time";

const performance = new Performance();

/**
 * An HMapMutation is a record of data mutation in the HMap.
 */
export interface HMapMutation<K, V> {
  /** Records which action initiated the mutation. */
  action: "set" | "delete" | "clear";

  /**
   * The list of arguments passed to the mutation method. For example, after a call to
   * `set(key, value)`, the `args` of the latest mutation will be `[key, value]`.
   */
  args: unknown[];

  /**
   * A high-resolution timestamp of when the mutation occurred. Useful for merging the histories of
   * multiple data structures.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
   */
  timestamp: DOMHighResTimeStamp;

  /** A frozen copy of the output to `entries()` before executing the mutation. */
  dataBefore: Readonly<Array<[K, V]>>;

  /** A frozen copy of the output to `entries()` after executing the mutation. */
  dataAfter: Readonly<Array<[K, V]>>;
}

/**
 * HMap is a drop-in replacement for Map that additionally tracks all mutations to the data stored
 * in the HMap, accessible via the new `.history` instance property.
 */
export class HMap<K, V> implements Map<K, V> {
  /** The internal Map that backs the HMap implementation. */
  readonly #map: Map<K, V>;

  /** Stores the history of mutations to the underlying Map. */
  readonly #history: Array<HMapMutation<K, V>> = [];

  /**
   * @param entries optionally provide initial values to the HMap as an array of key-value pairs.
   */
  constructor(entries?: ReadonlyArray<readonly [K, V]> | null) {
    this.#map = new Map<K, V>(entries);
  }

  /** The current history of mutations to this `HMap` object. */
  get history(): Readonly<Array<HMapMutation<K, V>>> {
    return this.#history.map((h) => Object.freeze(h));
  }

  /** Returns the number of key/value pairs in the `HMap` object. */
  get size(): number {
    return this.#map.size;
  }

  /**
   * Returns a new Iterator object that contains an array of [key, value] for each element in the
   * Map object in insertion order.
   */
  get [Symbol.iterator](): () => IterableIterator<[K, V]> {
    return this.#map[Symbol.iterator];
  }

  get [Symbol.toStringTag](): string {
    return "HMap";
  }

  /**
   * Returns a new `Iterator` object that contains the keys for each element in the `HMap` object
   * in insertion order.
   */
  keys(): IterableIterator<K> {
    return this.#map.keys();
  }

  /**
   * Returns a new `Iterator` object that contains the values for each element in the `HMap` object
   * in insertion order.
   */
  values(): IterableIterator<V> {
    return this.#map.values();
  }

  /**
   * Returns a new `Iterator` object that contains an array of `[key, value]` for each element in
   * the `HMap` object in insertion order.
   */
  entries(): IterableIterator<[K, V]> {
    return this.#map.entries();
  }

  /** Removes all key-value pairs from the `HMap` object. */
  clear(): void {
    const dataBefore = Object.freeze(Array.from(this.#map.entries()));
    this.#map.clear();
    const dataAfter = Object.freeze(Array.from(this.#map.entries()));

    this.#history.push({
      action: "clear",
      args: [],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });
  }

  /**
   * Returns `true` if an element in the `HMap` object existed and has been removed, or `false` if
   * the element does not exist. `HMap.prototype.has(key)` will return `false` afterwards.
   *
   * @param key The key of the element to remove from the `HMap` object.
   */
  delete(key: K): boolean {
    const dataBefore = Object.freeze(Array.from(this.#map.entries()));
    const retVal = this.#map.delete(key);
    const dataAfter = Object.freeze(Array.from(this.#map.entries()));

    this.#history.push({
      action: "delete",
      args: [key],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return retVal;
  }

  /**
   * Calls `callbackfn` once for each key-value pair present in the `HMap` object, in insertion
   * order. If a `thisArg` parameter is provided to `forEach`, it will be used as the `this` value
   * for each callback.
   */
  forEach(
    callbackfn: (value: V, key: K, map: HMap<K, V>) => void,
    thisArg?: unknown
  ): void {
    this.#map.forEach((v, k, m) => callbackfn(v, k, m as HMap<K, V>), thisArg);
  }

  /**
   * Returns the value associated to the `key`, or `undefined` if there is none.
   *
   * @param key The key of the element to return from the `HMap` object.
   * @returns The element associated with the specified key, or `undefined` if the key can't be
   * found in the `HMap` object.
   */
  get(key: K): V | undefined {
    return this.#map.get(key);
  }

  /**
   * Returns a boolean asserting whether a value has been associated to the `key` in the `HMap`
   * object or not.
   *
   * @param key The key of the element to test for presence in the `HMap` object.
   * @returns `true` if an element with the specified key exists in the `HMap` object; otherwise
   * `false`.
   */
  has(key: K): boolean {
    return this.#map.has(key);
  }

  /**
   * Sets the `value` for the `key` in the `HMap` object. Returns the `HMap` object.
   *
   * @param key The key of the element to add to the `HMap` object.
   * @param value The value of the element to add to the `HMap` object.
   * @returns The `HMap` object.
   */
  set(key: K, value: V): this {
    const dataBefore = Object.freeze(Array.from(this.#map.entries()));
    this.#map.set(key, value);
    const dataAfter = Object.freeze(Array.from(this.#map.entries()));

    this.#history.push({
      action: "set",
      args: [key, value],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return this;
  }
}
