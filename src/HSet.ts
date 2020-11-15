import { Performance, DOMHighResTimeStamp } from "w3c-hr-time";
import { StrictExtract } from "./types";

const performance = new Performance();

/**
 * An HSetMutation is a record of data mutation in the HSet.
 */
export interface HSetMutation<T> {
  /** Records which action initiated the mutation. */
  action: StrictExtract<keyof Set<T>, "add" | "clear" | "delete">;

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
  dataBefore: Readonly<Array<T>>;

  /** A frozen copy of the output to `entries()` after executing the mutation. */
  dataAfter: Readonly<Array<T>>;

  /** Additional information provided about the mutation. */
  remark: string | null;
}

/**
 * HSet is a drop-in replacement for Map that additionally tracks all mutations to the data stored
 * in the HSet, accessible via the new `.history` instance property.
 */
export class HSet<T> extends Set<T> {
  /** Stores the history of mutations to the Map. */
  private readonly _history: Array<HSetMutation<T>> = [];
  private _remark: string | null = null;

  /** The current history of mutations to this `HSet` object. */
  get history(): Readonly<Array<HSetMutation<T>>> {
    return this._history.map((h) => Object.freeze(h));
  }

  /**
   * Adds a remark comment to the next mutation record in history.
   * @param comment the comment to include in the next history entry.
   * @returns this
   * @example
   * const s = new HSet<number>();
   * s.remark('adding a one').add(1);
   * s.history[0].remark // "adding a one"
   */
  remark(comment: string): this {
    this._remark = comment;
    return this;
  }

  /**
   * Appends a new element with a specified value to the end of a HSet object.
   * @param value the value to add to the HSet
   * @returns this HSet object
   */
  add(value: T): this {
    const dataBefore = Object.freeze(Array.from(this.values()));
    Set.prototype.add.call(this, value);
    const dataAfter = Object.freeze(Array.from(this.values()));

    this._history?.push({
      action: "add",
      args: [value],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
      remark: this._remark,
    });
    this._remark = null;

    return this;
  }

  /**
   * Returns `true` if an element in the `HSet` object existed and has been removed, or `false` if
   * the element does not exist. `HSet.prototype.has(key)` will return `false` afterwards.
   *
   * @param value The key of the element to remove from the `HSet` object.
   */
  delete(value: T): boolean {
    const dataBefore = Object.freeze(Array.from(this.values()));
    const retVal = Set.prototype.delete.call(this, value);
    const dataAfter = Object.freeze(Array.from(this.values()));

    this._history?.push({
      action: "delete",
      args: [value],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
      remark: this._remark,
    });
    this._remark = null;

    return retVal;
  }

  /**
   * Removes all elements from a `HSet` object.
   */
  clear(): void {
    const dataBefore = Object.freeze(Array.from(this.values()));
    Set.prototype.clear.call(this);
    const dataAfter = Object.freeze(Array.from(this.values()));

    this._history?.push({
      action: "clear",
      args: [],
      dataBefore,
      dataAfter,
      timestamp: performance.now(),
      remark: this._remark,
    });
    this._remark = null;
  }
}
