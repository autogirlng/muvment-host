import type { AppStore } from "./store";

let clientStore: AppStore | undefined;

/** Lets non-React code (e.g. axios interceptors) read the latest Redux token. */
export function registerClientStore(store: AppStore) {
  clientStore = store;
}

export function getClientStore(): AppStore | undefined {
  return clientStore;
}
