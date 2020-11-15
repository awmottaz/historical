import { cloneDeep } from "lodash";
import { Performance, DOMHighResTimeStamp } from "w3c-hr-time";
import { StrictExtract } from "./types";

const performance = new Performance();

/**
 * An HArrayMutation is a record of data mutation in the HArray.
 */
export interface HArrayMutation<T> {
  /** Records which action initiated the mutation. */
  action: StrictExtract<
    keyof Array<T>,
    | "copyWithin"
    | "fill"
    | "pop"
    | "push"
    | "reverse"
    | "shift"
    | "sort"
    | "splice"
    | "unshift"
  >;

  /**
   * The list of arguments passed to the mutation method. For example, after a call to
   * `push(value)`, the `args` of the latest mutation will be `[value]`.
   */
  args: unknown[];

  /**
   * A high-resolution timestamp of when the mutation occurred. Useful for merging the histories of
   * multiple data structures.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
   */
  timestamp: DOMHighResTimeStamp;

  /** A frozen copy of the array before executing the mutation. */
  dataBefore: Readonly<Array<T>>;

  /** A frozen copy of the array after executing the mutation. */
  dataAfter: Readonly<Array<T>>;

  /** Additional information provided about the mutation. */
  remark?: string;
}

/**
 * HArray is a drop-in replacement for Array that additionally tracks all mutations to the data
 * stored in the HArray, accessible via the new `.history` instance property.
 */
export class HArray<T> extends Array<T> {
  /** Stores the history of mutations to the Array. */
  readonly #history: Array<HArrayMutation<T>> = [];

  /** The current history of mutations to this `HArray` object. */
  get history(): Readonly<Array<HArrayMutation<T>>> {
    return this.#history.map((h) => Object.freeze(h));
  }

  /**
   * Creates an array from an array-like object.
   * @param arrayLike An array-like object to convert to an array.
   */
  static from<T>(arrayLike: ArrayLike<T>): HArray<T>;
  /**
   * Creates an array from an iterable object.
   * @param arrayLike An array-like object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  static from<T, U>(
    arrayLike: ArrayLike<T>,
    mapfn: (v: T, k: number) => U,
    thisArg?: unknown
  ): HArray<U>;
  static from<T, U = T>(
    arrayLike: ArrayLike<T>,
    mapfn?: (v: T, k: number) => U,
    thisArg?: unknown
  ): HArray<T> | HArray<U> {
    return mapfn
      ? new HArray<U>(...Array.from<T, U>(arrayLike, mapfn, thisArg))
      : new HArray<T>(...Array.from<T>(arrayLike));
  }

  /**
   * Returns a new array from a set of elements.
   * @param items A set of elements to include in the new array object.
   */
  static of<T>(...items: T[]): HArray<T> {
    return new HArray<T>(...items);
  }

  /**
   * Returns `true` if the argument is an HArray, or `false` otherwise.
   */
  static isHArray(arg: unknown): boolean {
    return arg instanceof HArray;
  }

  /**
   * Returns the this object after copying a section of the array identified by start and end
   * to the same array starting at position target
   * @param target If target is negative, it is treated as length+target where length is the
   * length of the array.
   * @param start If start is negative, it is treated as length+start. If end is negative, it
   * is treated as length+end.
   * @param end If not specified, length of the this object is used as its default value.
   */
  copyWithin(target: number, start: number, end?: number): this {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    Array.prototype.copyWithin.call(this, target, start, end);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "copyWithin",
      args: [target, start, end],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return this;
  }

  /**
   * Returns the this object after filling the section identified by start and end with value
   * @param value value to fill array section with
   * @param start index to start filling the array at. If start is negative, it is treated as
   * length+start where length is the length of the array.
   * @param end index to stop filling the array at. If end is negative, it is treated as
   * length+end.
   */
  fill(value: T, start?: number, end?: number): this {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    Array.prototype.fill.call(this, value, start, end);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "fill",
      args: [value, start, end],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return this;
  }

  /**
   * Removes the last element from an array and returns it.
   */
  pop(): T | undefined {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    const retVal = Array.prototype.pop.call(this);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "pop",
      args: [],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return retVal;
  }

  /**
   * Appends new elements to an array, and returns the new length of the array.
   * @param items New elements of the Array.
   */
  push(...items: T[]): number {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    const retVal = Array.prototype.push.call(this, ...items);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "push",
      args: [...items],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return retVal;
  }

  /**
   * Reverses the elements in an Array.
   */
  reverse(): T[] {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    const retVal = Array.prototype.reverse.call(this);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "reverse",
      args: [],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return retVal;
  }

  /**
   * Removes the first element from an array and returns it.
   */
  shift(): T | undefined {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    const retVal = Array.prototype.shift.call(this);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "shift",
      args: [],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return retVal;
  }

  /**
   * Sorts an array.
   * @param compareFn Function used to determine the order of the elements. It is expected to return
   * a negative value if first argument is less than second argument, zero if they're equal and a positive
   * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
   * ```ts
   * [11,2,22,1].sort((a, b) => a - b)
   * ```
   */
  sort(compareFn?: (a: T, b: T) => number): this {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    Array.prototype.sort.call(this, compareFn);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "sort",
      args: [],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return this;
  }

  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param start The zero-based location in the array from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   */
  splice(start: number, deleteCount?: number): T[];
  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param start The zero-based location in the array from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @param items Elements to insert into the array in place of the deleted elements.
   */
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[] {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    const retVal = Array.prototype.splice.call(
      this,
      start,
      deleteCount,
      ...items
    );
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "splice",
      args: [start, deleteCount, ...items],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return retVal;
  }

  /**
   * Inserts new elements at the start of an array.
   * @param items  Elements to insert at the start of the Array.
   */
  unshift(...items: T[]): number {
    const dataBefore = Object.freeze(cloneDeep(this.slice()));
    const retVal = Array.prototype.unshift.call(this, ...items);
    const dataAfter = Object.freeze(cloneDeep(this.slice()));

    this.#history.push({
      action: "unshift",
      args: [...items],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
    });

    return retVal;
  }
}
