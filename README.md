# historical

`historical` is a library of drop-in replacements for native JavaScript data structures that have been modified to record a history of the mutations they have seen. These data structures can be used for debugging how data got to a certain state, and could even be leveraged for time-travel debugging.

## HMap

An `HMap` is a replacement for a JavaScript `Map`.

**TypeScript**

```ts
import { HMap } from '@awmottaz/historical/HMap';

const m = new HMap<string, number>();
m.set('one', 1);
m.set('two', 2);
m.set('three', 3);
m.delete('one');
m.clear();
```

**JavaScript**

```js
import { HMap } from '@awmottaz/historical/HMap';

const m = new HMap();
m.set('one', 1);
m.set('two', 2);
m.set('three', 3);
m.delete('one');
m.clear();
```

All of the mutation history of the `HMap` object is saved internally and accessible via the `.history` property. The output of `m.history` in this example would be:

```js
[
  {
    "action": "set",
    "args": ["one", 1],
    "dataBefore": [],
    "dataAfter": [ ["one", 1] ],
    "timestamp": 37.77617900073528
  },
  {
    "action": "set",
    "args": ["two", 2],
    "dataBefore": [ ["one", 1] ],
    "dataAfter": [
      ["one", 1],
      ["two", 2]
    ],
    "timestamp": 37.79919400066137
  },
  {
    "action": "set",
    "args": ["three", 3],
    "dataBefore": [
      ["one", 1],
      ["two", 2]
    ],
    "dataAfter": [
      ["one", 1],
      ["two", 2],
      ["three", 3]
    ],
    "timestamp": 37.80457499995828
  },
  {
    "action": "delete",
    "args": ["one"],
    "dataBefore": [
      ["one", 1],
      ["two", 2],
      ["three", 3]
    ],
    "dataAfter": [
      ["two", 2],
      ["three", 3]
    ],
    "timestamp": 37.8447650000453
  },
  {
    "action": "clear",
    "args": [],
    "dataBefore": [
      ["two", 2],
      ["three", 3]
    ],
    "dataAfter": [],
    "timestamp": 37.875222001224756
  }
]
```
