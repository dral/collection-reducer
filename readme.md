# collection-reducer

A simple redux reducer generator for managing collections.

## Example

```js
import collectionReducer, {itemSelectors, prefixFilter, actionsFilter} from '.';

// Consider a standard reducer for your item's state
const counter = (state = 0, action) => {
  switch (action.type) {
    case "COUNTER_START":
      return 0;
    case "COUNTER_ADD":
      return state + 1;
    case "COUNTER_MINUS":
      return state - 1;
    case "COUNTER_DELETE":
      return undefined;
    default:
      return state;
  }
}

// ... and the selectors to access the state's data
const counterSelectors = {
  get: state => state,
}

// `collectionReducer` takes a reducer that will be used for each
// element in the collection
// and a filter on which actions to pass
const counterCollection = collectionReducer(
  counter,
  actionsFilter(  // pass only these action types
    "COUNTER_START",
    "COUNTER_ADD",
    "COUNTER_MINUS",
    "COUNTER_DELETE",
  )
);

// alternativelly
const counterCollection = collectionReducer(
  counter,
  prefixFilter("COUNTER_") // pass all actions that begin with the given prefix.
);

// Actions passed to this reducer must include an `id` property.
// If the individual item's reducer returns `undefined` for a given
// action the item is removed from the collection.

// `itemSelectors` transform each selector for use in the collection adding
// an id argument to it.
const selectors = itemSelectors(counterSelectors);

// Instead of accessing an individual item's state using
counterSelectors.get(state);
// you can use the new selector for an item by it's id
selectors.get(state, id);

// `itemSelector` adds a special selector called `allIds` to get an array
// of all item's ids in the collection
selectors.allIds(state);
```
