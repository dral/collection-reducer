import collectionReducer, {itemSelectors, prefixFilter, actionsFilter} from '.';

const counter = (state = 0, action) => {
  switch (action.type) {
    case "COUNTER_START":
    case "COUNTER_RESET":
      return 0;
    case "COUNTER_ADD":
      return state + 1;
    case "COUNTER_MINUS":
      return state - 1;
    case "COUNTER_DELETE":
      return undefined;
    default:
      // return state;
      // this is just to test that only selected actions are passed to item reducers.
      return undefined;
  }
}

let actionTypes = [
  "COUNTER_START",
  "COUNTER_RESET",
  "COUNTER_ADD",
  "COUNTER_MINUS",
  "COUNTER_DELETE",
]

const counterSelectors = {
  get: state => state,
}

const counterCollection = collectionReducer(counter, actionsFilter(...actionTypes));

const selectors = itemSelectors(counterSelectors);

test('adds new items as required', () => {
  let state0 = {};

  let state1 = counterCollection(state0, {
    type: "COUNTER_START",
    id: "1"
  });

  expect(state1).toEqual({
    "1": 0
  });
});

test('applies item reducer on selected element only', () => {
  let state0 = {};

  let state1 = counterCollection(state0, {
    type: "COUNTER_START",
    id: "1",
  });

  let state2 = counterCollection(state1, {
    type: "COUNTER_START",
    id: "2",
  });

  expect(state2).toEqual({
    "1": 0,
    "2": 0,
  });

  let state3 = counterCollection(state2, {
    type: "COUNTER_ADD",
    id: "2",
  });

  expect(state3).toEqual({
    "1": 0,
    "2": 1,
  });
});

test('selector retrieves selected item state', () => {
  let state0 = {};

  let state1 = counterCollection(state0, {
    type: "COUNTER_START",
    id: "1",
  });

  let state2 = counterCollection(state1, {
    type: "COUNTER_START",
    id: "2",
  });

  let state3 = counterCollection(state2, {
    type: "COUNTER_ADD",
    id: "2",
  });
  expect(selectors.allIds(state3)).toEqual(["1", "2"]);
  expect(selectors.get(state3, "1")).toEqual(0);
  expect(selectors.get(state3, "2")).toEqual(1);
});

test('all ids reflect the actual items in the collection', () => {
  let state0 = {};

  let state1 = counterCollection(state0, {
    type: "COUNTER_START",
    id: "1",
  });

  let state2 = counterCollection(state1, {
    type: "COUNTER_START",
    id: "2",
  });

  let state3 = counterCollection(state2, {
    type: "COUNTER_DELETE",
    id: "1",
  });

  expect(selectors.allIds(state0)).toEqual([]);
  expect(selectors.allIds(state1)).toEqual(["1"]);
  expect(selectors.allIds(state2)).toEqual(["1", "2"]);
  expect(selectors.allIds(state3)).toEqual(["2"]);
})

test('deletes element from collection only when reducer returns undefined', () => {
  let state0 = {};

  let state1 = counterCollection(state0, {
    type: "COUNTER_START",
    id: "1",
  });

  let state2 = counterCollection(state1, {
    type: "COUNTER_START",
    id: "2",
  });

  let state3 = counterCollection(state2, {
    type: "COUNTER_ADD",
    id: "2",
  });

  let state4 = counterCollection(state3, {
    type: "COUNTER_DELETE",
    id: "1",
  });

  expect(state4).toEqual({
    "2": 1,
  });
  expect(selectors.allIds(state4)).toEqual(["2"]);
});

test('passes only selected actions', () => {
  let state0 = {};

  let state1 = counterCollection(state0, {
    type: "COUNTER_START",
    id: "1",
  });

  let state2 = counterCollection(state1, {
    type: "COUNTER_START",
    id: "2",
  });

  let state3 = counterCollection(state2, {
    type: "COUNTER_DO_THING",
    id: "2",
  });

  expect(state3).toEqual(state2);
})

test('attempt to use a selector on an item not in the collection should return undefined', () => {
  let state0 = {};

  let state1 = counterCollection(state0, {
    type: "COUNTER_START",
    id: "1",
  });

  expect(selectors.get(state1, "2")).toBe(undefined);
})
