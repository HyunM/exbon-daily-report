import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

let store;

const initialState = {
  updateQueue: [],
  deleteQueue: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADDUPDATEQUEUE":
      const queue = [...state.updateQueue, action.addUpdateQueue];

      const filterArray = queue.filter((item, index) => {
        if (queue.indexOf(item) == index) return item;
      });
      return {
        ...state,
        updateQueue: filterArray,
      };
    case "ADDDELETEQUEUE":
      return {
        ...state,
        deleteQueue: [...state.deleteQueue, action.addDeleteQueue],
      };
    case "INITIALIZEUPDATEQUEUE":
      return {
        ...state,
        updateQueue: initialState.updateQueue,
      };
    case "INITIALIZEDELETEQUEUE":
      return {
        ...state,
        deleteQueue: initialState.deleteQueue,
      };

    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  );
}

export const initializeStore = preloadedState => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
