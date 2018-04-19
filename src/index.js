export const prefixFilter = (PREFIX) => (type) => type.startsWith(PREFIX);
export const actionsFilter = (...actionsTypes) => (type) => actionsTypes.includes(type)
/**
 */

const reducer = (itemReducer, filterActionType) => (state = {}, action) => {
  const { type, id } = action;
  if (filterActionType(type) && id) {
    let newState = {...state};
    let newItemState = itemReducer(state[id], action);
    if (newItemState !== undefined) {
      return {
        ...newState,
        [id]: itemReducer(state[id], action),
      };
    } else {
      delete newState[id];
      return newState;
    }
  }
  return state;
}

export default reducer;

const itemSelector = (selector) => (state, ...args) => {
  const [id, ...rest] = args;
  const itemState = state[id];
  if (itemState !== undefined)
    return selector(itemState, ...rest);
  return undefined;
};

export const itemSelectors = (selectors) => {
  const result = {
    allIds: state => Object.keys(state),
  };
  Object.keys(selectors).forEach(key => {
    result[key] = itemSelector(selectors[key]);
  });
  return result;
};
